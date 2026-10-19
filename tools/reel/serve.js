/* serve.js — the web server for tools/reel/, the trailer maker.

   Serves the game (the whole project folder) like any static server, and
   takes back what the reel page sends it:
     POST /reel/clear          empty tools/reel/out/ for a fresh take
     POST /reel/frame?i=12     one frame, a PNG    → out/frames/00012.png
     POST /reel/audio          the soundtrack, WAV → out/audio.wav
   Then encode.swift turns out/ into the video. Node's own modules only.

     node tools/reel/serve.js 8171      (then open /tools/reel/)        */
'use strict';
var http = require('http'), fs = require('fs'), path = require('path');
var ROOT = path.resolve(__dirname, '..', '..'), OUT = path.join(__dirname, 'out');
var TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };

http.createServer(function (req, res) {
  var url = new URL(req.url, 'http://x');
  if (req.method === 'POST') {
    var parts = [];
    req.on('data', function (c) { parts.push(c); });
    req.on('end', function () {
      var body = Buffer.concat(parts);
      if (url.pathname === '/reel/clear') { fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true }); }
      else if (url.pathname === '/reel/frame') fs.writeFileSync(path.join(OUT, 'frames', String(+url.searchParams.get('i')).padStart(5, '0') + '.png'), body);
      else if (url.pathname === '/reel/audio') fs.writeFileSync(path.join(OUT, 'audio.wav'), body);
      else { res.writeHead(404); res.end(); return; }
      res.writeHead(204); res.end();
    });
    return;
  }
  var file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (file.endsWith(path.sep) || url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404); res.end(); return; }
    // the page is edited between takes: never a stale copy
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(+process.argv[2] || +process.env.PORT || 8171, '127.0.0.1');
