import { MAPS, TILES } from "../data/resources";
import generateMaze from "../libs/MazeBuilder";
import PathFind from "../libs/pathFind";
import { TCell, TCoords, TMapData } from "../types/types";
import random from "../utils/random";

function iterateMatrixDataMap(
  matrixMap: number[][],
  callback: (first: number, second: number, props: any) => void
) {
  matrixMap.forEach((innerArray: number[], first: number) => {
    innerArray.forEach((content: any, second: number) => {
      callback(first, second, content);
    });
  });
}

export default function generateDungeonRoom(
  roomId: string,
  textureName: string
): TMapData {
  if (!MAPS.hasOwnProperty(textureName)) {
    throw new Error("Room not found");
  }
  const totalCols = 14; // random(10, 20);
  const totalRows = 17; //random(10, 20);
  const initArray = (value: any = 0) =>
    new Array(totalRows).fill(null).map(() => new Array(totalCols).fill(value));
  const maze = generateMaze(totalCols, totalRows);
  const tiles = MAPS[textureName];
  const data = [
    initArray(TILES.frames.__EMPTY),
    initArray(TILES.frames.__EMPTY),
    initArray(TILES.frames.__DARK),
  ];
  const dataWalls = initArray();
  const triggers = initArray(null);
  const isContain = (col: number, row: number) =>
    col >= 0 && col < totalCols && row >= 0 && row < totalRows;
  const getFrameByType = (frameType: number, cell: TCell) => {
    if (frameType === 2) {
      // WALLS
      const walls = tiles.walls;
      const corners = tiles.corners;
      if (cell.col === 0 && cell.row === 0) return corners[0];
      if (cell.col === 0 && cell.row === totalRows - 1) return corners[3];
      if (cell.col === totalCols - 1 && cell.row === 0) return corners[1];
      if (cell.col === totalCols - 1 && cell.row === totalRows - 1)
        return corners[2];

      if (cell.row === 0 && cell.col > 0 && cell.col < totalCols - 1) {
        return walls[0][0];
      }
      if (
        cell.row === totalRows - 1 &&
        cell.col > 0 &&
        cell.col < totalCols - 1
      ) {
        return walls[1][0];
      }
      if (cell.col === 0 && cell.row > 0 && cell.row < totalRows - 1) {
        return walls[2][0];
      }
      if (
        cell.col === totalCols - 1 &&
        cell.row > 0 &&
        cell.row < totalRows - 1
      ) {
        return walls[3][0];
      }
      return tiles.blocks[0];
    }

    if (frameType === 1) {
      return tiles.blocks[random(0, tiles.blocks.length - 1)];
    }

    return tiles.ground[0];
  };
  const path = PathFind(
    { x: maze.entrance.col, y: maze.entrance.row },
    { x: maze.exit.col, y: maze.exit.row },
    (x: number, y: number) => {
      return isContain(x, y) && maze.walls[y][x] === 0;
    }
  );
  iterateMatrixDataMap(maze.walls, (row: number, col: number, cell: number) => {
    try {
      const isOnBorder =
        col === 0 ||
        col === totalCols - 1 ||
        row === 0 ||
        row === totalRows - 1;
      const isGate =
        (row === maze.entrance.row && col === maze.entrance.col) ||
        (row === maze.exit.row && col === maze.exit.col);
      const frame = isOnBorder && !isGate ? 2 : cell;
      data[0][row][col] = getFrameByType(frame, { col, row });
      dataWalls[row][col] = frame ? 1 : 0; //frameType === 1 ? 1 : 0;
    } catch (e) {
      console.log({ col, row, totalCols, totalRows }, e);
    }
  });

  path.forEach((p: TCoords) => {
    data[0][p.y][p.x] = TILES.frames.__WHITE;
  }); 
  return {
    dirty: true,
    textureName,
    roomId,
    cols: totalCols,
    rows: totalRows,
    entrance: maze.entrance,
    exit: maze.exit,
    triggers,
    data,
    walls: dataWalls,
  };
}
