import { describe, expect, it } from 'vitest';
import { Mesh } from 'three';
import { createGTCoupe } from '../src/gl/GTCoupe';

describe('procedural GT concept geometry', () => {
  it('builds a four-wheel coupe without external model assets', () => {
    const car = createGTCoupe();
    expect(car.children.filter((node) => node.name === 'wheel')).toHaveLength(4);
    expect(car.getObjectByName('sculpted body')).toBeInstanceOf(Mesh);
  });
  it('produces finite geometry and normals for all sculpted surfaces', () => {
    const car = createGTCoupe();
    car.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      for (const name of ['position', 'normal']) {
        const attribute = node.geometry.getAttribute(name);
        expect(attribute).toBeDefined();
        expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
      }
    });
  });
});
