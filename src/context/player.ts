import { TEntityStats } from "../types/types";

const store = {
  level: 1,
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
function getStats(): TEntityStats {
  return { ...store.stats };
}
function getLevel() {
  return store.level + 0;
}
export default { getStats, getLevel, getCurrentLife, setCurrentLife };
