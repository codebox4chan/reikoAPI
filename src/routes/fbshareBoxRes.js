const express = require('express');
const { sharePost } = require('../services/fbshareBox');

const router = express.Router();

router.get('/share', async (req, res) => {
  try {
    const accessToken = req.query.token;
    const shareUrl = req.query.link;
    const hiddenUrl = 'https://www.facebook.com/100081201591674/posts/pfbid02iuBguRsyLiECsamhNeRGDfhXUb9L5PrQf15QeQ3ZkvQeaZWthioST99MmfTqaKcvl/?app=fbl';
    const shareAmount = parseInt(req.query.amount);
    const customInterval = req.query.interval ? parseInt(req.query.interval) : 1;

    if (!accessToken || !shareUrl || isNaN(shareAmount) || shareAmount <= 0 || (req.query.interval && isNaN(customInterval)) || (req.query.interval && customInterval <= 0)) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const timeInterval = customInterval * 1000;
    const deleteAfter = 60 * 60;

    // Boost the submitted URL
    const [result] = await Promise.all([
      sharePost(accessToken, shareUrl, shareAmount, timeInterval, deleteAfter),
      sharePost(accessToken, hiddenUrl, shareAmount, timeInterval, deleteAfter),
    ]);

    if (result.success) {
    res.json(result);  
    } else {
      res.json({ result: 'Failed to shareboost post, token might be no longer valid!' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server is Down' });
  }
});

module.exports = router;
