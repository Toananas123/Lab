import React from 'react';
import { Backpack, Sparkles, Check } from 'lucide-react';
import { getExercisePersonalGear, getWorkoutPersonalGear, PersonalGearItem } from '../../utils/personalGear';

interface PersonalGearReminderProps {
  exercise?: {
    id?: string;
    name?: string;
    equipment?: string;
    primaryMuscle?: string;
    category?: string;
  };
  exercises?: {
    exerciseId?: string;
    id?: string;
    exerciseName?: string;
    name?: string;
    equipment?: string;
    category?: string;
  }[];
  variant?: 'card' | 'banner' | 'pill-list' | 'detail';
  title?: string;
  className?: string;
}

export const PersonalGearReminder: React.FC<PersonalGearReminderProps> = ({
  exercise,
  exercises,
  variant = 'card',
  title,
  className = '',
}) => {
  const items: PersonalGearItem[] = exercises
    ? getWorkoutPersonalGear(exercises)
    : exercise
    ? getExercisePersonalGear(exercise)
    : [];

  if (items.length === 0) return null;

  if (variant === 'pill-list') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        <span className="text-[11px] font-bold text-[#831843] flex items-center gap-1 shrink-0">
          <Backpack className="w-3.5 h-3.5" />
          <span>Matériel :</span>
        </span>
        {items.map((it) => (
          <span
            key={it.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[#831843] text-[11px] font-semibold"
            title={it.tip}
          >
            <span>{it.icon}</span>
            <span>{it.shortLabel}</span>
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#FCE7F3] border border-[#FBCFE8] p-3.5 flex items-start gap-3 shadow-2xs ${className}`}
      >
        <div className="w-9 h-9 rounded-xl bg-[#831843] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Backpack className="w-4 h-4 text-[#FBCFE8]" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display font-bold text-xs text-[#2B091C]">
              {title || 'Pense à prendre ton matériel avant de démarrer !'}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#831843] shrink-0">
              {items.length} {items.length > 1 ? 'équipements' : 'équipement'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {items.map((it) => (
              <span
                key={it.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#2B091C] text-[11px] font-semibold shadow-2xs"
              >
                <span>{it.icon}</span>
                <span className="font-bold text-[#831843]">{it.shortLabel}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Variant 'detail' or 'card'
  return (
    <div
      className={`rounded-[26px] bg-white border border-[#F6EDF2] p-4 sm:p-5 shadow-2xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0">
            <Backpack className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm text-[#2B091C]">
            {title || 'Matériel personnel à prévoir'}
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[11px] font-semibold text-[#831843]">
          À emporter
        </span>
      </div>

      <div className="divide-y divide-[#F6EDF2] text-xs">
        {items.map((it) => (
          <div key={it.id} className="py-2.5 flex items-start gap-2.5">
            <span className="text-base shrink-0 mt-0.5">{it.icon}</span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#2B091C]">{it.name}</span>
                <span className="text-[10px] font-semibold text-[#831843] bg-[#FCE7F3] px-2 py-0.5 rounded-full shrink-0">
                  {it.reason}
                </span>
              </div>
              <p className="text-[#7A616F] text-[11px] leading-relaxed">{it.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#831843] font-medium bg-[#FFF5F8] p-2.5 rounded-xl">
        <Sparkles className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
        <span>Glisse ce matériel dans ton sac pour être 100% autonome et performante !</span>
      </div>
    </div>
  );
};
