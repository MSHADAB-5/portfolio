uniform float uTime;
uniform float uTarget;
uniform float uPhase;
varying vec3 vLocal;
varying vec3 vNormal;
varying vec3 vView;
varying float vId;

void main() {
  vec3 normal = normalize(vNormal);
  float fresnel = pow(1.0 - abs(dot(normalize(vView), normal)), 2.8);
  float light = max(dot(normal, normalize(vec3(-0.6, 1.0, 0.8))), 0.0);
  float selected = 1.0 - step(0.1, abs(vId - uTarget));
  vec3 accent = vec3(0.12, 0.55, 1.0);
  if (selected > 0.5) {
    if (uPhase > 0.28 && uPhase < 0.46) accent = vec3(1.0, 0.42, 0.025);
    if (uPhase >= 0.46 && uPhase < 0.65) accent = vec3(1.0, 0.08, 0.035);
    if (uPhase >= 0.65) accent = vec3(0.1, 0.95, 0.36);
  }
  float led = step(0.37, vLocal.y) * step(abs(vLocal.x), 0.25)
    * step(0.32, abs(vLocal.z));
  float vent = step(0.48, fract((vLocal.y + 0.25) * 9.0))
    * step(abs(vLocal.y), 0.32) * step(abs(vLocal.x), 0.26)
    * step(0.35, abs(vLocal.z));
  vec3 metal = vec3(0.045, 0.065, 0.095) * (0.4 + light * 2.6);
  metal += accent * fresnel * (0.22 + selected * 0.4);
  metal *= 1.0 - vent * 0.6;
  float pulse = 0.8 + 0.2 * sin(uTime * 2.0 + vId * 1.7);
  vec3 color = mix(metal, accent * 2.4 * pulse, led);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
