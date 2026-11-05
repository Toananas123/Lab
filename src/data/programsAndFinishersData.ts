import {
  FinisherPreset,
  TrainingProgram,
  ProgramWeek,
  ProgramDayTemplate,
  ProgramObjective,
  ProgramEquipmentTag,
} from '../types/fitness';

export const PROGRAM_OBJECTIVE_META: Record<
  ProgramObjective,
  { label: string; shortLabel: string; badgeBg: string; badgeText: string; description: string }
> = {
  hypertrophy: {
    label: 'Prise de masse / Hypertrophie',
    shortLabel: 'Hypertrophie & Galbe',
    badgeBg: 'bg-pink-500/15 border-pink-400/30',
    badgeText: 'text-pink-700',
    description: 'Tension mécanique maximale et surcharge progressive pour sculpter et galber vos formes.',
  },
  shred: {
    label: 'Perte de poids / Sèche',
    shortLabel: 'Sèche & Métabolique',
    badgeBg: 'bg-amber-500/15 border-amber-400/30',
    badgeText: 'text-amber-700',
    description: 'Circuits haute dépense énergétique et finishers cardio pour affiner et dessiner la silhouette.',
  },
  toning: {
    label: 'Remise en forme / Tonicité',
    shortLabel: 'Tonicité & Posture',
    badgeBg: 'bg-emerald-500/15 border-emerald-400/30',
    badgeText: 'text-emerald-700',
    description: 'Renforcement profond, sangle abdominale engagée et posture altière au quotidien.',
  },
  performance: {
    label: 'Performance / Spécifique',
    shortLabel: 'Performance & Défis',
    badgeBg: 'bg-purple-500/15 border-purple-400/30',
    badgeText: 'text-purple-700',
    description: 'Cycles ciblés pour débloquer des mouvements athlétiques (tractions, explosivité, cardio).',
  },
};

export const ALL_PROGRAM_EQUIPMENT_TAGS: ProgramEquipmentTag[] = [
  'Bandes de résistance',
  'Sangle chevillère',
  'Haltères',
  'Poids du corps',
  'Machines',
  'Barre & Poids',
];

// ==========================================
// CATALOGUE DES FINISHERS (BASE DE DONNÉES)
// ==========================================

