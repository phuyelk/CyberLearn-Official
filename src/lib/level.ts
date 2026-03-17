const LEVELS = [
  { level: 1, name: "Rookie", xpRequired: 0 },
  { level: 2, name: "Scout", xpRequired: 500 },
  { level: 3, name: "Defender", xpRequired: 1200 },
  { level: 4, name: "Sentinel", xpRequired: 2200 },
  { level: 5, name: "Guardian", xpRequired: 3500 },
  { level: 6, name: "Analyst", xpRequired: 5200 },
  { level: 7, name: "Specialist", xpRequired: 7500 },
  { level: 8, name: "Expert", xpRequired: 10500 },
  { level: 9, name: "Master", xpRequired: 14500 },
  { level: 10, name: "Cyber Sage", xpRequired: 20000 },
] as const;

export function getLevel(xp: number) {
  let current = LEVELS[0]!;
  for (const entry of LEVELS) {
    if (xp >= entry.xpRequired) current = entry;
    else break;
  }

  const idx = LEVELS.findIndex((l) => l.level === current.level);
  const next = LEVELS[idx + 1];
  const xpForNext = next ? next.xpRequired : current.xpRequired;
  const xpIntoLevel = xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;

  return {
    level: current.level,
    levelName: current.name,
    xpForNext,
    xpProgress: Math.min(xpIntoLevel / xpNeeded, 1),
    xpIntoLevel,
    xpNeeded: next ? next.xpRequired - current.xpRequired : 0,
    isMax: !next,
  };
}
