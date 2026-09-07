'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Compass,
  Zap,
  Star,
  Palette,
  Briefcase,
  User,
  ShoppingBag,
} from 'lucide-react';
import { TemplateDefinition } from '@/lib/templates/templateRegistry';

interface TemplateOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommended: (surveyAnswers: any) => void;
}

export function TemplateOnboardingModal({ isOpen, onClose, onSelectRecommended }: TemplateOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [doWhat, setDoWhat] = useState('Creator');
  const [goal, setGoal] = useState('Portfolio & Brand');
  const [style, setStyle] = useState('Modern');
  const [color, setColor] = useState('indigo');

  if (!isOpen) return null;

  const handleFinish = () => {
    onSelectRecommended({ doWhat, goal, style, color });
    onClose();
  };

  const professions = [
    'Creator',
    'YouTuber',
    'Streamer',
    'Photographer',
    'Developer',
    'Designer',
    'Writer',
    'Coach',
    'Musician',
    'Agency',
    'Business',
    'Other',
  ];

  const goals = [
    'Portfolio & Brand',
    'Sell Products & Presets',
    'Get Client Bookings',
    'Social Link-in-Bio',
    'Publish Blog & Articles',
    'Build Community',
  ];

  const styles = ['Modern', 'Minimal', 'Cyber', 'Luxury', 'Sunset', 'Elegant', 'Bold'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Smart Template Advisor</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4 • Customize your website match</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: What do you do? */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">What is your primary role / niche?</h4>
              <p className="text-xs text-slate-400">We will filter 65+ templates tailored to your work.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {professions.map((p) => (
                <button
                  key={p}
                  onClick={() => setDoWhat(p)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    doWhat === p
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Website Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">What do you want your website to do?</h4>
              <p className="text-xs text-slate-400">Select your primary conversion goal.</p>
            </div>

            <div className="space-y-2">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                    goal === g
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{g}</span>
                  {goal === g && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Style Preference */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Choose your visual aesthetic</h4>
              <p className="text-xs text-slate-400">Select layout mood and design vibe.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    style === s
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Generate Template Matches
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateOnboardingModal;
