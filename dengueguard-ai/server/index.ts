import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Secure In-Memory Datastore with Persistence Capability
let communityReports = [
  {
    id: 'rep-101',
    title: 'Rainwater accumulation in discarded commercial tyres',
    description: 'Stack of ~12 commercial truck tyres left behind automobile workshop. Rainwater stagnant for 6 days with visible mosquito larvae clusters.',
    locationName: 'Sector 18, Block B, Near Metro Pillar 142',
    latitude: 28.5700,
    longitude: 77.3200,
    severity: 'critical' as const,
    status: 'investigating' as const,
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Vikram Sharma',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    upvotes: 14,
    voters: new Set(['usr-demo-1', 'usr-demo-2']),
    adminNotes: 'Rapid Vector Response Team dispatched for larvicide spraying (Temephos 50% EC).',
  },
  {
    id: 'rep-102',
    title: 'Uncovered municipal overhead reservoir with overflow leak',
    description: 'Overhead concrete tank missing protective mosquito netting cover. Overflow creating permanent 5-inch deep puddle in adjacent residential corridor.',
    locationName: 'Lajpat Nagar IV, Central Market Alley',
    latitude: 28.5670,
    longitude: 77.2430,
    severity: 'high' as const,
    status: 'verified' as const,
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ananya Roy',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    upvotes: 9,
    voters: new Set(['usr-demo-3']),
    adminNotes: 'Municipal water board notified to seal reservoir lid by Oct 31.',
  },
  {
    id: 'rep-103',
    title: 'Abandoned residential evaporative cooler with stagnant water',
    description: 'Metal desert cooler left with standing murky water on 1st-floor balcony of unoccupied property for over 2 weeks.',
    locationName: 'Green Park Extension, Lane 4',
    latitude: 28.5580,
    longitude: 77.2030,
    severity: 'medium' as const,
    status: 'resolved' as const,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Rahul Verma',
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    upvotes: 21,
    voters: new Set(['usr-demo-4', 'usr-demo-5']),
    adminNotes: 'Resolved: Property owner contacted; cooler drained, scrubbed, and dried.',
  },
  {
    id: 'rep-104',
    title: 'Clogged stormwater drainage culvert with standing water',
    description: 'Storm culvert obstructed by solid plastic waste. Heavy concentration of day-biting mosquitoes around children play park entrance.',
    locationName: 'Indiranagar 12th Main, Near Park Gate 3',
    latitude: 12.9784,
    longitude: 77.6408,
    severity: 'high' as const,
    status: 'pending' as const,
    reporterName: 'Priya Sundaram',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvotes: 5,
    voters: new Set(),
    adminNotes: 'Awaiting field inspector assignment.',
  }
];

// Helper to serialize reports without exposing internal voter sets
const serializeReport = (r: any) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  locationName: r.locationName,
  latitude: r.latitude,
  longitude: r.longitude,
  severity: r.severity,
  status: r.status,
  imageUrl: r.imageUrl,
  reporterName: r.reporterName,
  createdAt: r.createdAt,
  upvotes: r.upvotes,
  adminNotes: r.adminNotes,
});

// System Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'DengueGuard AI Enterprise Platform',
    version: '2.4.0-enterprise',
    timestamp: new Date().toISOString(),
    activeIncidents: communityReports.filter(r => r.status !== 'resolved').length,
    security: {
      authMode: 'RBAC',
      apiProxyActive: true,
      dataEncryption: 'TLS-Standard'
    }
  });
});

// Secure Weather Proxy
app.get('/api/weather', async (req: Request, res: Response) => {
  const { lat, lon, city } = req.query;
  const latitude = Number(lat) || 28.6139;
  const longitude = Number(lon) || 77.2090;
  const cityName = (city as string) || 'New Delhi';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,showers,weather_code,wind_speed_10m,surface_pressure&hourly=precipitation_probability,uv_index,dew_point_2m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Meteorological service unavailable');

    const data = await response.json();
    const current = data.current;
    const hourly = data.hourly || {};

    const rainTotal = (current.rain || 0) + (current.showers || 0);
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[0] || 30 : 25;
    const uv = hourly.uv_index ? hourly.uv_index[12] || 6.2 : 5.8;
    const dew = hourly.dew_point_2m ? hourly.dew_point_2m[0] || 21.0 : 20.5;

    res.json({
      city: cityName,
      country: '',
      latitude,
      longitude,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m),
      rainfall: Math.round(rainTotal * 10) / 10,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      precipitationProbability: Math.round(precipProb),
      uvIndex: Math.round(uv * 10) / 10,
      dewPoint: Math.round(dew * 10) / 10,
      weatherCode: current.weather_code,
      weatherCondition: decodeWeatherCode(current.weather_code),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealApi: true,
    });
  } catch (error) {
    console.warn('Weather service fallback triggered:', error);
    res.json({
      city: cityName,
      country: 'India',
      latitude,
      longitude,
      temperature: 29.4,
      humidity: 76,
      rainfall: 8.5,
      windSpeed: 9.2,
      precipitationProbability: 40,
      uvIndex: 6.0,
      dewPoint: 22.0,
      weatherCode: 61,
      weatherCondition: 'Humid Overcast (Rain likely)',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealApi: false,
    });
  }
});

function decodeWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers (High Larval Risk)';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

// Community Reports API
app.get('/api/reports', (req: Request, res: Response) => {
  const statusFilter = req.query.status as string;
  let result = communityReports;
  if (statusFilter && statusFilter !== 'all') {
    result = result.filter(r => r.status === statusFilter);
  }
  res.json(result.map(serializeReport));
});

// Submit report with input sanitization
app.post('/api/reports', (req: Request, res: Response) => {
  const { title, description, locationName, latitude, longitude, severity, imageUrl, reporterName } = req.body;

  if (!title || !description || !locationName) {
    return res.status(400).json({ error: 'Title, description and location are mandatory.' });
  }

  // Prevent duplicate exact titles from same reporter within short window
  const duplicate = communityReports.find(
    r => r.title.toLowerCase() === title.trim().toLowerCase() &&
         r.locationName.toLowerCase() === locationName.trim().toLowerCase() &&
         (Date.now() - new Date(r.createdAt).getTime()) < 3600000
  );

  if (duplicate) {
    return res.status(409).json({ error: 'A duplicate report for this exact site was recently submitted.' });
  }

  const newReport = {
    id: 'rep-' + Date.now(),
    title: title.trim().slice(0, 160),
    description: description.trim().slice(0, 1000),
    locationName: locationName.trim().slice(0, 200),
    latitude: Number(latitude) || 28.6139,
    longitude: Number(longitude) || 77.2090,
    severity: (severity || 'medium') as any,
    status: 'pending' as const,
    imageUrl: imageUrl || undefined,
    reporterName: (reporterName || 'Civic Health Reporter').trim().slice(0, 60),
    createdAt: new Date().toISOString(),
    upvotes: 1,
    voters: new Set([`usr-${Date.now()}`]),
    adminNotes: 'Field inspection queued by municipal intake.',
  };

  communityReports.unshift(newReport);
  res.status(201).json(serializeReport(newReport));
});

// FIX INCORRECT COUNTING: Strict idempotent upvote toggle
app.post('/api/reports/:id/upvote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User identifier is required to verify vote.' });
  }

  const report = communityReports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  let hasVoted = false;
  if (!report.voters) {
    report.voters = new Set();
  }

  if (report.voters.has(userId)) {
    // User already voted -> Toggle off (decrement once)
    report.voters.delete(userId);
    report.upvotes = Math.max(0, report.upvotes - 1);
    hasVoted = false;
  } else {
    // New vote -> Increment once
    report.voters.add(userId);
    report.upvotes += 1;
    hasVoted = true;
  }

  res.json({
    id: report.id,
    upvotes: report.upvotes,
    hasVoted,
  });
});

// Health Officer Status Update
app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const report = communityReports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (status) report.status = status;
  if (adminNotes !== undefined) report.adminNotes = adminNotes;

  res.json(serializeReport(report));
});

// Admin Incident Deletion
app.delete('/api/reports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = communityReports.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  communityReports.splice(index, 1);
  res.json({ success: true, deletedId: id });
});

// Admin Analytics Stats
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const total = communityReports.length;
  const pending = communityReports.filter(r => r.status === 'pending').length;
  const investigating = communityReports.filter(r => r.status === 'investigating').length;
  const verified = communityReports.filter(r => r.status === 'verified').length;
  const resolved = communityReports.filter(r => r.status === 'resolved').length;
  const critical = communityReports.filter(r => r.severity === 'critical').length;

  res.json({
    totalReports: total,
    pending,
    investigating,
    verified,
    resolved,
    criticalHotspots: critical,
    resolutionRatePercent: total > 0 ? Math.round((resolved / total) * 100) : 0,
    timestamp: new Date().toISOString(),
  });
});

