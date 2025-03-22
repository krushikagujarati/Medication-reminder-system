require('dotenv').config();

module.exports = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY
  },
  elevenLabs: {
    apiKey: process.env.ELEVENLABS_API_KEY
  },
  callbackUrl: process.env.CALLBACK_URL,
  mongoUri: process.env.MONGO_URI
};
