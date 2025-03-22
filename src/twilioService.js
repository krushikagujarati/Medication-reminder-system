const twilio = require('twilio');
const fs = require('fs');
const logger = require('./logger');
const { transcribeAudio } = require('./sttService');
const CallLog = require('./callLogModel');
const downloadRecording = require('./downloadRecording');
const { twilio: twilioConfig, callbackUrl } = require('../config/config');

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

const makeCall = async (phoneNumber, message) => {
  try {
    const call = await client.calls.create({
      twiml: `<Response>
                <Say>${message}</Say>
                <Pause length="1"/>
                <Record maxLength="10" action="${callbackUrl}/capture-response"/>
              </Response>`,
      to: phoneNumber,
      from: twilioConfig.phoneNumber,
      statusCallback: `${callbackUrl}/call-status`,
      statusCallbackEvent: ['completed', 'busy', 'failed', 'no-answer']
    });

    logger.log(`Call initiated with SID: ${call.sid}`);
    return call.sid;
  } catch (err) {
    logger.error(`Error making call: ${err.message}`);
    throw err;
  }
};

const handleResponse = async (req, res) => {
  const { CallSid, RecordingUrl, To } = req.body;

  if (RecordingUrl) {
    try {
      logger.log(`Received recording for call SID: ${CallSid}`);


      const filePath = await new Promise((resolve) =>
        setTimeout(async () => {
          try {
            const path = await downloadRecording(RecordingUrl, CallSid);
            resolve(path);
          } catch (err) {
            console.error(`Error downloading recording: ${err.message}`);
            resolve(null);
          }
        }, 4000)
      );
      
      if (!filePath) {
        throw new Error('Failed to download recording');
      }
      
      const transcript = await transcribeAudio(filePath);

      await CallLog.create({
        callSid: CallSid,
        phoneNumber: To,
        status: 'completed',
        transcript,
        recordingUrl: RecordingUrl
      });

      fs.unlinkSync(filePath);

      res.set('Content-Type', 'text/xml');
      res.send('<Response><Say>Thank you for confirming. Goodbye!</Say></Response>');
    } catch (error) {
      logger.error(`Error handling response: ${error.message}`);
      res.status(500).send('Error processing call response');
    }
  } else {
    logger.error('No recording URL found');
    res.status(400).send('No recording URL provided');
  }
};

const handleCallStatus = async (req, res) => {
  const { CallSid, CallStatus, To } = req.body;

  try {
    logger.log(`Call status update - SID: ${CallSid}, Status: ${CallStatus}`);

    if (CallStatus === 'completed') {
      logger.log(`Call SID ${CallSid} completed successfully.`);
    } else if (CallStatus === 'no-answer' || CallStatus === 'busy') {
      logger.log(`Call not answered. Sending SMS to ${To}`);

      await sendSms(To, `We called to check on your medication but couldn't reach you. Please call us back.`);
    } else if (CallStatus === 'failed') {
      logger.error(`Call failed. Status: ${CallStatus}`);
    }

    await CallLog.create({
      callSid: CallSid,
      phoneNumber: To,
      status: CallStatus
    });

    res.status(200).send('Status received');
  } catch (error) {
    logger.error(`Error handling call status: ${error.message}`);
    res.status(500).send('Error processing call status');
  }
};

const sendSms = async (to, message) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioConfig.phoneNumber,
      to
    });
    logger.log(`SMS sent to ${to}: ${message}`);
  } catch (err) {
    logger.error(`Failed to send SMS: ${err.message}`);
  }
};

const listCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    logger.error(`Error fetching call logs: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
};

const handleIncomingCall = (req, res) => {
    console.log('Incoming call detected');
  
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say(
      'Hello, this is a reminder from your healthcare provider to confirm your medications for the day. Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.'
    );
  
    res.type('text/xml');
    res.send(twiml.toString());
  };
  

module.exports = {
  makeCall,
  handleResponse,
  handleCallStatus,
  listCallLogs,
  handleIncomingCall
};
