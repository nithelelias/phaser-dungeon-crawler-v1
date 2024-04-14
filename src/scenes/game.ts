import createPlayer, { Player } from "../components/player";

import ROOMS from "../context/rooms";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import RenderMapSystem from "../systems/renderMapSystem";
import createWorldRooms from "../systems/worldCreator";
import { TCell } from "../types/types";

export default class GameScene extends Phaser.Scene {
  player: Player | null = null;

  constructor() {
    super({ key: "game" });
  }
  preload() {
    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
    this.preCreateMaps();
  }
  preCreateMaps() {
    createWorldRooms({
      loadRoom: this.loadRoom.bind(this),
      openBattle: this.openBattle.bind(this),
    });
  }
  create() {
    this.showMapTools();
    RenderMapSystem.create(this);
    EventSystem.create(this);
    this.player = createPlayer(this);
    this.cameras.main.setZoom(5).startFollow(this.player.sprite);

    this.loadRoom("floor1");
  }
  loadRoom(roomId: string, entryPosition?: TCell) {
    const roomData = ROOMS.setCurrent(roomId)!;
    const player = this.player!;
    //player.sprite.setDepth(1);
    player.setPosition(entryPosition || roomData.entrance);
    this.cameras.main.centerOn(player.sprite.x, player.sprite.y);
    roomData.dirty = true;
    EventSystem.current.onPlayerMoved(() => {
      //dungeonRoom.stop();
      const position = player.position;
      try {
        const event = roomData.triggers[position.row][position.col];
        if (event) {
          console.log("event trigger", event.tag);
          event.execute().then(() => {});
        }
      } catch (error) {
        console.warn(position, error);
      }
    });
  }

  openBattle() {
    this.scene.pause("game");
    this.scene.run("battle", {
      callback: () => {
        this.scene.resume("game");
      },
    });
  }

  showMapTools() {
    this.input.keyboard?.on("keydown-M", () => {
      this.scene.run("maptool");
    });
  }
}
