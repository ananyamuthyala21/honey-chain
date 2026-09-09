import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import legacyPhraseTranslations from "./legacyPhraseTranslations.js";

export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

const translations = {
  en: {
    dashboard: "Dashboard",
    beekeepers: "Beekeepers",
    hives: "Hives",
    iot: "IoT Monitoring",
    iotMonitoring: "IoT Monitoring",
    aiHealth: "AI Health",
    aiProductivity: "AI Productivity",
    honeyQuality: "Honey Quality",
    traceability: "Traceability",
    platform: "Platform",
    systemStatus: "System Status",
    online: "Online",
    offline: "Offline",
    operational: "All services operational",
    unavailable: "Backend connection unavailable",
    language: "Language",
    selectLanguage: "Select language",
    truthTagline: "Truth behind every drop",
    trustEngine: "AI Trust Engine",
    attention: "What needs attention right now?",
    evidenceSubtitle:
      "Explainable evidence signals from hive health, telemetry, provenance and QR behavior.",
    avgTrust: "Avg trust",
    anomalies: "Anomalies",
    swarmRisk: "Swarm risk",
    qrAlerts: "QR alerts",
    noAlerts:
      "No high-priority evidence alerts are active. Continue routine monitoring.",
    anomaly: "Anomaly",
    swarm: "Swarm",
    counterfeit: "Counterfeit risk",
    hive: "Hive",
    batch: "Batch",
    honeyVerified: "Honey Verified",
    consumerVerification: "HIVETRUST Consumer Verification",
    evidenceBacked: "Evidence-backed batch verification",
    honeyTrust: "HIVETRUST Honey Trust",
    trustScore: "Trust Score",
    evidenceInReview: "Evidence in review",
    trustDisclaimer:
      "This score reflects available evidence and risk signals. It does not scientifically prove purity.",
    possibleCounterfeit: "Possible counterfeit activity detected",
    additionalVerification:
      "Additional verification is recommended. This is not an automatic declaration that the product is fake.",
    registeredBeekeeper: "Registered Beekeeper",
    sourceHive: "Source Hive",
    verifiedHoneyBatch: "Verified Honey Batch",
    quantity: "Quantity",
    harvestDate: "Harvest Date",
    processing: "Processing",
    packaging: "Packaging",
    storageLocation: "Storage Location",
    verificationFailed: "Verification Failed",
    retry: "Try Again",
    noToken: "No QR verification token was provided.",
    unableVerify: "Unable to verify this QR code.",
    verifying: "Verifying honey batch...",
    checkingRecords: "Checking beekeeper, hive and traceability records",
    notAvailable: "Not available",
    verified: "Verified",
    estimated: "AI Estimated",
    laboratoryVerified: "Laboratory Verified",
    recordIntegrity: "Tamper-evident record integrity",
    floralSource: "Floral Source",
    evidence: "Evidence",
    honeyJourney: "Honey Journey",
    welcomeToTrust: "Welcome to honey trust",
    fromHiveToTrust: "From healthy hives to trusted honey.",
    loginSubtitle:
      "Monitor every hive, understand every signal, and give every jar a story consumers can verify.",
    aiInsights: "AI Insights",
    qrTrust: "QR Trust",
    secureAccess: "Secure access",
    welcomeBack: "Welcome back",
    chooseRole: "Choose how you want to enter HIVETRUST.",
    beekeeper: "Beekeeper",
    customer: "Customer",
    beekeeperId: "Beekeeper ID",
    mobileOrEmail: "Mobile number or email",
    password: "Password",
    enterDashboard: "Enter dashboard",
    verifyProduct: "Verify a product",
    loginPrivacy:
      "Your role and session are stored locally for this demo. Production authentication should be connected before launch.",
    customerPortal: "Customer portal",
    customerPortalSubtitle:
      "Enter the token from a HIVETRUST QR label to view its evidence-backed honey journey.",
    qrTokenLabel: "QR token",
    logout: "Log out",
    tip: "Tip:",
    customerTip:
      "You can also open a QR verification link directly from your phone camera.",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    beekeepers: "తేనెటీగల పెంపకదారులు",
    hives: "తేనెటీగ గూళ్లు",
    iot: "IoT పర్యవేక్షణ",
    iotMonitoring: "IoT పర్యవేక్షణ",
    aiHealth: "AI ఆరోగ్యం",
    aiProductivity: "AI ఉత్పాదకత",
    honeyQuality: "తేనె నాణ్యత",
    traceability: "ట్రేసబిలిటీ",
    platform: "ప్లాట్‌ఫారమ్",
    systemStatus: "సిస్టమ్ స్థితి",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    operational: "అన్ని సేవలు పనిచేస్తున్నాయి",
    unavailable: "బ్యాక్‌ఎండ్ కనెక్షన్ అందుబాటులో లేదు",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    truthTagline: "ప్రతి చుక్క వెనుక నిజం",
    trustEngine: "AI నమ్మక ఇంజిన్",
    attention: "ప్రస్తుతం ఏ విషయాలకు శ్రద్ధ అవసరం?",
    evidenceSubtitle:
      "గూడు ఆరోగ్యం, సెన్సార్ డేటా, మూల రికార్డులు మరియు QR ప్రవర్తన ఆధారంగా వివరించగల సంకేతాలు.",
    avgTrust: "సగటు నమ్మకం",
    anomalies: "అసాధారణతలు",
    swarmRisk: "గూడు విడిపోయే ప్రమాదం",
    qrAlerts: "QR హెచ్చరికలు",
    noAlerts:
      "అధిక ప్రాధాన్యత గల హెచ్చరికలు లేవు. సాధారణ పర్యవేక్షణ కొనసాగించండి.",
    anomaly: "అసాధారణత",
    swarm: "గూడు విడిపోవడం",
    counterfeit: "నకిలీ ప్రమాదం",
    hive: "గూడు",
    batch: "బ్యాచ్",
    honeyVerified: "తేనె ధృవీకరించబడింది",
    consumerVerification: "మధుసత్య వినియోగదారు ధృవీకరణ",
    evidenceBacked: "ఆధారాలతో కూడిన బ్యాచ్ ధృవీకరణ",
    honeyTrust: "మధుసత్య తేనె నమ్మకం",
    trustScore: "నమ్మక స్కోర్",
    evidenceInReview: "ఆధారాల పరిశీలనలో ఉంది",
    trustDisclaimer:
      "ఈ స్కోర్ అందుబాటులో ఉన్న ఆధారాలు మరియు ప్రమాద సంకేతాలను సూచిస్తుంది. ఇది స్వచ్ఛతకు శాస్త్రీయ రుజువు కాదు.",
    possibleCounterfeit: "సంభావ్య నకిలీ కార్యకలాపం గుర్తించబడింది",
    additionalVerification:
      "అదనపు ధృవీకరణ సిఫార్సు చేయబడింది. ఇది ఉత్పత్తి నకిలీ అని స్వయంచాలక ప్రకటన కాదు.",
    registeredBeekeeper: "నమోదైన పెంపకదారు",
    sourceHive: "మూల గూడు",
    verifiedHoneyBatch: "ధృవీకరించిన తేనె బ్యాచ్",
    quantity: "పరిమాణం",
    harvestDate: "పంట తేదీ",
    processing: "ప్రాసెసింగ్",
    packaging: "ప్యాకేజింగ్",
    storageLocation: "నిల్వ స్థలం",
    verificationFailed: "ధృవీకరణ విఫలమైంది",
    retry: "మళ్లీ ప్రయత్నించండి",
    noToken: "QR ధృవీకరణ టోకెన్ అందించలేదు.",
    unableVerify: "ఈ QR కోడ్‌ను ధృవీకరించలేకపోయాము.",
    verifying: "తేనె బ్యాచ్‌ను ధృవీకరిస్తోంది...",
    checkingRecords:
      "పెంపకదారు, గూడు మరియు ట్రేసబిలిటీ రికార్డులను తనిఖీ చేస్తోంది",
    notAvailable: "అందుబాటులో లేదు",
    verified: "ధృవీకరించబడింది",
    estimated: "AI అంచనా",
    laboratoryVerified: "ప్రయోగశాల ధృవీకరణ",
    recordIntegrity: "మార్పులు గుర్తించగల రికార్డు సమగ్రత",
    floralSource: "పుష్ప మూలం",
    evidence: "ఆధారం",
    honeyJourney: "తేనె ప్రయాణం",
    welcomeToTrust: "తేనె నమ్మకానికి స్వాగతం",
    fromHiveToTrust: "ఆరోగ్యకరమైన గూళ్ల నుంచి నమ్మకమైన తేనె వరకు.",
    loginSubtitle:
      "ప్రతి గూడును పర్యవేక్షించండి, ప్రతి సంకేతాన్ని అర్థం చేసుకోండి, ప్రతి సీసాకు వినియోగదారులు ధృవీకరించగల కథను ఇవ్వండి.",
    aiInsights: "AI అంతర్దృష్టులు",
    qrTrust: "QR నమ్మకం",
    secureAccess: "సురక్షిత ప్రవేశం",
    welcomeBack: "మళ్లీ స్వాగతం",
    chooseRole: "మధుసత్యలోకి ఎలా ప్రవేశించాలనుకుంటున్నారో ఎంచుకోండి.",
    beekeeper: "పెంపకదారు",
    customer: "వినియోగదారు",
    beekeeperId: "పెంపకదారు ID",
    mobileOrEmail: "మొబైల్ నంబర్ లేదా ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    enterDashboard: "డాష్‌బోర్డ్‌లోకి ప్రవేశించండి",
    verifyProduct: "ఉత్పత్తిని ధృవీకరించండి",
    loginPrivacy:
      "ఈ డెమోలో మీ పాత్ర మరియు సెషన్ స్థానికంగా నిల్వ చేయబడతాయి. విడుదలకు ముందు నిజమైన authentication అనుసంధానం చేయాలి.",
    customerPortal: "వినియోగదారు పోర్టల్",
    customerPortalSubtitle:
      "మధుసత్య QR లేబుల్‌లోని టోకెన్‌ను నమోదు చేసి ఆధారాలతో కూడిన తేనె ప్రయాణాన్ని చూడండి.",
    qrTokenLabel: "QR టోకెన్",
    logout: "లాగ్ అవుట్",
    tip: "సూచన:",
    customerTip:
      "మీ ఫోన్ కెమెరా నుంచి QR ధృవీకరణ లింక్‌ను నేరుగా కూడా తెరవచ్చు.",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    beekeepers: "मधुमक्खी पालक",
    hives: "मधुमक्खी के छत्ते",
    iot: "IoT निगरानी",
    iotMonitoring: "IoT निगरानी",
    aiHealth: "AI स्वास्थ्य",
    aiProductivity: "AI उत्पादकता",
    honeyQuality: "शहद गुणवत्ता",
    traceability: "ट्रेसबिलिटी",
    platform: "प्लेटफ़ॉर्म",
    systemStatus: "सिस्टम स्थिति",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    operational: "सभी सेवाएँ चालू हैं",
    unavailable: "बैकएंड कनेक्शन उपलब्ध नहीं है",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    truthTagline: "हर बूंद के पीछे सच्चाई",
    trustEngine: "AI ट्रस्ट इंजन",
    attention: "अभी किस पर ध्यान देना है?",
    evidenceSubtitle:
      "छत्ते के स्वास्थ्य, सेंसर डेटा, प्रोवेनेंस और QR व्यवहार से समझाने योग्य संकेत।",
    avgTrust: "औसत भरोसा",
    anomalies: "असामान्यताएँ",
    swarmRisk: "झुंड जोखिम",
    qrAlerts: "QR चेतावनियाँ",
    noAlerts:
      "कोई उच्च-प्राथमिकता चेतावनी सक्रिय नहीं है। नियमित निगरानी जारी रखें।",
    anomaly: "असामान्यता",
    swarm: "झुंड",
    counterfeit: "नकली जोखिम",
    hive: "छत्ता",
    batch: "बैच",
    honeyVerified: "शहद सत्यापित",
    consumerVerification: "मधुसत्य उपभोक्ता सत्यापन",
    evidenceBacked: "साक्ष्य-आधारित बैच सत्यापन",
    honeyTrust: "मधुसत्य हनी ट्रस्ट",
    trustScore: "ट्रस्ट स्कोर",
    evidenceInReview: "साक्ष्य की समीक्षा जारी है",
    trustDisclaimer:
      "यह स्कोर उपलब्ध साक्ष्य और जोखिम संकेतों को दर्शाता है। यह शुद्धता का वैज्ञानिक प्रमाण नहीं है।",
    possibleCounterfeit: "संभावित नकली गतिविधि का पता चला",
    additionalVerification:
      "अतिरिक्त सत्यापन की सलाह दी जाती है। यह उत्पाद को नकली घोषित नहीं करता।",
    registeredBeekeeper: "पंजीकृत मधुमक्खी पालक",
    sourceHive: "स्रोत छत्ता",
    verifiedHoneyBatch: "सत्यापित शहद बैच",
    quantity: "मात्रा",
    harvestDate: "कटाई की तारीख",
    processing: "प्रसंस्करण",
    packaging: "पैकेजिंग",
    storageLocation: "भंडारण स्थान",
    verificationFailed: "सत्यापन विफल",
    retry: "पुनः प्रयास करें",
    noToken: "QR सत्यापन टोकन नहीं दिया गया।",
    unableVerify: "इस QR कोड को सत्यापित नहीं किया जा सका।",
    verifying: "शहद बैच सत्यापित हो रहा है...",
    checkingRecords: "पालक, छत्ता और ट्रेसबिलिटी रिकॉर्ड जाँचे जा रहे हैं",
    notAvailable: "उपलब्ध नहीं",
    verified: "सत्यापित",
    estimated: "AI अनुमानित",
    laboratoryVerified: "प्रयोगशाला सत्यापित",
    recordIntegrity: "छेड़छाड़-स्पष्ट रिकॉर्ड अखंडता",
    floralSource: "पुष्प स्रोत",
    evidence: "साक्ष्य",
    honeyJourney: "शहद यात्रा",
    welcomeToTrust: "हनी ट्रस्ट में आपका स्वागत है",
    fromHiveToTrust: "स्वस्थ छत्तों से भरोसेमंद शहद तक।",
    loginSubtitle:
      "हर छत्ते की निगरानी करें, हर संकेत समझें और हर जार को ऐसी कहानी दें जिसे उपभोक्ता सत्यापित कर सकें।",
    aiInsights: "AI अंतर्दृष्टि",
    qrTrust: "QR भरोसा",
    secureAccess: "सुरक्षित प्रवेश",
    welcomeBack: "वापसी पर स्वागत है",
    chooseRole: "मधुसत्य में प्रवेश करने का तरीका चुनें।",
    beekeeper: "मधुमक्खी पालक",
    customer: "ग्राहक",
    beekeeperId: "पालक ID",
    mobileOrEmail: "मोबाइल नंबर या ईमेल",
    password: "पासवर्ड",
    enterDashboard: "डैशबोर्ड खोलें",
    verifyProduct: "उत्पाद सत्यापित करें",
    loginPrivacy:
      "इस डेमो में आपकी भूमिका और सत्र स्थानीय रूप से संग्रहीत हैं। लॉन्च से पहले वास्तविक authentication जोड़ें।",
    customerPortal: "ग्राहक पोर्टल",
    customerPortalSubtitle:
      "मधुसत्य QR लेबल का टोकन दर्ज करके साक्ष्य-आधारित शहद यात्रा देखें।",
    qrTokenLabel: "QR टोकन",
    logout: "लॉग आउट",
    tip: "सुझाव:",
    customerTip: "आप फोन कैमरे से QR सत्यापन लिंक सीधे भी खोल सकते हैं।",
  },
};

