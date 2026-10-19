import { GoogleGenAI } from '@google/genai';

let aiClient = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });
    } catch (e) {
      console.warn('GoogleGenAI failed to init in voice controller:', e);
    }
  }
  return aiClient;
}

async function fetchSpeechAudioBase64(text, lang) {
  try {
    const cleanText = (text || '').replace(/[*#_`]/g, '').trim();
    if (!cleanText) return null;
    const textSnippet = cleanText.length > 180 ? cleanText.substring(0, 180) + '...' : cleanText;
    const targetLang = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en-IN';
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textSnippet)}&tl=${targetLang}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) return null;
    const arrayBuf = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuf).toString('base64');
    return `data:audio/mpeg;base64,${base64Audio}`;
  } catch (err) {
    return null;
  }
}

export async function streamTTS(req, res) {
  const text = (req.query.text || '').toString();
  const lang = (req.query.lang || 'te').toString();

  if (!text) {
    return res.status(400).send('Text is required');
  }

  try {
    const targetLang = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en-IN';
    const textSnippet = text.length > 180 ? text.substring(0, 180) : text;
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textSnippet)}&tl=${targetLang}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(502).send('TTS upstream error');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const arrayBuf = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuf));
  } catch (err) {
    res.status(500).send('TTS error');
  }
}

