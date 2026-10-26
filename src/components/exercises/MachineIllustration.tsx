import React from 'react';
import { Exercise, EquipmentType } from '../../types/fitness';
import { getEquipmentBadge } from '../../utils/equipmentBadge';

export type MachineVisualArchetype =
  | 'leg_press'
  | 'hip_thrust'
  | 'abduction_adduction'
  | 'leg_extension_curl'
  | 'hack_squat_rack'
  | 'lat_pulldown_high_cable'
  | 'seated_row'
  | 'low_cable_station'
  | 'dumbbell_bench'
  | 'cardio_station'
  | 'mat_bodyweight';

interface MachineMeta {
  archetype: MachineVisualArchetype;
  machineName: string;
  stationZone: string;
  keyAdjustments: string[];
}

export function resolveMachineMeta(
  exercise: Pick<Exercise, 'id' | 'name' | 'equipment' | 'category'> & {
    machineSetup?: Exercise['machineSetup'];
  }
): MachineMeta {
  const n = `${exercise.id} ${exercise.name}`.toLowerCase();

  if (n.includes('presse') || n.includes('leg-press') || exercise.machineSetup?.diagramType === 'leg_press') {
    return {
      archetype: 'leg_press',
      machineName: 'Presse à cuisses inclinée 45° / guidée',
      stationZone: 'Zone Jambes · Charge guidée ou disques',
      keyAdjustments: [
        'Dossier incliné cran 2-3 (bassin plaqué)',
        'Pieds placés sur le plateau selon la zone ciblée',
        'Loquets de sécurité latéraux déverrouillés en haut',
      ],
    };
  }

  if (n.includes('hip thrust') || n.includes('hip-thrust') || n.includes('glute bridge') || n.includes('pont fessier')) {
    return {
      archetype: 'hip_thrust',
      machineName:
        exercise.equipment === 'machine'
          ? 'Machine Hip Thrust guidée à sangle'
          : 'Banc de Hip Thrust & Barre capitonnée',
      stationZone: 'Zone Fessiers · Banc bas + Barre / Machine',
      keyAdjustments: [
        'Haut du dos calé sous la pointe des omoplates',
        'Mousse de protection ou sangle sur le pli de hanche',
        'Pieds largeur d’épaules, tibias verticaux à 90° en haut',
      ],
    };
  }

  if (n.includes('abduction') || n.includes('adduction') || n.includes('abducteur') || n.includes('adducteur')) {
    return {
      archetype: 'abduction_adduction',
      machineName: 'Machine Abduction / Adduction assise',
      stationZone: 'Zone Isolation Hanches & Fessiers',
      keyAdjustments: [
        'Coussins pivotants orientés vers l’extérieur ou l’intérieur',
        'Levier d’écartement réglé au maximum de ta souplesse',
        'Poignées latérales maintenues pour stabiliser le bassin',
      ],
    };
  }

  if (n.includes('leg extension') || n.includes('leg curl') || n.includes('ischio') || n.includes('extension de jambe')) {
    return {
      archetype: 'leg_extension_curl',
      machineName: n.includes('curl')
        ? 'Machine Leg Curl (Ischio-jambiers)'
        : 'Machine Leg Extension (Quadriceps)',
      stationZone: 'Zone Machines Guidées Jambes',
      keyAdjustments: [
        'Axe de rotation rouge aligné exactement avec le genou',
        'Boudin mousse posé juste au-dessus des chevilles',
        'Dossier avancé pour caler le creux poplité au bord du siège',
      ],
    };
  }

  if (
    n.includes('squat') ||
    n.includes('hack') ||
    n.includes('smith') ||
    n.includes('cadre guidé') ||
    n.includes('soulevé de terre') ||
    n.includes('deadlift') ||
    n.includes('rdl') ||
    n.includes('good morning')
  ) {
    return {
      archetype: 'hack_squat_rack',
      machineName:
        exercise.equipment === 'machine'
          ? 'Hack Squat / Smith Machine guidée'
          : 'Rack à Squat / Plateau Barre Olympique',
      stationZone: 'Zone Charges Libres & Racks',
      keyAdjustments: [
        'Hauteur des crochets réglée à hauteur des clavicules',
        'Barres de sécurité latérales ajustées sous le point bas',
        'Appui stable au sol, pieds ancrés à plat',
      ],
    };
  }

  if (
    n.includes('tirage vertical') ||
    n.includes('lat pulldown') ||
    n.includes('pull-down') ||
    n.includes('pullover') ||
    n.includes('triceps poulie haute') ||
    n.includes('face pull') ||
    n.includes('extension triceps') ||
    exercise.machineSetup?.diagramType === 'cable_high'
  ) {
    return {
      archetype: 'lat_pulldown_high_cable',
      machineName: 'Station Poulie Haute / Tirage Vertical',
      stationZone: 'Tour à poulies & Tirage Dos/Bras',
      keyAdjustments: [
        'Boudins de maintien ajustés fermement sur le haut des cuisses',
        'Mousqueton fixé sur la poulie haute (barre, corde ou poignée)',
        'Goupille insérée dans la pile de poids correspondante',
      ],
    };
  }

  if (
    n.includes('rowing assis') ||
    n.includes('tirage horizontal') ||
    n.includes('seated row') ||
    exercise.machineSetup?.diagramType === 'seated_row'
  ) {
    return {
      archetype: 'seated_row',
      machineName: 'Machine Tirage Horizontal / Rowing Assis',
      stationZone: 'Zone Dos · Poulie basse avec cale-pieds',
      keyAdjustments: [
        'Pieds calés sur les plateformes, genoux légèrement fléchis',
        'Poignée en V ou barre large attachée au câble horizontal',
        'Poitrine sortie, colonne neutre tout au long du tirage',
      ],
    };
  }

  if (exercise.equipment === 'cable' || exercise.machineSetup?.diagramType === 'cable_low') {
    return {
      archetype: 'low_cable_station',
      machineName: 'Colonne à Poulie Réglable (Poulie Basse)',
      stationZone: 'Station Câbles Vis-à-Vis',
      keyAdjustments: [
        'Chariot de poulie descendu aux crans inférieurs (1 à 3)',
        'Sangle chevillère, corde ou poignée simple clipsée au mousqueton',
        'Un pas de recul pour mettre le câble sous tension dès le départ',
      ],
    };
  }

  if (exercise.equipment === 'cardio_machine' || exercise.category === 'cardio') {
    return {
      archetype: 'cardio_station',
      machineName: n.includes('escalier') || n.includes('stair')
        ? 'Escalier Mécanique (StairMaster)'
        : n.includes('rameur')
        ? 'Rameur Concept2'
        : n.includes('vélo') || n.includes('bike')
        ? 'Vélo Ergonomique'
        : 'Tapis de Course Incliné',
      stationZone: 'Zone Cardio Training',
      keyAdjustments: [
        'Console réglée (inclinaison, vitesse ou niveau de résistance)',
        'Buste grand et gainé sans s’écraser sur les poignées',
        'Fréquence cardiaque et allure régulières',
      ],
    };
  }

  if (exercise.equipment === 'bodyweight' || exercise.category === 'abs') {
    return {
      archetype: 'mat_bodyweight',
      machineName: 'Espace Tapis de Sol & Banc Fonctionnel',
      stationZone: 'Zone Mobilité, Abdos & Poids du corps',
      keyAdjustments: [
        'Tapis ergonomique antidérapant au sol',
        'Bassin en légère rétroversion (lombaires protégés)',
        'Respiration contrôlée sur chaque répétition',
      ],
    };
  }

  return {
    archetype: 'dumbbell_bench',
    machineName: 'Banc Multiposition & Rack Haltères',
    stationZone: 'Zone Poids Libres & Bancs Inclinables',
    keyAdjustments: [
      'Dossier du banc réglé (plat 0°, incliné 30°-45° ou vertical 85°)',
      'Pieds fermement ancrés au sol pour la stabilité',
      'Haltères pris au rack avec le dos droit',
    ],
  };
}