const legacyTranslations = {
  en: {
    smartPlatform: "Smart beekeeping & honey traceability platform",
    hackathon: "SMART INDIA HACKATHON 2026",
    betterInsights: "Better insights • Better traceability • Better trust",
    empowering: "Empowering Beekeepers",
    manageProducers:
      "Manage producers, apiaries and hive information from one platform.",
    healthyHives: "Healthy Hives",
    monitorHive:
      "Monitor hive conditions using IoT telemetry and AI-based health analysis.",
    trustedHoney: "Trusted Honey",
    trackBatches:
      "Track honey batches from harvest to consumer through blockchain and QR verification.",
    liveOverview: "Live System Overview",
    dashboardConnection: "Dashboard connection issue",
    unableDashboard: "Unable to connect to the dashboard service.",
    registeredProducers: "Registered producers",
    managedColonies: "Managed colonies",
    sensorObservations: "Sensor observations",
    hiveHealthChecks: "Hive health checks",
    aiPredictions: "AI predictions",
    qualityAssessments: "Quality assessments",
    traceableBatches: "Traceable batches",
    tamperRecords: "Tamper-evident records",
    consumerVerificationLabel: "Consumer verification",
    platformActivity: "Platform Activity",
    systemData: "System Data Overview",
    liveApi: "Live API Data",
    infrastructure: "Infrastructure",
    backendApi: "Backend API",
    healthy: "Healthy",
    active: "Active",
    available: "Available",
    blockchainLedger: "Blockchain Ledger",
    ready: "Ready",
    operationalNow: "HIVETRUST is operational",
    refreshData: "Refresh Data",
    fromHiveConsumer: "From Hive to Consumer",
    everyStep:
      "Every important step is connected to create a transparent honey journey.",
    producerRegistration: "Producer registration",
    smartHiveMonitoring: "Smart hive monitoring",
    harvestQuality: "Harvest and quality",
    tamperHistory: "Tamper-evident history",
    dataActionable: "Data becomes actionable insight.",
    collect: "Collect",
    analyze: "Analyze",
    record: "Record",
    verify: "Verify",
    temperatureHumidity: "Temperature, humidity, weight and bee activity.",
    hiveInsights: "Hive health, productivity and honey quality insights.",
    cryptographicHashes:
      "Honey-batch events linked through cryptographic hashes.",
    scanQr: "Consumers scan a unique QR code to view provenance.",
  },
  te: {
    smartPlatform: "స్మార్ట్ తేనెటీగల పెంపకం మరియు తేనె ట్రేసబిలిటీ వేదిక",
    hackathon: "స్మార్ట్ ఇండియా హ్యాకథాన్ 2026",
    betterInsights:
      "మెరుగైన అంతర్దృష్టులు • మెరుగైన ట్రేసబిలిటీ • మెరుగైన నమ్మకం",
    empowering: "పెంపకదారులకు శక్తి",
    manageProducers:
      "ఒకే వేదిక నుంచి ఉత్పత్తిదారులు, తేనెటీగల కేంద్రాలు మరియు గూడు సమాచారాన్ని నిర్వహించండి.",
    healthyHives: "ఆరోగ్యకరమైన గూళ్లు",
    monitorHive:
      "IoT డేటా మరియు AI ఆరోగ్య విశ్లేషణతో గూడు పరిస్థితులను పర్యవేక్షించండి.",
    trustedHoney: "నమ్మకమైన తేనె",
    trackBatches:
      "బ్లాక్‌చెయిన్ మరియు QR ధృవీకరణతో పంట నుంచి వినియోగదారుడి వరకు తేనె బ్యాచ్‌లను ట్రాక్ చేయండి.",
    liveOverview: "లైవ్ సిస్టమ్ అవలోకనం",
    dashboardConnection: "డాష్‌బోర్డ్ కనెక్షన్ సమస్య",
    unableDashboard: "డాష్‌బోర్డ్ సేవకు కనెక్ట్ కాలేకపోయాము.",
    registeredProducers: "నమోదైన ఉత్పత్తిదారులు",
    managedColonies: "నిర్వహిస్తున్న గూళ్లు",
    sensorObservations: "సెన్సార్ పరిశీలనలు",
    hiveHealthChecks: "గూడు ఆరోగ్య తనిఖీలు",
    aiPredictions: "AI అంచనాలు",
    qualityAssessments: "నాణ్యత అంచనాలు",
    traceableBatches: "ట్రేస్ చేయగల బ్యాచ్‌లు",
    tamperRecords: "మార్పులు గుర్తించగల రికార్డులు",
    consumerVerificationLabel: "వినియోగదారు ధృవీకరణ",
    platformActivity: "వేదిక కార్యకలాపం",
    systemData: "సిస్టమ్ డేటా అవలోకనం",
    liveApi: "లైవ్ API డేటా",
    infrastructure: "మౌలిక వసతులు",
    backendApi: "బ్యాక్‌ఎండ్ API",
    healthy: "ఆరోగ్యంగా ఉంది",
    active: "క్రియాశీలం",
    available: "అందుబాటులో ఉంది",
    blockchainLedger: "బ్లాక్‌చెయిన్ లెడ్జర్",
    ready: "సిద్ధంగా ఉంది",
    operationalNow: "మధుసత్య పనిచేస్తోంది",
    refreshData: "డేటాను రిఫ్రెష్ చేయండి",
    fromHiveConsumer: "గూడు నుంచి వినియోగదారు వరకు",
    everyStep:
      "పారదర్శకమైన తేనె ప్రయాణం కోసం ప్రతి ముఖ్యమైన దశ అనుసంధానించబడింది.",
    producerRegistration: "ఉత్పత్తిదారు నమోదు",
    smartHiveMonitoring: "స్మార్ట్ గూడు పర్యవేక్షణ",
    harvestQuality: "పంట మరియు నాణ్యత",
    tamperHistory: "మార్పులు గుర్తించగల చరిత్ర",
    dataActionable: "డేటా ఉపయోగకరమైన అంతర్దృష్టిగా మారుతుంది.",
    collect: "సేకరించండి",
    analyze: "విశ్లేషించండి",
    record: "రికార్డు చేయండి",
    verify: "ధృవీకరించండి",
    temperatureHumidity: "ఉష్ణోగ్రత, తేమ, బరువు మరియు తేనెటీగల చలనం.",
    hiveInsights: "గూడు ఆరోగ్యం, ఉత్పాదకత మరియు తేనె నాణ్యత అంతర్దృష్టులు.",
    cryptographicHashes:
      "క్రిప్టోగ్రాఫిక్ హాష్‌లతో అనుసంధానించిన తేనె బ్యాచ్ సంఘటనలు.",
    scanQr:
      "మూలాన్ని చూడటానికి వినియోగదారులు ప్రత్యేక QR కోడ్‌ను స్కాన్ చేస్తారు.",
  },
  hi: {
    smartPlatform: "स्मार्ट मधुमक्खी पालन और शहद ट्रेसबिलिटी प्लेटफ़ॉर्म",
    hackathon: "स्मार्ट इंडिया हैकथॉन 2026",
    betterInsights: "बेहतर अंतर्दृष्टि • बेहतर ट्रेसबिलिटी • बेहतर भरोसा",
    empowering: "मधुमक्खी पालकों को सक्षम बनाना",
    manageProducers:
      "एक ही प्लेटफ़ॉर्म से उत्पादकों, मधुमक्खी केंद्रों और छत्ते की जानकारी प्रबंधित करें।",
    healthyHives: "स्वस्थ छत्ते",
    monitorHive:
      "IoT डेटा और AI स्वास्थ्य विश्लेषण से छत्ते की स्थिति पर नज़र रखें।",
    trustedHoney: "भरोसेमंद शहद",
    trackBatches:
      "ब्लॉकचेन और QR सत्यापन से कटाई से उपभोक्ता तक शहद बैच ट्रैक करें।",
    liveOverview: "लाइव सिस्टम अवलोकन",
    dashboardConnection: "डैशबोर्ड कनेक्शन समस्या",
    unableDashboard: "डैशबोर्ड सेवा से कनेक्ट नहीं हो सका।",
    registeredProducers: "पंजीकृत उत्पादक",
    managedColonies: "प्रबंधित कॉलोनियाँ",
    sensorObservations: "सेंसर अवलोकन",
    hiveHealthChecks: "छत्ता स्वास्थ्य जाँच",
    aiPredictions: "AI पूर्वानुमान",
    qualityAssessments: "गुणवत्ता आकलन",
    traceableBatches: "ट्रेस करने योग्य बैच",
    tamperRecords: "छेड़छाड़-स्पष्ट रिकॉर्ड",
    consumerVerificationLabel: "उपभोक्ता सत्यापन",
    platformActivity: "प्लेटफ़ॉर्म गतिविधि",
    systemData: "सिस्टम डेटा अवलोकन",
    liveApi: "लाइव API डेटा",
    infrastructure: "इन्फ्रास्ट्रक्चर",
    backendApi: "बैकएंड API",
    healthy: "स्वस्थ",
    active: "सक्रिय",
    available: "उपलब्ध",
    blockchainLedger: "ब्लॉकचेन लेजर",
    ready: "तैयार",
    operationalNow: "मधुसत्य चालू है",
    refreshData: "डेटा रीफ्रेश करें",
    fromHiveConsumer: "छत्ते से उपभोक्ता तक",
    everyStep: "पारदर्शी शहद यात्रा बनाने के लिए हर महत्वपूर्ण चरण जुड़ा है।",
    producerRegistration: "उत्पादक पंजीकरण",
    smartHiveMonitoring: "स्मार्ट छत्ता निगरानी",
    harvestQuality: "कटाई और गुणवत्ता",
    tamperHistory: "छेड़छाड़-स्पष्ट इतिहास",
    dataActionable: "डेटा उपयोगी अंतर्दृष्टि बन जाता है।",
    collect: "संग्रह करें",
    analyze: "विश्लेषण करें",
    record: "रिकॉर्ड करें",
    verify: "सत्यापित करें",
    temperatureHumidity: "तापमान, आर्द्रता, वजन और मधुमक्खी गतिविधि।",
    hiveInsights: "छत्ता स्वास्थ्य, उत्पादकता और शहद गुणवत्ता अंतर्दृष्टि।",
    cryptographicHashes: "क्रिप्टोग्राफिक हैश से जुड़े शहद बैच इवेंट।",
    scanQr: "उपभोक्ता स्रोत देखने के लिए एक अद्वितीय QR कोड स्कैन करते हैं।",
  },
};
Object.keys(legacyTranslations).forEach(language =>
  Object.assign(translations[language], legacyTranslations[language])
);
Object.assign(translations.en, {
  fromHealthy: "From Healthy",
  hivesToTrusted: "Hives to Trusted",
  honeyWord: "Honey.",
  connectsSmart:
    "HIVETRUST connects smart beekeeping, IoT monitoring, AI-powered insights, blockchain traceability and QR-based consumer verification into one intelligent honey ecosystem.",
  smartEcosystem: "Smart Beekeeping Ecosystem",
  aiAnalytics: "AI Analytics",
  blockchain: "Blockchain",
  qrVerification: "QR Verification",
  database: "Database",
  realTimeOverview:
    "Real-time overview of the smart beekeeping and honey traceability platform.",
  endToEnd: "End-to-End Traceability",
  intelligentEcosystem: "Intelligent Honey Ecosystem",
  coreModules: "Core Modules",
  governance: "Governance",
});
Object.assign(translations.te, {
  fromHealthy: "ఆరోగ్యకరమైన",
  hivesToTrusted: "గూళ్ల నుంచి నమ్మకమైన",
  honeyWord: "తేనె.",
  connectsSmart:
    "మధుసత్య స్మార్ట్ తేనెటీగల పెంపకం, IoT పర్యవేక్షణ, AI అంతర్దృష్టులు, బ్లాక్‌చెయిన్ ట్రేసబిలిటీ మరియు QR వినియోగదారు ధృవీకరణను ఒక తెలివైన తేనె పర్యావరణంలో కలుపుతుంది.",
  smartEcosystem: "స్మార్ట్ తేనెటీగల పెంపక పర్యావరణం",
  aiAnalytics: "AI విశ్లేషణ",
  blockchain: "బ్లాక్‌చెయిన్",
  qrVerification: "QR ధృవీకరణ",
  database: "డేటాబేస్",
  realTimeOverview:
    "స్మార్ట్ తేనెటీగల పెంపకం మరియు తేనె ట్రేసబిలిటీ వేదిక యొక్క నిజ-సమయ అవలోకనం.",
  endToEnd: "ముగింపు వరకు ట్రేసబిలిటీ",
  intelligentEcosystem: "తెలివైన తేనె పర్యావరణం",
  coreModules: "ప్రధాన మాడ్యూల్స్",
  governance: "పాలన",
});
Object.assign(translations.hi, {
  fromHealthy: "स्वस्थ",
  hivesToTrusted: "छत्तों से भरोसेमंद",
  honeyWord: "शहद।",
  connectsSmart:
    "मधुसत्य स्मार्ट मधुमक्खी पालन, IoT निगरानी, AI अंतर्दृष्टि, ब्लॉकचेन ट्रेसबिलिटी और QR उपभोक्ता सत्यापन को एक बुद्धिमान शहद पारिस्थितिकी तंत्र में जोड़ता है।",
  smartEcosystem: "स्मार्ट मधुमक्खी पालन पारिस्थितिकी तंत्र",
  aiAnalytics: "AI विश्लेषण",
  blockchain: "ब्लॉकचेन",
  qrVerification: "QR सत्यापन",
  database: "डेटाबेस",
  realTimeOverview:
    "स्मार्ट मधुमक्खी पालन और शहद ट्रेसबिलिटी प्लेटफ़ॉर्म का रियल-टाइम अवलोकन।",
  endToEnd: "एंड-टू-एंड ट्रेसबिलिटी",
  intelligentEcosystem: "बुद्धिमान शहद पारिस्थितिकी तंत्र",
  coreModules: "मुख्य मॉड्यूल",
  governance: "शासन",
});
const authTranslations = {
  en: {
    registerAs: "I am registering as",
    createAccount: "Create your account",
    signInSubtitle: "Welcome back! Sign in to continue to HIVETRUST.",
    signUpSubtitle: "Create an account to start your HIVETRUST journey.",
    signIn: "Sign in",
    signUp: "Sign up",
    fullName: "Full name",
    fullNamePlaceholder: "Your name",
    emailOrPhone: "Email or phone number",
    confirmPassword: "Confirm password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signInToContinue: "Sign in to continue",
    createAccountButton: "Create account",
    noAccount: "Don’t have an account?",
    alreadyHaveAccount: "Already have an account?",
    contactRequired: "Enter your email or phone number.",
    nameRequired: "Enter your full name.",
    passwordLength: "Password must be at least 6 characters.",
    passwordMismatch: "Passwords do not match.",
    accountAlreadyExists:
      "Your account already exists. Please sign in to continue.",
    accountCreated:
      "Account created successfully. Welcome back! Sign in to continue.",
    accountNotFound:
      "No account was found with these details. Please sign up first.",
    invalidCredentials: "The password is incorrect. Please try again.",
    wrongRole:
      "This account belongs to the other role. Select the correct role to sign in.",
    customerDashboard: "Customer dashboard",
    customerWelcome: "Know the story behind every drop.",
    verifyHoney: "Verify honey",
    exploreTraceability: "Explore traceability",
    whyHIVETRUST: "Why HIVETRUST?",
    simpleVerification: "Simple QR verification",
    qualityEvidence: "Quality evidence",
    qualityCard:
      "Review laboratory, AI-estimated, packaging and provenance signals before you trust a jar.",
    openTraceability: "Open traceability",
    honeyJourney: "Honey journey",
    architectureModules: "Architecture & modules",
    scanOrEnter: "Scan a QR code or enter a batch token to verify your honey.",
    customerIntro:
      "From the hive to your home, view origin, quality signals, processing and packaging evidence in one place.",
    exploreButton: "Explore",
    viewJourney: "View honey journey",
    learnMore: "Learn more",
    customerProcessCard:
      "Transparent evidence connects people, data and decisions across the honey journey.",
  },
  te: {
    registerAs: "నేను ఇలా నమోదు అవుతున్నాను",
    createAccount: "మీ ఖాతాను సృష్టించండి",
    signInSubtitle: "మళ్లీ స్వాగతం! మధుసత్యను కొనసాగించడానికి సైన్ ఇన్ చేయండి.",
    signUpSubtitle:
      "మీ మధుసత్య ప్రయాణాన్ని ప్రారంభించడానికి ఖాతాను సృష్టించండి.",
    signIn: "సైన్ ఇన్",
    signUp: "సైన్ అప్",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "మీ పేరు",
    emailOrPhone: "ఇమెయిల్ లేదా ఫోన్ నంబర్",
    confirmPassword: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    showPassword: "పాస్‌వర్డ్ చూపించు",
    hidePassword: "పాస్‌వర్డ్ దాచు",
    signInToContinue: "కొనసాగించడానికి సైన్ ఇన్ చేయండి",
    createAccountButton: "ఖాతా సృష్టించండి",
    noAccount: "ఖాతా లేదా?",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    contactRequired: "మీ ఇమెయిల్ లేదా ఫోన్ నంబర్‌ను నమోదు చేయండి.",
    nameRequired: "మీ పూర్తి పేరును నమోదు చేయండి.",
    passwordLength: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
    passwordMismatch: "పాస్‌వర్డ్‌లు సరిపోలలేదు.",
    accountAlreadyExists:
      "మీ ఖాతా ఇప్పటికే ఉంది. కొనసాగించడానికి సైన్ ఇన్ చేయండి.",
    accountCreated:
      "ఖాతా విజయవంతంగా సృష్టించబడింది. మళ్లీ స్వాగతం! కొనసాగించడానికి సైన్ ఇన్ చేయండి.",
    accountNotFound: "ఈ వివరాలతో ఖాతా కనుగొనబడలేదు. ముందుగా సైన్ అప్ చేయండి.",
    invalidCredentials: "పాస్‌వర్డ్ తప్పుగా ఉంది. మళ్లీ ప్రయత్నించండి.",
    wrongRole:
      "ఈ ఖాతా మరొక పాత్రకు చెందినది. సైన్ ఇన్ చేయడానికి సరైన పాత్రను ఎంచుకోండి.",
    customerDashboard: "వినియోగదారు డాష్‌బోర్డ్",
    customerWelcome: "ప్రతి చుక్క వెనుక కథను తెలుసుకోండి.",
    verifyHoney: "తేనెను ధృవీకరించండి",
    exploreTraceability: "ట్రేసబిలిటీని అన్వేషించండి",
    whyHIVETRUST: "మధుసత్య ఎందుకు?",
    simpleVerification: "సులభమైన QR ధృవీకరణ",
    qualityEvidence: "నాణ్యత ఆధారం",
    qualityCard:
      "సీసాను నమ్మే ముందు ప్రయోగశాల, AI అంచనా, ప్యాకేజింగ్ మరియు మూల సంకేతాలను పరిశీలించండి.",
    openTraceability: "ఓపెన్ ట్రేసబిలిటీ",
    honeyJourney: "తేనె ప్రయాణం",
    architectureModules: "ఆర్కిటెక్చర్ మరియు మాడ్యూల్స్",
    scanOrEnter:
      "QR కోడ్‌ను స్కాన్ చేయండి లేదా తేనెను ధృవీకరించడానికి బ్యాచ్ టోకెన్ నమోదు చేయండి.",
    customerIntro:
      "గూడు నుంచి మీ ఇంటి వరకు, మూలం, నాణ్యత సంకేతాలు, ప్రాసెసింగ్ మరియు ప్యాకేజింగ్ ఆధారాలను ఒకే చోట చూడండి.",
    exploreButton: "అన్వేషించండి",
    viewJourney: "తేనె ప్రయాణాన్ని చూడండి",
    learnMore: "మరింత తెలుసుకోండి",
    customerProcessCard:
      "పారదర్శక ఆధారాలు తేనె ప్రయాణంలో వ్యక్తులు, డేటా మరియు నిర్ణయాలను అనుసంధానిస్తాయి.",
  },
  hi: {
    registerAs: "मैं इस रूप में पंजीकरण कर रहा/रही हूँ",
    createAccount: "अपना खाता बनाएं",
    signInSubtitle:
      "वापसी पर स्वागत है! मधुसत्य जारी रखने के लिए साइन इन करें।",
    signUpSubtitle: "अपनी मधुसत्य यात्रा शुरू करने के लिए खाता बनाएं।",
    signIn: "साइन इन",
    signUp: "साइन अप",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "आपका नाम",
    emailOrPhone: "ईमेल या फोन नंबर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छिपाएं",
    signInToContinue: "जारी रखने के लिए साइन इन",
    createAccountButton: "खाता बनाएं",
    noAccount: "खाता नहीं है?",
    alreadyHaveAccount: "पहले से खाता है?",
    contactRequired: "अपना ईमेल या फोन नंबर दर्ज करें।",
    nameRequired: "अपना पूरा नाम दर्ज करें।",
    passwordLength: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    accountAlreadyExists:
      "आपका खाता पहले से मौजूद है। जारी रखने के लिए साइन इन करें।",
    accountCreated:
      "खाता सफलतापूर्वक बन गया। वापस स्वागत है! जारी रखने के लिए साइन इन करें।",
    accountNotFound: "इन विवरणों से कोई खाता नहीं मिला। पहले साइन अप करें।",
    invalidCredentials: "पासवर्ड गलत है। फिर से प्रयास करें।",
    wrongRole:
      "यह खाता दूसरी भूमिका का है। साइन इन करने के लिए सही भूमिका चुनें।",
    customerDashboard: "ग्राहक डैशबोर्ड",
    customerWelcome: "हर बूंद के पीछे की कहानी जानें।",
    verifyHoney: "शहद सत्यापित करें",
    exploreTraceability: "ट्रेसबिलिटी देखें",
    whyHIVETRUST: "मधुसत्य क्यों?",
    simpleVerification: "सरल QR सत्यापन",
    qualityEvidence: "गुणवत्ता साक्ष्य",
    qualityCard:
      "जार पर भरोसा करने से पहले प्रयोगशाला, AI अनुमान, पैकेजिंग और स्रोत संकेत देखें।",
    openTraceability: "ओपन ट्रेसबिलिटी",
    honeyJourney: "शहद यात्रा",
    architectureModules: "आर्किटेक्चर और मॉड्यूल",
    scanOrEnter:
      "QR कोड स्कैन करें या शहद सत्यापित करने के लिए बैच टोकन दर्ज करें।",
    customerIntro:
      "छत्ते से आपके घर तक, स्रोत, गुणवत्ता संकेत, प्रसंस्करण और पैकेजिंग के साक्ष्य एक ही जगह देखें।",
    exploreButton: "देखें",
    viewJourney: "शहद यात्रा देखें",
    learnMore: "और जानें",
    customerProcessCard:
      "पारदर्शी साक्ष्य शहद यात्रा में लोगों, डेटा और निर्णयों को जोड़ते हैं।",
  },
};
Object.keys(authTranslations).forEach(language =>
  Object.assign(translations[language], authTranslations[language])
);
const customerCopy = {
  en: {
    honeyTraceabilityTab: "Honey Traceability",
    discoverAuthenticHoney:
      "Discover authentic honey and explore the journey behind every drop.",
    verifyHoneyBody:
      "Verify a batch and see the beekeeper, hive, quality and supply-chain evidence behind your honey.",
    traceYourHoney: "Trace your honey",
    traceYourHoneyBody:
      "View the journey from hive and beekeeper to processing, packaging and the bottle in your hands.",
    qrVerifications: "QR verifications",
    qrVerificationsBody:
      "Open a unique verification page with the batch identity, evidence and traceability timeline.",
    startVerification: "Start verification",
    transparencyFromHive: "Transparency from hive to bottle.",
    transparencyBody:
      "HIVETRUST connects beekeeping data, honey production traceability and consumer evidence so every purchase is more informed.",
    hiveOrigins: "Hive origins",
    smartMonitoring: "Smart monitoring",
    tamperEvident: "Tamper-evident records",
    consumerTools: "Consumer tools",
    everythingToTrust: "Everything you need to trust your honey",
    madhusatyaPromise: "The HIVETRUST promise",
    openTraceabilityBody:
      "Select a honey batch, inspect each lifecycle stage and open its verification record.",
    traceabilityIntro:
      "Select a registered honey batch to inspect quantity, processing phase, packaging, blockchain record and consumer QR identity.",
    harvest: "Harvest",
    blockchainTraceability: "Blockchain traceability",
    consumerQrVerification: "Consumer QR verification",
    batchRegistry: "Batch registry",
    selectHoneyBatch: "Select honey batch",
    selectBatchBody:
      "Choose a batch to inspect its complete traceability record.",
    status: "Status",
    blockchainProtected: "Blockchain protected",
    supplyChainRecord: "Supply-chain record",
    verifyBatchIdentity:
      "Verify the identity and traceability of this honey batch.",
    verificationUrl: "Verification URL",
    copied: "Copied",
    openVerificationPage: "Open verification page",
    hiveInformation: "Hive information",
    traceabilityNote: "Traceability note",
    traceabilityNoteBody:
      "Every transition is recorded as an evidence-backed supply-chain event.",
    honeyChainArchitecture: "Honey Chain architecture",
    coreModules: "Core modules",
    coreModulesBody:
      "Hive registration, IoT monitoring, AI health, quality analysis, QR verification and blockchain records.",
    governance: "Governance",
    governanceBody:
      "Designed for beekeeper cooperatives, KVIC programs and consumers across India.",
    supplyChainBody:
      "Harvest, processing, packaging, storage and consumer verification are linked into one journey.",
  },
  te: {
    honeyTraceabilityTab: "తేనె ట్రేసబిలిటీ",
    discoverAuthenticHoney:
      "నిజమైన తేనెను కనుగొని ప్రతి చుక్క ప్రయాణాన్ని అన్వేషించండి.",
    verifyHoneyBody:
      "బ్యాచ్‌ను ధృవీకరించి మీ తేనె వెనుక పెంపకదారు, గూడు, నాణ్యత మరియు సరఫరా ఆధారాలను చూడండి.",
    traceYourHoney: "మీ తేనెను ట్రేస్ చేయండి",
    traceYourHoneyBody:
      "గూడు మరియు పెంపకదారు నుంచి ప్రాసెసింగ్, ప్యాకేజింగ్ మరియు మీ చేతిలోని సీసా వరకు ప్రయాణాన్ని చూడండి.",
    qrVerifications: "QR ధృవీకరణలు",
    qrVerificationsBody:
      "బ్యాచ్ గుర్తింపు, ఆధారాలు మరియు ట్రేసబిలిటీ టైమ్‌లైన్‌తో ప్రత్యేక ధృవీకరణ పేజీని తెరవండి.",
    startVerification: "ధృవీకరణ ప్రారంభించండి",
    transparencyFromHive: "గూడు నుంచి సీసా వరకు పారదర్శకత.",
    transparencyBody:
      "మధుసత్య తేనెటీగల పెంపకం డేటా, తేనె ఉత్పత్తి ట్రేసబిలిటీ మరియు వినియోగదారు ఆధారాలను అనుసంధానిస్తుంది.",
    hiveOrigins: "గూడు మూలాలు",
    smartMonitoring: "స్మార్ట్ పర్యవేక్షణ",
    tamperEvident: "మార్పులు గుర్తించగల రికార్డులు",
    consumerTools: "వినియోగదారు సాధనాలు",
    everythingToTrust: "మీ తేనెను నమ్మడానికి అవసరమైన ప్రతిదీ",
    madhusatyaPromise: "HIVETRUST హామీ",
    openTraceabilityBody:
      "తేనె బ్యాచ్‌ను ఎంచుకుని దాని ప్రతి దశను పరిశీలించి ధృవీకరణ రికార్డును తెరవండి.",
    traceabilityIntro:
      "పరిమాణం, ప్రాసెసింగ్ దశ, ప్యాకేజింగ్, బ్లాక్‌చెయిన్ రికార్డు మరియు వినియోగదారు QR గుర్తింపును చూడటానికి బ్యాచ్‌ను ఎంచుకోండి.",
    harvest: "పంట",
    blockchainTraceability: "బ్లాక్‌చెయిన్ ట్రేసబిలిటీ",
    consumerQrVerification: "వినియోగదారు QR ధృవీకరణ",
    batchRegistry: "బ్యాచ్ రిజిస్ట్రీ",
    selectHoneyBatch: "తేనె బ్యాచ్ ఎంచుకోండి",
    selectBatchBody:
      "పూర్తి ట్రేసబిలిటీ రికార్డును చూడటానికి బ్యాచ్‌ను ఎంచుకోండి.",
    status: "స్థితి",
    blockchainProtected: "బ్లాక్‌చెయిన్ రక్షణ",
    supplyChainRecord: "సరఫరా గొలుసు రికార్డు",
    verifyBatchIdentity:
      "ఈ తేనె బ్యాచ్ గుర్తింపు మరియు ట్రేసబిలిటీని ధృవీకరించండి.",
    verificationUrl: "ధృవీకరణ URL",
    copied: "కాపీ చేయబడింది",
    openVerificationPage: "ధృవీకరణ పేజీ తెరవండి",
    hiveInformation: "గూడు సమాచారం",
    traceabilityNote: "ట్రేసబిలిటీ గమనిక",
    traceabilityNoteBody:
      "ప్రతి మార్పు ఆధారాలతో కూడిన సరఫరా గొలుసు సంఘటనగా రికార్డు చేయబడుతుంది.",
    honeyChainArchitecture: "హనీ చైన్ ఆర్కిటెక్చర్",
    coreModules: "ప్రధాన మాడ్యూల్స్",
    coreModulesBody:
      "గూడు నమోదు, IoT పర్యవేక్షణ, AI ఆరోగ్యం, నాణ్యత విశ్లేషణ, QR ధృవీకరణ మరియు బ్లాక్‌చెయిన్ రికార్డులు.",
    governance: "పాలన",
    governanceBody:
      "భారతదేశంలోని పెంపకదారు సహకార సంఘాలు, KVIC కార్యక్రమాలు మరియు వినియోగదారుల కోసం రూపొందించబడింది.",
    supplyChainBody:
      "పంట, ప్రాసెసింగ్, ప్యాకేజింగ్, నిల్వ మరియు వినియోగదారు ధృవీకరణ ఒకే ప్రయాణంగా అనుసంధానించబడ్డాయి.",
  },
  hi: {
    honeyTraceabilityTab: "हनी ट्रेसबिलिटी",
    discoverAuthenticHoney: "असली शहद खोजें और हर बूंद की यात्रा देखें।",
    verifyHoneyBody:
      "बैच सत्यापित करें और अपने शहद के पीछे पालक, छत्ता, गुणवत्ता और आपूर्ति के साक्ष्य देखें।",
    traceYourHoney: "अपने शहद को ट्रेस करें",
    traceYourHoneyBody:
      "छत्ते और पालक से प्रसंस्करण, पैकेजिंग और आपके हाथ की बोतल तक की यात्रा देखें।",
    qrVerifications: "QR सत्यापन",
    qrVerificationsBody:
      "बैच पहचान, साक्ष्य और ट्रेसबिलिटी टाइमलाइन वाला विशिष्ट सत्यापन पेज खोलें।",
    startVerification: "सत्यापन शुरू करें",
    transparencyFromHive: "छत्ते से बोतल तक पारदर्शिता।",
    transparencyBody:
      "मधुसत्य मधुमक्खी पालन डेटा, शहद उत्पादन ट्रेसबिलिटी और उपभोक्ता साक्ष्य को जोड़ता है।",
    hiveOrigins: "छत्ते के स्रोत",
    smartMonitoring: "स्मार्ट निगरानी",
    tamperEvident: "छेड़छाड़-स्पष्ट रिकॉर्ड",
    consumerTools: "उपभोक्ता उपकरण",
    everythingToTrust: "अपने शहद पर भरोसा करने के लिए सब कुछ",
    madhusatyaPromise: "HIVETRUST का वादा",
    openTraceabilityBody:
      "शहद बैच चुनें, हर चरण देखें और उसका सत्यापन रिकॉर्ड खोलें।",
    traceabilityIntro:
      "मात्रा, प्रसंस्करण चरण, पैकेजिंग, ब्लॉकचेन रिकॉर्ड और उपभोक्ता QR पहचान देखने के लिए बैच चुनें।",
    harvest: "कटाई",
    blockchainTraceability: "ब्लॉकचेन ट्रेसबिलिटी",
    consumerQrVerification: "उपभोक्ता QR सत्यापन",
    batchRegistry: "बैच रजिस्ट्री",
    selectHoneyBatch: "शहद बैच चुनें",
    selectBatchBody: "पूरा ट्रेसबिलिटी रिकॉर्ड देखने के लिए बैच चुनें।",
    status: "स्थिति",
    blockchainProtected: "ब्लॉकचेन सुरक्षित",
    supplyChainRecord: "आपूर्ति श्रृंखला रिकॉर्ड",
    verifyBatchIdentity: "इस शहद बैच की पहचान और ट्रेसबिलिटी सत्यापित करें।",
    verificationUrl: "सत्यापन URL",
    copied: "कॉपी किया गया",
    openVerificationPage: "सत्यापन पेज खोलें",
    hiveInformation: "छत्ता जानकारी",
    traceabilityNote: "ट्रेसबिलिटी नोट",
    traceabilityNoteBody:
      "हर बदलाव को साक्ष्य-आधारित आपूर्ति श्रृंखला घटना के रूप में दर्ज किया जाता है।",
    honeyChainArchitecture: "हनी चेन आर्किटेक्चर",
    coreModules: "मुख्य मॉड्यूल",
    coreModulesBody:
      "छत्ता पंजीकरण, IoT निगरानी, AI स्वास्थ्य, गुणवत्ता विश्लेषण, QR सत्यापन और ब्लॉकचेन रिकॉर्ड।",
    governance: "शासन",
    governanceBody:
      "भारत में मधुमक्खी पालक सहकारी समितियों, KVIC कार्यक्रमों और उपभोक्ताओं के लिए बनाया गया।",
    supplyChainBody:
      "कटाई, प्रसंस्करण, पैकेजिंग, भंडारण और उपभोक्ता सत्यापन एक यात्रा में जुड़े हैं।",
  },
};
Object.keys(customerCopy).forEach(language =>
  Object.assign(translations[language], customerCopy[language])
);
Object.assign(translations.en, {
  customerOverviewNav: "Customer Overview",
  myHoneyBatchesNav: "My Honey Batches",
  qrVerificationNav: "QR Verification",
  customerSpace: "Customer space",
  systemStatusLabel: "System Status",
  verifiedAccount: "Verified account",
  customerPortalTitle: "Customer Portal",
  honeyTrustConsole: "Honey Trust Console",
  yourHoneyIntelligence: "Your honey intelligence",
  knowEveryDrop: "Know every drop.",
  trustEveryJar: "Trust every jar.",
  welcomeCustomer: "Welcome to your customer space.",
  exploreVerifiedJourney: "Explore verified origins, quality evidence, and the complete journey behind your honey.",
  exploreMyBatches: "Explore my batches",
  verifiedBatches: "Verified batches",
  traceableHoneyLots: "Traceable honey lots",
  traceabilityScoreLabel: "Traceability score",
  chainRecordsVerified: "Chain records verified",
  qrIdentities: "QR identities",
  readyToScan: "Ready to scan",
  originRegions: "Origin regions",
  acrossIndia: "Across India",
  recentHoneyActivity: "Recent honey activity",
  trustedSupplyChain: "Your trusted supply chain",
  viewAllBatches: "View all batches →",
  inProgress: "In progress",
  honeyProvenance: "Honey provenance",
  whyTrustHivetrust: "Why trust HIVETRUST?",
  transparencyHiveHome: "Transparency from hive to home.",
  verifiedRecords: "Verified records",
  everyMilestoneConnected: "Every milestone is connected.",
  instantVerification: "Instant verification",
  scanCustomerQr: "Scan a unique customer QR.",
  openTraceabilityLabel: "Open traceability",
  seeStoryJar: "See the story behind your jar.",
  consumerVerificationLabel: "Consumer verification",
  myHoneyBatchesTitle: "My honey batches",
  inspectJourney: "Inspect the complete journey from harvest to verified consumer identity.",
  overview: "← Overview",
  selectHoneyBatchTitle: "Select a honey batch",
  eachBatchRecord: "Each batch has its own traceability record and customer QR identity.",
  verifiedHoneyBatchLabel: "Verified honey batch",
  blockchainProtectedLabel: "Blockchain protected",
  blockchainBatchBody: "Harvest, quality, and packaging events are linked to this verified batch.",
  customerQrIdentity: "Customer QR identity",
  scanVerifyJar: "Scan to verify this jar",
  verificationUrlCopied: "Verification URL copied",
  uniqueQrBatch: "This QR is unique to this customer and batch.",
  openVerificationPageLabel: "Open verification page",
  quantityLabel: "Quantity",
  harvestDateLabel: "Harvest date",
  processingLabel: "Processing",
  packagingLabel: "Packaging",
  storageLabel: "Storage",
  statusLabel: "Status",
});
Object.assign(translations.te, {
  customerOverviewNav: "వినియోగదారు అవలోకనం",
  myHoneyBatchesNav: "నా తేనె బ్యాచ్‌లు",
  qrVerificationNav: "QR ధృవీకరణ",
  customerSpace: "వినియోగదారు స్థలం",
  systemStatusLabel: "సిస్టమ్ స్థితి",
  verifiedAccount: "ధృవీకరించిన ఖాతా",
  customerPortalTitle: "వినియోగదారు పోర్టల్",
  honeyTrustConsole: "హనీ ట్రస్ట్ కన్సోల్",
  yourHoneyIntelligence: "మీ తేనె మేధస్సు",
  knowEveryDrop: "ప్రతి చుక్కను తెలుసుకోండి.",
  trustEveryJar: "ప్రతి సీసాను నమ్మండి.",
  welcomeCustomer: "మీ వినియోగదారు స్థలానికి స్వాగతం.",
  exploreVerifiedJourney: "ధృవీకరించిన మూలాలు, నాణ్యత ఆధారాలు మరియు మీ తేనె పూర్తి ప్రయాణాన్ని అన్వేషించండి.",
  exploreMyBatches: "నా బ్యాచ్‌లను అన్వేషించండి",
  verifiedBatches: "ధృవీకరించిన బ్యాచ్‌లు",
  traceableHoneyLots: "ట్రేస్ చేయగల తేనె లాట్లు",
  traceabilityScoreLabel: "ట్రేసబిలిటీ స్కోర్",
  chainRecordsVerified: "చైన్ రికార్డులు ధృవీకరించబడ్డాయి",
  qrIdentities: "QR గుర్తింపులు",
  readyToScan: "స్కాన్ చేయడానికి సిద్ధం",
  originRegions: "మూల ప్రాంతాలు",
  acrossIndia: "భారతదేశం అంతటా",
  recentHoneyActivity: "ఇటీవలి తేనె కార్యకలాపం",
  trustedSupplyChain: "మీ నమ్మకమైన సరఫరా గొలుసు",
  viewAllBatches: "అన్ని బ్యాచ్‌లను చూడండి →",
  inProgress: "ప్రగతిలో ఉంది",
  honeyProvenance: "తేనె మూలం",
  whyTrustHivetrust: "HIVETRUSTను ఎందుకు నమ్మాలి?",
  transparencyHiveHome: "తుట్టె నుండి ఇంటి వరకు పారదర్శకత.",
  verifiedRecords: "ధృవీకరించిన రికార్డులు",
  everyMilestoneConnected: "ప్రతి మైలురాయి అనుసంధానించబడింది.",
  instantVerification: "తక్షణ ధృవీకరణ",
  scanCustomerQr: "ప్రత్యేక వినియోగదారు QRను స్కాన్ చేయండి.",
  openTraceabilityLabel: "ఓపెన్ ట్రేసబిలిటీ",
  seeStoryJar: "మీ సీసా వెనుక కథను చూడండి.",
  consumerVerificationLabel: "వినియోగదారు ధృవీకరణ",
  myHoneyBatchesTitle: "నా తేనె బ్యాచ్‌లు",
  inspectJourney: "పంట నుండి ధృవీకరించిన వినియోగదారు గుర్తింపు వరకు పూర్తి ప్రయాణాన్ని పరిశీలించండి.",
  overview: "← అవలోకనం",
  selectHoneyBatchTitle: "తేనె బ్యాచ్‌ను ఎంచుకోండి",
  eachBatchRecord: "ప్రతి బ్యాచ్‌కు ప్రత్యేక ట్రేసబిలిటీ రికార్డు మరియు వినియోగదారు QR గుర్తింపు ఉంటుంది.",
  verifiedHoneyBatchLabel: "ధృవీకరించిన తేనె బ్యాచ్",
  blockchainProtectedLabel: "బ్లాక్‌చెయిన్ రక్షణ",
  blockchainBatchBody: "పంట, నాణ్యత మరియు ప్యాకేజింగ్ సంఘటనలు ఈ ధృవీకరించిన బ్యాచ్‌కు అనుసంధానించబడ్డాయి.",
  customerQrIdentity: "వినియోగదారు QR గుర్తింపు",
  scanVerifyJar: "ఈ సీసాను ధృవీకరించడానికి స్కాన్ చేయండి",
  verificationUrlCopied: "ధృవీకరణ URL కాపీ చేయబడింది",
  uniqueQrBatch: "ఈ QR ఈ వినియోగదారు మరియు బ్యాచ్‌కు ప్రత్యేకమైనది.",
  openVerificationPageLabel: "ధృవీకరణ పేజీని తెరవండి",
  quantityLabel: "పరిమాణం", harvestDateLabel: "పంట తేదీ", processingLabel: "ప్రాసెసింగ్", packagingLabel: "ప్యాకేజింగ్", storageLabel: "నిల్వ", statusLabel: "స్థితి",
});
Object.assign(translations.hi, {
  customerOverviewNav: "ग्राहक अवलोकन",
  myHoneyBatchesNav: "मेरे शहद बैच",
  qrVerificationNav: "QR सत्यापन",
  customerSpace: "ग्राहक क्षेत्र",
  systemStatusLabel: "सिस्टम स्थिति",
  verifiedAccount: "सत्यापित खाता",
  customerPortalTitle: "ग्राहक पोर्टल",
  honeyTrustConsole: "हनी ट्रस्ट कंसोल",
  yourHoneyIntelligence: "आपकी शहद बुद्धिमत्ता",
  knowEveryDrop: "हर बूंद को जानें।",
  trustEveryJar: "हर जार पर भरोसा करें।",
  welcomeCustomer: "आपके ग्राहक क्षेत्र में स्वागत है।",
  exploreVerifiedJourney: "सत्यापित स्रोत, गुणवत्ता साक्ष्य और आपके शहद की पूरी यात्रा देखें।",
  exploreMyBatches: "मेरे बैच देखें",
  verifiedBatches: "सत्यापित बैच",
  traceableHoneyLots: "ट्रेस करने योग्य शहद लॉट",
  traceabilityScoreLabel: "ट्रेसबिलिटी स्कोर",
  chainRecordsVerified: "चेन रिकॉर्ड सत्यापित",
  qrIdentities: "QR पहचान",
  readyToScan: "स्कैन के लिए तैयार",
  originRegions: "मूल क्षेत्र",
  acrossIndia: "पूरे भारत में",
  recentHoneyActivity: "हाल की शहद गतिविधि",
  trustedSupplyChain: "आपकी भरोसेमंद आपूर्ति श्रृंखला",
  viewAllBatches: "सभी बैच देखें →",
  inProgress: "प्रगति में",
  honeyProvenance: "शहद स्रोत",
  whyTrustHivetrust: "HIVETRUST पर भरोसा क्यों करें?",
  transparencyHiveHome: "छत्ते से घर तक पारदर्शिता।",
  verifiedRecords: "सत्यापित रिकॉर्ड",
  everyMilestoneConnected: "हर चरण जुड़ा हुआ है।",
  instantVerification: "तुरंत सत्यापन",
  scanCustomerQr: "एक अद्वितीय ग्राहक QR स्कैन करें।",
  openTraceabilityLabel: "ओपन ट्रेसबिलिटी",
  seeStoryJar: "अपने जार के पीछे की कहानी देखें।",
  consumerVerificationLabel: "उपभोक्ता सत्यापन",
  myHoneyBatchesTitle: "मेरे शहद बैच",
  inspectJourney: "कटाई से सत्यापित उपभोक्ता पहचान तक पूरी यात्रा देखें।",
  overview: "← अवलोकन",
  selectHoneyBatchTitle: "शहद बैच चुनें",
  eachBatchRecord: "हर बैच का अपना ट्रेसबिलिटी रिकॉर्ड और ग्राहक QR पहचान है।",
  verifiedHoneyBatchLabel: "सत्यापित शहद बैच",
  blockchainProtectedLabel: "ब्लॉकचेन सुरक्षित",
  blockchainBatchBody: "कटाई, गुणवत्ता और पैकेजिंग घटनाएँ इस सत्यापित बैच से जुड़ी हैं।",
  customerQrIdentity: "ग्राहक QR पहचान",
  scanVerifyJar: "इस जार को सत्यापित करने के लिए स्कैन करें",
  verificationUrlCopied: "सत्यापन URL कॉपी किया गया",
  uniqueQrBatch: "यह QR इस ग्राहक और बैच के लिए अद्वितीय है।",
  openVerificationPageLabel: "सत्यापन पृष्ठ खोलें",
  quantityLabel: "मात्रा", harvestDateLabel: "कटाई की तारीख", processingLabel: "प्रसंस्करण", packagingLabel: "पैकेजिंग", storageLabel: "भंडारण", statusLabel: "स्थिति",
});

