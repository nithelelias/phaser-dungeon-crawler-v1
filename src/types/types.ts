export type TMapTiles = {
  ground: number[];
  walls: number[][];
  corners: number[];
  blocks: number[];
};
export type TMapData = {
  cols: number;
  rows: number;
  tileSize: number;
  tiles: TMapTiles;
  data: number[][];
};

export type TCell = {
  col: number;
  row: number;
};
export enum TCellEventType {
  WALK,
  HIT,
}
export type TCellEvent = {
  col: number;
  row: number;
  type: TCellEventType;
};
export type TEntity = {
  position: TCell;
  sprite: Phaser.GameObjects.GameObject;
};
