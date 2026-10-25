import React from 'react';

export type StreamlineIconName =
  | 'biceps'
  | 'weightlifter'
  | 'dumbbell'
  | 'kettlebell'
  | 'runner'
  | 'bike'
  | 'stretch'
  | 'water'
  | 'heart-pulse'
  | 'body'
  | 'home'
  | 'calendar'
  | 'stopwatch'
  | 'trophy'
  | 'share'
  | 'sparkle'
  | 'save'
  | 'user'
  | 'check';

interface StreamlineIconProps {
  name: StreamlineIconName;
  className?: string;
}

/**
 * Pack d'icônes SVG style Streamline Bold (formes pleines aux contours arrondis),
 * recolorées dynamiquement via currentColor dans les tons roses / bordeaux du thème.
 */
export const StreamlineIcon: React.FC<StreamlineIconProps> = ({
  name,
  className = 'w-4 h-4 shrink-0 inline-block align-middle',
}) => {
  switch (name) {
    case 'biceps':
      // Bras musclé (Streamline Bold Biceps)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.5 4.2c-1.4 0-2.6.9-3 2.2-.3.9.2 1.8 1.1 2.1.3.1.4.4.3.7l-.5 1.5c-1.3-.9-3-1.2-4.6-.6-1.5.5-2.6 1.7-3.1 3.2l-.6-2.3c-.3-1.1-1.4-1.8-2.5-1.5-1.1.3-1.8 1.4-1.5 2.5l1.6 6.2c.5 1.8 2.1 3.1 4 3.1h5.8c3.6 0 6.5-2.9 6.5-6.5 0-2.1-.9-4.1-2.5-5.4l.8-2.3c.5-1.5-.6-2.9-1.8-2.9z" />
        </svg>
      );

    case 'weightlifter':
      // Athlète qui soulève la barre (Streamline Bold Weightlifter)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="12" cy="8.5" r="2.3" />
          <path d="M21 2.5a1 1 0 0 0-1 1v.5h-1v-.5a1 1 0 0 0-2 0v1H7v-1a1 1 0 0 0-2 0V4H4v-.5a1 1 0 0 0-2 0v3a1 1 0 0 0 2 0V6h1v.5a1 1 0 0 0 2 0v-1h1.3l1.3 4.2c-.8.6-1.3 1.5-1.3 2.6v3.2l-1.6 4.2a1.3 1.3 0 0 0 2.4.9l1.7-4.4h2.4l1.7 4.4a1.3 1.3 0 0 0 2.4-.9l-1.6-4.2v-3.2c0-1.1-.5-2-1.3-2.6l1.3-4.2H17v1a1 1 0 0 0 2 0V6h1v.5a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1z" />
        </svg>
      );

    case 'dumbbell':
      // Haltère (Streamline Bold Dumbbell)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M6.5 5A2.5 2.5 0 0 0 4 7.5v1H2.8A1.8 1.8 0 0 0 1 10.3v3.4a1.8 1.8 0 0 0 1.8 1.8H4v1a2.5 2.5 0 0 0 5 0v-3h6v3a2.5 2.5 0 0 0 5 0v-1h1.2a1.8 1.8 0 0 0 1.8-1.8v-3.4a1.8 1.8 0 0 0-1.8-1.8H20v-1a2.5 2.5 0 0 0-5 0v3H9v-3A2.5 2.5 0 0 0 6.5 5z" />
        </svg>
      );

    case 'kettlebell':
      // Kettlebell / Poids (Streamline Bold Kettlebell)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2C9.2 2 7 4.2 7 7v1.6C5.1 10.2 4 12.5 4 15c0 4.4 3.6 7 8 7s8-2.6 8-7c0-2.5-1.1-4.8-3-6.4V7c0-2.8-2.2-5-5-5zm0 2.5c1.4 0 2.5 1.1 2.5 2.5v.6a8.9 8.9 0 0 0-5 0V7c0-1.4 1.1-2.5 2.5-2.5zm0 7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
        </svg>
      );

    case 'runner':
      // Coureur cardio / course (Streamline Bold Runner)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="15.5" cy="4.5" r="2.3" />
          <path d="M13.6 8.2c-1-.5-2.2-.4-3.1.3L7.2 11a1.3 1.3 0 1 0 1.6 2l2.2-1.7.7 2.4-3.1 3.1-3.3-.7a1.3 1.3 0 1 0-.5 2.5l4.1.9c.5.1 1-.1 1.4-.4l2.7-2.7 1.9 1.6.7 3.7a1.3 1.3 0 0 0 2.5-.5l-.9-4.5c-.1-.4-.3-.8-.7-1l-1.9-1.5.9-2.8 1.5 1.2c.4.3.9.4 1.4.2l2.5-.9a1.3 1.3 0 1 0-.9-2.4l-1.8.6-2.6-2z" />
        </svg>
      );

    case 'bike':
      // Vélo / Vélo d'appartement (Streamline Bold Bike)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="14.5" cy="4" r="2" />
          <path d="M5.5 13a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm13-2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM11.8 6.5c-.7-.5-1.7-.4-2.3.3L7.3 9.4c-.6.7-.5 1.8.2 2.4l2.5 2v3.2a1.2 1.2 0 0 0 2.4 0v-3.8c0-.5-.2-.9-.6-1.2l-1.7-1.3 1.4-1.6 1.8 1.4c.3.2.6.3 1 .3h2.2a1.2 1.2 0 0 0 0-2.4h-1.8l-2.9-1.9z" />
        </svg>
      );

    case 'stretch':
      // Personnage en étirement / Pilates / Échauffement (Streamline Bold Stretching)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="12" cy="4.2" r="2.2" />
          <path d="M5.3 7.3a1.3 1.3 0 0 0-.3 1.8c1.5 2.1 3.8 3.4 6.5 3.6v2.7l-3.9 4.5a1.3 1.3 0 1 0 2 1.7l2.4-2.8 2.4 2.8a1.3 1.3 0 1 0 2-1.7l-3.9-4.5v-2.7c2.7-.2 5-1.5 6.5-3.6a1.3 1.3 0 1 0-2.1-1.5C15.7 9 13.9 10 12 10S8.3 9 7.1 7.6a1.3 1.3 0 0 0-1.8-.3z" />
        </svg>
      );

    case 'water':
      // Gourde / Hydratation / Récupération (Streamline Bold Water Bottle)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M10.5 1.5a1 1 0 0 0-1 1V4H8a1.5 1.5 0 0 0-1.5 1.5v1A1.5 1.5 0 0 0 8 8h8a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 16 4h-1.5V2.5a1 1 0 0 0-1-1h-3zM7.5 9.5A2.5 2.5 0 0 0 5 12v7.5A3.5 3.5 0 0 0 8.5 23h7a3.5 3.5 0 0 0 3.5-3.5V12a2.5 2.5 0 0 0-2.5-2.5h-9zm4.5 3.2c1.2 1.6 2.5 3.1 2.5 4.3a2.5 2.5 0 0 1-5 0c0-1.2 1.3-2.7 2.5-4.3z" />
        </svg>
      );

    case 'heart-pulse':
      // Cœur avec pouls / Suivi / Stats (Streamline Bold Heart Pulse)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M16.5 3C14.6 3 12.9 4 12 5.5 11.1 4 9.4 3 7.5 3 4.4 3 2 5.4 2 8.5c0 1.2.3 2.3.8 3.3h4.4l1.5-3a1 1 0 0 1 1.8.1l2.3 5.7 1.4-2.8a1 1 0 0 1 .9-.6h5.5c.3-.8.4-1.7.4-2.7C22 5.4 19.6 3 16.5 3zm3.6 10.2h-4.4l-2.1 4.2a1 1 0 0 1-1.8-.1L9.5 11.6l-.9 1.8a1 1 0 0 1-.9.6H4c2.1 3.3 6.2 6.2 7.5 7 .3.2.7.2 1 0 1.3-.8 5.4-3.7 7.6-7.8z" />
        </svg>
      );

    case 'body':
      // Personnage bras écartés / Mensurations / Dos (Streamline Bold Body Silhouette)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="12" cy="4" r="2.3" />
          <path d="M4.2 8.2a1.2 1.2 0 0 0 0 2.4h4.6v4.6l-1.7 5.8a1.3 1.3 0 1 0 2.5.7L11.2 16h1.6l1.6 5.7a1.3 1.3 0 1 0 2.5-.7l-1.7-5.8v-4.6h4.6a1.2 1.2 0 1 0 0-2.4H4.2z" />
        </svg>
      );

    case 'home':
      // Maison Bold (Streamline Bold Home)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M11.2 2.3a1.3 1.3 0 0 1 1.6 0l8.5 7A1.3 1.3 0 0 1 20.5 11.6H19v8.1a2.3 2.3 0 0 1-2.3 2.3h-3.2v-5.5a1.5 1.5 0 0 0-3 0V22H7.3A2.3 2.3 0 0 1 5 19.7v-8.1H3.5a1.3 1.3 0 0 1-.8-2.3l8.5-7z" />
        </svg>
      );

    case 'calendar':
      // Calendrier Bold (Streamline Bold Calendar)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M8 2a1.2 1.2 0 0 1 1.2 1.2V4h5.6v-.8a1.2 1.2 0 1 1 2.4 0V4h1.3A3.5 3.5 0 0 1 22 7.5v11a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 18.5v-11A3.5 3.5 0 0 1 5.5 4h1.3v-.8A1.2 1.2 0 0 1 8 2zm-3.5 7.5v9c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-9h-15zm3.5 3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
      );

    case 'stopwatch':
      // Chronomètre Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M9.5 1.5a1.2 1.2 0 0 0 0 2.4h1.3v1.2a8.5 8.5 0 1 0 2.4 0V3.9h1.3a1.2 1.2 0 1 0 0-2.4h-5zm2.5 7.8a1.2 1.2 0 0 1 1.2 1.2v3l2 1.2a1.2 1.2 0 1 1-1.2 2.1l-2.6-1.5a1.2 1.2 0 0 1-.6-1v-3.8c0-.7.5-1.2 1.2-1.2z" />
        </svg>
      );

    case 'trophy':
      // Trophée / Record Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M6 2.5A1.5 1.5 0 0 0 4.5 4v1H3a2 2 0 0 0-2 2v1.5A4.5 4.5 0 0 0 5.1 13c.8 1.9 2.5 3.3 4.6 3.7V19H7.5a1.2 1.2 0 1 0 0 2.5h9a1.2 1.2 0 1 0 0-2.5h-2.2v-2.3c2.1-.4 3.8-1.8 4.6-3.7A4.5 4.5 0 0 0 23 8.5V7a2 2 0 0 0-2-2h-1.5V4A1.5 1.5 0 0 0 18 2.5H6zm-1.5 5v1a2 2 0 0 1-1-1.7V7.5h1zm15 0h1v.8a2 2 0 0 1-1 1.7v-2.5z" />
        </svg>
      );

    case 'share':
      // Partage Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18 2.5a3.5 3.5 0 1 0-2.9 5.5L8.7 11a3.5 3.5 0 1 0 0 2l6.4 3a3.5 3.5 0 1 0 1.1-2.2l-6.4-3a3.5 3.5 0 0 0 0-.6l6.4-3A3.5 3.5 0 1 0 18 2.5z" />
        </svg>
      );

    case 'sparkle':
      // Éclat / Étoile Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2c.5 0 .9.3 1.1.8l2.1 5.6 5.6 2.1c.5.2.8.6.8 1.1s-.3.9-.8 1.1l-5.6 2.1-2.1 5.6c-.2.5-.6.8-1.1.8s-.9-.3-1.1-.8l-2.1-5.6-5.6-2.1a1.2 1.2 0 0 1 0-2.2l5.6-2.1 2.1-5.6c.2-.5.6-.8 1.1-.8z" />
        </svg>
      );

    case 'save':
      // Sauvegarde Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.8a2 2 0 0 0-.6-1.4l-2.8-2.8A2 2 0 0 0 16.2 3H5zm3 2h7v4H8V5zm4 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      );

    case 'user':
      // Utilisateur / Profil Bold
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <circle cx="12" cy="7.5" r="4.5" />
          <path d="M12 14c-5 0-8.5 2.7-8.5 6a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5c0-3.3-3.5-6-8.5-6z" />
        </svg>
      );

    case 'check':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.7 7.7-5.2 5.2a1.2 1.2 0 0 1-1.7 0l-2.5-2.5a1.2 1.2 0 1 1 1.7-1.7l1.6 1.6 4.4-4.4a1.2 1.2 0 1 1 1.7 1.8z" />
        </svg>
      );
  }
};

