import createPlayer, { Player } from "../components/player";

import ROOMS from "../context/rooms";
import { HALF_TILESIZE } from "../data/constants";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import RenderMapSystem from "../systems/renderMapSystem";
import createWorldRooms from "../systems/worldCreator";
import { TCell, TDataEntity } from "../types/types";
import { getCoordsOfCell } from "../utils/functions";
import iterateCount from "../utils/iterateCount";

export default class GameScene extends Phaser.Scene {
  player: Player | null = null;

  constructor() {
    super({ key: "game" });
  }
  preload() {
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

    RenderMapSystem.create(this).layers.forEach((layer) =>
      layer.setPipeline("Light2D")
    );
    EventSystem.create(this);
    this.player = createPlayer(this);
    this.cameras.main.setZoom(5).startFollow(this.player.sprite);

    this.lights
      .addLight(this.player.sprite.x, this.player.sprite.y, 64)
      .setIntensity(1.2);

    this.lights.enable().setAmbientColor(0x555555);
    this.loadRoom("floor1");
    const discoverRadius = 2;
    const clearCell = (_ncol: number, _nrow: number) => {
      const roomData = ROOMS.getCurrent()!;
      const col = Phaser.Math.Clamp(_ncol, 0, roomData.cols - 1);
      const row = Phaser.Math.Clamp(_nrow, 0, roomData.rows - 1);
      if (roomData.data[2][row][col] !== TILES.frames.__LIGHTED) {
        roomData.data[2][row][col] = TILES.frames.__LIGHTED;
        const tile = RenderMapSystem.currentInstnace.layers[2].getTileAt(
          col,
          row
        );
        if (tile) {
          this.tweens.add({
            targets: tile,
            alpha: 0,
            duration: 500,
            ease: "quint.inOut",
            onComplete: () => {
              tile.index = TILES.frames.__LIGHTED;
              tile.setAlpha(1);
            },
          });
        }
        //roomData.dirty = true;
      }
    };
    const discover = () => {
      const roomData = ROOMS.getCurrent();
      if (!roomData) return;
      const player = this.player!;
      //dungeonRoom.stop();
      const position = player.position;

      const start = {
        col: position.col - discoverRadius,
        row: position.row - discoverRadius,
      };

      iterateCount(discoverRadius * 2 + 1, (num) => {
        const newcol = start.col + num;
        clearCell(newcol, start.row);
        iterateCount(discoverRadius * 2 + 1, (num) => {
          clearCell(newcol, start.row + num);
        });
      });
    };
    discover();
    EventSystem.current.onPlayerMoved(() => {
      const roomData = ROOMS.getCurrent();
      if (!roomData) return;
      const player = this.player!;
      //dungeonRoom.stop();
      const position = player.position;
      discover();
      try {
        const event = roomData.triggers[position.row][position.col];
        if (event) {
          const coords = getCoordsOfCell(position.col, position.row);
          console.log("event trigger IN", roomData.roomId, event.tag, position);
          event.execute(this, coords).then(() => {});
        }
      } catch (error) {
        console.warn(position, error);
      }
    });
  }
  loadRoom(roomId: string, entryPosition?: TCell) {
    const roomData = ROOMS.setCurrent(roomId)!;
    const player = this.player!;
    player.setPosition(entryPosition || roomData.entrance);
    this.cameras.main.centerOn(player.sprite.x, player.sprite.y);
    roomData.dirty = true;
  }
  updateLightOnPlayer() {
    if (!this.player) {
      return;
    }
    const light = this.lights.lights[0];
    light.x = this.player.sprite.x + HALF_TILESIZE;
    light.y = this.player.sprite.y + HALF_TILESIZE;
  }
  openBattle(mobs: TDataEntity[]) {
    this.cameras.main.postFX.addBlur(12);
    this.scene.pause("game");
    this.scene.run("battle", {
      mobs,
      callback: ({ win, escaped }: { escaped: boolean; win: boolean }) => {
        if (!win && !escaped) {
          this.scene.run("endgame", { win: false });

          return;
        }
        this.scene.resume("game");
        this.cameras.main.postFX.clear();
      },
    });
  }

  showMapTools() {
    this.input.keyboard?.on("keydown-M", () => {
      this.scene.run("maptool");
    });
  }
  update(): void {
    this.updateLightOnPlayer();
  }
}
