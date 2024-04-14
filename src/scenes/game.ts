import createPlayer, { Player } from "../components/player";

import ROOMS from "../context/rooms";
import { TILESIZE } from "../data/constants";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import generateDungeonRoom from "../systems/generateDungeonRoom";
import { TCell, TCellEventType, TMapData } from "../types/types";

export default class GameScene extends Phaser.Scene {
  player: Player | null = null;
  currentMap: Phaser.Tilemaps.Tilemap | null = null;
  constructor() {
    super({ key: "game" });
  }
  preload() {
    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
    this.preCreateMaps();
  }
  preCreateMaps() {
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
    const gateTrigger = (
      dng: TMapData,
      cell: TCell,
      nextRoomId: string,
      entryPosition: TCell
    ) => {
      dng.triggers[cell.row][cell.col] = {
        col: cell.col,
        row: cell.row,
        type: TCellEventType.WALK,
        execute: async () => {
          this.loadRoom(nextRoomId, entryPosition);
        },
      };
    };
    rooms.forEach((roomInfo) => {
      const dungeon = generateDungeonRoom(roomInfo.id, roomInfo.texture);
      if (lastRoom) {
        gateTrigger(dungeon, dungeon.entrance, lastRoom.roomId, lastRoom.exit);
        gateTrigger(lastRoom, lastRoom.exit, dungeon.roomId, dungeon.entrance);
      }
      lastRoom = dungeon;
      ROOMS.addRoom(roomInfo.id, dungeon);
    });
  }
  create() {
    this.showMapTools();
    EventSystem.create(this);
    this.player = createPlayer(this);
    this.cameras.main.setZoom(5).startFollow(this.player.sprite);

    this.loadRoom("floor1");
  }
  loadRoom(roomId: string, entryPosition?: TCell) {
    if (this.currentMap) {
      this.currentMap.destroy();
    }
    const roomData = ROOMS.setCurrent(roomId)!;
    const player = this.player!;
    this.renderMap(roomData);
    player.sprite.setDepth(1);
    player.setPosition(entryPosition || roomData.entrance);
    this.cameras.main.centerOn(player.sprite.x, player.sprite.y);
    console.log(roomData.triggers);
    EventSystem.current.onPlayerMoved(() => {
      //dungeonRoom.stop();
      const position = player.position;
      try {
        const event = roomData.triggers[position.row][position.col];
        if (event) {
          console.log("event trigger", event);
          event.execute();
        }
      } catch (error) {
        console.warn(position, error);
      }
    });
  }
  renderMap(dungeonRoom: TMapData) {
    this.currentMap = this.make.tilemap({
      tileWidth: TILESIZE,
      tileHeight: TILESIZE,
      width: dungeonRoom.cols,
      height: dungeonRoom.rows,
      data: dungeonRoom.data,
    });
    const tileset = this.currentMap.addTilesetImage(TILES.name)!;
    this.currentMap.createLayer(0, tileset, 0, 0);
  }
  showMapTools() {
    this.input.keyboard?.on("keydown-M", () => {
      this.scene.run("maptool");
    });
  }
}
