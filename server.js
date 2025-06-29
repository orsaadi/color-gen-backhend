require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

const groq = new Groq({
  apiKey: process.env.APIKEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const color = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: color,
        },
        {
          role: 'assistant',
          content: '',
        },
      ],
      model: 'llama3-70b-8192',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const assistantResponse = chatCompletion.choices[0].message.content;
    res.json({ response: assistantResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
