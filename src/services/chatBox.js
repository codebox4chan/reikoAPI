const { Hercai } = require('hercai');
const { TextServiceClient } = require('@google-ai/generativelanguage').v1beta2;
const { GoogleAuth } = require('google-auth-library');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const replitai = require('@replit/ai-modelfarm');

const MODEL_NAME = 'models/text-bison-001';
const API_KEY = 'AIzaSyD4raIt2XwktawQ5Vulz6t6AymutqG7MgI'; // Replace with your actual Google API key

const herc = new Hercai();
const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});
const genAI = new GoogleGenerativeAI(API_KEY);

const hercai = async (question) => {
  try {
    const response = await herc.question({ model: 'v3-beta', content: question });
    return response.reply;
  } catch (error) {
    console.error('Error while making the Hercai API request:', error);
    throw new Error('An error occurred while processing the question.');
  }
};

const replit = async (prompt) => {
  try {
    const result = await replitai.chat({
      model: 'chat-bison',
      temperature: 0.5,
      messages: [{ author: 'user', content: prompt }],
    });

    return result;
  } catch (error) {
    throw new Error('An error occurred while using Replit AI.');
  }
};

const palm = async (prompt) => {
  try {
    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    const output = result[0]?.candidates[0]?.output;
    return output || null;
  } catch (error) {
    throw new Error('An error occurred while generating text with Palm AI.');
  }
};

const gemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;
    return response || null;
  } catch (error) {
    throw new Error('An error occurred while generating text with Google Generative AI.');
  }
};

module.exports = { hercai, replit, palm, gemini };
