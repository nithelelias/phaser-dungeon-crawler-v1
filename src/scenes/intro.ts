import player from "../context/player";
import { COLORS, FONTS } from "../data/constants";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("intro");
  }
  create() {
    player.reset();
    this.add
      .text(this.scale.width / 2, 300, "Hey Bob!", {
        fontFamily: FONTS.font2,
        fontSize: 50,
        color: COLORS.text.hexa,
      })
      .setOrigin(0.5);
    setTimeout(() => {
      this.scene.start("game");
    }, 1000);
  }
}
