export type TCoords = { x: number; y: number };
export type TMatrixMap = number[][];
export type TMapTiles = {
  ground: number[];
  walls: number[][];
  corners: number[];
  blocks: number[];
};
export type TMapData = {
  roomId: string;
  textureName: string;
  cols: number;
  rows: number;
  data: TMatrixMap[];
  walls: TMatrixMap;
  entrance: TCell;
  exit: TCell;
  triggers: TCellEvent[][];
  dirty: boolean;
};

export type TCell = {
  col: number;
  row: number;
};
export type TCellData = {
  col: number;
  row: number;
  value: number;
};

export enum TCellEventType {
  WALK,
  HIT,
}
export type TCellEvent = {
  col: number;
  row: number;
  type: TCellEventType;
  tag: string[];
  execute: (scene: Phaser.Scene, coords: TCoords) => Promise<void>;
};
export type TEntity = {
  position: TCell;
  sprite: Phaser.GameObjects.GameObject;
};
export enum STATS {
  hp = "hp",
  speed = "speed",
  attack = "attack",
  defense = "defense",
  evation = "evation",
}
export type TEntityStats = {
  hp: number;
  speed: number;
  attack: number;
  defense: number;
  evation: number;
};
export type TDataEntity = {
  name: string;
  texture: number;
  stats: TEntityStats;
};

export enum STATUSEFFECTS {
  POISON = "POISON",
  BLEED = "BLEED",
  STUN = "STUN",
  BURN = "BURN",
}
export enum EQUIPEMENT {
  WEAPON = "WEAPON",
  SHIELD = "SHIELD",
  ARMOR = "ARMOR",
  RING = "RING",
  AMULET = "AMULET",
  HELMET = "HELMET",
}
export type TStatDic = { [K in STATS]?: number };
export type TEquipment = {
  name: string;
  texture: number;
  quality: number;
  type: EQUIPEMENT;
  stats: TStatDic;
};

export enum WEAPON {
  SWORD = "SWORD",
  HAMMER = "HAMMER",
  BOW = "BOW",
  STAFF = "STAFF",
  SPEAR = "SPEAR",
}

export enum SKILLS {
  repeat = "repeat",
  block = "block",
  regen = "regen",
  counter = "counter",
  vampirism = "vampirism",
  poison = "poison",
  bleed = "bleed",
  stun = "stun",
  burn = "burn",
  projectile = "projectile",
}

export enum ITEM {
  EQUIPEMENT = "EQUIPEMENT",
  CONSUMABLE = "CONSUMABLE",
}

export type TConsumable = {
  name: string;
  value: number;
  texture: number;
};
