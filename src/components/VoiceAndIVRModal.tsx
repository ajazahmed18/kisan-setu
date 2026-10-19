import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Square,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';

interface VoiceAndIVRModalProps {
  mode: 'ivr' | 'voice';
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'te' | 'hi';
  onNavigateAction: (target: string) => void;
}

export const VoiceAndIVRModal: React.FC<VoiceAndIVRModalProps> = ({
  mode,
  isOpen,
  onClose,
  language,
  onNavigateAction,
}) => {
  const [activeMode, setActiveMode] = useState<'ivr' | 'voice'>(mode);
  const [selectedLanguage, setSelectedLanguage] = useState<'te' | 'hi' | 'en'>(
    language === 'te' || language === 'hi' ? language : 'te'
  );

  // IVR Telephony State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('connected');
  const [ivrStep, setIvrStep] = useState<'language_select' | 'service_select' | 'result'>('language_select');
  const [ivrPrompt, setIvrPrompt] = useState(
    'Welcome to KisanSetu IVR Toll-Free service. తెలుగు కోసం 1 నొక్కండి. हिंदी के लिए 2 दबाएं. For English press 3.'
  );
  const [ivrHistory, setIvrHistory] = useState<string[]>([
    'Welcome to KisanSetu IVR Toll-Free service. తెలుగు కోసం 1 నొక్కండి. हिंदी کے لیے 2 दबाएं. For English press 3.',
  ]);

  // Voice AI Assistant State
  const [voiceInput, setVoiceInput] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<any | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listeningError, setListeningError] = useState<string | null>(null);

  // Audio and Speech refs
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  useEffect(() => {
    setActiveMode(mode);
    if (mode === 'ivr') {
      resetIvrCall();
    }
  }, [mode, isOpen]);

  // Sync initial language if parent changes
  useEffect(() => {
    if (language === 'te' || language === 'hi' || language === 'en') {
      setSelectedLanguage(language);
    }
  }, [language]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Stop active speech playback
  const stopSpeaking = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Browser speech synthesis fallback with native voice lookup
  const speakBrowserSynthesis = (text: string, lang: 'te' | 'hi' | 'en') => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const targetCode = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = targetCode;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(lang) ||
          v.lang.toLowerCase().replace('_', '-').startsWith(targetCode.toLowerCase()) ||
          v.name.toLowerCase().includes(lang === 'te' ? 'telugu' : lang === 'hi' ? 'hindi' : 'india')
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsPlayingAudio(false);
    }
  };

  // High-Quality Human Voice Playback (Audio Element + Server Neural TTS + Browser Fallback)
  const playHumanVoiceAudio = (audioDataOrUrl?: string, text?: string, lang?: 'te' | 'hi' | 'en') => {
    if (!ttsEnabled) return;
    stopSpeaking();

    const activeLang = lang || selectedLanguage;
    const spokenText = text || '';

    // 1. Try base64 embedded audio first
    if (audioDataOrUrl && audioDataOrUrl.startsWith('data:audio/')) {
      try {
        const audio = new Audio(audioDataOrUrl);
        activeAudioRef.current = audio;
        setIsPlayingAudio(true);

        audio.onended = () => {
          setIsPlayingAudio(false);
          activeAudioRef.current = null;
        };

        audio.onerror = (e) => {
          console.warn('Base64 audio playback failed, falling back to TTS stream:', e);
          setIsPlayingAudio(false);
          activeAudioRef.current = null;
          if (spokenText) {
            playFromTTSStream(spokenText, activeLang);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play restricted by browser:', err);
            setIsPlayingAudio(false);
            if (spokenText) {
              speakBrowserSynthesis(spokenText, activeLang);
            }
          });
        }
        return;
      } catch (err) {
        console.warn('Failed to initialize Audio:', err);
      }
    }

    // 2. Try TTS streaming endpoint
    if (spokenText) {
      playFromTTSStream(spokenText, activeLang);
    }
  };

  const playFromTTSStream = (text: string, lang: 'te' | 'hi' | 'en') => {
    const ttsUrl = `/api/ai/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    try {
      const audio = new Audio(ttsUrl);
      activeAudioRef.current = audio;
      setIsPlayingAudio(true);

      audio.onended = () => {
        setIsPlayingAudio(false);
        activeAudioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        activeAudioRef.current = null;
        speakBrowserSynthesis(text, lang);
      };

      audio.play().catch(() => {
        setIsPlayingAudio(false);
        speakBrowserSynthesis(text, lang);
      });
    } catch {
      speakBrowserSynthesis(text, lang);
    }
  };

  const resetIvrCall = () => {
    setCallStatus('connected');
    setIvrStep('language_select');
    const initialText =
      'Welcome to KisanSetu IVR Toll-Free service. తెలుగు కోసం 1 నొక్కండి. हिंदी के लिए 2 दबाएं. For English press 3.';
    setIvrPrompt(initialText);
    setIvrHistory([initialText]);
    playHumanVoiceAudio(undefined, initialText, 'en');
  };

  const handleKeypadPress = async (digit: string) => {
    if (callStatus !== 'connected') return;

    try {
      const res = await fetch('/api/voice/ivr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: ivrStep,
          language: selectedLanguage,
          digit,
        }),
      });
      const data = await res.json();

      setIvrPrompt(data.promptText);
      setIvrHistory((prev) => [...prev, `[Key ${digit} Pressed]`, data.promptText]);
      playHumanVoiceAudio(undefined, data.promptText, selectedLanguage);

      if (data.isComplete) {
        setIvrStep('result');
      } else if (data.nextStep === 'service_select') {
        setIvrStep('service_select');
      }
    } catch (err) {
      console.warn('IVR error:', err);
    }
  };

  // Voice AI Query Dispatcher
  const handleSendVoiceQuery = async (queryText: string) => {
    const textToSend = (queryText || '').trim();
    if (!textToSend) return;

    stopListening();
    stopSpeaking();
    setIsProcessingVoice(true);
    setVoiceResponse(null);
    setListeningError(null);

    try {
      const res = await fetch('/api/ai/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      setVoiceResponse(data);

      // Play human-like voice response in pure Telugu/Hindi/English
      if (data.speechAudio) {
        playHumanVoiceAudio(data.speechAudio, data.text, data.language || selectedLanguage);
      } else if (data.text) {
        playHumanVoiceAudio(undefined, data.text, data.language || selectedLanguage);
      }
    } catch (err) {
      console.warn('Voice AI query error:', err);
      const fallbackMsg =
        selectedLanguage === 'te'
          ? 'క్షమించండి, సర్వర్ స్పందించడం లేదు. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : selectedLanguage === 'hi'
          ? 'माफ़ कीजिए, सर्वर कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Sorry, voice server is busy. Please try again.';
      setVoiceResponse({
        text: fallbackMsg,
        detectedIntent: 'Error',
        actionTarget: 'market-prices',
      });
      playHumanVoiceAudio(undefined, fallbackMsg, selectedLanguage);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Stop speech recognition helper
  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  // Complete Continuous Speech Recognition with Silence Detection & Live Transcribing
  const handleToggleListening = () => {
    if (isListening) {
      const finalQuery = (accumulatedTranscriptRef.current + ' ' + interimTranscript).trim() || voiceInput;
      stopListening();
      if (finalQuery) {
        handleSendVoiceQuery(finalQuery);
      }
      return;
    }

    stopSpeaking();
    setListeningError(null);
    setVoiceResponse(null);
    setVoiceInput('');
    setInterimTranscript('');
    accumulatedTranscriptRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setListeningError('Browser does not support Speech Recognition. You can type or click quick prompts.');
      const fallbackQuery =
        selectedLanguage === 'te'
          ? 'హాయ్, బాగున్నారా?'
          : selectedLanguage === 'hi'
          ? 'नमस्ते, आज का भाव क्या है?'
          : 'Hi! What is today’s crop rate?';
      setVoiceInput(fallbackQuery);
      handleSendVoiceQuery(fallbackQuery);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Pure Telugu, Hindi, or English recognition
      recognition.lang =
        selectedLanguage === 'te' ? 'te-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const combinedText = (accumulatedTranscriptRef.current + ' ' + interim).trim();
        setVoiceInput(combinedText);
        setInterimTranscript(interim);

        // Reset silence timer: automatically send query 2.2 seconds after the user finishes speaking
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          const finishedSpeech = (accumulatedTranscriptRef.current + ' ' + interim).trim();
          if (finishedSpeech) {
            stopListening();
            handleSendVoiceQuery(finishedSpeech);
          }
        }, 2200);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed') {
          setListeningError('Microphone permission was denied. Please allow microphone access in browser settings.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Keep listening or allow user to speak again
        } else {
          setListeningError(`Audio input notice: ${event.error}. You can also type or use prompt buttons below.`);
        }
      };

      recognition.onend = () => {
        // If user is still marked as listening and there is text, send it
        if (isListening) {
          const currentText = (accumulatedTranscriptRef.current + ' ' + interimTranscript).trim() || voiceInput;
          setIsListening(false);
          if (currentText) {
            handleSendVoiceQuery(currentText);
          }
        }
      };

      recognition.start();
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      setIsListening(false);
      setListeningError('Could not start microphone. Please check browser permissions.');
    }
  };

  // Switch voice language
  const handleSelectLanguage = (lang: 'te' | 'hi' | 'en') => {
    stopSpeaking();
    stopListening();
    setSelectedLanguage(lang);
    setVoiceResponse(null);
    setVoiceInput('');
    setListeningError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-left">
        {/* Modal Top Header with Mode Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                setActiveMode('voice');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'voice'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-200" />
              <span>Voice AI (మాట్లాడండి)</span>
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                setActiveMode('ivr');
                resetIvrCall();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'ivr'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>IVR Phone Simulator</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  stopSpeaking();
                }
                setTtsEnabled(!ttsEnabled);
              }}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                ttsEnabled ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-700 text-base font-mono cursor-pointer p-1"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* MODE 1: VOICE AI ASSISTANT */}
        {activeMode === 'voice' && (
          <div className="space-y-3.5">
            {/* Language Selector Header */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Voice Language:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('te')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedLanguage === 'te'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  తెలుగు (Pure Telugu)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('hi')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedLanguage === 'hi'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Speaking / Listening Active Banner */}
            {isPlayingAudio && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-900">
                      {selectedLanguage === 'te'
                        ? 'కిసాన్‌సేతు స్వచ్ఛమైన తెలుగులో మాట్లాడుతోంది...'
                        : selectedLanguage === 'hi'
                        ? 'किसानसेतु बोल रहा है...'
                        : 'KisanSetu is speaking aloud...'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            )}

            {isListening && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                    </span>
                    <span className="text-xs font-bold text-rose-900">
                      {selectedLanguage === 'te'
                        ? 'మైక్ ఆన్ ఉంది... తెలుగులో మాట్లాడండి (Listening)'
                        : selectedLanguage === 'hi'
                        ? 'माइक चालू है... बोलिए (Listening)'
                        : 'Listening... speak clearly'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const finalQuery =
                          (accumulatedTranscriptRef.current + ' ' + interimTranscript).trim() || voiceInput;
                        stopListening();
                        if (finalQuery) handleSendVoiceQuery(finalQuery);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{selectedLanguage === 'te' ? 'పూర్తయింది' : 'Done & Send'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="px-2 py-1 bg-rose-200 hover:bg-rose-300 text-rose-900 text-[11px] font-semibold rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Live Real-time Transcribed Text */}
                <div className="p-2 bg-white rounded-lg border border-rose-200 min-h-[40px] text-xs font-medium text-slate-800 flex items-center">
                  {voiceInput ? (
                    <span className="text-slate-900">{voiceInput}</span>
                  ) : (
                    <span className="text-slate-400 italic">
                      {selectedLanguage === 'te'
                        ? '‘హాయ్’, ‘వరంగల్ పత్తి ధర ఎంత’, ‘టొమాటో రేటు’ మొదలైనవి మాట్లాడండి...'
                        : selectedLanguage === 'hi'
                        ? '‘नमस्ते’, ‘कपास का भाव’, ‘टमाटर मंडी’ बोलें...'
                        : 'Say ‘Hi’, ‘Cotton price’, or ‘Tomato rate’...'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {listeningError && (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                {listeningError}
              </div>
            )}

            {/* Quick voice suggestions chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>
                  {selectedLanguage === 'te'
                    ? 'త్వరిత ప్రశ్నలు (ఒక్క క్లిక్‌తో మాట్లాడండి):'
                    : selectedLanguage === 'hi'
                    ? 'त्वरित सवाल (क्लिक करें और सुनें):'
                    : 'Quick Voice Prompts:'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Pure Human Voice
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedLanguage === 'te' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'హాయ్, బాగున్నారా?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium text-[11px] rounded-lg cursor-pointer transition-all active:scale-95"
                    >
                      👋 "హాయ్, బాగున్నారా?" (Say Hi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'ఈ రోజు టొమాటో కిలో రేటు ఎంత?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      🍅 "టొమాటో కిలో ఎంత?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'వరంగల్ మార్కెట్లో పత్తి ధర ఎంత నాయనా?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      "వరంగల్ పత్తి ధర ఎంత?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'నిజామాబాద్ వరి ధాన్యం రేటు చెప్పు';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      "వరి ధాన్యం రేటు చెప్పు"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'నా పంటకు కొనుగోలుదారులు ఉన్నారా?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      💼 "బయ్యర్లు ఉన్నారా?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'సరుకు తీసుకెళ్లడానికి లారీ బుక్ చేయాలి';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      🚛 "లారీ రవాణా కావాలి"
                    </button>
                  </>
                )}

                {selectedLanguage === 'hi' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'नमस्ते, कैसे हैं आप?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium text-[11px] rounded-lg cursor-pointer transition-all active:scale-95"
                    >
                      👋 "नमस्ते, कैसे हैं आप?" (Say Hi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'आज टमाटर का थोक मंडी भाव क्या है?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      🍅 "टमाटर का मंडी भाव क्या है?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'आज वारंगल में कपास का क्या भाव है?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      "कपास का क्या भाव है?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'क्या मेरी फसल के लिए खरीदार उपलब्ध हैं?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      💼 "खरीदार उपलब्ध हैं?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'माल मंडी ले जाने के लिए लॉरी चाहिए';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      🚛 "लॉरी बुक करनी है"
                    </button>
                  </>
                )}

                {selectedLanguage === 'en' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'Hi, how are you?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium text-[11px] rounded-lg cursor-pointer transition-all active:scale-95"
                    >
                      👋 "Hi, how are you?" (Say Hi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'What is today’s tomato price in nearest market?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      🍅 "Tomato price today?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'Which market gives highest net profit for cotton?';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      "Highest net profit for cotton?"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const q = 'Show verified buyer offers';
                        setVoiceInput(q);
                        handleSendVoiceQuery(q);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-lg cursor-pointer transition-all"
                    >
                      💼 "Show buyer offers"
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Voice Input Field with Mic and Speak Controls */}
            <div className="relative">
              <input
                type="text"
                value={voiceInput}
                onChange={(e) => setVoiceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceQuery(voiceInput)}
                placeholder={
                  selectedLanguage === 'te'
                    ? 'మీ పంట ధరలు లేదా మార్కెట్ల గురించి తెలుగులో అడగండి...'
                    : selectedLanguage === 'hi'
                    ? 'मंडी भाव, खरीदार या लॉरी के बारे में पूछें...'
                    : 'Ask crop prices, buyers, or lorries in your language...'
                }
                className="w-full pr-28 pl-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all shadow-2xs font-medium text-slate-900"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`p-2 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                  }`}
                  title={isListening ? 'Stop Speaking / Submit' : 'Tap to Speak Microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendVoiceQuery(voiceInput)}
                  disabled={!voiceInput.trim()}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Ask
                </button>
              </div>
            </div>

            {/* AI Voice Query Processing Indicator */}
            {isProcessingVoice && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
                <span className="font-medium">
                  {selectedLanguage === 'te'
                    ? 'కిసాన్‌సేతు మీ మాటలను విశ్లేషించి మానవ స్వరాన్ని సిద్ధం చేస్తోంది...'
                    : selectedLanguage === 'hi'
                    ? 'किसानसेतु आवाज तैयार कर रहा है...'
                    : 'Processing dialect query and generating human voice...'}
                </span>
              </div>
            )}

            {/* AI Voice Output Display & Replay Controls */}
            {voiceResponse && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5 text-slate-800 shadow-2xs">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {selectedLanguage === 'te'
                        ? 'కిసాన్‌సేతు సమాధానం (Human Voice):'
                        : selectedLanguage === 'hi'
                        ? 'किसानसेतु का उत्तर:'
                        : 'Voice Response:'}
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {voiceResponse.detectedIntent}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        playHumanVoiceAudio(
                          voiceResponse.speechAudio,
                          voiceResponse.text,
                          voiceResponse.language || selectedLanguage
                        )
                      }
                      className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[10px] rounded-md transition-colors cursor-pointer flex items-center gap-1"
                      title="Replay Voice Audio"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{selectedLanguage === 'te' ? 'మళ్లీ వినండి' : 'Replay'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-800 font-medium bg-white p-3 rounded-lg border border-slate-100">
                  “{voiceResponse.text}”
                </p>

                {voiceResponse.actionTarget && (
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      stopListening();
                      onNavigateAction(voiceResponse.actionTarget);
                      onClose();
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {selectedLanguage === 'te'
                        ? `సంబంధిత స్క్రీన్‌కి వెళ్లండి (${voiceResponse.actionTarget})`
                        : `Jump to Screen (${voiceResponse.actionTarget})`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: IVR TELEPHONY SIMULATOR */}
        {activeMode === 'ivr' && (
          <div className="space-y-3.5">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-medium text-slate-900">
                  Toll-Free: 1800-425-166
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">00:42 • Connected</span>
            </div>

            {/* Audio Prompt Display Screen */}
            <div className="p-3.5 bg-slate-900 text-white rounded-lg min-h-[90px] flex flex-col justify-between space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  Live Human Voice Prompt Audio
                </span>
                <span className="text-[10px] font-mono text-slate-500">DTMF Active</span>
              </div>
              <p className="text-xs font-mono leading-relaxed text-slate-200">
                “{ivrPrompt}”
              </p>
            </div>

            {/* Simulated Phone Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
              {[
                { digit: '1', sub: 'Price / తెలుగు' },
                { digit: '2', sub: 'Market / हिंदी' },
                { digit: '3', sub: 'Offers / English' },
                { digit: '4', sub: 'Order Status' },
                { digit: '5', sub: 'Payment' },
                { digit: '6', sub: 'FPO Officer' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: 'Repeat' },
                { digit: '0', sub: 'Help' },
                { digit: '#', sub: 'End' },
              ].map((k) => (
                <button
                  key={k.digit}
                  onClick={() => handleKeypadPress(k.digit)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg text-center transition-all cursor-pointer shadow-2xs"
                >
                  <span className="text-base font-mono font-bold text-slate-900 block leading-tight">
                    {k.digit}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block truncate">
                    {k.sub}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button
                onClick={resetIvrCall}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  onClose();
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
