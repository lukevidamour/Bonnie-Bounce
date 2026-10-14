/* ==========================================================================
   voice.js — a grown-up's voice in the game.

   Three little clips a parent can record (GROWN-UPS, from the title menu
   or the pause menu): "Yay!", "Wheee!" and "Well done!". The game plays
   them at the right moments — "Yay!" at a checkpoint and now and then on
   a stomp, "Wheee!" on a trampoline, "Well done!" when a level is clear.
   Each is kept on this device only (in the browser's storage, a couple
   of seconds of compressed audio); nothing is ever sent anywhere.
   ========================================================================== */
(function () {
  'use strict';
  var CLIPS = ['yay', 'wheee', 'welldone'], KEY = 'bonnie-voice-', MAX_MS = 2000;
  var bufs = {}, rec = null;
  var stored = function (n) { try { return localStorage.getItem(KEY + n); } catch (e) { return null; } };
  var decode = function (n, cb) {
    var url = stored(n), ac = BB.audioCtx();
    if (!url || !ac) return;
    if (bufs[n]) { cb && cb(bufs[n]); return; }
    fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
      // Safari still wants the callback form
      ac.decodeAudioData(ab, function (b) { bufs[n] = b; cb && cb(b); }, function () {});
    }).catch(function () {});
  };
  var play = function (n) {
    var o = BB.audioOut();
    if (!o || !stored(n)) return false;
    decode(n, function (b) { var src = o.ac.createBufferSource(), g = o.ac.createGain(); g.gain.value = 1.4; src.buffer = b; src.connect(g); g.connect(o.out); src.start(); });
    return true;
  };
  var can = function () { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); };
  // record up to two seconds; done(ok) when it's saved
  var record = function (n, done) {
    if (!can() || rec) { done && done(false); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var types = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'], type = '';
      for (var i = 0; i < types.length; i++) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(types[i])) { type = types[i]; break; }
      var mr = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : undefined), parts = [];
      rec = { n: n, t0: performance.now(), mr: mr };
      mr.ondataavailable = function (e) { if (e.data && e.data.size) parts.push(e.data); };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        rec = null;
        var fr = new FileReader();
        fr.onload = function () {
          try { localStorage.setItem(KEY + n, fr.result); delete bufs[n]; } catch (e) { done && done(false); return; }
          decode(n, function () { play(n); });
          done && done(true);
        };
        fr.readAsDataURL(new Blob(parts, { type: mr.mimeType || type || 'audio/webm' }));
      };
      mr.start();
      setTimeout(function () { if (mr.state === 'recording') mr.stop(); }, MAX_MS);
    }).catch(function () { rec = null; done && done(false); });
  };
  BB.voice = {
    CLIPS: CLIPS,
    has: function (n) { return !!stored(n); },
    play: play,
    record: record,
    recording: function () { return rec ? { n: rec.n, k: Math.min(1, (performance.now() - rec.t0) / MAX_MS) } : null; },
    stop: function () { if (rec && rec.mr.state === 'recording') rec.mr.stop(); },
    clear: function (n) { try { localStorage.removeItem(KEY + n); } catch (e) {} delete bufs[n]; },
    can: can
  };
})();