interface MachineIllustrationProps {
  exercise: Pick<Exercise, 'id' | 'name' | 'equipment' | 'category'> & {
    machineSetup?: Exercise['machineSetup'];
    imageUrl?: string;
  };
  variant?: 'section' | 'compact' | 'dark_workout';
}

export const MachineIllustration: React.FC<MachineIllustrationProps> = ({
  exercise,
  variant = 'section',
}) => {
  const meta = resolveMachineMeta(exercise);
  const equipBadge = getEquipmentBadge(exercise.equipment as EquipmentType);

  const renderMachineSvg = (archetype: MachineVisualArchetype) => {
    switch (archetype) {
      case 'leg_press':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <defs>
              <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B0726" />
                <stop offset="100%" stopColor="#831843" />
              </linearGradient>
              <linearGradient id="padGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
            </defs>
            {/* Floor Line */}
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Base Frame */}
            <path d="M40 152 L265 152 L225 45 L185 45" fill="none" stroke="url(#frameGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* 45 Degree Guide Rails */}
            <line x1="85" y1="138" x2="215" y2="38" stroke="#9D174D" strokeWidth="5" strokeLinecap="round" />
            <line x1="92" y1="145" x2="222" y2="45" stroke="#F472B6" strokeWidth="2.5" strokeDasharray="4 3" />
            {/* Sled & Footplate */}
            <g transform="translate(155, 72) rotate(-37)">
              <rect x="-8" y="-34" width="12" height="62" rx="4" fill="#2B091C" stroke="#EC4899" strokeWidth="2" />
              {/* Weight horn + Plates */}
              <rect x="4" y="-18" width="28" height="8" rx="2" fill="#831843" />
              <rect x="10" y="-30" width="8" height="32" rx="2" fill="#EC4899" />
              <rect x="20" y="-26" width="6" height="24" rx="2" fill="#F472B6" />
            </g>
            {/* Backrest & Seat Pad */}
            <path d="M48 102 L78 140 L108 132" fill="none" stroke="url(#padGrad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            {/* Callout Badges */}
            <g transform="translate(115, 26)">
              <rect x="0" y="0" width="76" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="38" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Plateau 45°</text>
            </g>
            <g transform="translate(22, 74)">
              <rect x="0" y="0" width="68" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="34" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Dossier calé</text>
            </g>
          </svg>
        );

      case 'hip_thrust':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="150" x2="300" y2="150" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Back Bench */}
            <rect x="42" y="96" width="74" height="16" rx="6" fill="#831843" />
            <line x1="56" y1="112" x2="56" y2="150" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            <line x1="100" y1="112" x2="100" y2="150" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            {/* Barbell with Foam Pad & Bumper Plates */}
            <line x1="135" y1="92" x2="215" y2="92" stroke="#2B091C" strokeWidth="5" strokeLinecap="round" />
            <rect x="155" y="86" width="40" height="12" rx="6" fill="#EC4899" />
            {/* Olympic Plates */}
            <circle cx="175" cy="116" r="28" fill="#3B0726" stroke="#EC4899" strokeWidth="3" />
            <circle cx="175" cy="116" r="9" fill="#FCE7F3" />
            {/* Foot platform */}
            <path d="M235 150 L278 150 L268 136 L235 136 Z" fill="#831843" />
            {/* Callouts */}
            <g transform="translate(36, 66)">
              <rect x="0" y="0" width="84" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="42" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Appui Omoplates</text>
            </g>
            <g transform="translate(142, 52)">
              <rect x="0" y="0" width="90" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="45" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Mousse Hanche</text>
            </g>
          </svg>
        );

      case 'abduction_adduction':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Weight Stack Tower */}
            <rect x="215" y="28" width="48" height="124" rx="6" fill="#3B0726" />
            {[42, 56, 70, 84, 98, 112].map((y) => (
              <rect key={y} x="221" y={y} width="36" height="9" rx="2" fill="#831843" stroke="#FCE7F3" strokeWidth="0.6" />
            ))}
            {/* Base frame */}
            <line x1="80" y1="146" x2="215" y2="146" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            {/* Seat & Backrest */}
            <path d="M68 52 L82 112 L134 112" fill="none" stroke="#EC4899" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="98" y1="112" x2="98" y2="146" stroke="#3B0726" strokeWidth="6" />
            {/* Dual Knee Swivel Pads */}
            <rect x="134" y="88" width="22" height="32" rx="8" fill="#831843" stroke="#F472B6" strokeWidth="2.5" />
            <rect x="150" y="94" width="22" height="32" rx="8" fill="#BE185D" stroke="#FCE7F3" strokeWidth="2" />
            {/* Callouts */}
            <g transform="translate(106, 54)">
              <rect x="0" y="0" width="96" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="48" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Coussins Genoux</text>
            </g>
          </svg>
        );

      case 'leg_extension_curl':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Weight stack */}
            <rect x="225" y="30" width="44" height="122" rx="6" fill="#3B0726" />
            {[45, 60, 75, 90, 105].map((y) => (
              <rect key={y} x="231" y={y} width="32" height="10" rx="2" fill="#831843" />
            ))}
            {/* Seat & Backrest */}
            <path d="M72 48 L88 106 L146 106" fill="none" stroke="#EC4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="108" y1="106" x2="108" y2="152" stroke="#3B0726" strokeWidth="7" />
            {/* Red Pivot & Shin Roller Pad */}
            <circle cx="152" cy="106" r="8" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="152" y1="106" x2="178" y2="140" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            <circle cx="182" cy="138" r="11" fill="#831843" stroke="#F472B6" strokeWidth="2.5" />
            {/* Callout */}
            <g transform="translate(125, 66)">
              <rect x="0" y="0" width="84" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="42" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Axe Genou + Boudin</text>
            </g>
          </svg>
        );

      case 'hack_squat_rack':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Power Rack Uprights */}
            <rect x="95" y="22" width="10" height="130" rx="3" fill="#3B0726" />
            <rect x="205" y="22" width="10" height="130" rx="3" fill="#3B0726" />
            <line x1="95" y1="26" x2="215" y2="26" stroke="#831843" strokeWidth="7" strokeLinecap="round" />
            {/* Safety Spotter Arms */}
            <line x1="95" y1="105" x2="215" y2="105" stroke="#F472B6" strokeWidth="4" strokeDasharray="6 4" />
            {/* Olympic Barbell & Plates */}
            <line x1="62" y1="68" x2="248" y2="68" stroke="#2B091C" strokeWidth="5" strokeLinecap="round" />
            <rect x="74" y="46" width="12" height="44" rx="3" fill="#EC4899" />
            <rect x="224" y="46" width="12" height="44" rx="3" fill="#EC4899" />
            <g transform="translate(115, 76)">
              <rect x="0" y="0" width="80" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="40" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Rack & Sécurités</text>
            </g>
          </svg>
        );

      case 'lat_pulldown_high_cable':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Tall Cable Tower */}
            <rect x="195" y="18" width="44" height="134" rx="6" fill="#3B0726" />
            {[40, 54, 68, 82, 96, 110].map((y) => (
              <rect key={y} x="201" y={y} width="32" height="9" rx="2" fill="#831843" />
            ))}
            {/* Overhead Boom & Lat Bar */}
            <line x1="115" y1="22" x2="215" y2="22" stroke="#3B0726" strokeWidth="7" strokeLinecap="round" />
            <line x1="125" y1="22" x2="125" y2="54" stroke="#EC4899" strokeWidth="2.5" />
            <path d="M88 58 L102 52 L148 52 L162 58" fill="none" stroke="#2B091C" strokeWidth="5" strokeLinecap="round" />
            {/* Seat & Thigh Rollers */}
            <rect x="102" y="114" width="46" height="10" rx="5" fill="#EC4899" />
            <line x1="125" y1="124" x2="125" y2="152" stroke="#3B0726" strokeWidth="6" />
            <circle cx="142" cy="100" r="7" fill="#831843" stroke="#F472B6" strokeWidth="2" />
            <circle cx="156" cy="100" r="7" fill="#831843" stroke="#F472B6" strokeWidth="2" />
            <g transform="translate(46, 72)">
              <rect x="0" y="0" width="84" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="42" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Boudins Cuisses</text>
            </g>
          </svg>
        );

      case 'seated_row':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Tower */}
            <rect x="220" y="24" width="44" height="128" rx="6" fill="#3B0726" />
            {[44, 58, 72, 86, 100].map((y) => (
              <rect key={y} x="226" y={y} width="32" height="9" rx="2" fill="#831843" />
            ))}
            {/* Horizontal Cable + V Handle */}
            <line x1="125" y1="96" x2="220" y2="96" stroke="#EC4899" strokeWidth="2.5" strokeDasharray="4 2" />
            <polygon points="115,88 128,96 115,104" fill="#831843" />
            {/* Long Bench & Footplates */}
            <rect x="58" y="114" width="86" height="10" rx="5" fill="#EC4899" />
            <line x1="75" y1="124" x2="75" y2="152" stroke="#3B0726" strokeWidth="6" />
            <line x1="130" y1="124" x2="130" y2="152" stroke="#3B0726" strokeWidth="6" />
            <line x1="195" y1="102" x2="185" y2="135" stroke="#2B091C" strokeWidth="7" strokeLinecap="round" />
            <g transform="translate(88, 56)">
              <rect x="0" y="0" width="90" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="45" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Tirage Horizontal</text>
            </g>
          </svg>
        );

      case 'low_cable_station':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Cable Column */}
            <rect x="200" y="18" width="42" height="134" rx="6" fill="#3B0726" />
            <line x1="184" y1="20" x2="184" y2="150" stroke="#831843" strokeWidth="5" />
            {/* Low Pulley Carriage */}
            <circle cx="184" cy="132" r="9" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="118" y1="124" x2="176" y2="132" stroke="#EC4899" strokeWidth="2.5" strokeDasharray="4 2" />
            {/* Ankle Strap / Handle */}
            <rect x="96" y="116" width="22" height="12" rx="6" fill="#831843" stroke="#F472B6" strokeWidth="2" />
            <g transform="translate(65, 76)">
              <rect x="0" y="0" width="96" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="48" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Poulie Basse Réglable</text>
            </g>
          </svg>
        );

      case 'cardio_station':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Incline Treadmill Deck */}
            <path d="M55 144 L235 122" stroke="#3B0726" strokeWidth="14" strokeLinecap="round" />
            <path d="M62 143 L228 122" stroke="#EC4899" strokeWidth="3" strokeDasharray="8 5" />
            {/* Console Upright */}
            <line x1="222" y1="124" x2="202" y2="42" stroke="#831843" strokeWidth="8" strokeLinecap="round" />
            <rect x="178" y="26" width="44" height="24" rx="6" fill="#2B091C" stroke="#F472B6" strokeWidth="2" />
            <g transform="translate(72, 76)">
              <rect x="0" y="0" width="94" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="47" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Inclinaison & Allure</text>
            </g>
          </svg>
        );

      case 'mat_bodyweight':
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Fitness Mat */}
            <path d="M52 136 L268 136 L282 148 L38 148 Z" fill="#EC4899" stroke="#831843" strokeWidth="2" />
            <g transform="translate(105, 86)">
              <rect x="0" y="0" width="110" height="22" rx="11" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="55" y="14" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Tapis Sol & Gainage</text>
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 320 170" className="w-full h-full">
            <line x1="20" y1="152" x2="300" y2="152" stroke="#E5D0DC" strokeWidth="3" strokeLinecap="round" />
            {/* Adjustable Bench */}
            <line x1="72" y1="115" x2="132" y2="62" stroke="#EC4899" strokeWidth="11" strokeLinecap="round" />
            <line x1="136" y1="115" x2="188" y2="115" stroke="#831843" strokeWidth="11" strokeLinecap="round" />
            <line x1="95" y1="118" x2="85" y2="152" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            <line x1="168" y1="118" x2="176" y2="152" stroke="#3B0726" strokeWidth="6" strokeLinecap="round" />
            {/* Dumbbells Pair */}
            <g transform="translate(222, 118)">
              <rect x="0" y="8" width="10" height="24" rx="3" fill="#3B0726" />
              <rect x="10" y="16" width="18" height="8" rx="2" fill="#831843" />
              <rect x="28" y="8" width="10" height="24" rx="3" fill="#3B0726" />
            </g>
            <g transform="translate(68, 28)">
              <rect x="0" y="0" width="108" height="20" rx="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
              <text x="54" y="13" textAnchor="middle" className="text-[9px] font-bold fill-[#831843]">Banc & Haltères</text>
            </g>
          </svg>
        );
    }
  };

  if (variant === 'compact') {
    return (
      <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-[#FFF9FC] to-[#FCE7F3]/50 border border-[#FBCFE8] p-2 flex items-center justify-between gap-3 overflow-hidden">
        <div className="w-28 h-20 shrink-0 flex items-center justify-center">
          {renderMachineSvg(meta.archetype)}
        </div>
        <div className="min-w-0 flex-1 pr-2 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
            Aperçu Machine
          </span>
          <p className="font-display font-bold text-xs text-[#2B091C] truncate">
            {meta.machineName}
          </p>
          <p className="text-[10px] text-[#7A616F] truncate">{meta.keyAdjustments[0]}</p>
        </div>
      </div>
    );
  }

  if (variant === 'dark_workout') {
    return (
      <div className="rounded-2xl bg-[#1F0518] border border-[#EC4899]/25 p-3.5 space-y-2.5 animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
              Image de la machine & Réglages
            </span>
            <h4 className="font-display font-bold text-xs sm:text-sm text-white">
              {meta.machineName}
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#FBCFE8] text-[10px] font-bold shrink-0">
            {equipBadge.label}
          </span>
        </div>

        <div className="w-full h-36 rounded-xl bg-[#FFF9FC] border border-[#FBCFE8] p-2 flex items-center justify-center overflow-hidden">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={meta.machineName}
              className="w-full h-full object-contain"
            />
          ) : (
            renderMachineSvg(meta.archetype)
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-[#FBCFE8]">
          {meta.keyAdjustments.map((adj, i) => (
            <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/5 flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] shrink-0 mt-1" />
              <span className="leading-snug">{adj}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: full section card in ExerciseDetailModal
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
            Repère visuel en salle
          </span>
          <h3 className="font-display font-bold text-base text-[#2B091C]">
            Image de la machine
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[11px] font-bold text-[#831843]">
          {equipBadge.label}
        </span>
      </div>

      {/* Visual Diagram / Photo Box */}
      <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#FFF9FC] to-[#F6EDF2] border border-[#FBCFE8] p-3 flex flex-col items-center justify-center overflow-hidden">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={meta.machineName}
            className="w-full h-full object-contain"
          />
        ) : (
          renderMachineSvg(meta.archetype)
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#2B091C]">{meta.machineName}</span>
          <span className="text-[11px] text-[#7A616F]">{meta.stationZone}</span>
        </div>

        <div className="divide-y divide-[#F6EDF2] text-xs pt-1">
          {meta.keyAdjustments.map((tip, idx) => (
            <div key={idx} className="py-1.5 flex items-start gap-2 text-[#7A616F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] shrink-0 mt-1.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
