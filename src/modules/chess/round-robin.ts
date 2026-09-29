export function roundRobinRoundCount(playerCount: number) {
  const participants = Math.max(0, Math.floor(playerCount));

  if (participants < 2) return 1;
  return participants % 2 === 0 ? participants - 1 : participants;
}
