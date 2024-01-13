const express = require('express');
const router = express.Router();
const axios = require('axios');
const bodyParser = require('body-parser');
let ai21_Key = 'zCB7sL5lwjPHrareizXMB3f1oSoelGqn';
let eden_Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTNlZDNjNDItN2YyYi00YzY0LTg0MTgtNzIyNzlhNzlhZDY1IiwidHlwZSI6ImFwaV90b2tlbiJ9.CCdEY8r2C8GH6hRqPJMxXoHgveMzT_AOKLD6VgapNvw';
const bard_cookie = 'dwgAPQ6dpoN-5gwiNz12Ddp7eUNP3fvlCLhCwJFDMVDvhGrv2rZ3WJ29FZ_aZxbKH5_AZA.';

router.use(bodyParser.json());

const chatbot = require('../services/chatBox');

router.get('/gpt4', async (req, res) => {
  const question = req.query.prompt;

  if (!question) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  try {
    const reply = await hercai(question);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the question.' });
  }
});

router.post('/gpt4', async (req, res) => {
  const question = req.body.prompt;

  if (!question) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  try {
    const reply = await chatbot.hercai(question);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Server is Down Please Try Again Later!' });
  }
});

router.get('/replit/pro', async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Please provide a prompt.' });
    }
    const result = await chatbot.replit(prompt);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server is Down Please Try Again Later!' });
  }
});

router.get('/replit', async (req, res) => {
  try {
    const input = req.query.prompt;

    if (!input) {
      return res.status(400).json({ error: 'Prompt query parameter is required' });
    }

    const apiUrl = `https://hazeyy-api-useless.kyrinwu.repl.co/api/replit/ai?input=${encodeURIComponent(input)}`;

    const response = await axios.get(apiUrl);

    if (response.status !== 200) {
      return res.status(response.status).json({ error: 'Error Occured!' });
    }

    // Parse the response appropriately
    let regexPattern = /\n\n>\s*🇵🇭\s*𝙿𝙷\s*𝚃𝚒𝚖𝚎:\s*[^<]*<\s*/;
    let rmbox = response.data.bot_response.replace(regexPattern, '');

    res.json({ bot_response: rmbox }); // Assuming rmbox is the correct property to return
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server is Down' });
  }
});

router.get('/palm', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing text parameter in the query.' });
  }

  try {
    const reply = await chatbot.palm(prompt);

    if (reply) {
      res.json({ reply });
    } else {
      res.json({ reply: `I'm still learning, I can't answer that.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server is Down Please Try again later!' });
  }
});

router.get('/gemini-pro', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing text parameter in the query.' });
  }

  try {
    const reply = await chatbot.gemini(prompt);

    if (reply) {
      res.json({ reply });
    } else {
      res.json({ reply: `I'm still learning, I can't answer that.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server is Down Please Try again later!' });
  }
});


router.get('/gemini-pro', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing text parameter in the query.' });
  }

  try {
    const reply = await chatbot.gemini(prompt);

    if (reply) {
      res.json({ reply });
    } else {
      res.json({ reply: `I'm still learning, I can't answer that.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server is Down Please Try again later!' });
  }
});

router.get('/ai', async (req, res) => {
  try {
    const { prompt, Key, model } = req.query;

    let chatgpt = Key || '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';
    const modelName = model || 'gpt-3.5-turbo';

    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: modelName,
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
        max_tokens: 4096,
        temperature: 1,
        top_p: 1, 
        n: 1,
        presence_penalty: 0, 
        frequency_penalty: 0, 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Key}`,
        },
      }
    );

    const responseText = response.data.choices[0].message.content;
    res.json({ reply: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/paraphrase', async (req, res) => {
  const { text, Key } = req.query;

  try {
    const response = await axios.post("https://api.ai21.com/studio/v1/paraphrase", {
      "text": text
    }, {
      headers: {
        "Authorization": `Bearer ${Key || ai21_Key}`,//https://studio.ai21.com/account/api-key
        "Content-Type": "application/json"
      }
    });

    const suggestions = response.data.suggestions;

    if (suggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      const randomSuggestion = suggestions[randomIndex];
      
      // Return success with the paraphrased text
      res.json({ paraphrase: randomSuggestion.text });
    } else {
      res.json({ paraphrase: "No suggestions available please try again later." });
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json({ error: "Server is Down!" });
  }
});

router.get('/j2-ultra', async (req, res) => {
  const { prompt, Key } = req.query;

  try {
    const response = await axios.post("https://api.ai21.com/studio/v1/j2-ultra/chat", {
      "numResults": 1,
      "temperature": 0.7,
      "messages": [
        {
          "text": prompt,
          "role": "user"
        }
      ],
      "system": "You are an AI assistant for business research. Your responses should be informative and concise."
    }, {
      headers: {
        "Authorization": `Bearer ${Key || ai21_Key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });

    const reply = response.data.outputs[0].text;

    // Return the reply from J2 Ultra
    res.json({ reply });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/eden", async (req, res) => {
  try {
    const { prompt, Key } = req.query;

    const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/text/chat",
      headers: {
        authorization: `Bearer ${Key || eden_Key}`,
      },
      data: {
        providers: "openai",
        text: prompt,
        chatbot_global_action: "Act as an assistant name eden ai",
        previous_history: [],
        temperature: 0.0,
        max_tokens: 150,
        fallback_providers: "",
      },
    };

    const response = await axios.request(options);
    res.json({ reply: response.data.openai.generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server is Down" });
  }
});

router.get('/bard', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  try {
    const reply = await axios(`https://api-samir.onrender.com/api/bard?question=${prompt}`);
    res.json(reply.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the question.' });
  }
});

module.exports = router;


