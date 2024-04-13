import RoomRender from "../components/RoomRender";
import Room from "../components/room";
import { TILESIZE } from "../data/constants";

import { MAPS, TILES } from "../data/resources";
import generateMaze from "../libs/MazeBuilder";
import { TCell, TMapData } from "../types/types";
import random from "../utils/random";

export default function generateDungeonRoom(
  scene: Phaser.Scene,
  roomIdName: string
): Room {
  if (!MAPS.hasOwnProperty(roomIdName)) {
    throw new Error("Room not found");
  }

  const roomWalls: TCell[] = [];
  const maze = generateMaze(random(10, 20), random(10, 20));

  const roomInfo: TMapData = {
    cols: maze[0].length,
    rows: maze.length,
    tileSize: TILESIZE,
    tiles: MAPS[roomIdName],
    data: [],
  };

  const exitCell = {
    col: 0,
    row: 0,
  };
  const entranceCell = {
    col: 0,
    row: 0,
  };
  const getFrameByCell = (cell: string[]) => {
    if (cell[0] === "wall" && random(0, 10) > 2) {
      return 1; //
    }

    return 0;
  };
  maze.forEach((row: [], j: number) => {
    const cells: number[] = [];
    row.forEach((cell: string[], i: number) => {
      const frame = getFrameByCell(cell);
      const isWall = frame === 1;
      if (isWall || i === 0 || j === 0) {
        roomWalls.push({
          col: i,
          row: j,
        });
      }
      cells.push(frame);
      if (cell[0] === "entrance") {
        entranceCell.col = i;
        entranceCell.row = j;
      }
      if (cell[0] === "exit") {
        exitCell.col = i;
        exitCell.row = j;
      }
    });
    roomInfo.data.push(cells);
  });
  const roomRender = new RoomRender(scene, TILES.name, roomInfo);
  roomRender.groundLayer?.putTileAt(1, exitCell.col, exitCell.row);
  roomRender.groundLayer?.putTileAt(2, entranceCell.col, entranceCell.row);

  const room = new Room(roomInfo, entranceCell, exitCell);

  room.setRoomHitTest(roomWalls);
  return room;
}
