export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }
  create() {
    this.add.text(100, 100, "Game Scene");
  }
}
