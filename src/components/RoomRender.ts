// WALL_DIRECTION_ORDER=up,down,left,right
// CORNER_DIRECTION_ORDER=UP-LEFT, UP-RIGHT, DOWN-LEFT,DOWN-RIGHT

import { TMapData } from "../types/types";
import random from "../utils/random";

export default class RoomRender {
  scene: Phaser.Scene;
  data: TMapData;
  map: Phaser.Tilemaps.Tilemap;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  objectLayer: Phaser.Tilemaps.TilemapLayer | null;
  constructor(scene: Phaser.Scene, textureName: string, data: TMapData) {
    this.scene = scene;
    this.map = scene.make.tilemap({
      tileWidth: data.tileSize,
      tileHeight: data.tileSize,
      width: data.cols,
      height: data.rows,
    });
    this.data = data;
    const tileset = this.map.addTilesetImage(textureName)!;

    this.groundLayer = this.map.createBlankLayer("Ground Layer", tileset)!;
    this.objectLayer = this.map.createBlankLayer("Object Layer", tileset)!;

    this.randomizeGround();
    this.fillInnerWalls();
    this.createBorders();
  }
  fillInnerWalls() {
    const data = this.data;
    const totalBlocks = data.tiles.blocks.length;
    const blocks = new Array(totalBlocks)
      .fill(data.tiles.blocks[0] + 0)
      .concat(data.tiles.blocks.slice(1, totalBlocks));
    const getNextInnerWall = () => {
      return blocks[random(0, blocks.length - 1)];
    };
    data.data.forEach((row, y) => {
      row.forEach((frame, x) => {
        if (frame !== 0) {
          this.groundLayer!.putTileAt(getNextInnerWall(), x, y);
        }
      });
    });
  }
  createBorders() {
    if (!this.groundLayer) {
      return;
    }
    const data = this.data;
    // Walls
    const frames = data.tiles;
    const wallUp = frames.walls[0];
    const wallDown = frames.walls[1];
    const wallLeft = frames.walls[2];
    const wallRight = frames.walls[3];
    this.groundLayer.fill(wallUp[0], 0, 0, this.map.width, 1);
    this.groundLayer.fill(
      wallDown[0],
      0,
      this.map.height - 1,
      this.map.width,
      1
    );
    this.groundLayer.fill(wallRight[0], 0, 0, 1, this.map.height);
    this.groundLayer.fill(
      wallLeft[0],
      this.map.width - 1,
      0,
      1,
      this.map.height
    );
    // CORNERS

    this.groundLayer.putTileAt(frames.corners[0], 0, 0);
    this.groundLayer.putTileAt(frames.corners[1], this.map.width - 1, 0);
    this.groundLayer.putTileAt(
      frames.corners[2],
      this.map.width - 1,
      this.map.height - 1
    );
    this.groundLayer.putTileAt(frames.corners[3], 0, this.map.height - 1);
  }
  randomizeGround() {
    if (!this.groundLayer || !this.objectLayer) {
      return;
    }
    // Fill the floor with random ground tiles
    const totalGrounds = this.data.tiles.ground.length + 3;
    const maxWeight = totalGrounds * 2;
    this.groundLayer.weightedRandomize(
      this.data.tiles.ground.map((frame, idx) => ({
        index: frame,
        weight: idx === 0 ? maxWeight : totalGrounds - idx,
      })),
      1, // - The left most tile index (in tile coordinates) to use as the origin of the area.
      1, // - The top most tile index (in tile coordinates) to use as the origin of the area.
      this.map.width - 2, // - How many tiles wide from the `tileX` index the area will be.
      this.map.height - 2 // - How many tiles tall from the `tileY` index the area will be.
    );
  }
}
