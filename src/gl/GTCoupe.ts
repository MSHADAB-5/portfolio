import {
  BoxGeometry, BufferGeometry, CatmullRomCurve3, CylinderGeometry, ExtrudeGeometry,
  Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial,
  MeshStandardMaterial, Shape, TorusGeometry, TubeGeometry, Vector3,
} from 'three';

function loft(profile: number[][], cabin = false) {
  const curve = new CatmullRomCurve3(profile.map(([x, y, width]) => new Vector3(x, y, width)));
  const positions: number[] = [];
  const indices: number[] = [];
  const slices = 64;
  const sides = 32;
  for (let i = 0; i <= slices; i++) {
    const sample = curve.getPoint(i / slices);
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * Math.PI * 2;
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      const z = Math.sign(s) * Math.pow(Math.abs(s), .7) * sample.z;
      const belt = cabin ? .87 : .53;
      let y = c >= 0 ? belt + Math.pow(c, .65) * (sample.y - belt) : belt + c * .25;
      // Lift the lower shoulder around the tires to form open wheel arches.
      if (!cabin && Math.abs(s) > .7) {
        const distance = Math.min(Math.abs(sample.x + 1.45), Math.abs(sample.x - 1.45));
        if (distance < .49) y = Math.max(y, .43 + Math.sqrt(.49 ** 2 - distance ** 2));
      }
      positions.push(sample.x, y, z);
      if (i < slices && j < sides) {
        const a = i * (sides + 1) + j;
        const b = a + sides + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  for (const i of [0, slices]) {
    const sample = curve.getPoint(i / slices);
    const center = positions.length / 3;
    positions.push(sample.x, cabin ? .9 : .6, 0);
    for (let j = 0; j < sides; j++) {
      const a = i * (sides + 1) + j;
      if (i === 0) indices.push(center, a + 1, a);
      else indices.push(center, a, a + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Original GT-inspired concept geometry, not an official or licensed vehicle model. */
export function createGTCoupe() {
  const car = new Group();
  car.name = 'GT-inspired concept coupe';
  const paint = new MeshPhysicalMaterial({
    color: '#a8b5c2', metalness: .9, roughness: .19, clearcoat: 1, clearcoatRoughness: .12,
  });
  const dark = new MeshStandardMaterial({ color: '#070b10', metalness: .4, roughness: .3 });
  const chrome = new MeshStandardMaterial({ color: '#b5c4d0', metalness: 1, roughness: .16 });
  const rubber = new MeshStandardMaterial({ color: '#08090b', roughness: .8 });
  const glass = new MeshPhysicalMaterial({ color: '#102032', metalness: .5, roughness: .08, clearcoat: 1 });
  const whiteLed = new MeshBasicMaterial({ color: '#ddf5ff', toneMapped: false });
  const redLed = new MeshBasicMaterial({ color: '#dd2638', toneMapped: false });
  const body = new Mesh(loft([
    [-2.3,.76,.59], [-2.06,.96,.86], [-1.5,1.02,.98], [-.8,.98,.91],
    [.2,.9,.85], [1.25,.91,.96], [1.85,.82,.9], [2.27,.65,.69],
  ]), paint);
  body.name = 'sculpted body';
  car.add(body);
  const cabin = new Mesh(loft([
    [-1.53,1.01,.68], [-1.12,1.29,.68], [-.65,1.46,.64],
    [-.05,1.45,.61], [.48,1.17,.66], [.72,.92,.69],
  ], true), glass);
  car.add(cabin);
  const roof = new Mesh(loft([
    [-.97,1.4,.51], [-.6,1.49,.57], [-.15,1.48,.53], [.1,1.39,.48],
  ], true), paint);
  roof.scale.z = .94;
  car.add(roof);
  // Body-colored window surrounds emphasize the long-hood, rearward-cabin silhouette.
  for (const side of [-1, 1]) {
    const rail = new Mesh(new TubeGeometry(new CatmullRomCurve3([
      new Vector3(-1.5,1.01,side*.67), new Vector3(-.7,1.45,side*.59),
      new Vector3(-.08,1.44,side*.57), new Vector3(.7,.94,side*.7),
    ]), 30, .025, 6, false), chrome);
    car.add(rail);
    const mirror = new Mesh(new BoxGeometry(.2, .09, .16), paint);
    mirror.position.set(.2, 1.04, side * .84);
    car.add(mirror);
    const sill = new Mesh(new BoxGeometry(2.2, .08, .09), dark);
    sill.position.set(0, .31, side * .88);
    car.add(sill);
  }
  const tireGeometry = new TorusGeometry(.325, .105, 12, 40);
  const rimGeometry = new CylinderGeometry(.27, .27, .12, 32);
  rimGeometry.rotateX(Math.PI / 2);
  const spokeGeometry = new BoxGeometry(.035, .48, .035);
  const ringGeometry = new TorusGeometry(.27, .014, 8, 32);
  for (const x of [-1.45, 1.45]) for (const side of [-1, 1]) {
    const wheel = new Group();
    wheel.name = 'wheel';
    wheel.position.set(x, .43, side * .94);
    wheel.add(new Mesh(tireGeometry, rubber));
    const hub = new Mesh(rimGeometry, dark);
    wheel.add(hub);
    for (let spoke = 0; spoke < 5; spoke++) {
      const mesh = new Mesh(spokeGeometry, chrome);
      mesh.rotation.z = spoke * Math.PI / 5;
      mesh.position.z = side * .08;
      wheel.add(mesh);
    }
    const ring = new Mesh(ringGeometry, chrome);
    ring.position.z = side * .09;
    wheel.add(ring);
    car.add(wheel);
  }
  const grille = new Mesh(new BoxGeometry(.055, .31, 1.19), dark);
  grille.position.set(2.29, .48, 0);
  car.add(grille);
  const slatGeometry = new BoxGeometry(.025, .25, .018);
  for (let i = -6; i <= 6; i++) {
    const slat = new Mesh(slatGeometry, chrome);
    slat.position.set(2.325, .48, i * .084);
    car.add(slat);
  }
  const emblem = new Group();
  const star = new Shape();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 3;
    const r = i % 2 === 0 ? .115 : .026;
    if (i === 0) star.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else star.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  star.closePath();
  emblem.add(new Mesh(new ExtrudeGeometry(star, { depth: .008, bevelEnabled: false }), chrome),
    new Mesh(new TorusGeometry(.122, .008, 6, 32), chrome));
  emblem.rotation.y = Math.PI / 2;
  emblem.position.set(2.35, .5, 0);
  car.add(emblem);
  for (const side of [-1, 1]) {
    const light = new Mesh(new BoxGeometry(.055, .035, .32), whiteLed);
    light.position.set(2.18, .76, side * .66);
    light.rotation.y = side * -.2;
    car.add(light);
    const rear = new Mesh(new BoxGeometry(.04, .035, .32), redLed);
    rear.position.set(-2.24, .83, side * .52);
    car.add(rear);
    const vent = new Mesh(new BoxGeometry(.28, .012, .13), dark);
    vent.position.set(1.24, .925, side * .46);
    car.add(vent);
  }
  return car;
}
