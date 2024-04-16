import { addToInventory } from "../context/inventory";
import ROOMS from "../context/rooms";
import { TILESIZE } from "../data/constants";
import { getRandomGear } from "../data/items";

import { MAPS, TILES } from "../data/resources";
import {
  ITEM,
  TCell,
  TCellEventType,
  TCoords,
  TDataEntity,
  TMapData,
} from "../types/types";
import iterateCount from "../utils/iterateCount";
import random from "../utils/random";
import { tweenPromise } from "../utils/tweenPromise";
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

    const item = getRandomGear();

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
        dng.data[1][cell.row][cell.col] = TILES.frames.chest_open;
        dng.dirty = true;
        addToInventory({
          type: ITEM.EQUIPEMENT,
          item,
        });

        popIconUp(scene, coords, item.texture);
        console.log("open chest ", item.name, item);
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

async function popIconUp(
  scene: Phaser.Scene,
  coords: { x: number; y: number },
  iconTexture: number
) {
  const halfTiLe = TILESIZE / 2;
  const container = scene.add
    .container(coords.x + halfTiLe, coords.y + halfTiLe, [
      scene.add.sprite(0, 0, TILES.name, iconTexture),
    ])
    .setScale(0.2)
    .setAlpha(0);
  await tweenPromise(container, {
    y: coords.y - halfTiLe,
    scale: 1,
    alpha: 1,
    duration: 100,
    ease: "sine.out",
    hold: 500,
  });
  await tweenPromise(container, {
    y: coords.y - TILESIZE * 2,
    scale: 1,
    alpha: 0,
    duration: 200,
    ease: "sine.out",
  });
  container.destroy();
}
