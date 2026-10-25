import { Exercise, Routine, SpecificMuscleGroup } from '../types/fitness';
import { REQUESTED_EXERCISES } from './requestedExercises';

export const DEFAULT_EXERCISES: Exercise[] = [
  // ==========================================
  // 1. FESSIERS (Glutes)
  // ==========================================
  {
    id: 'hip-thrust-barbell',
    name: 'Hip Thrust à la barre',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Fessiers (Grand fessier)',
    secondaryMuscles: ['Ischio-jambiers', 'Quadriceps'],
    equipment: 'barbell',
    description: 'L’exercice roi pour l’hypertrophie et le galbe fessier. Tension maximale au sommet en extension complète de hanche.',
    startingPosition: 'Haut du dos calé contre un banc stable (sous les omoplates), barre capitonnée sur le pli de la hanche, pieds à plat écartés largeur des épaules.',
    steps: [
      'Ancrez fermement vos talons dans le sol et gardez le menton rentré vers la poitrine.',
      'Poussez par les talons pour élever le bassin jusqu’à ce que le tronc et les cuisses forment une ligne horizontale.',
      'Contractez puissamment les fessiers au sommet pendant 1 à 2 secondes sans cambrer le bas du dos.',
      'Redescendez de manière contrôlée sans relâcher la tension.'
    ],
    breathing: 'Inspirez à la descente, expirez puissamment en fin de montée.',
    formTips: [
      'Gardez le regard vers l’avant (menton rentré) pour protéger vos lombaires.',
      'Genoux alignés avec la pointe des pieds, tibias verticaux au sommet.'
    ],
    commonMistakes: [
      'Hyperextension lombaire en haut du mouvement.',
      'Pousser sur la pointe des pieds plutôt que sur les talons.'
    ],
    avoidTips: [
      'Ne regardez pas le plafond au sommet, cela cambre excessivement le dos.',
      'Ne prenez pas une barre sans manchon de protection pour le bassin.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
  },
  {
    id: 'hip-thrust-machine',
    name: 'Hip Thrust à la machine guidée',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Fessiers (Grand fessier)',
    secondaryMuscles: ['Ischio-jambiers'],
    equipment: 'machine',
    description: 'La version guidée avec ceinture ventrale, idéale pour surcharger en toute sécurité sans instabilité.',
    startingPosition: 'Assise dans la machine, sangle ventrale solidement ajustée, pieds positionnés sur le plateau à largeur d’épaules.',
    steps: [
      'Déverrouillez le levier de sécurité avec les mains tout en maintenant la tension.',
      'Poussez par les talons jusqu’à aligner les hanches avec les genoux.',
      'Marquez un temps d’arrêt d’une seconde au sommet en contractant les fessiers.',
      'Freinez la descente sur 2 secondes complètes.'
    ],
    breathing: 'Expirez à la montée, inspirez à la descente.',
    formTips: ['Ajustez bien la sangle pour qu’elle repose sur le pubis sans comprimer le ventre.'],
    commonMistakes: ['Rétroversion insuffisante en haut de mouvement.'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Fentes bulgares aux haltères',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Fessiers & Quadriceps',
    secondaryMuscles: ['Ischio-jambiers', 'Adducteurs'],
    equipment: 'dumbbell',
    description: 'Mouvement unilatéral majeur pour corriger les asymétries et sculpter le pli sous-fessier.',
    startingPosition: 'Debout, un pied en appui sur un banc derrière vous, le pied avant avancé avec écartement suffisant.',
    steps: [
      'Tenez un haltère dans chaque main, buste penché à 30-45° pour privilégier le grand fessier.',
      'Fléchissez le genou avant pour descendre jusqu’à ce que la cuisse avant soit parallèle au sol.',
      'Poussez fort sur le talon avant pour remonter de manière fluide.'
    ],
    breathing: 'Inspirez en descendant, expirez en remontant.',
    formTips: [
      'Une légère inclinaison du torse reporte la tension sur le grand fessier.',
      'Pieds sur deux rails parallèles (largeur de hanches) pour la stabilité.'
    ],
    commonMistakes: [
      'Pied avant trop proche du banc comprimant le genou.',
      'Garder le buste hyper vertical si l’objectif est le fessier.'
    ],
    defaultSets: 3,
    defaultReps: '10-12 / jambe',
    defaultRestSeconds: 75,
  },
  {
    id: 'cable-glute-kickback',
    name: 'Kickback fessier à la poulie basse',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier (Partie supérieure)',
    secondaryMuscles: ['Moyen fessier'],
    equipment: 'cable',
    description: 'Isolation pure pour cibler le haut et le galbe arrondi du fessier sans charger la colonne.',
    startingPosition: 'Face à la poulie basse, sangle chevillère attachée, buste penché à 45° en appui sur la structure.',
    steps: [
      'Envoyez le talon vers l’arrière et légèrement vers l’extérieur en contractant le fessier.',
      'Bloquez une seconde en contraction maximale sans cambrer le bas du dos.',
      'Revenez lentement à la position initiale.'
    ],
    breathing: 'Expirez lors de l’extension de jambe, inspirez au retour.',
    formTips: ['Gardez la jambe d’appui légèrement fléchie pour préserver l’articulation.'],
    commonMistakes: ['Donner un coup de rein pour lancer la charge.'],
    defaultSets: 3,
    defaultReps: '12-15 / jambe',
    defaultRestSeconds: 60,
  },
  {
    id: 'hip-abduction-machine',
    name: 'Abduction assise à la machine',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Moyen & Petit fessier',
    secondaryMuscles: ['Tenseur du fascia lata'],
    equipment: 'machine',
    description: 'Indispensable pour élargir le haut des hanches et galber le côté des fessiers.',
    startingPosition: 'Assise au fond du siège, coussins calés contre l’extérieur des genoux, buste droit ou légèrement penché vers l’avant.',
    steps: [
      'Écartez puissamment les cuisses vers l’extérieur en poussant avec les genoux.',
      'Maintenez l’écartement maximal pendant 1 seconde.',
      'Freinez le retour sans laisser les poids s’entrechoquer.'
    ],
    breathing: 'Expirez en écartant, inspirez en refermant.',
    formTips: ['Se pencher légèrement en avant active davantage les fibres supérieures du moyen fessier.'],
    commonMistakes: ['Pousser avec les pieds plutôt qu’avec les genoux.'],
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRestSeconds: 60,
  },
  {
    id: 'step-ups-dumbbell',
    name: 'Step-ups sur banc avec haltères',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier',
    secondaryMuscles: ['Quadriceps', 'Ischios'],
    equipment: 'dumbbell',
    description: 'Montée sur banc avec temps sous tension unilatéral élevé pour étirer et contracter le fessier.',
    startingPosition: 'Debout face à un banc stable à hauteur de genoux, un haltère dans chaque main.',
    steps: [
      'Posez le pied entier sur le banc.',
      'Poussez exclusivement avec la jambe avant pour vous hisser, sans prendre d’impulsion avec le pied arrière.',
      'Contrôlez la descente sur 3 secondes complètes jusqu’à effleurer le sol.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant lentement.',
    formTips: ['Ne donnez aucun coup de pied avec le pied du sol pour garantir 100% de recrutement.'],
    commonMistakes: ['Banc trop haut provoquant une bascule du bassin.'],
    defaultSets: 3,
    defaultReps: '10-12 / jambe',
    defaultRestSeconds: 75,
  },
  {
    id: 'kas-glute-bridge',
    name: 'Kas Glute Bridge aux haltères',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Fessiers (Isolation ciblée)',
    secondaryMuscles: ['Ischio-jambiers'],
    equipment: 'dumbbell',
    description: 'Variante à amplitude courte du Hip Thrust focalisée uniquement sur la contraction maximale.',
    startingPosition: 'Haut du dos sur le banc, haltère lourd sur le pli de hanche, pieds sous les genoux.',
    steps: [
      'Descendez le bassin de 15 à 20 cm seulement (sans descendre tout en bas).',
      'Remontez en contractant violemment les fessiers au sommet.',
      'Maintenez un tempo continu sans relâcher la tension.'
    ],
    breathing: 'Respiration rythmée, expiration au sommet.',
    formTips: ['Ne laissez jamais les quadriceps prendre le relais, l’amplitude est réduite exprès.'],
    commonMistakes: ['Vouloir descendre jusqu’au sol comme un hip thrust classique.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'walking-lunges-dumbbell',
    name: 'Fentes marchées aux haltères',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Fessiers & Ischios',
    secondaryMuscles: ['Quadriceps', 'Mollets'],
    equipment: 'dumbbell',
    description: 'Marche avant rythmée en fentes pour une dépense métabolique et une brûlure fessière intenses.',
    startingPosition: 'Debout un haltère dans chaque main, espace dégagé devant vous.',
    steps: [
      'Faites un grand pas vers l’avant et descendez le genou arrière près du sol.',
      'Buste légèrement penché vers l’avant pour charger le fessier avant.',
      'Poussez par le talon avant pour enchaîner directement sur la jambe suivante.'
    ],
    breathing: 'Inspirez à chaque pas, expirez en vous redressant.',
    formTips: ['Faites des pas longs pour cibler les fessiers plutôt que les quadriceps.'],
    commonMistakes: ['Pas trop courts qui surmènent les genoux.'],
    defaultSets: 3,
    defaultReps: '20 pas au total',
    defaultRestSeconds: 75,
  },

  // ==========================================
  // 2. QUADRICEPS (Quads)
  // ==========================================
  {
    id: 'leg-press',
    name: 'Presse à cuisses 45°',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps complets',
    secondaryMuscles: ['Fessiers', 'Adducteurs'],
    equipment: 'machine',
    description: 'La machine reine pour développer la masse et la puissance des cuisses en toute stabilité.',
    startingPosition: 'Assise fond de siège, dos collé, pieds positionnés au milieu du plateau selon la zone ciblée.',
    steps: [
      'Déverrouillez les poignées latérales tout en maintenant le plateau.',
      'Fléchissez les genoux pour faire descendre la charge sans décoller le bassin du siège.',
      'Poussez avec la force des cuisses jusqu’à extension presque complète (sans verrouiller les genoux).'
    ],
    breathing: 'Inspirez à la descente, expirez pendant la poussée.',
    formTips: [
      'Conservez toujours un micro-fléchissement en haut pour préserver les articulations.',
      'Pieds au milieu ou bas sur le plateau pour maximiser le recrutement des quadriceps.'
    ],
    commonMistakes: ['Décoller les fesses du dossier en bas de mouvement.'],
    avoidTips: ['Ne verrouillez JAMAIS les genoux en extension complète sous charge lourde.'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    hasFootPlacementGuide: true,
  },
  {
    id: 'hack-squat-machine',
    name: 'Hack Squat guidé',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps (Vastes & Droit fémoral)',
    secondaryMuscles: ['Fessiers'],
    equipment: 'machine',
    description: 'Machine inclinée qui isole les quadriceps grâce à un dossier ergonomique qui sécurise la colonne.',
    startingPosition: 'Épaules calées sous les manchons, dos plaqué contre le dossier, pieds au centre du plateau.',
    steps: [
      'Déclenchez les loquets de sécurité.',
      'Descendez en fléchissant les genoux jusqu’à former un angle de 90° à la hanche.',
      'Poussez fort sur le plateau pour revenir sans bloquer les genoux en haut.'
    ],
    breathing: 'Inspirez à la descente, expirez puissamment à la remontée.',
    formTips: ['Gardez les talons collés au plateau tout au long du mouvement.'],
    commonMistakes: ['Descendre trop bas si la cheville manque de mobilité, provoquant un décollement du talon.'],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
  },
  {
    id: 'leg-extension-machine',
    name: 'Leg Extension assis à la machine',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps (Isolation du droit fémoral)',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'Exercice d’isolation par excellence pour dessiner et découper l’avant des cuisses.',
    startingPosition: 'Assise calée, coussin d’appui réglé juste au-dessus des chevilles, genoux alignés avec l’axe de rotation.',
    steps: [
      'Tenez fermement les poignées latérales pour vous plaquer au siège.',
      'Étendez les jambes vers le haut de façon fluide jusqu’à extension complète.',
      'Marquez une pause de 1 seconde en haut pour contracter les cuisses.',
      'Redescendez avec contrôle sans laisser les plaques claquer.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Réglez le dossier pour que le creux poplité (derrière le genou) effleure le bord du siège.'],
    commonMistakes: ['Donner des à-coups violents pour soulever une charge trop lourde.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'goblet-squat-dumbbell',
    name: 'Goblet Squat avec haltère',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Fessiers', 'Abdominaux'],
    equipment: 'dumbbell',
    description: 'Squat avec charge contre la poitrine qui encourage une posture verticale parfaite et un travail profond des cuisses.',
    startingPosition: 'Debout pieds écartés largeur d’épaules, un haltère tenu verticalement à deux mains contre le haut du thorax.',
    steps: [
      'Initiez la descente en poussant les hanches vers l’arrière et les genoux vers l’extérieur.',
      'Descendez jusqu’à ce que vos coudes viennent effleurer l’intérieur des genoux.',
      'Repoussez le sol par le milieu du pied et les talons pour remonter.'
    ],
    breathing: 'Inspirez en descendant, expirez en remontant.',
    formTips: ['Le buste reste haut et fier, ne laissez pas l’haltère vous courber vers l’avant.'],
    commonMistakes: ['Genoux qui s’affaissent vers l’intérieur à la remontée.'],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 75,
  },
  {
    id: 'smith-machine-squat',
    name: 'Squat à la barre guidée (Smith Machine)',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Fessiers'],
    equipment: 'machine',
    description: 'Squat sur rail fixe permettant de placer les pieds légèrement en avant pour focaliser 100% de la charge sur les quadriceps.',
    startingPosition: 'Barre posée sur les trapèzes, pieds avancés de 20 cm par rapport à l’axe de la barre.',
    steps: [
      'Faites pivoter la barre pour débloquer les crans.',
      'Fléchissez les genoux avec un tronc très droit grâce à la trajectoire guidée.',
      'Poussez jusqu’à la position haute sans verrouillage articulaire.'
    ],
    breathing: 'Inspirez en descendant, expirez en montant.',
    formTips: ['Pieds légèrement en avant pour soulager les lombaires et charger les quadriceps.'],
    commonMistakes: ['Pieds trop en arrière forçant une flexion excessive du buste.'],
    defaultSets: 4,
    defaultReps: '10',
    defaultRestSeconds: 90,
  },
  {
    id: 'sissy-squat',
    name: 'Sissy Squat au poids du corps',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps (Étirement maximal)',
    secondaryMuscles: ['Fléchisseurs de hanche'],
    equipment: 'bodyweight',
    description: 'Mouvement d’étirement pur des quadriceps, buste et cuisses alignés.',
    startingPosition: 'Debout en appui léger d’une main sur un support fixe, pieds largeur de hanches.',
    steps: [
      'Montez sur la pointe des pieds et penchez le buste vers l’arrière en ligne droite.',
      'Fléchissez les genoux vers l’avant tout en maintenant le bassin verrouillé.',
      'Poussez avec l’avant des cuisses pour revenir en position initiale.'
    ],
    breathing: 'Inspirez à la flexion, expirez en poussant.',
    formTips: ['Conservez les abdominaux engagés pour éviter toute cambrure lombaire.'],
    commonMistakes: ['Casser l’alignement hanches-épaules.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 3. ISCHIOS (Hamstrings)
  // ==========================================
  {
    id: 'romanian-deadlift',
    name: 'Soulevé de terre roumain (RDL aux haltères)',
    category: 'lower-body',
    specificMuscle: 'ischios',
    primaryMuscle: 'Ischio-jambiers & Fessiers',
    secondaryMuscles: ['Lombaires', 'Trapèzes'],
    equipment: 'dumbbell',
    description: 'Le maître étirement sous tension de l’arrière des cuisses et du grand fessier.',
    startingPosition: 'Debout, pieds écartés largeur des hanches, un haltère tenu devant chaque cuisse, épaules basses.',
    steps: [
      'Poussez les hanches en arrière comme pour fermer une porte avec vos fesses, genoux très légèrement déverrouillés.',
      'Faites glisser les haltères le long des cuisses et des tibias jusqu’à sentir un étirement profond des ischios.',
      'Gardez le dos parfaitement plat et le regard neutre.',
      'Contractez les fessiers et ramenez les hanches vers l’avant pour vous redresser.'
    ],
    breathing: 'Inspirez à la descente, expirez en revenant en position debout.',
    formTips: ['Ce n’est pas un squat : les genoux plient à peine, c’est le bassin qui recule.'],
    commonMistakes: ['Arrondir le dos au point bas par excès d’amplitude.'],
    avoidTips: ['Ne descendez pas plus bas que ce que votre souplesse lombaire permet.'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
  },
  {
    id: 'lying-leg-curl',
    name: 'Leg Curl allongé à la machine',
    category: 'lower-body',
    specificMuscle: 'ischios',
    primaryMuscle: 'Ischio-jambiers (Chef court & long)',
    secondaryMuscles: ['Mollets'],
    equipment: 'machine',
    description: 'Flexion de genou allongée pour isoler la chaîne postérieure en toute sécurité articulaire.',
    startingPosition: 'Allongée sur le ventre, coussin de poussée placé sous les mollets (au-dessus du talon d’Achille), poignées en main.',
    steps: [
      'Fléchissez les genoux pour amener le boudin vers les fessiers de manière dynamique.',
      'Contractez fortement l’arrière des cuisses au point haut pendant 1 seconde.',
      'Contrôlez la redescente sur 2 à 3 secondes complètes.'
    ],
    breathing: 'Expirez à la flexion, inspirez au retour contrôlé.',
    formTips: ['Gardez les hanches plaquées au banc, ne cambrez pas pour tricher.'],
    commonMistakes: ['Décoller le bassin du banc pendant l’effort.'],
    defaultSets: 4,
    defaultReps: '12',
    defaultRestSeconds: 60,
  },
  {
    id: 'seated-leg-curl',
    name: 'Leg Curl assis à la machine',
    category: 'lower-body',
    specificMuscle: 'ischios',
    primaryMuscle: 'Ischio-jambiers (Étirement fémoral supérieur)',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'Grâce à la flexion de hanche assise, les ischios sont étirés dès le départ, ce qui optimise l’hypertrophie.',
    startingPosition: 'Assise, coussin supérieur verrouillé au-dessus des cuisses, boudin arrière au-dessus des talons.',
    steps: [
      'Poussez le boudin vers le bas et l’arrière en contractant les ischios.',
      'Descendez au maximum puis freinez la remontée lentement.',
    ],
    breathing: 'Expirez en fléchissant les jambes, inspirez en laissant remonter.',
    formTips: ['Penchez légèrement le buste en avant pour accentuer l’étirement de hanche.'],
    commonMistakes: ['Laisser le boudin remonter avec violence.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'stiff-leg-deadlift',
    name: 'Soulevé de terre jambes tendues à la barre',
    category: 'lower-body',
    specificMuscle: 'ischios',
    primaryMuscle: 'Ischio-jambiers',
    secondaryMuscles: ['Fessiers', 'Lombaires'],
    equipment: 'barbell',
    description: 'Variante avec genoux quasi fixes accentuant la tension pure sur les ischios-jambiers.',
    startingPosition: 'Debout barre tenue en pronation devant les cuisses, genoux micro-fléchis et immobiles.',
    steps: [
      'Basculez le buste en avant en poussant le bassin vers l’arrière.',
      'Descendez la barre sous les genoux avec un dos droit comme une table.',
      'Tirez avec la chaîne postérieure pour revenir droit.'
    ],
    breathing: 'Inspirez à la descente, expirez en haut.',
    formTips: ['Fixez les omoplates vers le bas et l’arrière.'],
    commonMistakes: ['Plier les genoux pendant la descente comme un soulevé classique.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 90,
  },

  // ==========================================
  // 4. ADDUCTEURS (Adductors)
  // ==========================================
  {
    id: 'adductor-machine',
    name: 'Machine à adducteurs assise',
    category: 'lower-body',
    specificMuscle: 'adducteurs',
    primaryMuscle: 'Adducteurs (Grand, Long & Court)',
    secondaryMuscles: ['Gracile'],
    equipment: 'machine',
    description: 'Isolation mécanique directe de l’intérieur des cuisses pour raffermir et tonifier.',
    startingPosition: 'Assise bien droite, jambes écartées, coussins d’appui calés à l’intérieur des genoux.',
    steps: [
      'Resserrez les cuisses jusqu’à ce que les coussins se touchent.',
      'Maintenez la contraction 1 seconde.',
      'Ouvrez lentement avec contrôle pour profiter de l’étirement.'
    ],
    breathing: 'Expirez en resserrant les genoux, inspirez en écartant.',
    formTips: ['Gardez le dos calé au dossier sans avancer le buste.'],
    commonMistakes: ['Amplitude trop courte avec charge démesurée.'],
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRestSeconds: 60,
  },
  {
    id: 'sumo-squat-dumbbell',
    name: 'Squat Sumo avec haltère ou kettlebell',
    category: 'lower-body',
    specificMuscle: 'adducteurs',
    primaryMuscle: 'Adducteurs & Grand fessier',
    secondaryMuscles: ['Quadriceps'],
    equipment: 'dumbbell',
    description: 'Pieds très écartés pointes à 45° pour solliciter l’intérieur des cuisses et le dessous des fessiers.',
    startingPosition: 'Debout pieds au-delà de la largeur des épaules, pointes ouvertes, haltère tenu à deux mains entre les jambes.',
    steps: [
      'Descendez en ouvrant activement les genoux vers l’extérieur.',
      'Descendez jusqu’à ce que les cuisses soient parallèles au sol.',
      'Remontez en serrant l’intérieur des cuisses et les fesses.'
    ],
    breathing: 'Inspirez en descendant, expirez en montant.',
    formTips: ['Les genoux doivent toujours pointer dans la même direction que les orteils.'],
    commonMistakes: ['Genoux qui rentrent vers l’intérieur à la remontée.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 75,
  },
  {
    id: 'cossack-squat',
    name: 'Fentes latérales (Cossack Squats)',
    category: 'lower-body',
    specificMuscle: 'adducteurs',
    primaryMuscle: 'Adducteurs & Mobilité de hanche',
    secondaryMuscles: ['Fessiers', 'Quadriceps'],
    equipment: 'bodyweight',
    description: 'Descente unilatérale sur le côté permettant un étirement dynamique profond de l’adducteur opposé.',
    startingPosition: 'Debout pieds très écartés (double largeur d’épaules).',
    steps: [
      'Fléchissez le genou droit et descendez le bassin sur le côté droit.',
      'La jambe gauche reste tendue avec la pointe de pied relevée vers le plafond.',
      'Poussez sur le talon droit pour revenir au centre, puis alternez.'
    ],
    breathing: 'Inspirez en descendant, expirez en revenant au centre.',
    formTips: ['Gardez le torse le plus redressé possible.'],
    commonMistakes: ['Décoller le talon de la jambe fléchie.'],
    defaultSets: 3,
    defaultReps: '10 par côté',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 5. GRAND DORSAL (Lats / V-Shape)
  // ==========================================
  {
    id: 'lat-pulldown',
    name: 'Tirage vertical poitrine prise large (Lat Pulldown)',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal',
    secondaryMuscles: ['Biceps', 'Rhomboïdes'],
    equipment: 'cable',
    description: 'L’exercice incontournable pour développer la largeur du dos et affiner la taille par illusion d’optique.',
    startingPosition: 'Assise à la poulie haute, cuisses calées sous les boudins, barre tenue en prise large (mains au-delà des épaules).',
    steps: [
      'Buste très légèrement incliné vers l’arrière (10°), poitrine fière sortie.',
      'Tirez la barre vers le haut de la poitrine en pensant à conduire le mouvement avec vos coudes vers le bas.',
      'Resserrez les omoplates au point bas.',
      'Remontez avec contrôle en laissant les dorsaux s’étirer complètement en haut.'
    ],
    breathing: 'Expirez en tirant la barre vers la poitrine, inspirez en remontant.',
    formTips: [
      'Pensez « coudes dans les poches arrière » pour recruter le grand dorsal plutôt que les bras.',
      'Ne tirez jamais la barre derrière la nuque.'
    ],
    commonMistakes: [
      'Balancement exagéré du buste d’avant en arrière.',
      'Tirer uniquement avec les biceps.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 'neutral-grip-pulldown',
    name: 'Tirage vertical prise neutre serrée',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal (Fibres basses)',
    secondaryMuscles: ['Biceps', 'Brachial'],
    equipment: 'cable',
    description: 'Prise triangle ou poignée double neutre pour cibler le bas des dorsaux et protéger les épaules.',
    startingPosition: 'Assise calée, poignée en V tenue à deux mains, paumes face à face.',
    steps: [
      'Tirez la poignée vers le haut du sternum en gardant les coudes près du corps.',
      'Serrez fort les dorsaux en bas.',
      'Relâchez lentement pour sentir l’étirement sous les aisselles.'
    ],
    breathing: 'Expirez à la traction, inspirez au retour.',
    formTips: ['La prise neutre offre un bras de levier parfait pour les personnes sensibles des épaules.'],
    commonMistakes: ['Arrondir les épaules vers l’avant en fin de tirage.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 'cable-pullover',
    name: 'Pull-over à la poulie haute avec corde',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal (Isolation pure)',
    secondaryMuscles: ['Triceps chef long', 'Grand rond'],
    equipment: 'cable',
    description: 'Isolation sans intervention des biceps, sensation directe de balayage du grand dorsal.',
    startingPosition: 'Debout face à la poulie haute, buste incliné à 30°, corde tenue à deux mains bras presque tendus.',
    steps: [
      'Abaissez les mains vers les cuisses en décrivant un arc de cercle avec les bras.',
      'Écartez légèrement la corde en arrivant aux cuisses pour accentuer la contraction.',
      'Remontez les mains au-dessus de la tête pour un étirement complet.'
    ],
    breathing: 'Expirez en abaissant les bras, inspirez en remontant.',
    formTips: ['Gardez un micro-fléchissement aux coudes tout au long de l’arc.'],
    commonMistakes: ['Plier les coudes comme une extension triceps.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'assisted-pullups',
    name: 'Tractions assistées à la machine',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal complet',
    secondaryMuscles: ['Biceps', 'Trapèzes moyens'],
    equipment: 'machine',
    description: 'Apprentissage et surcharge du mouvement de traction avec contrepoids réglable.',
    startingPosition: 'Genoux ou pieds sur la plateforme d’assistance, prise large pronation.',
    steps: [
      'Hissez-vous en tirant la poitrine vers la barre.',
      'Passez le menton au-dessus de la barre sans cambrer.',
      'Contrôlez la descente jusqu’à bras presque tendus.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Plus le contrepoids sélectionné est lourd, plus l’exercice est facile.'],
    commonMistakes: ['Donner des coups de genoux pour monter.'],
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
  },

  // ==========================================
  // 6. MILIEU DU DOS (Mid-Back / Rhomboids)
  // ==========================================
  {
    id: 'seated-cable-row',
    name: 'Tirage horizontal poulie basse (Seated Row)',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Rhomboïdes & Épaisseur du dos',
    secondaryMuscles: ['Grand dorsal', 'Trapèzes', 'Biceps'],
    equipment: 'cable',
    description: 'Le constructeur d’épaisseur par excellence. Resserrement maximal des omoplates.',
    startingPosition: 'Assise sur le banc de tirage, pieds calés sur les repose-pieds, genoux souples, dos droit.',
    steps: [
      'Saisissez la poignée en V, buste droit perpendiculaire au banc.',
      'Tirez la poignée vers le nombril en tirant les coudes loin vers l’arrière.',
      'Pincez fermement les omoplates l’une contre l’autre pendant 1 seconde.',
      'Laissez les bras s’étendre vers l’avant en gardant le tronc stable.'
    ],
    breathing: 'Expirez en tirant vers l’abdomen, inspirez au retour.',
    formTips: ['Ne balancez pas le tronc d’avant en arrière : le mouvement part des omoplates.'],
    commonMistakes: ['Enrouler les épaules vers l’avant en relâchant.'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 'chest-supported-row',
    name: 'Rowing aux haltères sur banc incliné (Chest-Supported)',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Rhomboïdes & Trapèzes moyens',
    secondaryMuscles: ['Arrière d’épaule'],
    equipment: 'dumbbell',
    description: 'La poitrine étant calée sur un banc incliné à 30-45°, les lombaires sont totalement soulagées.',
    startingPosition: 'À plat ventre sur un banc incliné, un haltère dans chaque main, bras pendants vers le sol.',
    steps: [
      'Tirez les haltères vers les hanches en serrant les omoplates.',
      'Marquez une pause au sommet sans décoller la poitrine du banc.',
      'Redescendez avec contrôle.'
    ],
    breathing: 'Expirez à la traction, inspirez à la descente.',
    formTips: ['Ouvrez légèrement les coudes à 45° pour viser le milieu du dos.'],
    commonMistakes: ['Décoller le buste du banc pour tricher avec le bas du dos.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 't-bar-row',
    name: 'Rowing T-Bar à la machine',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Milieu du dos & Épaisseur',
    secondaryMuscles: ['Grand dorsal', 'Lombaires'],
    equipment: 'machine',
    description: 'Prise neutre solide pour manipuler des charges progressives sur le haut et le milieu du dos.',
    startingPosition: 'Debout penchée ou calée sur le support, poignées fermes, dos verrouillé plat.',
    steps: [
      'Tirez la charge vers le haut en ouvrant la poitrine.',
      'Bloquez en haut en serrant le dos.',
      'Contrôlez la descente sans relâcher la colonne.'
    ],
    breathing: 'Expirez en tirant, inspirez en descendant.',
    formTips: ['Conservez les abdominaux bien gainés.'],
    commonMistakes: ['Arrondir le dos sous une charge excessive.'],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
  },

  // ==========================================
  // 7. LOMBAIRES (Lower Back)
  // ==========================================
  {
    id: 'hyperextensions-bench',
    name: 'Banc à lombaires 45° (Hyperextensions)',
    category: 'back',
    specificMuscle: 'lombaires',
    primaryMuscle: 'Lombaires (Érecteurs du rachis)',
    secondaryMuscles: ['Fessiers', 'Ischio-jambiers'],
    equipment: 'bodyweight',
    description: 'Renforcement postural essentiel pour stabiliser le bassin et prévenir les douleurs du bas du dos.',
    startingPosition: 'Bassin calé contre le coussin supérieur (sous la crête iliaque), talons calés contre les boudins inférieurs.',
    steps: [
      'Croisez les bras sur la poitrine ou tenez un disque léger.',
      'Fléchissez le buste vers le bas jusqu’à 60-70°.',
      'Remontez en contractant les lombaires et les fessiers jusqu’à aligner le tronc avec les jambes.',
      'Ne partez pas en hyper-extension arrière.'
    ],
    breathing: 'Inspirez à la descente, expirez en remontant.',
    formTips: ['Arrêtez la montée dès que votre corps forme une ligne droite, ne cambrez pas excessivement.'],
    commonMistakes: ['Lancer la tête en arrière avec à-coups.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'bird-dog-weighted',
    name: 'Bird-Dog gainé avec petit haltère',
    category: 'back',
    specificMuscle: 'lombaires',
    primaryMuscle: 'Muscles érecteurs du rachis profonds',
    secondaryMuscles: ['Fessiers', 'Épaules'],
    equipment: 'dumbbell',
    description: 'Stabilité vertébrale pure sans compression sur les disques intervertébraux.',
    startingPosition: 'À quatre pattes sur tapis, mains sous les épaules, genoux sous les hanches.',
    steps: [
      'Tendez le bras droit devant vous et la jambe gauche derrière vous en ligne horizontale.',
      'Maintenez 2 secondes en contractant le bas du dos et le fessier.',
      'Revenez lentement sans toucher le sol et répétez.'
    ],
    breathing: 'Respiration fluide et continue.',
    formTips: ['Imaginez un verre d’eau posé sur votre dos : il ne doit pas se renverser.'],
    commonMistakes: ['Tourner les hanches sur le côté.'],
    defaultSets: 3,
    defaultReps: '12 par côté',
    defaultRestSeconds: 45,
  },

  // ==========================================
  // 8. TRAPÈZES & ARRIÈRE D'ÉPAULE
  // ==========================================
  {
    id: 'face-pull-rope',
    name: 'Face Pull à la corde poulie haute',
    category: 'back',
    specificMuscle: 'trapezes-arriere-epaule',
    primaryMuscle: 'Arrière d’épaule & Trapèzes moyens/inférieurs',
    secondaryMuscles: ['Coiffe des rotateurs'],
    equipment: 'cable',
    description: 'Le mouvement d’or pour la santé des épaules et l’ouverture de la cage thoracique (adieu épaules enroulées).',
    startingPosition: 'Poulie réglée à hauteur du visage, corde tenue en prise neutre, reculez d’un pas.',
    steps: [
      'Tirez la corde vers votre nez/front en écartant les coudes bien haut.',
      'En fin de course, effectuez une rotation externe : les poings montent au-dessus des coudes.',
      'Pincez l’arrière des épaules pendant 1 seconde avant de relâcher lentement.'
    ],
    breathing: 'Expirez en tirant vers le visage, inspirez au retour.',
    formTips: ['Pensez à tirer avec les coudes hauts et écartés.'],
    commonMistakes: ['Prendre trop lourd et se pencher en arrière pour compenser.'],
    defaultSets: 3,
    defaultReps: '15',
    defaultRestSeconds: 60,
  },
  {
    id: 'reverse-pec-deck',
    name: 'Oiseau à la machine (Reverse Pec Deck)',
    category: 'back',
    specificMuscle: 'trapezes-arriere-epaule',
    primaryMuscle: 'Deltoïde postérieur (Arrière d’épaule)',
    secondaryMuscles: ['Rhomboïdes', 'Trapèzes'],
    equipment: 'machine',
    description: 'Isolation mécanique stricte de l’arrière d’épaule pour donner un galbe 3D à l’épaule vue de dos.',
    startingPosition: 'Poitrine calée contre le dossier, poignées horizontales en main, bras presque tendus devant vous.',
    steps: [
      'Écartez les bras vers l’arrière en arc de cercle.',
      'Contractez l’arrière des épaules sans hausser les trapèzes vers les oreilles.',
      'Freinez le retour.'
    ],
    breathing: 'Expirez en écartant, inspirez en refermant.',
    formTips: ['Gardez les épaules basses et les coudes à hauteur d’épaules.'],
    commonMistakes: ['Hausser les épaules et faire travailler les cervicales.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'dumbbell-rear-delt-fly',
    name: 'Élévations postérieures aux haltères buste penché',
    category: 'back',
    specificMuscle: 'trapezes-arriere-epaule',
    primaryMuscle: 'Arrière d’épaule & Trapèzes',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'Buste penché en avant, les haltères légers sont écartés pour sculpter l’arrière des deltoïdes.',
    startingPosition: 'Assise au bord d’un banc, buste reposé sur les cuisses, un haltère léger dans chaque main sous les genoux.',
    steps: [
      'Levez les bras sur les côtés comme des ailes d’oiseau.',
      'Sentez la brûlure sur la face arrière de l’épaule.',
      'Redescendez sans à-coups.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Gardez les petits doigts orientés vers le ciel en haut.'],
    commonMistakes: ['Donner une impulsion avec le dos.'],
    defaultSets: 3,
    defaultReps: '15',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 9. ÉPAULE (AVANT) (Front Delts)
  // ==========================================
  {
    id: 'overhead-press-dumbbell',
    name: 'Développé militaire assis aux haltères',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur (Épaule avant)',
    secondaryMuscles: ['Triceps', 'Haut des pectoraux'],
    equipment: 'dumbbell',
    description: 'Développé vertical sur banc à 75° pour construire la force et le galbe avant des épaules.',
    startingPosition: 'Assise sur un banc incliné à 75-80°, haltères au niveau des oreilles, coudes sous les poignets.',
    steps: [
      'Poussez les haltères au-dessus de la tête jusqu’à extension sans les entrechoquer.',
      'Redescendez avec contrôle jusqu’à ce que les haltères arrivent à hauteur du menton/oreilles.',
    ],
    breathing: 'Expirez en poussant, inspirez à la descente.',
    formTips: ['Gardez les coudes légèrement orientés vers l’avant (plan scapulaire) pour protéger l’articulation.'],
    commonMistakes: ['Cambrer le bas du dos sur le banc.'],
    defaultSets: 4,
    defaultReps: '10',
    defaultRestSeconds: 75,
  },
  {
    id: 'arnold-press',
    name: 'Développé Arnold aux haltères',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur & moyen',
    secondaryMuscles: ['Triceps'],
    equipment: 'dumbbell',
    description: 'Rotation fluide des paumes de mains pendant la poussée pour engager toutes les fibres avant.',
    startingPosition: 'Assise, haltères tenus devant la poitrine, paumes tournées vers vous.',
    steps: [
      'Poussez vers le haut en ouvrant les coudes et en tournant les paumes vers l’avant.',
      'Terminez bras tendus au-dessus de la tête.',
      'Inversez la rotation à la descente pour revenir paumes vers vous.'
    ],
    breathing: 'Expirez à la montée, inspirez à la descente.',
    formTips: ['La rotation doit être continue et fluide sans à-coups.'],
    commonMistakes: ['Prendre trop lourd au détriment de la rotation.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 'front-raise-cable',
    name: 'Élévations frontales à la poulie basse',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'Tension continue du début à la fin de la montée pour une congestion ciblée.',
    startingPosition: 'Dos à la poulie basse, corde ou barre tenue entre les jambes.',
    steps: [
      'Levez les bras devant vous jusqu’à hauteur des yeux.',
      'Marquez un temps d’arrêt d’une seconde.',
      'Freinez la descente.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Ne balancez pas le torse en arrière.'],
    commonMistakes: ['Monter plus haut que les yeux en sollicitant les trapèzes.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 10. ÉPAULE (CÔTÉ) (Lateral Delts / V-Taper)
  // ==========================================
  {
    id: 'lateral-raises-dumbbell',
    name: 'Élévations latérales strictes aux haltères',
    category: 'arms',
    specificMuscle: 'epaule-cote',
    primaryMuscle: 'Deltoïde latéral (Largeur d’épaules)',
    secondaryMuscles: ['Trapèzes'],
    equipment: 'dumbbell',
    description: 'L’exercice absolu pour sculpter des épaules rondes qui affinent la taille par contraste.',
    startingPosition: 'Debout pieds largeur d’épaules, buste très légèrement penché en avant (5°), haltères le long des cuisses.',
    steps: [
      'Élevez les bras sur les côtés jusqu’à la hauteur des épaules en guidant avec les coudes.',
      'Conservez un micro-fléchissement aux coudes.',
      'Bloquez une fraction de seconde au sommet.',
      'Redescendez lentement en retenant la charge sur 2 secondes.'
    ],
    breathing: 'Expirez en montant les bras, inspirez en redescendant.',
    formTips: [
      'Pensez à « pousser les murs » vers l’extérieur plutôt que de simplement lever les poids.',
      'Utilisez des charges modérées (3 à 6 kg) pour ne pas compenser avec les trapèzes.'
    ],
    commonMistakes: [
      'Prendre de l’élan avec les genoux et le dos.',
      'Monter les mains plus haut que les coudes.'
    ],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'cable-lateral-raise',
    name: 'Élévations latérales unilatérales à la poulie basse',
    category: 'arms',
    specificMuscle: 'epaule-cote',
    primaryMuscle: 'Deltoïde latéral',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'La poulie offre une résistance dès le début du mouvement, là où l’haltère ne pèse rien.',
    startingPosition: 'Debout de profil par rapport à la poulie basse, poignée tenue par la main extérieure.',
    steps: [
      'Levez le bras sur le côté jusqu’à l’horizontale.',
      'Contrôlez la descente sans relâcher la tension du câble.',
    ],
    breathing: 'Expirez à la montée, inspirez au retour.',
    formTips: ['Passez le câble derrière vos jambes pour un axe de tirage plus naturel.'],
    commonMistakes: ['Se pencher du côté opposé pour tirer.'],
    defaultSets: 3,
    defaultReps: '12-15 / bras',
    defaultRestSeconds: 60,
  },
  {
    id: 'incline-lateral-raise',
    name: 'Élévations latérales penchée sur banc incliné',
    category: 'arms',
    specificMuscle: 'epaule-cote',
    primaryMuscle: 'Deltoïde latéral (Recrutement isolé)',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'Allongée sur le côté sur un banc incliné à 60°, triche impossible pour les trapèzes.',
    startingPosition: 'Allongée sur le flanc sur banc incliné, haltère en main haute devant la cuisse.',
    steps: [
      'Levez le bras vers le ciel sur le côté.',
      'Contrôlez la descente jusqu’au flanc.',
    ],
    breathing: 'Expirez en montant, inspirez en redescendant.',
    formTips: ['Excellente variante pour les personnes qui sentent trop leurs trapèzes debout.'],
    commonMistakes: ['Tourner le poignet vers l’arrière.'],
    defaultSets: 3,
    defaultReps: '12 / bras',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 11. ÉPAULE (ARRIÈRE) (Rear Delts)
  // ==========================================
  {
    id: 'cable-rear-delt-fly',
    name: 'Écartés arrière à la poulie vis-à-vis',
    category: 'arms',
    specificMuscle: 'epaule-arriere',
    primaryMuscle: 'Deltoïde postérieur',
    secondaryMuscles: ['Trapèzes inférieurs'],
    equipment: 'cable',
    description: 'Poulies croisées à hauteur d’épaules sans poignée, tirage direct par les câbles.',
    startingPosition: 'Debout entre les deux poulies hautes, main droite tenant le câble gauche et inversement.',
    steps: [
      'Tirez les bras vers l’arrière en gardant les coudes à hauteur des yeux.',
      'Sentez la contraction à l’arrière de l’articulation.',
      'Revenez lentement vers le centre.'
    ],
    breathing: 'Expirez en écartant, inspirez en revenant.',
    formTips: ['Ne pliez pas les bras pendant le mouvement.'],
    commonMistakes: ['Rapprocher trop les omoplates au détriment des deltoïdes.'],
    defaultSets: 3,
    defaultReps: '15',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 12. BICEPS
  // ==========================================
  {
    id: 'incline-dumbbell-curl',
    name: 'Curl incliné aux haltères sur banc (Incline Curl)',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps (Chef long & étirement)',
    secondaryMuscles: ['Brachial antérieur'],
    equipment: 'dumbbell',
    description: 'L’inclinaison du banc (60°) place le chef long du biceps sous un étirement maximal dès le départ.',
    startingPosition: 'Assise sur un banc incliné à 60°, bras ballants vers le bas, un haltère dans chaque main.',
    steps: [
      'Fléchissez les coudes en tournant les paumes vers le haut (supination).',
      'Montez jusqu’à contraction complète du biceps sans avancer les coudes.',
      'Redescendez lentement pour ressentir l’étirement profond.'
    ],
    breathing: 'Expirez en montant, inspirez en redescendant.',
    formTips: ['Gardez les coudes fixés en arrière du tronc tout au long du mouvement.'],
    commonMistakes: ['Avancer les coudes vers l’avant pour s’aider des épaules.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
  },
  {
    id: 'hammer-curl-dumbbell',
    name: 'Curl marteau aux haltères (Hammer Curl)',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Brachial antérieur & Brachio-radial',
    secondaryMuscles: ['Biceps'],
    equipment: 'dumbbell',
    description: 'Prise neutre (pouces vers le haut) qui renforce le bras et donne du galbe à l’avant-bras.',
    startingPosition: 'Debout ou assise, haltères le long du corps, paumes face à face.',
    steps: [
      'Fléchissez les avant-bras en conservant les paumes face à face comme pour planter un clou.',
      'Serrez en haut 1 seconde.',
      'Redescendez avec contrôle.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Excellente alternative pour les personnes sujettes aux douleurs de poignets.'],
    commonMistakes: ['Balancement du corps.'],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 60,
  },
  {
    id: 'preacher-curl-machine',
    name: 'Curl pupitre Larry Scott (Machine)',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps (Chef court & pic du biceps)',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'Bras calés sur le pupitre inclinée : aucune triche possible, isolation pure.',
    startingPosition: 'Assise, aisselles bien calées en haut du pupitre, poignées en main.',
    steps: [
      'Enroulez les avant-bras vers le visage.',
      'Contractez au sommet.',
      'Redescendez sans verrouiller complètement les coudes en bas pour protéger les tendons.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Gardez toujours un micro-fléchissement en bas.'],
    commonMistakes: ['Décoller les aisselles du pupitre.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
  },
  {
    id: 'spider-curl-dumbbell',
    name: 'Spider Curl sur banc incliné',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'Poitrine appuyée sur le dossier du banc incliné à 45°, bras verticaux.',
    startingPosition: 'À plat ventre sur le banc incliné, haltères tenus paumes vers le haut.',
    steps: [
      'Montez les haltères vers le front en gardant les coudes immobiles.',
      'Pincez les biceps au sommet.',
      'Descendez lentement.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: ['Tension maximale en contraction finale.'],
    commonMistakes: ['Reculer les coudes.'],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 60,
  },

  // ==========================================
  // 13. TRICEPS
  // ==========================================
  {
    id: 'cable-tricep-pushdown',
    name: 'Extensions triceps à la corde (Pushdown)',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Chef latéral & médial)',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'L’exercice incontournable pour tonifier et raffermir l’arrière des bras sans ballottement.',
    startingPosition: 'Debout face à la poulie haute, corde tenue à deux mains, coudes collés aux côtes.',
    steps: [
      'Poussez la corde vers le bas jusqu’à tendre les bras.',
      'En fin de course, écartez les extrémités de la corde vers l’extérieur pour verrouiller la contraction.',
      'Laissez remonter les mains à hauteur de poitrine sans décoller les coudes des côtes.'
    ],
    breathing: 'Expirez en tendant les bras vers le bas, inspirez en remontant.',
    formTips: [
      'Les coudes restent scellés au corps, seul l’avant-bras bouge.',
      'Buste très légèrement penché en avant pour un meilleur trajet.'
    ],
    commonMistakes: [
      'Écarter les coudes vers l’extérieur pendant la poussée.',
      'Laisser les coudes monter et descendre.'
    ],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'overhead-cable-tricep-extension',
    name: 'Extensions triceps au-dessus de la tête à la poulie',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Chef long)',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'Le bras étant au-dessus de la tête, le chef long du triceps est étiré au maximum pour un dessin harmonieux.',
    startingPosition: 'Dos à la poulie haute, corde tenue derrière la nuque, un pied en avant pour l’équilibre.',
    steps: [
      'Tendez les bras vers l’avant et le haut en diagonale.',
      'Sentez le triceps se contracter à fond.',
      'Laissez la corde redescendre derrière la nuque avec contrôle.'
    ],
    breathing: 'Expirez en tendant les bras, inspirez au retour.',
    formTips: ['Gardez les coudes serrés près des tempes, ne les laissez pas s’écarter.'],
    commonMistakes: ['Cambrer excessivement le dos.'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
  },
  {
    id: 'skull-crushers-dumbbell',
    name: 'Barre au front / Skull Crushers aux haltères',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps complets',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'Allongée sur un banc, flexion des avant-bras vers les tempes pour un travail lourd et ciblé.',
    startingPosition: 'Allongée sur banc plat, haltères tenus verticalement au-dessus de la poitrine, paumes face à face.',
    steps: [
      'Fléchissez les coudes pour faire descendre les haltères de chaque côté des oreilles.',
      'Les bras restent verticaux ou légèrement inclinés vers l’arrière.',
      'Repoussez la charge avec la force des triceps.'
    ],
    breathing: 'Inspirez à la descente, expirez en tendant les bras.',
    formTips: ['Gardez les coudes immobiles, ne les laissez pas s’ouvrir sur les côtés.'],
    commonMistakes: ['Faire bouger les épaules au lieu de plier les coudes.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
  },
  {
    id: 'assisted-dips-triceps',
    name: 'Dips triceps assistés à la machine',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps & Épaules',
    secondaryMuscles: ['Bas des pectoraux'],
    equipment: 'machine',
    description: 'Répulsions aux barres parallèles avec contrepoids réglable pour galber l’arrière des bras.',
    startingPosition: 'Genoux sur la plateforme d’assistance, barres parallèles en main, torse droit.',
    steps: [
      'Descendez en fléchissant les coudes jusqu’à former un angle droit.',
      'Gardez les coudes serrés près du corps pour isoler les triceps.',
      'Poussez fermement pour remonter.'
    ],
    breathing: 'Inspirez en descendant, expirez en poussant.',
    formTips: ['Restez droite pour cibler les triceps plutôt que la poitrine.'],
    commonMistakes: ['Descendre trop bas au risque de pincer l’épaule.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 75,
  },

  // ==========================================
  // 14. ABDOMINAUX & GAINAGE GLOBAL
  // ==========================================
  {
    id: 'deadbug-core',
    name: 'Deadbug contrôlé au sol',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Transverse profond & Plaque abdominale',
    secondaryMuscles: ['Psoas'],
    equipment: 'bodyweight',
    description: 'Le meilleur exercice pour aplatir le bas-ventre sans pression lombaire ni pincement cervical.',
    startingPosition: 'Allongée sur le dos, genoux pliés à 90° au-dessus des hanches, bras pointés vers le plafond.',
    steps: [
      'Plaquez fermement vos lombaires dans le sol : aucun espace sous le dos.',
      'Tendez simultanément le bras droit en arrière et la jambe gauche vers l’avant en rasant le sol.',
      'Revenez au centre et alternez avec le bras gauche et la jambe droite.'
    ],
    breathing: 'Expirez lorsque les membres s’éloignent, inspirez en revenant.',
    formTips: ['Si vos lombaires décollent du sol, ne descendez pas la jambe aussi bas.'],
    commonMistakes: ['Cambrer le bas du dos pendant l’extension.'],
    defaultSets: 3,
    defaultReps: '16 alternances',
    defaultRestSeconds: 45,
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold (Position Cuillère)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Grand droit & Transverse',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    description: 'Gainage gymnastique d’élite pour un ventre plat et une sangle abdominale indéfectible.',
    startingPosition: 'Allongée sur le dos, bas du dos plaqué, jambes jointes.',
    steps: [
      'Décollez les omoplates et les jambes tendues à 20-30 cm du sol.',
      'Tendez les bras au-dessus de la tête.',
      'Maintenez la position en aspirant le nombril vers le sol.'
    ],
    breathing: 'Petites respirations régulières sans gonfler le ventre.',
    formTips: ['Si c’est trop difficile, ramenez un genou vers la poitrine.'],
    commonMistakes: ['Laisser le bas du dos se cambrer.'],
    defaultSets: 3,
    defaultReps: '30-45 secondes',
    defaultRestSeconds: 45,
  },
  {
    id: 'commando-plank',
    name: 'Planche commando dynamique',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Gainage global & Épaules',
    secondaryMuscles: ['Triceps', 'Fessiers'],
    equipment: 'bodyweight',
    description: 'Alternance planche sur coudes et planche sur mains pour brûler des calories tout en gainant.',
    startingPosition: 'En planche sur les coudes, corps gainé bien droit.',
    steps: [
      'Montez sur la paume droite puis gauche pour arriver en position de pompe haute.',
      'Redescendez sur le coude droit puis gauche.',
      'Gardez le bassin le plus fixe possible sans dandinage.'
    ],
    breathing: 'Respiration constante et calme.',
    formTips: ['Écartez un peu les pieds pour stabiliser le bassin.'],
    commonMistakes: ['Balançoire excessive du bassin de gauche à droite.'],
    defaultSets: 3,
    defaultReps: '12 répétitions',
    defaultRestSeconds: 60,
  },
  {
    id: 'stomach-vacuum',
    name: 'Stomach Vacuum hypopressif',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Transverse profond (Effet taille de guêpe)',
    secondaryMuscles: ['Plancher pelvien'],
    equipment: 'bodyweight',
    description: 'Aspiration abdominale à poumons vides pour resserrer la sangle abdominale de l’intérieur.',
    startingPosition: 'À genoux à quatre pattes ou debout mains sur les cuisses.',
    steps: [
      'Expirez tout l’air de vos poumons par la bouche.',
      'Sans réinspirer, aspirez le nombril au maximum sous les côtes comme si vous vouliez toucher votre colonne.',
      'Maintenez le blocage 10 à 15 secondes.',
      'Inspirez doucement par le nez pour relâcher.'
    ],
    breathing: 'Apnée expiratoire pendant la contraction.',
    formTips: ['Pratiquez idéalement à jeun pour un confort optimal.'],
    commonMistakes: ['Pousser le ventre vers l’extérieur au lieu d’aspirer.'],
    defaultSets: 4,
    defaultReps: '15 secondes',
    defaultRestSeconds: 45,
  },

  // ==========================================
  // 15. CARDIO & INTERVALS
  // ==========================================
  {
    id: 'stairmaster-intervals',
    name: 'StairMaster Escalier Brûle-Graisse',
    category: 'cardio',
    specificMuscle: 'cardio',
    primaryMuscle: 'Fessiers, Mollets & Système Cardiovasculaire',
    secondaryMuscles: ['Quadriceps', 'Ischios'],
    equipment: 'cardio_machine',
    description: 'Le circuit cardio roi pour sculpter les fessiers sans aucun impact articulaire.',
    startingPosition: 'Sur le StairMaster, posture fière, mains posées légèrement sans s’y suspendre.',
    steps: [
      'Montez en appuyant avec tout le pied et en poussant par les talons.',
      'Alternez les cadences selon le programme d’intervalles.',
    ],
    breathing: 'Respiration rythmée et profonde.',
    formTips: ['Ne vous affaissez jamais sur les poignées : cela réduit la dépense de 30%.'],
    commonMistakes: ['Marcher sur la pointe des pieds.'],
    defaultSets: 1,
    defaultReps: '20-25 minutes',
    defaultRestSeconds: 0,
  },
  {
    id: 'treadmill-12-5-30',
    name: 'Tapis de course Marche Inclinée 12-5-30',
    category: 'cardio',
    specificMuscle: 'cardio',
    primaryMuscle: 'Endurance & Tonification postérieure',
    secondaryMuscles: ['Fessiers', 'Mollets'],
    equipment: 'cardio_machine',
    description: 'La méthode sportive : Pente 12%, Vitesse 5 km/h, pendant 30 minutes sans tenir les rampes.',
    startingPosition: 'Sur tapis de course, réglez l’inclinaison à 12% et la vitesse à 5.0 km/h.',
    steps: [
      'Marchez d’un pas assuré et énergique en balançant les bras.',
      'Maintenez l’effort pendant 30 minutes consécutives.',
    ],
    breathing: 'Respiration nasale et ventrale constante.',
    formTips: ['Ne tenez pas les rampes pour maximiser la dépense et le gainage.'],
    commonMistakes: ['S’accrocher aux barres en se penchant en arrière.'],
    defaultSets: 1,
    defaultReps: '30 minutes',
    defaultRestSeconds: 0,
  },
  {
    id: 'rower-intervals',
    name: 'Rameur Concept2 Puissance & Endurance',
    category: 'cardio',
    specificMuscle: 'cardio',
    primaryMuscle: 'Cardio global (85% des muscles du corps)',
    secondaryMuscles: ['Dos', 'Jambes', 'Bras'],
    equipment: 'cardio_machine',
    description: 'Recrutement global jambes, dos et bras avec cadence rythmée.',
    startingPosition: 'Assise sur le chariot, pieds sanglés, dos droit, prise ferme sur la poignée.',
    steps: [
      'Poussez d’abord fort avec les jambes.',
      'Ouvrez le bassin et tirez la poignée sous la poitrine.',
      'Revenez bras d’abord, puis tronc, puis flexion des genoux.'
    ],
    breathing: 'Expirez à la poussée/tirage, inspirez au retour.',
    formTips: ['60% de la force provient des jambes, 20% du tronc et 20% des bras.'],
    commonMistakes: ['Plier les genoux avant d’avoir repassé la poignée au-dessus.'],
    defaultSets: 1,
    defaultReps: '15-20 minutes',
    defaultRestSeconds: 0,
  },
  ...REQUESTED_EXERCISES,
];

// Leg Press Foot Placement Reference Data (7 positions anatomiques complètes)
export const LEG_PRESS_FOOT_PLACEMENTS = [
  {
    id: 'high-center',
    title: '1. Pieds hauts au centre',
    focus: 'Fessiers & Ischio-jambiers',
    description: 'En plaçant les pieds vers le sommet du plateau, l’angle de flexion de hanche augmente considérablement, reportant la majeure partie de la tension mécanique sur les fessiers et l’arrière des cuisses.',
    recommendation: 'Idéal pour le développement du galbe fessier. Poussez principalement avec vos talons.'
  },
  {
    id: 'high-wide',
    title: '2. Pieds hauts écartés (Large)',
    focus: 'Grand fessier & Adducteurs profonds',
    description: 'Pieds au sommet du plateau, écartés au-delà des épaules avec pointes ouvertes à 35°. Maximise l’étirement du grand fessier à la descente et active les adducteurs.',
    recommendation: 'Gardez les genoux bien ouverts dans l’alignement des pointes de pieds à chaque rep.'
  },
  {
    id: 'high-narrow',
    title: '3. Pieds hauts serrés (Étroit)',
    focus: 'Haut des fessiers & Ischios externes',
    description: 'Pieds placés haut et rapprochés (largeur de bassin). Favorise l’étirement fessier supérieur tout en sollicitant le chef long des ischios.',
    recommendation: 'Assurez-vous que vos lombaires restent solidement calées au dossier en bas de mouvement.'
  },
  {
    id: 'standard-center',
    title: '4. Pieds au milieu (Neutre)',
    focus: 'Quadriceps & Fessiers (Équilibre)',
    description: 'Position biomécanique standard, pieds largeur des épaules au centre du plateau. Répartition harmonieuse entre la face avant et la face arrière de la cuisse.',
    recommendation: 'Parfaite pour travailler la puissance générale des jambes avec des charges progressives.'
  },
  {
    id: 'low-center',
    title: '5. Pieds bas au centre',
    focus: 'Quadriceps complets',
    description: 'Une position basse accentue la flexion du genou et maximise l’étirement des quadriceps. Nécessite une bonne mobilité de cheville.',
    recommendation: 'Idéal pour sculpter l’avant des cuisses. Gardez les talons en contact constant avec le plateau.'
  },
  {
    id: 'low-narrow',
    title: '6. Pieds bas serrés',
    focus: 'Vaste externe (Galbe galbé extérieur)',
    description: 'Position basse avec pieds espacés de 10 à 15 cm. Focalise le recrutement sur la portion externe du quadriceps pour accentuer le dessin de la cuisse.',
    recommendation: 'Descendez de manière très contrôlée sans rebond.'
  },
  {
    id: 'low-wide',
    title: '7. Pieds bas écartés',
    focus: 'Vaste interne (Médial) & Adducteurs',
    description: 'Pieds bas et espacés au-delà des épaules, pointes vers l’extérieur. Sollicite fortement le vaste interne (« goutte d’eau » au-dessus du genou) et les adducteurs.',
    recommendation: 'Conservez toujours un micro-fléchissement en fin de poussée.'
  }
];

// 10 Circuits Cardio variés avec les demandes de l'utilisatrice
export interface CardioCircuit {
  id: string;
  name: string;
  machine: string;
  durationMinutes: number;
  intensity: 'Douce' | 'Modérée' | 'Intense' | 'HIIT';
  description: string;
  intervals: { time: string; instruction: string }[];
}

export const CARDIO_CIRCUITS: CardioCircuit[] = [
  {
    id: 'cardio-marche-inclinee-debutant',
    name: '1. Marche Inclinée — Débutant (Pente 6 · Vitesse 4,5 · 20 min)',
    machine: 'Tapis de course',
    durationMinutes: 20,
    intensity: 'Douce',
    description: 'Idéal pour démarrer ou en finisher : inclinaison 6%, vitesse 4,5 km/h pendant 20 minutes sans se tenir aux rampes.',
    intervals: [
      { time: '00:00 - 02:00', instruction: 'Mise en route progressive : Pente 3%, Vitesse 4,0 km/h' },
      { time: '02:00 - 18:00', instruction: 'Bloc principal Débutant : Inclinaison 6% — Vitesse 4,5 km/h (posture droite, bras actifs)' },
      { time: '18:00 - 20:00', instruction: 'Retour au calme : Pente 1%, Vitesse 3,8 km/h' },
    ]
  },
  {
    id: 'cardio-marche-inclinee-intermediaire',
    name: '2. Marche Inclinée — Intermédiaire (Pente 10 · Vitesse 4,5 · 30 min)',
    machine: 'Tapis de course',
    durationMinutes: 30,
    intensity: 'Modérée',
    description: 'Brûleur de graisses ciblé : inclinaison 10%, vitesse 4,5 km/h pendant 30 minutes continues.',
    intervals: [
      { time: '00:00 - 03:00', instruction: 'Échauffement : Pente 5%, Vitesse 4,2 km/h' },
      { time: '03:00 - 27:00', instruction: 'Bloc principal Intermédiaire : Inclinaison 10% — Vitesse 4,5 km/h (poussez bien par les talons)' },
      { time: '27:00 - 30:00', instruction: 'Retour au calme : Pente 2%, Vitesse 4,0 km/h' },
    ]
  },
  {
    id: 'cardio-marche-inclinee-confirmee',
    name: '3. Marche Inclinée — Confirmée 12-5-30 (Pente 12 · Vitesse 5 · 30 min)',
    machine: 'Tapis de course',
    durationMinutes: 30,
    intensity: 'Intense',
    description: 'Niveau confirmé : inclinaison 12%, vitesse 5,0 km/h pendant 30 minutes pour un engagement maximal des fessiers et du cardio.',
    intervals: [
      { time: '00:00 - 03:00', instruction: 'Échauffement : Pente 6%, Vitesse 4,5 km/h' },
      { time: '03:00 - 27:00', instruction: 'Bloc principal Confirmé : Inclinaison 12% — Vitesse 5,0 km/h sans toucher la console' },
      { time: '27:00 - 30:00', instruction: 'Retour au calme : Pente 2%, Vitesse 4,0 km/h' },
    ]
  },
  {
    id: 'cardio-stairmaster',
    name: '4. StairMaster Booty Burner Ladder',
    machine: 'StairMaster / Escalier',
    durationMinutes: 20,
    intensity: 'Intense',
    description: 'Montée progressive par échelons pour tonifier le galbe fessier sans choc.',
    intervals: [
      { time: '00:00 - 03:00', instruction: 'Échauffement niveau 5, pas réguliers en poussant par les talons' },
      { time: '03:00 - 08:00', instruction: 'Niveau 8, pas enjambés 2 par 2 avec buste incliné vers l’avant' },
      { time: '08:00 - 14:00', instruction: '6 tours de (45s sprint niveau 11 / 45s récupération niveau 6)' },
      { time: '14:00 - 18:00', instruction: 'Pas croisés latéraux niveau 7 (2 min côté droit / 2 min côté gauche)' },
      { time: '18:00 - 20:00', instruction: 'Retour au calme niveau 4 et respiration profonde' },
    ]
  },
  {
    id: 'cardio-rower',
    name: '5. Rameur Concept2 Puissance & Intervalles 500m',
    machine: 'Rameur Concept 2',
    durationMinutes: 20,
    intensity: 'Intense',
    description: 'Engagement de 85% des muscles du corps avec intervalles fractionnés.',
    intervals: [
      { time: '00:00 - 04:00', instruction: 'Échauffement fluide à 20-22 coups/min, résistance 4' },
      { time: '04:00 - 16:00', instruction: '5 séries de 500m à cadence soutenue (28 cpm) avec 1 min de rame douce entre chaque' },
      { time: '16:00 - 20:00', instruction: 'Décrassage souple à 18 cpm et étirements' },
    ]
  },
  {
    id: 'cardio-elliptical-pyramid',
    name: '6. Pyramide à l\'Elliptique (Résistance & Inclinaison)',
    machine: 'Vélo elliptique',
    durationMinutes: 25,
    intensity: 'Intense',
    description: 'Montée progressive par paliers de résistance puis redescente en marche arrière.',
    intervals: [
      { time: '00:00 - 04:00', instruction: 'Échauffement résistance niveau 5, cadence 60 rpm' },
      { time: '04:00 - 07:00', instruction: 'Palier 1 : Résistance 8 (allure modérée)' },
      { time: '07:00 - 10:00', instruction: 'Palier 2 : Résistance 11 (allure soutenue)' },
      { time: '10:00 - 13:00', instruction: 'Sommet : Résistance 14 (effort maximal)' },
      { time: '13:00 - 17:00', instruction: 'Pédalage en arrière résistance 9 pour solliciter ischios et fessiers' },
      { time: '17:00 - 22:00', instruction: 'Alternance 30s sprint avant / 30s sprint arrière résistance 10' },
      { time: '22:00 - 25:00', instruction: 'Retour au calme niveau 4' },
    ]
  },
  {
    id: 'cardio-treadmill-hiit-fractionne',
    name: '7. Fractionné HIIT au Tapis de Course (Sprints)',
    machine: 'Tapis de course',
    durationMinutes: 20,
    intensity: 'HIIT',
    description: 'Alternance explosive de sprints intenses et de marche de récupération.',
    intervals: [
      { time: '00:00 - 04:00', instruction: 'Jogging léger d’échauffement à 7.5 - 8.5 km/h' },
      { time: '04:00 - 16:00', instruction: '8 x (30 secondes sprint à 12 - 14 km/h / 60 secondes marche active à 5 km/h)' },
      { time: '16:00 - 20:00', instruction: 'Marche lente 4 km/h de récupération cardiaque' },
    ]
  },
  {
    id: 'cardio-hill-walk',
    name: '8. Marche en Côte Pyramide Pente (6% → 10% → 15%)',
    machine: 'Tapis de course en côte',
    durationMinutes: 25,
    intensity: 'Intense',
    description: 'Simulation d’ascension de colline avec variation progressive de la pente de 6% à 15%.',
    intervals: [
      { time: '00:00 - 05:00', instruction: 'Pente 6%, vitesse 4.5 km/h échauffement' },
      { time: '05:00 - 10:00', instruction: 'Pente 10%, vitesse 4.8 km/h en poussant bien sur les talons' },
      { time: '10:00 - 15:00', instruction: 'Pente 13%, vitesse 4.6 km/h grands pas engagés' },
      { time: '15:00 - 20:00', instruction: 'Pente 15% (pente maximale), vitesse 4.2 km/h' },
      { time: '20:00 - 25:00', instruction: 'Pente 3%, vitesse 4.0 km/h retour au calme' },
    ]
  },
  {
    id: 'cardio-airbike',
    name: '9. AirBike Tabata Express 15 Minutes',
    machine: 'AirBike / Assault Bike',
    durationMinutes: 15,
    intensity: 'HIIT',
    description: 'La résistance par air s’ajuste à votre puissance : coordination bras et jambes.',
    intervals: [
      { time: '00:00 - 03:00', instruction: 'Pédalage régulier souple' },
      { time: '03:00 - 11:00', instruction: 'Tabata 8 tours de (20s sprint maximal / 10s repos complet)' },
      { time: '11:00 - 15:00', instruction: 'Pédalage doux de récupération' },
    ]
  },
  {
    id: 'cardio-rpm',
    name: '10. Vélo RPM Danseuse & Cadence',
    machine: 'Vélo de biking / RPM',
    durationMinutes: 24,
    intensity: 'Intense',
    description: 'Simulation de côtes en danseuse (debout) et sprints assis.',
    intervals: [
      { time: '00:00 - 04:00', instruction: 'Cadence 90 rpm résistance modérée' },
      { time: '04:00 - 14:00', instruction: '5 x (1 min debout forte résistance 65 rpm / 1 min assis 90 rpm)' },
      { time: '14:00 - 20:00', instruction: '3 accélérations assises de 30s à cadence > 105 rpm' },
      { time: '20:00 - 24:00', instruction: 'Décrassage souple' },
    ]
  },
  {
    id: 'cardio-hyrox',
    name: '11. Circuit Hyrox Mixte (SkiErg & Tapis)',
    machine: 'SkiErg + Tapis + Poids de corps',
    durationMinutes: 24,
    intensity: 'Intense',
    description: 'Inspiré des épreuves Hyrox pour une endurance athlétique et tonique.',
    intervals: [
      { time: 'Bloc 1', instruction: '500m SkiErg régulier + 20 Fentes marchées' },
      { time: 'Bloc 2', instruction: '400m Course modérée sur tapis + 15 Squats sautés ou rapides' },
      { time: 'Bloc 3', instruction: '500m SkiErg cadence soutenue + 40s Planche de gainage' },
      { time: 'Bloc 4', instruction: '400m Marche en pente 10% retour au calme' },
    ]
  }
];

// Circuits d'Abdominaux Globaux avec Gainage (Debout, Sol, Lestés & Gainage)
export interface AbdoCircuit {
  id: string;
  name: string;
  focus: string;
  durationMinutes: number;
  exercises: { name: string; position: string; reps: string }[];
}

export const ABDOS_CIRCUITS: AbdoCircuit[] = [
  {
    id: 'abs-standing-weighted',
    name: '1. Circuit Abdos Debout avec Charge (3 tours)',
    focus: 'Gainage debout, Obliques, Transverse & Ceinture 360° (sans s’allonger)',
    durationMinutes: 14,
    exercises: [
      { name: 'Overhead Marches (avec charge lourde)', position: 'Debout, disque ou haltère lourd tenu bras tendus au-dessus de la tête, montez haut chaque genou en gardant le buste gainé.', reps: '3 x 10 reps (charge lourde)' },
      { name: 'Around the Body (avec charge lourde)', position: 'Debout, passez la charge lourde en cercle autour de votre taille d’une main à l’autre sans bouger le bassin.', reps: '3 x 10 reps (charge lourde)' },
      { name: 'Around the Head / Halo (avec charge légère)', position: 'Debout, faites tourner un disque léger autour de votre tête en gardant les côtes abaissées et le ventre rentré.', reps: '3 x 10 reps (charge légère)' },
      { name: 'Diagonal Plate Chops (avec charge légère)', position: 'Mouvement de bûcheron diagonal de l’épaule vers la hanche opposée en contractant les obliques.', reps: '3 x 10 reps de chaque côté (charge légère)' },
      { name: 'Oblique Bends (avec charge lourde)', position: 'Debout, charge lourde dans une seule main, inclinez le buste sur le côté puis remontez à la force de l’oblique.', reps: '3 x 10 reps de chaque côté (charge lourde)' },
    ]
  },
  {
    id: 'abs-flutter-weighted-plank',
    name: '2. Circuit Abdos Complet & Planche Lestée 60s (3 tours)',
    focus: 'Bas des abdos, Grand droit, Obliques & Planche lestée sur le dos',
    durationMinutes: 16,
    exercises: [
      { name: 'Flutter Kicks', position: 'Allongée sur le dos, lombaires plaquées, petits battements verticaux rapides des jambes tendues.', reps: '3 x 10 reps' },
      { name: 'Scissor Kicks', position: 'Sur le dos, croisez alternativement une jambe au-dessus de l’autre au ras du sol.', reps: '3 x 10 reps' },
      { name: 'In and Out', position: 'En équilibre sur les fessiers, ramenez les genoux vers la poitrine puis retendez les jambes sans toucher le sol.', reps: '3 x 10 reps' },
      { name: 'Leg Raises au-dessus d\'un haltère', position: 'Assise au sol, passez les deux jambes tendues par-dessus un haltère posé debout.', reps: '3 x 10 reps' },
      { name: 'Leg Lift', position: 'Allongée sur le dos, montez les deux jambes tendues à 90° puis freinez la descente.', reps: '3 x 10 reps' },
      { name: 'Toe Touches', position: 'Jambes tendues vers le plafond, décollez les épaules pour toucher vos pointes de pieds.', reps: '3 x 10 reps' },
      { name: 'Crunches with a Pause at the Top', position: 'Crunch abdominal en marquant une pause contractée de 2 secondes en haut de chaque répétition.', reps: '3 x 10 reps' },
      { name: 'Russian Twist avec haltère', position: 'Assise buste incliné à 45°, pivotez les épaules d’un côté à l’autre avec un haltère.', reps: '3 x 10 reps' },
      { name: 'Planche avec charge sur le dos', position: 'Gainage sur les avant-bras avec un disque posé sur le bas du dos / bassin.', reps: '3 x 60 sec' },
    ]
  },
  {
    id: 'abs-over-unders-cocoon',
    name: '3. Circuit Over-Unders, Cocoon & Plate Hollow Hold (3 tours)',
    focus: 'Endurance abdominale (Séries de 20), Dead Bugs lestés & Hollow Hold au max',
    durationMinutes: 15,
    exercises: [
      { name: 'Over Unders (10 Clockwise + 10 Anti-Clockwise)', position: 'Sur le dos, cercles croisés des jambes tendues : 10 dans le sens horaire et 10 dans le sens anti-horaire.', reps: '3 x 20 reps (10 + 10)' },
      { name: 'Scissor Kicks', position: 'Sur le dos, grands ciseaux horizontaux dynamiques en gardant le bas du dos collé au tapis.', reps: '3 x 20 reps' },
      { name: 'Side to Side Leg Raises', position: 'Sur le dos, montez et descendez les jambes jointes d’un côté puis de l’autre en arc-en-ciel.', reps: '3 x 20 reps' },
      { name: 'Cocoon Passes', position: 'Enroulement complet en passant un poids ou ballon des mains aux chevilles puis des chevilles aux mains.', reps: '3 x 20 reps' },
      { name: 'Dead Bugs avec charge', position: 'Sur le dos, tenez un poids bras tendus vers le plafond tout en tendant alternativement chaque jambe.', reps: '3 x 20 reps' },
      { name: 'Plate Hollow Hold', position: 'Gainage en position cuillère (Hollow Body) en tenant un disque bras tendus le plus longtemps possible.', reps: '3 x Max (As Long As You Can)' },
    ]
  },
  {
    id: 'abs-weighted-kneel-bridge',
    name: '4. Circuit Abdos Lestés & Bridge Knee Drives (3 tours)',
    focus: 'Force abdominale avec haltère, Gainage pelvien & Obliques (Séries de 12)',
    durationMinutes: 14,
    exercises: [
      { name: 'Weighted Toe Touches', position: 'Jambes tendues à la verticale, montez un haltère ou disque vers vos orteils en décollant haut les omoplates.', reps: '3 x 12 reps' },
      { name: 'Bridge Knee Drives', position: 'En pont fessier haut, ramenez un genou vers la poitrine sans laisser tomber le bassin.', reps: '3 x 12 reps de chaque côté' },
      { name: 'Dumbbell Kneel to Stand', position: 'Haltère tenu contre la poitrine, passez de la position à genoux à debout en gardant le tronc verrouillé.', reps: '3 x 12 reps' },
      { name: 'Weighted Russian Twists', position: 'Rotations du buste assise avec haltère en contrôlant chaque fin de course.', reps: '3 x 12 reps' },
      { name: 'Crunches', position: 'Crunchs classiques maîtrisés en expirant tout l’air au sommet.', reps: '3 x 12 reps' },
    ]
  },
  {
    id: 'abs-global-360-gainage',
    name: '5. Circuit Global 360° : Abdos Complets & Gainage',
    focus: 'Transverse + Grand Droit + Obliques + Gainage statique et dynamique',
    durationMinutes: 14,
    exercises: [
      { name: 'Deadbug contrôlé lombaires plaquées', position: 'Sur le dos, bras verticaux et jambes à 90°. Tendez bras et jambe opposée en rasant le sol sans cambrer.', reps: '16 répétitions lentes' },
      { name: 'Planche commando dynamique', position: 'Démarrez en planche sur les coudes. Montez sur la paume droite puis gauche, puis redescendez sans balancer le bassin.', reps: '10 montées' },
      { name: 'Russian Twists avec genoux verrouillés', position: 'Assise en équilibre sur les fessiers, pieds à 10 cm du sol, buste penché à 45°. Tournez les épaules de droite à gauche.', reps: '20 rotations' },
      { name: 'Planche latérale avec élévation de jambe', position: 'En appui sur l’avant-bras, hanche bien haute alignée avec les pieds. Décollez la jambe supérieure.', reps: '30s par côté' },
      { name: 'Hollow Body Hold final', position: 'Sur le dos, formez une cuillère bras tendus derrière la tête et jambes jointes tendues à 20 cm.', reps: '40 secondes' },
    ]
  },
  {
    id: 'abs-sablier-ceinture',
    name: '6. Circuit Sablier & Ceinture Gainée Totale',
    focus: 'Transverse profond (Vacuum) + Taille fine + Gainage anti-rotation',
    durationMinutes: 12,
    exercises: [
      { name: 'Stomach Vacuum à quatre pattes', position: 'À genoux, dos plat. Videz l’air et aspirez le nombril vers la colonne pendant 10 secondes.', reps: '5 répétitions de 10s' },
      { name: 'Planche Superman avec maintien', position: 'À plat ventre, décollez simultanément poitrine et cuisses en tendant les bras devant vous.', reps: '10 répétitions de 3s' },
      { name: 'Mountain Climbers croisés lents', position: 'En planche haute sur les mains. Amenez le genou droit vers le coude gauche en contractant l’oblique.', reps: '16 répétitions' },
      { name: 'Planche ventrale classique active', position: 'Sur les coudes, serrez les fessiers et tirez les coudes vers les orteils pour une tension maximale.', reps: '45 secondes' },
    ]
  },
  {
    id: 'abs-athletic-core',
    name: '7. Circuit Full Core Athlétique & Définition',
    focus: 'Haut et bas des abdos + Gainage fonctionnel',
    durationMinutes: 12,
    exercises: [
      { name: 'Reverse Crunch sur tapis', position: 'Sur le dos, enroulez le bassin vers la poitrine pour décoller les fesses du sol sans élan.', reps: '15 répétitions' },
      { name: 'Planche haute tape-épaule', position: 'Position pompe haute, pieds écartés largeur tapis. Touchez l’épaule opposée sans bouger les hanches.', reps: '20 touches' },
      { name: 'Flutter Kicks battements ras du sol', position: 'Sur le dos, tête décollée regard nombril, battements de jambes tendues à 15 cm du sol.', reps: '35 secondes' },
      { name: 'Gainage latéral statique', position: 'Sur le coude, corps droit comme une flèche, hanche haute.', reps: '35s par côté' },
    ]
  },
  {
    id: 'abs-vacuum-transverse',
    name: '8. Circuit Transverse Profond & Ventre Ultra-Plat',
    focus: 'Transverse profond & décompression',
    durationMinutes: 10,
    exercises: [
      { name: 'Stomach Vacuum assis ou 4 pattes', position: 'Videz tout l’air et avalez le nombril sous la cage thoracique.', reps: '5 cycles de 12s' },
      { name: 'Deadbug tempo lent', position: 'Lombaires écrasées au sol, mouvement fluide et contrôlé.', reps: '12 répétitions' },
      { name: 'Hollow Body Hold', position: 'Allongée sur le dos en cuillère tendue.', reps: '3 x 30s' },
    ]
  }
];

// Guides d'échauffement et d'étirements par zone
export const WARMUP_COOLDOWN_GUIDES: Record<string, { warmup: string[]; cooldown: string[] }> = {
  'lower-body': {
    warmup: [
      '3 min de marche inclinée ou vélo pour monter la température corporelle',
      'Rotations articulaires des hanches et des chevilles (10 de chaque côté)',
      '15 Squats au poids du corps avec pause de 2 sec en bas',
      '10 Fentes avant alternées avec ouverture de hanche',
      '2 séries légères de montée en charge sur le premier exercice',
    ],
    cooldown: [
      'Étirement du grand fessier au sol (figure en 4) - 45s par côté',
      'Étirement des ischio-jambiers assis jambe tendue - 45s',
      'Étirement des quadriceps debout en ramenant le talon à la fesse - 45s',
      'Respiration ventrale apaisante 2 minutes',
    ]
  },
  'glutes': {
    warmup: [
      'Activation à l’élastique : 20 pas de crabe latéraux',
      '20 Ponts fessiers au sol au poids du corps avec contraction 2s au sommet',
      '15 Clamshells par côté pour réveiller le moyen fessier',
      'Montée progressive en charge sur le Hip Thrust',
    ],
    cooldown: [
      'Étirement du pigeon au sol pour ouvrir les fessiers en profondeur - 60s par côté',
      'Posture de l’enfant (Child pose) bras étirés vers l’avant - 1 min',
      'Automassage ou relâchement des hanches',
    ]
  },
  'back': {
    warmup: [
      'Chat-Chameau (Cat-Cow) à 4 pattes pour délier la colonne - 10 répétitions',
      'Dislocations d’épaules au manche à balai ou élastique - 12 répétitions',
      'Band Pull-Apart (écarté élastique à hauteur de poitrine) - 15 répétitions',
      '1 série légère de tirage vertical à 40% de la charge',
    ],
    cooldown: [
      'Étirement du grand dorsal suspendue à une barre ou en tenant un montant - 45s',
      'Posture du sphinx pour soulager les lombaires - 45s',
      'Enroulement des épaules vers l’arrière et respiration',
    ]
  },
  'arms': {
    warmup: [
      'Moulinets de bras avant et arrière - 15 répétitions',
      'Rotations de poignets et étirements doux des avant-bras',
      'Rotations externes à l’élastique pour la coiffe des rotateurs - 15 par bras',
      'Élévations latérales avec poids de 1 ou 2 kg pour chauffer les deltoïdes',
    ],
    cooldown: [
      'Étirement des triceps bras plié derrière la tête - 45s par bras',
      'Étirement de la poitrine et de l’avant de l’épaule contre un mur - 45s par côté',
      'Relâchement des trapèzes',
    ]
  },
  'abs': {
    warmup: [
      'Bascule du bassin au sol (antéversion / rétroversion) - 10 répétitions',
      'Planche douce sur les genoux - 30 secondes',
      'Mobilisation de la cage thoracique par grandes inspirations',
    ],
    cooldown: [
      'Posture du cobra doux (extension abdominale sans forcer sur les lombaires) - 45s',
      'Torsion douce au sol genoux sur le côté - 45s par côté',
    ]
  },
  'cardio': {
    warmup: [
      '3 minutes à allure très modérée sur la machine choisie',
      'Mobilisation des chevilles, genoux et épaules',
      '2 accélérations progressives de 15 secondes pour préparer le coeur',
    ],
    cooldown: [
      '3 minutes de marche lente de retour au calme (rythme cardiaque < 100 bpm)',
      'Étirement des mollets contre un mur - 45s par jambe',
      'Hydratation abondante à petites gorgées',
    ]
  }
};

// Starter Routines pré-chargées avec une riche variété
export const STARTER_ROUTINES: Routine[] = [
  {
    id: 'routine-glutes-focus',
    name: 'Booty Sculpt & Hypertrophie (Fessiers)',
    targetZone: 'lower-body',
    description: 'Séance reine axée sur la tension mécanique et l’hypertrophie des fessiers.',
    isDefault: true,
    finisher: 'Abduction machine en drop-set (3 x 20 reps)',
    notes: 'Priorisez la contraction volontaire en haut de chaque répétition.',
    exercises: [
      {
        id: 'r-ex-1',
        exerciseId: 'hip-thrust-barbell',
        exerciseName: 'Hip Thrust à la barre',
        category: 'lower-body',
        equipment: 'barbell',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 40, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 50, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 55, completed: false },
          { id: 's4', setNumber: 4, targetReps: 10, targetWeight: 45, completed: false },
        ]
      },
      {
        id: 'r-ex-2',
        exerciseId: 'bulgarian-split-squat',
        exerciseName: 'Fentes bulgares aux haltères',
        category: 'lower-body',
        equipment: 'dumbbell',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 8, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 10, completed: false },
        ]
      },
      {
        id: 'r-ex-3',
        exerciseId: 'cable-glute-kickback',
        exerciseName: 'Kickback fessier à la poulie basse',
        category: 'lower-body',
        equipment: 'cable',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 10, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 12.5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 12.5, completed: false },
        ]
      },
      {
        id: 'r-ex-4',
        exerciseId: 'hip-abduction-machine',
        exerciseName: 'Abduction assise à la machine',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 20, targetWeight: 40, completed: false },
          { id: 's2', setNumber: 2, targetReps: 15, targetWeight: 45, completed: false },
          { id: 's3', setNumber: 3, targetReps: 15, targetWeight: 45, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-quads-glutes',
    name: 'Bas du Corps Complet (Quads, Fessiers & Ischios)',
    targetZone: 'lower-body',
    description: 'Équilibre parfait face avant et face arrière pour des jambes fuselées et toniques.',
    isDefault: true,
    finisher: 'Leg Extension tempo brûlure (2 x 15 reps)',
    notes: 'Pensez à garder le dos plaqué à la presse et au hack squat.',
    exercises: [
      {
        id: 'r-ex-q1',
        exerciseId: 'leg-press',
        exerciseName: 'Presse à cuisses 45°',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 80, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 100, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 100, completed: false },
        ]
      },
      {
        id: 'r-ex-q2',
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Soulevé de terre roumain (RDL aux haltères)',
        category: 'lower-body',
        equipment: 'dumbbell',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 14, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 16, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 16, completed: false },
        ]
      },
      {
        id: 'r-ex-q3',
        exerciseId: 'hack-squat-machine',
        exerciseName: 'Hack Squat guidé',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 40, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 45, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 50, completed: false },
        ]
      },
      {
        id: 'r-ex-q4',
        exerciseId: 'lying-leg-curl',
        exerciseName: 'Leg Curl allongé à la machine',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 25, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 25, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 30, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-back-v-shape',
    name: 'Dos & Silhouette V-Shape (Posture)',
    targetZone: 'back',
    description: 'Postures altières, taille affinée par illusion d’optique et épaules dégagées.',
    isDefault: true,
    finisher: 'Face Pulls légers en brûlure (3 x 15 reps)',
    notes: 'Pensez à tirer avec vos coudes et à fixer les omoplates vers le bas.',
    exercises: [
      {
        id: 'r-ex-5',
        exerciseId: 'lat-pulldown',
        exerciseName: 'Tirage vertical poitrine prise large (Lat Pulldown)',
        category: 'back',
        equipment: 'cable',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 30, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 35, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 40, completed: false },
        ]
      },
      {
        id: 'r-ex-6',
        exerciseId: 'seated-cable-row',
        exerciseName: 'Tirage horizontal poulie basse (Seated Row)',
        category: 'back',
        equipment: 'cable',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 25, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 30, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 30, completed: false },
        ]
      },
      {
        id: 'r-ex-b3',
        exerciseId: 'cable-pullover',
        exerciseName: 'Pull-over à la poulie haute avec corde',
        category: 'back',
        equipment: 'cable',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 15, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 17.5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 17.5, completed: false },
        ]
      },
      {
        id: 'r-ex-b4',
        exerciseId: 'face-pull-rope',
        exerciseName: 'Face Pull à la corde poulie haute',
        category: 'back',
        equipment: 'cable',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 12.5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 15, targetWeight: 15, completed: false },
          { id: 's3', setNumber: 3, targetReps: 15, targetWeight: 15, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-shoulders-arms',
    name: 'Épaules Galbées & Bras Toniques',
    targetZone: 'arms',
    description: 'Séance ciblée sur les 4 portions : deltoïdes latéraux, avant, triceps fermes et biceps.',
    isDefault: true,
    finisher: 'Extensions triceps à la corde (3 x 15 reps)',
    notes: 'Charges modérées et tempo strict pour ne pas engager les trapèzes.',
    exercises: [
      {
        id: 'r-ex-a1',
        exerciseId: 'overhead-press-dumbbell',
        exerciseName: 'Développé militaire assis aux haltères',
        category: 'arms',
        equipment: 'dumbbell',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 8, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 10, completed: false },
        ]
      },
      {
        id: 'r-ex-7',
        exerciseId: 'lateral-raises-dumbbell',
        exerciseName: 'Élévations latérales strictes aux haltères',
        category: 'arms',
        equipment: 'dumbbell',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 4, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 5, completed: false },
          { id: 's4', setNumber: 4, targetReps: 15, targetWeight: 4, completed: false },
        ]
      },
      {
        id: 'r-ex-8',
        exerciseId: 'cable-tricep-pushdown',
        exerciseName: 'Extensions triceps à la corde (Pushdown)',
        category: 'arms',
        equipment: 'cable',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 15, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 17.5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 17.5, completed: false },
        ]
      },
      {
        id: 'r-ex-a4',
        exerciseId: 'incline-dumbbell-curl',
        exerciseName: 'Curl incliné aux haltères sur banc (Incline Curl)',
        category: 'arms',
        equipment: 'dumbbell',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 6, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 7, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 7, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-core-global',
    name: '360° Abdos Complets & Gainage Profond',
    targetZone: 'abs',
    description: 'Circuit complet sollicitant le transverse, le grand droit, les obliques et le gainage.',
    isDefault: true,
    finisher: 'Planche de gainage Hollow Body finale (60 sec)',
    notes: 'Prenez 30 secondes de repos entre chaque mouvement et répétez 3 fois.',
    exercises: [
      {
        id: 'r-ex-c1',
        exerciseId: 'deadbug-core',
        exerciseName: 'Deadbug contrôlé au sol',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 16, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-ex-c2',
        exerciseId: 'commando-plank',
        exerciseName: 'Planche commando dynamique',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-ex-c3',
        exerciseId: 'hollow-body-hold',
        exerciseName: 'Hollow Body Hold (Position Cuillère)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 45,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 35, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 35, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 35, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-ex-c4',
        exerciseId: 'stomach-vacuum',
        exerciseName: 'Stomach Vacuum hypopressif',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 15, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 15, targetWeight: 0, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-posterior-chain',
    name: 'Chaîne Postérieure (Fessiers & Ischios)',
    targetZone: 'lower-body',
    description: 'Focus exclusif sur l’arrière de la cuisse et le galbe fessier sans quadriceps.',
    isDefault: true,
    finisher: 'Hyperextensions au banc 45° focus fessiers (3 x 15)',
    notes: 'Poussez bien les hanches en arrière sur le soulevé de terre roumain.',
    exercises: [
      {
        id: 'r-ex-p1',
        exerciseId: 'romanian-deadlift',
        exerciseName: 'Soulevé de terre roumain (RDL aux haltères)',
        category: 'lower-body',
        equipment: 'dumbbell',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 14, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 16, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 18, completed: false },
        ]
      },
      {
        id: 'r-ex-p2',
        exerciseId: 'hip-thrust-barbell',
        exerciseName: 'Hip Thrust à la barre',
        category: 'lower-body',
        equipment: 'barbell',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 45, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 50, completed: false },
          { id: 's3', setNumber: 3, targetReps: 8, targetWeight: 55, completed: false },
        ]
      },
      {
        id: 'r-ex-p3',
        exerciseId: 'seated-leg-curl',
        exerciseName: 'Leg Curl assis à la machine',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 25, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 25, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 30, completed: false },
        ]
      },
      {
        id: 'r-ex-p4',
        exerciseId: 'hyperextensions-bench',
        exerciseName: 'Banc à lombaires 45° (Hyperextensions)',
        category: 'back',
        equipment: 'bodyweight',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 15, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 5, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-quads-adductors',
    name: 'Quads Sculpt & Adducteurs Fermes',
    targetZone: 'lower-body',
    description: 'Avant des cuisses et intérieur des jambes sculptés en profondeur.',
    isDefault: true,
    finisher: 'Goblet Squat tempo lent (2 x 15 reps)',
    notes: 'Ouvrez bien les genoux sur les mouvements d’adducteurs.',
    exercises: [
      {
        id: 'r-ex-qa1',
        exerciseId: 'leg-press',
        exerciseName: 'Presse à cuisses 45°',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 80, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 90, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 100, completed: false },
        ]
      },
      {
        id: 'r-ex-qa2',
        exerciseId: 'adductor-machine',
        exerciseName: 'Machine à adducteurs assise',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 20, targetWeight: 35, completed: false },
          { id: 's2', setNumber: 2, targetReps: 15, targetWeight: 40, completed: false },
          { id: 's3', setNumber: 3, targetReps: 15, targetWeight: 40, completed: false },
        ]
      },
      {
        id: 'r-ex-qa3',
        exerciseId: 'leg-extension-machine',
        exerciseName: 'Leg Extension assis à la machine',
        category: 'lower-body',
        equipment: 'machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 25, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 30, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 30, completed: false },
        ]
      },
      {
        id: 'r-ex-qa4',
        exerciseId: 'sumo-squat-dumbbell',
        exerciseName: 'Squat Sumo avec haltère ou kettlebell',
        category: 'lower-body',
        equipment: 'dumbbell',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 16, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 18, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 20, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-fullbody-glow',
    name: 'Full Body Glow & Tonification Totale',
    targetZone: 'fullbody',
    description: 'Séance globale 4 mouvements polyarticulaires pour brûler et tonifier tout le corps.',
    isDefault: true,
    finisher: '10 min de marche inclinée ou 60s de gainage',
    notes: 'Parfaite si vous n’avez que 45 minutes pour tout travailler.',
    exercises: [
      {
        id: 'r-ex-fb1',
        exerciseId: 'hip-thrust-barbell',
        exerciseName: 'Hip Thrust à la barre',
        category: 'lower-body',
        equipment: 'barbell',
        restSeconds: 90,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 45, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 50, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 50, completed: false },
        ]
      },
      {
        id: 'r-ex-fb2',
        exerciseId: 'lat-pulldown',
        exerciseName: 'Tirage vertical poitrine prise large (Lat Pulldown)',
        category: 'back',
        equipment: 'cable',
        restSeconds: 75,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 30, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 35, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 35, completed: false },
        ]
      },
      {
        id: 'r-ex-fb3',
        exerciseId: 'lateral-raises-dumbbell',
        exerciseName: 'Élévations latérales strictes aux haltères',
        category: 'arms',
        equipment: 'dumbbell',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 4, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 5, completed: false },
        ]
      },
      {
        id: 'r-ex-fb4',
        exerciseId: 'deadbug-core',
        exerciseName: 'Deadbug contrôlé au sol',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 45,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 16, targetWeight: 0, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-abs-standing-weighted',
    name: 'Circuit Abdos Debout avec Charge (3 tours)',
    targetZone: 'abs',
    description: 'Circuit d’abdos 100% debout : Overhead marches (charge lourde), Around the body (charge lourde), Around the head (charge légère), Diagonal plate chops (charge légère) & Oblique bends (charge lourde).',
    isDefault: true,
    finisher: 'Stomach Vacuum debout (3 x 15 sec)',
    notes: 'Enchaînez les 5 mouvements pour 1 tour complet, prenez 45s de repos et répétez 3 fois.',
    exercises: [
      {
        id: 'r-abs-st-1',
        exerciseId: 'overhead-marches-heavy',
        exerciseName: 'Overhead Marches (avec charge lourde)',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 20,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 10, completed: false },
        ]
      },
      {
        id: 'r-abs-st-2',
        exerciseId: 'around-the-body-heavy',
        exerciseName: 'Around the Body (avec charge lourde)',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 20,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 10, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 10, completed: false },
        ]
      },
      {
        id: 'r-abs-st-3',
        exerciseId: 'around-the-head-light',
        exerciseName: 'Around the Head / Halo (avec charge légère)',
        category: 'abs',
        equipment: 'barbell',
        restSeconds: 20,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 5, completed: false },
        ]
      },
      {
        id: 'r-abs-st-4',
        exerciseId: 'diagonal-plate-chops',
        exerciseName: 'Diagonal Plate Chops (10 de chaque côté, charge légère)',
        category: 'abs',
        equipment: 'barbell',
        restSeconds: 20,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 5, completed: false },
        ]
      },
      {
        id: 'r-abs-st-5',
        exerciseId: 'oblique-bends-heavy',
        exerciseName: 'Oblique Bends (10 de chaque côté, charge lourde)',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 45,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 12, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 12, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 12, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-abs-flutter-weighted-plank',
    name: 'Circuit Abdos Complet & Planche Lestée 60s (3x10)',
    targetZone: 'abs',
    description: 'Flutter kicks, Scissor kicks, In & Out, Leg raises au-dessus d’un haltère, Leg lift, Toe touches, Crunches pause en haut, Russian twist haltère & 60s Planche lestée.',
    isDefault: true,
    finisher: 'Planche 60 sec avec charge sur le dos (3 tours)',
    notes: '3 séries de 10 répétitions par exercice, terminez par 60s de planche lestée.',
    exercises: [
      {
        id: 'r-abs-fl-1',
        exerciseId: 'leg-raises-over-dumbbell',
        exerciseName: 'Leg Raises au-dessus d\'un haltère (3x10)',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 6, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 6, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 6, completed: false },
        ]
      },
      {
        id: 'r-abs-fl-2',
        exerciseId: 'in-and-out-abs',
        exerciseName: 'In and Out + Flutter Kicks + Scissor Kicks (3x10)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-fl-3',
        exerciseId: 'crunches-pause-top',
        exerciseName: 'Crunches with a Pause at the Top & Toe Touches (3x10)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-fl-4',
        exerciseId: 'weighted-plank-60s',
        exerciseName: 'Russian Twist haltère (3x10) + Planche lestée sur le dos (60s)',
        category: 'abs',
        equipment: 'barbell',
        restSeconds: 45,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 60, targetWeight: 5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 60, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 60, targetWeight: 5, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-abs-over-unders-cocoon',
    name: 'Circuit Abdos 3x20 : Over-Unders, Cocoon & Plate Hollow Hold',
    targetZone: 'abs',
    description: '3x20 Over unders (10 horaire + 10 anti-horaire), 3x20 Scissor kicks, 3x20 Side to side leg raises, 3x20 Cocoon passes, 3x20 Dead bugs avec charge & 3x Plate hollow hold max.',
    isDefault: true,
    finisher: '3 x Plate Hollow Hold (As Long As You Can)',
    notes: 'Gardez les lombaires plaquées au tapis sur tous les mouvements de jambes.',
    exercises: [
      {
        id: 'r-abs-ou-1',
        exerciseId: 'over-unders-abs',
        exerciseName: 'Over Unders (10 Clocking + 10 Anti-Clocking)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 20, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 20, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 20, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-ou-2',
        exerciseId: 'side-to-side-leg-raises',
        exerciseName: 'Side to Side Leg Raises & Scissor Kicks',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 20, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 20, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 20, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-ou-3',
        exerciseId: 'cocoon-passes-abs',
        exerciseName: 'Cocoon Passes & Dead Bugs avec charge',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 20, targetWeight: 4, completed: false },
          { id: 's2', setNumber: 2, targetReps: 20, targetWeight: 4, completed: false },
          { id: 's3', setNumber: 3, targetReps: 20, targetWeight: 4, completed: false },
        ]
      },
      {
        id: 'r-abs-ou-4',
        exerciseId: 'plate-hollow-hold',
        exerciseName: 'Plate Hollow Hold (As Long As You Can)',
        category: 'abs',
        equipment: 'barbell',
        restSeconds: 45,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 45, targetWeight: 5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 45, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 45, targetWeight: 5, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-abs-weighted-12',
    name: 'Circuit Abdos Lestés 3x12 (Kneel to Stand & Bridge Drives)',
    targetZone: 'abs',
    description: '3x12 Weighted toe touches, 3x12 Bridge knee drives (chaque côté), 3x12 Dumbbell kneel to stand, 3x12 Weighted Russian twists & 3x12 Crunches.',
    isDefault: true,
    finisher: '3 x 12 Crunches lents contrôlés',
    notes: 'Utilisez un haltère modéré (4 à 8 kg) pour les exercices lestés.',
    exercises: [
      {
        id: 'r-abs-w12-1',
        exerciseId: 'weighted-toe-touches',
        exerciseName: 'Weighted Toe Touches',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 5, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 5, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 5, completed: false },
        ]
      },
      {
        id: 'r-abs-w12-2',
        exerciseId: 'bridge-knee-drives',
        exerciseName: 'Bridge Knee Drives (12 de chaque côté)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-w12-3',
        exerciseId: 'dumbbell-kneel-to-stand',
        exerciseName: 'Dumbbell Kneel to Stand',
        category: 'abs',
        equipment: 'dumbbell',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 8, completed: false },
          { id: 's2', setNumber: 2, targetReps: 12, targetWeight: 8, completed: false },
          { id: 's3', setNumber: 3, targetReps: 12, targetWeight: 8, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-cardio-incline-walk',
    name: 'Circuit Cardio : Marche Inclinée 12-5-30 (ou Pente 6 / 10)',
    targetZone: 'cardio',
    description: 'Séance Marche Inclinée : Débutant (Pente 6 · Vitesse 4,5 · 20 min) | Intermédiaire (Pente 10 · Vitesse 4,5 · 30 min) | Confirmée (Pente 12 · Vitesse 5 · 30 min).',
    isDefault: true,
    finisher: '2 min de retour au calme pente 0% + étirement mollets',
    notes: 'Ne vous tenez pas aux poignées du tapis pour engager les abdos et les fessiers.',
    exercises: [
      {
        id: 'r-cardio-inc-1',
        exerciseId: 'incline-walk-treadmill-levels',
        exerciseName: 'Marche inclinée Tapis (Pente 6 / 10 / 12 — Vitesse 4,5 à 5 km/h)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 0,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 30, targetWeight: 10, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-cardio-stairmaster-booty',
    name: 'Circuit Cardio : StairMaster Booty Burner (20 min)',
    targetZone: 'cardio',
    description: 'Montée progressive par paliers et pas croisés sur escalier pour sculpter les fessiers et brûler un maximum.',
    isDefault: true,
    finisher: '2 min retour au calme niveau 4 + étirement fessiers',
    notes: 'Gardez le buste légèrement penché en avant sans vous appuyer sur les rampes.',
    exercises: [
      {
        id: 'r-cardio-sm-1',
        exerciseId: 'stairmaster-glutes',
        exerciseName: 'StairMaster : Échauffement niv. 5 (3 min) + Pas 2 par 2 niv. 8 (5 min)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 8, targetWeight: 8, completed: false },
        ]
      },
      {
        id: 'r-cardio-sm-2',
        exerciseId: 'stairmaster-glutes',
        exerciseName: 'StairMaster HIIT : 6 tours (45s niv. 11 / 45s niv. 6) + Pas croisés (4 min)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 0,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 12, targetWeight: 11, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-cardio-hiit-treadmill',
    name: 'Circuit Cardio : Fractionné HIIT Sprints Tapis (20 min)',
    targetZone: 'cardio',
    description: 'Alternance explosive de 8 sprints de 30s (12-14 km/h) et 60s de marche active (5 km/h).',
    isDefault: true,
    finisher: '4 min de marche lente à 4 km/h pour redescendre le rythme cardiaque',
    notes: 'Échauffez-vous 4 minutes en footing léger avant de lancer le premier sprint.',
    exercises: [
      {
        id: 'r-cardio-hiit-1',
        exerciseId: 'treadmill-hiit-sprints',
        exerciseName: 'Sprints HIIT Tapis : 8 x (30s Sprint 12-14 km/h / 60s Marche 5 km/h)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 8, targetWeight: 13, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-cardio-elliptical-rower',
    name: 'Circuit Cardio : Pyramide Elliptique & Rameur 500m (25 min)',
    targetZone: 'cardio',
    description: 'Combo cardio sans impact articulaire : 5 x 500m au Rameur ou Pyramide de résistance sur Elliptique.',
    isDefault: true,
    finisher: '3 min de retour au calme souple + hydratation',
    notes: 'Pédalez en arrière 4 minutes au milieu de la séance elliptique pour cibler fessiers et ischios.',
    exercises: [
      {
        id: 'r-cardio-ell-1',
        exerciseId: 'elliptical-pyramid',
        exerciseName: 'Pyramide Elliptique (Paliers résistance 5 → 8 → 11 → 14 + Marche arrière)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 15, targetWeight: 11, completed: false },
        ]
      },
      {
        id: 'r-cardio-row-1',
        exerciseId: 'rower-intervals',
        exerciseName: 'Rameur Concept2 : 3 x 500m cadence soutenue (1 min récup)',
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 60,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 3, targetWeight: 5, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-abs-sablier-vacuum',
    name: 'Circuit Abdos Sablier, Vacuum & Taille Fine (12 min)',
    targetZone: 'abs',
    description: 'Focus transverse profond (Stomach Vacuum), Mountain climbers croisés lents et gainage ventral actif.',
    isDefault: true,
    finisher: '5 cycles de 10s de Stomach Vacuum debout ou à 4 pattes',
    notes: 'Idéal en fin de séance ou le matin à jeun pour engager le transverse en profondeur.',
    exercises: [
      {
        id: 'r-abs-sab-1',
        exerciseId: 'stomach-vacuum',
        exerciseName: 'Stomach Vacuum hypopressif (5 cycles de 10s)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 20,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 5, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 5, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 5, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-sab-2',
        exerciseId: 'deadbug-core',
        exerciseName: 'Deadbug contrôlé lombaires plaquées',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 16, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 16, targetWeight: 0, completed: false },
        ]
      },
      {
        id: 'r-abs-sab-3',
        exerciseId: 'hollow-body-hold',
        exerciseName: 'Planche ventrale active & Hollow Hold (45 sec)',
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 30,
        sets: [
          { id: 's1', setNumber: 1, targetReps: 45, targetWeight: 0, completed: false },
          { id: 's2', setNumber: 2, targetReps: 45, targetWeight: 0, completed: false },
          { id: 's3', setNumber: 3, targetReps: 45, targetWeight: 0, completed: false },
        ]
      }
    ]
  }
];