export async function processVoiceQuery(req, res) {
  const { query, language } = req.body;
  let lang = language || 'te';

  const queryStr = (query || '').trim();
  const hasTelugu = /[\u0C00-\u0C7F]/.test(queryStr);
  const hasHindi = /[\u0900-\u097F]/.test(queryStr);
  if (hasTelugu) lang = 'te';
  else if (hasHindi) lang = 'hi';

  const lowerQuery = queryStr.toLowerCase();
  const isGreeting =
    lowerQuery === 'hi' ||
    lowerQuery === 'hello' ||
    lowerQuery === 'hey' ||
    lowerQuery.includes('హాయ్') ||
    lowerQuery.includes('హలో') ||
    lowerQuery.includes('నమస్కారం') ||
    lowerQuery.includes('బాగున్నారా') ||
    lowerQuery.includes('नमस्ते') ||
    lowerQuery.includes('हाय') ||
    lowerQuery.includes('राम राम') ||
    lowerQuery.includes('प्रणाम');

  let responseText = '';
  let actionTarget = 'market-prices';
  let detectedIntent = isGreeting ? 'Greeting / స్వాగతం' : 'Price Discovery';

  const ai = getAIClient();
  if (ai && queryStr) {
    try {
      const prompt = `You are KisanSetu's friendly, warm agricultural voice assistant for Indian farmers.
Target language: "${lang}" (te = pure Telugu, hi = respectful Hindi, en = warm Indian English).
User Query: "${queryStr}"
Is this a greeting: ${isGreeting ? 'YES' : 'NO'}

Market context:
- Cotton: ₹7,400/quintal in Warangal (Net Value ₹7,100)
- Rice/Paddy: ₹2,600/quintal in Nizamabad
- Tomato: ₹2,350/quintal in Bowenpally / Madanapalle
- Red Chilli: ₹19,200/quintal in Guntur
- Maize: ₹2,200/quintal in Karimnagar

Return ONLY valid JSON:
{
  "text": "1-2 spoken sentences for farmer",
  "actionTarget": "market-prices" | "farmer-lots" | "buyer-offers" | "transport" | "orders" | "fpo" | "community",
  "detectedIntent": "Brief intent label"
}`;

      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let response = null;
      for (const mName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: mName,
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
          if (response && response.text) break;
        } catch (mErr) {
          // next
        }
      }

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        const speechAudio = await fetchSpeechAudioBase64(parsed.text, lang);
        return res.json({
          text: parsed.text,
          actionTarget: parsed.actionTarget || 'market-prices',
          detectedIntent: parsed.detectedIntent || (isGreeting ? 'Greeting' : 'Voice Query'),
          speechAudio,
          language: lang,
        });
      }
    } catch (err) {
      // Fallback
    }
  }

  // Fallback responses
  if (isGreeting) {
    responseText =
      lang === 'te'
        ? 'నమస్కారం అండీ! బాగున్నారా? కిసాన్‌సేతుకు స్వాగతం. ఈ రోజు మీకు ఏ పంట ధర లేదా బయ్యర్ల సమాచారం కావాలో చెప్పండి.'
        : lang === 'hi'
        ? 'नमस्ते किसान भाई! राम-राम! किसानसेतु में आपका स्वागत है। आज आप कौन सी फसल का मंडी भाव जानना चाहते हैं?'
        : 'Hello! Welcome to KisanSetu! How can I help you today with crop prices or buyers?';
    actionTarget = 'market-prices';
    detectedIntent = 'Greeting / స్వాగతం';
  } else if (lowerQuery.includes('tomato') || lowerQuery.includes('టొమాటో') || lowerQuery.includes('టమాట') || lowerQuery.includes('टमाटर')) {
    responseText =
      lang === 'te'
        ? 'ఈ రోజు బోయిన్‌పల్లి మార్కెట్లో టొమాటో క్వింటాల్‌కు ₹2,350 (కేజీ సుమారు ₹24) గా నడుస్తోంది.'
        : lang === 'hi'
        ? 'आज बोवेनपल्ली मंडी में टमाटर ₹2,350 प्रति क्विंटल (लगभग ₹24/किग्रा) चल रहा है।'
        : "Today's tomato price in Bowenpally mandi is ₹2,350 per quintal (approx ₹24/kg).";
    actionTarget = 'market-prices';
    detectedIntent = 'Tomato Price / టొమాటో ధర';
  } else if (lowerQuery.includes('cotton') || lowerQuery.includes('పత్తి') || lowerQuery.includes('कपास')) {
    responseText =
      lang === 'te'
        ? 'వరంగల్ ఎనుమాముల మార్కెట్లో పత్తి క్వింటాలుకు ₹7,400 గా ఉంది. నికర లాభం ₹7,100 వస్తుంది.'
        : lang === 'hi'
        ? 'वारंगल मंडी में आज कपास का भाव ₹7,400 प्रति क्विंटल है। शुद्ध मुनाफा ₹7,100 मिलेगा।'
        : "Today's cotton price in Warangal market is ₹7,400 per quintal, giving ₹7,100 net realization.";
    actionTarget = 'market-prices';
    detectedIntent = 'Cotton Price / పత్తి ధర';
  } else {
    responseText =
      lang === 'te'
        ? 'కిసాన్‌సేతుకు నమస్కారం. మీరు పత్తి, వరి, టొమాటో, మిర్చి ధరల గురించి లేదా సమీప లారీ బుకింగ్ గురించి అడగవచ్చు.'
        : lang === 'hi'
        ? 'किसानसेतु में स्वागत है। आप कपास, धान, टमाटर के भाव या लॉरी बुकिंग की जानकारी ले सकते हैं।'
        : 'Welcome to KisanSetu. You can ask about crop prices, mandi trends, or transport booking.';
    actionTarget = 'market-prices';
    detectedIntent = 'General Assistant';
  }

  const speechAudio = await fetchSpeechAudioBase64(responseText, lang);

  res.json({
    text: responseText,
    actionTarget,
    detectedIntent,
    speechAudio,
    language: lang,
  });
}

