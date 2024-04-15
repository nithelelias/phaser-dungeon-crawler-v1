import { TILES } from "../data/resources";
import { TDataEntity } from "../types/types";

export default class BEntity extends Phaser.GameObjects.Container {
  sprite: Phaser.GameObjects.Sprite;
  info: TDataEntity;
  targets: BEntity[] = [];
  lifeValue: number = 0;

  isEnemy = true;
  constructor(scene: Phaser.Scene, x: number, y: number, info: TDataEntity) {
    super(scene, x, y);
    scene.add.existing(this);
    this.lifeValue = info.hp + 0;
    this.info = info;
    this.sprite = scene.add.sprite(0, 0, TILES.name, info.texture);
    this.add(this.sprite);
  }
  setTarget(targets: BEntity[]) {
    this.targets = targets;
    return this;
  }
  pushTarget(target: BEntity) {
    this.targets.push(target);
    return this;
  }

  hit(damage: number) {
    this.lifeValue -= damage;
    if (this.lifeValue <= 0) {
      this.lifeValue = 0;

      //   this.destroy();
      this.sprite.setTint(0x111111);
      this.sprite.setFlipY(true);
    }
  }
}
