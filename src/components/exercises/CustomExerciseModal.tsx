import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import {
  EquipmentType,
  SpecificMuscleGroup,
  SPECIFIC_MUSCLE_GROUPS,
  Exercise,
} from '../../types/fitness';

type MachineSetupData = NonNullable<Exercise['machineSetup']>;
import { useWorkout } from '../../context/WorkoutContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface CustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  onExerciseCreated?: (exercise: Exercise) => void;
}

export function buildAutoExerciseSheet(
  rawName: string,
  specificMuscle: SpecificMuscleGroup,
  equipment: EquipmentType,
  customDesc?: string,
  customTip?: string
): {
  description: string;
  startingPosition: string;
  steps: string[];
  breathing: string;
  formTips: string[];
  commonMistakes: string[];
  avoidTips: string[];
  machineSetup: MachineSetupData;
} {
  const cleanName = rawName.trim() || 'Mon Exercice';
  const meta =
    SPECIFIC_MUSCLE_GROUPS.find((m) => m.id === specificMuscle) || SPECIFIC_MUSCLE_GROUPS[0];
  const muscleLabel = meta.label.replace(/^\d+\.\s*/, '');

  const equipmentLabels: Record<EquipmentType, string> = {
    dumbbell: 'aux haltères',
    barbell: 'à la barre / Smith Machine',
    machine: 'sur machine guidée',
    cable: 'à la poulie (câble)',
    bodyweight: 'au poids du corps',
    cardio_machine: 'sur machine cardio',
  };

  const eqText = equipmentLabels[equipment] || 'avec contrôle';

  // Determine diagramType based on category/equipment
  let diagramType: MachineSetupData['diagramType'] = 'bench_flat';
  if (equipment === 'cable') {
    diagramType = meta.category === 'lower-body' ? 'cable_low' : 'cable_high';
  } else if (equipment === 'machine') {
    if (meta.category === 'lower-body') {
      diagramType = 'leg_press';
    } else if (meta.category === 'back') {
      diagramType = 'seated_row';
    } else {
      diagramType = 'bench_incline';
    }
  } else if (equipment === 'barbell') {
    diagramType = specificMuscle === 'fessiers' ? 'bench_flat' : 'squat_rack';
  } else if (equipment === 'bodyweight' || equipment === 'cardio_machine') {
    diagramType = 'standing_free';
  }

  // Starting position tailored to equipment & category
  let startingPosition = `Installe-toi de manière stable ${eqText}, les pieds bien ancrés au sol, la sangle abdominale engagée (côtes basses) et les épaules basses loin des oreilles.`;
  if (meta.category === 'back') {
    startingPosition = `En position stable ${eqText}, buste fier, omoplates prêtes à coulisser sans hausser les trapèzes supérieurs, prise ferme centrée sur l'engagement de : ${muscleLabel}.`;
  } else if (meta.category === 'pecs') {
    startingPosition = `Installée ${eqText}, omoplates resserrées et abaissées contre le dossier ou le banc, légère cambrure naturelle, poignets alignés avec les avant-bras.`;
  } else if (meta.category === 'lower-body') {
    startingPosition = `Pieds ancrés avec stabilité ${eqText}, bassin neutre, abdos gainés et regard fixe vers l'avant pour isoler ${muscleLabel.toLowerCase()}.`;
  }

  // 4 complete execution steps like native exercises
  const steps: string[] = [
    `Mise en place : Prends position pour « ${cleanName} » (${eqText}) en vérifiant ton alignement articulaire et ton gainage abdominal.`,
    `Phase concentrique (Effort) : Initie le mouvement directement par la contraction de ${muscleLabel.toLowerCase()} sans donner d'élan avec le reste du corps.`,
    `Contraction au sommet : Maintiens 1 seconde de contraction volontaire au pic du mouvement pour maximiser le recrutement musculaire.`,
    `Phase excentrique (Retour) : Redescends ou accompagne la charge sur 2 à 3 secondes en contrôlant toute l'amplitude et l'étirement.`,
  ];

  const breathing =
    meta.category === 'cardio'
      ? 'Respiration nasale ou régulière et rythmée tout au long de l’effort.'
      : 'Inspire profondément sur la phase d’étirement (retour contrôlé) et expire franchement pendant la phase d’effort et de contraction.';

  const formTips: string[] = [
    customTip?.trim() ||
      `Concentre ton esprit sur la fibre de ${muscleLabel.toLowerCase()} (connexion cerveau-muscle) plutôt que de chercher à mettre trop lourd.`,
    meta.category === 'back'
      ? 'Tire avec la pointe des coudes en gardant la nuque longue pour dessiner le dos sans crisper les trapèzes.'
      : meta.category === 'pecs'
      ? 'Garde la poitrine haute et les épaules plaquées en arrière tout au long de la série.'
      : 'Maintiens un tempo régulier (2s montée, 1s contraction, 3s descente) sur chaque répétition.',
  ];

  const commonMistakes: string[] = [
    'Utiliser un élan du buste ou tricher avec la vitesse au lieu de contrôler la charge.',
    'Réduire l’amplitude de moitié ou relâcher la tension musculaire en bas du mouvement.',
  ];

  const avoidCue =
    meta.category === 'back'
      ? 'Évite d’enrouler les épaules vers l’avant ou de hausser les épaules vers les oreilles.'
      : meta.category === 'lower-body'
      ? 'Évite de cambrer excessivement le bas du dos : garde les côtes basses et le périnée/transverse engagés.'
      : 'Ne verrouille pas brutalement tes articulations en fin de mouvement pour garder la tension dans le muscle.';

  const machineSetup: MachineSetupData = {
    diagramType,
    seatSetting:
      equipment === 'machine' || equipment === 'cable'
        ? `Règle la hauteur du siège ou de la poulie pour aligner parfaitement l'axe de tirage/poussée avec ${muscleLabel.toLowerCase()}.`
        : `Ajuste ton banc ou ton espace au sol pour avoir une liberté de mouvement totale et sécurisée.`,
    footPosition:
      meta.category === 'lower-body'
        ? 'Appui franc sur tout le pied (avec poussée principale par le talon et le milieu du pied), genoux alignés avec les orteils.'
        : 'Pieds posés à plat au sol, largeur d’épaules, pour stabiliser parfaitement ton bassin.',
    gripWidth:
      meta.category === 'lower-body'
        ? 'Mains posées sur les poignées de maintien ou tenant fermement la charge près du centre de gravité.'
        : 'Prise symétrique, poignets droits et solides dans le prolongement des avant-bras.',
    safetyCue: avoidCue,
  };

  return {
    description:
      customDesc?.trim() ||
      `Exercice ciblé pour sculpter et renforcer ${muscleLabel.toLowerCase()} (${eqText}) avec contrôle et précision.`,
    startingPosition,
    steps,
    breathing,
    formTips,
    commonMistakes,
    avoidTips: [avoidCue],
    machineSetup,
  };
}

