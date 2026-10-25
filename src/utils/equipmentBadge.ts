import { EquipmentType } from '../types/fitness';

export interface EquipmentBadgeInfo {
  label: string;
  badgeClass: string;
}

/**
 * Returns the exact equipment badge according to user instructions:
 * The label « Poids libres » MUST be used EXCLUSIVELY for dumbbell exercises (equipment === 'dumbbell').
 * Barbell exercises get « Barre libre ».
 * Machine exercises get « Machine guidée ».
 * Cable exercises get « Poulie ».
 * Bodyweight exercises get « Poids du corps ».
 * Cardio machines get « Machine cardio ».
 */
export function getEquipmentBadge(equipment: EquipmentType): EquipmentBadgeInfo {
  switch (equipment) {
    case 'dumbbell':
      return {
        label: 'Poids libres', // Consigne stricte : uniquement pour les haltères
        badgeClass: 'bg-[#F8A5F8] text-[#3B0726] border border-[#F8A5F8]/40 font-bold',
      };
    case 'barbell':
      return {
        label: 'Barre libre',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-200 font-semibold',
      };
    case 'machine':
      return {
        label: 'Machine guidée',
        badgeClass: 'bg-[#F2EFE9] text-[#141414] border border-[#E6E2D8] font-semibold',
      };
    case 'cable':
      return {
        label: 'Poulie',
        badgeClass: 'bg-sky-100 text-sky-900 border border-sky-200 font-semibold',
      };
    case 'bodyweight':
      return {
        label: 'Poids du corps',
        badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold',
      };
    case 'cardio_machine':
      return {
        label: 'Machine cardio',
        badgeClass: 'bg-rose-100 text-rose-900 border border-rose-200 font-semibold',
      };
    default:
      return {
        label: 'Matériel',
        badgeClass: 'bg-neutral-100 text-neutral-800 border border-neutral-200 font-semibold',
      };
  }
}
