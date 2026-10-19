precision mediump float;
uniform vec2 resolution;
uniform float time;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = uv * 2.0 - 1.0;
  float wave = sin(p.x * 2.5 + sin(p.y * 2.0 + time * .09)) * .18;
  float ribbon = exp(-pow((p.y - wave + .2) * 3.2, 2.0));
  float halo = exp(-length((p - vec2(.35, .15)) * vec2(1.4, 1.6)) * 2.8);
  vec3 color = mix(vec3(.005,.01,.025), vec3(.035,.12,.2), ribbon * .6);
  color += vec3(.015,.08,.12) * halo;
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  color += (noise - .5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}
