const axios = require('axios');
const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

let NSFW = true;

const MAX_FILE_SIZE_MB = 25;

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getFileExtension = (contentType) => {
  const extensions = {
    'image/jpeg': 'png',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'png',
    'image/webp': 'png',
    'video/mp4': 'mp4',
    'video/webm': 'mp4',
    'video/quicktime': 'mp4',
  };
  return extensions[contentType] || 'unknown';
};

const downloadAndSaveMedia = async (mediaUrl, index, cacheDir) => {
  try {
    const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    const contentExtension = getFileExtension(contentType);

    if (contentExtension === 'unknown' || contentExtension === 'mp4') {
      console.log(`Skipped: ${mediaUrl} - Unknown or video content type`);
      return null;
    }

    const mediaPath = path.join(cacheDir, `civ_${index + 1}.${contentExtension}`);
    const fileBuffer = response.data;
    const fileSizeMB = fileBuffer.length / (1024 * 1024);

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      console.log(`Skipped: ${mediaUrl} - File size exceeds the limit`);
      return null;
    }

    fs.writeFileSync(mediaPath, fileBuffer);

    return { stream: fs.createReadStream(mediaPath), contentType, contentExtension, path: mediaPath };
  } catch (error) {
    console.error("Error occurred while downloading and saving the media:", error);
    return null;
  }
};

router.get('/guru', async (req, res) => {
  const prompt = req.query.prompt;

  try {
    // Assuming you have a service function named `generateImage` in imageService.js
    const imageBuffer = await imageService.generateImage(prompt);

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/rapsa', async (req, res) => {
  const { nsfw } = req.query;
  NSFW = nsfw === 'true';

  const cnt = 10;

  const Media = [];
  const usedCombos = new Set();

  try {
    const baseUrl = 'https://civitai.com/api/v1/images';
    const cacheDir = path.join(__dirname, './cache');

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    for (let i = 0; i < cnt; i++) {
      let uniqueComboFound = false;

      while (!uniqueComboFound) {
        const minPage = 1;
        const maxPage = 31;
        const randPage = Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;
        const randSort = getRandomElement(['Newest', 'Most Reactions', 'Most Comments']);
        const randPeriod = getRandomElement(['AllTime', 'Year', 'Week', 'Day']);
        const comboKey = `${randPage}_${randSort}_${randPeriod}`;

        if (!usedCombos.has(comboKey)) {
          usedCombos.add(comboKey);
          uniqueComboFound = true;

          try {
            const response = await axios.get(baseUrl, {
              params: {
                page: randPage,
                nsfw: NSFW,
                limit: 18,
                sort: randSort,
                period: randPeriod,
              },
            });

            if (response.data && response.data.items && response.data.items.length > 0) {
              const randIndex = Math.floor(Math.random() * response.data.items.length);
              const randMedia = response.data.items[randIndex];
              const mediaUrl = randMedia.url;

              const downloadedMedia = await downloadAndSaveMedia(mediaUrl, i, cacheDir);

              if (downloadedMedia) {
                Media.push(downloadedMedia);

                if (downloadedMedia.contentType === 'video/mp4' || downloadedMedia.contentType === 'video/webm') {
                  uniqueComboFound = false;
                  Media.pop();
                }
              }
            } else {
              return res.status(404).json({ message: 'No Data Found From Civit.AI' });
            }
          } catch (error) {
            console.error("Error occurred while fetching data from Civit.AI:", error);
            return res.status(500).json({ message: 'Error occurred while fetching data from Civit.AI. Please try again.' });
          }
        }
      }
    }

    const sendMediaMsgs = async (attachments) => {
      if (attachments.length > 0) {
        const responseUrls = attachments.map(item => ({
          url: `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/file/${path.basename(item.path)}`, // Replace with your server URL
          contentType: item.contentType,
          contentExtension: item.contentExtension,
        }));

        res.json({ reply: 'pogi', urls: responseUrls });
      }
    };

    const pictureAttachments = Media;
    await sendMediaMsgs(pictureAttachments);

    // Schedule cache cleanup after 5 minutes
    setTimeout(() => {
      try {
        pictureAttachments.forEach(item => fs.unlinkSync(item.path));

        const filesInCache = fs.readdirSync(cacheDir);
        filesInCache.forEach(file => {
          const filePath = path.join(cacheDir, file);
          fs.unlinkSync(filePath);
        });
        console.log('Cache cleanup completed.');
      } catch (cleanupError) {
        console.error('Error occurred during cache cleanup:', cleanupError);
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

  } catch (error) {
    console.error("General error:", error);
    return res.status(500).json({ message: 'Server is Down, Try Again Later!' });
  }
});

module.exports = router;
