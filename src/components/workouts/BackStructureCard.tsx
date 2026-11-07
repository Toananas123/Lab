import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { StreamlineIcon } from '../ui/StreamlineIcon';

export interface BackStructureStep {
  number: string;
  title: string;
  subtitle: string;
  rule: string;
  exercises: string[];
  badgeColor: string;
}

export const BACK_STRUCTURE_STEPS: BackStructureStep[] = [
  {
    number: '1',
    title: '1. MILIEU DU DOS',
    subtitle: 'choisis-en 1 ou 2 :',
    rule: 'Le point commun de tous ces exos, c’est que les coudes sont ouverts / hauts pour cibler le relief et le dessin du milieu du dos sans élargir la taille.',
    exercises: [
      'tirage horizontal prise large',
      'rowing prise large (libre ou smith)',
      'face pull (visant le menton)',
    ],
    badgeColor: 'bg-[#831843] text-white',
  },
  {
    number: '2',
    title: '2. GRAND DORSAL',
    subtitle: 'choisis-en 1 :',
    rule: 'C’est ces exos qui vont donner de la largeur au dos : on n’en choisit qu’un seul dans la séance pour tonifier sans élargir !',
    exercises: [
      'tirage vertical',
      'tirage horizontal prise serrée',
      'tractions',
      'pull-over',
      'tirage unilatéral',
      'tirage bûcheron',
    ],
    badgeColor: 'bg-[#9D174D] text-white',
  },
  {
    number: '3',
    title: '3. ARRIÈRE D’ÉPAULE',
    subtitle: 'choisis-en 1 :',
    rule: 'On enchaîne avec un exo pour l’arrière d’épaule afin de redresser la posture et dessiner le haut du dos.',
    exercises: [
      'oiseau inversé (Reverse Pec Deck)',
      'élévations arrières',
      'facepull (viser le front)',
    ],
    badgeColor: 'bg-[#BE185D] text-white',
  },
  {
    number: '4',
    title: '4. LOMBAIRES',
    subtitle: 'le seul et l’unique :',
    rule: 'Pour les lombaires, c’est le Back Extension : le seul et l’unique mouvement en fin de séance pour galber le bas du dos et la chute de reins.',
    exercises: ['BACK EXTENSION (Banc à lombaires 45°)'],
    badgeColor: 'bg-[#EC4899] text-white',
  },
];

interface BackStructureContentProps {
  onLaunchBackRoutine?: () => void;
}

export const BackStructureContent: React.FC<BackStructureContentProps> = ({
  onLaunchBackRoutine,
}) => (
  <div className="space-y-4">
    {/* Intro Tip Box */}
    <div className="p-3.5 rounded-2xl bg-[#FCE7F3]/75 border border-[#FBCFE8] flex items-start justify-between gap-3 flex-wrap">
      <div className="flex items-start gap-2.5 flex-1 min-w-[220px]">
        <Sparkles className="w-4 h-4 text-[#831843] shrink-0 mt-0.5" />
        <p className="text-xs text-[#4A1D35] leading-relaxed font-medium">
          <strong className="font-bold text-[#831843]">Tips pour un dos dessiné sans l’élargir :</strong>{' '}
          Respecte cet ordre précis en <strong>4 étapes</strong>. On met l’accent sur le{' '}
          <strong>milieu du dos</strong> (1 ou 2 exos coudes ouverts) et on limite le{' '}
          <strong>grand dorsal à 1 seul exercice</strong> pour sculpter les détails du dos tout en gardant la taille fine.
        </p>
      </div>
      {onLaunchBackRoutine && (
        <button
          type="button"
          onClick={onLaunchBackRoutine}
          className="px-4 py-2 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Lancer la séance Dos dans l’ordre (1-2-3-4)</span>
        </button>
      )}
    </div>

    {/* 4 Ordered Steps Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {BACK_STRUCTURE_STEPS.map((step) => (
        <div
          key={step.number}
          className="p-4 rounded-2xl bg-[#FAF5F8] border border-[#F2E3EC] flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-7 h-7 rounded-xl font-display font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs ${step.badgeColor}`}
                >
                  {step.number}
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#2B091C] leading-tight">
                    {step.title}
                  </h4>
                  <span className="text-[11px] font-extrabold text-[#831843]">
                    {step.subtitle}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#831843] border border-[#F3E5ED] text-[10px] font-bold">
                Étape {step.number}/4
              </span>
            </div>

            <p className="text-xs text-[#6E4F60] leading-relaxed">{step.rule}</p>
          </div>

          <div className="pt-2 border-t border-[#F0E0E9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D7E] block mb-1.5">
              Exercices au choix dans l’ordre :
            </span>
            <ul className="space-y-1">
              {step.exercises.map((ex) => (
                <li
                  key={ex}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#F0E0E9] text-[11px] font-bold text-[#4A1D35] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BackStructureCard: React.FC<BackStructureContentProps> = ({
  onLaunchBackRoutine,
}) => {
  return (
    <div className="rounded-[26px] bg-white border border-[#F3E5ED] shadow-2xs overflow-hidden p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0 shadow-2xs">
          <StreamlineIcon name="dumbbell" className="w-5 h-5" />
        </div>
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#831843] bg-[#FCE7F3] px-2.5 py-0.5 rounded-full mb-1">
            Guide anatomique · Dos dessiné
          </span>
          <h3 className="font-display font-bold text-sm sm:text-base text-[#2B091C] leading-snug">
            Tips pour un dos dessiné sans l’élargir
          </h3>
        </div>
      </div>

      <BackStructureContent onLaunchBackRoutine={onLaunchBackRoutine} />
    </div>
  );
};
