export interface SymptomPhase {
  phase: string;
  days: string;
  badgeColor: string;
  summaryEn: string;
  summaryHi: string;
  symptoms: string[];
  careActions: string[];
  warningNote?: string;
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: 'symptoms' | 'prevention' | 'transmission' | 'treatment';
}

export interface EducationalArticle {
  id: string;
  titleEn: string;
  titleHi: string;
  readTime: string;
  category: string;
  summaryEn: string;
  summaryHi: string;
  contentEn: string;
  contentHi: string;
}

export const SYMPTOM_PHASES: SymptomPhase[] = [
  {
    phase: '1. Febrile Phase (Acute Onset)',
    days: 'Days 1 to 3',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    summaryEn: 'Sudden onset of debilitating high fever, severe frontal headache, retro-orbital eye pain, and generalized arthralgia/myalgia.',
    summaryHi: 'अचानक तेज बुखार, सिरदर्द, आंखों के पीछे दर्द और मांसपेशियों में गंभीर दर्द।',
    symptoms: [
      'High temperature (up to 40°C / 104°F)',
      'Intense retro-orbital pain when rolling eyes',
      'Severe backache and joint pain ("breakbone fever")',
      'Flushed face, nausea, mild skin erythema',
      'Mild petechial spots on skin'
    ],
    careActions: [
      'Strict bed rest and plenty of fluids (ORS, coconut water)',
      'Paracetamol ONLY for fever (no Aspirin or Brufen)',
      'Perform baseline Complete Blood Count (CBC) and NS1 antigen test'
    ]
  },
  {
    phase: '2. Critical Phase (The Danger Window)',
    days: 'Days 4 to 6',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    summaryEn: 'CRITICAL WARNING: As fever drops, vascular permeability peaks. Capillary leak can cause shock even though the patient feels their fever is "gone".',
    summaryHi: 'सावधान: बुखार उतरते समय ही प्लाज्मा लीकेज का सबसे ज्यादा खतरा होता है।',
    symptoms: [
      'Sudden drop in body temperature (defervescence)',
      'Persistent vomiting and severe abdominal pain',
      'Mucosal bleeding (gums, epistaxis/nosebleed)',
      'Rising hematocrit (hemoconcentration) with falling platelets',
      'Lethargy, clammy cold extremities, dizziness'
    ],
    careActions: [
      'Close 12-hour CBC monitoring for Hematocrit and Platelets',
      'Immediately seek hospital emergency triage if vomiting or bleeding begins',
      'Supervised intravenous (IV) fluid therapy if oral intake fails'
    ],
    warningNote: 'Most fatalities occur in this phase due to delayed recognition of plasma leakage.'
  },
  {
    phase: '3. Convalescent / Recovery Phase',
    days: 'Days 7 to 10+',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    summaryEn: 'Gradual reabsorption of extravasated fluids, hemodynamic stabilization, return of appetite, and recovery of platelet count.',
    summaryHi: 'स्वास्थ्य में सुधार, भूख लौटना, प्लेटलेट्स का सामान्य होना और शरीर की रिकवरी।',
    symptoms: [
      'Return of appetite and energy',
      'Convalescent rash ("islands of white in a sea of red")',
      'Mild generalized itching (pruritus)',
      'Gradual normalization of platelet counts'
    ],
    careActions: [
      'Continue balanced nutrition and hydration',
      'Avoid heavy physical exertion for 1–2 weeks',
      'Watch for fluid overload if excessive IV fluids were administered'
    ]
  }
];

