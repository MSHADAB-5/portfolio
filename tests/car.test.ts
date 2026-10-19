import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { normalizeVehicle } from '../src/gl/model';

const modelFile = new URL('../public/models/amg-one.glb', import.meta.url);
const bytes = readFileSync(modelFile);
const poster = readFileSync(new URL('../public/models/amg-one-poster.png', import.meta.url));
const jsonLength = bytes.readUInt32LE(12);
const document = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength)) as {
  asset: { version: string; extras: Record<string, string> };
  extensionsUsed: string[];
  buffers: { uri?: string }[];
  images: { uri?: string }[];
};

describe('AMG ONE model asset', () => {
  it('is a complete self-contained glTF 2.0 binary', () => {
    expect(bytes.toString('ascii', 0, 4)).toBe('glTF');
    expect(bytes.readUInt32LE(4)).toBe(2);
    expect(bytes.readUInt32LE(8)).toBe(bytes.length);
    expect(bytes.readUInt32LE(16)).toBe(0x4e4f534a);
    expect(document.asset.version).toBe('2.0');
    expect([...document.buffers, ...document.images].some((resource) => resource.uri)).toBe(false);
  });

  it('retains model provenance and supported material extensions', () => {
    expect(document.asset.extras.author).toContain('Ddiaz Design');
    expect(document.asset.extras.source).toContain('sketchfab.com/3d-models/2023-mercedes-benz-amg-one');
    expect(document.asset.extras.license).toContain('CC-BY-NC-SA-4.0');
    expect(document.extensionsUsed).toEqual(expect.arrayContaining([
      'KHR_materials_specular',
      'KHR_materials_clearcoat',
      'KHR_materials_transmission',
    ]));
  });

  it('ships a valid local PNG poster for static fallback states', () => {
    expect(poster.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(poster.readUInt32BE(16)).toBeGreaterThan(0);
    expect(poster.readUInt32BE(20)).toBeGreaterThan(0);
  });

  it('normalizes the longest axis and places the vehicle on the ground', () => {
    const vehicle = new Group();
    const mesh = new Mesh(new BoxGeometry(2, 1, 4), new MeshBasicMaterial());
    mesh.position.set(3, 2, -1);
    vehicle.add(mesh);

    const bounds = normalizeVehicle(vehicle);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    expect(size.x).toBeCloseTo(4.8);
    expect(bounds.min.y).toBeCloseTo(0);
    expect(center.x).toBeCloseTo(0);
    expect(center.z).toBeCloseTo(0);

    mesh.geometry.dispose();
    mesh.material.dispose();
  });
});
