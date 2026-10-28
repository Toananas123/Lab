import { Exercise } from '../types/fitness';

export type LegDayPhaseId = 1 | 2 | 3 | 4;

export interface PhaseMeta {
  id: LegDayPhaseId;
  name: string;
  countLabel: string;
  examples: string;
}

export const LEG_DAY_PHASES: PhaseMeta[] = [
  {
    id: 1,
    name: 'Étirement',
    countLabel: "1 ou 2 exercices d'étirement",
    examples: 'RDL, squat, leg press, fentes bulgares, step-ups',
  },
  {
    id: 2,
    name: 'Contraction',
    countLabel: '1 exercice de contraction',
    examples: 'hip thrust, KAS glute bridge, back extension',
  },
  {
    id: 3,
    name: 'Unilatéral',
    countLabel: '1 exercice unilatéraux',
    examples: 'fentes (bulgares/marchées/ arrières...), single leg press, single leg RDL',
  },
  {
    id: 4,
    name: 'Isolation',
    countLabel: "1 ou 2 exercice d'isolation",
    examples: 'leg curl, leg extension, kick back, abductions',
  },
];

/**
 * Détecte les phases anatomiques valides pour un exercice bas du corps.
 */
export function getExerciseLegPhases(ex: Exercise): LegDayPhaseId[] {
  const id = ex.id.toLowerCase();
  const name = ex.name.toLowerCase();
  const phases: LegDayPhaseId[] = [];

  // Phase 1 : Étirement (RDL, squat, leg press, fentes bulgares, step-ups)
  const isRDL = id.includes('rdl') || name.includes('rdl') || name.includes('roumain') || name.includes('jambes tendues');
  const isSquat = (name.includes('squat') && !name.includes('sissy')) || id.includes('squat');
  const isLegPress = id.includes('leg-press') || name.includes('presse') || name.includes('leg press');
  const isBulgarian = id.includes('bulgarian') || name.includes('bulgare');
  const isStepUp = id.includes('step-up') || name.includes('step-up');

  if (isRDL || isSquat || isLegPress || isBulgarian || isStepUp) {
    phases.push(1);
  }

  // Phase 2 : Contraction (hip thrust, KAS glute bridge, back extension)
  const isHipThrust = id.includes('hip-thrust') || name.includes('hip thrust');
  const isKasBridge = id.includes('kas-glute') || name.includes('kas glute') || name.includes('glute bridge');
  const isBackExtension =
    id.includes('hyperextension') ||
    id.includes('back-extension') ||
    name.includes('banc à lombaires') ||
    name.includes('hyperextension');

  if (isHipThrust || isKasBridge || isBackExtension) {
    phases.push(2);
  }

  // Phase 3 : Unilatéraux (fentes marchées/arrières/bulgares, single leg press, single leg RDL, step-ups)
  const isLunge = name.includes('fente') || id.includes('lunge') || isBulgarian;
  const isSingleLegPress = id.includes('single-leg-press') || name.includes('unilatérale') || name.includes('single leg press');
  const isSingleLegRDL = id.includes('single-leg-rdl') || name.includes('unijambiste') || name.includes('single leg rdl');

  if (isLunge || isSingleLegPress || isSingleLegRDL || isStepUp) {
    phases.push(3);
  }

  // Phase 4 : Isolation (leg curl, leg extension, kick back, abductions, adductions)
  const isLegCurl = id.includes('leg-curl') || name.includes('leg curl');
  const isLegExtension = id.includes('leg-extension') || name.includes('leg extension');
  const isKickback = id.includes('kickback') || name.includes('kickback') || name.includes('kick back');
  const isAbduction = id.includes('abduction') || name.includes('abduction');
  const isAdduction = id.includes('adduct') || name.includes('adducteur');

  if (isLegCurl || isLegExtension || isKickback || isAbduction || isAdduction) {
    phases.push(4);
  }

  return phases;
}

/**
 * Propose une séance bas du corps en respectant rigoureusement l'ordre des 4 phases :
 * 1 - 1 ou 2 exercices d'étirement
 * 2 - 1 exercice de contraction
 * 3 - 1 exercice unilatéraux
 * 4 - 1 ou 2 exercice d'isolation
 */
