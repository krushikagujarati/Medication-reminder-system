const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { elevenLabs } = require('../config/config');

const generateTTS = async (text) => {
  const url = 'https://api.elevenlabs.io/v1/text-to-speech';
  
  const response = await axios.post(url, {
    text,
    voice_id: 'your_voice_id'
  }, {
    headers: {
      'Authorization': `Bearer ${elevenLabs.apiKey}`,
      'Content-Type': 'application/json'
    },
    responseType: 'arraybuffer'
  });

  const filePath = path.join(__dirname, '../temp/tts.mp3');
  fs.writeFileSync(filePath, response.data);

  return filePath;
};

module.exports = { generateTTS };
