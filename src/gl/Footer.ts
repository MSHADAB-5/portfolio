import { visibleLoop } from '../core/dom';
import { motionQuery } from '../core/perf';
import fragmentSource from './shaders/footer.frag.glsl?raw';

export function mountFooter(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const vertexSource = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}';
  const shaders: WebGLShader[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Visual unavailable');
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Visual unavailable');
    return shader;
  };
  const program = gl.createProgram();
  if (!program) return;
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Visual unavailable');
  } catch {
    shaders.forEach((shader) => gl.deleteShader(shader)); gl.deleteProgram(program); return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const timeUniform = gl.getUniformLocation(program, 'time');
  const resolutionUniform = gl.getUniformLocation(program, 'resolution');
  const resize = () => {
    canvas.width = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.25));
    canvas.height = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.25));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const stop = visibleLoop(canvas, (seconds) => {
    if (motionQuery.matches) return;
    gl.uniform1f(timeUniform, seconds);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });
  canvas.addEventListener('webglcontextlost', () => {
    stop(); observer.disconnect(); canvas.style.opacity = '0';
  });
}