export const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
  onExerciseCreated,
}) => {
  const { addCustomExercise } = useWorkout();

  const [name, setName] = useState(initialName);
  const [specificMuscle, setSpecificMuscle] = useState<SpecificMuscleGroup>('fessiers');
  const [equipment, setEquipment] = useState<EquipmentType>('dumbbell');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [defaultSets, setDefaultSets] = useState(3);
  const [defaultReps, setDefaultReps] = useState('10-12');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(75);
  const [showSheetPreview, setShowSheetPreview] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editable auto-sheet overrides
  const [customStepsText, setCustomStepsText] = useState('');
  const [customStartingPos, setCustomStartingPos] = useState('');

  useEffect(() => {
    if (isOpen && initialName) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const currentMeta =
    SPECIFIC_MUSCLE_GROUPS.find((m) => m.id === specificMuscle) || SPECIFIC_MUSCLE_GROUPS[0];

  const autoSheet = buildAutoExerciseSheet(name, specificMuscle, equipment, description, tips);

  const handleRegenerateFields = () => {
    const generated = buildAutoExerciseSheet(name, specificMuscle, equipment, description, tips);
    setCustomStartingPos(generated.startingPosition);
    setCustomStepsText(generated.steps.join('\n'));
    if (!description.trim()) {
      setDescription(generated.description);
    }
    if (!tips.trim()) {
      setTips(generated.formTips[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const sheet = buildAutoExerciseSheet(name, specificMuscle, equipment, description, tips);
      const finalSteps = customStepsText.trim()
        ? customStepsText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : sheet.steps;

      const payload: Omit<Exercise, 'id' | 'isCustom'> = {
        name: name.trim(),
        category: currentMeta.category,
        specificMuscle,
        primaryMuscle: currentMeta.label.replace(/^\d+\.\s*/, ''),
        equipment,
        description: sheet.description,
        startingPosition: customStartingPos.trim() || sheet.startingPosition,
        steps: finalSteps,
        breathing: sheet.breathing,
        formTips: sheet.formTips,
        commonMistakes: sheet.commonMistakes,
        avoidTips: sheet.avoidTips,
        machineSetup: sheet.machineSetup,
        defaultSets: Number(defaultSets),
        defaultReps,
        defaultRestSeconds: Number(defaultRestSeconds),
      };

      await addCustomExercise(payload);

      if (onExerciseCreated) {
        onExerciseCreated({
          ...payload,
          id: `custom_${Date.now()}`,
          isCustom: true,
        });
      }

      setName('');
      setDescription('');
      setTips('');
      setCustomStepsText('');
      setCustomStartingPos('');
      onClose();
    } catch (err) {
      console.error('Error creating custom exercise', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-[32px] bg-[#FCFBF9] p-6 shadow-2xl border border-[#E6E1D8] my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5B8EE]">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-[#FCE7F3] flex items-center justify-center text-[#831843]">
              <StreamlineIcon name="dumbbell" className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-[#2B091C] text-base font-display">
                Créer mon propre exercice
              </h2>
              <p className="text-[11px] text-[#7A616F]">
                Génère automatiquement une fiche complète comme les autres exos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6A63] hover:text-[#3B0726] rounded-full hover:bg-[#F2EFE9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-3.5 text-xs text-[#2B091C] overflow-y-auto pr-1 flex-1"
        >
          {/* Exercise Name */}
          <div>
            <label className="block font-bold text-[#831843] uppercase text-[10px] mb-1">
              Nom de ton exercice *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Tirage horizontal prise large, Développé incliné, Hip Thrust..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] focus:outline-hidden focus:border-[#831843] text-xs font-semibold text-[#2B091C]"
            />
          </div>

          {/* Specific Muscle Group Selection + Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#831843] uppercase text-[10px] mb-1">
                Zone / Muscle ciblé *
              </label>
              <select
                value={specificMuscle}
                onChange={(e) => setSpecificMuscle(e.target.value as SpecificMuscleGroup)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] focus:outline-hidden focus:border-[#831843] text-xs font-semibold text-[#2B091C]"
              >
                <optgroup label="Bas du corps">
                  <option value="fessiers">Fessiers</option>
                  <option value="quadriceps">Quadriceps</option>
                  <option value="ischios">Ischios</option>
                  <option value="adducteurs">Adducteurs</option>
                </optgroup>
                <optgroup label="Dos (Ordre 1-2-3-4)">
                  <option value="milieu-dos">1. Milieu du dos (Rhomboïdes)</option>
                  <option value="grand-dorsal">2. Grand dorsal</option>
                  <option value="trapezes-arriere-epaule">3. Arrière d’épaule / Trapèzes</option>
                  <option value="lombaires">4. Lombaires (Back Extension)</option>
                </optgroup>
                <optgroup label="Pecs & Buste">
                  <option value="pecs-haut">Haut des Pecs & Galbe</option>
                  <option value="pecs-global">Pectoraux Global</option>
                  <option value="pecs-isolation">Isolation Pecs (Fly / Pec-Deck)</option>
                </optgroup>
                <optgroup label="Épaules & Bras">
                  <option value="epaule-avant">Épaule (avant)</option>
                  <option value="epaule-cote">Épaule (côté)</option>
                  <option value="epaule-arriere">Épaule (arrière)</option>
                  <option value="biceps">Biceps</option>
                  <option value="triceps">Triceps</option>
                </optgroup>
                <optgroup label="Tronc & Cardio">
                  <option value="abdos">Abdominaux & Gainage</option>
                  <option value="cardio">Cardio & Circuits</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#831843] uppercase text-[10px] mb-1">
                Matériel utilisé *
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as EquipmentType)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] focus:outline-hidden focus:border-[#831843] text-xs font-semibold text-[#2B091C]"
              >
                <option value="dumbbell">Haltères (Poids libres)</option>
                <option value="barbell">Barre / Smith Machine</option>
                <option value="machine">Machine guidée</option>
                <option value="cable">Poulie (Câble)</option>
                <option value="bodyweight">Poids du corps</option>
                <option value="cardio_machine">Machine Cardio</option>
              </select>
            </div>
          </div>

          {/* Sets, Reps, Rest */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-[#7A616F] uppercase text-[10px] mb-1">
                Séries
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={defaultSets}
                onChange={(e) => setDefaultSets(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] text-xs text-center font-mono tabular-nums font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#7A616F] uppercase text-[10px] mb-1">
                Répétitions
              </label>
              <input
                type="text"
                value={defaultReps}
                onChange={(e) => setDefaultReps(e.target.value)}
                placeholder="10-12"
                className="w-full px-3 py-2 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] text-xs text-center font-mono tabular-nums font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#7A616F] uppercase text-[10px] mb-1">
                Repos (sec)
              </label>
              <input
                type="number"
                step="15"
                min="0"
                value={defaultRestSeconds}
                onChange={(e) => setDefaultRestSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-[#F6EDF2] border border-[#E5D4DF] text-xs text-center font-mono tabular-nums font-bold"
              />
            </div>
          </div>

          {/* Smart Auto-Generated Fiche Preview Box */}
          <div className="rounded-[24px] bg-[#FCE7F3]/50 border border-[#FBCFE8] overflow-hidden">
            <div className="p-3.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowSheetPreview(!showSheetPreview)}
                className="flex items-center gap-2 text-left flex-1"
              >
                <span className="w-7 h-7 rounded-xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-display font-bold text-xs text-[#2B091C] block">
                    Fiche Exercice Complète (Générée automatiquement)
                  </span>
                  <span className="text-[10px] text-[#831843] font-medium block">
                    Position, 4 étapes, respiration, réglages machine & erreurs à éviter
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRegenerateFields}
                  className="px-2.5 py-1 rounded-full bg-white text-[#831843] font-bold text-[10px] hover:bg-[#FCE7F3] border border-[#FBCFE8]"
                >
                  Personnaliser
                </button>
                <button
                  type="button"
                  onClick={() => setShowSheetPreview(!showSheetPreview)}
                  className="p-1 text-[#831843]"
                >
                  {showSheetPreview ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {showSheetPreview && (
              <div className="px-3.5 pb-3.5 space-y-2.5 text-[11px] border-t border-[#FBCFE8]/60 pt-2.5">
                <div className="p-2.5 rounded-2xl bg-white/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#831843] uppercase text-[10px]">
                      Aperçu de ta fiche dans l’appli :
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Fiche 100% complète
                    </span>
                  </div>
                  <p className="text-[#2B091C]">
                    <strong>Position :</strong> {customStartingPos || autoSheet.startingPosition}
                  </p>
                  <div>
                    <strong className="text-[#2B091C] block mb-0.5">Étapes (1 à 4) :</strong>
                    <ol className="list-decimal list-inside space-y-0.5 text-[#7A616F]">
                      {(customStepsText
                        ? customStepsText.split('\n').filter(Boolean)
                        : autoSheet.steps
                      ).map((st, idx) => (
                        <li key={idx} className="truncate">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-[#7A616F]">
                    <strong className="text-[#2B091C]">Réglage & Sécurité :</strong>{' '}
                    {autoSheet.machineSetup.seatSetting}
                  </p>
                </div>

                {/* Optional overrides */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#831843] text-[10px] mb-1">
                      Précision / Description (optionnel)
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Laissé vide = rédigé automatiquement"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5D4DF] text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] text-[10px] mb-1">
                      Ton astuce perso (optionnel)
                    </label>
                    <input
                      type="text"
                      value={tips}
                      onChange={(e) => setTips(e.target.value)}
                      placeholder="ex: Tirer les coudes vers les hanches..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5D4DF] text-[11px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#F5B8EE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-[#F6EDF2] text-[#2B091C] font-bold text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 rounded-full bg-[#831843] hover:bg-[#5B0E2D] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Création de la fiche...' : 'Créer mon exo & sa fiche'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
