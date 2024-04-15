import { COLORS, FONTS } from "../data/constants";

export default class Button extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.text = scene.add
      .text(0, 0, text, {
        fontSize: 16,
        padding: { x: 20, y: 20 },
        fontFamily: FONTS.font1,
        color: COLORS.black.hexa,
        backgroundColor: COLORS.white.hexa,
      })
      .setOrigin(0.5);
    this.add(this.text);
    this.setSize(this.text.width, this.text.height);
    this.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.setScale(0.89);
      scene.input.once("pointerup", () => {
        this.setScale(1);
      });
      this.once("pointerup", () => {
        onClick();
      });
    });
  }
}
