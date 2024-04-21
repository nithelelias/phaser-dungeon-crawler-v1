import { COLORS, FONTS } from "../data/constants";

export default class Divider extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[]
  ) {
    super(scene, x, y, []);
    scene.add.existing(this);

    const label = scene.add
      .text(0, 0, text, {
        fontSize: 24,
        fontFamily: FONTS.font2,
        color: COLORS.white.hexa,
        padding: { x: 20, y: 0 },
      })
      .setOrigin(0.5);
    this.add([
      scene.add.image(-label.width / 2, 0, "divider003").setOrigin(1, 0.5),
      scene.add
        .image(label.x + label.width / 2, 0, "divider003")
        .setFlipX(true)
        .setOrigin(0, 0.5),
      label,
    ]);
    const divider2 = this.getAt(0) as Phaser.GameObjects.Image;
    this.setSize(divider2.x + divider2.width, label.height);
  }
  setTexture(textureName: string) {
    (this.getAt(0) as Phaser.GameObjects.Image).setTexture(textureName);
    (this.getAt(1) as Phaser.GameObjects.Image).setTexture(textureName);
    return this;
  }
  setText(text: string | string[]) {
    const label = this.getAt(2) as Phaser.GameObjects.Text;
    const imgLeft = this.getAt(0) as Phaser.GameObjects.Image;
    const imgRight = this.getAt(1) as Phaser.GameObjects.Image;
    label.setText(text);
    imgLeft.x = -label.width / 2;
    imgRight.x = label.x + label.width / 2;
    return this;
  }
}
