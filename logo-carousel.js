(() => {
  const canvas = document.getElementById('logoCarousel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const brands = [
    { name: 'Meta', mark: '∞' },
    { name: 'WhatsApp', mark: '◉' },
    { name: 'Instagram', mark: '◎' },
    { name: 'Google', mark: 'G' },
    { name: 'OpenAI', mark: 'AI' },
    { name: 'Cloudflare', mark: '☁' }
  ];

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1;
  let offset = 0, speed = 42, frame = 0, previous = performance.now();
  let visible = true, hovering = false, dragging = false, lastX = 0;
  const gap = 34;
  const cardWidth = 178;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function roundedRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  }

  function drawCard(x, brand) {
    const centerDistance = Math.min(1, Math.abs(x + cardWidth / 2 - width / 2) / (width * .52));
    const scale = 1 - centerDistance * .28;
    const alpha = 1 - centerDistance * .54;
    const blur = centerDistance * 2.4;
    const w = cardWidth * scale;
    const h = 72 * scale;
    const drawX = x + (cardWidth - w) / 2;
    const drawY = (height - h) / 2;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = `blur(${blur}px)`;
    const markSize = 37 * scale;
    const markX = drawX + 10 * scale;
    const markY = drawY + (h - markSize) / 2;
    ctx.fillStyle = centerDistance < .3 ? '#d7dbe0' : '#9a9fa6';
    ctx.font = `800 ${brand.mark.length > 1 ? 12 : 22}px Inter,Arial,sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brand.mark, markX + markSize / 2, markY + markSize / 2 + 1);

    ctx.fillStyle = centerDistance < .3 ? '#d7dbe0' : '#92979e';
    ctx.font = `600 ${18 * scale}px Inter,Arial,sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(brand.name, markX + markSize + 8 * scale, drawY + h / 2 + 1);
    ctx.restore();
  }

  function render(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, .05);
    previous = now;
    if (!reducedMotion && !dragging) offset -= speed * dt * (hovering ? .16 : 1);
    const stride = cardWidth + gap;
    const total = brands.length * stride;
    offset = ((offset % total) + total) % total;
    ctx.clearRect(0, 0, width, height);
    const first = -total + offset - stride;
    for (let loop = 0; loop < 3; loop += 1) {
      brands.forEach((brand, index) => drawCard(first + loop * total + index * stride, brand));
    }
    if (!reducedMotion || dragging) frame = requestAnimationFrame(render);
  }

  function start() {
    if (!frame) {
      previous = performance.now();
      frame = requestAnimationFrame(render);
    }
  }

  canvas.addEventListener('pointerenter', () => { hovering = true; start(); });
  canvas.addEventListener('pointerleave', () => { hovering = false; dragging = false; start(); });
  canvas.addEventListener('pointerdown', event => {
    dragging = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); start();
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    offset += event.clientX - lastX; lastX = event.clientX; start();
  });
  canvas.addEventListener('pointerup', event => {
    dragging = false; canvas.releasePointerCapture(event.pointerId); start();
  });
  window.addEventListener('resize', () => { resize(); start(); }, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry ? entry.isIntersecting : true;
    if (visible) start();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: .05 }).observe(canvas);
  resize();
  start();
})();