export function handleIVR(req, res) {
  const { step, language, digit } = req.body;
  let nextStep = 'menu';
  let promptText = '';
  let isComplete = false;

  if (step === 'start') {
    nextStep = 'language_select';
    promptText = 'Welcome to KisanSetu IVR Toll-Free service. తెలుగు కోసం 1 నొక్కండి. हिंदी के लिए 2 दबाएं. For English press 3.';
  } else if (step === 'language_select') {
    const selectedLang = digit === '1' ? 'te' : digit === '2' ? 'hi' : 'en';
    nextStep = 'service_select';

    if (selectedLang === 'te') {
      promptText =
        'కిసాన్‌సేతు సేవలకు స్వాగతం. పంట ధరల కోసం 1, ఉత్తమ మార్కెట్ కోసం 2, బయ్యర్ ఆఫర్ల కోసం 3, ఆర్డర్ స్థితి కోసం 4, చెల్లింపు స్థితి కోసం 5, సమీప FPO అధికారిని సంప్రదించడానికి 6 నొక్కండి.';
    } else if (selectedLang === 'hi') {
      promptText =
        'किसानसेतु में आपका स्वागत है। फसल भाव के लिए 1, सर्वश्रेष्ठ मंडी के लिए 2, खरीदार ऑफर के लिए 3, ऑर्डर स्थिति के लिए 4, भुगतान स्थिति के लिए 5, नजदीकी FPO अधिकारी से बात करने के लिए 6 दबाएं।';
    } else {
      promptText =
        'Welcome to KisanSetu voice portal. Press 1 for Crop Price, 2 for Best Market, 3 for Buyer Offers, 4 for Order Status, 5 for Payment Status, 6 to connect with nearby FPO Officer.';
    }
  } else if (step === 'service_select') {
    const lang = language || 'en';
    if (digit === '1') {
      promptText =
        lang === 'te'
          ? 'ఈ రోజు మీ సమీప మార్కెట్ లో పత్తి ధర క్వింటాలుకు ₹7,400, వరి ధర ₹2,600, టొమాటో ధర ₹2,350.'
          : lang === 'hi'
          ? 'आज की नजदीकी मंडी में कपास का भाव ₹7,400, धान ₹2,600 और टमाटर ₹2,350 प्रति क्विंटल है।'
          : "Today's estimated cotton price in your nearest market is ₹7,400 per quintal, paddy is ₹2,600, and tomato is ₹2,350.";
      isComplete = true;
    } else if (digit === '2') {
      promptText =
        lang === 'te'
          ? 'మీ పత్తి పంటకు వరంగల్ ఎనుమాముల మార్కెట్ ఉత్తమమైనది. నికర ఆదాయం క్వింటాలుకు ₹7,100.'
          : lang === 'hi'
          ? 'आपके कपास के लिए वारंगल मंडी सबसे उपयुक्त है। शुद्ध मूल्य ₹7,100 प्रति क्विंटल है।'
          : 'Recommended Market for Cotton is Warangal. Expected net realized value after transport is ₹7,100 per quintal.';
      isComplete = true;
    } else if (digit === '3') {
      promptText =
        lang === 'te'
          ? 'మీ 50 క్వింటాళ్ల పత్తి లాట్ కోసం 3 మంది ధృవీకరించబడిన బయ్యర్లు ఉన్నారు. గరిష్ట ఆఫర్ ₹7,400 తెలంగాణ స్పిన్నింగ్ మిల్స్ నుండి వచ్చింది.'
          : lang === 'hi'
          ? 'आपके 50 क्विंटल कपास पर 3 सत्यापित खरीदारों के ऑफर हैं। उच्चतम ₹7,400 का ऑफर है।'
          : 'You have 3 active buyer offers on your Cotton lot. Highest offer is ₹7,400 from Telangana Mega Spinning Mills.';
      isComplete = true;
    } else {
      promptText =
        lang === 'te'
          ? 'మీ సమీప FPO అధికారి శ్రీ కృష్ణారావు (+91 98491 56789) కు కాల్ కనెక్ట్ చేయబడుతోంది.'
          : lang === 'hi'
          ? 'आपके नजदीकी FPO अधिकारी श्री कृष्ण राव (+91 98491 56789) से संपर्क जोड़ा जा रहा है।'
          : 'Connecting to your nearby FPO Officer Mr. Krishna Rao (+91 98491 56789).';
      isComplete = true;
    }
  }

  res.json({ nextStep, promptText, isComplete });
}
