const express = require('express');
const { getEarthquakeData } = require('../services/geologicBox');
const axios = require('axios');

const router = express.Router();

router.get('/geologic', async (req, res) => {
  const { earthquake } = req.query;

  try {
    const earthquakeData = await getEarthquakeData(earthquake || 'last hour');
    res.json({ earthquakeData, source: 'https://earthquake.phivolcs.dost.gov.ph\nhttps://www.phivolcs.dost.gov.ph/index.php/earthquake/earthquake-information3\nhttps://earthquake.usgs.gov/earthquakes/map/?extent=-32.54681,-132.01172&extent=75.40885,-57.65625&map=false\nhttps://earthquaketrack.com', codebox4chan: 'https://www.facebook.com/codebox4chan' });
  } catch (error) {
    console.error('Error in earthquake route:', error);
    res.status(500).json({ error: 'Server is Down!' });
  }
});



module.exports = router;