Object.assign(translations.en, {
  backToDashboard: "Back to customer dashboard",
});
Object.assign(translations.te, {
  backToDashboard: "వినియోగదారు డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
});
Object.assign(translations.hi, {
  backToDashboard: "ग्राहक डैशबोर्ड पर वापस जाएं",
});

const originalTextNodes = new WeakMap();
let isTranslatingLegacyContent = false;

function translateLegacyContent(language) {
  if (typeof document === "undefined") return;
  if (isTranslatingLegacyContent) return;
  isTranslatingLegacyContent = true;
  const source = translations.en;
  const target = translations[language] || source;
  const lookup = new Map(
    Object.entries(source).map(([key, value]) => [
      String(value),
      String(target[key] || value),
    ])
  );
  Object.entries(legacyPhraseTranslations).forEach(([phrase, values]) => {
    lookup.set(phrase, String(values[language] || phrase));
  });
  const preserve = value => {
    const leading = value.match(/^\s*/)?.[0] || "";
    const trailing = value.match(/\s*$/)?.[0] || "";
    const trimmed = value.trim();
    if (lookup.has(trimmed))
      return `${leading}${lookup.get(trimmed)}${trailing}`;
    let translated = value;
    [...lookup.entries()]
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([from, to]) => {
        if (from.length > 2 && translated.includes(from))
          translated = translated.split(from).join(to);
      });
    return translated;
  };
  const textWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );
  const nodes = [];
  let node;
  while ((node = textWalker.nextNode())) nodes.push(node);
  nodes.forEach(textNode => {
    if (!textNode.parentElement?.closest("script,style,option")) {
      const current = textNode.nodeValue;
      const tracked = originalTextNodes.get(textNode);
      const original =
        !tracked ||
        (current !== tracked.translated && current !== tracked.original)
          ? current
          : tracked.original;
      const translated = preserve(original);
      originalTextNodes.set(textNode, { original, translated });
      if (textNode.nodeValue !== translated) textNode.nodeValue = translated;
    }
  });
  document
    .querySelectorAll("[placeholder],[title],[aria-label]")
    .forEach(element => {
      ["placeholder", "title", "aria-label"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        const key = `madhusatyaOriginal${attribute.replace(/[^a-z]/gi, "")}`;
        const original =
          element.dataset[key] || element.getAttribute(attribute);
        if (!element.dataset[key]) element.dataset[key] = original;
        const translated = preserve(original);
        if (element.getAttribute(attribute) !== translated)
          element.setAttribute(attribute, translated);
      });
    });
  isTranslatingLegacyContent = false;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const setLanguage = next => {
    setLanguageState(next);
    localStorage.setItem("language", next);
  };
  useEffect(() => {
    document.documentElement.lang = language;
    translateLegacyContent(language);
    const observer = new MutationObserver(() =>
      translateLegacyContent(language)
    );
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: LANGUAGES,
      t: key => translations[language]?.[key] || translations.en[key] || key,
    }),
    [language]
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
