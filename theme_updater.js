const fs = require('fs');
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const filePath = __dirname + '/' + f;
    let content = fs.readFileSync(filePath, 'utf8');

    // Colors
    content = content.replace(/--bg: #0f172a;/g, '--bg: #f8fafc;');
    content = content.replace(/--text-main: #f8fafc;/g, '--text-main: #0f172a;');
    content = content.replace(/--text-muted: #94a3b8;/g, '--text-muted: #475569;');

    // Glassmorphism
    content = content.replace(/--glass-bg: rgba\(30, 41, 59, 0\.7\);/g, '--glass-bg: rgba(255, 255, 255, 0.7);');
    content = content.replace(/--glass-border: rgba\(255, 255, 255, 0\.08\);/g, '--glass-border: rgba(0, 0, 0, 0.08);');
    content = content.replace(/--border-soft: rgba\(255, 255, 255, 0\.1\);/g, '--border-soft: rgba(0, 0, 0, 0.1);');

    // Backgrounds
    content = content.replace(/background: radial-gradient\(circle at top left, #1e293b, #0f172a 50%, #000000 100%\);/g, 'background: radial-gradient(circle at top left, #f1f5f9, #f8fafc 50%, #e2e8f0 100%);');
    content = content.replace(/background: rgba\(15, 23, 42, 0\.6\);/g, 'background: rgba(255, 255, 255, 0.6);');
    content = content.replace(/background: rgba\(15, 23, 42, 0\.5\);/g, 'background: rgba(255, 255, 255, 0.5);');
    content = content.replace(/background: rgba\(15, 23, 42, 0\.8\);/g, 'background: rgba(255, 255, 255, 0.8);');
    content = content.replace(/background: rgba\(15, 23, 42, 0\.9\);/g, 'background: rgba(255, 255, 255, 0.9);');
    content = content.replace(/background: #0f172a;/g, 'background: #f8fafc;');

    // Card backgrounds and text colors
    content = content.replace(/color: #fff(;?)(!important)?/g, 'color: #0f172a$1$2');
    content = content.replace(/color: #cbd5e1(;?)/g, 'color: #334155$1');
    content = content.replace(/background: rgba\(255, 255, 255, 0\.05\);/g, 'background: rgba(0, 0, 0, 0.05);');
    content = content.replace(/background: rgba\(255, 255, 255, 0\.03\);/g, 'background: rgba(0, 0, 0, 0.03);');
    content = content.replace(/background: rgba\(255, 255, 255, 0\.1\);/g, 'background: rgba(0, 0, 0, 0.1);');
    content = content.replace(/border: 1px solid rgba\(255, 255, 255, 0\.1\);/g, 'border: 1px solid rgba(0, 0, 0, 0.1);');
    content = content.replace(/border: 1px solid rgba\(255, 255, 255, 0\.05\);/g, 'border: 1px solid rgba(0, 0, 0, 0.05);');

    // Update logos logic to dark if any
    content = content.replace(/color: var\(--text-muted\);/g, 'color: var(--text-muted);'); // unchanged but safe

    fs.writeFileSync(filePath, content);
});

console.log("Theme updated across all HTML files!");
