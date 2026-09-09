import React, { useState, useEffect } from "react";
import {
  ActivePage,
  Language,
  Hive,
  Beekeeper,
  HoneyBatch,
  BlockchainBlock,
} from "./types";
import { storage } from "./utils/storage";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BeekeepersPage } from "./pages/BeekeepersPage";
import { HivesPage } from "./pages/HivesPage";
import { IotMonitoringPage } from "./pages/IotMonitoringPage";
import { AiHealthPage } from "./pages/AiHealthPage";
import { BatchesPage } from "./pages/BatchesPage";
import { BlockchainLedgerPage } from "./pages/BlockchainLedgerPage";
import { ConsumerVerificationPage } from "./pages/ConsumerVerificationPage";
import { ThemeMode, themeStorage } from "./utils/theme";
import { LanguageProvider } from "./portal/i18n.jsx";
import LoginPage from "./pages/portal/LoginPage.jsx";
import CustomerDashboard from "./pages/portal/CustomerDashboard.jsx";
import QRVerificationPage from "./pages/portal/QRVerificationPage.jsx";

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>("landing");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<ThemeMode>("forest");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core Data Collections
  const [hives, setHives] = useState<Hive[]>([]);
  const [beekeepers, setBeekeepers] = useState<Beekeeper[]>([]);
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [targetVerifyBatchId, setTargetVerifyBatchId] = useState<
    string | undefined
  >(undefined);
  const [session, setSession] = useState<any>(() => {
    try {
      if (new URLSearchParams(window.location.search).has("logout")) {
        localStorage.removeItem("madhusatya-session");
        return null;
      }
      return JSON.parse(localStorage.getItem("madhusatya-session") || "null");
    } catch {
      return null;
    }
  });

  // Initialize DB, theme and load collections
  useEffect(() => {
    async function loadAppData() {
      try {
        const savedTheme = themeStorage.getTheme();
        setTheme(savedTheme);
        themeStorage.setTheme(savedTheme);

        await storage.initDatabase();
        const [
          loadedHives,
          loadedBeekeepers,
          loadedBatches,
          loadedBlocks,
          savedLang,
        ] = await Promise.all([
          storage.getHives(),
          storage.getBeekeepers(),
          storage.getBatches(),
          storage.getBlocks(),
          storage.getLanguage(),
        ]);

        setHives(loadedHives);
        setBeekeepers(loadedBeekeepers);
        setBatches(loadedBatches);
        setBlocks(loadedBlocks);
        setLanguage(savedLang);
      } catch (err) {
        console.error("Failed to initialize HIVETRUST storage:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppData();
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    themeStorage.setTheme(newTheme);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    storage.saveLanguage(newLang);
  };

  const handleNavigate = (page: ActivePage, batchId?: string) => {
    setActivePage(page);
    if (batchId) {
      setTargetVerifyBatchId(batchId);
    }
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHiveAdded = (newHive: Hive) => {
    setHives(prev => [newHive, ...prev]);
  };

  const handleBatchCreated = (
    newBatch: HoneyBatch,
    newBlock: BlockchainBlock
  ) => {
    setBatches(prev => [newBatch, ...prev]);
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleLogin = (nextSession: any) => {
    localStorage.setItem("madhusatya-session", JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("madhusatya-session");
    setSession(null);
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage === "en" ||
      savedLanguage === "hi" ||
      savedLanguage === "te"
    ) {
      setLanguage(savedLanguage);
    }
  };

  const handleCustomerVerify = (value: string) => {
    if (!value) return;
    let token = value;
    try {
      const parsed = new URL(value, window.location.origin);
      const pathToken = parsed.pathname.match(/\/verify\/([^/]+)/)?.[1];
      token = pathToken || parsed.searchParams.get("token") || value;
    } catch {
      token = value;
    }
    window.location.href = `/verify/${encodeURIComponent(decodeURIComponent(token))}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2B1B12] flex flex-col items-center justify-center text-[#F2E4C9] space-y-4">
        <div className="w-12 h-12 border-4 border-[#C99A3A] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-bold tracking-widest text-[#C99A3A] uppercase">
          Initializing HIVETRUST...
        </div>
        <div className="text-xs text-[#C9B394]">
          Verifying SHA-256 genesis block and local apiary telemetry
        </div>
      </div>
    );
  }

  const verificationToken = window.location.pathname.startsWith("/verify/")
    ? window.location.pathname.split("/verify/")[1]
    : undefined;

  if (verificationToken) {
    return (
      <LanguageProvider>
        <QRVerificationPage
          token={verificationToken}
          onBack={() => {
            window.location.href = "/";
          }}
        />
      </LanguageProvider>
    );
  }

  if (!session) {
    return (
      <LanguageProvider>
        <LoginPage
          onLogin={handleLogin}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      </LanguageProvider>
    );
  }

  if (session.role === "customer") {
    return (
      <LanguageProvider>
        <CustomerDashboard
          name={session.name}
          onVerify={handleCustomerVerify}
          onLogout={handleLogout}
          theme={theme}
          onThemeChange={handleThemeChange}
          batches={batches}
          beekeepers={beekeepers}
          hives={hives}
        />
      </LanguageProvider>
    );
  }

  return (
    <div className="hivetrust-admin-shell min-h-screen bg-[#2B1B12] text-[#F2E4C9] flex font-sans selection:bg-[#C99A3A] selection:text-[#23150D]">
      {/* Desktop Fixed Vertical Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        setActivePage={handleNavigate}
        language={language}
        onLanguageChange={handleLanguageChange}
        setLanguage={handleLanguageChange}
        theme={theme}
        onThemeChange={handleThemeChange}
        isOpen={isMobileNavOpen}
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Mobile Header with Drawer Toggle */}
        <MobileHeader
          language={language}
          onLanguageChange={handleLanguageChange}
          setLanguage={handleLanguageChange}
          theme={theme}
          onThemeChange={handleThemeChange}
          onToggleNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onMenuClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onLogout={handleLogout}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === "landing" && (
            <LandingPage language={language} onNavigate={handleNavigate} />
          )}

          {activePage === "dashboard" && (
            <DashboardPage
              hives={hives}
              beekeepers={beekeepers}
              batches={batches}
              language={language}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === "beekeepers" && (
            <BeekeepersPage
              beekeepers={beekeepers}
              hives={hives}
              language={language}
            />
          )}

          {activePage === "hives" && (
            <HivesPage
              hives={hives}
              beekeepers={beekeepers}
              language={language}
              onHiveAdded={handleHiveAdded}
            />
          )}

          {activePage === "iot" && (
            <IotMonitoringPage hives={hives} language={language} />
          )}

          {activePage === "ai-health" && (
            <AiHealthPage hives={hives} language={language} />
          )}

          {activePage === "batches" && (
            <BatchesPage
              batches={batches}
              hives={hives}
              beekeepers={beekeepers}
              blocks={blocks}
              language={language}
              onBatchCreated={handleBatchCreated}
              onNavigateToVerify={batchId => handleNavigate("verify", batchId)}
            />
          )}

          {(activePage === "blockchain" ||
            (activePage as string) === "ledger") && (
            <BlockchainLedgerPage blocks={blocks} language={language} />
          )}

          {activePage === "verify" && (
            <ConsumerVerificationPage
              batches={batches}
              beekeepers={beekeepers}
              hives={hives}
              initialBatchId={targetVerifyBatchId}
              language={language}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