export const FINISHERS_CATALOG: FinisherPreset[] = [
  // 1. Abdos & Gainage
  {
    id: 'finisher-tabata-core-30-15',
    name: '30/15 Tabata Core (4 min)',
    category: 'abs',
    categoryLabel: 'Abdos & Gainage',
    durationLabel: '4 min',
    totalDurationSeconds: 240,
    executionMode: 'interval',
    summary: '4 tours de [30s Hollow Rock ou Gainage / 15s repos + 30s Crunchs ou Relevés de bassin / 15s repos].',
    instructions: [
      'Alternez 30 secondes d’effort intense et 15 secondes de récupération pendant 4 tours complets.',
      'Exercice A : Hollow Rock (position cuillère) ou Gainage ventral.',
      'Exercice B : Crunchs contrôlés ou Relevés de bassin au sol.',
      'Gardez le nombril aspiré et les lombaires plaquées au tapis sur les exercices sur le dos.',
    ],
    intervals: Array.from({ length: 4 }).flatMap((_, roundIdx) => [
      {
        label: `Tour ${roundIdx + 1}/4 — Hollow Rock ou Gainage`,
        type: 'effort' as const,
        durationSeconds: 30,
        cue: 'Aspirez le nombril et verrouillez la sangle abdominale !',
      },
      {
        label: `Tour ${roundIdx + 1}/4 — Repos rapide`,
        type: 'rest' as const,
        durationSeconds: 15,
        cue: 'Respirez profondément, préparez-vous pour les Crunchs / Relevés de bassin.',
      },
      {
        label: `Tour ${roundIdx + 1}/4 — Crunchs ou Relevés de bassin`,
        type: 'effort' as const,
        durationSeconds: 30,
        cue: 'Expirez à chaque contraction, décollez le bassin sans élan.',
      },
      {
        label: roundIdx === 3 ? 'Récupération finale' : `Tour ${roundIdx + 1}/4 — Repos`,
        type: 'rest' as const,
        durationSeconds: 15,
        cue: roundIdx === 3 ? 'Dernières secondes avant la victoire !' : 'Soufflez, prochain tour en gainage !',
      },
    ]),
  },
  {
    id: 'finisher-plank-no-pause-3m',
    name: 'Plank Finisher sans pause (3 min)',
    category: 'abs',
    categoryLabel: 'Abdos & Gainage',
    durationLabel: '3 min',
    totalDurationSeconds: 180,
    executionMode: 'countdown',
    summary: '1 min gainage ventral + 1 min latéral droit (pulsations) + 1 min latéral gauche sans poser les genoux.',
    instructions: [
      '0:00 à 1:00 — Gainage ventral sur les avant-bras, fessiers et abdos contractés.',
      '1:00 à 2:00 — Pivotez directement en gainage latéral DROIT avec petites pulsations de hanche.',
      '2:00 à 3:00 — Pivotez en gainage latéral GAUCHE avec pulsations sans jamais poser les genoux au sol !',
    ],
    phaseAlerts: [
      {
        atElapsedSeconds: 0,
        label: 'Phase 1/3 : Gainage Ventral (60s)',
        cue: 'Corps aligné, coudes sous les épaules, serrez les fessiers !',
      },
      {
        atElapsedSeconds: 60,
        label: 'Phase 2/3 : Gainage Latéral DROIT + Pulsations (60s)',
        cue: 'PIVOT ! Passez sur le côté droit sans poser les genoux et pulsez la hanche vers le plafond.',
      },
      {
        atElapsedSeconds: 120,
        label: 'Phase 3/3 : Gainage Latéral GAUCHE + Pulsations (60s)',
        cue: 'DERNIÈRE MINUTE ! Pivotez côté gauche, tenez bon jusqu’au bout !',
      },
    ],
  },

  // 2. Cardio & Brûle-graisse
  {
    id: 'finisher-cardio-12-5-30-express',
    name: '12-5-30 Express (5 à 8 min)',
    category: 'cardio',
    categoryLabel: 'Cardio & Brûle-graisse',
    durationLabel: '6 min',
    totalDurationSeconds: 360,
    executionMode: 'countdown',
    summary: 'Tapis de course à 12% d’inclinaison, vitesse 5 km/h en marche active sans se tenir aux poignées.',
    instructions: [
      'Réglez immédiatement votre tapis de course sur Inclinaison 12% et Vitesse 5,0 km/h.',
      'Ne vous tenez PAS aux poignées : balancez les bras naturellement pour engager le gainage et les fessiers.',
      'Poussez fort dans les talons à chaque pas pour recruter toute la chaîne postérieure.',
    ],
    phaseAlerts: [
      {
        atElapsedSeconds: 0,
        label: 'Départ Marche Inclinée 12% · 5 km/h',
        cue: 'Lâchez les poignées, buste fier et regard droit devant.',
      },
      {
        atElapsedSeconds: 180,
        label: 'Mi-parcours (3 min restantes)',
        cue: 'Gardez la cadence à 5 km/h, respirez par le nez et poussez dans les talons !',
      },
      {
        atElapsedSeconds: 300,
        label: 'Sprint final (Dernière minute !)',
        cue: 'Plus que 60 secondes à 12% de pente, ne lâchez rien !',
      },
    ],
  },
  {
    id: 'finisher-stairmaster-burn-5m',
    name: 'StairMaster Brûle-Cuisses (5 min)',
    category: 'cardio',
    categoryLabel: 'Cardio & Brûle-graisse',
    durationLabel: '5 min',
    totalDurationSeconds: 300,
    executionMode: 'countdown',
    summary: 'Escalier mécanique non-stop à rythme soutenu (alternance pas simples rapides et marches 2 par 2).',
    instructions: [
      'Montez sur le StairMaster à un niveau soutenu (Niv. 8 à 11).',
      'Minutes 1 à 2 : Pas réguliers dynamiques sans s’appuyer sur les rampes.',
      'Minutes 2 à 4 : Montez les marches 2 par 2 en ancrant tout le talon pour brûler les fessiers.',
      'Minute 5 : Sprint final à cadence maximale !',
    ],
    phaseAlerts: [
      {
        atElapsedSeconds: 0,
        label: 'Minutes 1-2 : Cadence soutenue (Niv. 8-9)',
        cue: 'Buste légèrement penché en avant, mains libres ou simple effleurement.',
      },
      {
        atElapsedSeconds: 120,
        label: 'Minutes 3-4 : Marches 2 par 2 (Focus Fessiers)',
        cue: 'Enjambez une marche sur deux en poussant fort dans le talon !',
      },
      {
        atElapsedSeconds: 240,
        label: 'Minute 5 : Rush Final (Niv. 10-12)',
        cue: '60 secondes à fond pour terminer la séance en beauté !',
      },
    ],
  },
  {
    id: 'finisher-pyramide-sprint-4m',
    name: 'Pyramide Sprint (4 min)',
    category: 'cardio',
    categoryLabel: 'Cardio & Brûle-graisse',
    durationLabel: '4 min',
    totalDurationSeconds: 240,
    executionMode: 'interval',
    summary: 'Rameur ou Assault Bike (10s sprint/10s repos, 20s/20s, 30s/30s, puis redescente).',
    instructions: [
      'Installez-vous sur un Rameur Concept2, un Assault Bike ou un Vélo spinning.',
      'Enchaînez la pyramide montante (10s/10s → 20s/20s → 30s/30s → 30s/30s) puis redescendez (20s/20s → 10s/10s).',
      'Chaque phase Effort doit être réalisée à 95-100% d’intensité explosive.',
    ],
    intervals: [
      { label: 'Palier 1 — Sprint Explosif (10s)', type: 'effort', durationSeconds: 10, cue: 'Sprint maximal dès la première seconde !' },
      { label: 'Palier 1 — Récupération (10s)', type: 'rest', durationSeconds: 10, cue: 'Ralentissez tout doux, respirez.' },
      { label: 'Palier 2 — Sprint Soutenu (20s)', type: 'effort', durationSeconds: 20, cue: '20 secondes à fond, cadence maximale !' },
      { label: 'Palier 2 — Récupération (20s)', type: 'rest', durationSeconds: 20, cue: 'Calmez le souffle avant le sommet de la pyramide.' },
      { label: 'Sommet 1 — Sprint Long (30s)', type: 'effort', durationSeconds: 30, cue: '30 secondes de puissance pure, tenez le rythme !' },
      { label: 'Sommet 1 — Récupération (30s)', type: 'rest', durationSeconds: 30, cue: 'Inspirez profondément par le nez.' },
      { label: 'Sommet 2 — Sprint Long (30s)', type: 'effort', durationSeconds: 30, cue: 'Deuxième passage de 30s, attaquez la redescente !' },
      { label: 'Sommet 2 — Récupération (30s)', type: 'rest', durationSeconds: 30, cue: 'Superbe ! Il ne reste que la redescente.' },
      { label: 'Redescente — Sprint (20s)', type: 'effort', durationSeconds: 20, cue: '20 secondes explosives !' },
      { label: 'Redescente — Récupération (20s)', type: 'rest', durationSeconds: 20, cue: 'Préparez-vous pour les 10 dernières secondes.' },
      { label: 'Sprint Final All-Out (10s)', type: 'effort', durationSeconds: 10, cue: 'VIDEZ TOUT LE RÉSERVOIR SUR 10 SECONDES !' },
      { label: 'Retour au calme (10s)', type: 'rest', durationSeconds: 10, cue: 'Bravo, pyramide terminée !' },
    ],
  },

  // 3. Pump & Congestion (Musculation)
  {
    id: 'finisher-drop-set-mecanique',
    name: 'Drop-Set Mécanique',
    category: 'pump',
    categoryLabel: 'Pump & Congestion',
    durationLabel: '3-4 min',
    totalDurationSeconds: 180,
    executionMode: 'stopwatch',
    summary: '2 séries à l’échec total avec charge légère sur le dernier exercice effectué (1 min de repos entre les deux).',
    instructions: [
      'Conservez le dernier exercice de votre séance et baissez la charge de 30 à 40%.',
      'Série 1 : Allez jusqu’à l’échec musculaire complet avec un tempo contrôlé (brûlure maximale).',
      'Prenez exactement 60 secondes de repos.',
      'Série 2 : Repartez jusqu’à l’échec total pour gorger le muscle de sang (congestion maximale).',
    ],
    targetSets: 2,
    restBetweenSetsSeconds: 60,
  },
  {
    id: 'finisher-challenge-100-reps',
    name: 'Challenge 100 Reps',
    category: 'pump',
    categoryLabel: 'Pump & Congestion',
    durationLabel: 'Time Cap 5 min',
    totalDurationSeconds: 300,
    executionMode: 'stopwatch',
    summary: 'Choisir 1 exercice léger/poids du corps (squats, fentes, pompes, élévations) et valider 100 répétitions le plus vite possible.',
    instructions: [
      'Sélectionnez votre mouvement cible (ex: Hip Abductions, Glute Bridges, Squats poids du corps, Élévations latérales légères ou Kickbacks).',
      'Lancez le chronomètre et validez 100 répétitions au total le plus vite possible.',
      'Vous pouvez prendre des micro-pauses de 5 secondes (Rest-Pause) dès que ça brûle, mais ne lâchez rien avant 100 !',
      'Appuyez sur "Terminé" dès la 100e répétition pour enregistrer votre record de temps.',
    ],
    targetReps: 100,
    selectableExercises: [
      'Glute Bridges au sol',
      'Abductions avec bande élastique',
      'Squats poids du corps',
      'Élévations latérales (haltères légers)',
      'Fentes alternées dynamiques',
      'Pushdowns Triceps à la corde',
    ],
  },
];