export const FAQS_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'transmission',
    questionEn: 'Can dengue spread directly from person to person through touch or coughing?',
    questionHi: 'क्या डेंगू मरीज को छूने या खांसने से सीधे दूसरे व्यक्ति में फैल सकता है?',
    answerEn: 'No. Dengue is NOT contagious person-to-person. It requires an infected female Aedes mosquito bite to transmit the dengue virus (DENV-1, 2, 3, 4) from one human to another.',
    answerHi: 'नहीं। डेंगू छूने, हाथ मिलाने या खांसने से नहीं फैलता। यह केवल संक्रमित मादा एडीज मच्छर के काटने से ही एक व्यक्ति से दूसरे में पहुंचता है।'
  },
  {
    id: 'faq-2',
    category: 'symptoms',
    questionEn: 'Why do Aedes mosquitoes bite primarily during the day?',
    questionHi: 'एडीज मच्छर मुख्यतः दिन में ही क्यों काटते हैं?',
    answerEn: 'Aedes aegypti has evolved diurnal feeding behavior. Peak biting activity happens 2 hours after sunrise and 2 hours before sunset, although they can also bite in well-lit indoor spaces at night.',
    answerHi: 'एडीज एजिप्टी दिन में सक्रिय रहने वाला मच्छर है। यह सुबह सूर्योदय के 2 घंटे बाद और शाम को सूर्यास्त से 2 घंटे पहले सबसे ज्यादा काटता है।'
  },
  {
    id: 'faq-3',
    category: 'treatment',
    questionEn: 'Why are Aspirin and Brufen strictly forbidden in dengue?',
    questionHi: 'डेंगू में एस्पिरिन और ब्रूफेन जैसी दवाएं क्यों सख्त मना हैं?',
    answerEn: 'Dengue damages blood platelets. Aspirin, Ibuprofen, and other NSAIDs inhibit platelet function and irritate the stomach lining, which can trigger catastrophic internal hemorrhage (bleeding) and shock.',
    answerHi: 'डेंगू में खून की प्लेटलेट्स कम हो जाती हैं। एस्पिरिन और ब्रूफेन जैसी दवाएं खून को और पतला करती हैं, जिससे पेट में जानलेवा ब्लीडिंग हो सकती है।'
  },
  {
    id: 'faq-4',
    category: 'prevention',
    questionEn: 'How can mosquito larvae survive dry periods in containers?',
    questionHi: 'मच्छर के अंडे सूखे बर्तनों में कैसे जीवित रह जाते हैं?',
    answerEn: 'Aedes eggs possess a desiccation-resistant shell. They can stick to the dry walls of empty water tanks, coolers, and tires, remaining dormant for up to 9 to 12 months, and will hatch within hours once water touches them again! This is why scrubbing container walls is essential.',
    answerHi: 'एडीज मच्छर के अंडे बहुत सख्त होते हैं। वे बिना पानी के भी कूलर या बर्तनों की सूखी दीवारों पर 9 से 12 महीने तक चिपके रह सकते हैं और पानी मिलते ही तुरंत लार्वा बन जाते हैं। इसलिए कूलर को सुखाकर रगड़ना जरूरी है।'
  },
  {
    id: 'faq-5',
    category: 'treatment',
    questionEn: 'Does a platelet count drop automatically mean I need a platelet transfusion?',
    questionHi: 'क्या प्लेटलेट कम होने पर तुरंत प्लेटलेट चढ़वाने की जरूरत होती है?',
    answerEn: 'No. Medical protocols state that asymptomatic patients with low platelets generally do NOT require transfusions. Transfusions carry risks of fluid overload and allergic reactions. Doctors prioritize adequate hydration and reserve transfusions for active bleeding or extremely low counts (<10,000–20,000/μL).',
    answerHi: 'नहीं। जब तक मरीज को ब्लीडिंग न हो या प्लेटलेट अत्यंत गंभीर स्तर (10,000-20,000) से नीचे न गिरे, तब तक केवल संख्या देखकर प्लेटलेट नहीं चढ़ाई जाती। शरीर को हाइड्रेटेड रखना सबसे जरूरी होता है।'
  }
];

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art-1',
    titleEn: 'The Silent Critical Phase: Why Falling Fever Can Be the Deadliest Window',
    titleHi: 'शांत क्रिटिकल चरण: बुखार उतरते वक्त सबसे बड़ा खतरा क्यों होता है?',
    readTime: '4 min read',
    category: 'Clinical Awareness',
    summaryEn: 'Understand the physiology of plasma leakage and why defervescence requires maximum medical vigilance.',
    summaryHi: 'समझिए कि बुखार उतरने के बाद शरीर में क्या बदलाव आते हैं और इस दौरान कौन सी सावधानियां बरतनी चाहिए।',
    contentEn: `Many families mistakenly believe that when a dengue patient's high fever drops on Day 4 or 5, the danger is over. In reality, modern entomology and medicine demonstrate that the 24 to 48 hours immediately following fever reduction mark the onset of the **Critical Phase**.

During this critical window, cytokine cascades can cause microscopic pores in capillary walls to open, leading to **plasma leakage**. Clear blood fluid seeps out of blood vessels into surrounding tissues, abdominal cavity (ascites), and pleural spaces around the lungs. 

If this leakage is unmonitored:
1. Blood volume plummets, causing hypovolemic shock.
2. Blood thickens (Hematocrit climbs above 40-45%).
3. Platelets plummet simultaneously.

**Key Action:** Monitor blood pressure, urine output, and hematocrit every 12 to 24 hours during days 4 to 7. If extreme stomach pain or cold extremities occur, visit an emergency room without delay.`,
    contentHi: `कई लोग यह मानते हैं कि बुखार कम होते ही मरीज ठीक हो गया है, जबकि सच्चाई इसके बिल्कुल उलट है। बुखार के 4 से 6 दिनों के बाद शुरू होने वाला समय डेंगू का **क्रिटिकल चरण** कहलाता है।

इस समय रक्त वाहिकाओं से प्लाज्मा (रक्त का तरल भाग) रिसने लगता है। इससे पेट और फेफड़ों में पानी जमा हो सकता है और ब्लड प्रेशर खतरनाक रूप से गिर सकता है।

**सावधानी:** बुखार उतरने के 48 घंटे तक मरीज को पर्याप्त ओआरएस और नारियल पानी दें, पेशाब की मात्रा पर ध्यान दें और तुरंत सीबीसी जांच करवाएं।`
  },
  {
    id: 'art-2',
    titleEn: 'Urban Mosquito Hotspots: The Physics of Standing Water in Desert Coolers & Tyres',
    titleHi: 'शहरी इलाके और मच्छर: कूलर और टायरों में पानी जमा होने का विज्ञान',
    readTime: '3 min read',
    category: 'Community Vector Control',
    summaryEn: 'How artificial urban micro-reservoirs create the perfect habitat for Aedes aegypti replication.',
    summaryHi: 'जानिए कि घर की छतों, टायरों और कूलर में कैसे चंद दिनों में हजारों मच्छर पैदा हो जाते हैं।',
    contentEn: `Unlike malaria mosquitoes (Anopheles) which favor marshes and natural puddles, *Aedes aegypti* is uniquely adapted to human urban architecture. It thrives in clean, clear artificial standing water.

A single abandoned tyre or forgotten air-conditioner condensation tray holding just 50 mL of water can support the emergence of 200 mosquitoes every week. The female deposits eggs just above the water line. When rain or topping up raises the water level, larvae hatch within 15 minutes!

**The 10-Minute Weekly Checklist:**
1. Empty and scrub desert coolers with a brush every Sunday ("Dry Day").
2. Check refrigerator defrost trays and indoor plant saucers.
3. Keep overhead water storage tanks sealed with airtight lids.
4. Add 2 ml of kerosene or larvicide granules (Temephos) to drains or sumps that cannot be drained.`,
    contentHi: `डेंगू का मच्छर गंदे नालों में नहीं, बल्कि घरों के साफ और ठहरे हुए पानी में अंडे देता है। एक छोटे से ढक्कन या गमले की तश्तरी में जमा 50 मिली पानी भी सैकड़ों मच्छरों को जन्म देने के लिए काफी है।

**साप्ताहिक 10 मिनट का नियम:**
1. हर रविवार को "शुष्क दिवस" मनाएं - कूलर का पानी पूरी तरह खाली करें और पोंछकर सुखाएं।
2. फ्रिज के पीछे की ट्रे और एसी के पानी के पाइप की जांच करें।
3. पानी की टंकियों को हमेशा कसकर बंद रखें।`
  }
];
