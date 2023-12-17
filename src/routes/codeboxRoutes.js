const express = require('express');
const codeService = require('../services/codeboxService');

const router = express.Router();
const axios = require('axios');



router.use(express.json());

router.get('/codebox', (req, res) => {
  try {
    const { data, filename } = req.query;

    if (!data || !filename) {
      return res.status(400).json({ error: 'Both "data" and "filename" parameters are required.' });
    }

    codeService.initializeDatabase();

    const uniqueId = codeService.generateUniqueId();

    codeService.insertCode(uniqueId, data, filename);

    const host = req.get('host');
    const link = `http://${host}/code/${uniqueId}`;
    res.json({ link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/codebox/:id', (req, res) => {
  try {
    const { id } = req.params;

    const row = codeService.getCodeById(id);

    if (!row) {
      res.status(404).json({ error: 'Code not found.' });
    } else {
      res.send(row.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/card', async (req, res) => {

 try {
 const response = await axios.get(`https://db.ygoprodeck.com/api/v7/randomcard.php`);
 res.json(response.data); 
 } catch (error) {
 res.status(500).json('Server is Busy Try Again Later');
 }
});

router.get('/coc/:resource', async (req, res) => { try { const { resource } = req.params;                            const { clans, players } = req.query;
                                                        if (!resource) { return res.status(400).json({ error: 'Please provide a valid resource (e.g., clans, players, etc.).' }); }

    // You'll need to replace 'YOUR_API_KEY' with your Clash of Clans API key
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjFhYjgyNGQ1LTFlMTgtNGM3Mi1iZjNmLWIxODIwMTY4NzU4NyIsImlhdCI6MTcwMjc3NjMwOSwic3ViIjoiZGV2ZWxvcGVyLzhkYjYxNmI2LWZhMWYtMjVmMy05N2FlLWViYTlkYjhlODE0ZCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE3NS4xNzYuNzAuMTUiXSwidHlwZSI6ImNsaWVudCJ9XX0.1pFHKw8-FIQN7Ahiwx4OUHjY_1CE2u43YkV69MH57CsSS3qL0onKXdoe3hC3Rzgha8W5gxwgIut0oinbVnd3EA';
    const apiUrl = `https://api.clashofclans.com/v1/${resource}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
params: {
        clans,
        players,
      },
    });


    const coc = response.data;
    res.json(coc);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
