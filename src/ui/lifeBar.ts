import { COLORS } from "../data/constants";
import ProgressBar from "./progressBar";

export default class LifeBar extends Phaser.GameObjects.Container {
  bar: ProgressBar;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    value: number,
    maxValue: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.bar = new ProgressBar(
      scene,
      0,
      0,
      16,
      4,

      COLORS.red.int,
      COLORS.black.int
    );
    this.add(this.bar);
    this.bar.max = maxValue;
    this.bar.progress = value;
  }
  setValue(value: number) {
    this.bar.setProgress(value);
  }
  getValue() {
    return this.bar.progress;
  }
}