// Helper to generate progressive weeks for a program
function generateProgramWeeks(
  totalWeeks: number,
  baseDays: Omit<ProgramDayTemplate, 'id'>[],
  weekThemes: { title: string; focusNote: string }[]
): ProgramWeek[] {
  return Array.from({ length: totalWeeks }, (_, idx) => {
    const weekNumber = idx + 1;
    const theme = weekThemes[idx] || {
      title: `Semaine ${weekNumber} — Progression & Intensification`,
      focusNote: 'Augmentez vos charges de +1 à +2,5 kg ou ajoutez +1 répétition par série par rapport à la semaine précédente.',
    };
    return {
      weekNumber,
      title: theme.title,
      focusNote: theme.focusNote,
      days: baseDays.map((d, dIdx) => ({
        ...d,
        id: `w${weekNumber}-d${dIdx + 1}`,
      })),
    };
  });
}

// ==========================================
// CATALOGUE DE PROGRAMMES "CLÉS EN MAIN"
// ==========================================

export const DEFAULT_PROGRAMS: TrainingProgram[] = [
  // 1. Prise de masse / Hypertrophie — Booty Builder 8 semaines
  {
    id: 'prog-booty-builder-8w',
    title: 'Booty Builder 8 Semaines',
    subtitle: 'Hypertrophie fessiers 3D, galbe supérieur & chaîne postérieure',
    objective: 'hypertrophy',
    objectiveLabel: 'Prise de masse / Hypertrophie',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    level: 'Intermédiaire',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    equipment: ['Barre & Poids', 'Haltères', 'Machines', 'Sangle chevillère', 'Bandes de résistance'],
    description:
      'Le programme signature GlowUpLab en 8 semaines pour construire un galbe fessier rebondi sous tous les angles (grand, moyen et petit fessier) tout en dessinant un dos en V qui affine visuellement la taille.',
    coachTips: [
      'Appliquez la surcharge progressive chaque semaine : +2 kg sur le Hip Thrust et la Presse dès que vous validez toutes vos répétitions.',
      'Activez vos moyens fessiers avec une bande de résistance pendant 3 minutes avant chaque séance Bas du corps.',
    ],
    weeks: generateProgramWeeks(
      8,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Booty Sculpt & Tension Mécanique',
          isRest: false,
          activityType: 'Séance Fessiers',
          routineId: 'routine-glutes-focus',
          workoutTitle: 'Booty Sculpt & Hypertrophie (Fessiers)',
          targetZone: 'lower-body',
          durationMinutes: 55,
          finisherPresetId: 'finisher-challenge-100-reps',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — Dos V-Shape & Posture Sablier',
          isRest: false,
          activityType: 'Séance Dos',
          routineId: 'routine-back-v-shape',
          workoutTitle: 'Dos & Silhouette V-Shape (Posture)',
          targetZone: 'back',
          durationMinutes: 45,
          finisherPresetId: 'finisher-plank-no-pause-3m',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Repos & Mobilité des Hanches',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Chaîne Postérieure (Fessiers & Ischios)',
          isRest: false,
          activityType: 'Séance Bas du corps',
          routineId: 'routine-posterior-chain',
          workoutTitle: 'Chaîne Postérieure (Fessiers & Ischios)',
          targetZone: 'lower-body',
          durationMinutes: 55,
          finisherPresetId: 'finisher-drop-set-mecanique',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Épaules Galbées & Abdos Vacuum',
          isRest: false,
          activityType: 'Séance Bras',
          routineId: 'routine-shoulders-arms',
          workoutTitle: 'Épaules Galbées & Bras Toniques',
          targetZone: 'arms',
          durationMinutes: 45,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos Actif (8 000 pas)',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos Complet & Récupération',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      [
        { title: 'Semaine 1 — Connexion Neuromusculaire & Tempo', focusNote: 'Maîtrisez la pause de 2s en haut du Hip Thrust et du Kickback.' },
        { title: 'Semaine 2 — Augmentation du Volume (+1-2 reps)', focusNote: 'Visez le haut de la fourchette de répétitions avec la même charge.' },
        { title: 'Semaine 3 — Première Surcharge (+2 kg)', focusNote: 'Ajoutez +2 kg sur vos mouvements polyarticulaires (Hip Thrust, RDL).' },
        { title: 'Semaine 4 — Semaine de Consolidation', focusNote: 'Stabilisez vos nouvelles charges avec une exécution chirurgicale.' },
        { title: 'Semaine 5 — Cycle Intensité & Contraction Pic', focusNote: 'Intégrez systématiquement les Finishers Pump en fin de séance.' },
        { title: 'Semaine 6 — Surcharge Progressive Palier 2', focusNote: 'Nouveau palier de charge (+2 kg recommandés sur vos records).' },
        { title: 'Semaine 7 — Semaine Peak Volume', focusNote: 'Semaine la plus dense du programme avant le bilan final.' },
        { title: 'Semaine 8 — Semaine de Records & Bilan GlowUp', focusNote: 'Testez vos nouveaux records personnels et célébrez votre transformation !' },
      ]
    ),
  },

  // 2. Prise de masse / Hypertrophie — Full Body V-Shape (6 semaines)
  {
    id: 'prog-fullbody-vshape-6w',
    title: 'Full Body V-Shape 6 Semaines',
    subtitle: 'Silhouette sablier en 3 séances complètes par semaine',
    objective: 'hypertrophy',
    objectiveLabel: 'Prise de masse / Hypertrophie',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    level: 'Débutant',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
    equipment: ['Haltères', 'Machines', 'Barre & Poids', 'Poids du corps'],
    description:
      'Idéal pour progresser avec un emploi du temps chargé : 3 séances ultra-efficaces par semaine combinant bas du corps galbé, dos dessiné et taille affinée.',
    coachTips: [
      'Laissez toujours au moins 1 jour de repos entre deux séances Full Body pour optimiser la surcompensation musculaire.',
      'Concentrez-vous sur la qualité de chaque répétition avant d’augmenter la charge.',
    ],
    weeks: generateProgramWeeks(
      6,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Full Body Glow (Dominante Fessiers & Dos)',
          isRest: false,
          activityType: 'Musculation',
          routineId: 'routine-fullbody-glow',
          workoutTitle: 'Full Body Glow & Tonification Totale',
          targetZone: 'fullbody',
          durationMinutes: 50,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — Repos & Récupération',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Quads, Fessiers & Posture Haut du Corps',
          isRest: false,
          activityType: 'Séance Bas du corps',
          routineId: 'routine-quads-glutes',
          workoutTitle: 'Bas du Corps Complet (Quads, Fessiers & Ischios)',
          targetZone: 'lower-body',
          durationMinutes: 50,
          finisherPresetId: 'finisher-plank-no-pause-3m',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Repos Actif',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Booty & Silhouette V-Shape',
          isRest: false,
          activityType: 'Séance Fessiers',
          routineId: 'routine-glutes-focus',
          workoutTitle: 'Booty Sculpt & Hypertrophie (Fessiers)',
          targetZone: 'lower-body',
          durationMinutes: 50,
          finisherPresetId: 'finisher-drop-set-mecanique',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      [
        { title: 'Semaine 1 — Apprentissage Moteur', focusNote: 'Trouvez vos charges de référence sur chaque machine.' },
        { title: 'Semaine 2 — Régularité & Contrôle', focusNote: 'Ajoutez +1 à 2 répétitions sur chaque série.' },
        { title: 'Semaine 3 — Surcharge Progressive (+2 kg)', focusNote: 'Augmentez légèrement la charge sur le premier exercice de chaque séance.' },
        { title: 'Semaine 4 — Densité & Gainage', focusNote: 'Réduisez vos temps de repos de 10 secondes.' },
        { title: 'Semaine 5 — Intensification V-Shape', focusNote: 'Nouveau palier de charge sur le Hip Thrust et le Tirage vertical.' },
        { title: 'Semaine 6 — Semaine Finale & Bilan', focusNote: 'Donnez tout sur vos dernières séances et consultez votre bilan !' },
      ]
    ),
  },

  // 3. Perte de poids / Sèche — Shred & Sweat (6 semaines)
  {
    id: 'prog-shred-and-sweat-6w',
    title: 'Shred & Sweat 6 Semaines',
    subtitle: 'Sèche métabolique, définition musculaire & cardio brûle-graisse',
    objective: 'shred',
    objectiveLabel: 'Perte de poids / Sèche',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    level: 'Intermédiaire',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    equipment: ['Haltères', 'Machines', 'Poids du corps', 'Bandes de résistance'],
    description:
      'Un programme hybride combinant renforcement musculaire dense et Finishers cardio métaboliques (12-5-30, StairMaster, Pyramide Sprint) pour maximiser l’effet afterburn tout en préservant le galbe musculaire.',
    coachTips: [
      'Ne négligez jamais le Finisher de 5 minutes en fin de séance : c’est lui qui déclenche le pic métabolique post-entraînement.',
      'Maintenez vos charges lourdes en musculation pour préserver votre masse musculaire sèche.',
    ],
    weeks: generateProgramWeeks(
      6,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Lower Body Burn & 12-5-30 Express',
          isRest: false,
          activityType: 'Séance Bas du corps',
          routineId: 'routine-quads-adductors',
          workoutTitle: 'Quads Sculpt & Adducteurs Fermes',
          targetZone: 'lower-body',
          durationMinutes: 50,
          finisherPresetId: 'finisher-cardio-12-5-30-express',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — Upper Body Sculpt & Tabata Core',
          isRest: false,
          activityType: 'Séance Dos',
          routineId: 'routine-back-v-shape',
          workoutTitle: 'Dos & Silhouette V-Shape (Posture)',
          targetZone: 'back',
          durationMinutes: 45,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Repos Actif',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Booty Métabolique & StairMaster',
          isRest: false,
          activityType: 'Séance Fessiers',
          routineId: 'routine-glutes-focus',
          workoutTitle: 'Booty Sculpt & Hypertrophie (Fessiers)',
          targetZone: 'lower-body',
          durationMinutes: 50,
          finisherPresetId: 'finisher-stairmaster-burn-5m',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Circuit Cardio HIIT & Abdos Sablier',
          isRest: false,
          activityType: 'HIIT',
          routineId: 'routine-cardio-stairmaster-booty',
          workoutTitle: 'Circuit Cardio : StairMaster Booty Burner (20 min)',
          targetZone: 'cardio',
          durationMinutes: 40,
          finisherPresetId: 'finisher-pyramide-sprint-4m',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      [
        { title: 'Semaine 1 — Relance Métabolique', focusNote: 'Respectez scrupuleusement les temps de repos courts (60s).' },
        { title: 'Semaine 2 — Intensification Cardio', focusNote: 'Validez tous vos Finishers cardio sans poser les mains sur les poignées.' },
        { title: 'Semaine 3 — Surcharge + Densité', focusNote: '+1 à 2 répétitions par série tout en gardant un rythme soutenu.' },
        { title: 'Semaine 4 — Semaine Haute Combustion', focusNote: 'Enchaînez les exercices avec fluidité et explosivité.' },
        { title: 'Semaine 5 — Pic de Définition', focusNote: 'Maintenez vos charges acquises et battez votre record au Finisher.' },
        { title: 'Semaine 6 — Sprint Final Shred & Sweat', focusNote: 'Dernière ligne droite avant votre bilan complet de sèche !' },
      ]
    ),
  },

  // 4. Remise en forme / Tonicité — Tonique & Posture (4 semaines)
  {
    id: 'prog-tonique-posture-4w',
    title: 'Tonique & Posture 4 Semaines',
    subtitle: 'Ventre plat, dos fortifié & énergie retrouvée en douceur',
    objective: 'toning',
    objectiveLabel: 'Remise en forme / Tonicité',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    level: 'Débutant',
    coverImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80',
    equipment: ['Poids du corps', 'Bandes de résistance', 'Haltères'],
    description:
      'Un cycle de 4 semaines pensé pour reprendre le sport avec plaisir, renforcer le transverse profond (Stomach Vacuum & Gainage), ouvrir la cage thoracique et tonifier l’ensemble du corps sans impact articulaire.',
    coachTips: [
      'Pratiquez la respiration hypopressive en fin de séance pour engager le transverse profond.',
      'Privilégiez l’amplitude complète et la fluidité du mouvement.',
    ],
    weeks: generateProgramWeeks(
      4,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Full Body Tonique & Gainage Doux',
          isRest: false,
          activityType: 'Musculation',
          routineId: 'routine-fullbody-glow',
          workoutTitle: 'Full Body Glow & Tonification Totale',
          targetZone: 'fullbody',
          durationMinutes: 40,
          finisherPresetId: 'finisher-plank-no-pause-3m',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — Repos & Étirements',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Dos Altière, Épaules & Abdos Sablier',
          isRest: false,
          activityType: 'Séance Dos',
          routineId: 'routine-back-v-shape',
          workoutTitle: 'Dos & Silhouette V-Shape (Posture)',
          targetZone: 'back',
          durationMinutes: 40,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Jambes Fuselées & Marche Inclinée',
          isRest: false,
          activityType: 'Séance Bas du corps',
          routineId: 'routine-posterior-chain',
          workoutTitle: 'Chaîne Postérieure (Fessiers & Ischios)',
          targetZone: 'lower-body',
          durationMinutes: 45,
          finisherPresetId: 'finisher-cardio-12-5-30-express',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      [
        { title: 'Semaine 1 — Réveil Musculaire & Posture', focusNote: 'Concentrez-vous sur l’alignement du dos et la respiration.' },
        { title: 'Semaine 2 — Engagement du Centre (Core)', focusNote: 'Ajoutez +2 répétitions par série avec un contrôle parfait.' },
        { title: 'Semaine 3 — Progression des Charges (+1 à 2 kg)', focusNote: 'Augmentez légèrement vos haltères pour stimuler la tonicité.' },
        { title: 'Semaine 4 — Ancrage & Vitalité', focusNote: 'Savourez vos progrès d’endurance et de maintien postural !' },
      ]
    ),
  },

  // 5. Performance / Spécifique — Objectif Tractions & Haut du Corps (8 semaines)
  {
    id: 'prog-objectif-tractions-8w',
    title: 'Objectif Tractions & Force Athlétique',
    subtitle: 'Débloquez vos premières tractions strictes tout en sculptant le bas du corps',
    objective: 'performance',
    objectiveLabel: 'Performance / Spécifique',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    level: 'Avancé',
    coverImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=900&q=80',
    equipment: ['Bandes de résistance', 'Machines', 'Haltères', 'Poids du corps'],
    description:
      'Programme spécifique de force relative : travail excentrique, tirages lourds, gainage Hollow Body et maintien du galbe bas du corps pour réussir vos tractions strictes.',
    coachTips: [
      'Engagez toujours vos omoplates vers le bas (dépression scapulaire) avant de fléchir les coudes.',
      'Le gainage Hollow Body en Finisher est le secret d’un transfert de force optimal à la barre fixe.',
    ],
    weeks: generateProgramWeeks(
      8,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Force Tirage Vertical & Scapula',
          isRest: false,
          activityType: 'Séance Dos',
          routineId: 'routine-back-v-shape',
          workoutTitle: 'Dos & Silhouette V-Shape (Force Tractions)',
          targetZone: 'back',
          durationMinutes: 50,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Puissance Bas du Corps & Explosivité',
          isRest: false,
          activityType: 'Séance Fessiers',
          routineId: 'routine-glutes-focus',
          workoutTitle: 'Booty Sculpt & Puissance Hanches',
          targetZone: 'lower-body',
          durationMinutes: 50,
          finisherPresetId: 'finisher-challenge-100-reps',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Bras, Épaules & Gainage Strict',
          isRest: false,
          activityType: 'Séance Bras',
          routineId: 'routine-shoulders-arms',
          workoutTitle: 'Épaules Galbées & Force Biceps/Dos',
          targetZone: 'arms',
          durationMinutes: 45,
          finisherPresetId: 'finisher-plank-no-pause-3m',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      []
    ),
  },

  // 6. Performance / Spécifique — Cardio Express & Endurance (4 semaines)
  {
    id: 'prog-cardio-express-4w',
    title: 'Cardio Express & Souffle Athlétique',
    subtitle: 'Boostez votre VO2max et votre endurance en séances courtes de 35 min',
    objective: 'performance',
    objectiveLabel: 'Performance / Spécifique',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    level: 'Intermédiaire',
    coverImage: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80',
    equipment: ['Machines', 'Poids du corps'],
    description:
      '4 semaines d’entraînement cardio structuré (Pyramides, StairMaster HIIT, 12-5-30 et Core athlétique) pour transformer votre souffle, votre récupération et votre explosivité.',
    coachTips: [
      'Surveillez votre récupération cardiaque entre les intervalles : plus votre pouls redescend vite en 20s, plus votre condition progresse.',
    ],
    weeks: generateProgramWeeks(
      4,
      [
        {
          dayNumber: 1,
          label: 'Jour 1 — Marche Inclinée 12-5-30 & Core',
          isRest: false,
          activityType: 'Cardio',
          routineId: 'routine-cardio-incline-walk',
          workoutTitle: 'Circuit Cardio : Marche Inclinée 12-5-30',
          targetZone: 'cardio',
          durationMinutes: 35,
          finisherPresetId: 'finisher-plank-no-pause-3m',
        },
        {
          dayNumber: 2,
          label: 'Jour 2 — StairMaster Booty Burner HIIT',
          isRest: false,
          activityType: 'Cardio',
          routineId: 'routine-cardio-stairmaster-booty',
          workoutTitle: 'Circuit Cardio : StairMaster Booty Burner (20 min)',
          targetZone: 'cardio',
          durationMinutes: 35,
          finisherPresetId: 'finisher-tabata-core-30-15',
        },
        {
          dayNumber: 3,
          label: 'Jour 3 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 4,
          label: 'Jour 4 — Sprints Fractionnés HIIT Tapis',
          isRest: false,
          activityType: 'HIIT',
          routineId: 'routine-cardio-hiit-treadmill',
          workoutTitle: 'Circuit Cardio : Fractionné HIIT Sprints Tapis',
          targetZone: 'cardio',
          durationMinutes: 30,
          finisherPresetId: 'finisher-pyramide-sprint-4m',
        },
        {
          dayNumber: 5,
          label: 'Jour 5 — Elliptique, Rameur 500m & Abdos',
          isRest: false,
          activityType: 'Cardio',
          routineId: 'routine-cardio-elliptical-rower',
          workoutTitle: 'Circuit Cardio : Pyramide Elliptique & Rameur 500m',
          targetZone: 'cardio',
          durationMinutes: 35,
          finisherPresetId: 'finisher-challenge-100-reps',
        },
        {
          dayNumber: 6,
          label: 'Jour 6 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
        {
          dayNumber: 7,
          label: 'Jour 7 — Repos',
          isRest: true,
          activityType: 'Repos',
        },
      ],
      []
    ),
  },
];
