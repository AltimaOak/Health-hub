const fs = require('fs');
const path = require('path');

const dashboards = {
    'company.html': {
        target: [
            { text: '<li class="nav-item active">', replace: '<li class="nav-item active" onclick="location.href=\'company.html\'" style="cursor:pointer">' },
            { text: '<li class="nav-item">\n          <span class="label">Health summaries</span>', replace: '<li class="nav-item" onclick="location.href=\'company-wellness-consent.html\'" style="cursor:pointer">\n          <span class="label">Health summaries</span>' },
            { text: '<li class="nav-item">\n          <span class="label">Consent dashboard</span>', replace: '<li class="nav-item" onclick="location.href=\'company-wellness-consent.html\'" style="cursor:pointer">\n          <span class="label">Consent dashboard</span>' }
        ]
    },
    'company-wellness-consent.html': {
        target: [
            { text: '<li class="nav-item">\n          <span class="label">Employee registry</span>', replace: '<li class="nav-item" onclick="location.href=\'company.html\'" style="cursor:pointer">\n          <span class="label">Employee registry</span>' },
            { text: '<li class="nav-item active">\n          <span class="label">Wellness & consent</span>', replace: '<li class="nav-item active" onclick="location.href=\'company-wellness-consent.html\'" style="cursor:pointer">\n          <span class="label">Wellness & consent</span>' }
        ]
    },
    'hospital.html': {
        target: [
            { text: '<li class="nav-item active">', replace: '<li class="nav-item active" onclick="location.href=\'hospital.html\'" style="cursor:pointer">' },
            { text: '<li class="nav-item">\n          <span class="label">Doctor onboarding</span>', replace: '<li class="nav-item" onclick="location.href=\'hospital.html\'" style="cursor:pointer">\n          <span class="label">Doctor onboarding</span>' },
            { text: '<li class="nav-item">\n          <span class="label">Visit history</span>', replace: '<li class="nav-item" onclick="location.href=\'hospital.html\'" style="cursor:pointer">\n          <span class="label">Visit history</span>' }
        ]
    },
    'doctor-portal-advanced.html': {
        target: [
            { text: '<li class="nav-item active">', replace: '<li class="nav-item active" onclick="location.href=\'doctor-portal-advanced.html\'" style="cursor:pointer">' },
            { text: '<li class="nav-item">\n          <span class="label">Prescriptions</span>', replace: '<li class="nav-item" onclick="location.href=\'doctor-portal-advanced.html\'" style="cursor:pointer">\n          <span class="label">Prescriptions</span>' }
        ]
    },
    'audit-compliance.html': {
        target: [
            { text: '<li class="nav-item active">', replace: '<li class="nav-item active" onclick="location.href=\'audit-compliance.html\'" style="cursor:pointer">' },
            { text: '<li class="nav-item">\n          <span class="label">DPO Settings</span>', replace: '<li class="nav-item" onclick="location.href=\'audit-compliance.html\'" style="cursor:pointer">\n          <span class="label">DPO Settings</span>' }
        ]
    }
};

for (const [file, ops] of Object.entries(dashboards)) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix broken links
        content = content.replace(/company-portal\.html/g, 'company.html');
        content = content.replace(/hospital-portal\.html/g, 'hospital.html');
        content = content.replace(/doctor-portal\.html/g, 'doctor-portal-advanced.html');

        // Add list items onclicks
        ops.target.forEach(t => {
            content = content.replace(t.text, t.replace);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed nav for', file);
    }
}
