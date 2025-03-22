const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { twilio: twilioConfig } = require('../config/config');

const downloadRecording = async (recordingUrl, callSid) => {
  console.log(`Downloading recording from URL: ${recordingUrl}`);

  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `recording-${callSid}.mp3`);

  try {
    recordingUrl = encodeURI(recordingUrl);

    const auth = `${twilioConfig.accountSid}:${twilioConfig.authToken}`;
    const response = await axios({
      url: recordingUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`,
        'Accept': 'audio/mpeg'
      },
      timeout: 10000
    });

    console.log(`➡️ HTTP Status: ${response.status} - ${response.statusText}`);

    fs.writeFileSync(filePath, response.data);
    console.log(`Recording downloaded to: ${filePath}`);

    return filePath;
  } catch (error) {
    console.error(`Error Response: ${error.response ? error.response.data : error.message}`);
    throw new Error(`Failed to download recording: HTTP ${error.response?.status} - ${error.response?.statusText}`);
  }
};

module.exports = downloadRecording;
