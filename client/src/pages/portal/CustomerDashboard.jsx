import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  GitBranch,
  Layers3,
  LogOut,
  MapPin,
  PackageCheck,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  Clock3,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../../portal/i18n.jsx";
import { createQrDataUrl } from "../../portal/qr";
import PortalThemeSelect from "./PortalThemeSelect";

const demoBatches = [
  {
    code: "MS-HNY-2026-001",
    quantity: "128 kg",
    phase: "Packed & ready",
    harvest: "18 Aug 2026",
    processing: "Cold extraction",
    packaging: "Glass jar · tamper seal",
    storage: "KVIC Honey Centre · Telangana",
    beekeeper: "Ramesh Kumar",
    beekeeperCode: "BK-TS-0042",
    location: "Nizamabad, Telangana",
    hive: "Hive H-014",
    species: "Apis cerana indica",
    installed: "12 Jun 2026",
    qr: "MSQR-001-8F4A",
  },
  {
    code: "MS-HNY-2026-002",
    quantity: "86 kg",
    phase: "Processing",
    harvest: "26 Aug 2026",
    processing: "Filtered extraction",
    packaging: "Pending",
    storage: "Green Valley Apiary · Karnataka",
    beekeeper: "Lakshmi Devi",
    beekeeperCode: "BK-KA-0017",
    location: "Mysuru, Karnataka",
    hive: "Hive H-022",
    species: "Apis mellifera",
    installed: "02 Jul 2026",
    qr: "MSQR-002-3C9B",
  },
];

const navItems = [
  { id: "dashboard", label: "Customer Overview", icon: "⌂" },
  { id: "traceability", label: "My Honey Batches", icon: "⌁" },
  { id: "verify", label: "QR Verification", icon: "▣" },
];

function normalizeSharedBatches(sourceBatches, sourceBeekeepers, sourceHives) {
  if (!sourceBatches?.length) return demoBatches;
  return sourceBatches.map(batch => {
    const beekeeper = sourceBeekeepers.find(
      item => item.id === batch.beekeeperId
    );
    const hive = sourceHives.find(item => item.id === batch.hiveId);
    return {
      code: batch.id,
      quantity: `${batch.quantityKg} kg`,
      phase:
        batch.verificationStatus === "Verified" ? "Verified" : "Processing",
      harvest: batch.harvestDate,
      processing: batch.coldExtracted
        ? "Cold extraction"
        : "Standard extraction",
      packaging: batch.packagingDate ? "Glass jar · tamper seal" : "Pending",
      storage: batch.packagingFacility || "HIVETRUST apiary centre",
      beekeeper:
        batch.beekeeperName || beekeeper?.name || "Registered beekeeper",
      beekeeperCode: beekeeper?.code || batch.beekeeperId,
      location: `${batch.village}, ${batch.state}`,
      hive: batch.hiveNumber || hive?.hiveNumber || batch.hiveId,
      species: hive?.species || "Registered honeybee colony",
      installed: hive?.installationDate || "Recorded in hive registry",
      qr: batch.qrPayloadUrl || `${window.location.origin}/verify/${batch.id}`,
    };
  });
}

