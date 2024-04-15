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
  execute: () => Promise<void>;
};
export type TEntity = {
  position: TCell;
  sprite: Phaser.GameObjects.GameObject;
};

export type TDataEntity = {
  name: string;
  texture: number;
  level: number; 
  hp: number;
  speed: number;
  attack: number;
};
