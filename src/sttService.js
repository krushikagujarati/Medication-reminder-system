const { createClient } = require("@deepgram/sdk");
const { srt } = require("@deepgram/captions");
const fs = require('fs');
const { deepgram } = require('../config/config');

const deepgramClient = createClient(deepgram.apiKey);

const transcribeAudio = async (filePath) => {
  try {
    console.log(`Transcribing audio file: ${filePath}`);
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
      fs.readFileSync(filePath),
      {
        model: "nova-3",
      }
    );

    if (error) {
      console.error(`Error in transcription: ${error.message}`);
      throw error;
    }

    const captions = srt(result);
    console.log(`Transcription: ${captions}`);
    return captions || 'No transcription available';
  } catch (error) {
    console.error(`Error in transcription: ${error.message}`);
    throw error;
  }
};

module.exports = { transcribeAudio };
