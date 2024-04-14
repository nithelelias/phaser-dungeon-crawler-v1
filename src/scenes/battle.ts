export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("battle");
  }
  create({ callback }: { callback: () => void }) {
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x111111, 0.8)
      .setOrigin(0);

    this.add.text(100, 100, "Battle Scene");

    setTimeout(() => {
      this.scene.stop();
      callback();
    }, 5000);
  }
}
