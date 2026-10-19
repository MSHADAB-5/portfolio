import {
  ACESFilmicToneMapping, AdditiveBlending, AmbientLight, BoxGeometry, BufferGeometry, Color,
  DirectionalLight, DoubleSide, Group, Line, LineBasicMaterial, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, OrthographicCamera, PlaneGeometry, PMREMGenerator, Scene,
  ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGTCoupe } from './GTCoupe';
import { visibleLoop } from '../core/dom';
import { finePointer, motionQuery } from '../core/perf';

export async function mountFleet(canvas: HTMLCanvasElement, stage: HTMLElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new Scene();
  const camera = new OrthographicCamera(-3.5, 3.5, 1.75, -1.75, .1, 50);
  camera.position.set(5.5, 2.8, 6.5);
  camera.lookAt(0, .55, 0);
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .035);
  room.dispose(); pmrem.dispose();
  scene.environment = environment.texture;
  scene.add(new AmbientLight('#c1d0e6', 1.8));
  const key = new DirectionalLight('#ffffff', 5);
  key.position.set(-2, 5, 3);
  const rim = new DirectionalLight('#70b8ed', 3);
  rim.position.set(3, 2, -4);
  scene.add(key, rim);
  const world = new Group();
  scene.add(world);
  const car = createGTCoupe();
  world.add(car);
  const deck = new Mesh(new BoxGeometry(6.2, .055, 3.5),
    new MeshStandardMaterial({ color: '#070c12', metalness: .6, roughness: .35 }));
  deck.position.y = -.08;
  world.add(deck);
  const lineMaterial = new LineBasicMaterial({ color: '#285571', transparent: true, opacity: .45 });
  const networkNodes: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];
  const networkGeometry = new BoxGeometry(.13, .035, .13);
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 9; i++) {
      const x = (i - 4) * .65;
      const z = side * 1.48;
      const material = new MeshBasicMaterial({ color: '#4e9bc5' });
      const node = new Mesh(networkGeometry, material);
      node.position.set(x, -.025, z);
      networkNodes.push(node);
      world.add(node);
      world.add(new Line(new BufferGeometry().setFromPoints([
        new Vector3(x, -.03, z), new Vector3(x, -.03, z * .85),
        new Vector3(x + .2, -.03, z * .65), new Vector3(x + .2, -.03, side * .9),
      ]), lineMaterial));
    }
  }
  const uniforms = { uTime: { value: 0 } };
  const scannerMaterial = new ShaderMaterial({
    uniforms, side: DoubleSide, transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      void main(){
        float edge=pow(abs(vUv.x-.5)*2.,12.);
        float fade=sin(vUv.y*3.14159);
        float stripes=.5+.5*sin(vUv.y*160.-uTime*5.);
        gl_FragColor=vec4(.14,.62,1.,(.025+edge*.19+stripes*.015)*fade);
      }`,
  });
  const scanner = new Mesh(new PlaneGeometry(2.8, 1.8), scannerMaterial);
  scanner.rotation.y = Math.PI / 2;
  scanner.position.y = .8;
  world.add(scanner);
  const scanLine = new Mesh(new BoxGeometry(.022, .012, 3.3), new MeshBasicMaterial({ color: '#63bde9' }));
  scanLine.position.y = -.02;
  world.add(scanLine);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const aspect = rect.width / Math.max(rect.height, 1);
    camera.left = -1.75 * aspect; camera.right = 1.75 * aspect;
    camera.updateProjectionMatrix(); renderer.setSize(rect.width, rect.height, false);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  const pointer = new Vector2();
  const onMove = (e: PointerEvent) => {
    if (!finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    pointer.set((e.clientX - rect.left) / rect.width - .5, (e.clientY - rect.top) / rect.height - .5);
  };
  const onLeave = () => pointer.set(0, 0);
  stage.addEventListener('pointermove', onMove); stage.addEventListener('pointerleave', onLeave);
  const blue = new Color('#4e9bc5');
  const amber = new Color('#ff9f0a');
  const green = new Color('#30d158');
  let status = '';
  const frame = (time: number) => {
    const phase = (time % 7) / 7;
    const x = phase * 6 - 3;
    scanner.position.x = x; scanLine.position.x = x; uniforms.uTime.value = time;
    world.rotation.y = -.25 + Math.sin(time * .16) * .1 + pointer.x * .13;
    world.rotation.x = pointer.y * .025;
    networkNodes.forEach((node, i) => {
      node.material.color.copy(i === 6 ? (phase < .45 ? amber : green) : blue);
      node.material.opacity = .4 + .6 * Math.exp(-((node.position.x - x) ** 2) * 3);
      node.material.transparent = true;
    });
    const state = phase < .25 ? 'DETECTING' : phase < .45 ? 'DIAGNOSING' : phase < .75 ? 'SELF-HEALING' : 'HEALTH RESTORED';
    if (state !== status) {
      status = state;
      const label = stage.querySelector('.fleet-scan-status');
      if (label) label.textContent = state;
    }
    renderer.render(scene, camera);
  };
  let stop = () => {};
  const dispose = () => {
    stop(); resizeObserver.disconnect();
    stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave);
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<MeshBasicMaterial | MeshStandardMaterial | LineBasicMaterial | ShaderMaterial>();
    scene.traverse((node) => {
      if (node instanceof Mesh || node instanceof Line) {
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    environment.dispose(); renderer.dispose(); stage.classList.remove('is-ready');
  };
  try {
    await renderer.compileAsync(scene, camera);
    if (motionQuery.matches) { dispose(); return () => {}; }
    frame(0);
    stage.classList.add('is-ready');
    stop = visibleLoop(stage, frame);
  } catch { dispose(); return () => {}; }
  canvas.addEventListener('webglcontextlost', dispose, { once: true });
  return dispose;
}
