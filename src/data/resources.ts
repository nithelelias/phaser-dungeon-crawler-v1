import { poison, projectile, stun, vampirism } from "../components/skills";
import { TMapTiles } from "../types/types";

export const TILES = {
  name: "tiles",
  src: "./resources/maptile.png",
  config: { frameWidth: 16, frameHeight: 16 },
  frames: {
    blocked: 0,
    __WHITE: 29,
    __DARK: 10,
    __LIGHTED: 13,
    __EMPTY: 13,
    chest: 156,
    chest_open: 157,
    enemy: 525,
    spacebar: 518,
    gear: {
      sword: 247,
      sword10: 256,
      hammer: 266,
      hammer10: 275,
      bow: 285,
      bow10: 294,
      staff: 304,
      staff3: 306,
      spear: 307,
      spear3: 309,
      shield: 361,
      shield10: 370,
      armor: 342,
      armor10: 351,
      helmet: 380,
      helmet10: 389,
      ring: 174,
      amulet: 175,
    },
    effects: {
      heal: 498,
      bleed: 497,
      stun: 496,
      poison: 495,
      burn: 494,
      block: 364,
    },
    skills:{
      bleed:190,
      repeat:191,
      counter:192,
      projectile:193,      
      vampirism:194,
      regen:195,
      block:196,
      poison:197,
      burn:198,
      stun:199
    },
    projectile: {
      default: 311,
      energy: 332,
    },
    charactes: {
      default: 399,
      rat: 437,
    },
  },
};

export const MAPS: Record<string, TMapTiles> = {
  floor1: {
    ground: [262],
    walls: [[377], [339], [359], [357]],
    corners: [338, 340, 359, 357],
    blocks: [243, 246],
  },
  floor2: {
    ground: [224],
    walls: [[434], [396], [416], [414]],
    corners: [395, 397, 416, 414],
    blocks: [205, 208],
  },
  floor3: {
    ground: [148],
    walls: [[129], [129], [129], [129]],
    corners: [129, 129, 129, 129],
    blocks: [129, 132],
  },
  floor4: {
    ground: [110],
    walls: [[91], [91], [94], [91]],
    corners: [91, 94, 91, 91],
    blocks: [91, 94],
  },
  floor5: {
    ground: [186],
    walls: [[167], [167], [167], [167]],
    corners: [91, 94, 91, 91],
    blocks: [167, 94],
  },
};
