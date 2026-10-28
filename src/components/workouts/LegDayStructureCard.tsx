import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface LegDayStructureCardProps {
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

export const LEG_DAY_STRUCTURE_STEPS = [
  {
    num: 1,
    type: "1 ou 2 exercices d'étirement",
    examples: 'RDL, squat, leg press, fentes bulgares, step-ups',
    tag: 'Étirement sous tension',
  },
  {
    num: 2,
    type: '1 exercice de contraction',
    examples: 'hip thrust, KAS glute bridge, back extension',
    tag: 'Pic de contraction',
  },
  {
    num: 3,
    type: '1 exercice unilatéraux',
    examples: 'fentes (bulgares/marchées/ arrières...), single leg press, single leg RDL',
    tag: 'Équilibre & symétrie',
  },
  {
    num: 4,
    type: "1 ou 2 exercice d'isolation",
    examples: 'leg curl, leg extension, kick back, abductions',
    tag: 'Brûlure & finition',
  },
];

export const LegDayStructureContent: React.FC = () => {
  return (
    <div className="space-y-2.5 pt-2">
      {LEG_DAY_STRUCTURE_STEPS.map((s) => (
        <div
          key={s.num}
          className="p-3 rounded-2xl bg-white border border-[#F2E4EC] shadow-2xs flex items-start gap-2.5 transition-all"
        >
          <span className="w-6 h-6 rounded-full bg-[#831843] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            {s.num}
          </span>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-display font-bold text-xs text-[#2B091C]">
                {s.num} - {s.type} :
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#831843]">
                {s.tag}
              </span>
            </div>
            <p className="text-[11px] text-[#7A616F] font-medium leading-relaxed">
              {s.examples}
            </p>
          </div>
        </div>
      ))}

      <div className="p-2.5 rounded-xl bg-white/80 text-[11px] text-[#831843] font-semibold flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
        <span>Applique cet ordre pour maximiser tes gains fessiers & cuisses !</span>
      </div>
    </div>
  );
};

export const LegDayStructureCard: React.FC<LegDayStructureCardProps> = ({
  defaultExpanded = false,
  collapsible = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`rounded-[26px] bg-[#F6EDF2] border border-[#FBCFE8] overflow-hidden transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => collapsible && setIsExpanded((prev) => !prev)}
        className={`w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left transition-colors ${
          collapsible ? 'hover:bg-[#F1E2EA] cursor-pointer' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
            <StreamlineIcon name="weightlifter" className="w-5 h-5 text-[#EC4899]" />
          </div>
          <div className="min-w-0">
            <span className="font-compact text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
              Guide intégré · Bas du corps
            </span>
            <h2 className="font-display font-bold text-xs sm:text-sm text-[#2B091C] leading-snug">
              Comment structurer son leg day ?
            </h2>
          </div>
        </div>

        {collapsible && (
          <span className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shrink-0 shadow-2xs">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#F1E4EC] animate-in fade-in duration-150">
          <LegDayStructureContent />
        </div>
      )}
    </div>
  );
};
