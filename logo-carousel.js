(() => {
  const canvas = document.getElementById('logoCarousel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const WHATSAPP_PATH = 'M19.11 17.21c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.41-.8-1.93-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.69.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.17-.5-.3zM16.04 5.33c-5.85 0-10.61 4.75-10.61 10.6 0 1.87.49 3.7 1.42 5.31l-1.51 5.51 5.64-1.48a10.57 10.57 0 0 0 5.06 1.29h.01c5.85 0 10.61-4.76 10.61-10.61S21.9 5.33 16.04 5.33zm0 19.43h-.01c-1.55 0-3.07-.42-4.39-1.2l-.31-.18-3.35.88.89-3.27-.2-.33a8.77 8.77 0 0 1-1.35-4.7c0-4.83 3.94-8.77 8.78-8.77 2.34 0 4.54.91 6.2 2.57a8.72 8.72 0 0 1 2.57 6.21c-.01 4.84-3.94 8.78-8.83 8.79z';
  const INSTAGRAM_PATH = 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z';
  const whatsappPath2D = new Path2D(WHATSAPP_PATH);
  const instagramPath2D = new Path2D(INSTAGRAM_PATH);

  // Each icon draws itself centered inside a `size`x`size` box at (x, y),
  // using its real brand shape (or a close geometric approximation) so the
  // logo cloud reads as the actual tools instead of generic glyphs.
  const icons = {
    whatsapp(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 32, size / 32);
      ctx.fillStyle = '#25D366';
      ctx.fill(whatsappPath2D);
      ctx.restore();
    },
    instagram(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 448, size / 512);
      ctx.fillStyle = '#E1306C';
      ctx.fill(instagramPath2D);
      ctx.restore();
    },
    meta(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.lineCap = 'round';
      ctx.lineWidth = size * 0.2;
      ctx.strokeStyle = '#0866FF';
      ctx.beginPath();
      ctx.moveTo(size * 0.12, size * 0.78);
      ctx.bezierCurveTo(size * 0.12, size * 0.22, size * 0.42, size * 0.22, size * 0.5, size * 0.5);
      ctx.bezierCurveTo(size * 0.58, size * 0.78, size * 0.88, size * 0.78, size * 0.88, size * 0.22);
      ctx.stroke();
      ctx.restore();
    },
    google(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      const r = size * 0.36;
      ctx.lineWidth = size * 0.2;
      ctx.lineCap = 'butt';
      const arc = (from, to, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(0, 0, r, from, to);
        ctx.stroke();
      };
      const q = Math.PI / 2;
      arc(-q * 1.05, q * 0.05, '#4285F4');
      arc(q * 0.05, q * 1.05, '#34A853');
      arc(q * 1.05, q * 2.05, '#FBBC05');
      arc(q * 2.05, q * 3.05, '#EA4335');
      ctx.fillStyle = '#4285F4';
      ctx.fillRect(0, -size * 0.1, size * 0.42, size * 0.2);
      ctx.restore();
    },
    openai(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.fillStyle = '#10A37F';
      for (let i = 0; i < 6; i += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        ctx.beginPath();
        ctx.ellipse(size * 0.24, 0, size * 0.22, size * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    },
    cloudflare(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#F38020';
      ctx.beginPath();
      ctx.arc(size * 0.3, size * 0.58, size * 0.22, 0, Math.PI * 2);
      ctx.arc(size * 0.56, size * 0.42, size * 0.28, 0, Math.PI * 2);
      ctx.arc(size * 0.8, size * 0.58, size * 0.19, 0, Math.PI * 2);
      ctx.rect(size * 0.22, size * 0.54, size * 0.6, size * 0.24);
      ctx.fill();
      ctx.restore();
    },
    supabase(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#3ECF8E';
      ctx.beginPath();
      ctx.moveTo(size * 0.58, 0);
      ctx.lineTo(size * 0.14, size * 0.58);
      ctx.lineTo(size * 0.42, size * 0.58);
      ctx.lineTo(size * 0.32, size);
      ctx.lineTo(size * 0.86, size * 0.4);
      ctx.lineTo(size * 0.56, size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    nextjs(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = size * 0.06;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${size * 0.5}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', 0, size * 0.03);
      ctx.restore();
    },
    vercel(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.08);
      ctx.lineTo(size * 0.92, size * 0.86);
      ctx.lineTo(size * 0.08, size * 0.86);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    nodejs(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      const r = size * 0.46;
      ctx.fillStyle = '#3C873A';
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
  };

  const brands = [
    { name: 'WhatsApp', icon: 'whatsapp' },
    { name: 'Instagram', icon: 'instagram' },
    { name: 'Meta', icon: 'meta' },
    { name: 'Google', icon: 'google' },
    { name: 'OpenAI', icon: 'openai' },
    { name: 'Cloudflare', icon: 'cloudflare' },
    { name: 'Supabase', icon: 'supabase' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'Vercel', icon: 'vercel' },
    { name: 'Node.js', icon: 'nodejs' },
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
    const markSize = 34 * scale;
    const markX = drawX + 10 * scale;
    const markY = drawY + (h - markSize) / 2;
    const draw = icons[brand.icon];
    if (draw) draw(ctx, markX, markY, markSize);

    ctx.fillStyle = centerDistance < .3 ? '#d7dbe0' : '#92979e';
    ctx.font = `600 ${18 * scale}px Inter,Arial,sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(brand.name, markX + markSize + 10 * scale, drawY + h / 2 + 1);
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
