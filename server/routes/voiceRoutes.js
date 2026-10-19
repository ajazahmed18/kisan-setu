import express from 'express';
import { streamTTS, processVoiceQuery, handleIVR } from '../controllers/voiceController.js';

const router = express.Router();

router.get('/ai/tts', streamTTS);
router.post('/ai/voice-query', processVoiceQuery);
router.post('/voice/ivr', handleIVR);

export default router;
