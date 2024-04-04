const bcrypt = require('bcryptjs');

const encrypt = async(password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

const compare = async(password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
}

module.exports= {encrypt, compare};