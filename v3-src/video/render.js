// Rendu image par image d'une composition (comme Remotion) : Playwright -> JPEG -> ffmpeg (H.264).
// Usage : node render.js <outdir> <id> [<id> ...]   (serveur http sur v3-src, port 8790)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const FPS = 25;
(async () => {
  const [outdir, ...ids] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('http://localhost:8790/video/comp.html');
  for (const id of ids) {
    const out = path.join(outdir, 'Capsule_' + id + '.mp4');
    if (fs.existsSync(out) && fs.statSync(out).size > 100000) { console.log('skip', id); continue; }
    const t0 = Date.now();
    const board = JSON.parse(fs.readFileSync(path.join(__dirname, 'boards', id + '.json'), 'utf8'));
    await p.reload(); 
    const total = await p.evaluate(b => window.load(b), board);
    const N = Math.ceil(total * FPS);
    const tmp = out + '.part.mp4';
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-f', 'mp4', tmp]);
    let err = ''; ff.stderr.on('data', d => err += d);
    const done = new Promise(r => ff.on('close', r));
    let lastKey = null, lastBuf = null, shots = 0;
    for (let f = 0; f < N; f++) {
      const key = await p.evaluate(t => window.renderAt(t), f / FPS);
      let buf;
      if (key !== null && key === lastKey && lastBuf) buf = lastBuf;
      else { buf = await p.screenshot({ type: 'jpeg', quality: 90 }); shots++; }
      lastKey = key; lastBuf = buf;
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); const code = await done;
    if (code !== 0) { console.log('FAIL', id, err.slice(0, 300)); continue; }
    fs.renameSync(tmp, out);
    console.log('ok', id, (total).toFixed(0) + 's', N + 'f', shots + ' shots', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await b.close();
})();
