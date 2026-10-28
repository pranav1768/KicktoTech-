"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, HeartHandshake, HelpCircle, CheckSquare, Square, Languages, Sparkles } from "lucide-react";
import type { PatientTranslation } from "@/app/api/analyze/route";

interface BilingualReportCardProps {
  translation: PatientTranslation;
  primaryFinding: string;
  triageUrgency: "CRITICAL" | "ELEVATED" | "ROUTINE";
}

export function BilingualReportCard({
  translation,
  primaryFinding,
  triageUrgency,
}: BilingualReportCardProps) {
  const [activeLang, setActiveLang] = useState<"en" | "mr" | "hi">("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({ 0: true });

  const languageMeta = {
    en: {
      label: "English (EN)",
      badge: "Patient-Friendly English",
      voiceLang: "en-IN",
      text: translation.summary_english,
    },
    mr: {
      label: "मराठी (Marathi)",
      badge: "रुग्णांसाठी सोप्या भाषेत (मराठी)",
      voiceLang: "mr-IN",
      text: translation.summary_marathi,
    },
    hi: {
      label: "हिंदी (Hindi)",
      badge: "रोगी के लिए सरल सारांश (हिंदी)",
      voiceLang: "hi-IN",
      text: translation.summary_hindi,
    },
  };

  const handleSpeak = (langKey: "en" | "mr" | "hi") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(languageMeta[langKey].text);
    utterance.lang = languageMeta[langKey].voiceLang;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleQuestion = (idx: number) => {
    setCheckedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4">
      {/* Header & Language Switcher + Speech Synthesis */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/75 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Patient Empathy Co-Pilot (EN / मराठी / हिंदी)
              </h3>
              <p className="text-xs text-slate-400">
                Compassionate, jargon-free clinical translation with native speech synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {(["en", "mr", "hi"] as const).map((langKey) => (
              <button
                key={langKey}
                type="button"
                onClick={() => {
                  if (isSpeaking && typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setActiveLang(langKey);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  activeLang === langKey
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                    : "bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {languageMeta[langKey].label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleSpeak(activeLang)}
              className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                isSpeaking
                  ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                  : "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border-cyan-500/30"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  Listen ({activeLang.toUpperCase()})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Language Highlight Card */}
        <div className="mt-4 rounded-xl bg-slate-950/90 border border-slate-800/90 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              {languageMeta[activeLang].badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
               Urgency: {triageUrgency}
            </span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed font-normal">
            {languageMeta[activeLang].text}
          </p>
        </div>

        {/* Trilingual Side-by-Side Reference Grid */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(["en", "mr", "hi"] as const).map((langKey) => (
            <div
              key={langKey}
              onClick={() => setActiveLang(langKey)}
              className={`cursor-pointer rounded-lg p-3 border transition ${
                activeLang === langKey
                  ? "bg-slate-900/95 border-emerald-500/40"
                  : "bg-slate-950/60 border-slate-800/70 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-300">
                  {languageMeta[langKey].label}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {activeLang === langKey ? "ACTIVE" : "VIEW"}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {languageMeta[langKey].text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comforting Clinical Analogy */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1.5">
          <Sparkles className="w-4 h-4" />
          Comforting Everyday Analogy
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {translation.comforting_analogy}
        </p>
      </div>

      {/* Questions for Your Doctor Checklist */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Recommended Questions for Your Doctor
        </div>
        <div className="space-y-2">
          {translation.questions_for_doctor.map((q, idx) => {
            const isChecked = !!checkedQuestions[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleQuestion(idx)}
                className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className={`text-xs leading-relaxed ${isChecked ? "text-slate-100 font-medium" : "text-slate-300"}`}>
                  {q}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
