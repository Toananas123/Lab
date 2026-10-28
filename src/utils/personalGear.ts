export interface PersonalGearItem {
  id: 'ceinture' | 'sangle_cheville' | 'gants_grip' | 'elastique' | 'manchon_barre';
  name: string;
  shortLabel: string;
  icon: string;
  reason: string;
  tip: string;
}

export const ALL_PERSONAL_GEAR: Record<PersonalGearItem['id'], PersonalGearItem> = {
  ceinture: {
    id: 'ceinture',
    name: 'Ceinture de force / maintien lombaire',
    shortLabel: 'Ceinture de force',
    icon: '🥋',
    reason: 'Squats, RDL lourds & charges axiales',
    tip: 'Stabilise la pression intra-abdominale et sécurise tes lombaires sur les charges de travail.',
  },
  sangle_cheville: {
    id: 'sangle_cheville',
    name: 'Sangle chevillère pour poulie',
    shortLabel: 'Sangle chevillère',
    icon: '🔗',
    reason: 'Kickbacks fessiers & abductions à la poulie',
    tip: 'Évite de courir après une sangle en salle et garantit une attache confortable et hygiénique.',
  },
  gants_grip: {
    id: 'gants_grip',
    name: 'Gants de musculation ou sangles de tirage (Grip)',
    shortLabel: 'Gants / Sangles grip',
    icon: '🧤',
    reason: 'RDL, soulevé de terre & tirages lourds',
    tip: 'Prévient la fatigue prématurée des avant-bras et protège les paumes pour soulever plus lourd.',
  },
  elastique: {
    id: 'elastique',
    name: 'Élastique de résistance (Bande d’activation)',
    shortLabel: 'Élastique de résistance',
    icon: '🎗️',
    reason: 'Échauffement & activation fessiers / haut du corps',
    tip: 'Idéal pour réveiller les moyens fessiers ou la coiffe des rotateurs avant de charger.',
  },
  manchon_barre: {
    id: 'manchon_barre',
    name: 'Manchon mousse pour barre (Barbell Pad)',
    shortLabel: 'Manchon de hanche',
    icon: '🛡️',
    reason: 'Hip Thrust à la barre olympique',
    tip: 'Protège les crêtes iliaques et le pubis pour pousser fort sans douleur osseuse.',
  },
};

/**
 * Détermine le matériel personnel conseillé pour un exercice spécifique.
 */
export function getExercisePersonalGear(exercise: {
  id?: string;
  name?: string;
  equipment?: string;
  primaryMuscle?: string;
  category?: string;
}): PersonalGearItem[] {
  const gear: PersonalGearItem[] = [];
  const id = (exercise.id || '').toLowerCase();
  const name = (exercise.name || '').toLowerCase();
  const eq = (exercise.equipment || '').toLowerCase();
  const cat = (exercise.category || '').toLowerCase();

  // 1. Manchon pour barre
  if (
    (id.includes('hip-thrust') || name.includes('hip thrust')) &&
    (eq === 'barbell' || name.includes('barre') || id.includes('barbell'))
  ) {
    gear.push(ALL_PERSONAL_GEAR.manchon_barre);
  }

  // 2. Ceinture de force (Squats libres/smith/hack, RDL lourds, deadlifts)
  const isSquatHeavy =
    (name.includes('squat') && !name.includes('goblet') && !name.includes('sissy') && !name.includes('bulgare')) ||
    id.includes('squat-barbell') ||
    id.includes('barbell-back-squat') ||
    id.includes('hack-squat') ||
    id.includes('smith-machine-squat');

  const isDeadliftHeavy =
    name.includes('soulevé de terre') ||
    name.includes('deadlift') ||
    id.includes('romanian-deadlift') ||
    id.includes('stiff-leg') ||
    (id.includes('rdl') && !id.includes('single-leg'));

  if (isSquatHeavy || isDeadliftHeavy) {
    gear.push(ALL_PERSONAL_GEAR.ceinture);
  }

  // 3. Sangle chevillère pour poulie
  if (
    (id.includes('kickback') || name.includes('kickback') || id.includes('abduction-cable') || name.includes('poulie basse')) &&
    (eq === 'cable' || id.includes('cable') || name.includes('poulie'))
  ) {
    gear.push(ALL_PERSONAL_GEAR.sangle_cheville);
  }

  // 4. Gants / Sangles de tirage (Grip)
  const needsGrip =
    isDeadliftHeavy ||
    name.includes('rdl') ||
    id.includes('rdl') ||
    name.includes('rowing') ||
    id.includes('row') ||
    (cat === 'back' && (name.includes('tirage') || id.includes('pulldown') || id.includes('pullups')));

  if (needsGrip && !gear.some((g) => g.id === 'gants_grip')) {
    gear.push(ALL_PERSONAL_GEAR.gants_grip);
  }

  // 5. Élastique pour le haut du corps ou activation
  const needsBandWarmup =
    cat === 'arms' ||
    cat === 'back' ||
    name.includes('élévation') ||
    name.includes('développé militaire') ||
    id.includes('lateral-raise') ||
    name.includes('glute bridge') ||
    name.includes('abduction');

  if (needsBandWarmup && !gear.some((g) => g.id === 'elastique')) {
    gear.push(ALL_PERSONAL_GEAR.elastique);
  }

  return gear;
}

/**
 * Récupère et déduplique la liste des équipements personnels requis pour l'ensemble d'une séance.
 */
export function getWorkoutPersonalGear(
  exercises: {
    exerciseId?: string;
    id?: string;
    exerciseName?: string;
    name?: string;
    equipment?: string;
    category?: string;
  }[]
): PersonalGearItem[] {
  const map = new Map<string, PersonalGearItem>();

  for (const ex of exercises) {
    const items = getExercisePersonalGear({
      id: ex.exerciseId || ex.id,
      name: ex.exerciseName || ex.name,
      equipment: ex.equipment,
      category: ex.category,
    });
    for (const item of items) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }

  return Array.from(map.values());
}
