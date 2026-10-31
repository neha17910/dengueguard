import { ChatMessage, Language } from '../types';

export const MEDICAL_ADVISORY_EN =
  'Clinical Advisory: DengueGuard AI synthesizes WHO and national vector control protocols. It is intended for public health intelligence and triage guidance and does not replace in-person consultation with a certified medical doctor.';

export const MEDICAL_ADVISORY_HI =
  'चिकित्सीय परामर्श: डेंगूगार्ड एआई डब्ल्यूएचओ और राष्ट्रीय स्वास्थ्य मानकों पर आधारित मार्गदर्शन प्रदान करता है। यह किसी प्रमाणित चिकित्सक की व्यक्तिगत जांच और निदान का विकल्प नहीं है।';

interface KnowledgeItem {
  keywords: string[];
  responseEn: string;
  responseHi: string;
  sources: string[];
  isWarning?: boolean;
  triageLevel?: 'safe' | 'observation' | 'urgent' | 'emergency';
  suggestedPrompts?: string[];
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    keywords: ['symptom', 'sign', 'fever', 'headache', 'lakshan', 'bukhar', 'eye pain', 'dard'],
    responseEn: `### 🩺 Comprehensive Clinical Staging of Dengue Fever

Dengue infection manifests in **three distinct pathophysiological stages**:

#### 1. Febrile Phase (Days 1 to 3):
- **Temperature:** Sudden spike to 102°F–104°F (39°C–40°C), typically enduring 2 to 7 days.
- **Retro-Orbital Headache:** Intense sharp pain behind the eyes, exacerbated by ocular movement.
- **Severe Musculoskeletal Pain:** "Breakbone fever" due to intense lumbar, joint, and muscle pain.
- **Facial Flushing & Erythema:** Transient macular rash across chest and extremities.

#### 2. Critical Phase (Days 4 to 6) — *Maximum Danger Window*:
- **Defervescence:** Fever drops to 37.5°C–38°C. Patients often assume they are recovering, but **this is when capillary permeability and plasma leakage peak**.
- **Risks:** Severe hemoconcentration, rising Hematocrit (>20% increase), plummeting platelets (<50,000/μL), and potential Dengue Shock Syndrome (DSS).

#### 3. Convalescent / Recovery Phase (Days 7 to 10+):
- Plasma leakage arrests; extravasated fluid is gradually reabsorbed.
- Convalescent confluent petechial rash with characteristic "islands of white in a sea of red".

*Recommendation: If fever has persisted for >24 hours, perform a Complete Blood Count (CBC) and NS1 antigen test.*`,
    responseHi: `### 🩺 डेंगू के लक्षण एवं 3 मुख्य चिकित्सीय चरण

डेंगू का संक्रमण शरीर में **3 अलग-अलग चरणों** में आगे बढ़ता है:

#### 1. बुखार चरण (दिन 1 से 3):
- **अचानक तेज बुखार:** तापमान 104°F (40°C) तक पहुंच सकता है।
- **आंखों के पीछे असहनीय दर्द:** आंखों की पुतलियों को हिलाने पर गंभीर खिंचाव व दर्द।
- **हड्डी-तोड़ दर्द:** कमर, जोड़ों और मांसपेशियों में तेज दर्द ("Breakbone fever")।
- **त्वचा पर लाल चकत्ते:** चेहरे और छाती पर हल्के लाल दाने।

#### 2. गंभीर/क्रिटिकल चरण (दिन 4 से 6) — *सबसे संवेदनशील समय*:
- **बुखार उतरना:** शरीर का तापमान अचानक सामान्य होने लगता है। मरीज समझता है कि वह ठीक हो रहा है, लेकिन **वास्तव में इसी समय रक्त वाहिकाओं से प्लाज्मा लीकेज का सबसे बड़ा खतरा होता है**।
- **जोखिम:** प्लेटलेट्स में तीव्र गिरावट, हेमाटोक्रिट बढ़ना और शॉक में जाने की आशंका।

#### 3. रिकवरी चरण (दिन 7 के बाद):
- शरीर अतिरिक्त तरल पदार्थ को फिर से अवशोषित करता है और प्लेटलेट्स धीरे-धीरे सामान्य होने लगती हैं।

*सलाह: बुखार 24 घंटे से अधिक रहे तो तुरंत सीबीसी (CBC) और NS1 एंटीजन टेस्ट करवाएं।*`,
    sources: ['WHO Dengue Clinical Management Manual', 'NCVBDC National Guidelines'],
    triageLevel: 'observation',
    suggestedPrompts: [
      'What are the 5 emergency red flags?',
      'Why are Brufen and Disprin strictly forbidden?',
      'How to calculate daily ORS hydration?'
    ]
  },
  {
    keywords: ['warning', 'danger', 'emergency', 'critical', 'severe', 'hospital', 'khatra', 'gambhir', 'red flag', 'vomit', 'bleed'],
    isWarning: true,
    triageLevel: 'emergency',
    responseEn: `### 🚨 CRITICAL DENGUE WARNING SIGNS (Seek Immediate Emergency Care)

The onset of the **Critical Phase** coincides with the drop in body temperature. Immediate hospitalization is mandatory if ANY of the following warning signs are observed:

1. **Persistent Vomiting:** Inability to retain oral liquids; vomiting $\ge 3$ times within 24 hours.
2. **Severe, Continuous Abdominal Pain:** Intense abdominal tenderness, often signaling plasma leakage or hepatic congestion.
3. **Mucosal Hemorrhage:** Spontaneous bleeding from gums, epistaxis (nosebleeds), hematemesis (blood in vomit), or melena (black tarry stools).
4. **Clinical Fluid Accumulation:** Ascites (abdominal swelling) or pleural effusion causing rapid, labored breathing.
5. **Lethargy & Restlessness:** Sudden alteration in consciousness, profound fatigue, cold clammy extremities, or postural dizziness.
6. **Laboratory Markers:** Rapid decline in platelets simultaneous with a $\ge 20\%$ spike in Hematocrit.

⚠️ **Triage Action:** Call **108** or go immediately to an Emergency Hospital with ICU and blood transfusion capacity. Monitored intravenous isotonic crystalloid therapy (Ringer's Lactate) is essential.`,
    responseHi: `### 🚨 डेंगू के अति-गंभीर खतरे के संकेत (तुरंत अस्पताल जाएं)

डेंगू में बुखार उतरते समय ही खतरे के संकेत प्रकट होते हैं। यदि इनमें से कोई भी लक्षण दिखाई दे, तो तुरंत आपातकालीन चिकित्सा प्राप्त करें:

1. **लगातार उल्टियां:** मरीज पानी या दवा भी न पचा पा रहा हो; 24 घंटे में 3 या अधिक बार उल्टी।
2. **असहनीय पेट दर्द:** पेट में लगातार तेज दर्द या पेट छूने पर अत्यधिक पीड़ा।
3. **रक्तस्राव (Bleeding):** मसूड़ों या नाक से खून आना, उल्टी में खून दिखना या काला मल आना।
4. **सांस लेने में कठिनाई:** फेफड़ों या पेट में पानी (प्लाज्मा) भरने के कारण सांस फूलना।
5. **अत्यधिक बेचैनी या सुस्ती:** हाथ-पैर ठंडे और चिपचिपे पड़ना, खड़े होने पर चक्कर आना।
6. **लैब रिपोर्ट में बदलाव:** प्लेटलेट तेजी से घटना और हेमाटोक्रिट का 20% से अधिक बढ़ना।

⚠️ **तुरंत कदम उठाएं:** 108 नंबर पर एम्बुलेंस बुलाएं और मरीज को आईसीयू सुविधा वाले अस्पताल ले जाएं।`,
    sources: ['CDC Dengue Clinical Management Protocols', 'WHO Severe Dengue Triage Guidelines'],
    suggestedPrompts: [
      'Call Emergency Ambulance: 108',
      'What IV fluids are given in hospital?',
      'Check Platelet & Hematocrit Risk Calculator'
    ]
  },
  {
    keywords: ['medicine', 'medication', 'aspirin', 'paracetamol', 'ibuprofen', 'brufen', 'combiflam', 'dawa', 'crocin', 'painkiller', 'diclofenac'],
    isWarning: true,
    triageLevel: 'urgent',
    responseEn: `### 💊 Medication Guidelines: Critical Safety Rules

#### ❌ ABSOLUTELY CONTRAINDICATED (NEVER ADMINISTER):
- **Aspirin (Acetylsalicylic Acid / Disprin / Ecosprin)**
- **Ibuprofen (Brufen / Combiflam / Advil)**
- **Diclofenac (Voveran)**
- **Naproxen, Mefenamic Acid & all other NSAIDs**

**Why?**
Dengue impairs bone marrow megakaryocytes, drastically lowering platelet counts. NSAIDs irreversibly inhibit platelet aggregation through cyclooxygenase (COX-1/COX-2) inhibition and compromise the protective gastric mucosal barrier. In a patient with low platelets, taking an NSAID can provoke catastrophic internal gastrointestinal hemorrhage and hypovolemic shock.

####  SAFE ANTIPYRETIC (Under Medical Direction):
- **Paracetamol (Acetaminophen / Crocin / Calpol):**
  - **Adult dose:** 500mg–650mg every 6 hours as prescribed by a physician.
  - **Maximum limit:** Never exceed 3g–4g within 24 hours to prevent acute liver injury.
  - **Cold sponging:** Use lukewarm water on forehead and extremities if fever spikes.

#### 💧 Life-Saving Supportive Measure:
- **Oral Rehydration Therapy:** WHO-formula ORS, tender coconut water, diluted fruit juices, and vegetable broths. Fluid replacement is the definitive clinical intervention.`,
    responseHi: `### 💊 डेंगू में दवाओं की सुरक्षा: क्या लें और क्या कतई न लें

#### ❌ पूर्णतः वर्जित (बिल्कुल न लें):
- **एस्पिरिन (Disprin / Aspirin)**
- **आइबुप्रोफेन (Brufen / Combiflam)**
- **डाइक्लोफेनाक (Voveran)**
- **अन्य सभी पेनकिलर (NSAIDs)**

**वैज्ञानिक कारण:**
डेंगू में खून की प्लेटलेट्स तेजी से घटती हैं। दर्द निवारक दवाएं प्लेटलेट्स को जमने से रोकती हैं और पेट की अंदरूनी परत को नुकसान पहुंचाती हैं, जिससे जानलेवा अंदरूनी रक्तस्राव (Internal Bleeding) हो सकता है!

####  सुरक्षित विकल्प (डॉक्टर की सलाह से):
- **पैरासिटामोल (Crocin / Paracetamol):**
  - डॉक्टर द्वारा सुझाई गई खुराक में ही लें।
  - 24 घंटे में अत्यधिक मात्रा न लें ताकि लिवर सुरक्षित रहे।
  - माथे पर ताजे पानी की पट्टियां रखें।

#### 💧 सबसे जरूरी उपाय:
- **ओआरएस (ORS) और नारियल पानी:** शरीर में पानी और नमक की कमी न होने दें।`,
    sources: ['WHO Pharmacovigilance Advisory', 'Indian Academy of Pediatrics Clinical Protocols'],
    suggestedPrompts: [
      'How to prepare WHO ORS properly?',
      'What platelet level requires hospital admission?',
      'Check Hydration Calculator'
    ]
  },
  {
    keywords: ['prevention', 'prevent', 'mosquito', 'bite', 'water', 'cooler', 'roktham', 'machhar', 'safai', 'repellent'],
    responseEn: `### 🛡️ Environmental Vector Control & Personal Prophylaxis

The primary vector, *Aedes aegypti*, is an urbanized mosquito that breeds in **clean, artificial standing freshwater containers** and bites predominantly during daytime.

#### 1. Source Reduction (The "Sunday Dry Day" Protocol):
- **Desert Coolers:** Empty, scrub container walls with a brush (to dislodge desiccation-resistant eggs), and allow to dry completely once weekly.
- **Potted Plants:** Drain saucers under flower pots and replace water in ornamental indoor plants (e.g., money plants) every 5 days.
- **Overhead & Ground Storage Tanks:** Secure tanks with tight-fitting lids and mosquito-proof mesh covering vent pipes.
- **Solid Waste:** Dispose of discarded tyres, plastic bottles, coconut shells, and tin containers from terraces and balconies.

#### 2. Personal Bite Prevention:
- **Diurnal Biting Window:** Peak biting occurs 2 hours after sunrise and 2 hours prior to sunset.
- **Topical Repellents:** Formulations containing DEET (20%–30%), Picaridin (20%), or Oil of Lemon Eucalyptus (OLE).
- **Physical Barriers:** Light-colored, long-sleeved apparel and fine mesh (18×18 mesh per square inch) on residential doors and windows.`,
    responseHi: `### 🛡️ मच्छर नियंत्रण एवं व्यक्तिगत बचाव गाइड

डेंगू का वाहक मच्छर (*एडीज एजिप्टी*) साफ ठहरे हुए पानी में पनपता है और मुख्यतः दिन में काटता है।

#### 1. पनपने के स्थान नष्ट करें (साप्ताहिक शुष्क दिवस):
- **कूलर की सफाई:** सप्ताह में एक बार कूलर का पानी खाली करें, दीवार रगड़कर सुखाएं।
- **गमलों की ट्रे:** गमलों के नीचे रखी तश्तरियों का पानी नियमित रूप से फेंकें।
- **पानी की टंकियां:** टंकियों और मटकों को हमेशा ढक्कन या बारीक जाली से कसकर ढकें।
- **छत की सफाई:** पुराने टायर, प्लास्टिक के डिब्बे और खुले बर्तन हटा दें।

#### 2. व्यक्तिगत सुरक्षा:
- **काटने का समय:** एडीज मच्छर मुख्य रूप से सुबह उजाला होते ही और शाम को सूर्यास्त से 2 घंटे पहले काटता है।
- **कपड़े:** हल्के रंग के, पूरी आस्तीन वाले कपड़े पहनें।
- **मच्छर भगाने वाली क्रीम:** डीईईटी (DEET) या पिकारिडिन युक्त लोशन लगाएं।`,
    sources: ['NCVBDC Vector Control Manual', 'CDC Mosquito Bite Prevention Guidelines'],
    triageLevel: 'safe',
    suggestedPrompts: [
      'How long can mosquito eggs survive dry?',
      'What is the breeding simulator?',
      'How to report a stagnant water hazard'
    ]
  },
  {
    keywords: ['test', 'testing', 'ns1', 'elisa', 'cbc', 'platelet', 'blood', 'janch', 'hematocrit', 'hct'],
    responseEn: `### 🧪 Diagnostic Testing Protocols for Dengue

Timely diagnostic evaluation guides critical monitoring:

1. **Complete Blood Count (CBC) with Hematocrit (PCV):**
   - **Platelet Count:** Monitored every 12 to 24 hours during critical phase (normal: 150,000–450,000/μL).
   - **Hematocrit (HCT):** An increase $\ge 20\%$ above baseline indicates hemoconcentration and active plasma leakage into tissues.

2. **NS1 Antigen ELISA:**
   - Optimal diagnostic window: **Days 1 to 5** of fever. Confirms viral presence during acute viremia.

3. **Dengue IgM / IgG Antibody ELISA:**
   - Detectable from **Day 5 onwards**. Positive IgM confirms acute primary infection; high IgG suggests secondary dengue infection with higher risk of severe disease.

4. **RT-PCR:**
   - Identifies viral serotypes (DEN-1, DEN-2, DEN-3, DEN-4) within the first 5 days.

*Note: Platelet count alone does NOT determine disease severity; Hematocrit and hemodynamic stability (blood pressure, pulse, urine volume) are equally vital.*`,
    responseHi: `### 🧪 डेंगू की नैदानिक जांच और मेडिकल टेस्ट

समय पर जांच से स्थिति बिगड़ने से पहले संभाली जा सकती है:

1. **सीबीसी टेस्ट (Complete Blood Count):**
   - **प्लेटलेट काउंट:** क्रिटिकल चरण में हर 12 से 24 घंटे में मॉनिटर करें।
   - **हेमाटोक्रिट (HCT/PCV):** यदि हेमाटोक्रिट 20% से अधिक बढ़ रहा हो, तो यह शरीर से प्लाज्मा लीक होने का गंभीर संकेत है।

2. **NS1 एंटीजन टेस्ट:**
   - बुखार के **पहले 1 से 5 दिनों** के भीतर कराया जाता है। यह वायरस की मौजूदगी की शुरुआती पुष्टि करता है।

3. **डेंगू IgM / IgG एंटीबॉडी टेस्ट:**
   - बुखार के **5वें दिन के बाद** किया जाता है। IgM पॉजिटिव होना हालिया संक्रमण को दर्शाता है।

*महत्वपूर्ण: केवल प्लेटलेट की संख्या देखकर घबराएं नहीं; ब्लड प्रेशर, पेशाब की मात्रा और हेमाटोक्रिट भी उतने ही महत्वपूर्ण हैं।*`,
    sources: ['WHO Dengue Laboratory Diagnosis Guide', 'ICMR Guidelines for Vector Borne Diseases'],
    triageLevel: 'observation',
    suggestedPrompts: [
      'Evaluate My Platelet and Hematocrit Values',
      'What are the 3 phases of dengue?',
      'What foods increase platelets naturally?'
    ]
  }
];

