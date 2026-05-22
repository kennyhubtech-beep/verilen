import { useState, useRef, useCallback, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #04080f;
    --bg2:      #080f1c;
    --bg3:      #0d1829;
    --surface:  #0f1f36;
    --surf2:    #142642;
    --border:   rgba(56,139,253,0.18);
    --border2:  rgba(56,139,253,0.32);
    --blue:     #388bfd;
    --blue2:    #58a6ff;
    --cyan:     #39d0d8;
    --purple:   #a371f7;
    --green:    #3fb950;
    --red:      #f85149;
    --amber:    #e3b341;
    --pink:     #f778ba;
    --text:     #e6edf3;
    --text2:    #8b949e;
    --text3:    #484f58;
    --glow:     0 0 30px rgba(56,139,253,0.25);
    --glowC:    0 0 30px rgba(57,208,216,0.2);
    --r:        12px;
    --r2:       20px;
    --font:     'Syne', sans-serif;
    --body:     'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--surf2); border-radius: 4px; }

  .app { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0;
    height: 100vh; z-index: 100;
    transition: transform 0.3s ease;
  }
  .sidebar.hidden { transform: translateX(-100%); }
  .sidebar-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    font-family: var(--font); font-size: 20px; font-weight: 800;
    background: linear-gradient(135deg, var(--blue2), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; letter-spacing: -0.5px;
  }
  .logo-tag { font-size: 10px; color: var(--text3); font-family: var(--body); margin-top: 1px; letter-spacing: 1px; text-transform: uppercase; }
  .phase-badge {
    display: inline-block; margin-top: 5px;
    font-size: 9px; background: rgba(163,113,247,0.18); color: var(--purple);
    border: 1px solid rgba(163,113,247,0.32); border-radius: 8px;
    padding: 1px 8px; font-family: var(--font); font-weight: 700; letter-spacing: 0.5px;
  }
  .nav-section { padding: 12px 10px 4px; }
  .nav-label { font-size: 9px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; padding: 0 8px; margin-bottom: 4px; font-family: var(--font); }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: var(--r);
    cursor: pointer; font-size: 13.5px; color: var(--text2);
    font-family: var(--body); font-weight: 400;
    transition: all 0.15s; position: relative;
    border: 1px solid transparent; margin-bottom: 2px;
    white-space: nowrap;
  }
  .nav-item:hover { background: var(--surface); color: var(--text); border-color: var(--border); }
  .nav-item.active { background: rgba(56,139,253,0.12); color: var(--blue2); border-color: rgba(56,139,253,0.3); }
  .nav-item.active .nav-icon { color: var(--blue2); }
  .nav-icon { font-size: 16px; width: 18px; text-align: center; flex-shrink: 0; }
  .nav-badge {
    margin-left: auto; background: var(--blue); color: #fff;
    font-size: 9px; border-radius: 10px; padding: 1px 6px;
    font-family: var(--font); font-weight: 700;
  }
  .nav-badge.p2 { background: var(--purple); }
  .sidebar-footer {
    margin-top: auto; padding: 12px 10px;
    border-top: 1px solid var(--border);
  }
  .user-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: var(--r);
    background: var(--surface); cursor: pointer;
    transition: background 0.15s;
  }
  .user-chip:hover { background: var(--surf2); }
  .avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; font-family: var(--font);
    flex-shrink: 0;
  }
  .user-info { min-width: 0; }
  .user-name { font-size: 12px; font-weight: 500; color: var(--text); font-family: var(--font); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-pts { font-size: 10px; color: var(--cyan); }

  /* ── MAIN ── */
  .main { margin-left: 220px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar {
    height: 52px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; border-bottom: 1px solid var(--border);
    background: rgba(4,8,15,0.8); backdrop-filter: blur(16px);
    position: sticky; top: 0; z-index: 50;
  }
  .topbar-title { font-family: var(--font); font-size: 15px; font-weight: 700; color: var(--text); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .pts-pill {
    display: flex; align-items: center; gap: 6px;
    background: rgba(57,208,216,0.1); border: 1px solid rgba(57,208,216,0.3);
    border-radius: 20px; padding: 4px 12px;
    font-size: 12px; font-family: var(--font); font-weight: 600; color: var(--cyan);
  }
  .icon-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; transition: all 0.15s; color: var(--text2);
  }
  .icon-btn:hover { background: var(--surf2); color: var(--text); border-color: var(--border2); }
  .hamburger { display: none; }

  .page { padding: 28px; flex: 1; max-width: 1100px; width: 100%; }

  /* ── CARDS ── */
  .card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px; position: relative; overflow: hidden;
  }
  .card-title { font-family: var(--font); font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .card-value { font-family: var(--font); font-size: 28px; font-weight: 800; color: var(--text); line-height: 1; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 20px; border-radius: var(--r); font-family: var(--font);
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.18s; border: none; letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .btn-primary { background: var(--blue); color: #fff; }
  .btn-primary:hover { background: var(--blue2); box-shadow: 0 4px 20px rgba(56,139,253,0.35); transform: translateY(-1px); }
  .btn-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--surf2); border-color: var(--border2); }
  .btn-cyan { background: var(--cyan); color: #04080f; }
  .btn-cyan:hover { opacity: 0.9; box-shadow: 0 4px 20px rgba(57,208,216,0.3); transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface); color: var(--text); }
  .btn-danger { background: rgba(248,81,73,0.12); color: var(--red); border: 1px solid rgba(248,81,73,0.3); }
  .btn-danger:hover { background: rgba(248,81,73,0.2); }
  .btn-lg { padding: 13px 28px; font-size: 14px; border-radius: 14px; }
  .btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  /* ── FORMS ── */
  .input {
    width: 100%; padding: 10px 14px; border-radius: var(--r);
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); font-family: var(--body); font-size: 14px;
    transition: border-color 0.15s, box-shadow 0.15s; outline: none;
  }
  .input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(56,139,253,0.12); }
  .input::placeholder { color: var(--text3); }
  .label { font-size: 12px; font-family: var(--font); font-weight: 600; color: var(--text2); margin-bottom: 5px; display: block; letter-spacing: 0.3px; }
  .field { margin-bottom: 16px; }
  .error-text { font-size: 11px; color: var(--red); margin-top: 4px; }

  /* ── LANDING ── */
  .landing { min-height: 100vh; display: flex; flex-direction: column; }
  .landing-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 40px; border-bottom: 1px solid var(--border);
    background: rgba(4,8,15,0.9); backdrop-filter: blur(16px);
    position: sticky; top: 0; z-index: 50;
  }
  .hero {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; text-align: center; padding: 80px 24px 60px;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 800px 500px at 50% 0%, rgba(56,139,253,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 400px 400px at 80% 50%, rgba(163,113,247,0.08) 0%, transparent 70%),
      radial-gradient(ellipse 300px 300px at 20% 60%, rgba(57,208,216,0.07) 0%, transparent 70%);
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image: linear-gradient(var(--blue) 1px, transparent 1px),
                      linear-gradient(90deg, var(--blue) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .scan-orbit { position: relative; width: 180px; height: 180px; margin: 0 auto 36px; }
  .scan-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid rgba(56,139,253,0.3);
    animation: spinRing 8s linear infinite;
  }
  .scan-ring:nth-child(2) { inset: 14px; border-color: rgba(57,208,216,0.4); animation-duration: 5s; animation-direction: reverse; }
  .scan-ring:nth-child(3) { inset: 28px; border-color: rgba(163,113,247,0.3); animation-duration: 12s; }
  .scan-dot {
    position: absolute; top: -3px; left: 50%; transform: translateX(-50%);
    width: 6px; height: 6px; border-radius: 50%; background: var(--blue);
    box-shadow: 0 0 10px var(--blue);
  }
  .scan-ring:nth-child(2) .scan-dot { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
  .scan-ring:nth-child(3) .scan-dot { background: var(--purple); box-shadow: 0 0 10px var(--purple); }
  .scan-center {
    position: absolute; inset: 42px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(56,139,253,0.2), rgba(57,208,216,0.1));
    display: flex; align-items: center; justify-content: center; font-size: 40px;
    border: 1px solid rgba(56,139,253,0.35);
    box-shadow: inset 0 0 30px rgba(56,139,253,0.1), var(--glow);
  }
  @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .hero-eyebrow { font-size: 11px; font-family: var(--font); font-weight: 600; color: var(--cyan); text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 16px; position: relative; }
  .hero-title { font-family: var(--font); font-size: clamp(36px, 6vw, 68px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 20px; position: relative; }
  .grad-text { background: linear-gradient(135deg, var(--blue2) 0%, var(--cyan) 50%, var(--purple) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: 17px; color: var(--text2); max-width: 520px; line-height: 1.65; margin-bottom: 36px; position: relative; }
  .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .features-strip { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; padding: 28px 40px; border-top: 1px solid var(--border); background: var(--bg2); }
  .feat-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text2); }
  .feat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); flex-shrink: 0; }

  /* ── AUTH ── */
  .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--bg); background-image: radial-gradient(ellipse 600px 400px at 50% 0%, rgba(56,139,253,0.1) 0%, transparent 70%); }
  .auth-box { width: 100%; max-width: 420px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r2); padding: 36px 32px; }
  .auth-logo { font-family: var(--font); font-size: 22px; font-weight: 800; margin-bottom: 6px; background: linear-gradient(135deg, var(--blue2), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .auth-title { font-family: var(--font); font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .auth-sub { font-size: 13px; color: var(--text2); margin-bottom: 28px; }
  .auth-divider { display: flex; align-items: center; gap: 10px; margin: 18px 0; }
  .auth-divider-line { flex: 1; height: 1px; background: var(--border); }
  .auth-divider-text { font-size: 11px; color: var(--text3); font-family: var(--font); }
  .google-btn { width: 100%; padding: 10px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s; }
  .google-btn:hover { background: var(--surf2); border-color: var(--border2); }
  .auth-switch { text-align: center; margin-top: 20px; font-size: 13px; color: var(--text2); }
  .auth-link { color: var(--blue2); cursor: pointer; font-weight: 500; }
  .auth-link:hover { text-decoration: underline; }
  .welcome-banner { background: linear-gradient(135deg, rgba(57,208,216,0.12), rgba(56,139,253,0.08)); border: 1px solid rgba(57,208,216,0.3); border-radius: var(--r); padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: var(--cyan); display: flex; align-items: center; gap: 8px; }

  /* ── DASHBOARD ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px; position: relative; overflow: hidden; transition: border-color 0.2s; }
  .stat-card:hover { border-color: var(--border2); }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px; }
  .stat-num { font-family: var(--font); font-size: 30px; font-weight: 800; color: var(--text); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text2); margin-top: 4px; }
  .quick-scan-banner { background: linear-gradient(135deg, rgba(56,139,253,0.15), rgba(57,208,216,0.08)); border: 1px solid rgba(56,139,253,0.3); border-radius: var(--r2); padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .qsb-left h3 { font-family: var(--font); font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .qsb-left p { font-size: 13px; color: var(--text2); }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: var(--font); font-size: 15px; font-weight: 700; }
  .scan-row { display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 8px; transition: border-color 0.15s; cursor: pointer; }
  .scan-row:hover { border-color: var(--border2); }
  .scan-thumb { width: 48px; height: 48px; border-radius: 8px; background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; overflow: hidden; }
  .scan-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .scan-info { flex: 1; min-width: 0; }
  .scan-name { font-size: 14px; font-weight: 500; font-family: var(--font); color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .scan-meta { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .scan-cat { font-size: 10px; font-family: var(--font); font-weight: 600; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  .cat-product { background: rgba(56,139,253,0.15); color: var(--blue2); }
  .cat-plant   { background: rgba(63,185,80,0.15);  color: var(--green); }
  .cat-food    { background: rgba(227,179,65,0.15); color: var(--amber); }
  .cat-text    { background: rgba(163,113,247,0.15);color: var(--purple);}
  .cat-barcode { background: rgba(227,179,65,0.15); color: var(--amber); }
  .cat-qr      { background: rgba(57,208,216,0.15); color: var(--cyan); }
  .cat-general { background: rgba(56,139,253,0.1);  color: var(--blue2); }
  .fav-star { cursor: pointer; font-size: 16px; transition: transform 0.15s; flex-shrink: 0; }
  .fav-star:hover { transform: scale(1.25); }
  .empty-state { text-align: center; padding: 48px 24px; background: var(--bg2); border: 1px dashed var(--border); border-radius: var(--r2); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-family: var(--font); font-size: 15px; font-weight: 600; color: var(--text2); margin-bottom: 4px; }
  .empty-sub { font-size: 13px; color: var(--text3); }

  /* ── SCANNER ── */
  .scanner-page { max-width: 720px; }
  .upload-zone { border: 2px dashed var(--border2); border-radius: var(--r2); padding: 60px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--bg2); position: relative; }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--blue); background: rgba(56,139,253,0.04); }
  .upload-zone.has-image { border-style: solid; padding: 0; overflow: hidden; }
  .upload-icon { font-size: 48px; margin-bottom: 12px; }
  .upload-title { font-family: var(--font); font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .upload-sub { font-size: 13px; color: var(--text2); }
  .preview-img { width: 100%; max-height: 320px; object-fit: contain; display: block; }
  .scan-modes { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .mode-btn { flex: 1; min-width: 90px; padding: 10px 12px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--border); color: var(--text2); font-family: var(--font); font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
  .mode-btn.active { background: rgba(56,139,253,0.12); border-color: rgba(56,139,253,0.4); color: var(--blue2); }
  .mode-btn.active.plant  { background: rgba(63,185,80,0.1);  border-color: rgba(63,185,80,0.4);  color: var(--green);  }
  .mode-btn.active.ocr    { background: rgba(163,113,247,0.1);border-color: rgba(163,113,247,0.4);color: var(--purple); }
  .mode-btn.active.barcode{ background: rgba(227,179,65,0.1); border-color: rgba(227,179,65,0.4); color: var(--amber);  }
  .mode-btn.active.qr     { background: rgba(57,208,216,0.1); border-color: rgba(57,208,216,0.4); color: var(--cyan);   }
  .mode-btn:hover { border-color: var(--border2); color: var(--text); }
  .camera-wrap { border-radius: var(--r2); overflow: hidden; position: relative; background: #000; aspect-ratio: 4/3; }
  .camera-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .camera-overlay { position: absolute; inset: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; }
  .scan-frame { width: 200px; height: 200px; position: relative; }
  .scan-frame::before, .scan-frame::after, .scan-frame span::before, .scan-frame span::after { content: ''; position: absolute; width: 30px; height: 30px; border-color: var(--cyan); border-style: solid; }
  .scan-frame::before { top: 0; left: 0; border-width: 3px 0 0 3px; }
  .scan-frame::after  { top: 0; right: 0; border-width: 3px 3px 0 0; }
  .scan-frame span::before { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
  .scan-frame span::after  { bottom: 0; right: 0; border-width: 0 3px 3px 0; }
  .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); animation: scanLine 2s ease-in-out infinite; }
  @keyframes scanLine { 0%,100% { top: 10px; } 50% { top: 185px; } }
  .scan-actions { display: flex; gap: 10px; margin-top: 16px; }
  .analyzing-overlay { position: absolute; inset: 0; background: rgba(4,8,15,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; border-radius: var(--r2); backdrop-filter: blur(6px); }
  .pulse-ring { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--cyan); animation: pulseRing 1.4s ease-in-out infinite; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  @keyframes pulseRing { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } }
  .analyzing-text { font-family: var(--font); font-size: 14px; font-weight: 600; color: var(--cyan); }
  .analyzing-sub { font-size: 12px; color: var(--text3); }

  /* ── MULTI SCAN ── */
  .multi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 14px; }
  .multi-thumb { aspect-ratio: 1; border-radius: var(--r); background: var(--surface); border: 1px solid var(--border); overflow: hidden; position: relative; transition: border-color 0.15s; }
  .multi-thumb:hover { border-color: var(--border2); }
  .multi-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .multi-thumb .rem-btn { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(248,81,73,0.85); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; }
  .multi-thumb .mstat { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(4,8,15,0.8); padding: 4px 6px; font-size: 9px; font-family: var(--font); font-weight: 600; }

  /* ── RESULT CARD ── */
  .result-card { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r2); overflow: hidden; margin-top: 20px; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .result-header { padding: 20px 24px; background: linear-gradient(135deg, rgba(56,139,253,0.12), rgba(57,208,216,0.06)); border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 14px; }
  .result-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
  .result-img-placeholder { width: 72px; height: 72px; border-radius: 10px; background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 32px; flex-shrink: 0; }
  .result-name { font-family: var(--font); font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .result-brand { font-size: 12px; color: var(--text2); margin-bottom: 8px; }
  .result-badges { display: flex; gap: 6px; flex-wrap: wrap; }
  .badge { font-size: 10px; font-family: var(--font); font-weight: 600; padding: 3px 9px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-blue   { background: rgba(56,139,253,0.15); color: var(--blue2); border: 1px solid rgba(56,139,253,0.3); }
  .badge-green  { background: rgba(63,185,80,0.15);  color: var(--green); border: 1px solid rgba(63,185,80,0.3); }
  .badge-amber  { background: rgba(227,179,65,0.15); color: var(--amber); border: 1px solid rgba(227,179,65,0.3); }
  .badge-red    { background: rgba(248,81,73,0.15);  color: var(--red);   border: 1px solid rgba(248,81,73,0.3); }
  .badge-purple { background: rgba(163,113,247,0.15);color: var(--purple);border: 1px solid rgba(163,113,247,0.3); }
  .badge-cyan   { background: rgba(57,208,216,0.15); color: var(--cyan);  border: 1px solid rgba(57,208,216,0.3); }
  .result-body { padding: 20px 24px; }
  .result-section { margin-bottom: 18px; }
  .result-section-title { font-family: var(--font); font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .result-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
  .result-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 10px 12px; }
  .result-item-label { font-size: 10px; color: var(--text3); font-family: var(--font); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .result-item-value { font-size: 13px; color: var(--text); font-weight: 500; }
  .result-list { display: flex; flex-direction: column; gap: 5px; }
  .result-list-item { font-size: 13px; color: var(--text2); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }
  .result-list-item::before { content: '›'; color: var(--blue2); flex-shrink: 0; font-weight: 700; }
  .conf-bar { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
  .conf-track { flex: 1; height: 4px; background: var(--surface); border-radius: 4px; overflow: hidden; }
  .conf-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--blue), var(--cyan)); transition: width 1s ease; }
  .conf-label { font-size: 11px; font-family: var(--font); font-weight: 600; color: var(--cyan); }
  .result-footer { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  /* ── PRICING ── */
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 20px; }
  .price-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r2); padding: 24px; transition: all 0.2s; cursor: pointer; position: relative; }
  .price-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .price-card.popular { border-color: rgba(56,139,253,0.5); }
  .popular-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--blue); color: #fff; font-size: 10px; font-family: var(--font); font-weight: 700; padding: 2px 12px; border-radius: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .price-name { font-family: var(--font); font-size: 14px; font-weight: 700; color: var(--text2); margin-bottom: 10px; }
  .price-pts { font-family: var(--font); font-size: 36px; font-weight: 800; color: var(--text); line-height: 1; }
  .price-pts span { font-size: 14px; color: var(--text3); font-weight: 400; }
  .price-amount { font-size: 18px; font-weight: 700; color: var(--cyan); margin: 8px 0 16px; font-family: var(--font); }
  .price-features { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .price-features li { font-size: 12px; color: var(--text2); display: flex; gap: 6px; }
  .price-features li::before { content: '✓'; color: var(--green); font-weight: 700; flex-shrink: 0; }

  /* ── HISTORY / FILTER ── */
  .history-filter { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .filter-chip { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-family: var(--font); font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); transition: all 0.15s; }
  .filter-chip:hover { border-color: var(--border2); color: var(--text); }
  .filter-chip.active { background: rgba(56,139,253,0.12); border-color: rgba(56,139,253,0.4); color: var(--blue2); }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(4,8,15,0.82); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r2); padding: 28px 28px 24px; width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto; animation: scaleIn 0.2s ease; }
  @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-title { font-family: var(--font); font-size: 18px; font-weight: 700; margin-bottom: 16px; }
  .modal-close { float: right; background: none; border: none; color: var(--text2); cursor: pointer; font-size: 20px; margin-top: -4px; }

  /* ── SCAN DETAIL MODAL ── */
  .detail-modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r2); width: 100%; max-width: 580px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; animation: scaleIn 0.2s ease; }
  .detail-modal-header { padding: 16px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .detail-modal-body { overflow-y: auto; flex: 1; padding: 16px 22px; }
  .detail-modal-footer { padding: 12px 22px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── TOAST ── */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 400; display: flex; flex-direction: column; gap: 8px; }
  .toast { background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--r); padding: 12px 16px; font-size: 13px; font-family: var(--body); color: var(--text); min-width: 240px; max-width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px; animation: toastIn 0.25s ease; }
  @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .toast.success { border-left: 3px solid var(--green); }
  .toast.error   { border-left: 3px solid var(--red); }
  .toast.info    { border-left: 3px solid var(--blue); }

  /* ── SETTINGS ── */
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .avatar-lg { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; color: #fff; font-family: var(--font); flex-shrink: 0; border: 2px solid rgba(56,139,253,0.4); }
  .verified-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(63,185,80,0.12); border: 1px solid rgba(63,185,80,0.3); color: var(--green); font-size: 10px; font-family: var(--font); font-weight: 600; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .settings-tabs { display: flex; gap: 2px; background: var(--surface); border-radius: var(--r); padding: 3px; margin-bottom: 20px; border: 1px solid var(--border); }
  .settings-tab { flex: 1; padding: 7px; border-radius: 8px; font-size: 12px; font-family: var(--font); font-weight: 600; cursor: pointer; text-align: center; color: var(--text2); transition: all 0.15s; }
  .settings-tab.active { background: var(--bg2); color: var(--text); border: 1px solid var(--border); }

  /* ── CHATBOT ── */
  .chat-fab { position: fixed; bottom: 28px; right: 28px; z-index: 300; width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 20px rgba(56,139,253,0.35); transition: all 0.2s; }
  .chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(56,139,253,0.45); }
  .chat-window { position: fixed; bottom: 92px; right: 28px; z-index: 300; width: 340px; background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r2); box-shadow: 0 16px 48px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; animation: chatIn 0.2s ease; }
  @keyframes chatIn { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .chat-header { padding: 14px 16px; background: linear-gradient(135deg, rgba(56,139,253,0.15), rgba(163,113,247,0.08)); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .chat-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .chat-title { font-family: var(--font); font-size: 13px; font-weight: 700; flex: 1; }
  .chat-online { font-size: 10px; color: var(--green); }
  .chat-msgs { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; max-height: 280px; }
  .chat-msg { max-width: 90%; padding: 9px 12px; border-radius: 12px; font-size: 12px; line-height: 1.55; }
  .chat-msg.bot  { background: var(--surface); color: var(--text); align-self: flex-start; border-bottom-left-radius: 3px; }
  .chat-msg.user { background: var(--blue); color: #fff; align-self: flex-end; border-bottom-right-radius: 3px; }
  .chat-msg.thinking { background: var(--surface); color: var(--text3); align-self: flex-start; font-style: italic; }
  .chat-quick { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 12px 10px; }
  .quick-chip { font-size: 10px; font-family: var(--font); font-weight: 600; padding: 3px 9px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .quick-chip:hover { border-color: var(--border2); color: var(--text); }
  .chat-input-row { padding: 10px 12px; border-top: 1px solid var(--border); display: flex; gap: 7px; align-items: center; }
  .chat-input { flex: 1; padding: 7px 11px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--border); color: var(--text); font-size: 12px; font-family: var(--body); outline: none; }
  .chat-input:focus { border-color: var(--blue); }
  .chat-send { width: 30px; height: 30px; border-radius: 8px; background: var(--blue); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #fff; flex-shrink: 0; transition: background 0.15s; }
  .chat-send:hover { background: var(--blue2); }

  /* ── LOW PTS WARNING ── */
  .low-pts-warn { background: rgba(227,179,65,0.08); border: 1px solid rgba(227,179,65,0.3); border-radius: var(--r); padding: 10px 14px; font-size: 12px; color: var(--amber); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; }
    .hamburger { display: flex; }
    .page { padding: 18px; }
    .hero { padding: 60px 18px 40px; }
    .landing-nav { padding: 14px 20px; }
    .settings-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .result-grid { grid-template-columns: 1fr; }
    .features-strip { padding: 20px; gap: 16px; }
    .chat-window { width: calc(100vw - 32px); right: 16px; }
  }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────
const PLANS = [
  { id: "starter",   name: "Starter Pack",      pts: 50,   price: "₦1,500",   popular: false, features: ["50 AI scans", "Scan history", "Basic support", "Product database"] },
  { id: "standard",  name: "Standard Pack",      pts: 100,  price: "₦2,500",   popular: true,  features: ["100 AI scans", "Scan history", "Priority processing", "All scan modes"] },
  { id: "pro",       name: "Pro Pack",           pts: 500,  price: "₦9,000",   popular: false, features: ["500 AI scans", "Advanced analytics", "Saved favourites", "Plant & OCR mode"] },
  { id: "unlimited", name: "Unlimited Premium",  pts: 9999, price: "₦5,000/mo",popular: false, features: ["Unlimited scans", "Priority AI queue", "All Phase 2 features", "1:1 support"] },
];

const CAT_EMOJIS = { product: "📦", plant: "🌿", food: "🍎", text: "📝", barcode: "📊", qr: "🔲", general: "🔍" };

// ─── UTILITIES ────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

const TOAST_ICONS = { success: "✅", error: "❌", info: "ℹ️" };
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{TOAST_ICONS[t.type]}</span>{t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── AI ENGINE ────────────────────────────────────────────────────
async function runAIScan(imageBase64, mode) {
  const prompts = {
    upload: `You are VeriLens AI, a world-class visual intelligence system. Analyze this image and return a comprehensive JSON object.\nReturn ONLY valid JSON, no markdown, no explanation:\n{"name":"product/item name","brand":"brand or Unknown","category":"product|plant|food|text|general","origin":"country","type":"subcategory","description":"2-3 sentences","uses":["use1","use2","use3"],"advantages":["adv1","adv2"],"disadvantages":["dis1"],"warnings":[],"ingredients":["ing1","ing2"],"estimatedPrice":"price in NGN","authenticityScore":85,"confidence":92,"alternatives":["alt1","alt2"],"recommendation":"smart tip","funFact":"interesting fact"}`,
    plant: `You are VeriLens AI's agricultural intelligence module. Analyze this plant/crop image. Return ONLY valid JSON:\n{"name":"plant name","brand":"N/A","category":"plant","origin":"native region","type":"plant family","description":"botanical description","uses":["agricultural","medicinal","culinary"],"advantages":["benefit1","benefit2"],"disadvantages":["limitation1"],"warnings":["toxicity if any"],"ingredients":["scientific name","soil type","climate zone"],"estimatedPrice":"market value NGN/kg","authenticityScore":90,"confidence":88,"alternatives":["related plant1"],"recommendation":"farming recommendation","funFact":"agricultural fact"}`,
    ocr: `You are VeriLens AI's OCR module. Extract all text from this image and analyze it. Return ONLY valid JSON:\n{"name":"document type","brand":"issuing brand","category":"text","origin":"language/country","type":"label|receipt|manual|prescription","description":"summary of text content","uses":["key info 1","key info 2","key info 3"],"advantages":["point1","point2"],"disadvantages":["concern1"],"warnings":["critical warnings from text"],"ingredients":["dosage if any","expiry if visible"],"estimatedPrice":"N/A","authenticityScore":80,"confidence":85,"alternatives":[],"recommendation":"plain-language explanation","funFact":"note about this document type"}`,
    barcode: `You are VeriLens AI. Analyze this product barcode image and identify the product if visible. Return ONLY valid JSON:\n{"name":"product name","brand":"brand","category":"product","origin":"country","type":"product type","description":"product description","uses":["use1","use2"],"advantages":["adv1"],"disadvantages":["dis1"],"warnings":[],"ingredients":["ingredient1","ingredient2"],"estimatedPrice":"price NGN","authenticityScore":80,"confidence":75,"alternatives":["alt1"],"recommendation":"purchase advice","funFact":"product fact"}`,
    qr: `You are VeriLens AI. Analyze this QR code image and describe what you can determine from it. Return ONLY valid JSON:\n{"name":"QR Code","brand":"Unknown","category":"qr","origin":"Unknown","type":"QR Code","description":"QR code detected in image","uses":["Data encoding","URL linking","Contact sharing"],"advantages":["Quick data access","Versatile use"],"disadvantages":["Requires scanner"],"warnings":[],"ingredients":[],"estimatedPrice":"N/A","authenticityScore":90,"confidence":80,"alternatives":[],"recommendation":"Use a QR scanner app to decode the content","funFact":"QR codes can store up to 4,296 characters of data"}`,
    multi: `You are VeriLens AI. Analyze this image and identify the main object. Return ONLY valid JSON:\n{"name":"item name","brand":"brand or Unknown","category":"product|food|plant|general","origin":"country","type":"subcategory","description":"brief description","uses":["use1","use2"],"advantages":["adv1"],"disadvantages":["dis1"],"warnings":[],"ingredients":[],"estimatedPrice":"price NGN","authenticityScore":80,"confidence":82,"alternatives":[],"recommendation":"tip","funFact":"fact"}`,
  };
  const prompt = prompts[mode] || prompts.upload;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: prompt }
      ]}]
    })
  });
  const data = await response.json();
  const raw = data.content?.[0]?.text || "{}";
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { name: "Object Detected", brand: "Unknown", category: "general", origin: "Unknown", type: "Item", description: raw.slice(0, 200), uses: ["General use"], advantages: ["Identified"], disadvantages: [], warnings: [], ingredients: [], estimatedPrice: "N/A", authenticityScore: 70, confidence: 65, alternatives: [], recommendation: "Try a clearer image for better results.", funFact: "VeriLens AI processes thousands of scans daily." };
  }
}

