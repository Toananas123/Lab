/**
 * Daily affirmations in English for mindful focus and empowerment.
 * Stable for the entire day based on calendar day.
 */
export const DAILY_AFFIRMATIONS = [
  "I am building strength, poise, and confidence with every mindful repetition.",
  "My body is capable of amazing transformations through gentle consistency.",
  "I honor my journey, celebrate my progress, and embrace my unique power.",
  "Strength looks radiant on me, both inside and outside the gym.",
  "Every small set brings me closer to the strongest version of myself.",
  "I show up for myself today with grace, intention, and boundless energy.",
  "My dedication fuels my glow and elevates my spirit.",
  "I am patient with my process and proud of how far I have already come.",
  "I move with purpose, breathe with intention, and sculpt my best self.",
  "Consistency is my superpower, and self-love is my daily foundation.",
  "I am strong, resilient, and unapologetically focused on my growth.",
  "Today I celebrate what my body can do and nourish its limitless vitality.",
  "Balance, beauty, and power align effortlessly within my routine.",
  "I lift with joy, rest with kindness, and trust my steady evolution.",
];

export function getDailyAffirmation(date: Date = new Date()): string {
  // Day of year calculation for stable daily index
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % DAILY_AFFIRMATIONS.length;
  return DAILY_AFFIRMATIONS[index];
}
