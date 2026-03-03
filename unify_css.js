const fs = require('fs');
const path = require('path');

const cssContent = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg: #f8fafc;
  --bg-soft: #f1f5f9;
  --primary: #38bdf8;
  --primary-soft: rgba(56, 189, 248, 0.1);
  --primary-deep: #0284c7;
  --accent: #818cf8;
  --text-main: #0f172a;
  --text-muted: #475569;
  --border-soft: rgba(0, 0, 0, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.08);
  --danger: #ef4444;
  --success: #22c55e;
  --warning: #facc15;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Outfit', sans-serif;
}

body {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #f1f5f9, #f8fafc 50%, #e2e8f0 100%);
  color: var(--text-main);
}

a {
  text-decoration: none;
  color: inherit;
}

/* AUTH PAGES */
.auth-body {
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.layout {
  width: 100%;
  max-width: 980px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.left-panel {
  padding: 36px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), transparent);
  position: relative;
}

.right-panel {
  padding: 40px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--glass-border);
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.logo-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
.logo { display: flex; align-items: center; gap: 12px; color: #0f172a; font-weight: 700; letter-spacing: 0.02em; }
.logo-mark {
  width: 36px; height: 36px; border-radius: 12px;
  background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
  display: flex; align-items: center; justify-content: center; color: #fff;
  font-size: 1rem; font-weight: 800; box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}
.logo-link { font-size: 0.85rem; color: var(--text-muted); transition: color 0.2s; }
.logo-link:hover { color: #0f172a; }

.welcome-block { margin-bottom: 30px; }
.welcome-pill {
  display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 4px 12px;
  background: rgba(56, 189, 248, 0.1); color: var(--primary-deep); font-size: 0.8rem; font-weight: 600;
  margin-bottom: 16px; border: 1px solid rgba(56, 189, 248, 0.2);
}
.welcome-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
.welcome-block h1 { font-size: 2.2rem; margin-bottom: 12px; color: #0f172a; line-height: 1.2; }
.welcome-block p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }

/* Dashboard layout */
.dashboard-body { display: flex; }
.sidebar {
  width: 250px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--border-soft);
  padding: 24px 16px;
  display: flex; flex-direction: column; gap: 20px;
  height: 100vh; position: sticky; top: 0;
}
.sidebar .logo-mark { width: 28px; height: 28px; font-size: 0.8rem; }
.sidebar-label {
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-muted); font-weight: 700; margin-bottom: 8px; padding-left: 8px;
}
.nav-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  font-size: 0.9rem; padding: 10px 12px; border-radius: 12px; color: var(--text-muted);
  cursor: pointer; display: flex; align-items: center; justify-content: space-between;
  font-weight: 500; transition: all 0.2s;
}
.nav-item small { font-size: 0.75rem; color: #94a3b8; }
.nav-item:hover { background: rgba(0, 0, 0, 0.03); color: #0f172a; }
.nav-item.active { background: var(--primary-soft); color: var(--primary-deep); font-weight: 600; }
.nav-item.active small { color: var(--primary-deep); }
.nav-item span.label { display: inline-flex; align-items: center; gap: 6px; }
.sidebar-footer { margin-top: auto; font-size: 0.8rem; color: var(--text-muted); padding-left: 8px;}

.main {
  flex: 1; padding: 24px 32px; overflow: auto; max-width: 1200px; margin: 0 auto;
}
.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 10px;}
.top-bar-left { display: flex; flex-direction: column; gap: 4px; }
.top-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; }
.top-subtitle { font-size: 0.95rem; color: var(--text-muted); }
.top-bar-right { display: flex; gap: 12px; align-items: center; flex-wrap: wrap;}

.content-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }
.content-grid-half { grid-template-columns: 1fr 1fr; }

/* General Components */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
.card-header { margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px;}
.card-header-flex { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; flex-direction: row;}
.card-header h2, .card-header-flex h2, .steps-title { font-size: 1.2rem; color: #0f172a; font-weight: 700; }
.card-header p, .card-header span, .card-header-flex span { font-size: 0.85rem; color: var(--text-muted); }

.field { margin-bottom: 14px; }
label { display: block; font-size: 0.85rem; margin-bottom: 6px; color: #334155; font-weight: 500; }
.input, select, textarea {
  width: 100%; padding: 10px 14px; border-radius: 12px;
  border: 1px solid var(--border-soft); background: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem; color: #0f172a; outline: none; transition: all 0.2s ease;
}
.input:focus, select:focus, textarea:focus {
  border-color: var(--primary); box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); background: #fff;
}
.two-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }

.btn {
  border: none; cursor: pointer; padding: 10px 18px; border-radius: 12px; font-size: 0.95rem; font-weight: 600;
  transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-block { width: 100%; margin-bottom: 12px; }
.btn-primary { background: linear-gradient(135deg, #38bdf8, #818cf8); color: #fff; box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(56, 189, 248, 0.4); filter: brightness(1.05); }
.btn-secondary { background: rgba(0, 0, 0, 0.05); color: #0f172a; border: 1px solid rgba(0, 0, 0, 0.1); }
.btn-secondary:hover { background: rgba(0, 0, 0, 0.08); }
.btn-outline { background: #eff6ff; color: var(--primary-deep); border: 1px solid #bae6fd; }
.btn-outline:hover { background: #e0f2fe; }
.btn-row { display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap; }

.table-wrapper {
  margin-top: 16px; max-height: 400px; overflow: auto; border-radius: 12px;
  border: 1px solid var(--border-soft); background: rgba(255, 255, 255, 0.5);
}
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
thead { position: sticky; top: 0; background: #f1f5f9; z-index: 1; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border-soft); }
th { font-weight: 600; color: #334155; }
tbody tr:hover { background: rgba(255, 255, 255, 0.8); }

.badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.badge { background: rgba(255, 255, 255, 0.6); color: #334155; padding: 6px 12px; border-radius: 999px; font-size: 0.8rem; border: 1px solid var(--border-soft); font-weight: 500;}
.badge-pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 4px 10px; background: rgba(255, 255, 255, 0.6); border: 1px solid var(--border-soft); font-size: 0.75rem; font-weight: 600;}
.badge-dot, .live-dot, .tag-dot, .status-dot, .filter-dot { width: 6px; height: 6px; border-radius: 999px; background: currentColor; }
.live-pill { font-size: 0.75rem; padding: 4px 10px; border-radius: 999px; background: rgba(34, 197, 94, 0.1); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.2); display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
.live-dot { background: #16a34a; box-shadow: 0 0 8px #16a34a; }

.badge-role { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 3px 8px; border-radius: 999px; font-size: 0.75rem;}
.tag { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; padding: 3px 8px; border-radius: 999px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 6px; }
.pill-warning { background: #fef9c3; color: #854d0e; border-color: #facc15; }
.chip { font-size: 0.75rem; padding: 4px 10px; border-radius: 999px; background: #f1f5f9; color: #475569; border: 1px solid var(--border-soft);}

.badge-consent { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 999px; font-size: 0.75rem; gap: 4px; font-weight: 500;}
.granted { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.pending { background: #fef9c3; color: #854d0e; border: 1px solid #facc15; }
.revoked { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

.summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px;}
.summary-card { background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 16px; border: 1px solid var(--border-soft); }
.summary-title { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500;}
.summary-value { font-size: 1.6rem; font-weight: 700; color: #0f172a;}
.summary-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.stat-item { background: rgba(255, 255, 255, 0.4); border-radius: 12px; padding: 12px; border: 1px solid var(--border-soft);}
.stat-label { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px; }
.stat-value { font-weight: 700; color: #0f172a; font-size: 1.2rem; }

.divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; font-size: 0.85rem; color: var(--text-muted); width: 100%;}
.divider span { flex: 1; height: 1px; background: var(--border-soft); }
hr.divider { border: none; height: 1px; background: var(--border-soft); margin: 16px 0; }
.helper-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; font-size: 0.85rem; color: var(--text-muted); }
.checkbox-row { display: flex; align-items: center; gap: 8px; }
.checkbox-row input[type="checkbox"] { accent-color: var(--primary); width: 16px; height: 16px; }
.link { color: var(--primary-deep); text-decoration: none; transition: color 0.2s; font-weight: 500;}
.link:hover { text-decoration: underline; color: var(--primary); }
.error-text { display: none; font-size: 0.85rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 8px; margin-bottom: 16px; text-align: center; }
.card-footer { margin-top: 16px; font-size: 0.85rem; color: var(--text-muted); text-align: center; }

/* Miscellaneous missing from company/auth */
.consent-table-wrapper { max-height: 180px; overflow: auto; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; margin-top: 6px; }
.chips-row { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
.footer-text { margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); text-align: right; }
.steps-card { background: rgba(255, 255, 255, 0.95); border-radius: 18px; padding: 16px; border: 1px solid rgba(209, 213, 219, 0.85); box-shadow: 0 12px 24px rgba(148, 163, 184, 0.28); margin-top: 10px; max-width: 320px; font-size: 0.85rem; }
.steps-list { list-style: none; padding-left: 0; }
.steps-list li { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; color: var(--text-muted); }
.steps-badge { width: 22px; height: 22px; border-radius: 999px; background: var(--primary-soft); color: var(--primary-deep); font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; }
.search-bar { position: relative; width: 100%; max-width: 300px; margin-bottom: 16px;}
.search-bar input { width: 100%; padding: 10px 14px 10px 36px; border-radius: 999px; border: 1px solid var(--border-soft); background: #fff; font-size: 0.9rem; outline: none; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.metrics-row { display: flex; gap: 12px; margin-bottom: 16px; }
.metric-pill { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255, 255, 255, 0.8); border: 1px solid var(--border-soft); border-radius: 999px; font-size: 0.8rem; font-weight: 600; color: #334155; }
.metric-pill i, .metric-pill svg { color: var(--primary); }

.timeline { position: relative; margin-top: 16px; padding-left: 20px; }
.timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--border-soft); }
.timeline-item { position: relative; margin-bottom: 24px; }
.timeline-dot { position: absolute; left: -25px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2px solid var(--primary); box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1); }
.timeline-content { background: var(--glass-bg); padding: 16px; border-radius: 12px; border: 1px solid var(--glass-border); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.timeline-date { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.timeline-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.timeline-text { font-size: 0.85rem; color: #475569; line-height: 1.5; }

/* Action Panels (Doctor Portal) */
.action-panel { background: rgba(255, 255, 255, 0.6); padding: 20px; border-radius: 16px; border: 1px solid var(--border-soft); margin-top: 16px; }
.glass-panel { background: rgba(255, 255, 255, 0.4); padding: 16px; border-radius: 12px; border: 1px dashed var(--border-soft); }

@media (max-width: 960px) {
  .sidebar { display: none; }
  .content-grid { grid-template-columns: 1fr; }
}
@media (max-width: 820px) {
  .layout { grid-template-columns: 1fr; max-width: 540px; }
  .left-panel, .side-illustration { display: none !important; }
}
`;

fs.writeFileSync(path.join(__dirname, 'styles.css'), cssContent, 'utf-8');

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace anything between <style> and </style> with external link
    content = content.replace(/<style>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css" />');

    // Also fix up bodies
    if (file === 'index.html' || file === 'signup.html') {
        content = content.replace(/<body([^>]*)>/i, (match, p1) => {
            if (!p1.includes('class')) {
                return '<body class="auth-body"' + p1 + '>';
            } else {
                return match;
            }
        });

        // Rename right-panel cards
        content = content.replace(/<div class="card">/g, '<div class="auth-card">');
        content = content.replace(/<button type="button" class="btn" style="[^"]*"/g, '<button type="button" class="btn btn-outline btn-block"');
        content = content.replace(/class="btn btn-primary"/g, 'class="btn btn-primary btn-block"');
        content = content.replace(/<div class="card-header">/g, '<div class="card-header" style="text-align: center;">');

    } else {
        content = content.replace(/<body([^>]*)>/i, (match, p1) => {
            if (!p1.includes('class')) {
                return '<body class="dashboard-body"' + p1 + '>';
            } else {
                return match;
            }
        });

        // Make card-header items flex if they have span next to h2
        content = content.replace(/<div class="card-header">\s*<h2(?:[^>]*)>([^<]*)<\/h2>\s*<span(?:[^>]*)>([^<]*)<\/span>/gi,
            '<div class="card-header-flex"><h2>$1</h2><span>$2</span>');
    }

    // Common: remove explicit style overrides that might break the new theme
    content = content.replace(/style="[^"]*background[^"]*"/g, '');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated ' + file);
}

console.log('Unification complete.');
