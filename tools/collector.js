(async () => {
  const START = '2026-10-02', GROUP = 'UNK67F';
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:auto 16px 16px 16px;z-index:2147483647;max-width:560px;margin:0 auto;background:#fff;color:#0e1f3f;border:3px solid #13306b;border-radius:12px;padding:16px;font:15px/1.4 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.35)';
  box.innerHTML = '<b style="font-size:17px">FV Ball Knowers share code</b><p id="gsq-msg" style="margin:8px 0">Collecting your rounds…</p>';
  document.body.appendChild(box);
  const msg = (t) => { box.querySelector('#gsq-msg').textContent = t; };
  try {
    if (location.hostname !== 'geosports.app') { msg('Open geosports.app first, sign in, then click this bookmark again.'); return; }
    const get = async (p) => { const r = await fetch(p, { cache: 'no-store' }); return r.ok ? r.json() : null; };
    const s = await get('/api/auth/get-session');
    if (!s || !s.user) { msg('Sign in to GeoSports first, then click this bookmark again.'); return; }
    const board = await get('/api/leagues/' + GROUP + '/board?period=today');
    if (!board || !board.currentUserId) { msg('This account is not in the FV Ball Knowers group.'); return; }
    const days = [];
    let name = '';
    for (let d = new Date(START + 'T12:00:00Z'); d.toISOString().slice(0, 10) <= board.date; d.setUTCDate(d.getUTCDate() + 1)) {
      const ds = d.toISOString().slice(0, 10);
      const j = await get('/api/results/daily?date=' + ds);
      if (!j || !Array.isArray(j.guesses) || !j.guesses.length) continue;
      name = j.username || name;
      days.push([ds, j.totalScore, j.guesses.map((g) => [g.questionIndex + 1, (g.answer && g.answer.name) || '', Math.round(g.distanceMiles * 10) / 10, g.rawScore, g.multiplier, g.score])]);
    }
    if (!days.length) { msg('No rounds found since the season started. Play a round, then try again.'); return; }
    const code = 'GSQ1:' + btoa(unescape(encodeURIComponent(JSON.stringify({ v: 1, id: board.currentUserId, u: name, d: days }))));
    msg('Found ' + days.length + (days.length === 1 ? ' round' : ' rounds') + '. Copy the code below and text it to Maxim.');
    const ta = document.createElement('textarea');
    ta.value = code; ta.readOnly = true;
    ta.style.cssText = 'width:100%;height:90px;font:12px monospace;border:1px solid #c4cddd;border-radius:6px;padding:6px;box-sizing:border-box';
    const btn = document.createElement('button');
    btn.textContent = 'Copy code';
    btn.style.cssText = 'margin-top:8px;padding:8px 16px;border:0;border-radius:999px;background:#d42a3c;color:#fff;font-weight:700;cursor:pointer';
    btn.onclick = () => { ta.select(); (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => { btn.textContent = 'Copied'; }).catch(() => { document.execCommand('copy'); btn.textContent = 'Copied'; }); };
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText = 'margin:8px 0 0 8px;padding:8px 16px;border:1px solid #c4cddd;border-radius:999px;background:#fff;color:#0e1f3f;cursor:pointer';
    close.onclick = () => box.remove();
    box.append(ta, btn, close);
    ta.select();
  } catch (e) { msg('Something went wrong: ' + e.message); }
})();
