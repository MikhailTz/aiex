(() => {
  const canvas = document.getElementById('solutionSphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const labels = ['Sites','Apps','Automação IA','Sistemas','NFC','Cardápio','Organiza+','Google'];
  const items = Array.from({ length: 18 }, (_, index) => {
    const y = 1 - (index / 17) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    return { label: labels[index % labels.length], x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, frame = 0, last = performance.now();
  let angleX = -.18, angleY = .35, velocityX = 0, velocityY = reduced ? 0 : .18;
  let dragging = false, lastPointerX = 0, lastPointerY = 0, visible = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotate(point) {
    const cy = Math.cos(angleY), sy = Math.sin(angleY);
    const cx = Math.cos(angleX), sx = Math.sin(angleX);
    const x1 = point.x * cy - point.z * sy;
    const z1 = point.x * sy + point.z * cy;
    return { x: x1, y: point.y * cx - z1 * sx, z: point.y * sx + z1 * cx };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const sphereRadius = Math.min(width, height) * .34;
    const projected = items.map(item => ({ ...item, rotated: rotate(item) }))
      .sort((a, b) => a.rotated.z - b.rotated.z);

    projected.forEach(item => {
      const depth = (item.rotated.z + 1) / 2;
      const perspective = .72 + depth * .42;
      const x = width / 2 + item.rotated.x * sphereRadius;
      const y = height / 2 + item.rotated.y * sphereRadius;
      const w = Math.max(72, Math.min(116, width * .17)) * perspective;
      const h = 46 * perspective;
      const alpha = .2 + depth * .8;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.filter = `blur(${(1 - depth) * 1.8}px)`;
      const gradient = ctx.createLinearGradient(x - w/2, y - h/2, x + w/2, y + h/2);
      gradient.addColorStop(0, `rgba(27,44,66,${.78 + depth*.18})`);
      gradient.addColorStop(1, `rgba(7,13,22,${.82 + depth*.14})`);
      ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, 12 * perspective);
      ctx.fillStyle = gradient; ctx.fill();
      ctx.strokeStyle = depth > .65 ? 'rgba(91,194,255,.66)' : 'rgba(113,157,199,.24)';
      ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = depth > .6 ? '#edf8ff' : '#9aabbc';
      ctx.font = `800 ${Math.max(9, 12 * perspective)}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(item.label, x, y + 1);
      ctx.restore();
    });
  }

  function render(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!dragging && !reduced) {
      angleY += (.16 + velocityY) * dt;
      angleX += velocityX * dt;
      velocityX *= .97; velocityY *= .97;
    }
    draw();
    if (!reduced || dragging) frame = requestAnimationFrame(render);
  }

  function start() { if (!frame) { last = performance.now(); frame = requestAnimationFrame(render); } }
  canvas.addEventListener('pointerdown', event => {
    dragging = true; lastPointerX = event.clientX; lastPointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId); start();
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - lastPointerX, dy = event.clientY - lastPointerY;
    angleY += dx * .008; angleX += dy * .006;
    velocityY = dx * .018; velocityX = dy * .014;
    lastPointerX = event.clientX; lastPointerY = event.clientY; draw();
  });
  const release = event => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    start();
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  window.addEventListener('resize', () => { resize(); draw(); }, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry ? entry.isIntersecting : true;
    if (visible) start(); else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: .05 }).observe(canvas);
  resize(); draw(); start();
})();
