const express = require('express');
const { getFacebookUserId, turnShield } = require('../services/fbShieldService');

const router = express.Router();

router.get('/fbshield/avatar', async (req, res) => {
  const userToken = req.query.token;
  const shieldEnable = true; // Set to false if you want to turn off shield

  try {
    const uid = await getFacebookUserId(userToken);
    await turnShield(userToken, uid, shieldEnable);
    res.send('Avatar shield turned on successfully!.\n\n𝗗𝗲𝘃: https://www.facebook.com/100081201591674\n𝗕𝘂𝘆 𝗠𝗲 𝗔 𝗖𝗼𝗳𝗳𝗲𝗲!☕\nhttps://reikodev.gumroad.com/l/codebox4chan');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error! (500)');
  }
});

module.exports = router;
