(() => {
  const canvas = document.getElementById('heroNoise');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;
    void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_presence;

    float hash(vec2 p){
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.,0.)), u.x),
                 mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), u.x), u.y);
    }

    float fbm(vec2 p){
      float value = 0.0;
      float weight = 0.5;
      for(int i=0;i<5;i++){
        value += weight * noise(p);
        p = p * 2.03 + vec2(17.0, 9.2);
        weight *= 0.5;
      }
      return value;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 p = (gl_FragCoord.xy - .5 * u_resolution) / min(u_resolution.x, u_resolution.y);
      vec2 mouse = .5 * u_mouse * u_resolution / min(u_resolution.x, u_resolution.y);
      vec2 delta = p - mouse;
      float distanceToMouse = length(delta);
      float rippleMask = u_presence * (1.0 - smoothstep(0.0, .46, distanceToMouse));
      float ripple = sin(distanceToMouse * 38.0 - u_time * 5.0);
      p -= normalize(delta + .0001) * ripple * rippleMask * .032;
      p *= 1.26;
      p += .12 * vec2(sin(u_time * .31), cos(u_time * .23));

      vec2 q = p * 2.45;
      float field = 0.0;
      float weight = .55;
      for(int i=0;i<6;i++){
        float fi = float(i);
        q += vec2(sin(q.y * (1.7 + fi*.09) + u_time*(.35 + fi*.04) + 1.0),
                  cos(q.x * (1.5 + fi*.11) - u_time*(.28 + fi*.03))) * .27;
        field += weight / (.08 + abs(sin(q.x + q.y + fi*.72)));
        weight *= .62;
        q = q.yx * vec2(-1.08, 1.04);
      }

      float glow = 1.0 - exp(-field * .029);
      vec3 black = vec3(.0, .0, .015);
      vec3 blue = vec3(.035, .22, .86);
      vec3 cyan = vec3(.0, .73, 1.0);
      vec3 ice = vec3(.58, .92, 1.0);
      vec3 color = mix(black, blue, smoothstep(.08,.42,glow));
      color = mix(color, cyan, smoothstep(.42,.72,glow));
      color = mix(color, ice, smoothstep(.72,1.0,glow));
      color *= .72 + .28 * smoothstep(1.0, .18, length(uv - .5));
      color += (hash(gl_FragCoord.xy + u_time) - .5) * .035;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const time = gl.getUniformLocation(program, 'u_time');
  const mouse = gl.getUniformLocation(program, 'u_mouse');
  const presence = gl.getUniformLocation(program, 'u_presence');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let targetPresence = 0, currentPresence = 0;
  let frameId = 0, visible = true;
  const startedAt = performance.now();

  function resize(){
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    const width = Math.max(1, Math.round(bounds.width * dpr));
    const height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function render(now){
    frameId = 0;
    if (!visible || document.hidden) return;
    resize();
    currentX += (targetX - currentX) * .1;
    currentY += (targetY - currentY) * .1;
    currentPresence += (targetPresence - currentPresence) * .1;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, reducedMotion ? 0 : (now - startedAt) / 1000 * .86);
    gl.uniform2f(mouse, currentX, currentY);
    gl.uniform1f(presence, reducedMotion ? 0 : currentPresence);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reducedMotion) frameId = requestAnimationFrame(render);
  }

  function start(){ if (!frameId) frameId = requestAnimationFrame(render); }
  window.addEventListener('pointermove', event => {
    const bounds = canvas.getBoundingClientRect();
    const inside = event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    targetPresence = inside ? 1 : 0;
    if (inside) {
      targetX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      targetY = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { targetPresence = 0; });
  window.addEventListener('resize', start, { passive: true });
  document.addEventListener('visibilitychange', start);
  new IntersectionObserver(([entry]) => {
    visible = entry ? entry.isIntersecting : true;
    if (visible) start();
    else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; }
  }, { threshold: .01 }).observe(canvas);
  start();
})();
