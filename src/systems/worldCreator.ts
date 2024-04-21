import { addToInventory, getEquipment } from "../context/inventory";
import ROOMS from "../context/rooms";
import { addSkill } from "../context/skills";
import { getRandomGear } from "../data/items";

import { MAPS, TILES } from "../data/resources";
import { popIconUp } from "../tweens/popUp";
import {
  ITEM,
  SKILLS,
  TCell,
  TCellEventType,
  TCoords,
  TDataEntity,
  TMapData,
} from "../types/types";
import iterateCount from "../utils/iterateCount";
import random from "../utils/random";
import generateDungeonRoom from "./generateDungeonRoom";

interface IWorldCreator {
  loadRoom: (roomId: string, entryPosition: TCell) => void;
  openBattle: (mobs: TDataEntity[]) => void;
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
    {
      id: "floor4",
      texture: "floor4",
    },
    {
      id: "floor5",
      texture: "floor5",
    },
  ];

  let lastRoom: TMapData | null = null;
  rooms.forEach((roomInfo, idx) => {
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

    ROOMS.addRoom(roomInfo.id, dungeon, idx + 1);
  });
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

function addTriggerEvent(
  dng: TMapData,
  cell: TCell,
  type: TCellEventType,
  tag: string[],
  execute: (scene: Phaser.Scene, coords: TCoords) => Promise<void>
) {
  dng.triggers[cell.row][cell.col] = {
    col: cell.col,
    row: cell.row,
    type,
    tag,
    execute,
  };
}

function fillRoomWithStuff(dng: TMapData, api: IWorldCreator) {
  addChestOnRoom(dng);
  addEnemyOnRoom(dng, api);
  addPickable(
    dng,
    {
      col: dng.entrance.col + 1,
      row: dng.entrance.row - 1,
    },
    TILES.frames.skills.bleed,
    async () => {
      addSkill(SKILLS.bleed);
    }
  );
  addPickable(
    dng,
    {
      col: dng.entrance.col + 1,
      row: dng.entrance.row - 3,
    },
    TILES.frames.skills.bleed,
    async () => {
      addSkill(SKILLS.bleed);
    }
  );
  addPickable(
    dng,
    {
      col: dng.entrance.col + 3,
      row: dng.entrance.row - 1,
    },
    TILES.frames.skills.vampirism,
    async () => {
      addSkill(SKILLS.vampirism);
    }
  );
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

function addChestOnRoom(dng: TMapData) {
  // MAX 3 CHEST per MAP? 80%, 40%  10%
  // GET 3 RANDOM NOT EMPTY POSITIONS ON MAP
  const cellsToUse = getCellsToUseIf(dng.walls, 1);
  const tiles = MAPS[dng.textureName];
  const addChestAt = (cell: TCell) => {
    let open = false;
    dng.data[0][cell.row][cell.col] = tiles.ground[0];
    dng.data[1][cell.row][cell.col] = TILES.frames.chest;
    dng.walls[cell.row][cell.col] = 0;
    const holder = {
      item: getRandomGear(),
    };

    addTriggerEvent(
      dng,
      cell,
      TCellEventType.WALK,
      [`chest-${dng.roomId}`],
      async (scene: Phaser.Scene, coords: TCoords) => {
        if (open) {
          return;
        }
        open = true;
        const currentEquipment = getEquipment()[holder.item.type];
        addToInventory({
          type: ITEM.EQUIPEMENT,
          item: holder.item,
        });
        popIconUp(scene, coords, holder.item.texture);
        if (currentEquipment) {
          holder.item = currentEquipment;
          open = false;
          dng.data[1][cell.row][cell.col] = currentEquipment.texture;
        } else {
          dng.data[1][cell.row][cell.col] = TILES.frames.chest_open;
        }
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
function addEnemyOnRoom(dng: TMapData, api: IWorldCreator) {
  // MAX 3 ENEMY per MAP? 80%, 40%  10%
  // GET 3 RANDOM NOT EMPTY POSITIONS ON MAP
  const totalEnemies = 3;
  const tiles = MAPS[dng.textureName];
  const cellsToUse = getCellsToUseIf(dng.data[0], tiles.ground[0]);
  const MOBTEMPLATE = {
    name: "rat",
    texture: TILES.frames.charactes.rat,
    stats: {
      hp: 2,
      attack: 1,
      speed: 1,
      defense: 1,
      evation: 1,
    },
  };
  const addEnemyAt = (cell: TCell) => {
    dng.data[1][cell.row][cell.col] = TILES.frames.enemy;
    dng.walls[cell.row][cell.col] = 0;
    let triggered = false;
    const mobs: TDataEntity[] = new Array(random(1, 3))
      .fill(null)
      .map(() => ({ ...MOBTEMPLATE, hp: random(1, 3) }));
    addTriggerEvent(
      dng,
      cell,
      TCellEventType.WALK,
      [`enemy-${dng.roomId}`],
      async () => {
        if (triggered) {
          return;
        }
        //  triggered = true;
        console.log("triggered");
        api.openBattle(mobs);
      }
    );
  };
  iterateCount(totalEnemies, () => {
    const idx = random(0, cellsToUse.length - 1);
    const cell: TCell = cellsToUse.splice(idx, 1)[0];
    addEnemyAt(cell);
  });
}
function addPickable(
  dng: TMapData,
  cell: TCell,
  mapImage: number,
  onPick: (scene: Phaser.Scene, coords: TCoords) => Promise<void>
) {
  const tiles = MAPS[dng.textureName];

  dng.data[1][cell.row][cell.col] = mapImage;
  if (dng.walls[cell.row][cell.col]) {
    dng.data[0][cell.row][cell.col] = tiles.ground[0];
    dng.walls[cell.row][cell.col] = 0;
  }
  addTriggerEvent(
    dng,
    cell,
    TCellEventType.WALK,
    [`pick-${dng.roomId}`],
    async (scene: Phaser.Scene, coords: TCoords) => {
      popIconUp(scene, coords, mapImage);
      if (onPick) {
        await onPick(scene, coords);
      }
      dng.data[1][cell.row][cell.col] = TILES.frames.__EMPTY;
      delete dng.triggers[cell.row][cell.col];
      dng.dirty = true;
    }
  );
}
