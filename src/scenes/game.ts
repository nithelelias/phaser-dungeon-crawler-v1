import createPlayer from "../components/player";
import ROOMS from "../context/rooms";
import { TILES } from "../data/resources";
import generateDungeonRoom from "../systems/generateDungeonRoom";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }
  preload() {
    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
  }
  create() {
    this.showMapTools();
    const roomId = "floor1";
    const dungeonRoom = generateDungeonRoom(this, roomId);
    ROOMS.addRoom(roomId, dungeonRoom);
    const player = createPlayer(this, dungeonRoom, dungeonRoom.entrance);
    this.cameras.main.setZoom(5).centerOn(player.sprite.x, player.sprite.y);
    this.cameras.main.setZoom(5).startFollow(player.sprite);
    //this.cameras.main.centerOn(floor.groundLayer?.x, floor.groundLayer.y).setZoom(2);
  }
  showMapTools() {
    this.input.keyboard?.on("keydown-M", () => {
      this.scene.run("maptool");
    });
  }
}
