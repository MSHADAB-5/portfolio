attribute float nodeId;
varying vec3 vLocal;
varying vec3 vNormal;
varying vec3 vView;
varying float vId;

void main() {
  vLocal = position;
  vId = nodeId;
  vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
  vView = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