export const generateChatResponse = async (
  userMessage: string,
  preferredLanguage: Language,
  conversationHistory: ChatMessage[] = []
): Promise<ChatMessage> => {
  const normalized = userMessage.toLowerCase().trim();

  // Try backend endpoint first
  try {
    const backendRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        language: preferredLanguage,
        conversationHistory: conversationHistory.slice(-4),
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.reply) {
        return {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.reply,
          language: preferredLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || ['DengueGuard Clinical Intelligence Engine', 'WHO & NCVBDC Standards'],
          isWarning: data.isWarning || false,
          triageLevel: data.triageLevel || 'safe',
          suggestedPrompts: data.suggestedPrompts,
        };
      }
    }
  } catch (err) {
    // Offline resilience: fallback to rich local medical knowledge base
  }

  // Detect language if user typed in Devanagari
  const isHindiScript = /[\u0900-\u097F]/.test(userMessage);
  const lang: Language = isHindiScript ? 'hi' : preferredLanguage;

  let bestMatch: KnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    const replyText = lang === 'hi' ? bestMatch.responseHi : bestMatch.responseEn;
    return {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: replyText,
      language: lang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: bestMatch.sources,
      isWarning: bestMatch.isWarning,
      triageLevel: bestMatch.triageLevel,
      suggestedPrompts: bestMatch.suggestedPrompts,
    };
  }

  // Default contextual response
  const fallbackEn = `### 🩺 DengueGuard Clinical Information Engine
Thank you for your inquiry. Key clinical takeaways regarding dengue management:

* **Disease Progression:** Dengue has 3 phases (Febrile, Critical, and Recovery). The 48 hours as the fever drops represent the highest clinical risk window.
* **Medication Safety:** **Never administer Aspirin or Ibuprofen (NSAIDs)** as they irreversibly promote life-threatening internal bleeding. Use paracetamol strictly within prescribed bounds.
* **Hydration:** Continuous oral electrolyte replacement (WHO ORS, tender coconut water) is the primary therapy against hemoconcentration.
* **Vector Control:** Empty, brush, and dry all domestic stagnant water reservoirs at least once weekly.

*You may ask about symptom triage, fluid calculations, medication safety, or diagnostic tests.*`;

  const fallbackHi = `### 🩺 डेंगूगार्ड चिकित्सीय परामर्श इंजन
आपके प्रश्न के लिए धन्यवाद। डेंगू प्रबंधन के प्रमुख वैज्ञानिक बिंदु:

* **बीमारी के चरण:** डेंगू 3 चरणों में होता है। बुखार उतरते समय के 48 घंटे सबसे नाजुक होते हैं जब प्लाज्मा लीकेज का खतरा रहता है।
* **दवाइयों से परहेज:** डेंगू में **एस्पिरिन या आइबुप्रोफेन (पेनकिलर) कतई न लें**, इनसे जानलेवा अंदरूनी ब्लीडिंग हो सकती है। केवल डॉक्टर की सलाह से पैरासिटामोल लें।
* **हाइड्रेशन:** ओआरएस (ORS) और नारियल पानी से शरीर को लगातार हाइड्रेट रखें।
* **मच्छर नियंत्रण:** सप्ताह में एक बार कूलर और गमलों में जमा साफ पानी पूरी तरह खाली करें और सुखाएं।

*आप मुझसे लक्षणों, ओआरएस की मात्रा, दवाओं की सुरक्षा या खून की जांच के बारे में पूछ सकते हैं।*`;

  return {
    id: 'bot-' + Date.now(),
    sender: 'bot',
    text: lang === 'hi' ? fallbackHi : fallbackEn,
    language: lang,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: ['WHO Dengue Guidelines', 'NCVBDC Technical Specifications'],
    triageLevel: 'safe',
    suggestedPrompts: [
      lang === 'hi' ? 'डेंगू के लक्षण क्या हैं?' : 'What are the 3 phases of dengue fever?',
      lang === 'hi' ? 'कौन सी दवाएं खतरनाक हैं?' : 'Why are NSAIDs dangerous in dengue?',
      lang === 'hi' ? 'ओआरएस घोल की गणना कैसे करें?' : 'Calculate my daily fluid requirement'
    ]
  };
};
