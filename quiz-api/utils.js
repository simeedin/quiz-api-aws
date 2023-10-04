const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const pass = await bcrypt.hash(password, 10);
    return pass;
}

async function comparePassword(password, hash) {
    const passwordsMatch = await bcrypt.compare(password, hash);
    return passwordsMatch;
}

module.exports = {hashPassword, comparePassword}