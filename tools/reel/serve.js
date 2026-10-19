/* serve.js — the web server for tools/reel/, the trailer maker.

   Serves the game (the whole project folder) like any static server, and
   takes back what the reel page sends it:
     POST /reel/clear          empty tools/reel/out/ for a fresh take
     POST /reel/frames?i=24    frames from 24 on, each a PNG after its
                               length → out/frames/00024.png, 00025.png…
     POST /reel/frame?i=name   a contact sheet → out/name.png
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
      else if (url.pathname === '/reel/frame') {
        // a frame (?i=12), or a named contact sheet from REEL.sheet (?i=rascal)
        var i = url.searchParams.get('i'), name = /^\d+$/.test(i) ? i.padStart(5, '0') : i.replace(/[^\w-]/g, '');
        fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
        fs.writeFileSync(path.join(OUT, /^\d+$/.test(i) ? 'frames' : '', name + '.png'), body);
      }
      else if (url.pathname === '/reel/frames') {
        // a run of frames from ?i=n on, each a PNG after its length (4 bytes)
        fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
        for (var at = 0, n = +url.searchParams.get('i'); at < body.length; n++) {
          var len = body.readUInt32BE(at);
          fs.writeFileSync(path.join(OUT, 'frames', String(n).padStart(5, '0') + '.png'), body.subarray(at + 4, at + 4 + len));
          at += 4 + len;
        }
      }
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
