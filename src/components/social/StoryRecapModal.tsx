import React, { useState } from 'react';
import { Download, Share2, Check, EyeOff, Eye, Sparkles } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { AppLogo } from '../ui/AppLogo';
import { Workout } from '../../types/fitness';
import { useSocial } from '../../context/SocialContext';

interface StoryRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout?: Workout | null;
}

export const StoryRecapModal: React.FC<StoryRecapModalProps> = ({
  isOpen,
  onClose,
  workout,
}) => {
  const { mySocialProfile, shareWorkoutToFeed } = useSocial();
  const [hideWeightsOnCard, setHideWeightsOnCard] = useState(mySocialProfile.hideWeights);
  const [themeVariant, setThemeVariant] = useState<'berry' | 'blush' | 'night'>('berry');
  const [copiedOrSaved, setCopiedOrSaved] = useState<string | null>(null);

  const sampleWorkout: Workout = workout || {
    id: 'story-preview',
    userId: 'me',
    name: 'Booty Sculpt & Hypertrophie',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    durationMinutes: 48,
    finisher: 'Marche inclinée 12% · 15 min',
    exercises: [
      {
        id: 'e1',
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Soulevé de terre roumain (RDL)',
        category: 'lower-body',
        equipment: 'barbell',
        restSeconds: 120,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 60, completed: true },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 60, completed: true },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 65, completed: true },
        ],
      },
      {
        id: 'e2',
        exerciseId: 'hip-thrust-barbell',
        exerciseName: 'Hip Thrust à la barre',
        category: 'lower-body',
        equipment: 'barbell',
        restSeconds: 120,
        sets: [
          { id: 's4', setNumber: 1, targetReps: 10, targetWeight: 90, completed: true },
          { id: 's5', setNumber: 2, targetReps: 8, targetWeight: 95, completed: true, isPR: true },
          { id: 's6', setNumber: 3, targetReps: 8, targetWeight: 95, completed: true },
        ],
      },
      {
        id: 'e3',
        exerciseId: 'bulgarian-split-squat',
        exerciseName: 'Fentes bulgares aux haltères',
        category: 'lower-body',
        equipment: 'dumbbell',
        restSeconds: 90,
        sets: [
          { id: 's7', setNumber: 1, targetReps: 10, targetWeight: 16, completed: true },
          { id: 's8', setNumber: 2, targetReps: 10, targetWeight: 16, completed: true },
          { id: 's9', setNumber: 3, targetReps: 10, targetWeight: 16, completed: true },
        ],
      },
      {
        id: 'e4',
        exerciseId: 'cable-glute-kickback',
        exerciseName: 'Kick-back fessiers à la poulie',
        category: 'lower-body',
        equipment: 'cable',
        restSeconds: 60,
        sets: [
          { id: 's10', setNumber: 1, targetReps: 15, targetWeight: 17.5, completed: true },
          { id: 's11', setNumber: 2, targetReps: 15, targetWeight: 17.5, completed: true },
          { id: 's12', setNumber: 3, targetReps: 15, targetWeight: 17.5, completed: true },
        ],
      },
    ],
  };

  const exercisesList = sampleWorkout.exercises.slice(0, 4);

  const handleDownloadStoryImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    if (themeVariant === 'berry') {
      grad.addColorStop(0, '#831843');
      grad.addColorStop(0.5, '#500724');
      grad.addColorStop(1, '#2B091C');
    } else if (themeVariant === 'blush') {
      grad.addColorStop(0, '#FCE7F3');
      grad.addColorStop(0.5, '#FBCFE8');
      grad.addColorStop(1, '#F472B6');
    } else {
      grad.addColorStop(0, '#180413');
      grad.addColorStop(1, '#380A28');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    const isLight = themeVariant === 'blush';
    ctx.fillStyle = isLight ? '#831843' : '#FBCFE8';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('GLOW UP LAB · RÉCAP SÉANCE', 90, 170);

    ctx.fillStyle = isLight ? '#2B091C' : '#FFFFFF';
    ctx.font = 'bold 68px sans-serif';
    ctx.fillText(sampleWorkout.name.slice(0, 28), 90, 280);

    ctx.fillStyle = isLight ? '#5C3A4D' : '#FBCFE8';
    ctx.font = '600 36px sans-serif';
    ctx.fillText(
      `${sampleWorkout.durationMinutes || 45} min · ${exercisesList.length} exercices · ${mySocialProfile.handle}`,
      90,
      355
    );

    exercisesList.forEach((ex, idx) => {
      const y = 470 + idx * 250;
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.roundRect(90, y, 900, 210, 42);
      ctx.fill();

      ctx.fillStyle = isLight ? '#831843' : '#F472B6';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(`EXERCICE ${idx + 1}`, 140, y + 68);

      ctx.fillStyle = isLight ? '#2B091C' : '#FFFFFF';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(ex.exerciseName.slice(0, 32), 140, y + 125);

      const maxWeight = ex.sets.reduce((m, s) => Math.max(m, s.actualWeight ?? s.targetWeight ?? 0), 0);
      const reps = ex.sets[0]?.actualReps || ex.sets[0]?.targetReps || 10;
      const metaText = hideWeightsOnCard
        ? `${ex.sets.length} séries × ${reps} reps · Charge masquée`
        : `${ex.sets.length} séries × ${reps} reps · Top set : ${maxWeight} kg`;

      ctx.fillStyle = isLight ? '#5C3A4D' : '#FBCFE8';
      ctx.font = '600 32px sans-serif';
      ctx.fillText(metaText, 140, y + 175);
    });

    ctx.fillStyle = isLight ? '#831843' : '#FBCFE8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Planifie · Entraîne-toi · Progresse 🌸', 90, 1780);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `glow-up-lab-story-${sampleWorkout.date}.png`;
    a.click();

    setCopiedOrSaved('Image Story téléchargée en HD !');
    setTimeout(() => setCopiedOrSaved(null), 3000);
  };

  const handlePublishToClub = () => {
    shareWorkoutToFeed(sampleWorkout);
    setCopiedOrSaved('Récap publié dans le fil d’activité du Club !');
    setTimeout(() => {
      setCopiedOrSaved(null);
      onClose();
    }, 1500);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Carte Récap pour Story Instagram"
      subtitle="Génère ta carte 9:16 au design Glow Up Lab"
    >
      <div className="space-y-4">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F6EDF2] p-3 rounded-2xl">
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: 'berry', label: 'Bordeaux' },
                { id: 'blush', label: 'Rose Poudré' },
                { id: 'night', label: 'Nuit Intense' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeVariant(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  themeVariant === t.id
                    ? 'bg-[#831843] text-white shadow-2xs'
                    : 'bg-white text-[#7A616F] hover:text-[#2B091C]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setHideWeightsOnCard((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              hideWeightsOnCard
                ? 'bg-[#831843] text-white'
                : 'bg-white text-[#831843] border border-[#FBCFE8]'
            }`}
          >
            {hideWeightsOnCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideWeightsOnCard ? 'Charges masquées' : 'Charges visibles'}</span>
          </button>
        </div>

        {/* 9:16 Story Card Preview */}
        <div className="flex justify-center">
          <div
            className={`w-full max-w-[320px] aspect-[9/15] rounded-[32px] p-5 flex flex-col justify-between shadow-xl border relative overflow-hidden ${
              themeVariant === 'berry'
                ? 'bg-gradient-to-br from-[#831843] via-[#500724] to-[#2B091C] text-white border-[#F472B6]/30'
                : themeVariant === 'blush'
                ? 'bg-grainy-pink text-[#2B091C] border-[#F472B6]/40'
                : 'bg-gradient-to-b from-[#180413] to-[#380A28] text-white border-[#EC4899]/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-2xs">
                  <AppLogo size={32} variant="badge" />
                </span>
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block leading-none ${
                      themeVariant === 'blush' ? 'text-[#831843]' : 'text-[#FBCFE8]'
                    }`}
                  >
                    Glow Up Lab
                  </span>
                  <span className="text-xs font-bold">{mySocialProfile.handle}</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                  themeVariant === 'blush'
                    ? 'bg-white/80 text-[#831843]'
                    : 'bg-white/15 text-[#FBCFE8]'
                }`}
              >
                {sampleWorkout.durationMinutes || 45} min
              </span>
            </div>

            {/* Workout Title & Exercises */}
            <div className="space-y-2.5 my-auto py-3">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                    themeVariant === 'blush' ? 'text-[#831843]' : 'text-[#F472B6]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> Séance validée
                </span>
                <h4 className="font-display font-extrabold text-lg leading-tight mt-0.5">
                  {sampleWorkout.name}
                </h4>
              </div>

              <div className="space-y-1.5">
                {exercisesList.map((ex, idx) => {
                  const maxW = ex.sets.reduce(
                    (m, s) => Math.max(m, s.actualWeight ?? s.targetWeight ?? 0),
                    0
                  );
                  const reps = ex.sets[0]?.actualReps || ex.sets[0]?.targetReps || 10;
                  return (
                    <div
                      key={ex.id || idx}
                      className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 ${
                        themeVariant === 'blush'
                          ? 'bg-white/85 border border-white'
                          : 'bg-white/10 backdrop-blur-xs border border-white/10'
                      }`}
                    >
                      <div className="min-w-0">
                        <span
                          className={`text-[10px] font-bold block ${
                            themeVariant === 'blush' ? 'text-[#831843]' : 'text-[#FBCFE8]'
                          }`}
                        >
                          {idx + 1}. {ex.exerciseName}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-semibold ${
                            themeVariant === 'blush' ? 'text-[#5C3A4D]' : 'text-white/80'
                          }`}
                        >
                          {ex.sets.length} séries × {reps} reps
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-xl text-[11px] font-mono font-bold shrink-0 ${
                          themeVariant === 'blush'
                            ? 'bg-[#FCE7F3] text-[#831843]'
                            : 'bg-white/15 text-white'
                        }`}
                      >
                        {hideWeightsOnCard ? '🔒 Secret' : `${maxW} kg`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-semibold opacity-85">
              <span>Planifie · Entraîne-toi · Progresse</span>
              <span>Code : {mySocialProfile.friendCode}</span>
            </div>
          </div>
        </div>

        {copiedOrSaved && (
          <div className="p-3 rounded-2xl bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{copiedOrSaved}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownloadStoryImage}
            className="w-full py-3 px-4 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger pour Story Insta (PNG)</span>
          </button>
          <button
            type="button"
            onClick={handlePublishToClub}
            className="w-full py-3 px-4 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Publier dans le Fil des amies</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
