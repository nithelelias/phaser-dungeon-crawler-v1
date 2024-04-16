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
  evasion = "evasion",
}
export type TEntityStats = {
  hp: number;
  speed: number;
  attack: number;
  defense: number;
  evasion: number;
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
export type TStatDic={ [K in STATS]?: number }
export type TEquipment = {
  name: string;
  texture: number;
  type: EQUIPEMENT;
  stats: TStatDic;
};
