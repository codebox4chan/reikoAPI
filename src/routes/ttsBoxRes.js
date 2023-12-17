const axios = require('axios');
const { ensureDir, createWriteStream, unlinkSync } = require('fs-extra');
const { resolve } = require('path');
const express = require('express');

const router = express.Router();

router.get('/tts', async (req, res) => {
    const text = req.query.text;

    try {
        const response = await axios.get(`https://www.api.vyturex.com/beast?query=${text}`);

        if (response.data && response.data.audio) {
            const audioURL = response.data.audio;
            const fileName = "mrbeast!.mp3";
            const filePath = resolve(__dirname, "cache", fileName);

            await ensureDir(resolve(__dirname, "cache")); // Ensure the directory exists

            await downloadFile(audioURL, filePath);

            res.json({ audioUrl: `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/file/${fileName}` });
        } else {
            res.status(500).json({ error: "Failed to fetch Beast API response." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the command." });
    }
});

async function downloadFile(url, filePath) {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
    });

    const dest = createWriteStream(filePath); // Fix createWriteStream

    response.data.pipe(dest);

    return new Promise((resolve, reject) => {
        dest.on('finish', () => resolve());
        dest.on('error', (err) => reject(err));
    });
}

module.exports = router;
