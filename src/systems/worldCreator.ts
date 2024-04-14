import ROOMS from "../context/rooms";
import { MAPS, TILES } from "../data/resources";
import { TCell, TCellEventType, TMapData } from "../types/types";
import iterateCount from "../utils/iterateCount";
import random from "../utils/random";
import generateDungeonRoom from "./generateDungeonRoom";

interface IWorldCreator {
  loadRoom: (roomId: string, entryPosition: TCell) => void;
}
export default function createWorldRooms(api: IWorldCreator) {
  const rooms = [
    {
      id: "floor1",
      texture: "floor1",
    },
    {
      id: "floor2",
      texture: "floor2",
    },
    {
      id: "floor3",
      texture: "floor3",
    },
  ];

  let lastRoom: TMapData | null = null;
  rooms.forEach((roomInfo) => {
    const dungeon = generateDungeonRoom(roomInfo.id, roomInfo.texture);
    fillRoomWithStuff(dungeon, api);
    if (lastRoom) {
      gateTrigger(
        dungeon,
        dungeon.entrance,
        lastRoom.roomId,
        lastRoom.exit,
        api
      );
      gateTrigger(
        lastRoom,
        lastRoom.exit,
        dungeon.roomId,
        dungeon.entrance,
        api
      );
    }
    lastRoom = dungeon;

    ROOMS.addRoom(roomInfo.id, dungeon);
  });
}
function addTriggerEvent(
  dng: TMapData,
  cell: TCell,
  type: TCellEventType,
  tag: string[],
  execute: () => Promise<void>
) {
  dng.triggers[cell.row][cell.col] = {
    col: cell.col,
    row: cell.row,
    type,
    tag,
    execute,
  };
}
function gateTrigger(
  dng: TMapData,
  cell: TCell,
  nextRoomId: string,
  entryPosition: TCell,
  api: IWorldCreator
) {
  addTriggerEvent(
    dng,
    cell,
    TCellEventType.WALK,
    [`connect-${dng.roomId}-${nextRoomId}`],
    async () => {
      api.loadRoom(nextRoomId, entryPosition);
    }
  );
}

function fillRoomWithStuff(dng: TMapData, api: IWorldCreator) {
  addChestOnRoom(dng, api);
}

function addChestOnRoom(dng: TMapData, api: IWorldCreator) {
  // MAX 3 CHEST per MAP? 80%, 40%  10%
  // GET 3 RANDOM NOT EMPTY POSITIONS ON MAP
  const cellsToUse = getCellsToUseIf(dng.walls, 1);
  const tiles = MAPS[dng.textureName];
  const addChestAt = (cell: TCell) => {
    let open = false;
    dng.data[0][cell.row][cell.col] = tiles.ground[0];
    dng.data[1][cell.row][cell.col] = TILES.frames.chest;
    dng.walls[cell.row][cell.col] = 0;
    addTriggerEvent(
      dng,
      cell,
      TCellEventType.WALK,
      [`chest-${dng.roomId}`],
      async () => {
        if (open) {
          return;
        }
        open = true;
        console.log("open chest");
        dng.data[1][cell.row][cell.col] = TILES.frames.chest_open;
        dng.dirty = true;
      }
    );
  };
  iterateCount(3, () => {
    const idx = random(0, cellsToUse.length - 1);
    const cell: TCell = cellsToUse.splice(idx, 1)[0];
    addChestAt(cell);
  });
}

function getCellsToUseIf(matrixMap: number[][], value: number = 0) {
  const freeToUse: TCell[] = [];
  const totals = {
    cols: matrixMap[0].length - 1,
    rows: matrixMap.length - 1,
  };
  matrixMap.forEach((rowList, row) => {
    rowList.forEach((cell, col) => {
      if (
        col > 0 &&
        row > 0 &&
        row < totals.rows &&
        col < totals.cols &&
        cell === value
      ) {
        freeToUse.push({
          col,
          row,
        });
      }
    });
  });
  return freeToUse;
}
