/* Jordan Huynh portfolio. Plain JS + GSAP. Content comes from js/data.js. */
(() => {
  "use strict";

  const S = window.SITE;
  const P = S.profile;
  const G = window.gsap || null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked */ } }
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* blocked */ } }
  };
  if (!S.katakana) document.documentElement.classList.add("no-kana");

  const COLORS = {
    butter: "#f4eda8", mustard: "#e9c744", cyan: "#56b7d3", cobalt: "#3d6fd8",
    lavender: "#c4c6ee", salmon: "#e98e86", mint: "#9fd8b9", ink: "#1c2150", paper: "#ffffff", signal: "#e4532f"
  };

  /* =========================================================
     SHAPES: rounded crosses, flowers, atom, ribbons
     ========================================================= */
  function roundedPoly(pts, r) {
    let d = "";
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const l1 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const t1 = Math.min(r, l1 / 2) / l1, t2 = Math.min(r, l2 / 2) / l2;
      const a = [p1[0] + (p0[0] - p1[0]) * t1, p1[1] + (p0[1] - p1[1]) * t1];
      const b = [p1[0] + (p2[0] - p1[0]) * t2, p1[1] + (p2[1] - p1[1]) * t2];
      d += (i === 0 ? "M" : "L") + a[0].toFixed(1) + "," + a[1].toFixed(1) + "Q" + p1[0].toFixed(1) + "," + p1[1].toFixed(1) + " " + b[0].toFixed(1) + "," + b[1].toFixed(1);
    }
    return d + "Z";
  }
  const plusPts = (cx, cy, h, a) => [
    [cx - a, cy - h], [cx + a, cy - h], [cx + a, cy - a], [cx + h, cy - a], [cx + h, cy + a], [cx + a, cy + a],
    [cx + a, cy + h], [cx - a, cy + h], [cx - a, cy + a], [cx - h, cy + a], [cx - h, cy - a], [cx - a, cy - a]
  ];
  const plus = (cx, cy, h, a, r) => roundedPoly(plusPts(cx, cy, h, a), r);

  function rings(cx, cy, n, opts = {}) {
    const { a0 = 26, h0 = 150, step = 24, stroke = "#fff", op = 0.55, sw = 1.3 } = opts;
    let out = "";
    for (let k = 0; k < n; k++) {
      const a = a0 + k * step, h = h0 + k * step;
      const r = Math.min(10 + k * 9, (h - a) / 2 - 1, a);
      out += `<path d="${plus(cx, cy, h, a, r)}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
    }
    return out;
  }

  // Flower glyphs, drawn in a 100x100 box centered on 0,0
  function glyph(type, c) {
    const [A, B, C] = c;
    if (type === "cross") {
      return `<path d="${plus(0, 0, 48, 22, 13)}" fill="${A}"/>
        <path d="${plus(0, 0, 31, 10, 6)}" fill="${B}" transform="rotate(45)"/>
        <rect x="-7" y="-7" width="14" height="14" rx="3" fill="${C}"/>`;
    }
    if (type === "gear") {
      let bumps = "";
      for (let i = 0; i < 8; i++) bumps += `<rect x="-12" y="-49" width="24" height="24" rx="7" fill="${A}" transform="rotate(${i * 45})"/>`;
      return `${bumps}<circle r="36" fill="${A}"/><circle r="22" fill="${B}"/>
        <rect x="-16" y="-5" width="32" height="10" rx="5" fill="${C}" transform="rotate(45)"/>
        <rect x="-16" y="-5" width="32" height="10" rx="5" fill="${C}" transform="rotate(-45)"/>`;
    }
    if (type === "clover") {
      return `<path d="${plus(0, 0, 48, 30, 16)}" fill="${A}"/>
        <g fill="${B}"><circle cx="-14" cy="-14" r="14"/><circle cx="14" cy="-14" r="14"/><circle cx="-14" cy="14" r="14"/><circle cx="14" cy="14" r="14"/><circle r="12"/></g>
        <path d="${plus(0, 0, 11, 4, 2)}" fill="${C}"/>`;
    }
    // atom: dots on a cross, joined with a goo filter
    let dots = `<circle r="16"/>`;
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([x, y]) => {
      dots += `<circle cx="${x * 30}" cy="${y * 30}" r="11"/><circle cx="${x * 46}" cy="${y * 46}" r="7.5"/><circle cx="${x * 20}" cy="${y * 20}" r="5"/><circle cx="${x * 38}" cy="${y * 38}" r="4"/>`;
    });
    let free = "";
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([x, y]) => {
      free += `<circle cx="${x * 30}" cy="${y * 30}" r="9"/><circle cx="${x * 16}" cy="${y * 16}" r="4.5"/><circle cx="${x * 43}" cy="${y * 43}" r="3.5"/>`;
    });
    return `<g fill="${A}" filter="url(#goo)">${dots}</g><g fill="${A}">${free}</g>`;
  }
  const glyphSVG = (type, c, cls = "") => `<svg class="${cls}" viewBox="-52 -52 104 104" aria-hidden="true">${glyph(type, c)}</svg>`;

  // seeded random for stable card art
  function rng(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const CARD_SETS = {
    cyan: [[COLORS.paper, COLORS.cyan, COLORS.mustard], [COLORS.mustard, COLORS.paper, COLORS.cobalt], [COLORS.cobalt, COLORS.paper, COLORS.mustard]],
    salmon: [[COLORS.mustard, COLORS.paper, COLORS.cobalt], [COLORS.paper, COLORS.salmon, COLORS.cobalt], [COLORS.cobalt, COLORS.paper, COLORS.mustard]],
    mint: [[COLORS.paper, COLORS.cobalt, COLORS.mustard], [COLORS.cobalt, COLORS.paper, COLORS.mustard], [COLORS.mustard, COLORS.paper, COLORS.cobalt]],
    mustard: [[COLORS.paper, COLORS.cyan, COLORS.mustard], [COLORS.cobalt, COLORS.paper, COLORS.mustard], [COLORS.paper, COLORS.cobalt, COLORS.salmon]],
    lavender: [[COLORS.cobalt, COLORS.paper, COLORS.mustard], [COLORS.paper, COLORS.cobalt, COLORS.mustard], [COLORS.mustard, COLORS.paper, COLORS.cobalt]],
    cobalt: [[COLORS.paper, COLORS.cobalt, COLORS.mustard], [COLORS.mustard, COLORS.paper, COLORS.cobalt], [COLORS.cyan, COLORS.paper, COLORS.mustard]],
    butter: [[COLORS.cobalt, COLORS.paper, COLORS.mustard], [COLORS.mustard, COLORS.paper, COLORS.cobalt], [COLORS.cyan, COLORS.paper, COLORS.mustard]]
  };
  function cardArt(seed, color, motif, skipCenter) {
    const R = rng(seed);
    const sets = CARD_SETS[color] || CARD_SETS.cyan;
    const types = motif === "atom" ? ["atom"] : [motif, motif, ["cross", "gear", "clover"][Math.floor(R() * 3)]];
    const spots = [[0, -6, 1], [-58, 58, 0.62], [60, 52, 0.5], [52, -70, 0.38], [-56, -64, 0.32], [8, 92, 0.26]];
    const count = motif === "atom" ? 1 : 4 + Math.floor(R() * 2);
    let g = rings(0, 0, 7, { a0: 14, h0: 70, step: 15, op: 0.5, sw: 1 });
    for (let i = skipCenter ? 1 : 0; i < count + (skipCenter ? 1 : 0); i++) {
      const [x, y, s] = spots[i];
      const t = types[i % types.length];
      const cols = t === "atom" ? [COLORS.paper] : sets[i % sets.length];
      const jx = (R() - 0.5) * 14, jy = (R() - 0.5) * 14, rot = t === "atom" ? 0 : Math.round((R() - 0.5) * 30);
      const sc = motif === "atom" ? 1.25 : s;
      g += `<g transform="translate(${(x + jx).toFixed(1)} ${(y + jy).toFixed(1)}) scale(${sc}) rotate(${rot})"><g class="pop">${glyph(t, cols)}</g></g>`;
    }
    return `<svg viewBox="-110 -120 220 240" aria-hidden="true">${g}</svg>`;
  }

  // every card title uses the same size: fit the longest single word across all cards
  let _chars = 0;
  function titleChars() {
    if (_chars) return _chars;
    const titles = [P.handle, "The long way", "Off the clock", "Say hi",
      ...S.projects.map((p) => p.title), ...S.experience.map((e) => e.company),
      ...S.education.map((d) => d.school.replace("Community College", "CC").replace("State University", "State"))];
    _chars = Math.max(7, ...titles.flatMap((t) => String(t).split(/\s+/)).map((w) => w.length));
    return _chars;
  }

  function card({ seed, color, motif, title, foot, photo, image, logo, mark, logoDark, logoBg, secret }) {
    let art;
    if (photo) {
      art = `<span class="photo-stack"><img class="card-photo" src="${esc(photo)}" alt="${esc(P.name)}">${secret ? `<img class="card-photo secret is-on" src="${esc(secret)}" alt="">` : ""}</span>`;
    }
    else if (image) art = `<img class="card-shot" src="${esc(image)}" alt="">`;
    else art = cardArt(seed, color, motif, !!(logo || mark));
    if (!photo && (logo || mark)) {
      art += `<span class="sticker${logoDark ? " dark" : ""}"${logoBg ? ` style="background:${esc(logoBg)}"` : ""}>${logo ? `<img src="${esc(logo)}" alt="${esc(mark || title)} logo">` : `<span class="sticker-mark">${esc(mark)}</span>`}</span>`;
    }
    const chars = titleChars();
    return `<figure class="card c-${esc(color)}">
      <div class="card-top"><span class="card-title" style="--chars:${chars}">${esc(title)}</span>${glyphSVG("clover", ["none", "none", "none"], "card-flake").replace("<svg", '<svg style="stroke:currentColor;stroke-width:5;fill:none"')}</div>
      <div class="card-art">${art}</div>
      <span class="card-lines" aria-hidden="true"></span>
      <figcaption class="card-foot">* ${esc(foot)}</figcaption>
    </figure>`;
  }

  // Ribbon swoosh for the menu (fixed 300 x 40 box, stretched via viewBox width)
  function ribbonPath(W) {
    const sx = Math.round(W * 0.55);
    return `M11,18 L${sx - 14},18 C${sx - 4},18 ${sx - 6},0 ${sx + 8},0 L${W - 11},0 A11,11 0 0 1 ${W - 11},22 L${sx + 30},22 C${sx + 18},22 ${sx + 20},40 ${sx + 6},40 L11,40 A11,11 0 0 1 11,18 Z`;
  }

  /* =========================================================
     ICONS
     ========================================================= */
  const I = {
    plus: '<path d="M12 4v16M4 12h16"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor" stroke="none"/>',
    sound: '<path d="M4 9h3l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    github: '<path d="M9 19c-4 1.4-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
  const ext = (href, label, cls = "btn", ico = "arrow") => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${label}${icon(ico)}</a>`;

  /* =========================================================
     AUDIO: UI blips + JH-FM radio
     ========================================================= */
  let actx = null;
  const getCtx = () => {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  };

  const sfx = {
    on: store.get("jh-sfx") === "on",
    play(kind) {
      if (!this.on) return;
      const ctx = getCtx(); if (!ctx) return;
      const seq = {
        hover: [["sine", 2200, 0.018, 0.025]],
        move: [["square", 1320, 0.03, 0.03]],
        section: [["triangle", 660, 0.05, 0.08], ["triangle", 990, 0.05, 0.08], ["triangle", 1320, 0.07, 0.06]],
        select: [["square", 880, 0.05, 0.035], ["square", 1320, 0.07, 0.035]],
        back: [["square", 700, 0.05, 0.035], ["square", 470, 0.07, 0.035]],
        unlock: [["square", 660, 0.08, 0.04], ["square", 880, 0.08, 0.04], ["square", 1320, 0.08, 0.04], ["square", 1760, 0.22, 0.04]]
      }[kind] || [];
      let t = ctx.currentTime + 0.005;
      seq.forEach(([type, f, d, vol]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + d + 0.02);
        t += d * 0.75;
      });
    }
  };

  const radio = (() => {
    const tracks = (S.radio && S.radio.tracks) || [];
    let playing = false, timer = 0, nextTime = 0, step = 0, master = null, bus = null, noise = null, audioEl = null, ti = 0;
    const bpm = 86, spb = 60 / bpm, s16 = spb / 4;
    const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const prog = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];
    const bass = [41, 40, 38, 36];
    const arpOrder = [0, 1, 2, 3, 2, 1, 2, 3];

    function build(ctx) {
      master = ctx.createGain(); master.gain.value = 0.0001;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
      const comp = ctx.createDynamicsCompressor();
      master.connect(lp).connect(comp).connect(output(ctx));
      const delay = ctx.createDelay(1); delay.delayTime.value = spb * 0.75;
      const fb = ctx.createGain(); fb.gain.value = 0.3;
      const wet = ctx.createGain(); wet.gain.value = 0.28;
      delay.connect(fb).connect(delay); delay.connect(wet).connect(master);
      bus = delay;
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const ch = noise.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    }
    function env(ctx, g, t, peak, a, d) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    }
    function tone(ctx, type, f, t, peak, a, d, toDelay, detune = 0) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f; o.detune.value = detune;
      env(ctx, g, t, peak, a, d);
      o.connect(g); g.connect(master); if (toDelay) g.connect(bus);
      o.start(t); o.stop(t + a + d + 0.05);
    }
    function kick(ctx, t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      env(ctx, g, t, 0.32, 0.004, 0.22);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.3);
    }
    function hat(ctx, t, v) {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
      const g = ctx.createGain(); env(ctx, g, t, v, 0.002, 0.05);
      s.connect(hp).connect(g).connect(master); s.start(t); s.stop(t + 0.08);
    }
    function schedule() {
      const ctx = actx;
      while (nextTime < ctx.currentTime + 0.15) {
        const bar = Math.floor(step / 16) % 4, s = step % 16, chord = prog[bar];
        if (s === 0) {
          chord.forEach((m) => { tone(ctx, "triangle", hz(m), nextTime, 0.03, 0.5, spb * 3.6, false, -7); tone(ctx, "triangle", hz(m), nextTime, 0.03, 0.5, spb * 3.6, false, 7); });
          tone(ctx, "sine", hz(bass[bar]), nextTime, 0.16, 0.01, spb * 1.8);
        }
        if (s === 10) tone(ctx, "sine", hz(bass[bar] + 7), nextTime, 0.12, 0.01, spb * 1.2);
        if (s === 0 || s === 10) kick(ctx, nextTime);
        if (s % 4 === 2) hat(ctx, nextTime, 0.05);
        if (s % 2 === 0) tone(ctx, "square", hz(chord[arpOrder[(s / 2) % 8]] + 12), nextTime, 0.022, 0.005, 0.16, true);
        nextTime += s16 * (s % 2 ? 0.88 : 1.12);
        step++;
      }
    }
    let special = null;
    let vol = parseFloat(store.get("jh-vol"));
    if (!(vol >= 0 && vol <= 1)) vol = 0.5;
    const synthLevel = () => 0.9;
    const curve = (v) => v * v; // feels more natural than linear
    let out = null;
    function output(ctx) {
      if (!out) { out = ctx.createGain(); out.gain.value = curve(vol); out.connect(ctx.destination); }
      return out;
    }
    // send an <audio> element through the same volume control
    function routeEl(el) {
      const ctx = getCtx();
      if (!ctx) { el.volume = curve(vol); return; }
      try { ctx.createMediaElementSource(el).connect(output(ctx)); el.volume = 1; }
      catch (e) { el.volume = curve(vol); }
    }
    function setUI() {
      const on = playing;
      $("#radio").classList.toggle("is-on", on);
      $("#radioBtn").innerHTML = icon(on ? "pause" : "play");
      $("#radioBtn").setAttribute("aria-pressed", String(on));
      $("#radioBtn").setAttribute("aria-label", on ? "Pause radio" : "Play radio");
      $("#radioTrack").textContent = special ? `${special.title}${on ? "" : " (paused)"}` : on ? (tracks.length ? tracks[ti].title : "Synth loop, live from your browser") : "Off air";
    }
    function start() {
      if (special) { special.play(); playing = true; setUI(); return; }
      if (tracks.length) {
        if (!audioEl) { audioEl = new Audio(); routeEl(audioEl); }
        audioEl.src = tracks[ti].src;
        audioEl.onended = () => { ti = (ti + 1) % tracks.length; start(); };
        audioEl.play().catch(() => toast("Couldn't play that track"));
        playing = true; setUI(); return;
      }
      const ctx = getCtx(); if (!ctx) { toast("Audio isn't available in this browser"); return; }
      if (!master) build(ctx);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(synthLevel(), ctx.currentTime + 0.8);
      nextTime = ctx.currentTime + 0.06; step = 0;
      clearInterval(timer); timer = setInterval(schedule, 25);
      playing = true; setUI();
    }
    function stop() {
      if (special) special.pause();
      if (audioEl) audioEl.pause();
      if (master && actx) {
        master.gain.cancelScheduledValues(actx.currentTime);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), actx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.3);
        setTimeout(() => clearInterval(timer), 320);
      }
      playing = false; setUI();
    }
    function setSpecial(src) {
      if (playing) stop();
      special = src; setUI();
    }
    function mark(on) { playing = on; setUI(); }
    function setVolume(v) {
      vol = Math.min(1, Math.max(0, v));
      store.set("jh-vol", String(vol));
      if (out && actx) out.gain.setTargetAtTime(curve(vol), actx.currentTime, 0.04);
      if (special && special.setVolume) special.setVolume(vol);
    }
    // the special track finished: go back to the regular loop
    function endSpecial() { special = null; playing = false; start(); }
    return { toggle() { playing ? stop() : start(); }, setUI, setSpecial, mark, setVolume, endSpecial, routeEl, get playing() { return playing; }, get volume() { return vol; } };
  })();

  /* =========================================================
     SECTIONS + VIEWS
     ========================================================= */
  const viewHead = (label, title, meta, cls = "") =>
    `<span class="px v-label">${esc(label)}</span><h2 class="v-title ${cls}" id="screenTitle">${esc(title)}</h2>${meta ? `<p class="v-meta">${esc(meta)}</p>` : ""}`;
  const plist = (arr) => `<ul class="plist">${arr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const chips = (arr) => `<div class="chips">${arr.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;

  const profileCard = () => card({ color: "mustard", title: P.handle, foot: egg.on ? "you found the secret" : "web developer, wichita ks", photo: P.photo, secret: egg.on ? S.easterEgg.photo : "" });
  const careerColors = ["lavender", "cobalt", "salmon", "cyan", "mint"];
  const eduColors = ["cobalt", "mint", "salmon", "cyan", "mustard"];
  const shortSchool = (s) => s.replace("Community College", "CC").replace("State University", "State").replace("University", "");

  const SECTIONS = [
    {
      id: "profile", name: "Profile", caption: "who's this guy?", kana: "プロフィール", color: "mustard",
      art: { x: 0.14, y: 0.62, s: 1, r: 0 },
      items: [
        { label: "About", render: () => `
          <div class="view">${profileCard()}
            <div class="v-main">
              ${viewHead(`${P.role}, ${P.location}`, "Hey, I'm Jordan.", `${P.title}.${P.relocate ? " Open to relocation." : ""}`)}
              <div class="v-text">${S.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
              <div class="actions">${ext(P.resume, "Open resume", "btn", "file")}${ext(P.linkedin, "LinkedIn", "btn ghost", "linkedin")}${ext(P.github, "GitHub", "btn ghost", "github")}</div>
              <span class="px v-h">Right now</span>
              <div class="rows">${S.now.map((n) => `<div class="row"><span class="px">${esc(n.label)}</span><span>${esc(n.text)}</span></div>`).join("")}</div>
            </div></div>` },
        { label: "Journey", render: () => `
          <div class="view">${card({ seed: "journey", color: "cyan", motif: "clover", title: "The long way", foot: "business school to web dev" })}
            <div class="v-main">
              ${viewHead("Profile", "How I got here", "I kept stacking credits until web development clicked.")}
              <div class="rows">${S.journey.map((j) => `<div class="row"><span class="px">${esc(j.when)}</span><span>${esc(j.text)}</span></div>`).join("")}</div>
            </div></div>` },
        { label: "Off the clock", render: () => `
          <div class="view">${card({ seed: "offclock", color: "salmon", motif: "gear", title: "Off the clock", foot: "loud music, good design, cool tech" })}
            <div class="v-main">
              ${viewHead("Profile", "Off the clock", "If you want to talk about code, music or video games, hit me up.")}
              <div class="rows">${S.interests.map((n) => `<div class="row"><span class="px">${esc(n.name)}</span><span>${esc(n.note)}</span></div>`).join("")}</div>
            </div></div>` }
      ]
    },
    {
      id: "work", name: "Work", caption: "stuff I've shipped", kana: "ワークス", color: "cyan",
      art: { x: 0.2, y: 0.4, s: 1.15, r: 0 },
      items: S.projects.map((p) => ({
        label: p.title,
        render: () => `
          <div class="view">${card({ seed: p.id, color: p.color, motif: p.motif, title: p.title, foot: p.footnote, image: p.image, logo: p.logo, logoDark: p.logoDark, logoBg: p.logoBg, mark: p.brand })}
            <div class="v-main">
              ${viewHead(`${p.kind}, ${p.year}`, p.title, `For ${p.client}`)}
              <div class="v-text"><p>${esc(p.summary)}</p></div>
              ${p.stats ? `<div class="stats">${p.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>` : ""}
              ${plist(p.points)}
              <span class="px v-h">Built with</span>${chips(p.stack)}
              ${p.url ? `<div class="actions">${ext(p.url, "Visit the live site")}</div>` : ""}
            </div></div>`
      }))
    },
    {
      id: "career", name: "Career", caption: "where I've worked", kana: "キャリア", color: "lavender",
      art: { x: 0.1, y: 0.75, s: 0.9, r: 45 },
      items: S.experience.map((e, i) => ({
        label: e.company,
        render: () => `
          <div class="view">${card({ seed: e.company + i, color: careerColors[i % careerColors.length], motif: ["cross", "gear", "clover"][i % 3], title: e.company, foot: e.dates, logo: e.logo, logoDark: e.logoDark, mark: e.short || e.company })}
            <div class="v-main">
              ${viewHead(e.dates, e.role, `at ${e.company}`)}
              ${plist(e.points)}
              <span class="px v-h">Tools</span>${chips(e.stack)}
            </div></div>`
      }))
    },
    {
      id: "skills", name: "Skills", caption: "tools in the kit", kana: "スキル", color: "salmon",
      art: { x: 0.18, y: 0.5, s: 1.3, r: 0 },
      items: [{
        label: "All skills",
        render: () => `
          <div class="view solo"><div class="v-main">
            ${viewHead("Skills", "Tools in the kit", "Front end is home base. The rest is what it takes to ship marketing sites that perform.")}
            <div class="skills">${S.skills.map((g) => `<div class="skill"><div><b>${esc(g.group)}</b><small>${esc(g.note)}</small></div>${chips(g.items)}</div>`).join("")}</div>
          </div></div>`
      }]
    },
    {
      id: "education", name: "School", caption: "degrees + coursework", kana: "スクール", color: "mint",
      art: { x: 0.12, y: 0.3, s: 1, r: 45 },
      items: S.education.map((d, i) => ({
        label: d.degree,
        render: () => `
          <div class="view">${card({ seed: d.degree, color: eduColors[i % eduColors.length], motif: ["gear", "cross", "clover", "gear"][i % 4], title: shortSchool(d.school), logo: d.logo, mark: d.short || shortSchool(d.school), foot: d.gpa ? `${d.date}, ${d.gpa} GPA` : d.date })}
            <div class="v-main">
              ${viewHead(d.school, d.degree, [d.date, d.focus ? `Concentration in ${d.focus}` : "", d.gpa ? `${d.gpa} GPA` : ""].filter(Boolean).join(". "), "sm")}
              <span class="px v-h">${esc(d.coursesLabel || "Key courses")}</span>
              <div class="courses">${d.courses.map(([c, t]) => `<div class="course"><span>${esc(c)}</span><span>${esc(t)}</span></div>`).join("")}</div>
            </div></div>`
      }))
    },
    {
      id: "contact", name: "Contact", caption: "say hi", kana: "コンタクト", color: "butter",
      art: { x: 0.16, y: 0.55, s: 1.05, r: 0 },
      items: [{
        label: "Contact",
        render: () => `
          <div class="view">${card({ seed: "contact", color: "cobalt", motif: "atom", title: "Say hi", foot: "replies within a day or two" })}
            <div class="v-main">
              ${viewHead(`${P.location}${P.relocate ? ", open to relocation" : ""}`, "Say hi.", "")}
              <div class="v-text"><p>Email is the fastest way to reach me. I'm open to web production, e-commerce, martech and front-end roles, and happy to relocate anywhere with great companies, New York especially.</p></div>
              <div class="email-box"><code>${esc(P.email)}</code><button class="btn" type="button" data-copy="${esc(P.email)}">Copy email${icon("copy")}</button></div>
              <div class="actions">
                <a class="btn ghost" href="mailto:${esc(P.email)}">Open in your email app${icon("mail")}</a>
                ${ext(P.linkedin, "LinkedIn", "btn ghost", "linkedin")}
                ${ext(P.github, "GitHub", "btn ghost", "github")}
                ${ext(P.resume, "Resume (PDF)", "btn ghost", "file")}
              </div>
            </div></div>`
      }]
    }
  ];

  /* =========================================================
     STATE + ELEMENTS
     ========================================================= */
  const egg = { on: false, keys: [], taps: [], lastFocus: null };
  const state = { sec: 0, item: SECTIONS.map(() => 0), mode: "site", ready: false };
  const el = {
    body: document.body, stage: $("#stage"), menu: $("#menu"), art: $("#stageArt"), screen: $("#screen"),
    bodyView: $("#screenBody"), index: $("#screenIndex"), label: $("#screenLabel"), pager: $("#pager"),
    count: $("#pagerCount"), prev: $("#prevBtn"), next: $("#nextBtn"), slateKana: $("#slateKana"),
    slateSub: $("#slateSub"), slate: $("#slate"), slateMark: $("#slateMark"), sfxBtn: $("#sfxBtn"), modeSwitch: $("#modeSwitch"),
    recruiter: $("#recruiter"), loader: $("#loader"), toast: $("#toast"), announce: $("#announce")
  };

  /* ---------- Static bits ---------- */
  $("#brandMark").innerHTML = glyphSVG("atom", [COLORS.ink]);
  $("#radioStation").textContent = (S.radio && S.radio.station) || "JH-FM";
  $("#year").textContent = new Date().getFullYear();
  el.slateMark.innerHTML = `<svg viewBox="0 0 28 22" aria-hidden="true"><path d="M9 2h6L8 20H2zM21 2h6l-7 18h-6z" fill="${COLORS.signal}"/></svg>`;

  function renderMenu() {
    el.menu.innerHTML = SECTIONS.map((s, i) => `
      <button class="mi" type="button" data-sec="${i}" aria-current="false">
        <svg class="mi-rib" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path d="${ribbonPath(300)}"/></svg>
        <span class="mi-word">${esc(s.name)}.</span>
        <span class="mi-cap">${esc(s.caption)}</span>
        <span class="mi-btn" aria-hidden="true">${icon("plus")}</span>
      </button>`).join("");
  }

  // Stage background: concentric rounded crosses
  let artGroup = null;
  function renderArt() {
    const w = el.stage.clientWidth, h = el.stage.clientHeight;
    el.art.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.art.innerHTML = `<g id="artG">${rings(0, 0, 22, { a0: 30, h0: 170, step: 26, op: 0.5 })}</g>`;
    artGroup = $("#artG", el.art);
    poseArt(false);
  }
  function poseArt(animate) {
    if (!artGroup) return;
    const a = SECTIONS[state.sec].art, w = el.stage.clientWidth, h = el.stage.clientHeight;
    const flow = isFlow();
    const x = flow ? w * 0.5 : w * a.x + 120, y = flow ? 220 : h * a.y;
    const tr = { x, y, scale: a.s, rotation: a.r, svgOrigin: "0 0" };
    if (G && animate && !reduced) G.to(artGroup, { ...tr, duration: 0.9, ease: "power3.out" });
    else if (G) G.set(artGroup, tr);
    else artGroup.setAttribute("transform", `translate(${x} ${y}) scale(${a.s}) rotate(${a.r})`);
  }
  // On phones the page scrolls. When the content changes, bring the screen
  // back to just under the sticky tabs so the layout doesn't jump around.
  function settleScroll() {
    if (!isFlow() || !state.ready) return;
    const tabs = el.menu.getBoundingClientRect();
    const target = window.scrollY + el.slate.getBoundingClientRect().top - tabs.height;
    if (window.scrollY > target + 1) window.scrollTo({ top: target, behavior: "auto" });
  }
  const isFlow = () => window.matchMedia("(max-width: 900px), (max-height: 600px)").matches;

  /* ---------- Katakana scramble ---------- */
  const KANA = S.katakana ? "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ#+*";
  let scrambleTimer = 0;
  function scramble(node, text) {
    clearInterval(scrambleTimer);
    if (reduced) { node.textContent = text; return; }
    let i = 0;
    scrambleTimer = setInterval(() => {
      i++;
      node.textContent = [...text].map((ch, k) => (k < i - 2 ? ch : KANA[Math.floor(Math.random() * KANA.length)])).join("");
      if (i > text.length + 2) { clearInterval(scrambleTimer); node.textContent = text; }
    }, 38);
  }

  /* ---------- Render screen ---------- */
  function renderScreen(dir = 0) {
    const s = SECTIONS[state.sec], n = s.items.length, i = state.item[state.sec];
    const it = s.items[i];
    el.bodyView.innerHTML = it.render();
    el.bodyView.scrollTop = 0;
    el.label.textContent = `Sec ${pad2(state.sec + 1)} // ${s.name}`;
    el.pager.hidden = n < 2;
    el.count.textContent = `${pad2(i + 1)} / ${pad2(n)}`;
    el.prev.disabled = i === 0;
    el.next.disabled = i === n - 1;
    el.index.innerHTML = n < 2 ? "" : s.items.map((x, k) =>
      `<button class="ix" type="button" data-item="${k}" title="${esc(x.label)}" aria-label="${esc(x.label)}" aria-current="${k === i}">${pad2(k + 1)}</button>`).join("");
    el.announce.textContent = n > 1 ? `${s.name}: ${it.label}, ${i + 1} of ${n}` : s.name;
    if (G && !reduced && state.ready) {
      const view = el.bodyView.firstElementChild;
      if (dir) {
        G.fromTo(view, { x: 36 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.38, ease: "power3.out" });
      } else {
        const c = view.querySelector(".card");
        if (c) G.fromTo(c, { scale: 0.85, rotation: -6, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(1.8)" });
        G.fromTo(view.querySelectorAll(".v-main > *"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.035, ease: "power2.out" });
      }
      const flowers = view.querySelectorAll(".card-art .pop");
      if (flowers.length) G.from(flowers, { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.05, ease: "back.out(2)", delay: 0.1 });
    }
    writeHash();
  }

  function setSection(i, opts = {}) {
    const n = SECTIONS.length;
    const next = Math.max(0, Math.min(n - 1, i));
    if (next === state.sec && !opts.force) return;
    state.sec = next;
    const s = SECTIONS[next];
    $$(".mi", el.menu).forEach((b, k) => b.setAttribute("aria-current", String(k === next)));
    const col = COLORS[s.color];
    if (G && state.ready && !reduced) G.to(el.stage, { "--sec": col, duration: 0.45, ease: "power2.out" });
    else el.stage.style.setProperty("--sec", col);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", col);
    scramble(el.slateKana, S.katakana ? s.kana : s.name.toUpperCase());
    el.slateSub.textContent = `Entering section ${pad2(next + 1)}`;
    if (G && state.ready && !reduced) G.fromTo(el.slateMark, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
    poseArt(state.ready);
    renderScreen(0);
    settleScroll();
    if (isFlow()) {
      const btn = el.menu.children[next];
      btn?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduced ? "auto" : "smooth" });
    }
    if (!opts.silent) sfx.play("section");
  }

  function setItem(i, opts = {}) {
    const n = SECTIONS[state.sec].items.length;
    const next = Math.max(0, Math.min(n - 1, i));
    const cur = state.item[state.sec];
    if (next === cur) { if (!opts.silent && n > 1) bump(i < cur ? -1 : 1); return; }
    state.item[state.sec] = next;
    renderScreen(next > cur ? 1 : -1);
    settleScroll();
    if (!opts.silent) sfx.play("move");
  }
  function bump(dir) {
    if (!G || reduced) return;
    G.fromTo(el.bodyView.firstElementChild, { x: 0 }, { x: 8 * dir, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" });
  }

  /* ---------- Hash routing: #work, #work-3, #recruiter ---------- */
  function writeHash() {
    if (state.mode !== "site") return;
    const s = SECTIONS[state.sec], i = state.item[state.sec];
    const h = s.items.length > 1 && i > 0 ? `${s.id}-${i + 1}` : s.id;
    try { history.replaceState(null, "", `#${h}`); } catch (e) { /* ignore */ }
  }
  function readHash() {
    const h = location.hash.slice(1);
    if (!h) return null;
    if (h === "recruiter") return { recruiter: true };
    const m = h.match(/^([a-z]+)(?:-(\d+))?$/);
    if (!m) return null;
    const si = SECTIONS.findIndex((s) => s.id === m[1]);
    if (si < 0) return null;
    const ii = m[2] ? Math.max(0, Math.min(SECTIONS[si].items.length - 1, +m[2] - 1)) : 0;
    return { sec: si, item: ii };
  }

  /* ---------- Toast + copy ---------- */
  let toastT = 0;
  function toast(text) {
    el.toast.textContent = text;
    el.toast.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => el.toast.classList.remove("is-on"), 1900);
  }
  function copyText(text, btn) {
    const done = () => { toast("Email copied"); sfx.play("select"); };
    const fallback = () => {
      const code = btn?.parentElement?.querySelector("code");
      if (code) { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      toast("Press Ctrl+C or ⌘C to copy");
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }

  /* ---------- SFX toggle ---------- */
  function setSfx(on, quiet) {
    sfx.on = on;
    store.set("jh-sfx", on ? "on" : "off");
    el.sfxBtn.textContent = on ? "Sfx on" : "Sfx off";
    el.sfxBtn.setAttribute("aria-pressed", String(on));
    if (on) { getCtx(); if (!quiet) sfx.play("select"); }
    if (!quiet) toast(on ? "Sound effects on" : "Sound effects off");
  }

  /* =========================================================
     RECRUITER MODE
     ========================================================= */
  function renderRecruiter() {
    el.recruiter.innerHTML = `
      <div class="r-top">
        <a class="brand" href="#profile" data-site><span class="brand-mark" aria-hidden="true">${glyphSVG("atom", [COLORS.ink])}</span><span class="brand-text"><span class="brand-name">${esc(P.name)}</span></span></a>
        <button class="switch" type="button" role="switch" aria-checked="true" data-site>
          <span class="switch-label">Recruiter mode</span><span class="switch-track" aria-hidden="true"><span class="switch-knob"></span></span>
        </button>
      </div>
      <header class="r-head">
        <img src="${esc(P.photo)}" alt="${esc(P.name)}" width="108" height="108">
        <div><h1>${esc(P.name)}</h1><p>${esc(P.title)}. ${esc(P.location)}${P.relocate ? ", open to relocation" : ""}.</p></div>
      </header>
      <p class="r-summary">${esc(P.summary)}</p>
      <div class="actions r-actions">
        ${ext(P.resume, "Open resume (PDF)", "btn", "file")}
        ${ext(P.linkedin, "LinkedIn", "btn ghost", "linkedin")}
        ${ext(P.github, "GitHub", "btn ghost", "github")}
        <button class="btn ghost" type="button" data-copy="${esc(P.email)}">Copy email${icon("copy")}</button>
      </div>
      <p class="r-email">Email: <code>${esc(P.email)}</code></p>

      <section class="r-section"><h2>Experience</h2>
        ${S.experience.map((e) => `
          <article class="r-job"><div class="when">${esc(e.dates)}</div><div>
            <h3>${esc(e.role)} <span>at ${esc(e.company)}</span></h3>
            <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
            <div class="r-stack">${e.stack.map(esc).join(", ")}</div>
          </div></article>`).join("")}
      </section>

      <section class="r-section"><h2>Selected work</h2>
        <div class="r-work">${S.projects.map((p) => {
          const tag = p.url ? "a" : "div";
          const attrs = p.url ? ` href="${esc(p.url)}" target="_blank" rel="noopener"` : "";
          return `<${tag} class="r-proj" style="--c:${COLORS[p.color] || COLORS.cyan}"${attrs}>
            <h3>${esc(p.title)}</h3><div class="kind">${esc(p.kind)} for ${esc(p.client)}, ${esc(p.year)}</div>
            <p>${esc(p.summary)}</p><div class="r-stack">${p.stack.map(esc).join(", ")}</div></${tag}>`;
        }).join("")}</div>
      </section>

      <section class="r-section"><h2>Skills</h2>
        ${S.skills.map((g) => `<div class="r-skill"><b>${esc(g.group)}</b><span>${g.items.map(esc).join(", ")}</span></div>`).join("")}
      </section>

      <section class="r-section"><h2>Education</h2>
        ${S.education.map((d) => `
          <div class="r-edu"><div><h3>${esc(d.degree)}</h3><div class="school">${esc(d.school)}${d.focus ? `, ${esc(d.focus)}` : ""}</div></div>
          <div class="when">${esc(d.date)}${d.gpa ? `<br>${esc(d.gpa)} GPA` : ""}</div></div>`).join("")}
      </section>

      <p class="r-foot">Want the full experience? Turn off recruiter mode at the top of the page.</p>`;
  }

  function setMode(mode, opts = {}) {
    state.mode = mode;
    const rec = mode === "recruiter";
    if (rec) renderRecruiter();
    el.recruiter.hidden = !rec;
    el.body.classList.toggle("is-recruiter", rec);
    el.modeSwitch.setAttribute("aria-checked", String(rec));
    if (rec) {
      try { history.replaceState(null, "", "#recruiter"); } catch (e) { /* ignore */ }
      window.scrollTo(0, 0);
      if (!opts.silent) $(".switch", el.recruiter)?.focus({ preventScroll: true });
    } else {
      writeHash();
      requestAnimationFrame(() => { renderArt(); if (!opts.silent) el.modeSwitch.focus({ preventScroll: true }); });
    }
    if (!opts.silent) sfx.play(rec ? "select" : "back");
  }

  /* =========================================================
     LOADER + INTRO
     ========================================================= */
  function buildLoader() {
    if (!S.katakana) {
      const k = $(".loader-kana");
      k.removeAttribute("data-kana"); k.textContent = P.name.toUpperCase();
      $("#loaderName").textContent = `${P.role}, ${P.location}`;
    }
    $("#loaderGlyphs").innerHTML =
      glyphSVG("cross", [COLORS.paper, COLORS.cyan, COLORS.mustard]) +
      glyphSVG("gear", [COLORS.mustard, COLORS.paper, COLORS.cobalt]) +
      glyphSVG("clover", [COLORS.cobalt, COLORS.paper, COLORS.mustard]);
    const w = window.innerWidth, h = window.innerHeight;
    const art = $("#loaderArt");
    art.setAttribute("viewBox", `0 0 ${w} ${h}`);
    art.innerHTML = `<g transform="translate(${w / 2} ${h / 2})">${rings(0, 0, 18, { a0: 40, h0: 200, step: 30, stroke: COLORS.mustard, op: 0.9, sw: 1.4 })}</g>`;
    $(".eb-ico").innerHTML = icon("sound");
  }

  function runLoader() {
    return new Promise((resolve) => {
      el.loader.hidden = false;
      buildLoader();
      const fill = $("#meterFill"), pct = $("#meterPct"), enter = $("#enter"), meter = $("#meter");
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const minTime = reduced ? 200 : 1300;
      const t0 = performance.now();
      let done = false, fontsOk = false;
      fontsReady.then(() => { fontsOk = true; });
      if (G && !reduced) {
        G.from("#loaderGlyphs svg", { scale: 0, rotation: -90, duration: 0.7, stagger: 0.12, ease: "back.out(2)" });
        G.from(".loader-kana, .loader-name", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: "power2.out" });
        G.from("#loaderArt g", { scale: 0.6, opacity: 0, duration: 1.2, svgOrigin: "0 0", ease: "power3.out" });
      }
      function tick() {
        const p = Math.min(1, (performance.now() - t0) / minTime);
        const shown = fontsOk ? p : Math.min(p, 0.9);
        fill.style.width = `${Math.round(shown * 100)}%`;
        pct.textContent = `${String(Math.round(shown * 100)).padStart(3, "0")}%`;
        if (shown >= 1 && !done) { done = true; showEnter(); return; }
        requestAnimationFrame(tick);
      }
      function showEnter() {
        meter.hidden = true;
        enter.hidden = false;
        if (G && !reduced) G.from(".enter-btn", { y: 10, opacity: 0, duration: 0.35, stagger: 0.07, ease: "back.out(2)" });
        $(".enter-btn", enter).focus({ preventScroll: true });
      }
      requestAnimationFrame(tick);
      enter.addEventListener("click", (e) => {
        const b = e.target.closest("[data-enter]");
        if (!b) return;
        const withSound = b.dataset.enter === "sound";
        setSfx(withSound, true);
        if (withSound) sfx.play("select");
        resolve("site");
      });
      $("#loaderRecruiter").addEventListener("click", () => resolve("recruiter"));
    });
  }

  function hideLoader() {
    session.set("jh-entered", "1");
    return new Promise((res) => {
      if (!G || reduced) { el.loader.hidden = true; res(); return; }
      el.loader.classList.add("is-out");
      G.timeline({ onComplete: () => { el.loader.hidden = true; res(); } })
        .to("#loaderGlyphs svg", { scale: 0, rotation: 90, duration: 0.3, stagger: 0.05, ease: "back.in(2)" })
        .to(el.loader, { clipPath: "inset(50% 0 50% 0)", duration: 0.4, ease: "power3.in" }, "-=0.1");
    });
  }

  function intro() {
    if (!G || reduced) return;
    const tl = G.timeline();
    tl.fromTo(el.stage, { scaleY: 0.006, scaleX: 0.3 }, { scaleX: 1, duration: 0.28, ease: "power2.out" })
      .to(el.stage, { scaleY: 1, duration: 0.42, ease: "power4.out" })
      .from(".topbar > *", { y: -14, opacity: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" }, "-=0.15")
      .from(".mi", { x: -50, opacity: 0, duration: 0.45, stagger: 0.05, ease: "back.out(1.6)" }, "-=0.25")
      .fromTo(el.screen, { clipPath: "inset(0 0 100% 0 round 18px)" }, { clipPath: "inset(0 0 0% 0 round 18px)", duration: 0.5, ease: "power3.inOut" }, "-=0.45")
      .from(".slate > *", { x: -16, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.3")
      .add(() => { G.set(el.screen, { clearProps: "clipPath" }); G.set(el.stage, { clearProps: "transform" }); });
    G.from("#artG", { opacity: 0, duration: 1.2, delay: 0.4 });
  }

  /* =========================================================
     EASTER EGG
     ========================================================= */
  function triggerEgg() {
    const E = S.easterEgg;
    if (!E) return;
    if (state.mode !== "site") setMode("site", { silent: true });
    const first = !egg.on;
    egg.on = true;
    state.item[0] = 0;
    if (state.sec !== 0) setSection(0, { force: true, silent: true });
    else renderScreen(0);
    // fade the photo
    const sec = el.bodyView.querySelector(".card-photo.secret");
    if (sec && first) {
      sec.classList.remove("is-on");
      requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add("is-on")));
    }
    sfx.play("unlock");
    if (isFlow()) window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    if (first) startEggSong();
    // let the photo swap land before the popup covers it
    setTimeout(openEggPopup, first ? 1500 : 0);
  }

  function startEggSong() {
    const song = S.easterEgg.song || {};
    const title = `${song.title || "Secret track"}, made by me`;
    if (song.src) {
      const a = new Audio(song.src);
      radio.routeEl(a);
      let active = true; // false once the song is done and the loop has taken over
      a.addEventListener("play", () => { if (active) radio.mark(true); });
      a.addEventListener("pause", () => { if (active && !a.ended) radio.mark(false); });
      a.addEventListener("ended", () => { if (!active) return; active = false; radio.endSpecial(); });
      radio.setSpecial({ title, play: () => a.play().catch(() => {}), pause: () => a.pause() });
      a.play().then(() => radio.mark(true)).catch(() => toast("Press play on the radio to hear it"));
      return;
    }
    if (!song.soundcloud) return;
    // SoundCloud player lives in the popup; the radio button controls it
    let widget = null;
    radio.setSpecial({ title, play: () => widget && widget.play(), pause: () => widget && widget.pause(), setVolume: (v) => widget && widget.setVolume(Math.round(v * 100)) });
    radio.mark(true);
    const s = document.createElement("script");
    s.src = "https://w.soundcloud.com/player/api.js";
    s.onload = () => {
      const frame = $("#eggPlayer iframe");
      if (!frame || !window.SC) return;
      widget = window.SC.Widget(frame);
      const E = window.SC.Widget.Events;
      const level = () => widget.setVolume(Math.round(radio.volume * 100));
      widget.bind(E.READY, () => { level(); widget.play(); });
      widget.bind(E.PLAY, () => { level(); radio.mark(true); });
      widget.bind(E.PAUSE, () => radio.mark(false));
      widget.bind(E.FINISH, () => radio.endSpecial());
    };
    s.onerror = () => radio.mark(false);
    document.head.appendChild(s);
  }

  function openEggPopup() {
    const song = S.easterEgg.song || {};
    let pop = $("#egg");
    if (!pop) {
      pop = document.createElement("div");
      pop.id = "egg"; pop.className = "egg"; pop.hidden = true;
      pop.setAttribute("role", "dialog"); pop.setAttribute("aria-modal", "true"); pop.setAttribute("aria-labelledby", "eggTitle");
      const sc = song.soundcloud && !song.src
        ? `<div class="egg-player" id="eggPlayer"><iframe title="${esc(song.title)} on SoundCloud" allow="autoplay" src="${esc(song.soundcloudPlayer ? song.soundcloudPlayer.replace("auto_play=true", "auto_play=false") : `https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundcloud)}&color=%23e4532f&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=false`)}"></iframe></div>`
        : "";
      pop.innerHTML = `
        <div class="egg-win">
          <div class="egg-bar"><span class="px">Achievement unlocked</span><button class="px-btn dark" type="button" data-egg-close>Close ✕</button></div>
          <div class="egg-body">
            <div class="egg-glyphs" aria-hidden="true">${glyphSVG("gear", [COLORS.mustard, COLORS.paper, COLORS.signal])}${glyphSVG("cross", [COLORS.cyan, COLORS.paper, COLORS.mustard])}${glyphSVG("clover", [COLORS.salmon, COLORS.paper, COLORS.cobalt])}</div>
            <h2 class="egg-title" id="eggTitle">You found the secret.</h2>
            <p>Now playing “${esc(song.title || "my track")}”, a song I made. It's on the radio up top, so you can pause it any time.</p>
            ${sc}
            ${song.soundcloud ? `<div class="actions">${ext(song.soundcloud, "Open on SoundCloud")}</div>` : ""}
          </div>
        </div>`;
      document.body.appendChild(pop);
      pop.addEventListener("click", (e) => { if (e.target === pop || e.target.closest("[data-egg-close]")) closeEggPopup(); });
    }
    egg.lastFocus = document.activeElement;
    pop.hidden = false;
    if (G && !reduced) {
      G.fromTo(".egg-win", { scale: 0.6, rotation: -4, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.8)" });
      G.from(".egg-glyphs svg", { scale: 0, rotation: -120, duration: 0.6, stagger: 0.1, ease: "back.out(2)", delay: 0.15 });
    }
    $("[data-egg-close]", pop).focus({ preventScroll: true });
  }
  function closeEggPopup() {
    const pop = $("#egg");
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    sfx.play("back");
    egg.lastFocus?.focus?.({ preventScroll: true });
  }

  /* =========================================================
     INPUT
     ========================================================= */
  document.addEventListener("keydown", (e) => {
    if ($("#egg") && !$("#egg").hidden) { if (e.key === "Escape") closeEggPopup(); return; }
    if (state.mode !== "site" || !state.ready || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    const code = (S.easterEgg && S.easterEgg.code) || [];
    egg.keys.push(k.length === 1 ? k.toLowerCase() : k);
    if (egg.keys.length > code.length) egg.keys.shift();
    if (code.length && egg.keys.join(",") === code.join(",")) { egg.keys = []; triggerEgg(); return; }
    if (k === "ArrowDown") { e.preventDefault(); setSection(state.sec + 1); focusMenu(); }
    else if (k === "ArrowUp") { e.preventDefault(); setSection(state.sec - 1); focusMenu(); }
    else if (k === "ArrowRight") { e.preventDefault(); setItem(state.item[state.sec] + 1); }
    else if (k === "ArrowLeft") { e.preventDefault(); setItem(state.item[state.sec] - 1); }
    else if (/^[1-6]$/.test(k)) { setSection(+k - 1); }
    else if (k === "m" || k === "M") { setSfx(!sfx.on); }
  });
  function focusMenu() {
    const ae = document.activeElement;
    if (!ae || ae === document.body || ae.classList.contains("mi")) el.menu.children[state.sec]?.focus({ preventScroll: true });
  }

  el.menu.addEventListener("click", (e) => {
    const b = e.target.closest(".mi");
    if (b) setSection(+b.dataset.sec);
  });
  el.menu.addEventListener("pointerover", (e) => {
    const b = e.target.closest(".mi");
    if (b && !b.contains(e.relatedTarget) && e.pointerType === "mouse") sfx.play("hover");
  });
  el.prev.addEventListener("click", () => setItem(state.item[state.sec] - 1));
  el.next.addEventListener("click", () => setItem(state.item[state.sec] + 1));
  el.index.addEventListener("click", (e) => {
    const b = e.target.closest(".ix");
    if (b) setItem(+b.dataset.item);
  });
  el.sfxBtn.addEventListener("click", () => setSfx(!sfx.on));
  $("#radioBtn").addEventListener("click", () => radio.toggle());
  const volEl = $("#radioVol");
  volEl.value = Math.round(radio.volume * 100);
  volEl.addEventListener("input", () => radio.setVolume(volEl.value / 100));
  el.modeSwitch.addEventListener("click", () => setMode("recruiter"));
  $(".brand").addEventListener("click", (e) => {
    e.preventDefault();
    const now = Date.now();
    egg.taps = egg.taps.filter((t) => now - t < 2500);
    egg.taps.push(now);
    if (egg.taps.length >= 5) { egg.taps = []; triggerEgg(); return; }
    setSection(0);
  });

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) { copyText(c.dataset.copy, c); return; }
    const back = e.target.closest("[data-site]");
    if (back) { e.preventDefault(); setMode("site"); }
  });

  // swipe left / right on the screen to browse items
  let sw = null;
  el.bodyView.addEventListener("touchstart", (e) => { if (e.touches.length === 1) sw = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  el.bodyView.addEventListener("touchend", (e) => {
    if (!sw) return;
    const dx = e.changedTouches[0].clientX - sw.x, dy = e.changedTouches[0].clientY - sw.y;
    sw = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) setItem(state.item[state.sec] + (dx < 0 ? 1 : -1));
  });

  window.addEventListener("hashchange", () => {
    const r = readHash();
    if (!r) return;
    if (r.recruiter) { if (state.mode !== "recruiter") setMode("recruiter", { silent: true }); return; }
    if (state.mode !== "site") setMode("site", { silent: true });
    state.item[r.sec] = r.item;
    setSection(r.sec, { force: true, silent: true });
  });

  let rz = 0;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(renderArt, 120); });

  /* ---------- Timecode (elapsed since load, 30fps frames) ---------- */
  const t0 = performance.now();
  const tcNodes = () => $$("[data-tc]");
  setInterval(() => {
    if (document.hidden) return;
    const ms = performance.now() - t0;
    const tc = `${pad2(Math.floor(ms / 60000) % 60)}:${pad2(Math.floor(ms / 1000) % 60)}:${pad2(Math.floor((ms % 1000) / 33.34))}`;
    tcNodes().forEach((n) => { n.textContent = tc; });
  }, 66);

  /* =========================================================
     BOOT
     ========================================================= */
  renderMenu();
  radio.setUI();
  setSfx(sfx.on, true);
  const start = readHash();
  if (start && !start.recruiter) { state.item[start.sec] = start.item; state.sec = start.sec; }
  setSection(state.sec, { force: true, silent: true });
  renderArt();

  if (start && start.recruiter) {
    setMode("recruiter", { silent: true });
    state.ready = true;
  } else if (session.get("jh-entered")) {
    state.ready = true;
  } else {
    el.stage.style.visibility = "hidden";
    runLoader().then(async (choice) => {
      await hideLoader();
      el.stage.style.visibility = "";
      if (choice === "recruiter") { state.ready = true; setMode("recruiter"); return; }
      intro();
      state.ready = true;
      setTimeout(() => el.menu.children[state.sec]?.focus({ preventScroll: true }), 900);
    });
  }
})();
