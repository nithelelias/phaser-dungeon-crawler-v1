import moveToCell from "../behaviors/actions";
import { TILES } from "../data/resources";
import { TCell } from "../types/types";
import initController, { TKeyControlMap } from "./controller";
import Room from "./room";

class Player {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  position: TCell;
  constructor(scene: Phaser.Scene, position: TCell) {
    this.scene = scene;
    this.position = position;
    const coords = Room.getCoordsOfCell(position.col, position.row);
    this.sprite = scene.add
      .sprite(coords.x, coords.y, TILES.name, TILES.frames.charactes.default)
      .setOrigin(0);
  }
  setPosition(position: TCell) {
    this.position = position;
    const coords = Room.getCoordsOfCell(position.col, position.row);
    this.sprite.setPosition(coords.x, coords.y);
  }
}

function controlMovePlayer(player: Player, room: Room) {
  let actionLock = false;

  initController(
    player.scene,
    (keydown: TKeyControlMap, event: KeyboardEvent) => {
      if (actionLock) return;

      const desirePosition = { ...player.position };
      if (keydown.left) {
        desirePosition.col -= 1;
      }
      if (keydown.right) {
        desirePosition.col += 1;
      }
      if (keydown.up) {
        desirePosition.row -= 1;
      }
      if (keydown.down) {
        desirePosition.row += 1;
      }
      if (room.isWall(desirePosition.col, desirePosition.row)) {
        return;
      }
      actionLock = true;
      moveToCell(player, desirePosition).then(() => {
        actionLock = false;
        player.setPosition(desirePosition);
      });
    }
  );
}

export default function createPlayer(
  scene: Phaser.Scene,
  room: Room,
  startCell: TCell
) {
  const player = new Player(scene, startCell);
  controlMovePlayer(player, room);
  return player;
}
