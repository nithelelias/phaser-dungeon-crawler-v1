import { COLORS, FONTS } from "../data/constants";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("intro");
  }
  create() {
    this.add
      .text(this.scale.width / 2, 300, "Hey Bob!", {
        fontFamily: FONTS.font1,
        fontSize: 50,
        color: COLORS.primary.hexa,
      })
      .setOrigin(0.5);
    setTimeout(() => {
      this.scene.start("game");
    }, 1000);
  }
}
