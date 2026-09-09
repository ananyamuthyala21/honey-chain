import React, { useState } from "react";
import { ArrowRight, LogOut, QrCode, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../portal/i18n.jsx";

export default function CustomerPortal({ onVerify, onLogout }) {
  const { t } = useLanguage();
  const [token, setToken] = useState("");
  return (
    <div className="portal-shell min-h-screen bg-[var(--portal-canvas)] text-slate-900 flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full rounded-[2rem] bg-white border border-amber-100 shadow-xl overflow-hidden">
        <div className="bg-[var(--portal-dark)] text-white p-7 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-8 h-8 text-amber-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  {t("customerPortal")}
                </p>
                <h1 className="text-2xl font-black mt-1">
                  {t("verifyProduct")}
                </h1>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </button>
          </div>
        </div>
        <div className="p-7 md:p-10">
          <p className="text-sm text-slate-600 leading-relaxed">
            {t("customerPortalSubtitle")}
          </p>
          <form
            className="mt-7"
            onSubmit={event => {
              event.preventDefault();
              if (token.trim()) onVerify(token.trim());
            }}
          >
            <label className="block text-sm font-black">
              {t("qrTokenLabel")}
              <input
                value={token}
                onChange={event => setToken(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="Paste QR token"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-[var(--portal-accent)] text-[var(--portal-dark)] px-4 py-3.5 font-black flex items-center justify-center gap-2 hover:bg-[var(--portal-accent-hover)]"
            >
              <ShieldCheck className="w-5 h-5" />
              {t("verifyProduct")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800">
            <strong>{t("tip")}</strong> {t("customerTip")}
          </div>
        </div>
      </div>
    </div>
  );
}
