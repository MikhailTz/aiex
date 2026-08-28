(() => {
  const canvas = document.getElementById('solutionSphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const WHATSAPP_PATH = 'M19.11 17.21c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.41-.8-1.93-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.69.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.17-.5-.3zM16.04 5.33c-5.85 0-10.61 4.75-10.61 10.6 0 1.87.49 3.7 1.42 5.31l-1.51 5.51 5.64-1.48a10.57 10.57 0 0 0 5.06 1.29h.01c5.85 0 10.61-4.76 10.61-10.61S21.9 5.33 16.04 5.33zm0 19.43h-.01c-1.55 0-3.07-.42-4.39-1.2l-.31-.18-3.35.88.89-3.27-.2-.33a8.77 8.77 0 0 1-1.35-4.7c0-4.83 3.94-8.77 8.78-8.77 2.34 0 4.54.91 6.2 2.57a8.72 8.72 0 0 1 2.57 6.21c-.01 4.84-3.94 8.78-8.83 8.79z';
  const INSTAGRAM_PATH = 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z';
  const whatsappPath2D = new Path2D(WHATSAPP_PATH);
  const instagramPath2D = new Path2D(INSTAGRAM_PATH);

  // Each icon draws itself centered inside a `size`x`size` box at (x, y),
  // using its real brand shape (or a close geometric approximation).
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
      const r = size * 0.28;
      ctx.lineWidth = size * 0.15;
      ctx.strokeStyle = '#0081FB';
      ctx.beginPath();
      ctx.arc(size * 0.37, size * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = '#00B2FF';
      ctx.arc(size * 0.63, size * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    google(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.fillStyle = '#4285F4';
      ctx.font = `800 ${size * 0.78}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('G', 0, size * 0.04);
      ctx.restore();
    },
    openai(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${size * 0.42}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', 0, size * 0.04);
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

  const items = Array.from({ length: 18 }, (_, index) => {
    const y = 1 - (index / 17) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    const brand = brands[index % brands.length];
    return { name: brand.name, icon: brand.icon, x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
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
      const textWidth = ctx.measureText(item.name).width;
      const iconSize = Math.max(16, 22 * perspective);
      const iconGap = 7 * perspective;
      const groupWidth = iconSize + iconGap + textWidth;
      const iconX = x - groupWidth / 2;
      const iconY = y - iconSize / 2;

      const draw = icons[item.icon];
      if (draw) draw(ctx, iconX, iconY, iconSize);

      ctx.fillStyle = depth > .6 ? '#edf8ff' : '#9aabbc';
      ctx.font = `800 ${fontSize}px Inter,Arial,sans-serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(item.name, iconX + iconSize + iconGap, y + 1);
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
