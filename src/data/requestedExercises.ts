import { Exercise } from '../types/fitness';

export const REQUESTED_EXERCISES: Exercise[] = [
  // ==========================================
  // BAS DU CORPS (Fessiers, Quadriceps, Ischios, Adducteurs)
  // ==========================================
  {
    id: 'hip-thrust-dumbbell',
    name: 'Hip thrust avec haltère',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier & Ischios',
    secondaryMuscles: ['Quadriceps', 'Abdominaux'],
    equipment: 'dumbbell',
    description: 'Variante au banc avec haltère lourd calé sur le bassin, idéale pour une brûlure fessière ciblée sans charger de barre olympique.',
    startingPosition: 'Haut du dos calé contre le rebord d’un banc stable (sous la pointe des omoplates), haltère maintenu à deux mains sur le pli de hanche.',
    steps: [
      'Ancrez fermement vos talons au sol, tibias verticaux au point haut.',
      'Gardez le menton rentré vers le buste et le regard droit devant vous.',
      'Poussez par les talons pour élever le bassin jusqu’à aligner le tronc avec les cuisses.',
      'Contractez les fessiers au sommet pendant 2 secondes sans cambrer les lombaires.',
      'Redescendez avec contrôle en maintenant la tension continue.'
    ],
    breathing: 'Inspirez à la descente, expirez puissamment en verrouillant les fessiers au sommet.',
    formTips: [
      'Placez un coussin ou une serviette pliée sous l’haltère pour plus de confort sur le bassin.',
      'Poussez exclusivement par les talons, les orteils peuvent même être légèrement décollés.'
    ],
    commonMistakes: [
      'Regarder vers le plafond au sommet ce qui cambre le bas du dos.',
      'Descendre trop bas sans contrôler la trajectoire.'
    ],
    avoidTips: [
      'Ne relâchez jamais la contraction en haut, le bassin doit être en rétroversion contrôlée.'
    ],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat standard de 40-42 cm de hauteur (bord calé sous les omoplates)',
      footPosition: 'Pieds à plat écartés largeur des épaules, pointes ouvertes à 15-20°',
      gripWidth: 'Mains tenant fermement chaque tête de l’haltère sur le pubis',
      safetyCue: 'Menton rentré, bassin en rétroversion active au sommet pour protéger les lombaires',
    },
  },
  {
    id: 'reverse-lunges-dumbbell',
    name: 'Fentes arrières avec haltères',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier & Ischio-jambiers',
    secondaryMuscles: ['Quadriceps', 'Mollets'],
    equipment: 'dumbbell',
    description: 'Recul du pied en fente arrière, préservant l’articulation du genou avant tout en maximisant la tension d’étirement sur le grand fessier.',
    startingPosition: 'Debout pieds joints, un haltère dans chaque main le long des cuisses, tronc engagé.',
    steps: [
      'Faites un grand pas vers l’arrière sur un rail parallèle (largeur de bassin).',
      'Fléchissez les deux genoux en descendant jusqu’à ce que le genou arrière effleure le sol.',
      'Inclinez légèrement le buste vers l’avant (30°) pour reporter le poids sur le fessier avant.',
      'Poussez fortement à travers le talon avant pour revenir en position debout.'
    ],
    breathing: 'Inspirez en reculant et descendant, expirez en revenant en position initiale.',
    formTips: [
      'Pieds sur deux lignes parallèles pour préserver un équilibre parfait sans vaciller.',
      'Tibia de la jambe avant quasi vertical pour soulager la rotule.'
    ],
    commonMistakes: [
      'Pas trop court amenant le genou arrière sous le bassin sans amplitude.',
      'Buste trop redressé si votre objectif principal est le développement fessier.'
    ],
    avoidTips: [
      'Ne laissez pas le genou avant s’effondrer vers l’intérieur (valgus).'
    ],
    defaultSets: 3,
    defaultReps: '10-12 / jambe',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Espace dégagé au sol sans obstacle',
      footPosition: 'Pieds sur deux rails parallèles écartés de la largeur du bassin',
      gripWidth: 'Prise neutre, haltères tenus bras tendus le long du corps',
      safetyCue: 'Tronc incliné à 30°, poussée exclusive dans le talon avant',
    },
  },
  {
    id: 'squat-sumo-dumbbell',
    name: 'Squat sumo avec haltère',
    category: 'lower-body',
    specificMuscle: 'adducteurs',
    primaryMuscle: 'Adducteurs & Grand fessier',
    secondaryMuscles: ['Quadriceps', 'Plancher pelvien'],
    equipment: 'dumbbell',
    description: 'Écartement large des pieds et pointes orientées vers l’extérieur pour recruter intensément les adducteurs et le galbe sous-fessier.',
    startingPosition: 'Debout, pieds écartés à 1.5 fois la largeur des épaules, pointes ouvertes à 45°, haltère lourd tenu verticalement à deux mains.',
    steps: [
      'Initiez la descente en ouvrant grand les genoux vers l’extérieur dans la direction exacte des orteils.',
      'Descendez le bassin à la verticale en conservant le buste très droit.',
      'Descendez jusqu’à ce que l’haltère effleure le sol (ou descendez entre 2 steps pour plus d’amplitude).',
      'Poussez par les talons et serrez activement les cuisses et fessiers au sommet.'
    ],
    breathing: 'Inspirez à la descente en ouvrant les hanches, expirez en fin de remontée.',
    formTips: [
      'Visualisez l’action de vouloir resserrer le sol entre vos deux talons pour activer les adducteurs.',
      'Ne laissez jamais les genoux rentrer vers l’intérieur lors de la remontée.'
    ],
    commonMistakes: [
      'Pieds pas assez écartés ou pointes pas assez ouvertes.',
      'Se pencher exagérément en avant comme sur un soulevé de terre.'
    ],
    avoidTips: [
      'Ne décollez pas les talons du sol, la pression doit rester uniformément répartie.'
    ],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Possibilité de placer chaque pied sur un step pour une amplitude maximale',
      footPosition: 'Écartement 1.5x largeur épaules, pointes de pieds orientées à 45°',
      gripWidth: 'Haltère lourd saisi à deux mains sous la tête supérieure',
      safetyCue: 'Genoux rigoureusement orientés dans l’alignement des orteils',
    },
  },
  {
    id: 'leg-press-glutes-focus',
    name: 'Presse qui travaille les fessiers (Presse 45° pieds hauts)',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier & Ischios',
    secondaryMuscles: ['Quadriceps', 'Adducteurs'],
    equipment: 'machine',
    description: 'Configuration spécifique sur presse inclinée à 45° : pieds placés tout en haut et écartés pour maximiser l’extension de hanche et l’isolation fessière.',
    startingPosition: 'Assise au fond du siège, dos collé au dossier, pieds posés tout en haut du plateau écartés largeur d’épaules.',
    steps: [
      'Déverrouillez les poignées de sécurité en maintenant fermement le plateau.',
      'Descendez le plateau en laissant les hanches fléchir profondément vers vous.',
      'Arrêtez la descente juste avant que le bas de votre bassin ne commence à s’enrouler.',
      'Poussez exclusivement par les talons jusqu’à extension sans bloquer les genoux.',
      'Contractez volontairement les fessiers au point culminant.'
    ],
    breathing: 'Inspirez profondément à la descente, expirez puissamment pendant la poussée.',
    formTips: [
      'Pieds hauts = angle de genou réduit et angle de hanche augmenté = 100% fessiers.',
      'Tirez fermement sur les poignées latérales pour vous river au fond du siège.'
    ],
    commonMistakes: [
      'Décoller le sacrum (rétroversion pelvienne) en bas de mouvement.',
      'Verrouiller brutalement les genoux en haut.'
    ],
    avoidTips: [
      'Ne placez jamais les pieds au milieu ou en bas si vous ciblez les fessiers.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    hasFootPlacementGuide: true,
    machineSetup: {
      diagramType: 'leg_press',
      seatSetting: 'Dossier incliné à 45° ou reculé d’un cran pour dégager la flexion de hanche',
      footPosition: 'Pieds tout en haut du plateau, écartés largeur d’épaules, pointes tournées à 30°',
      gripWidth: 'Poignées latérales fermement saisies pour comprimer le bassin au siège',
      safetyCue: 'Bassin plaqué, ne jamais laisser le bas du dos se décoller du dossier',
    },
  },
  {
    id: 'single-leg-press',
    name: 'Presse à cuisses unilatérale (Single Leg Press)',
    category: 'lower-body',
    specificMuscle: 'fessiers',
    primaryMuscle: 'Grand fessier & Quadriceps unilatéral',
    secondaryMuscles: ['Ischios', 'Adducteurs'],
    equipment: 'machine',
    description: 'Poussée d’une seule jambe à la presse 45° pour isoler chaque côté, corriger les déséquilibres et maximiser le recrutement fessier sous amplitude complète.',
    startingPosition: 'Assise au fond du siège, dos plaqué, un seul pied posé haut et au centre du plateau, l’autre jambe relâchée hors trajectoire.',
    steps: [
      'Déverrouillez le plateau avec les poignées de sécurité.',
      'Fléchissez le genou pour descendre le plateau avec contrôle vers la poitrine.',
      'Descendez jusqu’à former un angle de 90° à la hanche sans décoller le bas du dos.',
      'Poussez fermement à travers le talon sans verrouiller le genou en extension.',
      'Effectuez toutes les répétitions d’un côté avant d’alterner.'
    ],
    breathing: 'Inspirez à la descente, expirez puissamment pendant la poussée.',
    formTips: [
      'Pied placé en haut du plateau pour recruter intensément le grand fessier.',
      'Gardez le genou aligné avec la pointe du pied pendant toute la trajectoire.'
    ],
    commonMistakes: [
      'Décoller la hanche du côté de la jambe qui pousse.',
      'Verrouiller le genou brutalement en haut.'
    ],
    avoidTips: [
      'Ne laissez jamais le genou s’effondrer vers l’intérieur lors de la poussée.'
    ],
    defaultSets: 3,
    defaultReps: '10-12 / jambe',
    defaultRestSeconds: 75,
    hasFootPlacementGuide: true,
    machineSetup: {
      diagramType: 'leg_press',
      seatSetting: 'Dossier réglé à 45°, bassin plaqué',
      footPosition: 'Un seul pied haut au milieu du plateau, pointe légèrement ouverte à 15°',
      gripWidth: 'Poignées latérales tenues fermement pour maintenir le bassin au fond du siège',
      safetyCue: 'Pousser dans le talon, conserver un micro-fléchissement en haut',
    },
  },
  {
    id: 'barbell-back-squat',
    name: 'Squats à la barre libre',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps & Fessiers',
    secondaryMuscles: ['Ischios', 'Lombaires', 'Abdominaux'],
    equipment: 'barbell',
    description: 'Le mouvement roi par excellence : charge lourde libre développant la force globale, l’épaisseur des cuisses et la stabilité du tronc.',
    startingPosition: 'Barre chargée reposant sur le haut des trapèzes, pieds écartés largeur d’épaules, regard droit.',
    steps: [
      'Reculez de deux pas du rack, stabilisez votre posture et inspirez en gonflant le ventre (manoeuvre de Valsalva).',
      'Initiez le mouvement en poussant simultanément les genoux vers l’extérieur et le bassin vers l’arrière.',
      'Descendez au moins jusqu’à ce que le pli de la hanche atteigne le niveau du genou (la parallèle).',
      'Explosez vers le haut en poussant le sol à travers tout le pied.',
      'Expirez en franchissant le point dur de la remontée.'
    ],
    breathing: 'Grande inspiration et blocage au départ, expiration en haut de mouvement.',
    formTips: [
      'Coudes tirés vers le bas pour verrouiller le grand dorsal et créer une assise ferme pour la barre.',
      'Conservez le poids centré au milieu du pied (ni sur la pointe, ni uniquement sur le talon).'
    ],
    commonMistakes: [
      'Genoux qui rentrent vers l’intérieur à la poussée.',
      'Arrondir le dos au point le plus bas (buttwink).'
    ],
    avoidTips: [
      'Ne squattez jamais sans les barres de sécurité ajustées à votre taille dans le rack.'
    ],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 120,
    machineSetup: {
      diagramType: 'squat_rack',
      seatSetting: 'Supports de barre ajustés à hauteur de clavicules (sous les aisselles)',
      footPosition: 'Pieds largeur d’épaules, pointes orientées à 15-20° vers l’extérieur',
      gripWidth: 'Prise ferme un peu plus large que les épaules, poignets alignés',
      safetyCue: 'Barres de sécurité réglées 5 cm sous votre point bas de squat',
    },
  },
  {
    id: 'forward-lunges-dumbbell',
    name: 'Fente avant avec haltères',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Fessiers', 'Mollets'],
    equipment: 'dumbbell',
    description: 'Pas avant dynamique accentuant la flexion du genou et le recrutement profond des quadriceps et stabilisateurs.',
    startingPosition: 'Debout, pieds largeur de hanches, un haltère dans chaque main le long du corps.',
    steps: [
      'Faites un pas mesuré vers l’avant avec le pied droit.',
      'Descendez à la verticale jusqu’à ce que les deux genoux forment un angle de 90°.',
      'Le genou avant reste au-dessus de la cheville, le genou arrière frôle le sol.',
      'Poussez fort sur le milieu et l’avant du pied avant pour revenir à la position de départ.',
      'Alternez avec la jambe gauche.'
    ],
    breathing: 'Inspirez en descendant, expirez en repoussant le sol.',
    formTips: [
      'Buste fier et vertical pour concentrer la charge sur l’avant de la cuisse.',
      'Regardez un point fixe devant vous pour garder l’équilibre.'
    ],
    commonMistakes: [
      'Pas trop court qui projette le genou excessivement au-delà des orteils avec décollement du talon.',
      'Perte d’équilibre par manque d’écartement latéral.'
    ],
    avoidTips: [
      'Ne tapez pas violemment le genou arrière contre le carrelage.'
    ],
    defaultSets: 3,
    defaultReps: '12 / jambe',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Zone au sol dégagée',
      footPosition: 'Pas en avant contrôlé, pieds sur deux lignes parallèles',
      gripWidth: 'Prise neutre le long des flancs',
      safetyCue: 'Garder le buste vertical et les abdominaux contractés',
    },
  },
  {
    id: 'goblet-squat-dumbbell-variation',
    name: 'Goblet squat avec haltères',
    category: 'lower-body',
    specificMuscle: 'quadriceps',
    primaryMuscle: 'Quadriceps & Fessiers',
    secondaryMuscles: ['Abdominaux', 'Mollets'],
    equipment: 'dumbbell',
    description: 'Squat avec haltère tenu contre le haut de la poitrine pour une posture verticale parfaite et un travail complet des cuisses.',
    startingPosition: 'Debout pieds écartés largeur d’épaules, haltère lourd tenu verticalement à deux mains contre le haut du thorax.',
    steps: [
      'Initiez la descente en ouvrant les genoux vers l’extérieur et en reculant le bassin.',
      'Descendez jusqu’à ce que vos coudes effleurent l’intérieur des genoux.',
      'Poussez le sol par le milieu du pied et les talons pour remonter.',
      'Gardez le buste fier et haut tout au long du mouvement.'
    ],
    breathing: 'Inspirez en descendant, expirez en remontant.',
    formTips: [
      'Gardez les coudes pointés vers le bas à l’intérieur des genoux en bas du squat.',
      'Ne laissez pas l’haltère vous tirer vers l’avant.'
    ],
    commonMistakes: [
      'Genoux qui rentrent vers l’intérieur à la remontée.'
    ],
    avoidTips: [
      'Ne décollez pas les talons du sol.'
    ],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout sans machine',
      footPosition: 'Pieds largeur d’épaules, pointes tournées à 20°',
      gripWidth: 'Haltère tenu à deux mains plaqué contre le haut du thorax',
      safetyCue: 'Buste droit et fier, dos plat, coudes à l’intérieur des genoux',
    },
  },
  {
    id: 'single-leg-rdl-dumbbell',
    name: 'RDL unijambiste avec haltère',
    category: 'lower-body',
    specificMuscle: 'ischios',
    primaryMuscle: 'Ischio-jambiers & Grand fessier',
    secondaryMuscles: ['Lombaires', 'Abdominaux obliques', 'Cheville'],
    equipment: 'dumbbell',
    description: 'Mouvement unilatéral exceptionnel pour l’étirement sous charge des ischios, le renforcement de la voûte plantaire et la stabilité pelvienne.',
    startingPosition: 'En appui sur la jambe droite (légèrement déverrouillée), haltère tenu dans la main gauche, buste gainé.',
    steps: [
      'Basculez le buste vers l’avant tout en envoyant la jambe gauche tendue vers l’arrière.',
      'Faites glisser l’haltère le long de la cuisse et du tibia d’appui.',
      'Descendez jusqu’à ce que votre torse et votre jambe arrière soient parallèles au sol.',
      'Ressentez l’étirement intense de l’ischio de la jambe au sol.',
      'Contractez le fessier d’appui pour ramener le bassin vers l’avant.'
    ],
    breathing: 'Inspirez à la descente contrôlée, expirez en vous redressant.',
    formTips: [
      'Imaginez que votre corps forme une ligne rigide droite du talon de la jambe arrière jusqu’au sommet du crâne.',
      'Possibilité de poser le bout des doigts de la main libre sur un mur pour stabiliser sans forcer sur l’équilibre.'
    ],
    commonMistakes: [
      'Ouvrir la hanche de la jambe arrière vers le plafond au lieu de la garder face au sol.',
      'Plier excessivement le genou d’appui comme pour faire un squat.'
    ],
    avoidTips: [
      'Ne courbez pas le bas du dos pour chercher plus d’amplitude.'
    ],
    defaultSets: 3,
    defaultReps: '10-12 / jambe',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Sol plat stable (proximité d’un montant ou mur pour équilibre)',
      footPosition: 'Pied d’appui ancré en tripode, jambe opposée tendue dans l’alignement du dos',
      gripWidth: 'Haltère dans la main opposée à la jambe d’appui',
      safetyCue: 'Hanches restant rigoureusement parallèles au sol sans bascule latérale',
    },
  },

  // ==========================================
  // DOS (Grand dorsal, Milieu du dos, Lombaires, Trapèzes)
  // ==========================================
  {
    id: 'dumbbell-pullover',
    name: 'Pull over avec haltère',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal (Fibres inférieures)',
    secondaryMuscles: ['Pectoraux', 'Longue portion du triceps', 'Dentelés'],
    equipment: 'dumbbell',
    description: 'Étirement profond du grand dorsal en travers d’un banc plat, favorisant l’ouverture de cage et l’élargissement du haut du dos.',
    startingPosition: 'Allongée en travers d’un banc, haut du dos en appui sur la mousse, bassin légèrement abaissé, haltère tenu à deux mains au-dessus du visage.',
    steps: [
      'Tenez l’haltère à deux mains, paumes plaquées sous le disque supérieur (prise diamant).',
      'Coudes très légèrement fléchis à angle fixe, descendez l’haltère en arc de cercle derrière votre tête.',
      'Allez chercher un étirement profond sous les aisselles sans cambrer démesurément.',
      'Tirez l’haltère vers l’avant en contractant puissamment vos grands dorsaux.',
      'Arrêtez la remontée au-dessus de la ligne du front pour garder la tension.'
    ],
    breathing: 'Grande inspiration lors de la descente derrière la tête, expiration en ramenant l’haltère.',
    formTips: [
      'Ne pliez pas et ne tendez pas les coudes pendant l’exercice : l’angle du bras reste scellé.',
      'Baissez légèrement les hanches pour ancrer le tronc.'
    ],
    commonMistakes: [
      'Transformer l’exercice en barre au front en fléchissant les coudes.',
      'Descendre trop bas au-delà de la mobilité scapulaire.'
    ],
    avoidTips: [
      'Ne forcez pas si vous avez des antécédents d’instabilité de l’épaule.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat standard posé horizontalement',
      footPosition: 'Pieds à plat au sol écartés largeur des épaules pour une stabilité sans faille',
      gripWidth: 'Deux paumes soutenant le plateau supérieur de l’haltère',
      safetyCue: 'Coudes semi-fléchis verrouillés à angle constant, trajectoire en arc contrôlée',
    },
  },
  {
    id: 'bent-over-barbell-row',
    name: 'Rowing penché à la barre',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Rhomboïdes, Trapèzes moyens & Grand dorsal',
    secondaryMuscles: ['Lombaires', 'Biceps', 'Arrière d’épaule'],
    equipment: 'barbell',
    description: 'Tirage penché buste à 45-60° pour densifier l’épaisseur du dos, redresser les épaules et forger une posture altière.',
    startingPosition: 'Debout, pieds largeur de hanches, buste penché vers l’avant, dos plat, barre tenue en pronation devant les tibias.',
    steps: [
      'Fléchissez légèrement les genoux et poussez les hanches en arrière.',
      'Tirez la barre vers le bas du sternum / nombril en amenant les coudes haut vers l’arrière.',
      'Serrez vigoureusement les omoplates au sommet pendant 1 seconde.',
      'Redescendez la barre de manière fluide en laissant le dos s’étirer sans s’arrondir.'
    ],
    breathing: 'Inspirez au point bas, expirez en tirant la barre vers le ventre.',
    formTips: [
      'Pensez à tirer avec vos coudes plutôt qu’avec vos mains pour déconnecter les biceps.',
      'Gardez la nuque neutre dans l’axe de la colonne.'
    ],
    commonMistakes: [
      'Donner un grand à-coup de reins pour décoller la charge.',
      'Arrondir le bas du dos.'
    ],
    avoidTips: [
      'Ne vous redressez pas à chaque répétition : l’angle du torse doit rester immobile.'
    ],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    machineSetup: {
      diagramType: 'squat_rack',
      seatSetting: 'Départ barre au sol ou sur les crochets bas du rack à hauteur de genoux',
      footPosition: 'Pieds largeur de hanches, genoux souples',
      gripWidth: 'Prise pronation un peu plus large que la largeur des épaules',
      safetyCue: 'Dos parfaitement rectiligne, cambrure lombaire physiologique respectée',
    },
  },
  {
    id: 'seated-cable-row-low',
    name: 'Rowing poulie basse assise',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Rhomboïdes & Trapèzes moyens',
    secondaryMuscles: ['Grand dorsal', 'Biceps'],
    equipment: 'cable',
    description: 'Tirage horizontal avec poignée serrée en V pour isoler le milieu du dos avec une tension continue idéale sans tension sur la colonne.',
    startingPosition: 'Assise sur le banc de tirage, pieds calés sur les repose-pieds, genoux souples, dos droit, bras tendus tenant la poignée.',
    steps: [
      'Grandissez-vous, sortez la poitrine et abaissez les épaules.',
      'Tirez la poignée vers le nombril en conduisant avec les coudes vers l’arrière.',
      'Resserrez fermement les omoplates en fin de course.',
      'Contrôlez le retour en sentant l’étirement du milieu du dos sans relâcher la colonne.'
    ],
    breathing: 'Expirez pendant le tirage, inspirez lors du retour contrôlé.',
    formTips: [
      'Gardez le buste quasi vertical avec une très légère inclinaison d’avant en arrière (amplitude naturelle).',
      'Ne laissez pas les épaules s’enrouler vers l’avant en fin de tirage.'
    ],
    commonMistakes: [
      'Balancer le haut du corps d’avant en arrière de 45° pour tricher.',
      'Verrouiller complètement les genoux sur les repose-pieds.'
    ],
    avoidTips: [
      'Ne tirez pas la poignée trop haut vers la gorge, cela surcharge inutilement les trapèzes supérieurs.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'seated_row',
      seatSetting: 'Banc de tirage horizontal, assise calée',
      footPosition: 'Pieds bien à plat sur les cales métalliques, genoux légèrement déverrouillés',
      gripWidth: 'Poignée double en V (prise neutre mains face à face)',
      safetyCue: 'Poitrine bombée, épaules basses, fixation scapulaire au tirage',
    },
  },
  {
    id: 'chest-supported-machine-row',
    name: 'Rowing à la machine (appui poitrine)',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Rhomboïdes, Trapèzes & Grand dorsal',
    secondaryMuscles: ['Deltoïdes postérieurs', 'Biceps'],
    equipment: 'machine',
    description: 'Machine de tirage horizontal avec coussin d’appui thoracique supprimant toute tension parasite sur les lombaires pour un focus 100% dos.',
    startingPosition: 'Assise avec la poitrine fermement calée contre le coussin sternal, poignées tenues en prise neutre ou pronation.',
    steps: [
      'Réglez l’assise pour que les poignées soient alignées avec le milieu du sternum.',
      'Tirez les poignées vers vous en guidant le mouvement avec les pointes des coudes.',
      'Plaquez vos omoplates l’une contre l’autre en fin de course.',
      'Freinez le retour sur 2 secondes complètes pour profiter du temps sous tension.'
    ],
    breathing: 'Expirez à la traction, inspirez sur la phase excentrique.',
    formTips: [
      'Ne décollez jamais le thorax du coussin : c’est la garantie d’un recrutement dorsal pur sans à-coup.',
      'Variez les prises (neutre ou pronation) pour solliciter différentes fibres musculaires.'
    ],
    commonMistakes: [
      'Reculer la tête et cambrer pour décoller la poitrine de la machine.'
    ],
    avoidTips: [
      'Ne relâchez pas les poids de manière sèche en fin de répétition.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'seated_row',
      seatSetting: 'Cran de siège ajusté pour que le haut du sternum affleure le sommet du coussin',
      footPosition: 'Pieds calés sur les cales prévues de la machine',
      gripWidth: 'Prise neutre ou poignées horizontales selon la machine',
      safetyCue: 'Poitrine collée au coussin pendant toute la durée de la série',
    },
  },
  {
    id: 'one-arm-dumbbell-row',
    name: 'Rowing haltère un bras',
    category: 'back',
    specificMuscle: 'grand-dorsal',
    primaryMuscle: 'Grand dorsal (Unilatéral)',
    secondaryMuscles: ['Rhomboïdes', 'Biceps', 'Arrière épaule'],
    equipment: 'dumbbell',
    description: 'Mouvement unilatéral roi pour étirer et contracter le grand dorsal avec une liberté totale de trajectoire.',
    startingPosition: 'Un genou et une main posés sur un banc plat, dos parallèle au sol, autre pied au sol en retrait, haltère tenu dans la main libre.',
    steps: [
      'Laissez l’haltère descendre vers le sol pour étirer le grand dorsal.',
      'Tirez l’haltère vers la hanche en décrivant un arc de cercle doux.',
      'Amenez le coude au-delà du dos en maintenant les épaules droites.',
      'Marquez un temps d’arrêt au sommet puis redescendez avec contrôle.'
    ],
    breathing: 'Expirez en tirant le coude vers la hanche, inspirez en redescendant.',
    formTips: [
      'Tirez vers la hanche plutôt que vers l’aisselle pour concentrer le stimulus sur le bas du grand dorsal.',
      'Ne tournez pas le buste pour hisser la charge.'
    ],
    commonMistakes: [
      'Faire pivoter les épaules vers le plafond (rotation du torse).',
      'Dos rond par mauvais placement sur le banc.'
    ],
    avoidTips: [
      'Gardez le coude près du corps, ne l’écartez pas à 90°.'
    ],
    defaultSets: 3,
    defaultReps: '10-12 / côté',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat standard horizontal',
      footPosition: 'Genou d’appui sur le banc, pied d’appui au sol décalé de 30-40 cm pour la stabilité',
      gripWidth: 'Prise neutre sur l’haltère, main d’appui à plat sur le banc sous l’épaule',
      safetyCue: 'Dos plat horizontal, aucune torsion vertébrale lors du tirage',
    },
  },
  {
    id: 'bent-over-dumbbell-row',
    name: 'Rowing buste penché aux haltères',
    category: 'back',
    specificMuscle: 'milieu-dos',
    primaryMuscle: 'Milieu du dos & Grand dorsal',
    secondaryMuscles: ['Arrière d’épaule', 'Biceps', 'Lombaires'],
    equipment: 'dumbbell',
    description: 'Tirage bilatéral aux haltères offrant une trajectoire plus ergonomique et respectueuse des poignets que la barre rigide.',
    startingPosition: 'Debout pieds écartés largeur de hanches, buste penché à 45°, un haltère dans chaque main en prise semi-neutre.',
    steps: [
      'Buste gainé, genoux souples et fesses poussées vers l’arrière.',
      'Tirez les deux haltères vers les hanches en ouvrant la poitrine.',
      'Serrez les omoplates l’une vers l’autre en haut de mouvement.',
      'Contrôlez la descente jusqu’à sentir l’étirement dorsal complet.'
    ],
    breathing: 'Inspirez à la descente, expirez pendant le tirage.',
    formTips: [
      'La prise neutre ou semi-neutre permet d’amener les haltères plus loin vers l’arrière sans contraindre l’épaule.',
      'Gardez le menton rentré pour aligner les vertèbres cervicales.'
    ],
    commonMistakes: [
      'Rebondir avec les cuisses pour générer de l’élan.',
      'Courber la région lombaire.'
    ],
    avoidTips: [
      'Ne regardez pas le plafond dans le miroir pendant le mouvement.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Espace dégagé au sol',
      footPosition: 'Pieds largeur de hanches, genoux fléchis',
      gripWidth: 'Prise semi-neutre, paumes tournées à 45° vers le corps',
      safetyCue: 'Tronc figé à 45°, tirage fluide sans sursaut des jambes',
    },
  },
  {
    id: 'good-morning-barbell',
    name: 'Good morning à la barre',
    category: 'back',
    specificMuscle: 'lombaires',
    primaryMuscle: 'Lombaires (Érecteurs du rachis) & Ischios',
    secondaryMuscles: ['Grand fessier', 'Abdominaux profonds'],
    equipment: 'barbell',
    description: 'Flexion de hanche contrôlée avec barre sur les trapèzes pour renforcer en profondeur la sangle érectrice et la chaîne postérieure.',
    startingPosition: 'Debout, pieds largeur d’épaules, barre reposant fermement sur les trapèzes, genoux déverrouillés.',
    steps: [
      'Inspirez et engagez la sangle abdominale.',
      'Poussez le bassin vers l’arrière en inclinant le buste vers l’avant.',
      'Descendez jusqu’à ce que le tronc soit à 45° ou parallèle au sol selon votre souplesse d’ischios.',
      'Gardez le dos rigoureusement plat avec un arc naturel.',
      'Contractez les fessiers et les érecteurs pour revenir en position verticale.'
    ],
    breathing: 'Inspirez lors de la flexion de hanche, expirez en revenant debout.',
    formTips: [
      'Ce mouvement est une charnière de hanche (hip hinge) : les genoux plient à peine, c’est le bassin qui recule.',
      'Commencez avec une barre légère pour maîtriser le tempo.'
    ],
    commonMistakes: [
      'Arrondir la colonne vertébrale en voulant descendre trop bas.',
      'Fléchir les genoux comme dans un squat.'
    ],
    avoidTips: [
      'N’utilisez jamais de charge maximale sur cet exercice : la régularité et la forme priment.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    machineSetup: {
      diagramType: 'squat_rack',
      seatSetting: 'Supports de rack réglés à hauteur de poitrine',
      footPosition: 'Pieds largeur d’épaules, talons fermement ancrés',
      gripWidth: 'Prise un peu plus large que les épaules, coudes tirés en arrière',
      safetyCue: 'Colonne neutre indéformable, amplitude adaptée à la souplesse des ischios',
    },
  },
  {
    id: 'weighted-back-extension',
    name: 'Extension lombaire lestée (banc 45°)',
    category: 'back',
    specificMuscle: 'lombaires',
    primaryMuscle: 'Érecteurs spinaux & Fessiers',
    secondaryMuscles: ['Ischio-jambiers'],
    equipment: 'machine',
    description: 'Banc incliné à 45° avec disque ou haltère tenu contre le torse pour tonifier les lombaires et la posture dorsale.',
    startingPosition: 'Bassin calé contre le coussin supérieur (juste sous la crête iliaque), chevilles calées sous les boudins, haltère ou disque serré contre la poitrine.',
    steps: [
      'Enroulez légèrement ou maintenez le dos plat en descendant le buste vers le bas.',
      'Descendez jusqu’à sentir un étirement modéré de la chaîne postérieure.',
      'Remontez en contractant les fessiers et le bas du dos jusqu’à aligner le tronc avec les jambes.',
      'Bloquez 1 seconde en position alignée sans cambrer vers l’arrière.',
      'Redescendez avec fluidité.'
    ],
    breathing: 'Inspirez à la descente, expirez en remontant.',
    formTips: [
      'Pour focaliser sur les lombaires : conservez la colonne neutre lors de la montée.',
      'Pour focaliser sur les fessiers : arrondissez légèrement le haut du dos et pointez les orteils vers l’extérieur.'
    ],
    commonMistakes: [
      'Hyperextension violente au sommet (se cambrer en arrière).',
      'Coussin réglé trop haut empêchant le pivotement naturel des hanches.'
    ],
    avoidTips: [
      'Ne donnez pas d’à-coups de nuque pendant le mouvement.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_incline',
      seatSetting: 'Coussin supérieur ajusté juste en dessous de l’articulation de hanche',
      footPosition: 'Pieds à plat sur le repose-pieds, talons calés contre les boudins',
      gripWidth: 'Disque ou haltère maintenu à deux mains contre la poitrine',
      safetyCue: 'S’arrêter à l’alignement tronc-jambes sans aller chercher d’hyperextension',
    },
  },
  {
    id: 'dumbbell-shrugs',
    name: 'Haussement d\'épaule avec haltère',
    category: 'back',
    specificMuscle: 'trapezes-arriere-epaule',
    primaryMuscle: 'Trapèzes supérieurs & Faisceau supérieur',
    secondaryMuscles: ['Élévateur de la scapula', 'Avant-bras'],
    equipment: 'dumbbell',
    description: 'Élévation verticale pure des épaules avec haltères pour renforcer les trapèzes et soulager les tensions cervicales.',
    startingPosition: 'Debout pieds largeur d’épaules, un haltère lourd dans chaque main le long des cuisses, bras détendus.',
    steps: [
      'Montez les épaules le plus haut possible vers les oreilles dans un mouvement purement vertical.',
      'Maintenez la contraction maximale en haut pendant 2 secondes complètes.',
      'Redescendez lentement en contrôlant la descente jusqu’à sentir l’étirement des trapèzes.'
    ],
    breathing: 'Expirez en haussant les épaules, inspirez en redescendant.',
    formTips: [
      'Mouvement strictement de bas en haut : ne faites JAMAIS de cercles ou rotations d’épaules.',
      'Gardez la tête droite et le regard à l’horizontale.'
    ],
    commonMistakes: [
      'Fléchir les bras pour tirer avec les biceps.',
      'Rouler les épaules vers l’arrière ce qui use prématurément la coiffe des rotateurs.'
    ],
    avoidTips: [
      'Ne projetez pas la tête vers l’avant pendant la contraction.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout au sol',
      footPosition: 'Pieds largeur d’épaules, genoux légèrement déverrouillés',
      gripWidth: 'Prise neutre, haltères tenus le long des cuisses',
      safetyCue: 'Trajectoire verticale pure, aucune rotation scapulaire',
    },
  },
  {
    id: 'upright-row-barbell',
    name: 'Tirage menton',
    category: 'back',
    specificMuscle: 'trapezes-arriere-epaule',
    primaryMuscle: 'Trapèzes & Deltoïdes latéraux',
    secondaryMuscles: ['Biceps', 'Avant-bras'],
    equipment: 'barbell',
    description: 'Tirage vertical le long du buste avec barre ou câble, mené par les coudes pour sculpter les trapèzes et le galbe d’épaule.',
    startingPosition: 'Debout, barre tenue en pronation devant les cuisses, mains espacées d’au moins la largeur d’épaules.',
    steps: [
      'Tirez la barre verticalement en faisant monter les coudes vers le haut et l’extérieur.',
      'La barre rase la poitrine jusqu’à hauteur de bas de pectoral / milieu du sternum.',
      'Les coudes restent toujours plus hauts que les poignets.',
      'Redescendez lentement le long du tronc.'
    ],
    breathing: 'Expirez en montant, inspirez en descendant.',
    formTips: [
      'Une prise large (largeur d’épaules ou plus) protège l’espace sous-acromial de l’épaule.',
      'Ne montez pas la barre jusqu’au menton si cela pince vos épaules.'
    ],
    commonMistakes: [
      'Prise trop serrée (mains jointes) qui comprime les tendons de l’épaule.',
      'Donner un coup de hanche pour soulever la charge.'
    ],
    avoidTips: [
      'Arrêtez la montée à hauteur de poitrine si vous ressentez une gêne à l’avant de l’épaule.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout avec barre droite ou barre EZ',
      footPosition: 'Pieds largeur de hanches, buste solide',
      gripWidth: 'Prise pronation largeur d’épaules (minimum 35-40 cm d’écartement)',
      safetyCue: 'Les coudes guident le mouvement sans dépasser la hauteur des oreilles',
    },
  },

  // ==========================================
  // ÉPAULES & BRAS (Deltoïdes, Biceps, Triceps)
  // ==========================================
  {
    id: 'shoulder-press-machine',
    name: 'Développé épaule avec machine',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur & Triceps',
    secondaryMuscles: ['Deltoïde latéral', 'Haut des pectoraux'],
    equipment: 'machine',
    description: 'Poussée verticale guidée permettant de surcharger les épaules en toute sécurité et sans contrainte d’équilibre.',
    startingPosition: 'Assise, dos collé au dossier, poignées réglées à hauteur des oreilles/clavicules, pieds ancrés.',
    steps: [
      'Saisissez les poignées en prise neutre ou pronation.',
      'Poussez de manière fluide vers le haut jusqu’à extension quasi complète (sans verrouiller les coudes).',
      'Marquez une micro-pause d’une demi-seconde au sommet.',
      'Freinez la descente jusqu’à ce que vos mains reviennent à hauteur des oreilles.'
    ],
    breathing: 'Expirez en poussant vers le haut, inspirez à la redescente.',
    formTips: [
      'Réglez la hauteur du siège pour que vos épaules ne soient pas sur-étirées au point de départ.',
      'Gardez le bas du dos bien soutenu par le bas du dossier.'
    ],
    commonMistakes: [
      'Cambrer exagérément le dos pour transformer le mouvement en développé couché incliné.',
      'Verrouiller brutalement les articulations des coudes.'
    ],
    avoidTips: [
      'Ne descendez pas les poignées plus bas que les clavicules.'
    ],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'seated_row',
      seatSetting: 'Siège ajusté de façon à ce que les poignées s’alignent avec le bas du visage / oreilles',
      footPosition: 'Pieds ancrés à plat au sol écartés largeur du bassin',
      gripWidth: 'Prise neutre confortable ou poignées pronation',
      safetyCue: 'Dos et fessiers calés au siège, coudes légèrement orientés vers l’avant (30°)',
    },
  },
  {
    id: 'overhead-barbell-press',
    name: 'Développé militaire à la barre',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur & Moyen',
    secondaryMuscles: ['Triceps', 'Haut pectoral', 'Grand dentelé'],
    equipment: 'barbell',
    description: 'Le développé strict à la barre libre debout : référence absolue de force athlétique pour bâtir des épaules sculptées.',
    startingPosition: 'Debout, barre reposant sur les clavicules et le haut des pectoraux, mains largeur d’épaules, abdos et fessiers contractés.',
    steps: [
      'Inclinez très légèrement la tête vers l’arrière pour laisser passer la trajectoire verticale de la barre.',
      'Poussez la barre en ligne droite vers le ciel en ouvrant la poitrine.',
      'Une fois la barre passée au-dessus de la tête, avancez légèrement le menton pour vous aligner sous la barre.',
      'Verrouillez l’extension avec les bras dans l’alignement des oreilles.',
      'Contrôlez la descente pour reposer la barre sur les clavicules.'
    ],
    breathing: 'Inspirez avant la poussée, expirez en passant le sommet, inspirez en redescendant.',
    formTips: [
      'Contractez très fort vos fessiers pour verrouiller le bassin et empêcher toute cambrure des lombaires.',
      'Gardez les avant-bras parfaitement verticaux sous la barre.'
    ],
    commonMistakes: [
      'Pousser avec l’impulsion des jambes (push press au lieu de strict press).',
      'Cambrure lombaire excessive.'
    ],
    avoidTips: [
      'Ne laissez pas les poignets casser en arrière sous le poids de la barre.'
    ],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    machineSetup: {
      diagramType: 'squat_rack',
      seatSetting: 'Supports réglés à hauteur de poitrine (mi-sternum)',
      footPosition: 'Pieds largeur d’épaules, ancrés au sol',
      gripWidth: 'Prise pronation juste à l’extérieur des épaules',
      safetyCue: 'Fessiers et abdos verrouillés en pierre, trajectoire verticale fluide',
    },
  },
  {
    id: 'arnold-press-dumbbell',
    name: 'Développé Arnold avec haltère',
    category: 'arms',
    specificMuscle: 'epaule-avant',
    primaryMuscle: 'Deltoïde antérieur & latéral',
    secondaryMuscles: ['Triceps', 'Trapèzes'],
    equipment: 'dumbbell',
    description: 'Variante assise mythique popularisée par Arnold Schwarzenegger : rotation continue des poignets sollicitant l’ensemble des faisceaux du deltoïde.',
    startingPosition: 'Assise sur un banc redressé (80-85°), haltères tenus devant les épaules avec les paumes tournées vers votre visage.',
    steps: [
      'Initiez la poussée vers le haut tout en écartant les coudes et en faisant pivoter les poignets vers l’extérieur.',
      'Au sommet du mouvement, vos paumes sont tournées vers l’avant comme sur un développé militaire classique.',
      'Ne verrouillez pas les coudes en haut pour garder la tension.',
      'Inversez la rotation de manière synchronisée pendant la redescente jusqu’à la position de départ.'
    ],
    breathing: 'Expirez pendant la poussée et la rotation, inspirez en refermant.',
    formTips: [
      'La rotation doit être fluide et continue tout au long du déplacement.',
      'Gardez le bas du dos collé au dossier du banc.'
    ],
    commonMistakes: [
      'Effectuer la rotation avant de commencer à pousser plutôt que simultanément.',
      'Utiliser une charge trop lourde qui dégrade la rotation.'
    ],
    avoidTips: [
      'Ne laissez pas les haltères s’écarter trop loin sur les côtés.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'bench_incline',
      seatSetting: 'Dossier de banc relevé à 80° ou 85°',
      footPosition: 'Pieds bien ancrés à plat au sol',
      gripWidth: 'Haltères saisis fermement en prise neutre puis pivotante',
      safetyCue: 'Rotation synchrone sans forcer sur la capsule articulaire',
    },
  },
  {
    id: 'bent-over-rear-delt-fly',
    name: 'Oiseau haltère penchée',
    category: 'arms',
    specificMuscle: 'epaule-arriere',
    primaryMuscle: 'Deltoïde postérieur (Arrière d’épaule)',
    secondaryMuscles: ['Rhomboïdes', 'Trapèzes moyens'],
    equipment: 'dumbbell',
    description: 'Écartés postérieurs avec petits haltères buste penché en avant pour ouvrir la posture et bomber l’arrière de l’épaule.',
    startingPosition: 'Debout buste penché à 90° parallèle au sol (ou assise en bout de banc penchée sur les cuisses), haltères tenus sous le torse.',
    steps: [
      'Fléchissez légèrement les coudes et fixez cet angle pour toute la série.',
      'Élevez les haltères sur les côtés en arc de cercle en guidant avec l’arrière des épaules.',
      'Montez les coudes jusqu’à hauteur des épaules sans donner d’élan.',
      'Marquez une seconde de contraction au sommet.',
      'Freinez la redescente jusqu’à ce que les haltères se rejoignent sous la poitrine.'
    ],
    breathing: 'Expirez à l’élévation des bras, inspirez à la redescente.',
    formTips: [
      'Pensez à mener le mouvement avec les coudes et non avec les mains.',
      'Gardez le petit doigt légèrement orienté vers le plafond au sommet.'
    ],
    commonMistakes: [
      'Utiliser des charges trop lourdes et balancer le buste.',
      'Serrer excessivement les omoplates ce qui transfère l’effort aux trapèzes.'
    ],
    avoidTips: [
      'Ne relevez pas le torse pendant l’élévation.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout penchée ou assise en bout de banc',
      footPosition: 'Pieds joints ou largeur de hanches',
      gripWidth: 'Prise neutre, petits haltères légers',
      safetyCue: 'Coudes légèrement fléchis à angle fixe, torse immobile',
    },
  },
  {
    id: 'incline-rear-delt-fly-dumbbell',
    name: 'Élévation arrière sur banc incliné avec haltères',
    category: 'arms',
    specificMuscle: 'epaule-arriere',
    primaryMuscle: 'Deltoïde postérieur (Isolation stricte)',
    secondaryMuscles: ['Trapèzes inférieurs', 'Sous-épineux'],
    equipment: 'dumbbell',
    description: 'Poitrine calée sur banc incliné à 30°, supprimant tout élan parasite pour cibler l’arrière d’épaule avec une précision millimétrée.',
    startingPosition: 'Allongée à plat ventre sur banc incliné à 30-45°, menton dégagé, haltères légers tenus sous le banc.',
    steps: [
      'Bras presque tendus avec coudes très souples.',
      'Écartez les bras sur les côtés vers le plafond en décrivant un demi-cercle.',
      'Contractez l’arrière des épaules en haut de mouvement.',
      'Contrôlez la redescente sur 2 secondes sans laisser les bras pendre de manière molle.'
    ],
    breathing: 'Expirez lors de l’ouverture des bras, inspirez au retour.',
    formTips: [
      'L’appui thoracique supprime tout trichement : c’est l’exercice le plus pur pour l’arrière de l’épaule.',
      'Privilégiez des poids modérés (2 à 6 kg) pour ressentir la brûlure.'
    ],
    commonMistakes: [
      'Plier les coudes à 90° et transformer le mouvement en rowing.',
      'Décoller le torse du banc.'
    ],
    avoidTips: [
      'Ne forcez pas sur le cou : gardez la nuque détendue.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_incline',
      seatSetting: 'Banc incliné à 30° ou 45°',
      footPosition: 'Pointes de pieds ancrées au sol pour caler le corps',
      gripWidth: 'Prise neutre ou mains légèrement en pronation',
      safetyCue: 'Sternum en contact continu avec le dossier du banc',
    },
  },
  {
    id: 'biceps-curl-dumbbell',
    name: 'Biceps curl haltère',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps brachial (Court & Long chef)',
    secondaryMuscles: ['Brachial antérieur', 'Brachio-radial'],
    equipment: 'dumbbell',
    description: 'Le mouvement classique par excellence : debout avec supination progressive en fin de montée pour sculpter le galbe et le pic du bras.',
    startingPosition: 'Debout pieds largeur de hanches, un haltère dans chaque main, bras tendus le long des cuisses, paumes vers l’intérieur.',
    steps: [
      'Fléchissez les avant-bras tout en tournant les paumes de mains vers le plafond (supination).',
      'Montez les haltères jusqu’à hauteur d’épaules en gardant les coudes plaqués contre vos côtes.',
      'Contractez au sommet pendant 1 seconde.',
      'Redescendez avec contrôle en revenant en prise neutre au bas du mouvement.'
    ],
    breathing: 'Expirez en montant les haltères, inspirez en redescendant.',
    formTips: [
      'Garder les coudes immobiles le long du torse : ils ne doivent ni reculer ni avancer.',
      'La supination complète (pouce tourné vers l’extérieur en haut) active 100% des fibres du biceps.'
    ],
    commonMistakes: [
      'Balancer le dos vers l’arrière pour donner de l’élan.',
      'Avancer les coudes vers l’avant pour reposer la charge sur les épaules.'
    ],
    avoidTips: [
      'Ne relâchez pas brusquement les bras en bas pour préserver le tendon du biceps.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout ou assise sur banc vertical',
      footPosition: 'Pieds largeur de hanches, genoux souples',
      gripWidth: 'Prise neutre pivotant en supination complète au sommet',
      safetyCue: 'Coudes rivés le long du tronc, buste rigoureusement immobile',
    },
  },
  {
    id: 'biceps-curl-cable-low',
    name: 'Biceps cule à la poulie basse (Biceps curl)',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps brachial (Tension continue)',
    secondaryMuscles: ['Avant-bras'],
    equipment: 'cable',
    description: 'Curl à la barre courte ou corde sur poulie basse assurant une tension mécanique continue du départ jusqu’à la contraction maximale.',
    startingPosition: 'Debout face à la poulie basse, petite barre en mains en prise supination, bras tendus le long du corps.',
    steps: [
      'Fixez vos coudes contre vos flancs.',
      'Fléchissez les coudes pour monter la barre vers les clavicules.',
      'Serrez les biceps au point haut pendant 1 seconde.',
      'Freinez la descente en résistant à la traction du câble.'
    ],
    breathing: 'Expirez à la montée, inspirez à la redescente.',
    formTips: [
      'Le câble maintient une tension constante même au bas du mouvement, contrairement aux haltères.',
      'Gardez les poignets droits sans les casser vers vous.'
    ],
    commonMistakes: [
      'Se pencher en arrière pendant l’effort.',
      'Laisser la poulie claquer en bas de répétition.'
    ],
    avoidTips: [
      'Ne verrouillez pas l’articulation du coude en hyper-extension en bas.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'cable_low',
      seatSetting: 'Poulie réglée au point le plus bas de la colonne',
      footPosition: 'Pieds largeur de hanches à 30 cm de la poulie',
      gripWidth: 'Prise supination largeur d’épaules sur barre droite ou coudée',
      safetyCue: 'Épaules basses, coudes plaqués le long du corps sans avancer',
    },
  },
  {
    id: 'biceps-curl-ez-bar',
    name: 'Biceps cule barre EZ (Biceps curl)',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps brachial & Brachial antérieur',
    secondaryMuscles: ['Avant-bras'],
    equipment: 'barbell',
    description: 'Barre ondulée ergonomique qui soulage les poignets et avant-bras pour une surcharge progressive sécurisée des bras.',
    startingPosition: 'Debout, barre EZ tenue sur les ondulations intérieures en prise semi-supination, bras tendus.',
    steps: [
      'Épaules en arrière, abdos gainés, coudes plaqués aux côtes.',
      'Fléchissez les avant-bras pour amener la barre vers le haut de la poitrine.',
      'Bloquez la contraction au sommet sans avancer les coudes.',
      'Redescendez avec contrôle sur 2 secondes.'
    ],
    breathing: 'Expirez en fléchissant les bras, inspirez en redescendant.',
    formTips: [
      'Les angles de la barre EZ préviennent les douleurs au poignet typiques des barres droites.',
      'Gardez les pieds ancrés et les genoux souples.'
    ],
    commonMistakes: [
      'Donner une impulsion avec les hanches pour lancer la barre.',
      'Décoller les coudes vers l’avant.'
    ],
    avoidTips: [
      'N’utilisez pas une prise trop étroite qui contraindrait les coudes vers l’extérieur.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'standing_free',
      seatSetting: 'Debout avec barre EZ libre',
      footPosition: 'Pieds écartés largeur de bassin pour la stabilité',
      gripWidth: 'Mains placées sur les courbures internes de la barre',
      safetyCue: 'Poignets neutres fermes, coudes verrouillés le long des flancs',
    },
  },
  {
    id: 'concentration-curl-dumbbell',
    name: 'Biceps curl concentré avec haltère',
    category: 'arms',
    specificMuscle: 'biceps',
    primaryMuscle: 'Biceps (Pic de contraction & Long chef)',
    secondaryMuscles: ['Brachial antérieur'],
    equipment: 'dumbbell',
    description: 'Assise sur banc, coude calé contre l’intérieur de la cuisse pour une isolation chirurgicale sans aucune possibilité de tricher.',
    startingPosition: 'Assise sur un banc, jambes écartées, coude du bras qui travaille appuyé contre l’intérieur de la cuisse correspondante, haltère en main.',
    steps: [
      'Bras presque tendu au départ, paume tournée vers l’intérieur.',
      'Fléchissez le coude pour amener l’haltère vers l’épaule opposée tout en tournant la paume vers le haut.',
      'Serrez le biceps au maximum au point culminant.',
      'Redescendez lentement sans décoller le coude de la cuisse.'
    ],
    breathing: 'Expirez à la flexion, inspirez à la redescente contrôlée.',
    formTips: [
      'Ne bougez pas le coude : la cuisse sert de point d’ancrage absolu.',
      'Concentrez toute votre attention mentale sur la boule du biceps.'
    ],
    commonMistakes: [
      'Tirer avec l’épaule ou relever le torse.',
      'Poser le coude sur le dessus de la cuisse plutôt que contre sa face interne.'
    ],
    avoidTips: [
      'Ne relâchez pas la tension en bas de mouvement.'
    ],
    defaultSets: 3,
    defaultReps: '12 / bras',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat standard posé à l’horizontale',
      footPosition: 'Pieds largement écartés à plat au sol',
      gripWidth: 'Prise supination stricte sur l’haltère',
      safetyCue: 'Coude fermement vissé contre la face interne de la cuisse',
    },
  },
  {
    id: 'overhead-triceps-extension-dumbbell',
    name: 'Triceps extension nuque avec haltère',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Longue portion)',
    secondaryMuscles: ['Faisceau médial du triceps'],
    equipment: 'dumbbell',
    description: 'Extension verticale au-dessus de la tête à deux mains, plaçant la longue portion du triceps sous un étirement maximal pour affiner l’arrière du bras.',
    startingPosition: 'Assise sur banc redressé ou banc court, un haltère lourd tenu à deux mains au-dessus de la tête, bras tendus.',
    steps: [
      'Placez vos deux paumes sous le disque supérieur de l’haltère (prise en diamant).',
      'Fléchissez les coudes pour faire descendre lentement l’haltère derrière votre nuque.',
      'Allez chercher un étirement profond des triceps.',
      'Étendez les bras vers le haut pour revenir au-dessus de la tête.',
      'Contractez les triceps en haut sans bloquer les coudes.'
    ],
    breathing: 'Inspirez à la descente derrière la tête, expirez en tendant les bras.',
    formTips: [
      'Gardez les coudes serrés vers l’intérieur (ne les laissez pas s’écarter comme des ailes).',
      'Le dos reste droit et soutenu par le dossier.'
    ],
    commonMistakes: [
      'Laisser les coudes s’ouvrir grand vers l’extérieur.',
      'Cambrer excessivement le dos en descendant la charge.'
    ],
    avoidTips: [
      'Descendez avec précaution pour ne pas heurter l’arrière de la tête.'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc assis court ou dossier réglé à 80°',
      footPosition: 'Pieds à plat au sol écartés largeur de bassin',
      gripWidth: 'Deux paumes soutenant le plateau supérieur de l’haltère en diamant',
      safetyCue: 'Coudes pointés vers le plafond et resserrés vers la tête',
    },
  },
  {
    id: 'triceps-kickback-dumbbell',
    name: 'Kickback haltères',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Faisceau latéral & Chef médial)',
    secondaryMuscles: ['Deltoïde postérieur'],
    equipment: 'dumbbell',
    description: 'Extension arrière d’avant-bras buste penché en avant, provoquant un pic de contraction intense pour tonifier l’arrière des bras sans les faire gonfler.',
    startingPosition: 'Buste penché à 45° ou genou sur banc, coude relevé et collé au flanc, avant-bras à 90°, haltère en main.',
    steps: [
      'Le bras (de l’épaule au coude) reste rigoureusement parallèle au sol.',
      'Étendez l’avant-bras vers l’arrière jusqu’à ce que le bras soit parfaitement tendu.',
      'Bloquez la contraction pendant 1 à 2 secondes au sommet.',
      'Revenez lentement à 90° sans laisser le coude s’abaisser.'
    ],
    breathing: 'Expirez lors de l’extension arrière, inspirez au retour à 90°.',
    formTips: [
      'Le coude agit comme une charnière fixe : il ne doit monter ni descendre.',
      'Une légère rotation du poignet vers le haut au sommet accentue le recrutement du faisceau externe.'
    ],
    commonMistakes: [
      'Balancer le bras entier d’avant en arrière avec élan.',
      'Laisser le coude descendre vers le sol.'
    ],
    avoidTips: [
      'Ne prenez pas trop lourd : l’efficacité réside dans la pause d’une seconde bras tendu.'
    ],
    defaultSets: 3,
    defaultReps: '12-15 / bras',
    defaultRestSeconds: 60,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Appui sur banc plat ou buste penché libre',
      footPosition: 'Pieds stables et décalés pour l’ancrage',
      gripWidth: 'Prise neutre sur petit haltère',
      safetyCue: 'Bras parallèle au sol scellé contre les côtes, extension pure',
    },
  },
  {
    id: 'skull-crushers-ez-bar',
    name: 'Barre au front (barre EZ)',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Longue portion & Chef latéral)',
    secondaryMuscles: ['Avant-bras'],
    equipment: 'barbell',
    description: 'Allongée sur le dos, flexion des avant-bras amenant la barre EZ vers le front pour étirer et charger puissamment l’arrière des bras.',
    startingPosition: 'Allongée sur banc plat, barre EZ tenue à bout de bras au-dessus de la poitrine en prise serrée pronation.',
    steps: [
      'Inclinez très légèrement les bras vers l’arrière de la tête (environ 10-15°) pour maintenir la tension.',
      'Fléchissez uniquement les coudes pour faire descendre la barre vers le sommet du crâne / front.',
      'Ressentez l’étirement puissant des triceps.',
      'Repoussez la barre vers le haut en étendant les avant-bras.',
      'Arrêtez-vous juste avant le verrouillage articulaire complet des coudes.'
    ],
    breathing: 'Inspirez à la descente vers le front, expirez lors de l’extension.',
    formTips: [
      'Amener la barre légèrement derrière le crâne plutôt que pile sur le front offre un meilleur étirement et soulage les coudes.',
      'Gardez les coudes serrés, évitez qu’ils s’écartent vers l’extérieur.'
    ],
    commonMistakes: [
      'Faire bouger les épaules et transformer l’exercice en pull-over.',
      'Descendre trop rapidement par manque de contrôle.'
    ],
    avoidTips: [
      'Prenez toujours une charge modérée pour garder un contrôle millimétré au-dessus du visage.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat horizontal',
      footPosition: 'Pieds à plat au sol ou sur le banc si tendance à trop cambrer',
      gripWidth: 'Prise serrée sur les courbures internes de la barre EZ',
      safetyCue: 'Coudes pointés vers le haut sans écartement, descente contrôlée',
    },
  },
  {
    id: 'close-grip-bench-press',
    name: 'Développé couché prise serrée (barre)',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps (Ensemble des 3 chefs)',
    secondaryMuscles: ['Pectoraux (Partie sternale)', 'Deltoïde antérieur'],
    equipment: 'barbell',
    description: 'Développé sur banc avec mains espacées de la largeur des épaules, reportant l’effort principal sur la poussée des triceps.',
    startingPosition: 'Allongée sous la barre sur banc plat, mains en pronation écartées de la largeur des épaules (30-35 cm), pieds ancrés.',
    steps: [
      'Décrochez la barre et stabilisez-la au-dessus de la poitrine.',
      'Descendez la barre de façon contrôlée en gardant les coudes près du buste (angle de 30-45°).',
      'La barre touche doucement le bas des pectoraux / sternum.',
      'Poussez de manière explosive en concentrant la force dans l’arrière des bras.',
      'Expirez en fin de poussée sans bloquer brutalement les coudes.'
    ],
    breathing: 'Inspirez à la descente, expirez pendant la poussée.',
    formTips: [
      'Ne prenez pas une prise trop étroite (moins de 25 cm) qui écraserait les poignets : la largeur des épaules est idéale.',
      'Gardez les omoplates resserrées contre le banc.'
    ],
    commonMistakes: [
      'Écarter les coudes à 90° ce qui reporte le travail sur les épaules et les pectoraux.',
      'Faire rebondir la barre sur le sternum.'
    ],
    avoidTips: [
      'Ne cassez pas les poignets en arrière : gardez-les rigoureusement droits.'
    ],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Banc plat de développé couché avec chandelles de sécurité',
      footPosition: 'Pieds fermement ancrés au sol pour la stabilité pelvienne',
      gripWidth: 'Prise pronation espacée de la largeur des épaules (environ 30-35 cm)',
      safetyCue: 'Coudes longeant le torse, trajectoire de barre rectiligne',
    },
  },
  {
    id: 'bench-dips-weighted',
    name: 'Dips entre 2 bancs (haltère sur les cuisses)',
    category: 'arms',
    specificMuscle: 'triceps',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Avant d’épaule', 'Haut pectoral'],
    equipment: 'dumbbell',
    description: 'Dips entre deux bancs parallèles avec un haltère posé sur le haut des cuisses pour surcharger l’extension des bras.',
    startingPosition: 'Mains en appui sur le rebord d’un banc derrière vous, talons posés sur un deuxième banc en face, haltère posé à plat sur les cuisses.',
    steps: [
      'Placez vos mains écartées de la largeur du bassin, doigts vers l’avant.',
      'Descendez le bassin en fléchissant les coudes vers l’arrière le long du banc.',
      'Descendez jusqu’à ce que les bras forment un angle de 90° au coude.',
      'Poussez fort dans la paume des mains pour remonter à la position de départ.',
      'Contractez les triceps au sommet.'
    ],
    breathing: 'Inspirez en descendant, expirez en repoussant les bancs.',
    formTips: [
      'Gardez le dos très proche du banc arrière pour protéger vos épaules.',
      'Demandez à un partenaire de poser l’haltère sur vos cuisses si nécessaire.'
    ],
    commonMistakes: [
      'Descendre trop bas sous les 90° ce qui surétire la capsule antérieure de l’épaule.',
      'S’éloigner du banc vers l’avant pendant la descente.'
    ],
    avoidTips: [
      'Ne descendez jamais au-delà d’un angle droit au coude.'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    machineSetup: {
      diagramType: 'bench_flat',
      seatSetting: 'Deux bancs plats parallèles espacés de la longueur des jambes',
      footPosition: 'Talons calés au centre du banc d’en face, jambes tendues',
      gripWidth: 'Mains écartées de la largeur de hanches au bord du banc arrière',
      safetyCue: 'Dos rasant le banc arrière, flexion limitée à 90° au coude',
    },
  },
  // ==========================================
  // 8. NOUVEAUX EXERCICES ABDOS (Debout & Sol)
  // ==========================================
  {
    id: 'overhead-marches-heavy',
    name: 'Overhead Marches (avec charge lourde)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Transverse, Grand droit & Gainage debout',
    secondaryMuscles: ['Épaules', 'Fléchisseurs de hanche'],
    equipment: 'dumbbell',
    description: 'Marche sur place debout en maintenant un disque ou haltère lourd bras tendus au-dessus de la tête pour un gainage debout intense.',
    startingPosition: 'Debout, pieds largeur de hanches, charge lourde tenue à deux mains bras verrouillés au-dessus de la tête, côtes abaissées.',
    steps: [
      'Engagez profondément le transverse en rentrant le nombril.',
      'Montez un genou à hauteur de hanche (angle 90°) sans pencher le buste.',
      'Marquez 1 seconde de maintien en haut, puis reposez le pied et alternez.',
      'Effectuez 10 répétitions contrôlées.'
    ],
    breathing: 'Expirez à chaque montée de genou, inspirez en reposant.',
    formTips: ['Gardez les biceps près des oreilles et ne cambrez jamais le bas du dos.'],
    commonMistakes: ['Se dandiner de gauche à droite à chaque pas.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 30,
  },
  {
    id: 'around-the-body-heavy',
    name: 'Around the Body (avec charge lourde)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Obliques & Ceinture abdominale 360°',
    secondaryMuscles: ['Avant-bras', 'Épaules'],
    equipment: 'dumbbell',
    description: 'Passage circulaire d’une charge lourde autour de la taille debout pour gainer la sangle abdominale à 360 degrés.',
    startingPosition: 'Debout, pieds ancrés largeur d’épaules, genoux déverrouillés, haltère ou disque lourd tenu devant le bassin.',
    steps: [
      'Verrouillez le bassin et serrez les fessiers et les abdos.',
      'Faites tourner la charge autour de votre taille en la passant d’une main à l’autre derrière le dos puis devant.',
      'Gardez le buste parfaitement immobile malgré le mouvement de la charge.',
      'Réalisez 10 tours maîtrisés.'
    ],
    breathing: 'Respiration fluide et régulière, ventre gainé.',
    formTips: ['Imaginez que votre tronc est une statue : seules les mains déplacent la charge.'],
    commonMistakes: ['Tourner les hanches en même temps que le poids.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 30,
  },
  {
    id: 'around-the-head-light',
    name: 'Around the Head / Halo (avec charge légère)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Abdominaux supérieurs, Obliques & Épaules',
    secondaryMuscles: ['Coiffe des rotateurs'],
    equipment: 'barbell',
    description: 'Rotation d’un disque léger autour de la tête (Halo) en maintenant la cage thoracique fixe et abaissée.',
    startingPosition: 'Debout, pieds largeur de hanches, disque léger tenu à deux mains devant le visage.',
    steps: [
      'Rentrez le ventre et abaissez les côtes pour ne pas cambrer.',
      'Faites passer le disque autour de la tête en rasant la nuque.',
      'Revenez devant le visage et enchaînez sur 10 répétitions.'
    ],
    breathing: 'Inspirez en passant derrière la tête, expirez au retour.',
    formTips: ['Gardez la tête bien droite, c’est le disque qui tourne autour d’elle.'],
    commonMistakes: ['Cambrer les lombaires quand le disque passe derrière la nuque.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 30,
  },
  {
    id: 'diagonal-plate-chops',
    name: 'Diagonal Plate Chops (charge légère)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Obliques internes et externes',
    secondaryMuscles: ['Transverse', 'Épaules'],
    equipment: 'barbell',
    description: 'Mouvement de bûcheron diagonal debout avec disque léger pour sculpter et dessiner la taille.',
    startingPosition: 'Debout, pieds un peu plus larges que les épaules, disque léger tenu à deux mains.',
    steps: [
      'Amenez le disque en haut au-dessus de l’épaule droite.',
      'Tranchez en diagonale vers la hanche/genou gauche en contractant fort les obliques.',
      'Contrôlez la remontée et effectuez 10 répétitions de chaque côté.'
    ],
    breathing: 'Expirez fort lors du mouvement diagonal vers le bas.',
    formTips: ['Pivotez légèrement le pied arrière pour protéger le genou tout en ciblant la taille.'],
    commonMistakes: ['Utiliser uniquement les bras sans engager la rotation du buste.'],
    defaultSets: 3,
    defaultReps: '10 / côté',
    defaultRestSeconds: 30,
  },
  {
    id: 'oblique-bends-heavy',
    name: 'Oblique Bends (avec charge lourde)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Obliques & Carré des lombes',
    secondaryMuscles: ['Transverse'],
    equipment: 'dumbbell',
    description: 'Flexions latérales du buste debout avec charge lourde d’un côté pour renforcer la paroi latérale des abdominaux.',
    startingPosition: 'Debout bien droite, un haltère ou disque lourd dans une seule main le long de la cuisse, l’autre main derrière la tête.',
    steps: [
      'Inclinez lentement le buste sur le côté de la charge en restant dans un plan strictement frontal.',
      'Contractez l’oblique opposé pour remonter le buste à la verticale.',
      'Réalisez 10 répétitions à droite puis 10 répétitions à gauche.'
    ],
    breathing: 'Inspirez à l’inclinaison, expirez en remontant.',
    formTips: ['Imaginez être placée entre deux murs de verre : ne penchez ni en avant ni en arrière.'],
    commonMistakes: ['Tenir un poids dans chaque main (ce qui annule la résistance).'],
    defaultSets: 3,
    defaultReps: '10 / côté',
    defaultRestSeconds: 30,
  },
  {
    id: 'leg-raises-over-dumbbell',
    name: 'Leg Raises au-dessus d\'un haltère',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Bas des abdos & Grand droit',
    secondaryMuscles: ['Psoas', 'Quadriceps'],
    equipment: 'dumbbell',
    description: 'Passage des jambes tendues par-dessus un haltère posé verticalement au sol pour intensifier le travail du bas du ventre.',
    startingPosition: 'Assise au sol jambes tendues devant un haltère posé debout, mains en appui derrière les fessiers.',
    steps: [
      'Rétroversez légèrement le bassin et tendez les jambes.',
      'Soulevez les deux jambes jointes pour les passer par-dessus l’haltère d’un côté à l’autre.',
      'Effleurez le sol sans poser les talons et repartez dans l’autre sens (10 répétitions).'
    ],
    breathing: 'Expirez en passant au-dessus de l’haltère.',
    formTips: ['Gardez le buste semi-incliné et le nombril aspiré.'],
    commonMistakes: ['Plier les genoux pour tricher sur la hauteur.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 30,
  },
  {
    id: 'in-and-out-abs',
    name: 'In and Out (Abdos portefeuille assis)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Grand droit complet (Haut & Bas)',
    secondaryMuscles: ['Transverse'],
    equipment: 'bodyweight',
    description: 'Rapprochement simultané des genoux et du buste en équilibre fessier pour brûler toute la sangle abdominale.',
    startingPosition: 'En équilibre sur les fessiers, jambes tendues décollées du sol, mains en appui léger ou devant la poitrine.',
    steps: [
      'Ramenez les genoux vers la poitrine tout en avançant le buste (In).',
      'Tendez à nouveau les jambes devant vous en ouvrant l’angle du tronc (Out) sans poser les pieds.',
      'Enchaînez 10 répétitions fluides.'
    ],
    breathing: 'Expirez en fermant (In), inspirez en tendant (Out).',
    formTips: ['Gardez le bas du dos légèrement enroulé pour protéger les lombaires.'],
    defaultSets: 3,
    defaultReps: '10',
    defaultRestSeconds: 30,
  },
  {
    id: 'crunches-pause-top',
    name: 'Crunches with a Pause at the Top',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Grand droit supérieur',
    secondaryMuscles: ['Transverse'],
    equipment: 'bodyweight',
    description: 'Crunchs abdominaux avec pause isométrique de 2 secondes au sommet pour maximiser la brûlure musculaire.',
    startingPosition: 'Allongée sur le dos, genoux fléchis pieds à plat, doigts effleurant les tempes.',
    steps: [
      'Décollez les omoplates en enroulant le haut du buste et en soufflant tout l’air.',
      'Maintenez la contraction maximale en haut pendant 2 secondes complètes.',
      'Redescendez avec contrôle sans reposer complètement la tête.'
    ],
    breathing: 'Expirez à la montée et pendant la pause, inspirez à la descente.',
    formTips: ['Ne tirez jamais sur la nuque avec les mains.'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 30,
  },
  {
    id: 'weighted-plank-60s',
    name: 'Planche avec charge sur le dos (60 sec)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Transverse profond & Gainage intégral',
    secondaryMuscles: ['Épaules', 'Fessiers'],
    equipment: 'barbell',
    description: 'Gainage facial sur les avant-bras avec un disque posé sur le haut du bassin/milieu du dos pendant 60 secondes.',
    startingPosition: 'Sur les avant-bras et les pointes de pieds, disque posé à plat sur le bas du dos.',
    steps: [
      'Rétroversez le bassin (serrez fort les fessiers) et poussez le sol avec vos coudes.',
      'Rentrez le nombril au maximum contre la colonne.',
      'Tenez la position 60 secondes sans laisser le bassin s’affaisser.'
    ],
    breathing: 'Petites respirations thoraciques contrôlées sans relâcher le ventre.',
    formTips: ['Si le bas du dos creuse, retirez le disque et finissez au poids du corps.'],
    defaultSets: 3,
    defaultReps: '60 sec',
    defaultRestSeconds: 45,
  },
  {
    id: 'over-unders-abs',
    name: 'Over Unders (10 Clockwise + 10 Anti-Clockwise)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Bas des abdos, Obliques & Adducteurs',
    secondaryMuscles: ['Transverse'],
    equipment: 'bodyweight',
    description: 'Cercles croisés des jambes tendues : 10 dans le sens des aiguilles d’une montre et 10 dans le sens inverse.',
    startingPosition: 'Allongée sur le dos, mains sous le haut des fessiers, jambes tendues décollées à 20 cm du sol.',
    steps: [
      'Dessinez des cercles croisés avec vos deux jambes en passant l’une au-dessus de l’autre (10 sens horaire).',
      'Inversez immédiatement le sens de rotation pour 10 répétitions anti-horaires.',
      'Gardez les lombaires plaquées au tapis.'
    ],
    breathing: 'Respiration continue et rythmée.',
    formTips: ['Montez légèrement les jambes si vos lombaires décollent du sol.'],
    defaultSets: 3,
    defaultReps: '20 (10+10)',
    defaultRestSeconds: 30,
  },
  {
    id: 'side-to-side-leg-raises',
    name: 'Side to Side Leg Raises',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Obliques & Bas des abdos',
    secondaryMuscles: ['Transverse'],
    equipment: 'bodyweight',
    description: 'Relevés de jambes tendues en arc-en-ciel de gauche à droite pour cibler le bas du ventre et les obliques.',
    startingPosition: 'Allongée sur le dos, bras en croix au sol pour la stabilité, jambes jointes tendues.',
    steps: [
      'Montez les jambes au centre puis descendez-les vers la droite en contrôlant.',
      'Remontez au centre et descendez vers la gauche pour 20 répétitions au total.'
    ],
    breathing: 'Expirez en remontant les jambes au centre.',
    formTips: ['Gardez les deux épaules collées au sol tout au long du mouvement.'],
    defaultSets: 3,
    defaultReps: '20',
    defaultRestSeconds: 30,
  },
  {
    id: 'cocoon-passes-abs',
    name: 'Cocoon Passes (Passage pieds-mains)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Grand droit intégral & Transverse',
    secondaryMuscles: ['Fléchisseurs de hanche'],
    equipment: 'dumbbell',
    description: 'Enroulement complet en cocon en passant un léger poids ou ballon des mains aux chevilles puis des chevilles aux mains.',
    startingPosition: 'Allongée sur le dos, bras tendus derrière la tête tenant un poids léger ou disque.',
    steps: [
      'Montez simultanément les bras et les jambes pour coincer l’objet entre vos chevilles.',
      'Redescendez bras et jambes sans toucher le sol.',
      'Remontez pour reprendre l’objet dans vos mains et répétez 20 fois.'
    ],
    breathing: 'Expirez en fermant le cocon, inspirez en ouvrant.',
    formTips: ['Écrasez fermement le bas du dos dans le tapis lors de l’extension.'],
    defaultSets: 3,
    defaultReps: '20',
    defaultRestSeconds: 35,
  },
  {
    id: 'weighted-dead-bugs',
    name: 'Dead Bugs avec charge',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Transverse profond & Grand droit',
    secondaryMuscles: ['Épaules'],
    equipment: 'dumbbell',
    description: 'Dead bug classique en tenant un disque ou haltère bras tendus au-dessus de la poitrine pour tripler le gainage.',
    startingPosition: 'Sur le dos, lombaires plaquées au sol, genoux à 90° en tablette, charge tenue bras tendus vers le plafond.',
    steps: [
      'Tendez lentement la jambe droite au ras du sol tout en amenant légèrement la charge vers l’arrière de la tête.',
      'Ramenez au centre en expirant et alternez avec la jambe gauche.',
      'Effectuez 20 répétitions alternées sans aucun creux sous le dos.'
    ],
    breathing: 'Inspirez à l’extension, expirez en ramenant.',
    formTips: ['La règle d’or : zéro espace entre le bas de votre dos et le tapis.'],
    defaultSets: 3,
    defaultReps: '20',
    defaultRestSeconds: 30,
  },
  {
    id: 'plate-hollow-hold',
    name: 'Plate Hollow Hold (Max maintien)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Gainage cuillère & Transverse',
    secondaryMuscles: ['Grand droit'],
    equipment: 'barbell',
    description: 'Position cuillère (Hollow Body) avec un disque tenu bras tendus pour un gainage abdominal maximal jusqu’à l’échec.',
    startingPosition: 'Allongée sur le dos, omoplates décollées, jambes tendues à 30° du sol, disque tenu à deux mains.',
    steps: [
      'Verrouillez la rétroversion du bassin pour coller les lombaires au sol.',
      'Tenez la position aussi longtemps que possible (As Long As You Can) avec une forme parfaite.'
    ],
    breathing: 'Courtes respirations régulières en maintenant le ventre dur.',
    formTips: ['Pliez légèrement les genoux si vous sentez le bas du dos se décoller.'],
    defaultSets: 3,
    defaultReps: 'Max (ALAYC)',
    defaultRestSeconds: 45,
  },
  {
    id: 'weighted-toe-touches',
    name: 'Weighted Toe Touches (Touches orteils lestées)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Haut du grand droit',
    secondaryMuscles: ['Transverse'],
    equipment: 'dumbbell',
    description: 'Jambes tendues à la verticale, élévation d’un haltère ou disque vers les pointes de pieds.',
    startingPosition: 'Sur le dos, jambes tendues à 90° vers le plafond, haltère ou disque tenu à deux mains bras tendus.',
    steps: [
      'Décollez haut les épaules pour amener le poids toucher vos lacets.',
      'Redescendez les omoplates avec contrôle et répétez 12 fois.'
    ],
    breathing: 'Expirez en montant vers les orteils.',
    formTips: ['Poussez strictement vers le plafond, pas vers les genoux.'],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 30,
  },
  {
    id: 'bridge-knee-drives',
    name: 'Bridge Knee Drives (Pont + Montée de genou)',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Chaîne croisée, Gainage pelvien & Fessiers',
    secondaryMuscles: ['Ischios', 'Transverse'],
    equipment: 'bodyweight',
    description: 'Maintien en pont fessier haut avec montée alternée d’un genou vers la poitrine pour stabiliser le bassin et les abdos.',
    startingPosition: 'En pont fessier haut (épaules au sol, bassin aligné avec les genoux).',
    steps: [
      'Gardez les hanches hautes et parfaitement horizontales.',
      'Ramenez le genou droit vers la poitrine en contractant les abdos, reposez et répétez (12 par côté).'
    ],
    breathing: 'Expirez en montant le genou.',
    formTips: ['La hanche de la jambe qui lève ne doit pas tomber vers le sol.'],
    defaultSets: 3,
    defaultReps: '12 / côté',
    defaultRestSeconds: 30,
  },
  {
    id: 'dumbbell-kneel-to-stand',
    name: 'Dumbbell Kneel to Stand',
    category: 'abs',
    specificMuscle: 'abdos',
    primaryMuscle: 'Gainage du tronc, Fessiers & Quadriceps',
    secondaryMuscles: ['Transverse'],
    equipment: 'dumbbell',
    description: 'Passage de la position à genoux à la position debout en tenant un haltère contre la poitrine (goblet) avec tronc gainé.',
    startingPosition: 'À genoux au sol sur un tapis, haltère tenu en Goblet contre le sternum, buste bien droit.',
    steps: [
      'Posez le pied droit devant à plat et poussez pour vous mettre debout sans pencher le buste.',
      'Redescendez un genou après l’autre avec contrôle pour 12 répétitions (6 par jambe).'
    ],
    breathing: 'Expirez en vous relevant.',
    formTips: ['Gardez la poitrine haute et la ceinture abdominale verrouillée.'],
    defaultSets: 3,
    defaultReps: '12',
    defaultRestSeconds: 40,
  },
  {
    id: 'incline-walk-treadmill-levels',
    name: 'Marche inclinée Tapis (Débutant / Intermédiaire / Confirmé)',
    category: 'cardio',
    specificMuscle: 'cardio',
    primaryMuscle: 'Système cardiovasculaire, Fessiers & Mollets',
    secondaryMuscles: ['Ischios', 'Sangle abdominale'],
    equipment: 'cardio_machine',
    description: 'Protocole de marche en côte sur tapis adapté à votre niveau : Débutant (Pente 6, Vitesse 4,5, 20 min), Intermédiaire (Pente 10, Vitesse 4,5, 30 min) ou Confirmé (Pente 12, Vitesse 5, 30 min).',
    startingPosition: 'Debout sur le tapis de course, buste fier, sans se tenir aux poignées.',
    steps: [
      'Niveau Débutant : Inclinaison 6% · Vitesse 4,5 km/h · Durée 20 minutes.',
      'Niveau Intermédiaire : Inclinaison 10% · Vitesse 4,5 km/h · Durée 30 minutes.',
      'Niveau Confirmé : Inclinaison 12% · Vitesse 5,0 km/h · Durée 30 minutes.'
    ],
    breathing: 'Respiration nasale ou rythmée profonde.',
    formTips: ['Ne vous accrochez pas à la console devant vous, balancez naturellement les bras.'],
    defaultSets: 1,
    defaultReps: '20-30 min',
    defaultRestSeconds: 0,
  },
];

