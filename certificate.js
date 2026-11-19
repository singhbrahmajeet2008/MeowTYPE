// meow-typing - Cute & High-Resolution Certificate of Purr-fection
// Generates official 2400x1350 ultra-crisp printable typing speed certificate

class CertificateGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 2400;
    this.canvas.height = 1350;
    this.ctx = this.canvas.getContext('2d');
    this.catImg = new Image();
    this.catImg.src = 'assets/cat-logo.png';
  }

  getRankTitle(wpm) {
    if (wpm >= 120) return { title: 'Cat God 👑', color: '#f59e0b', grade: 'S+' };
    if (wpm >= 100) return { title: 'Zoomies Master ⚡', color: '#8b5cf6', grade: 'S' };
    if (wpm >= 80) return { title: 'Speedy Paws 🐾', color: '#3b82f6', grade: 'A+' };
    if (wpm >= 65) return { title: 'Swift Scribe 🐱', color: '#10b981', grade: 'A' };
    if (wpm >= 50) return { title: 'Laser Chaser 🧶', color: '#06b6d4', grade: 'B+' };
    if (wpm >= 35) return { title: 'Chill Kitten 🥛', color: '#ec4899', grade: 'B' };
    return { title: 'Sleepy Kitty 💤', color: '#94a3b8', grade: 'C' };
  }

  render(data) {
    const {
      name = 'Speedy Kitten',
      wpm = 88,
      accuracy = 99,
      duration = '1 min',
      certId = 'MEOW-' + Math.floor(100000 + Math.random() * 900000),
      date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } = data;

    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const rank = this.getRankTitle(wpm);

    // 1. Background Warm Pastel Cream Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#fffbf5');
    bgGrad.addColorStop(0.5, '#fef6ee');
    bgGrad.addColorStop(1, '#fdf2f8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Playful Dual Borders with rounded corners
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f472b6'; // Cute pink
    ctx.beginPath();
    ctx.roundRect(60, 60, W - 120, H - 120, 36);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    ctx.beginPath();
    ctx.roundRect(84, 84, W - 168, H - 168, 28);
    ctx.stroke();

    // 3. Draw Cat Logo in the Header
    ctx.save();
    const catSize = 130;
    const catX = W / 2 - catSize / 2;
    const catY = 160;

    // Cat circular clipping
    ctx.beginPath();
    ctx.arc(W / 2, catY + catSize / 2, catSize / 2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f472b6';
    ctx.stroke();

    if (this.catImg.complete && this.catImg.naturalWidth > 0) {
      ctx.beginPath();
      ctx.arc(W / 2, catY + catSize / 2, catSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.catImg, catX, catY, catSize, catSize);
    } else {
      ctx.fillStyle = '#f472b6';
      ctx.font = '70px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐱', W / 2, catY + 90);
    }
    ctx.restore();

    // 4. Header Titles
    ctx.textAlign = 'center';

    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('MEOW-TYPING OFFICIAL ACCREDITATION', W / 2, 345);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 68px "Georgia", "Times New Roman", serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('CERTIFICATE OF PURR-FECTION', W / 2, 435);

    ctx.font = 'italic 30px "Georgia", serif';
    ctx.fillStyle = '#64748b';
    ctx.letterSpacing = '1px';
    ctx.fillText('This official cat-tificate declares that', W / 2, 515);

    // Recipient Name
    ctx.font = 'bold 72px "Georgia", "Times New Roman", serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(name, W / 2, 605);

    // Underline beneath name
    const textWidth = ctx.measureText(name).width;
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W / 2 - Math.max(textWidth / 2, 260), 625);
    ctx.lineTo(W / 2 + Math.max(textWidth / 2, 260), 625);
    ctx.stroke();

    // Citation description
    ctx.font = '30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('has demonstrated lightning paw speed, chill focus, and supreme typing agility.', W / 2, 690);

    // 5. Metric Stat Cards
    this.drawMetricBadge(ctx, W / 2 - 400, 755, 320, 160, `${wpm} WPM`, 'TYPING SPEED', '#3b82f6');
    this.drawMetricBadge(ctx, W / 2, 755, 320, 160, `${accuracy}%`, 'ACCURACY', '#10b981');
    this.drawMetricBadge(ctx, W / 2 + 400, 755, 320, 160, rank.grade, rank.title.toUpperCase(), rank.color);

    // 6. Cute Wax Seal / Cat Paw Stamp
    this.drawCatSeal(ctx, 360, 1070, 105, rank.title);

    // 7. Verification details & Signature
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '22px monospace';
    ctx.fillText(`Certificate ID: ${certId}`, 540, 1070);
    ctx.fillText(`Evaluation Date: ${date}`, 540, 1105);
    ctx.fillText(`Verification Node: meow-typing.com/cert/${certId}`, 540, 1140);
    ctx.fillText(`Assessment Window: ${duration} Chill Test`, 540, 1175);

    // Right - Signature Line
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W - 650, 1120);
    ctx.lineTo(W - 250, 1120);
    ctx.stroke();


    ctx.font = 'italic bold 42px "Brush Script MT", "Segoe Script", cursive';
    ctx.fillStyle = '#ec4899';
    ctx.fillText('Polite Cat & The Cat Council 🐾', W - 450, 1095);

    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('CHIEF EXECUTIVE CAT', W - 450, 1155);
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('International Federation of Chill Felines', W - 450, 1185);

    return this.canvas;
  }

  drawMetricBadge(ctx, cx, cy, w, h, value, label, accentColor) {
    const x = cx - w / 2;
    const y = cy;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 10, [24, 24, 0, 0]);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 58px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(value, cx, y + 80);

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(label, cx, y + 125);
  }

  drawCatSeal(ctx, x, y, radius, rankTitle) {
    // Red/Gold ribbon
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(x - 45, y + 40);
    ctx.lineTo(x - 70, y + 170);
    ctx.lineTo(x - 30, y + 140);
    ctx.lineTo(x + 10, y + 170);
    ctx.lineTo(x - 10, y + 40);
    ctx.fill();

    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 40);
    ctx.lineTo(x - 10, y + 170);
    ctx.lineTo(x + 30, y + 140);
    ctx.lineTo(x + 70, y + 170);
    ctx.lineTo(x + 45, y + 40);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);

    const grad = ctx.createRadialGradient(-20, -20, 10, 0, 0, radius);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.4, '#eab308');
    grad.addColorStop(0.8, '#ca8a04');
    grad.addColorStop(1, '#854d0e');

    ctx.fillStyle = grad;
    ctx.beginPath();
    const points = 32;
    for (let i = 0; i < points; i++) {
      const angle = (i * Math.PI * 2) / points;
      const r = i % 2 === 0 ? radius : radius - 10;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PURR-FECT', 0, -8);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('APPROVED', 0, 16);
    ctx.font = '28px sans-serif';
    ctx.fillText('🐾 🐾', 0, 44);

    ctx.restore();
  }

  downloadAsImage(data, filename = 'meow-typing_Certificate.png') {
    this.render(data);
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

window.certificateGenerator = new CertificateGenerator();
