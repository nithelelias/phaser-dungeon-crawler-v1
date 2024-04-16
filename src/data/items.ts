import {
  EQUIPEMENT,
  SKILLS,
  STATS,
  TEquipment,
  TStatDic,
  WEAPON,
} from "../types/types";
import random from "../utils/random";
import { TILES } from "./resources";

export const STATSBYGEAR = {
  [EQUIPEMENT.WEAPON]: [STATS.attack],
  [EQUIPEMENT.SHIELD]: [STATS.defense, STATS.defense, STATS.hp],
  [EQUIPEMENT.HELMET]: [STATS.hp, STATS.defense],
  [EQUIPEMENT.ARMOR]: [STATS.hp, STATS.defense],
  [EQUIPEMENT.RING]: [STATS.speed, STATS.hp],
  [EQUIPEMENT.AMULET]: [STATS.evation, STATS.hp],
};

export const STATSBYWEAPON = {
  [WEAPON.BOW]: [STATS.attack, STATS.speed],
  [WEAPON.HAMMER]: [STATS.attack, STATS.hp],
  [WEAPON.SWORD]: [STATS.attack, STATS.evation],
  [WEAPON.STAFF]: [STATS.evation],
  [WEAPON.SPEAR]: [STATS.evation, STATS.evation],
};

export const SKILLSBYWEAPON = {
  [WEAPON.BOW]: [SKILLS.bleed, SKILLS.poison, SKILLS.projectile],
  [WEAPON.HAMMER]: [SKILLS.stun],
  [WEAPON.SWORD]: [SKILLS.vampirism, SKILLS.bleed, SKILLS.counter],
  [WEAPON.STAFF]: [SKILLS.regen, SKILLS.burn, SKILLS.projectile],
  [WEAPON.SPEAR]: [SKILLS.bleed, SKILLS.repeat],
};

export const TEXTURESBYARMOR = {
  [EQUIPEMENT.WEAPON]: [TILES.frames.gear.sword, TILES.frames.gear.sword],
  [EQUIPEMENT.SHIELD]: [TILES.frames.gear.shield, TILES.frames.gear.shield10],
  [EQUIPEMENT.HELMET]: [TILES.frames.gear.helmet, TILES.frames.gear.helmet10],
  [EQUIPEMENT.ARMOR]: [TILES.frames.gear.armor, TILES.frames.gear.armor10],
  [EQUIPEMENT.RING]: [TILES.frames.gear.ring, TILES.frames.gear.ring],
  [EQUIPEMENT.AMULET]: [TILES.frames.gear.amulet, TILES.frames.gear.amulet],
};
export const TEXTURESBYWEAPON = {
  [WEAPON.SWORD]: [TILES.frames.gear.sword, TILES.frames.gear.sword10],
  [WEAPON.HAMMER]: [TILES.frames.gear.hammer, TILES.frames.gear.hammer10],
  [WEAPON.BOW]: [TILES.frames.gear.bow, TILES.frames.gear.bow10],
  [WEAPON.SPEAR]: [TILES.frames.gear.spear, TILES.frames.gear.spear3],
  [WEAPON.STAFF]: [TILES.frames.gear.staff, TILES.frames.gear.staff3],
};

const QUALITYTEXT = ["Normal", "Uncommon", "Rare", "Epic", "Mythic"];
const WEAPON_LIST = Object.values(WEAPON);
const GEAR_LIST = [
  EQUIPEMENT.AMULET,
  EQUIPEMENT.ARMOR,
  EQUIPEMENT.SHIELD,
  EQUIPEMENT.RING,
  EQUIPEMENT.HELMET,
];

function pickRandomOfArray(arr: any[]) {
  return arr[random(0, arr.length - 1)];
}
function pickRandomTexture(textures: number[], itemLevel: number) {
  const [min, max] = textures;
  return Math.min(max, random(min, min + itemLevel));
}
function randomizeStats(
  posibles: STATS[],

  worldLevel: number,
  itemLevel: number,
  quality: number
) {
  const rndStats: TStatDic = {};
  posibles.forEach((stat) => {
    if (rndStats[stat]) {
      rndStats[stat] = 0;
    }
    rndStats[stat] = random(worldLevel - 1, itemLevel) + quality;
  });
  return rndStats;
}

export function getRandomGear(): TEquipment {
  const { worldLevel, quality, itemLevel } = getRnadomItemLevel();
  const rndType = pickRandomOfArray(GEAR_LIST) as EQUIPEMENT;
  const texture = pickRandomTexture(TEXTURESBYARMOR[rndType], itemLevel);
  const equipmentName = rndType;
  const type = rndType;
  const item: TEquipment = {
    name: `${equipmentName} ${QUALITYTEXT[quality]} lv${itemLevel}`,
    type,
    quality,
    texture,
    stats: randomizeStats(STATSBYGEAR[rndType], worldLevel, itemLevel, quality),
  };
  return item;
}

export function getRandomWeapon(): TEquipment {
  const { worldLevel, quality, itemLevel } = getRnadomItemLevel();
  const weaponPick = pickRandomOfArray(WEAPON_LIST) as WEAPON;
  const texture = pickRandomTexture(TEXTURESBYWEAPON[weaponPick], itemLevel);
  const equipmentName = weaponPick;
  const type = EQUIPEMENT.WEAPON;
  const item: TEquipment = {
    name: `${equipmentName} ${QUALITYTEXT[quality]} lv${itemLevel}`,
    type,
    quality,
    texture,
    stats: randomizeStats(
      STATSBYWEAPON[weaponPick],
      worldLevel,
      itemLevel,
      quality
    ),
  };
  return item;
}

function getRnadomItemLevel() {
  const worldLevel = 1;
  const quality = random(0, 5);
  const itemLevel = random(worldLevel, worldLevel + 3);

  return { worldLevel, quality, itemLevel };
}
