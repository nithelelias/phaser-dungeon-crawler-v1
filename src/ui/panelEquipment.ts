import {
  COLORS,
  COLORSBYQUALITYLEVEL,
  FONTS,
  STATSALIAS,
} from "../data/constants";
import { TILES } from "../data/resources";
import { TEquipment } from "../types/types";

export default class PanelEquipment extends Phaser.GameObjects.Container {
  item: TEquipment | null;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    item: TEquipment | null
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.item = item;

    const icon = scene.add
      .image(20, 20, TILES.name, TILES.frames.__EMPTY)
      .setOrigin(0)
      .setScale(3);
    const labelTitle = scene.add.text(60, 10, `equipment title`, {
      color: COLORS.white.hexa,
      fontSize: 18,
      fontFamily: FONTS.font2,
      padding: { x: 20, y: 12 },
    });
    const labelStats = scene.add.text(60, 34, `equipment stats`, {
      color: COLORS.white.hexa,
      fontSize: 14,
      fontFamily: FONTS.font1,
      padding: { x: 20, y: 12 },
    });
    const iconBg = scene.add
      .rectangle(20, 20, 48, 48, COLORS.white.int, 0.8)
      .setOrigin(0);
    const rect = scene.add
      .rectangle(0, 0, 300, 90, COLORS.primary2.int, 0.3)
      .setOrigin(0);
   // rect.setStrokeStyle(2, COLORS.white.int);
    this.setSize(rect.width, rect.height);
    this.add([rect, iconBg, icon, labelTitle, labelStats]);
    this.update();
  }
  setItem(item: TEquipment | null) {
    this.item = item;
    this.update();
  }
  update(): void {
    const iconBg = this.list[1] as Phaser.GameObjects.Rectangle;
    const icon = this.list[2] as Phaser.GameObjects.Image;
    const text = this.list[3] as Phaser.GameObjects.Text;
    const textstats = this.list[4] as Phaser.GameObjects.Text;
    if (this.item === null) {
      icon.setFrame(TILES.frames.__EMPTY);
      text.setText(`x`);
      return;
    }
    const item = this.item!;
    const statsText = Object.keys(item.stats).map((key) => {
      return `${STATSALIAS[key.toLowerCase() as string] || key}: ${
        item.stats[key]
      }`;
    });
    iconBg.fillColor = COLORSBYQUALITYLEVEL[item.quality];
    icon.setFrame(this.item.texture);
    text.setText(this.item.name.toUpperCase());
    textstats.setText([statsText.join(" ")]);
  }
}
