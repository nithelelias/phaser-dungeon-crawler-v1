import ROOMS from "../context/rooms";
import { TILESIZE } from "../data/constants";

export function isWalkAble(col: number, row: number) {
  const room = ROOMS.getCurrent()!;
  const isContained =
    col >= 0 && col < room.cols && row >= 0 && row < room.rows;
  if (!isContained) {
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
