const express = require('express');
const { makeCall, handleResponse, handleCallStatus, listCallLogs, handleIncomingCall } = require('./twilioService');

const router = express.Router();

router.post('/call', async (req, res) => {
  const { phoneNumber } = req.body;
  const message = `Hello, this is a reminder from your healthcare provider to confirm your medications for the day. 
                   Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.`;
  
  try {
    const callSid = await makeCall(phoneNumber, message);
    res.status(200).json({ success: true, callSid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/webhook/capture-response', handleResponse);

router.post('/webhook/call-status', handleCallStatus);

router.post('/incoming-call', handleIncomingCall);

router.get('/logs', listCallLogs);

module.exports = router;
