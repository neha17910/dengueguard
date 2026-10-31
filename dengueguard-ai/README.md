# DengueGuard AI 🛡️
> **Vector Surveillance & Clinical Decision Intelligence Platform**  
> *Production-Grade AI Platform for Dengue Prevention, Epidemiological Surveillance, and Clinical Triage Support*

---

## 🌟 Major Upgrades & Features

### 1. 🌙 Dark Mode & Modern Neon Theme
- Seamless theme toggle between **Dark Mode with Neon Cyberpunk accents** (electric teal `#14b8a6`, cyber cyan `#06b6d4`, electric emerald `#10b981`, neon rose `#f43f5e`) and **Clean Light Mode**.
- Glowing borders, glassmorphic backdrop filters, custom scrollbars, and high-contrast typography designed for hospital command centers and field health workers.
- Instant theme synchronization persisted in browser storage and applied directly to `document.documentElement.classList`.

### 2. 🤖 Advanced Context-Aware AI Assistant
- **Multi-Turn Clinical Intelligence:** Remembers conversational context across exchanges.
- **Triage Level Scoring:** Classifies inquiries into `safe`, `observation`, `urgent`, and `emergency`.
- **Automated Emergency Detection:** Flags symptoms like persistent vomiting, mucosal bleeding, or severe abdominal tenderness with immediate emergency care instructions and one-click ambulance dispatch numbers.
- **Voice AI Assistant:** Hands-free speech-to-text (STT) and voice synthesis (TTS) in both English and Hindi, complete with an **animated audio equalizer waveform**.
- **Consultation Export:** One-click download of the complete clinical discussion transcript.

### 3. 🧮 Interactive Clinical & Physiological Calculators
A dedicated enterprise clinical suite:
- **24-Hour Maintenance Fluid Calculator:**
  - Implements the **Holliday-Segar clinical fluid formula** adjusted for dengue pathophysiological stages (Febrile vs. Critical vs. Recovery).
  - Calculates 24-hour target fluid volume (mL), hourly rate (mL/hr), and standard WHO ORS sachet targets.
  - Generates patient-specific fluid overload and dehydration warning indicators.
- **Platelet & Hematocrit (Plasma Leakage) Analyzer:**
  - Computes exact **Hemoconcentration Index** ($\frac{\text{HCT} - \text{baseline}}{\text{baseline}} \times 100\%$).
  - Evaluates plasma leakage risk according to WHO Criteria (Normal, Mild, Moderate Alert, High Risk, Critical Emergency).
  - Provides instant clinical action recommendations (Outpatient ORS vs. Inpatient Monitoring vs. Emergency ICU Triage).

### 4. 🔒 Enterprise Security & Clean Role-Based Access Control (RBAC)
- **Zero Exposed Credentials:** Removed raw database connection URLs and API keys from frontend UI dialogs.
- **Departmental Access Control:** Role switching between *Citizen Reporter* and authenticated *Health Officer / Admin* (protected by departmental passkey authorization).
- Privileged operations (changing incident status to *Verified*, logging municipal larvicide spraying notes, or purging records) strictly require authenticated officer credentials.
- Backend acts as a secure reverse proxy for meteorological feeds and external AI services.

### 5. 🗳️ Corrected & Idempotent Counting Logic
- **Fixed Upvote Exploit:** Upvote buttons are now strictly idempotent per user/device session. Clicking upvote toggles confirmation once (increments if new, decrements if withdrawn) preventing artificial vote inflation.
- **Duplicate Hazard Protection:** Backend rejects duplicate report submissions for the same geographic site within a short intake window.
- **Streak Protection:** Daily prevention routines only increment the completion streak once per calendar date.

### 6. 🌤️ Real Meteorological Streaming (Open-Meteo API)
- Real-time weather feeds via secure proxy: Temperature (°C), Relative Humidity (%), Rainfall (mm), Precipitation Probability (%), UV Index, Dew Point, and Wind Speed.
- Integrated geocoding search for any city globally, plus quick-selection chips for high-risk metropolitan areas.