export function buildStructuredLegWorkout(
  allExercises: Exercise[],
  favorites: string[],
  focusTarget: 'glutes' | 'lower' | 'posterior' | 'quads_adductors'
): { exercise: Exercise; phase: LegDayPhaseId }[] {
  const lowerExercises = allExercises.filter(
    (ex) => ex.category === 'lower-body' || ex.specificMuscle === 'fessiers' || ex.specificMuscle === 'ischios' || ex.specificMuscle === 'quadriceps' || ex.specificMuscle === 'adducteurs' || ex.id === 'hyperextensions-bench'
  );

  const sortWithFavorites = (list: Exercise[]) => {
    return [...list].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0.5 - Math.random();
    });
  };

  const selectedIds = new Set<string>();
  const workout: { exercise: Exercise; phase: LegDayPhaseId }[] = [];

  // Phase 1 : Étirement (strictement 1 exercice : RDL, Squat, Leg Press, Fentes bulgares, Step-ups...)
  let p1Candidates = lowerExercises.filter((e) => getExerciseLegPhases(e).includes(1));
  if (focusTarget === 'glutes') {
    const gluteStretch = p1Candidates.filter(
      (e) => e.specificMuscle === 'fessiers' || e.name.toLowerCase().includes('rdl') || e.id === 'leg-press-glutes-focus' || e.name.toLowerCase().includes('squat')
    );
    if (gluteStretch.length > 0) p1Candidates = gluteStretch;
  } else if (focusTarget === 'posterior') {
    const postStretch = p1Candidates.filter(
      (e) => e.specificMuscle === 'ischios' || e.name.toLowerCase().includes('rdl') || e.name.toLowerCase().includes('roumain')
    );
    if (postStretch.length > 0) p1Candidates = postStretch;
  } else if (focusTarget === 'quads_adductors') {
    const quadStretch = p1Candidates.filter(
      (e) => e.specificMuscle === 'quadriceps' || e.specificMuscle === 'adducteurs' || e.name.toLowerCase().includes('squat') || e.id === 'leg-press'
    );
    if (quadStretch.length > 0) p1Candidates = quadStretch;
  }

  // Prioriser les mouvements bilatéraux en Phase 1 pour garder les unilatéraux (bulgares, etc.) pour la Phase 3
  const p1Bilateral = p1Candidates.filter((e) => !e.name.toLowerCase().includes('bulgare') && !e.name.toLowerCase().includes('step-up'));
  const finalP1Candidates = p1Bilateral.length > 0 ? p1Bilateral : p1Candidates;
  const sortedP1 = sortWithFavorites(finalP1Candidates.length > 0 ? finalP1Candidates : lowerExercises.filter((e) => getExerciseLegPhases(e).includes(1)));
  const pickedP1 = sortedP1[0];
  if (pickedP1) {
    selectedIds.add(pickedP1.id);
    workout.push({ exercise: pickedP1, phase: 1 });
  }

  // Phase 2 : Contraction (strictement 1 exercice : Hip thrust, KAS glute bridge, Back extension...)
  let p2Candidates = lowerExercises.filter(
    (e) => getExerciseLegPhases(e).includes(2) && !selectedIds.has(e.id)
  );
  if (focusTarget === 'posterior') {
    const postContraction = p2Candidates.filter(
      (e) => e.id.includes('hip-thrust') || e.id.includes('hyperextension') || e.id.includes('kas-glute')
    );
    if (postContraction.length > 0) p2Candidates = postContraction;
  }
  const sortedP2 = sortWithFavorites(p2Candidates.length > 0 ? p2Candidates : lowerExercises.filter((e) => getExerciseLegPhases(e).includes(2) && !selectedIds.has(e.id)));
  const pickedP2 = sortedP2[0];
  if (pickedP2) {
    selectedIds.add(pickedP2.id);
    workout.push({ exercise: pickedP2, phase: 2 });
  }

  // Phase 3 : Unilatéral (strictement 1 exercice : fentes bulgares/marchées/arrières, single leg press, single leg RDL...)
  let p3Candidates = lowerExercises.filter(
    (e) => getExerciseLegPhases(e).includes(3) && !selectedIds.has(e.id)
  );
  if (focusTarget === 'glutes') {
    const gluteUni = p3Candidates.filter(
      (e) => e.name.toLowerCase().includes('bulgare') || e.name.toLowerCase().includes('fente') || e.id === 'single-leg-press' || e.id === 'step-ups-dumbbell'
    );
    if (gluteUni.length > 0) p3Candidates = gluteUni;
  } else if (focusTarget === 'posterior') {
    const postUni = p3Candidates.filter(
      (e) => e.id.includes('single-leg-rdl') || e.name.toLowerCase().includes('arrières') || e.name.toLowerCase().includes('bulgare')
    );
    if (postUni.length > 0) p3Candidates = postUni;
  } else if (focusTarget === 'quads_adductors') {
    const quadUni = p3Candidates.filter(
      (e) => e.name.toLowerCase().includes('avant') || e.id === 'single-leg-press' || e.name.toLowerCase().includes('fente')
    );
    if (quadUni.length > 0) p3Candidates = quadUni;
  }
  const sortedP3 = sortWithFavorites(p3Candidates.length > 0 ? p3Candidates : lowerExercises.filter((e) => getExerciseLegPhases(e).includes(3) && !selectedIds.has(e.id)));
  const pickedP3 = sortedP3[0];
  if (pickedP3) {
    selectedIds.add(pickedP3.id);
    workout.push({ exercise: pickedP3, phase: 3 });
  }

  // Phase 4 : Isolation (strictement 1 exercice : Leg curl, Leg extension, Kickback poulie, Abduction machine...)
  let p4Candidates = lowerExercises.filter(
    (e) => getExerciseLegPhases(e).includes(4) && !selectedIds.has(e.id)
  );
  if (focusTarget === 'glutes') {
    const gluteIso = p4Candidates.filter(
      (e) => e.id.includes('kickback') || e.id.includes('abduction')
    );
    if (gluteIso.length > 0) p4Candidates = gluteIso;
  } else if (focusTarget === 'posterior') {
    const postIso = p4Candidates.filter(
      (e) => e.id.includes('leg-curl') || e.id.includes('hyperextension')
    );
    if (postIso.length > 0) p4Candidates = postIso;
  } else if (focusTarget === 'quads_adductors') {
    const quadIso = p4Candidates.filter(
      (e) => e.id.includes('leg-extension') || e.id.includes('adduct')
    );
    if (quadIso.length > 0) p4Candidates = quadIso;
  }
  const sortedP4 = sortWithFavorites(p4Candidates.length > 0 ? p4Candidates : lowerExercises.filter((e) => getExerciseLegPhases(e).includes(4) && !selectedIds.has(e.id)));
  const pickedP4 = sortedP4[0];
  if (pickedP4) {
    selectedIds.add(pickedP4.id);
    workout.push({ exercise: pickedP4, phase: 4 });
  }

  return workout;
}