export default function CustomerDashboard({
  onVerify,
  onLogout,
  name,
  theme,
  onThemeChange,
  batches: sourceBatches = [],
  beekeepers = [],
  hives = [],
}) {
  const { language, setLanguage, languages } = useLanguage();
  const batches = useMemo(
    () => normalizeSharedBatches(sourceBatches, beekeepers, hives),
    [sourceBatches, beekeepers, hives]
  );
  const [tab, setTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(batches[0]?.code);
  const [copied, setCopied] = useState(false);
  const selected = useMemo(
    () => batches.find(batch => batch.code === selectedCode) || batches[0],
    [selectedCode]
  );
  const qrPayload = selected?.qr || "";
  const verificationToken = qrPayload.startsWith("http")
    ? (() => {
        const parsed = new URL(qrPayload, window.location.origin);
        return (
          parsed.pathname.split("/verify/")[1] ||
          parsed.searchParams.get("token") ||
          ""
        );
      })()
    : qrPayload;
  const verificationUrl = qrPayload.startsWith("http")
    ? qrPayload
    : `${window.location.origin}/verify/${qrPayload}`;

  const navigate = nextTab => {
    setTab(nextTab);
    setMobileOpen(false);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="portal-shell min-h-screen bg-[var(--portal-canvas)] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-[var(--portal-dark)] text-white lg:flex">
        <Brand />
        <div className="px-5 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300/60">
            Customer space
          </p>
          <nav className="mt-4 space-y-2">
            {navItems.map(item => (
              <NavButton
                key={item.id}
                item={item}
                active={tab === item.id}
                onClick={() => navigate(item.id)}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-100">
                System Status
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" />
            </div>
            <p className="mt-2 text-[11px] text-amber-100/60">
              All services operational
            </p>
            <div className="mt-3 flex gap-2 text-[10px] text-amber-100/40">
              <span>● IoT</span>
              <span>● AI</span>
              <span>● Blockchain</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-amber-100 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-amber-100/80 bg-[var(--portal-surface)]/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl bg-[var(--portal-dark)] p-2 text-amber-200 lg:hidden"
                onClick={() => setMobileOpen(open => !open)}
                aria-label="Open navigation"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                  Customer Portal
                </p>
                <h1 className="text-xl font-black sm:text-2xl">
                  Honey Trust Console
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PortalThemeSelect
                theme={theme}
                onThemeChange={onThemeChange}
                compact
              />
              <select
                aria-label="Select language"
                value={language}
                onChange={event => setLanguage(event.target.value)}
                className="hidden rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-bold sm:block"
              >
                {languages.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.nativeLabel}
                  </option>
                ))}
              </select>
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                Verified account
              </div>
            </div>
          </div>
          {mobileOpen && (
            <div className="border-t border-amber-100 bg-[var(--portal-dark)] p-4 lg:hidden">
              {navItems.map(item => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={tab === item.id}
                  onClick={() => navigate(item.id)}
                  mobile
                />
              ))}
              <button
                onClick={onLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-amber-100"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </header>

        {tab === "dashboard" ? (
          <CustomerOverview
            name={name}
            onNavigate={navigate}
            onVerify={onVerify}
            batches={batches}
          />
        ) : (
          <TraceabilityWorkspace
            selected={selected}
            selectedCode={selectedCode}
            setSelectedCode={setSelectedCode}
            verificationUrl={verificationUrl}
            customerToken={verificationToken}
            copyUrl={copyUrl}
            copied={copied}
            onOpen={() => onVerify(verificationToken)}
            onNavigate={navigate}
            batches={batches}
          />
        )}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="border-b border-white/10 px-5 py-5">
      <div className="flex items-center gap-3">
        <img
          src="/madhusatya-logo.svg"
          alt="HIVETRUST"
          className="h-11 w-11 rounded-xl bg-[var(--portal-canvas)] object-contain p-1"
        />
        <div>
          <p className="text-lg font-black leading-none">HIVETRUST</p>
          <p className="mt-1 text-[10px] text-amber-200">
            Truth behind every drop
          </p>
        </div>
      </div>
      <div className="mt-5 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-200">
        Customer • 2026
      </div>
    </div>
  );
}

function NavButton({ item, active, onClick, mobile = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active ? "bg-[var(--portal-accent)] text-[var(--portal-dark)] shadow-lg" : "text-amber-100/75 hover:bg-white/10 hover:text-white"} ${mobile ? "mb-1" : ""}`}
    >
      <span className="w-5 text-center text-base">{item.icon}</span>
      {item.label}
      {active && <ArrowRight className="ml-auto h-4 w-4" />}
    </button>
  );
}

function CustomerOverview({ name, onNavigate, onVerify, batches }) {
  const cards = [
    {
      label: "Verified batches",
      value: String(
        batches.filter(batch => batch.phase === "Verified").length
      ).padStart(2, "0"),
      description: "Traceable honey lots",
      icon: PackageCheck,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Traceability score",
      value: "98%",
      description: "Chain records verified",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "QR identities",
      value: String(batches.length).padStart(2, "0"),
      description: "Ready to scan",
      icon: QrCode,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Origin regions",
      value: String(
        new Set(batches.map(batch => batch.location)).size
      ).padStart(2, "0"),
      description: "Across India",
      icon: MapPin,
      color: "bg-sky-50 text-sky-700",
    },
  ];
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
      <section
        className="relative overflow-hidden rounded-[2rem] bg-[var(--portal-hero)] bg-cover bg-center p-7 text-white shadow-xl md:p-10"
        style={{
          backgroundImage: "url('/beekeeping-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[var(--portal-hero)]/75" />
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[48px] border-amber-300/10" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            Your honey intelligence
          </p>
          <h2 className="mt-4 text-4xl font-black leading-[1.02] md:text-6xl">
            Know every drop.
            <br />
            <span className="text-amber-400">Trust every jar.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
            {name
              ? `Welcome back, ${name}. `
              : "Welcome to your customer space. "}
            Explore verified origins, quality evidence, and the complete journey
            behind your honey.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("traceability")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-black text-[var(--portal-dark)] hover:bg-amber-300"
            >
              Explore my batches <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onVerify(batches[0]?.qr)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-black text-white hover:bg-white/15"
            >
              <ScanLine className="h-4 w-4" /> Verify honey
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 right-7 hidden w-64 lg:block">
          <img
            src="/honey-jar.jpg"
            alt="Honey quality"
            className="h-48 w-full rounded-t-[2rem] object-cover opacity-90"
          />
        </div>
      </section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, description, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-black text-slate-900">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                Recent honey activity
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Your trusted supply chain
              </h3>
            </div>
            <button
              onClick={() => onNavigate("traceability")}
              className="hidden text-sm font-black text-amber-800 sm:block"
            >
              View all batches →
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {batches.map((batch, index) => (
              <button
                key={batch.code}
                onClick={() => onNavigate("traceability")}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-[var(--portal-surface)] p-3 text-left transition hover:border-amber-300 hover:shadow-sm"
              >
                <img
                  src={
                    index === 0
                      ? "/honeycomb-detail.jpg"
                      : "/beekeeper-team.jpg"
                  }
                  alt="Honey provenance"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">{batch.code}</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-700">
                      {index === 0 ? "Verified" : "In progress"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {batch.quantity} · {batch.beekeeper} · {batch.location}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-700" />
              </button>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-[var(--portal-dark)] p-6 text-white shadow-sm">
          <img
            src="/beekeeper-team.jpg"
            alt="Honey traceability"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-amber-300">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">
                Why trust HIVETRUST?
              </p>
            </div>
            <h3 className="mt-5 text-2xl font-black">
              Transparency from hive to home.
            </h3>
            <div className="mt-6 space-y-4">
              {[
                [
                  ShieldCheck,
                  "Verified records",
                  "Every milestone is connected.",
                ],
                [QrCode, "Instant verification", "Scan a unique customer QR."],
                [
                  GitBranch,
                  "Open traceability",
                  "See the story behind your jar.",
                ],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-black">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-100/60">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TraceabilityWorkspace({
  selected,
  selectedCode,
  setSelectedCode,
  verificationUrl,
  customerToken,
  copyUrl,
  copied,
  onOpen,
  onNavigate,
  batches,
}) {
  const [qrImage, setQrImage] = useState(null);
  useEffect(() => {
    createQrDataUrl(verificationUrl)
      .then(setQrImage)
      .catch(() => setQrImage(null));
  }, [verificationUrl]);
  const details = [
    ["Quantity", selected.quantity],
    ["Harvest date", selected.harvest],
    ["Processing", selected.processing],
    ["Packaging", selected.packaging],
    ["Storage", selected.storage],
    ["Status", selected.phase],
  ];
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
      <section className="rounded-[2rem] bg-[var(--portal-hero)] p-7 text-white shadow-xl md:p-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Consumer verification
            </p>
            <h2 className="mt-3 text-4xl font-black">My honey batches</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Inspect the complete journey from harvest to verified consumer
              identity.
            </p>
          </div>
          <button
            onClick={() => onNavigate("dashboard")}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black hover:bg-white/15"
          >
            ← Overview
          </button>
        </div>
      </section>
      <section className="mt-6 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
              Batch registry
            </p>
            <h3 className="mt-2 text-2xl font-black">Select a honey batch</h3>
            <p className="mt-1 text-sm text-slate-500">
              Each batch has its own traceability record and customer QR
              identity.
            </p>
          </div>
          <select
            value={selectedCode}
            onChange={event => setSelectedCode(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[var(--portal-surface)] px-4 py-3.5 font-bold outline-none focus:border-amber-500 md:w-[360px]"
          >
            {batches.map(batch => (
              <option key={batch.code} value={batch.code}>
                {batch.code} · {batch.quantity}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <PackageCheck className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                Verified honey batch
              </p>
              <h3 className="text-2xl font-black">{selected.code}</h3>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-amber-100 bg-[var(--portal-surface)] p-4"
              >
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="mt-2 font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 font-black text-emerald-800">
              <ShieldCheck className="h-5 w-5" /> Blockchain protected
            </div>
            <p className="mt-2 text-sm text-emerald-700">
              Harvest, quality, and packaging events are linked to this verified
              batch.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-[var(--portal-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                Customer QR identity
              </p>
              <h3 className="mt-2 text-xl font-black">
                Scan to verify this jar
              </h3>
            </div>
            <QrCode className="h-9 w-9 text-amber-700" />
          </div>
          <div className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
            {qrImage ? (
              <img
                src={qrImage}
                alt={`Unique QR for ${customerToken}`}
                className="h-full w-full"
              />
            ) : (
              <QrCode className="h-16 w-16 text-slate-400" />
            )}
          </div>
          <p className="mt-4 break-all text-center text-xs font-black text-slate-600">
            {customerToken}
          </p>
          <div className="mt-4 flex gap-2">
            <input
              readOnly
              value={verificationUrl}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            />
            <button
              onClick={copyUrl}
              className="rounded-xl bg-[var(--portal-dark)] px-3 text-white"
            >
              <Clipboard className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {copied
              ? "Verification URL copied"
              : "This QR is unique to this customer and batch."}
          </p>
          <button
            onClick={onOpen}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--portal-accent)] px-4 py-3 font-black text-[var(--portal-dark)] hover:bg-amber-400"
          >
            Open verification page <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Info
          icon={MapPin}
          title="Registered beekeeper"
          body={`${selected.beekeeper} · ${selected.beekeeperCode} · ${selected.location}`}
        />
        <Info
          icon={Layers3}
          title="Hive information"
          body={`${selected.hive} · ${selected.species} · installed ${selected.installed}`}
        />
        <Info
          icon={Clock3}
          title="Traceability note"
          body="The record helps you understand provenance and chain-of-custody events."
        />
      </section>
    </main>
  );
}

function Info({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-amber-700" />
      <p className="mt-4 font-black">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