async function runChatAI(messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are Vera, VeriLens AI's helpful assistant. You help users with: understanding scan results, navigating the platform, product safety questions, plant identification, and general AI scanning questions. Keep replies concise and friendly. Max 3 sentences. If you can't help, suggest emailing support@verilens.ai`,
      messages: messages.filter(m => m.role && !m.thinking).slice(-8).map(m => ({ role: m.role, content: m.content }))
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, I had trouble responding. Please try again.";
}

function fileToB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────

function ScanResult({ result, imageUrl, onSave, onClose, onToggleFav, isFav, withSaveBtn = true }) {
  if (!result) return null;
  const conf = result.confidence || 80;
  const auth = result.authenticityScore || 85;
  const catColor = { product: "blue", plant: "green", food: "amber", text: "purple", barcode: "amber", qr: "cyan", general: "cyan" }[result.category] || "blue";
  return (
    <div className="result-card">
      <div className="result-header">
        {imageUrl
          ? <img src={imageUrl} alt="scan" className="result-img" />
          : <div className="result-img-placeholder">{CAT_EMOJIS[result.category] || "🔍"}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="result-name">{result.name || "Unknown Object"}</div>
          {result.brand && result.brand !== "N/A" && (
            <div className="result-brand">by {result.brand}{result.origin ? " · " + result.origin : ""}</div>
          )}
          <div className="result-badges">
            <span className={`badge badge-${catColor}`}>{result.category || "general"}</span>
            {result.type && <span className="badge badge-cyan">{result.type}</span>}
            {result.estimatedPrice && result.estimatedPrice !== "N/A" && <span className="badge badge-amber">~{result.estimatedPrice}</span>}
            {auth >= 85
              ? <span className="badge badge-green">✓ Likely Authentic</span>
              : <span className="badge badge-red">⚠ Verify Auth</span>}
          </div>
        </div>
        {onToggleFav && (
          <span className="fav-star" onClick={onToggleFav} title={isFav ? "Remove favourite" : "Save to favourites"}>
            {isFav ? "⭐" : "☆"}
          </span>
        )}
      </div>

      <div className="result-body">
        <div className="result-section">
          <div className="result-section-title">AI Confidence</div>
          <div className="conf-bar">
            <div className="conf-track"><div className="conf-fill" style={{ width: `${conf}%` }} /></div>
            <span className="conf-label">{conf}%</span>
          </div>
        </div>
        {result.description && (
          <div className="result-section">
            <div className="result-section-title">Overview</div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>{result.description}</p>
          </div>
        )}
        <div className="result-section">
          <div className="result-section-title">Key Information</div>
          <div className="result-grid">
            {result.origin && result.origin !== "Unknown" && <div className="result-item"><div className="result-item-label">Origin</div><div className="result-item-value">{result.origin}</div></div>}
            {result.estimatedPrice && result.estimatedPrice !== "N/A" && <div className="result-item"><div className="result-item-label">Est. Price</div><div className="result-item-value">{result.estimatedPrice}</div></div>}
            {result.authenticityScore && <div className="result-item"><div className="result-item-label">Auth Score</div><div className="result-item-value">{result.authenticityScore}/100</div></div>}
          </div>
        </div>
        {result.uses?.length > 0 && (
          <div className="result-section">
            <div className="result-section-title">Uses & Applications</div>
            <div className="result-list">{result.uses.map((u, i) => <div key={i} className="result-list-item">{u}</div>)}</div>
          </div>
        )}
        {(result.advantages?.length > 0 || result.disadvantages?.length > 0) && (
          <div className="result-section">
            <div className="result-section-title">Pros & Cons</div>
            <div className="result-grid">
              {result.advantages?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--green)", fontFamily: "var(--font)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Advantages</div>
                  <div className="result-list">{result.advantages.map((a, i) => <div key={i} className="result-list-item">{a}</div>)}</div>
                </div>
              )}
              {result.disadvantages?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Limitations</div>
                  <div className="result-list">{result.disadvantages.map((d, i) => <div key={i} className="result-list-item">{d}</div>)}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {result.warnings?.length > 0 && (
          <div className="result-section">
            <div style={{ background: "rgba(248,81,73,0.06)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: "var(--r)", padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--font)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>⚠ Warnings</div>
              {result.warnings.map((w, i) => <div key={i} style={{ fontSize: 13, color: "rgba(248,81,73,0.85)", marginBottom: 2 }}>• {w}</div>)}
            </div>
          </div>
        )}
        {result.ingredients?.length > 0 && (
          <div className="result-section">
            <div className="result-section-title">Ingredients / Materials</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {result.ingredients.map((ing, i) => <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "var(--text2)" }}>{ing}</span>)}
            </div>
          </div>
        )}
        {result.recommendation && (
          <div className="result-section">
            <div style={{ background: "rgba(56,139,253,0.06)", border: "1px solid rgba(56,139,253,0.2)", borderRadius: "var(--r)", padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--blue2)", fontFamily: "var(--font)", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>💡 AI Recommendation</div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{result.recommendation}</p>
            </div>
          </div>
        )}
        {result.alternatives?.length > 0 && (
          <div className="result-section">
            <div className="result-section-title">Similar & Alternatives</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {result.alternatives.map((alt, i) => <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "var(--text)" }}>{alt}</span>)}
            </div>
          </div>
        )}
        {result.funFact && (
          <div style={{ background: "rgba(163,113,247,0.06)", border: "1px solid rgba(163,113,247,0.2)", borderRadius: "var(--r)", padding: "10px 14px" }}>
            <span style={{ fontSize: 11, color: "var(--purple)", fontFamily: "var(--font)", fontWeight: 700 }}>✨ Did You Know  </span>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>{result.funFact}</span>
          </div>
        )}
      </div>

      {withSaveBtn && (
        <div className="result-footer">
          {onSave && <button className="btn btn-primary btn-sm" onClick={onSave}>💾 Save Scan</button>}
          {onClose && <button className="btn btn-secondary btn-sm" onClick={onClose}>🔄 New Scan</button>}
        </div>
      )}
    </div>
  );
}

function PricingModal({ onClose, onBuy }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680, width: "100%" }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">💳 Top Up Your Points</div>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>Choose a package to continue scanning.</p>
        <div className="pricing-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`price-card ${plan.popular ? "popular" : ""}`} onClick={() => onBuy(plan)}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="price-name">{plan.name}</div>
              <div className="price-pts">{plan.pts === 9999 ? "∞" : plan.pts}<span> pts</span></div>
              <div className="price-amount">{plan.price}</div>
              <ul className="price-features">{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <button className={`btn btn-sm ${plan.popular ? "btn-primary" : "btn-secondary"}`} style={{ width: "100%" }}>Select Package</button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 16 }}>Payments via Paystack & Flutterwave — PCI-DSS compliant</p>
      </div>
    </div>
  );
}

// ─── SCAN DETAIL MODAL ────────────────────────────────────────────
function ScanDetailModal({ scan, onClose, onToggleFav, isFav }) {
  if (!scan) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal">
        <div className="detail-modal-header">
          <div style={{ fontFamily: "var(--font)", fontSize: 15, fontWeight: 700 }}>Scan Detail</div>
          <button className="modal-close" style={{ float: "none" }} onClick={onClose}>✕</button>
        </div>
        <div className="detail-modal-body">
          <ScanResult
            result={scan.fullResult || scan}
            imageUrl={scan.imageUrl}
            onToggleFav={onToggleFav}
            isFav={isFav}
            withSaveBtn={false}
          />
        </div>
        <div className="detail-modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={() => { onToggleFav(); onClose(); }}>
            {isFav ? "⭐ Remove Fav" : "☆ Save Favourite"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────────
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const newMsgs = [...msgs, { role: "user", content: msg }];
    setMsgs([...newMsgs, { thinking: true, content: "..." }]);
    try {
      const reply = await runChatAI(newMsgs);
      setMsgs([...newMsgs, { role: "assistant", content: reply }]);
    } catch {
      setMsgs([...newMsgs, { role: "assistant", content: "Sorry, I had trouble. Email support@verilens.ai for help." }]);
    }
  };

  const QUICK = ["How do I scan?", "What is Plant Mode?", "How do I buy points?", "What's new in Phase 2?"];

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title={open ? "Close chat" : "Chat with Vera AI"}>
        {open ? "✕" : "🤖"}
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-av">🤖</div>
            <div style={{ flex: 1 }}>
              <div className="chat-title">Vera — AI Assistant</div>
              <div className="chat-online">● Online now</div>
            </div>
            <div className="icon-btn" onClick={() => setOpen(false)} style={{ width: 28, height: 28 }}>✕</div>
          </div>
          <div className="chat-msgs" ref={msgsRef}>
            {msgs.length === 0 && (
              <div className="chat-msg bot">Hi! I'm Vera, your VeriLens AI assistant 👋 I can help you understand scan results, navigate the app, or answer questions. What can I help you with?</div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "user" : m.thinking ? "thinking" : "bot"}`}>{m.content}</div>
            ))}
          </div>
          <div className="chat-quick">
            {QUICK.map(q => <span key={q} className="quick-chip" onClick={() => send(q)}>{q}</span>)}
          </div>
          <div className="chat-input-row">
            <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Vera anything..." />
            <button className="chat-send" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────

