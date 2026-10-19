import { Box3, Object3D, Vector3 } from 'three';

export function normalizeVehicle(vehicle: Object3D, targetLength = 4.8): Box3 {
  let bounds = new Box3().setFromObject(vehicle);
  const initialSize = bounds.getSize(new Vector3());
  if (initialSize.x < initialSize.z) vehicle.rotation.y = Math.PI / 2;
  vehicle.updateMatrixWorld(true);

  bounds = new Box3().setFromObject(vehicle);
  const size = bounds.getSize(new Vector3());
  vehicle.scale.multiplyScalar(targetLength / Math.max(size.x, size.z));
  vehicle.updateMatrixWorld(true);

  bounds = new Box3().setFromObject(vehicle);
  const center = bounds.getCenter(new Vector3());
  vehicle.position.x -= center.x;
  vehicle.position.y -= bounds.min.y;
  vehicle.position.z -= center.z;
  vehicle.updateMatrixWorld(true);
  return new Box3().setFromObject(vehicle);
}