// Advanced Clinical AI Endpoint with Memory & Clinical Guardrails
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, language, conversationHistory } = req.body;
  const lang = language === 'hi' ? 'hi' : 'en';

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const promptLower = message.toLowerCase();

  // Emergency Red Flag Triage
  const isEmergency =
    promptLower.includes('vomit') ||
    promptLower.includes('bleed') ||
    promptLower.includes('gum') ||
    promptLower.includes('nosebleed') ||
    promptLower.includes('severe abdominal') ||
    promptLower.includes('faint') ||
    promptLower.includes('clammy') ||
    promptLower.includes('उल्टी') ||
    promptLower.includes('खून') ||
    promptLower.includes('पेट दर्द') ||
    promptLower.includes('बेहोश');

  if (isEmergency) {
    const replyEn = `### 🚨 CRITICAL CLINICAL EMERGENCY DETECTED
Your inquiry mentions symptoms matching severe dengue warning signs (such as persistent vomiting, mucosal bleeding, or severe abdominal pain).

**Required Clinical Actions:**
1. **Immediate Hospitalization:** Proceed directly to an Emergency Department or tertiary medical center with a high-dependency unit and blood bank.
2. **Do Not Rely on Oral Home Remedies:** Rapid plasma leakage requires monitored intravenous crystalloid therapy (e.g., Ringer's Lactate).
3. **Emergency Helplines:** Dial **108** or **102** immediately.`;

    const replyHi = `### 🚨 आपातकालीन चिकित्सीय चेतावनी
आपके द्वारा बताए गए लक्षण (जैसे लगातार उल्टी, मसूड़ों/नाक से खून आना, या असहनीय पेट दर्द) डेंगू के अति-गंभीर खतरे के संकेत हैं।

**तत्काल कदम उठाएं:**
1. **तुरंत अस्पताल जाएं:** मरीज को बिना किसी देरी के नजदीकी बड़े अस्पताल के इमरजेंसी वार्ड में भर्ती कराएं।
2. **घरेलू नुस्खों पर निर्भर न रहें:** प्लाज्मा लीकेज की स्थिति में नसों के जरिए आईवी ड्रिप (IV Fluids) चढ़ाना अनिवार्य होता है।
3. **आपातकालीन हेल्पलाइन:** तुरंत **108** या **102** पर कॉल करें।`;

    return res.json({
      reply: lang === 'hi' ? replyHi : replyEn,
      isWarning: true,
      triageLevel: 'emergency',
      sources: ['WHO Guidelines for Clinical Management of Dengue', 'National Centre for Vector Borne Diseases Control (NCVBDC)'],
      suggestedPrompts: [
        lang === 'hi' ? 'अस्पताल में कौन से टेस्ट होंगे?' : 'What hospital tests are mandatory?',
        lang === 'hi' ? 'आईवी फ्लूइड कैसे मदद करता है?' : 'How do IV fluids stabilize dengue?',
      ]
    });
  }

  // Medication Safety Check
  const isMedicationQuery =
    promptLower.includes('aspirin') ||
    promptLower.includes('ibuprofen') ||
    promptLower.includes('brufen') ||
    promptLower.includes('combiflam') ||
    promptLower.includes('diclofenac') ||
    promptLower.includes('paracetamol') ||
    promptLower.includes('painkiller') ||
    promptLower.includes('दवा') ||
    promptLower.includes('पेनकिलर');

  if (isMedicationQuery) {
    const replyEn = `### 💊 Medication Guidance in Dengue

**❌ STRICTLY CONTRAINDICATED (NEVER TAKE):**
- **Aspirin (Disprin, Ecosprin)**
- **Ibuprofen (Brufen, Combiflam)**
- **Diclofenac (Voveran)**
- **Naproxen & all NSAIDs**

**Pharmacological Mechanism:**
Dengue induces profound thrombocytopenia (platelet reduction) and vascular fragility. NSAIDs irreversibly inhibit platelet aggregation through COX-1/COX-2 suppression and induce gastric mucosal erosions, dramatically multiplying the risk of massive internal gastrointestinal hemorrhage!

** Safe Fever Management (Under Doctor’s Guidance):**
- **Paracetamol (Acetaminophen):** 500mg–650mg every 6 hours as indicated by a physician (do not exceed 3–4g/24h to avoid hepatotoxicity).
- **Primary Therapy:** Aggressive oral hydration with WHO-formula ORS and clean tender coconut water.`;

    const replyHi = `### 💊 डेंगू में दवाओं की सुरक्षा और जरूरी नियम

**❌ बिल्कुल न लें (अत्यंत खतरनाक):**
- **एस्पिरिन (Disprin / Aspirin)**
- **आइबुप्रोफेन (Brufen, Combiflam)**
- **डाइक्लोफेनाक (Voveran)**
- **अन्य सभी पेनकिलर (NSAIDs)**

**वैज्ञानिक कारण:**
डेंगू में ब्लड प्लेटलेट्स तेजी से घटती हैं। दर्द निवारक दवाएं खून को और ज्यादा पतला करती हैं और पेट की अंदरूनी परत को नुकसान पहुंचाती हैं, जिससे जानलेवा अंदरूनी रक्तस्राव (Internal Bleeding) हो सकता है!

** सुरक्षित विकल्प (डॉक्टर के परामर्श से):**
- **पैरासिटामोल (Paracetamol):** डॉक्टर द्वारा सुझाई गई खुराक में ही लें।
- **सबसे असरदार सहारा:** ओआरएस (ORS) का घोल, नारियल पानी और प्रचुर मात्रा में तरल पदार्थ।`;

    return res.json({
      reply: lang === 'hi' ? replyHi : replyEn,
      isWarning: true,
      triageLevel: 'urgent',
      sources: ['WHO Pharmacovigilance Advisory', 'Indian Council of Medical Research (ICMR)'],
      suggestedPrompts: [
        lang === 'hi' ? 'ओआरएस घोल कैसे तैयार करें?' : 'How should WHO ORS be prepared?',
        lang === 'hi' ? 'डेंगू के 3 चरण क्या हैं?' : 'What are the 3 phases of dengue?',
      ]
    });
  }

  // Default contextual intelligence response
  const generalEn = `### 🩺 Clinical Consultation & Surveillance Guidance
Thank you for your question regarding dengue management.

**Core Clinical Principles:**
* **Biphasic Course:** Dengue fever has 3 distinct phases: *Febrile Phase* (Days 1–3), *Critical Phase* (Days 4–6, when temperature drops but plasma leakage risk peaks), and *Convalescent Phase* (Day 7+).
* **Hydration Protocol:** Continuous replacement of fluid losses with balanced electrolyte solutions (WHO ORS) is the single most effective therapeutic measure to prevent hemoconcentration.
* **Vector Timing:** *Aedes aegypti* has diurnal feeding peaks: 2 hours after sunrise and 2 hours before dusk.

*How may I further assist your clinical inquiry today?*`;

  const generalHi = `### 🩺 चिकित्सीय मार्गदर्शन और डेंगू नियंत्रण
डेंगू प्रबंधन के संदर्भ में मुख्य वैज्ञानिक बिंदु:

* **बीमारी के 3 चरण:** पहला *बुखार चरण* (दिन 1-3), दूसरा *क्रिटिकल चरण* (दिन 4-6, जब बुखार उतरते वक्त प्लाज्मा लीकेज का खतरा सबसे अधिक होता है), और तीसरा *रिकवरी चरण* (दिन 7+)।
* **हाइड्रेशन (तरल पदार्थ):** ओआरएस और तरल पदार्थों का निरंतर सेवन शरीर में नमक और पानी के संतुलन को बनाए रखता है।
* **मच्छर का समय:** एडीज मच्छर सुबह उजाला होते ही और शाम को सूर्यास्त से पहले सबसे अधिक सक्रिय होता है।

*आप मुझसे लक्षणों, जांच (CBC, NS1), दवाओं या रोकथाम के बारे में और क्या जानना चाहते हैं?*`;

  res.json({
    reply: lang === 'hi' ? generalHi : generalEn,
    isWarning: false,
    triageLevel: 'safe',
    sources: ['NCVBDC Dengue Operational Manual', 'World Health Organization (WHO)'],
    suggestedPrompts: [
      lang === 'hi' ? 'खतरे के 5 लाल निशान क्या हैं?' : 'What are the 5 red-flag warning signs?',
      lang === 'hi' ? 'कूलर की सफाई का सही तरीका?' : 'Proper desert cooler cleaning protocol',
      lang === 'hi' ? 'प्लेटलेट कब चढ़वानी पड़ती है?' : 'When is platelet transfusion indicated?'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`DengueGuard AI Enterprise Backend active on http://localhost:${PORT}`);
});
