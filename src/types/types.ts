export type TMapTiles = {
  ground: number[];
  walls: number[][];
  corners: number[];
  blocks: number[];
};
export type TMapData = {
  roomId: string;
  cols: number;
  rows: number;
  data: number[][];
  walls: number[][];
  entrance: TCell;
  exit: TCell;
  triggers: TCellEvent[][];
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
  execute: () => Promise<void>;
};
export type TEntity = {
  position: TCell;
  sprite: Phaser.GameObjects.GameObject;
};
