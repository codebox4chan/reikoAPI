const axios = require('axios');

async function getRequest(url, headers) {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
    throw new Error('Request failed');
  }
}

module.exports = { getRequest };
