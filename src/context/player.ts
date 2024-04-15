const store = {
  stats: {
    level: 1,
    hp: 3,
    speed: 1,
    attack: 1,
    defense: 1,
  },
  currentHp: 3,
};
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function getCurrentLife() {
  return store.currentHp;
}
function setCurrentLife(hp: number) {
  store.currentHp = clamp(hp, 0, store.stats.hp);
  return getCurrentLife();
}
function getStats() {
  return { ...store.stats };
}
export default { getStats, getCurrentLife, setCurrentLife };
