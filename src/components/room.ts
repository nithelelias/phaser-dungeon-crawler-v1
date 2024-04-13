import { TILESIZE } from "../data/constants";

import { TCell, TCellEvent, TMapData } from "../types/types";
function parseKey(col: number, row: number) {
  return col + "_" + row;
}
export default class Room {
  config: TMapData;
  entrance: TCell;
  exit: TCell;
  walls: Record<string, boolean> = {};
  triggers: Record<string, TCellEvent> = {};
  constructor(info: TMapData, entrance: TCell, exit: TCell) {
    this.config = info;
    this.entrance = entrance;
    this.exit = exit;
  }

  setRoomHitTest(hitTestlist: TCell[]) {
    hitTestlist.forEach((cell) => {
      this.walls[parseKey(cell.col, cell.row)] = true;
    });
  }
  isWall(col: number, row: number) {
    return this.walls[parseKey(col, row)];
  }

  setRoomCellEvents(eventList: TCellEvent[]) {
    eventList.forEach((cell) => {
      this.triggers[parseKey(cell.col, cell.row)] = cell;
    });
  }
  getCellEvent(col: number, row: number) {
    return this.triggers[parseKey(col, row)];
  }
  getCoordsOfCell(col: number, row: number) {
    return Room.getCoordsOfCell(col, row);
  }

  static getCoordsOfCell(col: number, row: number) {
    return {
      x: col * TILESIZE,
      y: row * TILESIZE,
    };
  }
}
