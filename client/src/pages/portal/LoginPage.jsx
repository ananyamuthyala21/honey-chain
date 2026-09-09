import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Languages,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  UserRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../portal/i18n.jsx";

const ACCOUNTS_KEY = "madhusatya-accounts";
const normalize = value => value.trim().toLowerCase();
const readAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
};

export default function LoginPage({ onLogin, theme, onThemeChange }) {
  const { t, language, setLanguage, languages } = useLanguage();
  const [mode, setMode] = useState("signIn");
  const [role, setRole] = useState("beekeeper");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changeMode = next => {
    setMode(next);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };
  const submit = event => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const normalizedContact = normalize(contact);
    const accounts = readAccounts();
    if (!normalizedContact) return setError(t("contactRequired"));
    if (mode === "signUp") {
      if (!fullName.trim()) return setError(t("nameRequired"));
      if (password.length < 6) return setError(t("passwordLength"));
      if (password !== confirmPassword) return setError(t("passwordMismatch"));
      if (accounts.some(account => account.contact === normalizedContact))
        return setError(t("accountAlreadyExists"));
      const account = {
        id: crypto.randomUUID?.() || String(Date.now()),
        name: fullName.trim(),
        contact: normalizedContact,
        password,
        role,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify([...accounts, account])
      );
      setMode("signIn");
      setPassword("");
      setConfirmPassword("");
      setSuccess(t("accountCreated"));
      return;
    }
    const account = accounts.find(item => item.contact === normalizedContact);
    if (!account) return setError(t("accountNotFound"));
    if (account.password !== password) return setError(t("invalidCredentials"));
    onLogin({
      role: account.role,
      identifier: account.contact,
      name: account.name,
      authenticated: true,
    });
  };

  return (
    <div className="portal-shell min-h-screen bg-[var(--portal-dark)] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full border-[70px] border-amber-400/10" />
      <div className="absolute -bottom-48 -left-40 w-[32rem] h-[32rem] rounded-full border-[60px] border-yellow-300/10" />
      <div className="relative w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[var(--portal-panel)]/95">
        <section className="hidden lg:flex flex-col justify-between p-10 bg-[var(--portal-panel)] relative overflow-hidden">
          <img
            src="/beekeeping-hero.jpg"
            alt="Beekeeper inspecting a honeybee frame"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--portal-dark)]/90 via-[var(--portal-panel)]/55 to-[var(--portal-dark)]/75" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <Brand t={t} />
              <div className="mt-24 max-w-md">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-300 font-black">
                  {t("welcomeToTrust")}
                </p>
                <h1 className="text-5xl font-black leading-[1.02] mt-4">
                  {t("fromHiveToTrust")}
                </h1>
                <p className="text-amber-50/70 leading-relaxed mt-6">
                  {t("loginSubtitle")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-amber-100/70">
              <Mini label={t("iotMonitoring")} />
              <Mini label={t("aiInsights")} />
              <Mini label={t("qrTrust")} />
            </div>
          </div>
        </section>
        <section className="p-6 sm:p-10 bg-[var(--portal-surface)] text-slate-900">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="lg:hidden">
              <Brand t={t} />
            </div>
            <label className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-slate-600">
              <Languages className="w-4 h-4 text-amber-700" />
              <select
                aria-label={t("selectLanguage")}
                value={language}
                onChange={event => setLanguage(event.target.value)}
                className="rounded-xl border border-amber-200 bg-white px-3 py-2 outline-none"
              >
                {languages.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.nativeLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
            {t("secureAccess")}
          </p>
          <h2 className="text-3xl font-black mt-3">
            {mode === "signIn" ? t("welcomeBack") : t("createAccount")}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {mode === "signIn" ? t("signInSubtitle") : t("signUpSubtitle")}
          </p>
          <div className="grid grid-cols-2 gap-1 p-1 mt-6 rounded-xl bg-slate-100">
            <button
              type="button"
              onClick={() => changeMode("signIn")}
              className={`rounded-lg py-2.5 text-sm font-black ${mode === "signIn" ? "bg-white text-amber-800 shadow-sm" : "text-slate-500"}`}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => changeMode("signUp")}
              className={`rounded-lg py-2.5 text-sm font-black ${mode === "signUp" ? "bg-white text-amber-800 shadow-sm" : "text-slate-500"}`}
            >
              {t("signUp")}
            </button>
          </div>
          {mode === "signUp" && (
            <>
              <p className="text-sm font-black text-slate-700 mt-5">
                {t("registerAs")}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <RoleButton
                  active={role === "beekeeper"}
                  icon={UserRound}
                  label={t("beekeeper")}
                  onClick={() => setRole("beekeeper")}
                />
                <RoleButton
                  active={role === "customer"}
                  icon={QrCode}
                  label={t("customer")}
                  onClick={() => setRole("customer")}
                />
              </div>
            </>
          )}
          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {success}
            </div>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === "signUp" && (
              <label className="block text-sm font-bold">
                {t("fullName")}
                <input
                  required
                  value={fullName}
                  onChange={event => setFullName(event.target.value)}
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  placeholder={t("fullNamePlaceholder")}
                />
              </label>
            )}
            <label className="block text-sm font-bold">
              {t("emailOrPhone")}
              <input
                required
                value={contact}
                onChange={event => setContact(event.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="name@example.com / +91 98765 43210"
              />
            </label>
            <PasswordInput
              label={t("password")}
              value={password}
              onChange={setPassword}
              show={showPassword}
              setShow={setShowPassword}
              t={t}
            />
            {mode === "signUp" && (
              <PasswordInput
                label={t("confirmPassword")}
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showPassword}
                setShow={setShowPassword}
                t={t}
              />
            )}
            <button
              className="w-full rounded-xl bg-[var(--portal-accent)] px-4 py-3.5 font-black text-[var(--portal-dark)] shadow-lg hover:bg-[var(--portal-accent-hover)] transition flex items-center justify-center gap-2"
              type="submit"
            >
              {mode === "signIn"
                ? t("signInToContinue")
                : t("createAccountButton")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-5">
            {mode === "signIn" ? t("noAccount") : t("alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={() =>
                changeMode(mode === "signIn" ? "signUp" : "signIn")
              }
              className="font-black text-amber-800 hover:underline"
            >
              {mode === "signIn" ? t("signUp") : t("signIn")}
            </button>
          </p>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t("loginPrivacy")}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
function Brand({ t }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/madhusatya-logo.svg"
        alt="HIVETRUST"
        className="w-14 h-14 rounded-2xl bg-white p-1 object-contain"
      />
      <div>
        <p className="text-xl font-black">HIVETRUST</p>
        <p className="text-xs text-amber-300">{t("truthTagline")}</p>
      </div>
    </div>
  );
}
function PasswordInput({ label, value, onChange, show, setShow, t }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <div className="relative mt-2">
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={event => onChange(event.target.value)}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          placeholder="••••••••"
        />
        <button
          type="button"
          aria-label={show ? t("hidePassword") : t("showPassword")}
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </label>
  );
}
function RoleButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${active ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-amber-300"}`}
    >
      <Icon className="w-5 h-5 mb-3" />
      <span className="block text-sm font-black">{label}</span>
    </button>
  );
}
function Mini({ label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <LockKeyhole className="w-4 h-4 text-amber-300 mb-2" />
      <span>{label}</span>
    </div>
  );
}
