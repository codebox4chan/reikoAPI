// services/imageService.js

const axios = require('axios');
const FormData = require('form-data');

async function generateImage(prompt) {
  const form = new FormData();
  form.append('prompt', prompt);

  try {
    const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
      headers: {
        'x-api-key': '22cacb853bea8a80c9726cc85fcd317e2f310f4d501d8241fd2d882064d4e47f8b2c8f4b4e0c638aa620b62e4e2ec44b',
        ...form.getHeaders(),
      },
      responseType: 'arraybuffer', // Set the response type to arraybuffer to handle binary data
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

module.exports = {
  generateImage,
};
