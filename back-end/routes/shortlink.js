const express = require('express');
const router = express.Router();
const ShortLink = require('../models/ShortLink');

router.get('/:key', async (req, res) => {
    try {
        const record = await ShortLink.findOne({ key: req.params.key });
        if (!record) return res.status(404).send('Invalid or expired link');
        return res.redirect(record.targetUrl);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
