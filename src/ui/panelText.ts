import { COLORS, FONTS } from "../data/constants";

export default class PanelText extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[]
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    const label = scene.add.text(0, 0, text, {
      color: COLORS.white.hexa,
      fontSize: 32,
      fontFamily: FONTS.font2,
      padding: { x: 20, y: 12 },
    });
    const rect = scene.add
      .rectangle(0, 0, label.width, label.height, COLORS.primary2.int, 0.1)
      .setOrigin(0);
    //rect.setStrokeStyle(2, COLORS.white.int);
    this.setSize(rect.width, rect.height);
    this.add([rect, label]);
  }
}