/**
 * Retourne le nom d'icône Streamline Bold correspondant à une activité du planning.
 */
export const getActivityStreamlineIcon = (activity: string): StreamlineIconName => {
  const lower = activity.toLowerCase();
  if (lower.includes('fessier') || lower.includes('bas du corps')) return 'kettlebell';
  if (lower.includes('bras') || lower.includes('épaule') || lower.includes('biceps')) return 'biceps';
  if (lower.includes('dos')) return 'dumbbell';
  if (lower.includes('course') || lower.includes('cardio') || lower.includes('marche')) return 'runner';
  if (lower.includes('vélo') || lower.includes('bike') || lower.includes('cycling')) return 'bike';
  if (lower.includes('pilates') || lower.includes('tse') || lower.includes('étirement') || lower.includes('mobilité')) return 'stretch';
  if (lower.includes('repos') || lower.includes('récup')) return 'water';
  if (lower.includes('abdo')) return 'stretch';
  return 'weightlifter';
};

/**
 * Retourne le nom d'icône Streamline Bold correspondant à un groupe musculaire.
 */
export const getCategoryStreamlineIcon = (category: string): StreamlineIconName => {
  switch (category) {
    case 'lower-body':
      return 'kettlebell';
    case 'back':
      return 'dumbbell';
    case 'arms':
      return 'biceps';
    case 'abs':
      return 'stretch';
    case 'cardio':
      return 'runner';
    case 'favorites':
      return 'heart-pulse';
    default:
      return 'weightlifter';
  }
};
