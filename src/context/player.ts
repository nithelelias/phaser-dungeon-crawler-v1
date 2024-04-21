import { EQUIPEMENT, STATS, TEntityStats, TStatDic } from "../types/types";
import { getEquipment, resetInventory } from "./inventory";
import { resetSkillSet } from "./skills";
const DEFAULT_STATS = {
  hp: 3,
  speed: 1,
  attack: 1,
  defense: 1,
  evation: 0,
};

const store = {
  name: "bob",
  version: 0,
  stats: {
    ...DEFAULT_STATS,
  },
  calcStats: {
    ...DEFAULT_STATS,
  },

  currentHp: 3,
};
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function getCurrentLife() {
  return store.currentHp + 0;
}
function getMaxLife() {
  return store.calcStats.hp + 0;
}
function setCurrentLife(hp: number) {
  store.currentHp = clamp(hp, 0, store.calcStats.hp);
  return getCurrentLife();
}
function getBaseStats(): TEntityStats {
  return { ...store.stats };
}
function runCalcStats(): TEntityStats {
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
  store.calcStats = { ...stats };
  store.version += 1;
  return stats;
}
function getCalcStats(): TEntityStats {
  return { ...store.calcStats };
}
function getStatsVersion() {
  return store.version;
}
function reset() {
  store.stats = { ...DEFAULT_STATS };
  store.calcStats = { ...DEFAULT_STATS };

  store.currentHp = store.stats.hp;
  resetSkillSet();
  resetInventory();
}
export default {
  runCalcStats,
  getBaseStats,
  getCalcStats,
  getCurrentLife,
  getMaxLife,
  setCurrentLife,
  getStatsVersion,
  reset,
};
