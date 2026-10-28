import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Star,
  Plus,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Exercise } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { getEquipmentBadge } from '../../utils/equipmentBadge';
import { StreamlineIcon, getCategoryStreamlineIcon } from '../ui/StreamlineIcon';
import { MachineIllustration } from './MachineIllustration';
import { PersonalGearReminder } from '../common/PersonalGearReminder';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLegPressGuide?: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onOpenLegPressGuide,
  onAddToWorkout,
}) => {
  const {
    isFavorite,
    toggleFavorite,
    getPreviousPerformance,
    exerciseSettings,
    updateExerciseSettings,
  } = useWorkout();

  const [customSettings, setCustomSettings] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (exercise && exerciseSettings[exercise.id]) {
      setCustomSettings(exerciseSettings[exercise.id]);
    } else {
      setCustomSettings('');
    }
    setSettingsSaved(false);
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [exercise, exerciseSettings, isOpen]);

  if (!isOpen || !exercise) return null;

  const fav = isFavorite(exercise.id);
  const prevPerf = getPreviousPerformance(exercise.id);
  const equipBadge = getEquipmentBadge(exercise.equipment);

  const handleSaveSettings = async () => {
    if (!exercise) return;
    await updateExerciseSettings(exercise.id, customSettings.trim());
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const mistakes = [
    ...(exercise.avoidTips || []),
    ...(exercise.commonMistakes || []),
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#2B091C]/45 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] rounded-t-[36px] sm:rounded-[36px] bg-[#F6EDF2] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white text-[#2B091C] flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
            aria-label="Retour"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-3.5 py-1.5 rounded-full bg-white shadow-2xs flex items-center gap-2 text-xs font-semibold text-[#2B091C]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
            <span>
              {exercise.primaryMuscle} · {equipBadge.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(exercise.id)}
            className="w-10 h-10 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs active:scale-95 transition-transform"
            aria-label="Favori"
          >
            <Star className={`w-4 h-4 ${fav ? 'fill-[#EC4899] text-[#EC4899]' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
          {/* Center Hero Visual + Centered Title */}
          <div className="text-center space-y-3 py-2">
            <div className="w-20 h-20 rounded-[26px] bg-white shadow-md mx-auto flex items-center justify-center text-[#831843]">
              <StreamlineIcon
                name={getCategoryStreamlineIcon(exercise.category)}
                className="w-10 h-10 text-[#EC4899]"
              />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="font-display font-bold text-2xl text-[#2B091C] leading-tight">
                {exercise.name}
              </h2>
              <p className="text-xs text-[#7A616F] leading-relaxed">
                {exercise.description}
              </p>
            </div>
          </div>

          {/* Dedicated Section: Image de la machine */}
          <MachineIllustration exercise={exercise} variant="section" />

          {/* Card 1: Repères & Réglages (Clean White Grouped Card with Hairline Dividers) */}
          <div className="rounded-[28px] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#2B091C]">
                Repères & Charge
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6EDF2] text-[11px] font-semibold text-[#7A616F]">
                Objectif
              </span>
            </div>

            <div className="divide-y divide-[#F6EDF2] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#7A616F]">Dernière charge validée</span>
                <span className="font-mono font-bold text-[#2B091C] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  {prevPerf ? `${prevPerf.weight} kg (${prevPerf.reps} reps)` : 'Non renseignée'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#7A616F]">Séries × Répétitions</span>
                <span className="font-mono font-bold text-[#2B091C]">
                  {exercise.defaultSets} × {exercise.defaultReps}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#7A616F]">Temps de repos conseillé</span>
                <span className="font-mono font-bold text-[#2B091C]">
                  {exercise.defaultRestSeconds} sec
                </span>
              </div>
            </div>

            {/* Machine custom settings input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customSettings}
                onChange={(e) => setCustomSettings(e.target.value)}
                placeholder="Mes réglages (ex: siège 4, poulie basse...)"
                className="flex-1 px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] text-[#2B091C] placeholder:text-[#8C6D7E] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2.5 rounded-2xl bg-[#831843] text-white font-semibold text-xs shrink-0 flex items-center gap-1"
              >
                {settingsSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{settingsSaved ? 'OK' : 'Noter'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Points clés & Exécution (Positives style from reference image) */}
          <div className="rounded-[28px] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#2B091C]">
                Exécution
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6EDF2] text-[11px] font-semibold text-[#831843]">
                Posture
              </span>
            </div>

            <div className="divide-y divide-[#F6EDF2] text-xs">
              {exercise.startingPosition && (
                <div className="py-2.5 space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-[#2B091C]">
                    <span>Position de départ</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[#7A616F] leading-relaxed">{exercise.startingPosition}</p>
                </div>
              )}

              {exercise.steps.map((step, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#2B091C] block">
                      Étape {idx + 1}
                    </span>
                    <p className="text-[#7A616F] leading-relaxed">{step}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Erreurs à éviter (Negatives style from reference image) */}
          {mistakes.length > 0 && (
            <div className="rounded-[28px] bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#2B091C]">
                  Erreurs à éviter
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[11px] font-semibold text-[#EC4899]">
                  Attention
                </span>
              </div>

              <div className="divide-y divide-[#F6EDF2] text-xs">
                {mistakes.map((mistake, idx) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                    <p className="text-[#2B091C] leading-relaxed">{mistake}</p>
                    <span className="w-2 h-2 rounded-full bg-[#EC4899] shrink-0 mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encart Matériel personnel à ne pas oublier */}
          <PersonalGearReminder exercise={exercise} variant="detail" />

          {exercise.hasFootPlacementGuide && onOpenLegPressGuide && (
            <button
              type="button"
              onClick={onOpenLegPressGuide}
              className="w-full p-4 rounded-[24px] bg-white text-[#831843] font-bold text-xs flex items-center justify-between shadow-2xs"
            >
              <span>Voir le guide des 7 positions de pieds à la presse</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Sticky Bottom CTA */}
        {onAddToWorkout && (
          <div className="p-4 bg-white border-t border-[#F1E4EC] shrink-0">
            <button
              type="button"
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="w-full py-3.5 px-5 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter à ma séance</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
