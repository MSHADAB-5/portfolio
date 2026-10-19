import {
  ACESFilmicToneMapping, AdditiveBlending, AmbientLight, BufferGeometry, CanvasTexture,
  CylinderGeometry, DirectionalLight, ExtrudeGeometry, Group, Line,
  LineBasicMaterial, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  OrthographicCamera, Path, PMREMGenerator, Scene, Shape, Sprite, SpriteMaterial,
  Vector2, Vector3, WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { visibleLoop } from '../core/dom';
import { finePointer, motionQuery } from '../core/perf';

function outline(size: number, radius: number) {
  const path = new Shape();
  const h = size / 2;
  path.moveTo(-h + radius, -h);
  path.lineTo(h - radius, -h);
  path.quadraticCurveTo(h, -h, h, -h + radius);
  path.lineTo(h, h - radius);
  path.quadraticCurveTo(h, h, h - radius, h);
  path.lineTo(-h + radius, h);
  path.quadraticCurveTo(-h, h, -h, h - radius);
  path.lineTo(-h, -h + radius);
  path.quadraticCurveTo(-h, -h, -h + radius, -h);
  return path;
}

export async function mountAICore(canvas: HTMLCanvasElement, stage: HTMLElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.5, 2.5, 2.5, -2.5, .1, 50);
  camera.position.set(4, 3.4, 5.8);
  camera.lookAt(0, 0, 0);
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.add(new AmbientLight('#cfdeef', 1.8));
  const key = new DirectionalLight('#ffffff', 5);
  key.position.set(-3, 5, 4);
  const rim = new DirectionalLight('#70baff', 4);
  rim.position.set(4, 1, -3);
  scene.add(key, rim);
  const assembly = new Group();
  assembly.rotation.y = -.3;
  scene.add(assembly);
  const silver = new MeshStandardMaterial({ color: '#8a9bad', metalness: .96, roughness: .2 });
  const graphite = new MeshStandardMaterial({ color: '#111c2a', metalness: .8, roughness: .25 });
  const glass = new MeshPhysicalMaterial({
    color: '#9acbed', metalness: .1, roughness: .12, transmission: .55,
    transparent: true, opacity: .5, thickness: .16, ior: 1.46, depthWrite: false,
  });
  const blue = new MeshBasicMaterial({ color: '#71d2ff', toneMapped: false });
  const frameShape = outline(2.35, .23);
  frameShape.holes.push(new Path(outline(2.12, .17).getPoints(48)));
  const frameGeometry = new ExtrudeGeometry(frameShape, { depth: .065, bevelEnabled: true, bevelSize: .018, bevelThickness: .018, bevelSegments: 2, steps: 1 });
  frameGeometry.rotateX(-Math.PI / 2);
  const layers: Group[] = [];
  const plateGeometry = new RoundedBoxGeometry(2.1, .055, 2.1, 2, .05);
  for (let i = 0; i < 3; i++) {
    const layer = new Group();
    layer.add(new Mesh(frameGeometry, i === 0 ? graphite : silver));
    const plate = new Mesh(plateGeometry, i === 0 ? graphite : glass);
    plate.position.y = .01;
    layer.add(plate);
    assembly.add(layer);
    layers.push(layer);
  }
  const pinGeometry = new CylinderGeometry(.035, .035, 1.6, 10);
  for (const x of [-.97, .97]) for (const z of [-.97, .97]) {
    const pin = new Mesh(pinGeometry, silver);
    pin.position.set(x, -.1, z);
    assembly.add(pin);
  }
  const chipGeometry = new RoundedBoxGeometry(.92, .13, .92, 3, .06);
  const chip = new Mesh(chipGeometry, graphite);
  chip.position.y = .15;
  layers[1]!.add(chip);
  const dieGeometry = new RoundedBoxGeometry(.65, .04, .65, 2, .025);
  const die = new Mesh(dieGeometry, new MeshStandardMaterial({
    color: '#102d4b', metalness: .65, roughness: .18, emissive: '#126baa', emissiveIntensity: .35,
  }));
  die.position.y = .24;
  layers[1]!.add(die);
  const traces: Vector3[][] = [];
  const traceMaterial = new LineBasicMaterial({ color: '#6aadc8', transparent: true, opacity: .6 });
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * .14;
      const points = [new Vector3(offset, .08, .42), new Vector3(offset, .08, .62),
        new Vector3(offset * 1.65, .08, .77), new Vector3(offset * 1.65, .08, 1)];
      points.forEach((point) => point.applyAxisAngle(new Vector3(0, 1, 0), side * Math.PI / 2));
      traces.push(points);
      layers[1]!.add(new Line(new BufferGeometry().setFromPoints(points), traceMaterial));
    }
  }
  const packetGeometry = new RoundedBoxGeometry(.035, .02, .085, 1, .008);
  const packets = traces.filter((_, i) => i % 2 === 0).map((path) => {
    const mesh = new Mesh(packetGeometry, blue);
    layers[1]!.add(mesh);
    return { mesh, path };
  });
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 64; glowCanvas.height = 64;
  const ctx = glowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#5daaff88'); gradient.addColorStop(.3, '#2997ff30'); gradient.addColorStop(1, '#2997ff00');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
  const glowTexture = new CanvasTexture(glowCanvas);
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture, blending: AdditiveBlending, transparent: true, depthWrite: false }));
  glow.scale.set(3.2, 3.2, 1);
  glow.position.y = .1;
  assembly.add(glow);
  const pointer = new Vector2();
  let hover = false;
  const move = (e: PointerEvent) => {
    if (!finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    pointer.set((e.clientX - rect.left) / rect.width - .5, (e.clientY - rect.top) / rect.height - .5);
  };
  const enter = () => { hover = true; };
  const leave = () => { hover = false; pointer.set(0, 0); };
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerenter', enter);
  stage.addEventListener('pointerleave', leave);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const aspect = rect.width / Math.max(rect.height, 1);
    camera.left = -2.3 * aspect; camera.right = 2.3 * aspect;
    camera.top = 2.3; camera.bottom = -2.3;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  let spacing = .52;
  const frame = (time: number, delta: number) => {
    spacing += ((hover ? .72 : .52) - spacing) * (1 - Math.exp(-delta * 3));
    layers.forEach((layer, i) => { layer.position.y = (i - 1) * spacing; });
    assembly.rotation.y = -.3 + Math.sin(time * .18) * .24 + pointer.x * .35;
    assembly.rotation.x = pointer.y * .1;
    assembly.position.y = Math.sin(time * .7) * .045;
    packets.forEach(({ mesh, path }, i) => {
      const progress = ((time * .32 + i * .19) % 1) * 3;
      const segment = Math.floor(progress);
      mesh.position.lerpVectors(path[segment]!, path[Math.min(segment + 1, 3)]!, progress - segment);
    });
    glow.material.opacity = .45 + Math.sin(time * 1.2) * .1;
    renderer.render(scene, camera);
  };
  let stop = () => {};
  const dispose = () => {
    stop(); resizeObserver.disconnect();
    stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerenter', enter); stage.removeEventListener('pointerleave', leave);
    const geometries = new Set<BufferGeometry>();
    scene.traverse((node) => {
      if (node instanceof Mesh || node instanceof Line) geometries.add(node.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
    [silver, graphite, glass, blue, traceMaterial, die.material, glow.material].forEach((material) => material.dispose());
    environment.dispose(); glowTexture.dispose(); renderer.dispose();
    stage.classList.remove('is-ready');
  };
  try {
    await renderer.compileAsync(scene, camera);
    if (motionQuery.matches) { dispose(); return () => {}; }
    frame(0, 0);
    stage.classList.add('is-ready');
    stop = visibleLoop(stage, frame);
  } catch {
    dispose();
    return () => {};
  }
  canvas.addEventListener('webglcontextlost', dispose, { once: true });
  return dispose;
}
