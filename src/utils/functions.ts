import ROOMS from "../context/rooms";
import { TILESIZE } from "../data/constants";
import { TMapData } from "../types/types";
export function isContained(room: TMapData, col: number, row: number) {
  return col >= 0 && col < room.cols && row >= 0 && row < room.rows;
}
export function isWalkAble(col: number, row: number) {
  const room = ROOMS.getCurrent()!;

  if (!isContained(room, col, row)) {
    return false;
  }
  return room.walls[row][col] === 0;
}

export function getCoordsOfCell(col: number, row: number) {
  return {
    x: TILESIZE * col,
    y: TILESIZE * row,
  };
}
