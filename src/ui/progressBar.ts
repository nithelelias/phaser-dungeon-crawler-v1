import { COLORS } from "../data/constants";

export default class ProgressBar extends Phaser.GameObjects.Container {
  progress: number = 0;
  max: number = 100;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number = 100,
    height: number = 32,
    color: number = COLORS.secundary.int,
    backcolor: number = COLORS.primary.int
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setSize(width, height);
    const backRect = scene.add
      .rectangle(0, 0, width, height, backcolor, 1)
      .setOrigin(0);
    const progressRect = scene.add
      .rectangle(0, 0, width, height, color, 1)
      .setOrigin(0);
    this.add([backRect, progressRect]);
  }
  setProgress(progress: number) {
    this.progress = progress;
    this.update();
  }
  update(): void {
    const progressRect = this.list[1] as Phaser.GameObjects.Rectangle;
    const progress = this.progress / this.max;
   
    progressRect.setDisplaySize(this.width * progress, this.height);
  }
}
