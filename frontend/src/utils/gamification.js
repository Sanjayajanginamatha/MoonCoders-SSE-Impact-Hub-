export const TIERS = [
  { name: 'Bronze', minPoints: 0, maxPoints: 500, color: 'text-amber-700', bg: 'bg-amber-100', icon: '🥉' },
  { name: 'Silver', minPoints: 501, maxPoints: 1500, color: 'text-slate-500', bg: 'bg-slate-100', icon: '🥈' },
  { name: 'Gold', minPoints: 1501, maxPoints: 5000, color: 'text-yellow-500', bg: 'bg-yellow-100', icon: '🥇' },
  { name: 'Platinum', minPoints: 5001, maxPoints: Infinity, color: 'text-cyan-600', bg: 'bg-cyan-100', icon: '💎' },
];

export function getTierInfo(points) {
  const currentPoints = points || 0;
  
  let currentTierIndex = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (currentPoints >= TIERS[i].minPoints && currentPoints <= TIERS[i].maxPoints) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = TIERS[currentTierIndex];
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  let progressPercentage = 100;
  let pointsToNext = 0;

  if (nextTier) {
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const pointsInTier = currentPoints - currentTier.minPoints;
    progressPercentage = Math.min(100, Math.max(0, (pointsInTier / tierRange) * 100));
    pointsToNext = nextTier.minPoints - currentPoints;
  }

  return {
    currentTier,
    nextTier,
    progressPercentage,
    pointsToNext
  };
}