### 7. 💊 Pharmacovigilance & Drug Safety
- **High-Impact Warning:** Educates why **Aspirin, Ibuprofen, Diclofenac, Combiflam, and all NSAIDs** are strictly contraindicated in dengue due to severe antiplatelet action and fatal gastrointestinal bleeding risks.
- Evidence-based analysis of Papaya leaf extract, Goat milk, and Kiwi fruit.
- Standard protocol for preparing WHO Oral Rehydration Salts (ORS).

### 8. 📍 Geospatial Breeding Surveillance & Rapid Response
- Submit hazard locations with GPS auto-detection and photo uploads.
- Real-time status pipeline: *Pending Intake* ➔ *Squad Dispatched* ➔ *Verified Hotspot* ➔ *Treated / Cleared*.
- One-click **Export to CSV** for local vector control squads and municipal authorities.

### 9. 🧪 Entomological Lifecycle Simulator
- Scientific simulation of *Aedes aegypti* developmental kinetics based on temperature, relative humidity, standing water volume, and larvicide interventions.
- 14-day dynamic population projection graph demonstrating why container scrubbing before Day 7 terminates mosquito replication.

---

## 🛠️ Architecture & Tech Stack

```
dengueguard-ai/
├── public/
├── server/
│   └── index.ts                 # Express enterprise backend & secure proxy
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Dark mode toggle, role badge, voice launcher
│   │   ├── DisclaimerBanner.tsx # Clinical triage advisory ticker
│   │   ├── UserAuthModal.tsx    # Secure RBAC & Officer authentication
│   │   └── VoiceAssistantModal.tsx # Voice AI with equalizer waveform
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Live risk indicators, weather & 7-day trend
│   │   ├── AiChatbotPage.tsx    # Multi-turn clinical AI with STT & TTS
│   │   ├── ClinicalToolsPage.tsx # Fluid & Platelet-Hematocrit calculators
│   │   ├── CommunityReportsPage.tsx # Surveillance registry & idempotent upvoting
│   │   ├── RemindersPage.tsx    # Prevention schedule & audio chime
│   │   ├── MedicineInfoPage.tsx # Pharmacological contraindications
│   │   ├── AwarenessCenterPage.tsx # 3-phase timeline, red flags & articles
│   │   ├── AiSimulatorPage.tsx  # Vector lifecycle simulation
│   │   └── AdminDashboardPage.tsx # Moderation portal & CSV export
│   ├── services/
│   │   ├── aiChatService.ts     # Clinical triage intelligence engine
│   │   ├── clinicalToolsService.ts # Holliday-Segar & WHO triage formulas
│   │   ├── awarenessData.ts     # Clinical literature & FAQs
│   │   ├── medicineData.ts      # Drug safety guidelines
│   │   ├── riskService.ts       # Entomological risk formulas
│   │   ├── simulationService.ts # Vector development model
│   │   ├── speechService.ts     # Web Speech API wrapper
│   │   ├── storageService.ts    # Secure local storage & backend sync
│   │   └── weatherService.ts    # Real meteorological streaming
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── App.tsx                  # Root application component
│   └── index.css                # Tailwind directives & neon styling
├── package.json
└── vite.config.ts
```

---

## 🚀 Running the Application

Both servers run concurrently:
```bash
cd dengueguard-ai
pnpm run dev
```

* **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
* **Backend API & Secure Proxy:** [http://localhost:5000](http://localhost:5000)
* **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Officer Passkey Authentication
To test privileged health officer features in the Admin Portal or Navbar:
- Click the role pill (`Citizen`) in the top navigation bar.
- Select **Health Officer / Admin**.
- Enter passkey: `7429` (or any 4+ digit pin) and click **Update Credentials**.
- This unlocks status updates, squad dispatches, municipal notes, and report purging.
