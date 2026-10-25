import React, { useState } from 'react';
import { MuscleCategory } from '../../types/fitness';
import { WARMUP_COOLDOWN_GUIDES } from '../../data/exercisesData';
import { StreamlineIcon, StreamlineIconName } from '../ui/StreamlineIcon';

interface WarmupAndStretchingGuideProps {
  category?: MuscleCategory | 'glutes' | 'all';
  defaultOpen?: boolean;
}

export const WarmupAndStretchingGuide: React.FC<WarmupAndStretchingGuideProps> = ({
  category = 'lower-body',
}) => {
  const [activeTab, setActiveTab] = useState<'warmup' | 'stretching'>('warmup');
  const [selectedZone, setSelectedZone] = useState<string>(
    category === 'arms' ? 'arms' : category === 'back' ? 'back' : category === 'abs' ? 'abs' : category === 'cardio' ? 'cardio' : 'lower-body'
  );

  const currentGuide = WARMUP_COOLDOWN_GUIDES[selectedZone] || WARMUP_COOLDOWN_GUIDES['lower-body'];

  const zones: { id: string; label: string; icon: StreamlineIconName }[] = [
    { id: 'lower-body', label: 'Bas du corps & Quads', icon: 'kettlebell' },
    { id: 'glutes', label: 'Focus Fessiers', icon: 'kettlebell' },
    { id: 'back', label: 'Dos & Posture', icon: 'dumbbell' },
    { id: 'arms', label: 'Épaules & Bras', icon: 'biceps' },
    { id: 'abs', label: 'Abdos & Gainage', icon: 'stretch' },
    { id: 'cardio', label: 'Cardio & Fractionné', icon: 'runner' },
  ];

  return (
    <div className="rounded-[28px] bg-white border border-[#E6E2D8] p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#F5B8EE]">
        <div className="flex items-center gap-2">
          <StreamlineIcon name="stretch" className="w-5 h-5 text-[#EC4899] shrink-0" />
          <div>
            <h3 className="font-display font-semibold text-sm text-[#141414]">
              Échauffement & Étirements Spécifiques
            </h3>
            <p className="text-[11px] text-[#6E6A63]">
              Protégez vos articulations et accélérez votre récupération
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-full self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('warmup')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'warmup'
                ? 'bg-[#3B0726] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <StreamlineIcon name="runner" className="w-3.5 h-3.5 shrink-0" />
            <span>Échauffement (5-8 min)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stretching')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'stretching'
                ? 'bg-[#3B0726] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <StreamlineIcon name="stretch" className="w-3.5 h-3.5 shrink-0" />
            <span>Étirements Fin de séance</span>
          </button>
        </div>
      </div>

      {/* Zone Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => setSelectedZone(zone.id)}
            className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedZone === zone.id
                ? 'bg-[#F8A5F8] text-[#3B0726] border border-[#F8A5F8]'
                : 'bg-[#F2EFE9] text-neutral-600 hover:bg-[#EAE6DE]'
            }`}
          >
            <StreamlineIcon name={zone.icon} className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
            <span>{zone.label}</span>
          </button>
        ))}
      </div>

      {/* Routine Content */}
      <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E6E2D8]">
        {activeTab === 'warmup' ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#3B0726]">
              <span>Protocole d'activation dynamique avant la séance :</span>
              <span className="text-[10px] text-neutral-500 font-normal">À faire avant les premières charges</span>
            </div>
            <ol className="space-y-2">
              {currentGuide.warmup.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800">
                  <span className="w-5 h-5 rounded-full bg-[#F3E3F5] text-[#3B0726] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#3B0726]">
              <span>Retour au calme & Étirements passifs décompressants :</span>
              <span className="text-[10px] text-neutral-500 font-normal">Tenir chaque étirement sans à-coups</span>
            </div>
            <ol className="space-y-2">
              {currentGuide.cooldown.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
