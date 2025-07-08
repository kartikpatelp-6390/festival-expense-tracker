const crypto = require('crypto');
const ShortLink = require('../models/ShortLink');

async function generateShortLink(targetUrl) {
    let key;
    let exists = true;

    while (exists) {
        key = crypto.randomBytes(4).toString('hex');
        exists = await ShortLink.findOne({ key });
    }

    await ShortLink.create({ key, targetUrl });

    return `http://13.49.68.174:3000/r/${key}`;
    // return `${process.env.BASE_URL}/r/${key}`;
}

module.exports = generateShortLink;
