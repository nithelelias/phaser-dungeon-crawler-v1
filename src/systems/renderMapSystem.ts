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
      map.createBlankLayer("layer2", tileset, 0, 0)!,
    ];
    const unbindListener = () => {
      scene.events.off("update", this.update, this);
    };
    scene.events.on("update", this.update, this);
    scene.events.on(
      "shutdown",
      () => {
        unbindListener();
      },
      this
    );
  }
  static create(scene: Phaser.Scene) {
    return new RenderMapSystem(scene);
  }
  destroy() {
    this.map.destroy();
    this.layers = [];
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
            if (
              this.layers[idx].getTileAt(col, row) === null ||
              this.layers[idx].getTileAt(col, row).index !== matrix[row][col]
            ) {
              this.layers[idx].putTileAt(matrix[row][col], col, row);
            }
          });
        } else {
          if (
            this.layers[0].getTileAt(col, row) === null ||
            this.layers[0].getTileAt(col, row).index !== TILES.frames.__EMPTY
          ) {
            this.layers[0].putTileAt(TILES.frames.__EMPTY, col, row);
            this.layers[1].putTileAt(TILES.frames.__EMPTY, col, row);
            this.layers[2].putTileAt(TILES.frames.__EMPTY, col, row);
          }
        }
      });
    });

    room.dirty = false;
  }
}
