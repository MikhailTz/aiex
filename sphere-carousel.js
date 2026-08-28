(() => {
  const canvas = document.getElementById('solutionSphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const labels = ['Sites','Apps','Automação IA','Sistemas','NFC','Cardápio','Organiza+','Google'];
  const badges = ['WEB','APP','IA','SYS','NFC','MENU','O+','G'];
  const palettes = [['#8bd4ff','#32e6d2'], ['#d8b4fe','#8b5cf6'], ['#6ee7d8','#22c55e'], ['#fde68a','#f59e0b']];
  const items = Array.from({ length: 18 }, (_, index) => {
    const y = 1 - (index / 17) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    return {
      label: labels[index % labels.length],
      badge: badges[index % badges.length],
      palette: palettes[index % palettes.length],
      x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius,
    };
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
      const w = Math.max(98, Math.min(144, width * .2)) * perspective;
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

      const fontSize = Math.max(9, 12 * perspective);
      ctx.font = `800 ${fontSize}px Inter,Arial,sans-serif`;
      const textWidth = ctx.measureText(item.label).width;
      const badgeSize = Math.max(16, 22 * perspective);
      const badgeGap = 7 * perspective;
      const groupWidth = badgeSize + badgeGap + textWidth;
      const startX = x - groupWidth / 2;
      const badgeX = startX;
      const badgeY = y - badgeSize / 2;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 6 * perspective);
      const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize);
      badgeGradient.addColorStop(0, item.palette[0]);
      badgeGradient.addColorStop(1, item.palette[1]);
      ctx.fillStyle = badgeGradient;
      ctx.fill();
      ctx.fillStyle = '#06121c';
      ctx.font = `900 ${Math.max(6, badgeSize * .34)}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(item.badge, badgeX + badgeSize / 2, badgeY + badgeSize / 2 + .5);

      ctx.fillStyle = depth > .6 ? '#edf8ff' : '#9aabbc';
      ctx.font = `800 ${fontSize}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(item.label, badgeX + badgeSize + badgeGap, y + 1);
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
