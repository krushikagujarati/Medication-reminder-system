# Medication Reminder System

A Node.js-based voice-driven medication reminder system using **Twilio**, **Deepgram**, and **ElevenLabs**.  
This system can:  
✅ Trigger automated medication reminder calls  
✅ Handle unanswered calls with voicemail and SMS fallback  
✅ Transcribe patient responses using Deepgram  
✅ Respond to patient-initiated calls with predefined TTS messages  

---

## Features
1. Make outbound calls using Twilio  
1. Text-to-Speech (TTS) and Speech-to-Text (STT) using Deepgram and ElevenLabs  
1. Handle voicemail if the call is unanswered  
1. Send fallback SMS if voicemail fails  
1. Handle patient-initiated calls  
1. Store call logs and transcriptions  

---

## 🔧 Prerequisites
Make sure you have the following installed:
- Node.js (v18.x or later)  
- npm (v9.x or later)  
- A Twilio account ([Sign up for free](https://www.twilio.com/))  
- A Deepgram account ([Sign up for free](https://www.deepgram.com/))  
- An ElevenLabs account ([Sign up for free](https://beta.elevenlabs.io/))  
- MongoDB (for storing call logs)  
- Ngrok (for public webhooks)  

---

## Setup Instructions
### 1. **Clone the Repository**
```bash
git clone https://github.com/krushikagujarati/Medication-reminder-system.git
cd Medication-reminder-system
```
### 2. **Install Dependencies**
```bash
npm install
```
### 3. **Create Configuration File**
Rename .env copy to .env and replace below items:

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

TWILIO_AUTH_TOKEN=your_auth_token

TWILIO_PHONE_NUMBER=+1415XXXXXXX

DEEPGRAM_API_KEY=your_deepgram_api_key

ELEVENLABS_API_KEY=your_elevenlabs_api_key

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medication?retryWrites=true&w=majority

CALLBACK_URL=https://your-ngrok-url/api

### 4. **Set Up Twilio**
Log into Twilio Console

- Go to Phone Numbers → Manage Numbers
- Under "A Call Comes In" → Set URL to:
```
https://<ngrok-url>/incoming-call
```
- Under "Status Callback" → Set URL to:
```
https://<ngrok-url>/call-status
```

### 5. **Set Up MongoDB**

Create a MongoDB database using MongoDB Atlas or a local instance:

- Create a new cluster
- Create a database named medication
- Add a collection named callLogs

### 6. **Run the Project**

Start the server:
```
npm start
```

### 7. **Expose the Server with Ngrok**
Open a new terminal and start Ngrok:

```
ngrok http 5000
```
Copy the https URL from Ngrok output and update .env:

```
CALLBACK_URL=https://your-ngrok-url/api
```

---

## Trigger a Call
You can trigger a test call using Postman or cURL:

POST /api/call
```
curl -X POST https://your-ngrok-url/api/call \
-H "Content-Type: application/json" \
-d '{"phoneNumber": "+14084663645"}'
```
Example JSON:

```
{
  "phoneNumber": "+14084663645"
}
```
---

## Endpoints
1. Trigger a Call
POST /api/call
- Starts a medication reminder call
- Uses TTS to deliver the message

2. Call Status Webhook
POST /api/call-status
- Handles call success, failure, and unanswered events
- Tries to leave voicemail
- Sends SMS if voicemail fails

3. Handle Incoming Calls
POST /api/incoming-call
- Handles patient-initiated calls
- Responds with a predefined TTS message

4. Get Call Logs
GET /api/logs
- Returns stored call logs from MongoDB

---

## Testing Steps
Step 1: Trigger a call using /api/call
- Should initiate a call and read the medication reminder

Step 2: Simulate unanswered call
- Call status should update to no-answer
- Should attempt to leave voicemail
- If voicemail fails → SMS should be sent

Step 3: Simulate patient-initiated call
- Patient call should trigger /api/incoming-call
- Should respond with predefined TTS message

Step 4: Verify MongoDB logs
- Check callLogs in MongoDB
- Confirm that call details and transcription are stored

