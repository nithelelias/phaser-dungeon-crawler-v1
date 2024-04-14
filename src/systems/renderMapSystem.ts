import ROOMS from "../context/rooms";
import { MAP_MAX_SIZE, TILESIZE } from "../data/constants";
import { TILES } from "../data/resources";
import { isContained } from "../utils/functions";
import iterateCount from "../utils/iterateCount";

export default class RenderMapSystem {
  static currentInstnace: RenderMapSystem;
  scene: Phaser.Scene;
  map: Phaser.Tilemaps.Tilemap;
  layers: Phaser.Tilemaps.TilemapLayer[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    RenderMapSystem.currentInstnace = this;
    const map = this.scene.make.tilemap({
      tileWidth: TILESIZE,
      tileHeight: TILESIZE,
      width: MAP_MAX_SIZE.width,
      height: MAP_MAX_SIZE.height,
      //data: room.data,
    });
    const tileset = map.addTilesetImage(TILES.name)!;

    this.map = map;
    this.layers = [
      map.createBlankLayer("layer0", tileset, 0, 0)!,
      map.createBlankLayer("layer1", tileset, 0, 0)!,
    ];
    scene.events.on("update", this.update, this);
  }
  static create(scene: Phaser.Scene) {
    return new RenderMapSystem(scene);
  }
  update() {
    const room = ROOMS.getCurrent();
    if (!room) {
      return;
    }
    if (!room.dirty) {
      return;
    }

    iterateCount(MAP_MAX_SIZE.width, (col) => {
      iterateCount(MAP_MAX_SIZE.height, (row) => {
        if (isContained(room, col, row)) {
          room.data.forEach((matrix, idx) => {
            this.layers[idx].putTileAt(matrix[row][col], col, row);
          });
        } else {
          this.layers[0].putTileAt(TILES.frames.__EMPTY, col, row);
          this.layers[1].putTileAt(TILES.frames.__EMPTY, col, row);
        }
      });
    });

    room.dirty = false;
  }
}