function LandingPage({ onLogin, onSignup }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo-mark" style={{ fontSize: 22 }}>VeriLens AI</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onLogin}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={onSignup}>Get Started Free</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" /><div className="hero-grid" />
        <div className="hero-eyebrow">✦ AI-Powered Visual Intelligence — Phase 2</div>
        <div className="scan-orbit">
          <div className="scan-ring"><div className="scan-dot" /></div>
          <div className="scan-ring"><div className="scan-dot" /></div>
          <div className="scan-ring"><div className="scan-dot" /></div>
          <div className="scan-center">🔬</div>
        </div>
        <h1 className="hero-title">Scan Reality.<br /><span className="grad-text">Understand Everything.</span></h1>
        <p className="hero-sub">Point your camera at any product, plant, food, drug, or object and get deep AI-powered intelligence in seconds. Now with Plant Mode, OCR, Barcode, QR, Chatbot & Multi-Scan.</p>
        <div className="hero-ctas">
          <button className="btn btn-cyan btn-lg" onClick={onSignup}>🚀 Start Scanning Free</button>
          <button className="btn btn-ghost btn-lg" onClick={onLogin}>Sign In →</button>
        </div>
      </section>

      <div className="features-strip">
        {[["🔍","Product Intel"],["🌿","Plant & Crop AI"],["📝","OCR Text"],["📊","Barcode Scan"],["🔲","QR Decode"],["🤖","AI Chatbot"],["🛡️","Fake Detection"],["📦","Multi-Scan"],["⭐","Favourites"]].map(([ico, lbl]) => (
          <div key={lbl} className="feat-item"><div className="feat-dot" />{ico} {lbl}</div>
        ))}
      </div>

      <section style={{ padding: "60px 40px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, color: "var(--cyan)", fontFamily: "var(--font)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Phase 2 — New Features</div>
            <h2 style={{ fontFamily: "var(--font)", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1 }}>More intelligence. More power.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {[
              { i: "🌿", t: "Agricultural AI",   d: "Identify 50,000+ plants. Get farming guides, disease diagnosis, fertilizer recs, and market value.", c: "var(--green)" },
              { i: "📝", t: "OCR Intelligence",  d: "Extract text from drug labels, receipts, or manuals. AI explains complex language in plain English.", c: "var(--purple)" },
              { i: "📊", t: "Barcode Scanner",   d: "Scan any product barcode for instant full product intelligence from our global product database.", c: "var(--amber)" },
              { i: "🔲", t: "QR Code Reader",    d: "Decode any QR code instantly. Resolve URLs, contact cards, payment links, and encoded data.", c: "var(--cyan)" },
              { i: "🤖", t: "Vera AI Chatbot",   d: "Meet Vera — your personal AI guide. She answers questions, explains results, and helps navigate.", c: "var(--blue2)" },
              { i: "📦", t: "Multi-Scan Mode",   d: "Upload multiple images at once and batch-analyze them all. Results displayed side by side.", c: "var(--pink)" },
            ].map(f => (
              <div key={f.t} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: 20, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.i}</div>
                <div style={{ fontFamily: "var(--font)", fontSize: 14, fontWeight: 700, marginBottom: 6, color: f.c }}>{f.t}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 600px 300px at 50% 50%, rgba(56,139,253,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "var(--font)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 800, marginBottom: 16, letterSpacing: -1, position: "relative" }}>
          Start with <span className="grad-text">10 free scans</span>
        </h2>
        <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px", position: "relative" }}>
          No credit card required. Sign up in 30 seconds and scan immediately.
        </p>
        <button className="btn btn-cyan btn-lg" onClick={onSignup} style={{ position: "relative" }}>Create Free Account →</button>
      </section>

      <footer style={{ padding: "20px 40px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "var(--bg2)" }}>
        <div className="logo-mark">VeriLens AI</div>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>© 2026 VeriLens AI. All rights reserved.</div>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>Built for Africa. Trusted Globally.</div>
      </footer>
    </div>
  );
}

function AuthPage({ mode, onAuth, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSignup = mode === "signup";

  const handle = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all required fields."); return; }
    if (isSignup && form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (isSignup && !form.name) { setError("Full name is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onAuth({ name: isSignup ? form.name : form.email.split("@")[0], email: form.email, points: 10, isNew: isSignup, verified: false, joinDate: new Date().toISOString(), scanCount: 0, phone: "", address: "" });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">VeriLens AI</div>
        <div className="auth-title">{isSignup ? "Create your account" : "Welcome back"}</div>
        <div className="auth-sub">{isSignup ? "Join and get 10 free scan points instantly." : "Sign in to continue scanning."}</div>
        {isSignup && <div className="welcome-banner">🎁 <strong>10 free points</strong> credited on signup — no card needed.</div>}
        <button className="google-btn">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <div className="auth-divider"><div className="auth-divider-line" /><span className="auth-divider-text">or</span><div className="auth-divider-line" /></div>
        {isSignup && <div className="field"><label className="label">Full Name</label><input className="input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>}
        <div className="field"><label className="label">Email Address</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        {isSignup && <div className="field"><label className="label">Confirm Password</label><input className="input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>}
        {error && <div className="error-text" style={{ marginBottom: 12 }}>⚠ {error}</div>}
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handle} disabled={loading}>
          {loading ? "⏳ Please wait..." : isSignup ? "🚀 Create Account & Get 10 Points" : "Sign In →"}
        </button>
        <div className="auth-switch">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span className="auth-link" onClick={onSwitch}>{isSignup ? "Sign In" : "Sign Up Free"}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, scanHistory, favs, onNavigate, onBuyPoints, onOpenDetail }) {
  const recentScans = scanHistory.slice(0, 5);
  const lowPts = user.points <= 4 && user.points !== 9999;
  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Good day, {user.name.split(" ")[0]} 👋</h1>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>Phase 2 is live — 9 new features unlocked.</p>
      </div>
      {lowPts && (
        <div className="low-pts-warn">
          ⚡ Only {user.points} point{user.points !== 1 ? "s" : ""} left.
          <button className="btn btn-sm btn-primary" style={{ marginLeft: "auto" }} onClick={onBuyPoints}>Top Up</button>
        </div>
      )}
      <div className="stats-grid">
        {[
          { icon: "⚡", label: "Points Balance", value: user.points === 9999 ? "∞" : user.points, sub: "2 pts per scan", bg: "rgba(56,139,253,0.1)", color: "var(--blue)" },
          { icon: "🔍", label: "Total Scans",    value: user.scanCount || 0,    sub: "Lifetime total",  bg: "rgba(57,208,216,0.1)",  color: "var(--cyan)" },
          { icon: "⭐", label: "Favourites",     value: favs.size,              sub: "Saved scans",    bg: "rgba(227,179,65,0.1)",  color: "var(--amber)" },
          { icon: "🏆", label: "Plan",           value: user.points === 9999 ? "Premium" : "Free", sub: "Current tier", bg: "rgba(63,185,80,0.1)", color: "var(--green)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="quick-scan-banner">
        <div className="qsb-left">
          <h3>Ready to scan something?</h3>
          <p>7 scan modes available in Phase 2 — try Plant Mode, Barcode, or OCR!</p>
        </div>
        <button className="btn btn-cyan btn-lg" onClick={() => onNavigate("scanner")}>🔬 Open Scanner</button>
      </div>
      <div className="section-header">
        <div className="section-title">Recent Scans</div>
        {scanHistory.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("history")}>View All →</button>}
      </div>
      {recentScans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No scans yet</div>
          <div className="empty-sub">Your scan history will appear here after your first scan.</div>
        </div>
      ) : (
        recentScans.map(scan => (
          <div key={scan.id} className="scan-row" onClick={() => onOpenDetail(scan.id)}>
            <div className="scan-thumb">{scan.imageUrl ? <img src={scan.imageUrl} alt="" /> : <span>{CAT_EMOJIS[scan.category] || "🔍"}</span>}</div>
            <div className="scan-info">
              <div className="scan-name">{scan.name}</div>
              <div className="scan-meta">{scan.brand && scan.brand !== "N/A" ? scan.brand + " · " : ""}{new Date(scan.date).toLocaleDateString()}</div>
            </div>
            <span className={`scan-cat cat-${scan.category}`}>{scan.category}</span>
          </div>
        ))
      )}
    </div>
  );
}

function ScannerPage({ user, onScan, onBuyPoints }) {
  const [mode, setMode] = useState("upload");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageB64, setImageB64] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [multiImages, setMultiImages] = useState([]);
  const [multiResults, setMultiResults] = useState([]);
  const [multiAnalyzing, setMultiAnalyzing] = useState(false);
  const fileRef = useRef();
  const multiRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef();

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageUrl(URL.createObjectURL(file));
    setImageB64(await fileToB64(file));
    setResult(null);
  };

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { alert("Camera access denied or unavailable."); setMode("upload"); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImageUrl(dataUrl);
    setImageB64(dataUrl.split(",")[1]);
    stopCamera();
    setMode("upload");
  };

  const switchMode = (m) => {
    if (mode === "camera") stopCamera();
    setMode(m);
    setResult(null);
    setImageUrl(null);
    setImageB64(null);
    if (m === "camera") setTimeout(startCamera, 100);
  };

  const doScan = async () => {
    if (!imageB64) return;
    if (user.points < 2 && user.points !== 9999) { onBuyPoints(); return; }
    setAnalyzing(true);
    try {
      const modeMap = { upload: "upload", plant: "plant", ocr: "ocr", barcode: "barcode", qr: "qr" };
      const aiResult = await runAIScan(imageB64, modeMap[mode] || "upload");
      setResult(aiResult);
      onScan({ ...aiResult, imageUrl, imageB64 });
    } catch { alert("Scan failed. Please check your connection and try again."); }
    setAnalyzing(false);
  };

  const reset = () => { setImageUrl(null); setImageB64(null); setResult(null); };

  const addMultiImages = async (files) => {
    const newImgs = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      newImgs.push({ url: URL.createObjectURL(f), b64: await fileToB64(f) });
    }
    setMultiImages(prev => [...prev, ...newImgs]);
  };

  const scanAll = async () => {
    const needed = multiImages.length * 2;
    if (user.points < needed && user.points !== 9999) { onBuyPoints(); return; }
    setMultiAnalyzing(true);
    setMultiResults([]);
    for (let i = 0; i < multiImages.length; i++) {
      try {
        const r = await runAIScan(multiImages[i].b64, "multi");
        setMultiResults(prev => [...prev, r]);
        onScan({ ...r, imageUrl: multiImages[i].url, imageB64: multiImages[i].b64 });
      } catch {
        setMultiResults(prev => [...prev, { name: "Scan Failed", category: "general", confidence: 0 }]);
      }
    }
    setMultiAnalyzing(false);
  };

  const MODES = [
    { id: "upload",  icon: "📁",  label: "Upload",    cls: "" },
    { id: "camera",  icon: "📷",  label: "Camera",    cls: "" },
    { id: "plant",   icon: "🌿",  label: "Plant",     cls: "plant" },
    { id: "ocr",     icon: "📝",  label: "OCR Text",  cls: "ocr" },
    { id: "barcode", icon: "📊",  label: "Barcode",   cls: "barcode" },
    { id: "qr",      icon: "🔲",  label: "QR Code",   cls: "qr" },
    { id: "multi",   icon: "📦",  label: "Multi-Scan",cls: "" },
  ];

  return (
    <div className="page scanner-page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI Scanner</h1>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>7 scan modes available. Each scan costs 2 points.</p>
      </div>
      {user.points <= 4 && user.points !== 9999 && (
        <div className="low-pts-warn">
          ⚡ {user.points} pts left.
          <button className="btn btn-sm btn-primary" style={{ marginLeft: "auto" }} onClick={onBuyPoints}>Buy More</button>
        </div>
      )}

      <div className="scan-modes">
        {MODES.map(m => (
          <button key={m.id} className={`mode-btn ${m.cls} ${mode === m.id ? "active " + m.cls : ""}`} onClick={() => switchMode(m.id)}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* MULTI SCAN */}
      {mode === "multi" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => multiRef.current?.click()}>+ Add Images</button>
            {multiImages.length > 0 && (
              <button className="btn btn-cyan btn-sm" onClick={scanAll} disabled={multiAnalyzing}>
                {multiAnalyzing ? "⏳ Analyzing..." : `🔬 Analyze All (${multiImages.length * 2} pts)`}
              </button>
            )}
            {multiImages.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => { setMultiImages([]); setMultiResults([]); }}>Clear All</button>}
          </div>
          <input ref={multiRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => addMultiImages(e.target.files)} />
          {multiImages.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No images added</div><div className="empty-sub">Add multiple images to analyze them all at once.</div></div>
          ) : (
            <div className="multi-grid">
              {multiImages.map((img, i) => (
                <div key={i} className="multi-thumb">
                  <img src={img.url} alt="" />
                  <button className="rem-btn" onClick={() => { setMultiImages(prev => prev.filter((_, j) => j !== i)); setMultiResults(prev => prev.filter((_, j) => j !== i)); }}>✕</button>
                  {multiResults[i] ? (
                    <div className="mstat" style={{ color: "var(--green)" }}>✓ {multiResults[i].name?.slice(0, 14) || "Done"}</div>
                  ) : multiAnalyzing ? (
                    <div className="mstat" style={{ color: "var(--amber)" }}>⏳ Scanning...</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          {multiResults.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>Batch Results</div>
              {multiResults.map((r, i) => (
                <div key={i} className="scan-row">
                  <div className="scan-thumb">{multiImages[i] ? <img src={multiImages[i].url} alt="" /> : <span>{CAT_EMOJIS[r?.category] || "🔍"}</span>}</div>
                  <div className="scan-info">
                    <div className="scan-name">{r?.name || "Unknown"}</div>
                    <div className="scan-meta">{r?.brand && r.brand !== "N/A" ? r.brand + " · " : ""}{r?.category || "general"}</div>
                  </div>
                  <span className={`scan-cat cat-${r?.category || "general"}`}>{r?.confidence || 0}% conf.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CAMERA */}
      {mode === "camera" && (
        <div style={{ position: "relative" }}>
          <div className="camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted />
            <div className="camera-overlay"><div className="scan-frame"><span /><div className="scan-line" /></div></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="btn btn-cyan btn-lg" style={{ flex: 1 }} onClick={captureFrame}>📸 Capture & Analyze</button>
            <button className="btn btn-ghost" onClick={() => { stopCamera(); setMode("upload"); }}>Stop Camera</button>
          </div>
        </div>
      )}

      {/* UPLOAD / PLANT / OCR / BARCODE / QR */}
      {mode !== "camera" && mode !== "multi" && (
        <>
          <div
            className={`upload-zone ${dragging ? "drag" : ""} ${imageUrl ? "has-image" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !imageUrl && fileRef.current?.click()}
            style={{ position: "relative" }}
          >
            {analyzing && (
              <div className="analyzing-overlay">
                <div className="pulse-ring">🔬</div>
                <div className="analyzing-text">Analyzing with AI...</div>
                <div className="analyzing-sub">VeriLens AI Vision Engine running</div>
              </div>
            )}
            {imageUrl ? (
              <img src={imageUrl} alt="preview" className="preview-img" />
            ) : (
              <>
                <div className="upload-icon">{MODES.find(m => m.id === mode)?.icon || "📁"}</div>
                <div className="upload-title">Drop image here or click to upload</div>
                <div className="upload-sub">
                  {mode === "plant" ? "Upload a photo of any plant or crop" : mode === "ocr" ? "Upload a label, receipt, or document" : mode === "barcode" ? "Upload a product barcode image" : mode === "qr" ? "Upload a QR code image" : "Supports JPG, PNG, WEBP — max 10MB"}
                </div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

          {imageUrl && !result && (
            <div className="scan-actions">
              <button className="btn btn-cyan btn-lg" style={{ flex: 1 }} onClick={doScan} disabled={analyzing || (user.points < 2 && user.points !== 9999)}>
                {analyzing ? "⏳ Analyzing..." : `🔬 Analyze Image (2 pts)`}
              </button>
              <button className="btn btn-ghost" onClick={reset}>✕ Clear</button>
            </div>
          )}
        </>
      )}

      {result && mode !== "multi" && (
        <ScanResult result={result} imageUrl={imageUrl} onSave={() => {}} onClose={reset} withSaveBtn={true} />
      )}
    </div>
  );
}

function HistoryPage({ scanHistory, favs, onToggleFav, onOpenDetail }) {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "product", "plant", "food", "text", "barcode", "qr", "general"];
  const filtered = filter === "all" ? scanHistory : scanHistory.filter(s => s.category === filter);
  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Scan History</h1>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>{scanHistory.length} total scan{scanHistory.length !== 1 ? "s" : ""} saved.</p>
      </div>
      <div className="history-filter">
        {cats.map(c => (
          <button key={c} className={`filter-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
            {c === "all" ? "All" : `${CAT_EMOJIS[c] || "🔍"} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <div className="empty-title">No scans found</div>
          <div className="empty-sub">{filter === "all" ? "You haven't scanned anything yet." : `No ${filter} scans in your history.`}</div>
        </div>
      ) : (
        filtered.map(scan => (
          <div key={scan.id} className="scan-row" onClick={() => onOpenDetail(scan.id)}>
            <div className="scan-thumb">{scan.imageUrl ? <img src={scan.imageUrl} alt="" /> : <span>{CAT_EMOJIS[scan.category] || "🔍"}</span>}</div>
            <div className="scan-info">
              <div className="scan-name">{scan.name}</div>
              <div className="scan-meta">{scan.brand && scan.brand !== "N/A" ? scan.brand + " · " : ""}{new Date(scan.date).toLocaleString()}</div>
              {scan.description && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 340 }}>{scan.description}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span className={`scan-cat cat-${scan.category}`}>{scan.category}</span>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>{scan.confidence}% conf.</span>
              <span className="fav-star" onClick={e => { e.stopPropagation(); onToggleFav(scan.id); }} title={favs.has(scan.id) ? "Remove fav" : "Save fav"}>
                {favs.has(scan.id) ? "⭐" : "☆"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FavouritesPage({ scanHistory, favs, onToggleFav, onOpenDetail }) {
  const favScans = scanHistory.filter(s => favs.has(s.id));
  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Saved Favourites</h1>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>{favScans.length} saved scan{favScans.length !== 1 ? "s" : ""} ⭐</p>
      </div>
      {favScans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <div className="empty-title">No favourites yet</div>
          <div className="empty-sub">Star any scan from your history or scan results to save it here.</div>
        </div>
      ) : (
        favScans.map(scan => (
          <div key={scan.id} className="scan-row" onClick={() => onOpenDetail(scan.id)}>
            <div className="scan-thumb">{scan.imageUrl ? <img src={scan.imageUrl} alt="" /> : <span>{CAT_EMOJIS[scan.category] || "🔍"}</span>}</div>
            <div className="scan-info">
              <div className="scan-name">{scan.name}</div>
              <div className="scan-meta">{scan.brand && scan.brand !== "N/A" ? scan.brand + " · " : ""}{new Date(scan.date).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span className={`scan-cat cat-${scan.category}`}>{scan.category}</span>
              <span className="fav-star" onClick={e => { e.stopPropagation(); onToggleFav(scan.id); }} title="Remove favourite">⭐</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function PricingPage({ onBuy }) {
  return (
    <div className="page">
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font)", fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 420, margin: "0 auto" }}>Every new account gets 10 free points. Top up whenever you need more scans.</p>
      </div>
      <div className="pricing-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`price-card ${plan.popular ? "popular" : ""}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <div className="price-name">{plan.name}</div>
            <div className="price-pts">{plan.pts === 9999 ? "∞" : plan.pts}<span> pts</span></div>
            <div className="price-amount">{plan.price}</div>
            <ul className="price-features">{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <button className={`btn btn-sm ${plan.popular ? "btn-primary" : "btn-secondary"}`} style={{ width: "100%" }} onClick={() => onBuy(plan)}>
              {plan.id === "unlimited" ? "Subscribe Now" : "Buy Points"}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, padding: 20, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>💳 Secure payments via <strong style={{ color: "var(--text)" }}>Paystack</strong> & <strong style={{ color: "var(--text)" }}>Flutterwave</strong></div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>Points credited instantly. All transactions are encrypted and PCI-DSS compliant.</div>
      </div>
    </div>
  );
}

function SettingsPage({ user, onUpdate, toast, onBuyPoints, onSignOut }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || "", address: user.address || "" });
  const [tab, setTab] = useState("profile");
  const save = () => { onUpdate(form); toast("Profile updated successfully.", "success"); };
  return (
    <div className="page" style={{ maxWidth: 620 }}>
      <h1 style={{ fontFamily: "var(--font)", fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Settings</h1>
      <div className="settings-tabs">
        {[["profile", "👤 Profile"], ["account", "📊 Account"], ["notifications", "🔔 Notifications"]].map(([id, lbl]) => (
          <div key={id} className={`settings-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{lbl}</div>
        ))}
      </div>
      {tab === "profile" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div className="avatar-lg">{user.name?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div style={{ fontFamily: "var(--font)", fontSize: 17, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>{user.email}</div>
              <span className="verified-badge">✓ Email Verified</span>
            </div>
          </div>
          <div className="settings-grid">
            <div className="field"><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." /></div>
            <div className="field"><label className="label">Address</label><input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Your city, country" /></div>
          </div>
          <button className="btn btn-primary" onClick={save}>Save Changes</button>
        </div>
      )}
      {tab === "account" && (
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["Points Balance", user.points === 9999 ? "Unlimited" : `${user.points} pts`], ["Member Since", new Date(user.joinDate).toLocaleDateString()], ["Total Scans", user.scanCount || 0], ["Plan", user.points === 9999 ? "Premium" : "Free Tier"], ["Phase", "Phase 2 Active"], ["Status", "Active"]].map(([k, v]) => (
              <div key={k} className="result-item"><div className="result-item-label">{k}</div><div className="result-item-value">{v}</div></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={onBuyPoints}>💳 Buy More Points</button>
            <button className="btn btn-danger btn-sm" onClick={onSignOut}>↩ Sign Out</button>
          </div>
        </div>
      )}
      {tab === "notifications" && (
        <div className="card">
          {[["Low Points Alert", "Get notified when points fall below 4", true], ["Scan Completion", "Email after each scan", false], ["New Features", "Updates about new VeriLens features", true], ["Weekly Summary", "Weekly digest of your scan activity", false]].map(([lbl, desc, on]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 13, fontFamily: "var(--font)", fontWeight: 600 }}>{lbl}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{desc}</div>
              </div>
              <div style={{ width: 38, height: 20, borderRadius: 10, background: on ? "var(--blue)" : "var(--surface)", border: `1px solid ${on ? "var(--blue)" : "var(--border)"}`, position: "relative", cursor: "pointer", transition: "background 0.2s" }} onClick={() => toast("Notification preference updated.", "success")}>
                <div style={{ position: "absolute", top: 2, [on ? "right" : "left"]: 2, width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : "var(--text3)", transition: "all 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function VeriLensAI() {
  const [view, setView] = useState("landing");       // landing | signup | login | app
  const [appPage, setAppPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [favs, setFavs] = useState(new Set());
  const [showPricing, setShowPricing] = useState(false);
  const [showDetailId, setShowDetailId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, add: toast } = useToast();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    setView("app");
    setAppPage("dashboard");
    if (userData.isNew) toast("🎉 Welcome to VeriLens AI! You have 10 free points.", "success");
    else toast(`Welcome back, ${userData.name.split(" ")[0]}!`, "success");
  };

  const handleScan = (result) => {
    const id = "sc_" + Date.now();
    const entry = {
      id,
      name: result.name || "Unknown",
      brand: result.brand || "Unknown",
      category: result.category || "general",
      description: result.description || "",
      confidence: result.confidence || 80,
      imageUrl: result.imageUrl || null,
      date: new Date().toISOString(),
      fullResult: { ...result, _scanId: id },
    };
    setScanHistory(h => [entry, ...h]);
    setUser(u => ({ ...u, points: u.points === 9999 ? 9999 : u.points - 2, scanCount: (u.scanCount || 0) + 1 }));
    toast(`✅ Scan complete: ${result.name || "Object identified"}`, "success");
  };

  const handleBuyPoints = (plan) => {
    setShowPricing(false);
    setUser(u => ({ ...u, points: plan.id === "unlimited" ? 9999 : u.points + plan.pts }));
    toast(`✅ ${plan.pts === 9999 ? "Unlimited plan" : plan.pts + " points"} added! (Demo — no charge)`, "success");
  };

  const toggleFav = (id) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Removed from favourites.", "info"); }
      else { next.add(id); toast("⭐ Saved to favourites!", "success"); }
      return next;
    });
  };

  const NAV = [
    { id: "dashboard",   icon: "⚡",  label: "Dashboard" },
    { id: "scanner",     icon: "🔬",  label: "AI Scanner",   badge: "NEW" },
    { id: "history",     icon: "📂",  label: "Scan History" },
    { id: "favourites",  icon: "⭐",  label: "Favourites",   badge: "P2", badgeCls: "p2" },
    { id: "pricing",     icon: "💳",  label: "Buy Points" },
    { id: "settings",    icon: "⚙️", label: "Settings" },
  ];

  if (view === "landing") return (<><LandingPage onLogin={() => setView("login")} onSignup={() => setView("signup")} /><ToastContainer toasts={toasts} /></>);
  if (view === "signup" || view === "login") return (<><AuthPage mode={view} onAuth={handleAuth} onSwitch={() => setView(view === "signup" ? "login" : "signup")} /><ToastContainer toasts={toasts} /></>);

  const detailScan = showDetailId ? scanHistory.find(s => s.id === showDetailId) : null;

  const renderPage = () => {
    switch (appPage) {
      case "dashboard":  return <Dashboard user={user} scanHistory={scanHistory} favs={favs} onNavigate={setAppPage} onBuyPoints={() => setShowPricing(true)} onOpenDetail={setShowDetailId} />;
      case "scanner":    return <ScannerPage user={user} onScan={handleScan} onBuyPoints={() => setShowPricing(true)} />;
      case "history":    return <HistoryPage scanHistory={scanHistory} favs={favs} onToggleFav={toggleFav} onOpenDetail={setShowDetailId} />;
      case "favourites": return <FavouritesPage scanHistory={scanHistory} favs={favs} onToggleFav={toggleFav} onOpenDetail={setShowDetailId} />;
      case "pricing":    return <PricingPage onBuy={handleBuyPoints} />;
      case "settings":   return <SettingsPage user={user} onUpdate={u => setUser(prev => ({ ...prev, ...u }))} toast={toast} onBuyPoints={() => setShowPricing(true)} onSignOut={() => { setUser(null); setView("landing"); toast("Signed out.", "info"); }} />;
      default: return null;
    }
  };

  return (
    <div className="app">
      {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">VeriLens AI</div>
          <div className="logo-tag">Visual Intelligence</div>
          <span className="phase-badge">Phase 2</span>
        </div>
        <div className="nav-section">
          <div className="nav-label">Navigation</div>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${appPage === n.id ? "active" : ""}`} onClick={() => { setAppPage(n.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className={`nav-badge ${n.badgeCls || ""}`}>{n.badge}</span>}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="user-chip" onClick={() => { setAppPage("settings"); setSidebarOpen(false); }}>
            <div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-pts">⚡ {user?.points === 9999 ? "Unlimited" : `${user?.points} pts`}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="icon-btn hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <div className="topbar-title">{NAV.find(n => n.id === appPage)?.label || "VeriLens AI"}</div>
          </div>
          <div className="topbar-right">
            <div className="pts-pill">⚡ {user?.points === 9999 ? "∞" : user?.points} pts</div>
            <button className="icon-btn" onClick={() => setShowPricing(true)} title="Buy Points">+</button>
            <button className="icon-btn" onClick={() => { setUser(null); setView("landing"); toast("Signed out.", "info"); }} title="Sign Out">↩</button>
          </div>
        </div>
        {renderPage()}
      </div>

      {/* Chatbot */}
      <ChatBot />

      {/* Modals */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} onBuy={handleBuyPoints} />}
      {detailScan && (
        <ScanDetailModal
          scan={detailScan}
          onClose={() => setShowDetailId(null)}
          onToggleFav={() => toggleFav(detailScan.id)}
          isFav={favs.has(detailScan.id)}
        />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
