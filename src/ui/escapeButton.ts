import { COLORS, FONTS } from "../data/constants";
const escapeButtonText = {
  idle: "Escape (spacebar)",
  escaping: "Escaping...",
};
export default class EscapeButton extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    onComplete: () => void
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.text = scene.add
      .text(0, 0, escapeButtonText.idle, {
        fontSize: 8,
        padding: { x: 8, y: 12 },
        fontFamily: FONTS.font1,
        color: COLORS.black.hexa,
        resolution: 8,
      })
      .setOrigin(0.5);

    this.setSize(this.text.width, this.text.height);

    const rect = scene.add
      .rectangle(0, 0, this.width, this.height, COLORS.primary.int)
      .setOrigin(0.5).setBlendMode(Phaser.BlendModes.EXCLUSION)
    const backgroundRect = scene.add
      .rectangle(0, 0, this.width, this.height, COLORS.white.int)
      .setOrigin(0.5);
    this.add([backgroundRect, rect, this.text]);
    let progress = 0;
    let escaping = false;
    this.setInteractive({ useHandCursor: true });
    const onPointerDown = () => {
      escaping = true;
      scene.input.once("pointerup", () => {
        escaping = false;
      });
    };
    const onKeyDown = () => {
      escaping = true;
      scene.input.keyboard!.once("keyup-SPACE", () => {
        escaping = false;
      });
    };
    const unbindAll = () => {
      this.off("pointerdown", onPointerDown);
      scene.input.keyboard!.off("keydown-SPACE", onKeyDown);
      scene.events.off("update", onUpdate);
    };
    const escapeComplete = () => {
      unbindAll()
      onComplete();
    };
    const onUpdate = () => {
      if (escaping) {
        progress += 0.05;
        this.text.setText(escapeButtonText.escaping);
      } else {
        progress -= 0.05;
        this.text.setText(escapeButtonText.idle);
      }
      progress = Phaser.Math.Clamp(progress, 0, 1);
      rect.setDisplaySize(this.width * progress, this.height);
      if (progress >= 1) {
        escapeComplete();
      }
    };

    this.on("pointerdown", onPointerDown);
    scene.input.keyboard!.on("keydown-SPACE", onKeyDown);
    scene.events.on("update", onUpdate);

    this.on("destroy", unbindAll);
  }
}
