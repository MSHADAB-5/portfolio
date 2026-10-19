import {
  AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Group,
  InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, PerspectiveCamera, PlaneGeometry,
  Points, PointsMaterial, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, VignetteEffect } from 'postprocessing';
import vertexShader from './shaders/node.vert.glsl?raw';
import fragmentShader from './shaders/node.frag.glsl?raw';
import { visibleLoop } from '../core/dom';
import { SELF_HEAL_SCENARIOS } from '../data/content';
import { motionQuery, type Quality } from '../core/perf';

export interface InfraScene {
  setProgress: (progress: number) => void;
  dispose: () => void;
}

export async function createInfraCore(canvas: HTMLCanvasElement, quality: Quality): Promise<InfraScene> {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: quality !== 'high', powerPreference: 'low-power' });
  const scene = new Scene();
  const camera = new PerspectiveCamera(39, 1, 0.1, 120);
  const cluster = new Group();
  scene.add(cluster);
  cluster.position.set(5, -1.3, -1);
  cluster.rotation.y = -0.1;
  const geometry = new RoundedBoxGeometry(0.8, 1.12, 0.8, 2, 0.065);
  geometry.setAttribute('nodeId', new InstancedBufferAttribute(Float32Array.from({ length: 112 }, (_, i) => i), 1));
  const uniforms = { uTime: { value: 0 }, uTarget: { value: 47 }, uPhase: { value: 0 } };
  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const nodes = new InstancedMesh(geometry, material, 112);
  const matrix = new Matrix4();
  for (let i = 0; i < 112; i++) {
    matrix.makeTranslation((i % 14 - 6.5) * 1.25, 0.15 * Math.sin(i * 1.7), (Math.floor(i / 14) - 3.5) * 1.4);
    nodes.setMatrixAt(i, matrix);
  }
  cluster.add(nodes);

  const floorMaterial = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: uniforms.uTime },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      void main(){
        vec2 p=(vUv-.5)*40.; vec2 line=abs(fract(p/1.25-.5)-.5)/max(fwidth(p/1.25),vec2(.001));
        float grid=1.-min(min(line.x,line.y),1.);
        float ring=exp(-pow((length(p)-mod(uTime*1.4,24.))*1.8,2.));
        float fade=1.-smoothstep(4.,22.,length(p));
        gl_FragColor=vec4(vec3(.08,.38,.65)+ring*vec3(.1,.4,.6),(grid*.19+ring*.12)*fade);
      }`,
  });
  const floorGeometry = new PlaneGeometry(50, 50);
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.65;
  cluster.add(floor);

  const pointCount = quality === 'high' ? 220 : 70;
  const positions = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    positions[i * 3] = Math.sin(i * 53.3) * 12;
    positions[i * 3 + 1] = Math.sin(i * 9.3) * 3.5;
    positions[i * 3 + 2] = Math.cos(i * 17.7) * 8;
  }
  const pointsGeometry = new BufferGeometry();
  pointsGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const pointsMaterial = new PointsMaterial({
    color: new Color('#64d2ff'), size: 0.025, transparent: true,
    opacity: 0.5, blending: AdditiveBlending, depthWrite: false,
  });
  const points = new Points(pointsGeometry, pointsMaterial);
  cluster.add(points);
  let composer: EffectComposer | undefined;
  if (quality === 'high') {
    composer = new EffectComposer(renderer, { multisampling: 0 });
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera,
      new BloomEffect({ intensity: 0.75, luminanceThreshold: 0.8, mipmapBlur: true }),
      new VignetteEffect({ darkness: 0.4, offset: 0.25 }),
    ));
  }
  let dpr = Math.min(devicePixelRatio, quality === 'high' ? 1.75 : 1.25);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    cluster.position.x = rect.width < 800 ? 1 : 5.8;
    renderer.setPixelRatio(dpr);
    renderer.setSize(rect.width, rect.height, false);
    composer?.setSize(rect.width, rect.height);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  const pointer = new Vector2();
  const onPointer = (event: PointerEvent) => pointer.set(
    (event.clientX / innerWidth - 0.5) * 2, (event.clientY / innerHeight - 0.5) * 2,
  );
  window.addEventListener('pointermove', onPointer, { passive: true });
  let progress = 0;
  let currentCycle = -1;
  let slowFrames = 0;
  const lookAt = new Vector3(0, -0.8, 0);
  const frame = (time: number, delta: number) => {
    if (motionQuery.matches) return;
    uniforms.uTime.value = time;
    const cycle = Math.floor(time / 8);
    const phase = (time % 8) / 8;
    const scenario = SELF_HEAL_SCENARIOS[cycle % SELF_HEAL_SCENARIOS.length]!;
    uniforms.uTarget.value = scenario.nodeId;
    uniforms.uPhase.value = phase;
    const state = phase < .28 ? 'NOMINAL' : phase < .46 ? 'DEGRADED' : phase < .65 ? 'REMEDIATING' : 'RESTORED';
    const key = cycle * 4 + (phase < .28 ? 0 : phase < .46 ? 1 : phase < .65 ? 2 : 3);
    if (key !== currentCycle) {
      currentCycle = key;
      document.dispatchEvent(new CustomEvent('infra:health', { detail: { scenario, state } }));
    }
    camera.position.lerp(new Vector3(
      12 + pointer.x * .5 - progress * 7,
      10 - pointer.y * .4 - progress * 5,
      19 - progress * 11,
    ), 1 - Math.exp(-delta * 4));
    camera.lookAt(lookAt);
    points.position.y = Math.sin(time * .15) * .3;
    if (composer) composer.render(delta);
    else renderer.render(scene, camera);
    if (delta > .034) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 80) {
      composer?.dispose();
      composer = undefined;
      dpr = 1;
      resize();
      slowFrames = 0;
    }
  };
  camera.position.set(12, 10, 19);
  camera.lookAt(lookAt);
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);
  canvas.classList.add('is-ready');
  const stopLoop = visibleLoop(canvas, frame);
  const onContextLoss = (event: Event) => {
    event.preventDefault();
    stopLoop();
    canvas.classList.remove('is-ready');
  };
  canvas.addEventListener('webglcontextlost', onContextLoss);
  return {
    setProgress: (value) => { progress = value; },
    dispose: () => {
      stopLoop();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onContextLoss);
      composer?.dispose();
      geometry.dispose(); material.dispose(); floorGeometry.dispose(); floorMaterial.dispose();
      pointsGeometry.dispose(); pointsMaterial.dispose(); renderer.dispose();
      canvas.classList.remove('is-ready');
    },
  };
}
