import {
  ACESFilmicToneMapping, AmbientLight, BoxGeometry, BufferGeometry,
  DirectionalLight, Group, Material, Mesh, MeshStandardMaterial,
  OrthographicCamera, PMREMGenerator, Scene, Texture, Vector2, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { visibleLoop } from '../core/dom';
import { finePointer, motionQuery } from '../core/perf';
import { normalizeVehicle } from './model';

export async function mountFleet(canvas: HTMLCanvasElement, stage: HTMLElement) {
  const vehicle = (await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/amg-one.glb`)).scene;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const scene = new Scene();
  const camera = new OrthographicCamera(-3, 3, 1.35, -1.35, .1, 50);
  camera.position.set(5.5, 2.65, 6.5);
  camera.lookAt(0, .62, 0);
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .035);
  room.dispose(); pmrem.dispose();
  scene.environment = environment.texture;
  scene.add(new AmbientLight('#d5e0ed', 1.35));
  const key = new DirectionalLight('#ffffff', 4.5);
  key.position.set(-3, 5, 4);
  const rim = new DirectionalLight('#87c9f2', 2.2);
  rim.position.set(2, 3, -4);
  const fill = new DirectionalLight('#d89f70', .8);
  fill.position.set(4, 1.5, 2);
  scene.add(key, rim, fill);
  const world = new Group();
  scene.add(world);
  normalizeVehicle(vehicle);
  world.add(vehicle);
  const deck = new Mesh(new BoxGeometry(5.8, .045, 2.8),
    new MeshStandardMaterial({ color: '#090d12', metalness: .52, roughness: .42 }));
  deck.position.y = -.055;
  world.add(deck);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const aspect = rect.width / Math.max(rect.height, 1);
    camera.left = -1.35 * aspect; camera.right = 1.35 * aspect;
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
  let status = '';
  const frame = (time: number) => {
    world.rotation.y = -.22 + Math.sin(time * .16) * .035 + pointer.x * .1;
    world.rotation.x = pointer.y * .018;
    const phase = (time % 8) / 8;
    const state = phase < .25 || phase >= .55
      ? 'ENVIRONMENT HEALTH / NOMINAL' : 'ENVIRONMENT HEALTH / CHECKING';
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
    const materials = new Set<Material>();
    const textures = new Set<Texture>();
    scene.traverse((node) => {
      if (node instanceof Mesh) {
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
        }
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
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
