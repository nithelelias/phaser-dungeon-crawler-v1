import moveBehavior from "../behaviors/moveBehavior";
import { HALF_TILESIZE, TILESIZE } from "../data/constants";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import { TCell } from "../types/types";
import { getCoordsOfCell, isWalkAble } from "../utils/functions";
import initController, { TKeyControlMap } from "./controller";

export class Player {
  scene: Phaser.Scene;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Sprite;
  position: TCell;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.position = { col: 0, row: 0 };
    this.sprite = scene.add
      .sprite(
        HALF_TILESIZE,
        TILESIZE,
        TILES.name,
        TILES.frames.charactes.default
      )
      .setOrigin(0.5, 1);
    this.container = scene.add.container(0, 0, [this.sprite]);
  }
  setPosition(position: TCell) {
    this.position = position;
    const coords = getCoordsOfCell(position.col, position.row);
    this.container.setPosition(coords.x, coords.y);
  }
}

function controlMovePlayer(player: Player) {
  let actionLock = false;
  const moveToCell = moveBehavior();
  return initController(player.scene, (keydown: TKeyControlMap) => {
    if (actionLock) return;
    const moved = keydown.left || keydown.right || keydown.up || keydown.down;
    if (!moved) {
      return;
    }
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
    if (
      desirePosition.col === player.position.col &&
      desirePosition.row === player.position.row
    ) {
      return;
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
  });
}

export default function createPlayer(scene: Phaser.Scene) {
  const player = new Player(scene);
  const unbindController = controlMovePlayer(player);
  scene.events.once("shutdown", unbindController);
  return player;
}
