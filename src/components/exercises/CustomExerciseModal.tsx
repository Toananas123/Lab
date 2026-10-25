import React, { useState } from 'react';
import { X, Plus, Dumbbell } from 'lucide-react';
import { MuscleCategory, EquipmentType, SpecificMuscleGroup, SPECIFIC_MUSCLE_GROUPS } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface CustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({ isOpen, onClose }) => {
  const { addCustomExercise } = useWorkout();

  const [name, setName] = useState('');
  const [specificMuscle, setSpecificMuscle] = useState<SpecificMuscleGroup>('fessiers');
  const [equipment, setEquipment] = useState<EquipmentType>('dumbbell');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [defaultSets, setDefaultSets] = useState(3);
  const [defaultReps, setDefaultReps] = useState('10-12');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentMeta = SPECIFIC_MUSCLE_GROUPS.find((m) => m.id === specificMuscle) || SPECIFIC_MUSCLE_GROUPS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addCustomExercise({
        name: name.trim(),
        category: currentMeta.category,
        specificMuscle,
        primaryMuscle: currentMeta.label,
        equipment,
        description: description.trim() || `Exercice personnalisé ciblant ${currentMeta.label.toLowerCase()}.`,
        steps: ['Effectuez le mouvement avec contrôle, amplitude et bonne respiration.'],
        formTips: tips.trim() ? [tips.trim()] : undefined,
        defaultSets: Number(defaultSets),
        defaultReps,
        defaultRestSeconds: Number(defaultRestSeconds),
      });
      onClose();
    } catch (err) {
      console.error('Error creating custom exercise', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] bg-[#FCFBF9] p-6 shadow-2xl border border-[#E6E1D8] my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#F5B8EE]">
          <div className="flex items-center gap-2">
            <StreamlineIcon name="dumbbell" className="w-5 h-5 text-[#EC4899] shrink-0" />
            <h2 className="font-semibold text-[#3B0726] text-base font-display">
              Ajouter mon propre exercice
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6A63] hover:text-[#3B0726] rounded-full hover:bg-[#F2EFE9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-[#3B0726]">
          <div>
            <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
              Nom de votre exercice *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Hip Thrust unilatéral aux haltères, Tirage unilatéral..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726] text-xs font-medium"
            />
          </div>

          {/* Specific Muscle Group Selection */}
          <div>
            <label className="block font-semibold text-[#3B0726] uppercase text-[10px] mb-1">
              Groupe musculaire travaillé *
            </label>
            <select
              value={specificMuscle}
              onChange={(e) => setSpecificMuscle(e.target.value as SpecificMuscleGroup)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726] text-xs font-semibold text-[#3B0726]"
            >
              <optgroup label="Bas du corps">
                <option value="fessiers">Fessiers</option>
                <option value="quadriceps">Quadriceps</option>
                <option value="ischios">Ischios</option>
                <option value="adducteurs">Adducteurs</option>
              </optgroup>
              <optgroup label="Dos">
                <option value="grand-dorsal">Grand dorsal</option>
                <option value="milieu-dos">Milieu du dos (Rhomboïdes)</option>
                <option value="lombaires">Lombaires</option>
                <option value="trapezes-arriere-epaule">Trapèze / Arrière d'épaule</option>
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
            <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
              Matériel utilisé *
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as EquipmentType)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726] text-xs font-medium"
            >
              <option value="dumbbell">Haltères (Poids libres)</option>
              <option value="barbell">Barre & Disques (Poids libres)</option>
              <option value="machine">Machine guidée</option>
              <option value="cable">Poulie (Câble)</option>
              <option value="bodyweight">Poids du corps (Poids libres)</option>
              <option value="cardio_machine">Machine Cardio</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
                Séries
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={defaultSets}
                onChange={(e) => setDefaultSets(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] text-xs text-center font-mono tabular-nums font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
                Répétitions
              </label>
              <input
                type="text"
                value={defaultReps}
                onChange={(e) => setDefaultReps(e.target.value)}
                placeholder="10-12"
                className="w-full px-3 py-2 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] text-xs text-center font-mono tabular-nums font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
                Repos (sec)
              </label>
              <input
                type="number"
                step="15"
                min="0"
                value={defaultRestSeconds}
                onChange={(e) => setDefaultRestSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] text-xs text-center font-mono tabular-nums font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
              Description / Consignes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sensations recherchées, tempo, réglages..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726] text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#6E6A63] uppercase text-[10px] mb-1">
              Astuce d'exécution personnelle
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="ex: Pousser fort par le talon, bloquer 1s au sommet"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726] text-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#F5B8EE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-[#F2EFE9] text-[#3B0726] font-semibold text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full bg-[#F8A5F8] hover:bg-[#f58ef5] text-[#3B0726] font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer mon exercice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
