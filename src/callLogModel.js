const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  callSid: String,
  phoneNumber: String,
  status: String,
  transcript: String,
  recordingUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const CallLog = mongoose.model('CallLog', callLogSchema);
module.exports = CallLog;
