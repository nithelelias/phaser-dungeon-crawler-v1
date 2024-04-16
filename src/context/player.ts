import { EQUIPEMENT, STATS, TEntityStats, TStatDic } from "../types/types";
import { getEquipment } from "./inventory";

const store = {
  stats: {
    hp: 3,
    speed: 1,
    attack: 1,
    defense: 1,
    evasion: 0,
  },
  currentHp: 3,
};
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function getCurrentLife() {
  return store.currentHp + 0;
}
function setCurrentLife(hp: number) {
  store.currentHp = clamp(hp, 0, store.stats.hp);
  return getCurrentLife();
}
function getBaseStats(): TEntityStats {
  return { ...store.stats };
}
function getCalcStats(): TEntityStats {
  const stats = { ...store.stats };
  const equiment = getEquipment();

  const iterateEquipement = () => {
    const keys = Object.keys(equiment);
    for (const key of keys) {
      const item = equiment[key as EQUIPEMENT];
      if (item) {
        iterateAndCalcStats(item.stats);
      }
    }
  };
  const iterateAndCalcStats = (alterStats: TStatDic) => {
    const keys = Object.keys(alterStats);
    for (const key of keys) {
      const statValue = alterStats[key as STATS];
      if (statValue) {
        stats[key as STATS] += statValue;
      }
    }
  };

  iterateEquipement();
  return stats;
}

export default {
  getBaseStats,
  getCalcStats,
  getCurrentLife,
  setCurrentLife,
};
