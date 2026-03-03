const fs = require('fs');
try {
    require('./server.js');
} catch (e) {
    fs.writeFileSync('error_trace.txt', e.stack, 'utf8');
}
