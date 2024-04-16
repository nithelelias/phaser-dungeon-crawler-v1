import { TILES } from "../data/resources";
import { STATUSEFFECTS, TDataEntity } from "../types/types";
import LifeBar from "../ui/lifeBar";
import MemoryWeightRandom from "../utils/memoryWeightRandom";
import { tweenPromise } from "../utils/tweenPromise";

export default class BEntity extends Phaser.GameObjects.Container {
  sprite: Phaser.GameObjects.Sprite;
  info: TDataEntity;
  targets: BEntity[] = [];
  lifeValue: number = 0;
  statusEffect: Record<STATUSEFFECTS, number> = {
    [STATUSEFFECTS.POISON]: 0,
    [STATUSEFFECTS.BLEED]: 0,
    [STATUSEFFECTS.STUN]: 0,
    [STATUSEFFECTS.BURN]: 0,
  };
  skills: [string, number][] = [];
  isEnemy = true;
  lifeBar: LifeBar;
  evationRate: {
    set: (newValues: [any, number][]) => void;
    getRandom: () => any;
  };
  constructor(scene: Phaser.Scene, x: number, y: number, info: TDataEntity) {
    super(scene, x, y);
    scene.add.existing(this);
    this.lifeValue = info.stats.hp + 0;
    this.info = info;
    this.lifeBar = new LifeBar(scene, -8, -12, info.stats.hp, info.stats.hp);
    this.sprite = scene.add.sprite(0, 0, TILES.name, info.texture);
    this.add([this.sprite, this.lifeBar]);
    this.evationRate = MemoryWeightRandom([
      [true, info.stats.evasion],
      [false, 100 - info.stats.evasion],
    ]);
  }
  setTarget(targets: BEntity[]) {
    this.targets = targets;
    return this;
  }
  pushTarget(target: BEntity) {
    this.targets.push(target);
    return this;
  }
  triggerEvation(): boolean {
    return this.evationRate.getRandom();
  }
  addStatusEffect(status: STATUSEFFECTS, value = 1) {
    this.statusEffect[status] += value;
  }
  isStun() {
    return this.statusEffect[STATUSEFFECTS.STUN] > 0;
  }
  isAlive() {
    return this.lifeValue > 0;
  }

  recoverHp(value: number) {
    this.lifeValue = Math.min(this.info.stats.hp, this.lifeValue + value);
    this.lifeBar.setValue(this.lifeValue);
  }
  async hit(damage: number) {
    const hplost = Math.max(0, this.lifeValue - damage);
    this.lifeValue -= damage;
    await this.shake();

    if (this.lifeValue <= 0) {
      this.lifeValue = 0;
      //   this.destroy();
      this.sprite.setTint(0x111111);
      this.sprite.setFlipY(true);
    }
    this.lifeBar.setValue(this.lifeValue);
    return hplost;
  }
  async shake() {
    this.sprite.setTint(0xffffff);

    await tweenPromise(this.sprite, {
      x: "-=4",
      delay: 100,
      duration: 60,
      tint: 0xff0000,
      ease: "back.inOut",
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        this.sprite.clearTint();
      },
    });
  }
}
