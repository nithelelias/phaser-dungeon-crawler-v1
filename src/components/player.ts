import { moveToCell } from "../behaviors/actions";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import { TCell } from "../types/types";
import { getCoordsOfCell, isWalkAble } from "../utils/functions";
import initController, { TKeyControlMap } from "./controller";

export class Player {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  position: TCell;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.position = { col: 0, row: 0 };

    this.sprite = scene.add
      .sprite(0, 0, TILES.name, TILES.frames.charactes.default)
      .setOrigin(0);
  }
  setPosition(position: TCell) {
    this.position = position;
    const coords = getCoordsOfCell(position.col, position.row);
    this.sprite.setPosition(coords.x, coords.y);
  }
}

function controlMovePlayer(player: Player) {
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
      if (!isWalkAble(desirePosition.col, desirePosition.row)) {
        return;
      }
      actionLock = true;
      moveToCell(player, desirePosition).then(() => {
        actionLock = false;
        player.setPosition(desirePosition);
        EventSystem.current.playerMoved(desirePosition);
      });
    }
  );
}

export default function createPlayer(scene: Phaser.Scene) {
  const player = new Player(scene);
  controlMovePlayer(player);
  return player;
}
