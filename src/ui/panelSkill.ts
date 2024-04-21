import { $t } from "../context/text";
import { COLORS, FONTS } from "../data/constants";
import { TILES } from "../data/resources";
import { TSkillValue } from "../types/types";

export default class PanelSkill extends Phaser.GameObjects.Container {
  skillInfo: TSkillValue | null;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    skillInfo: TSkillValue | null
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.skillInfo = skillInfo;

    const icon = scene.add
      .image(20, 20, TILES.name, TILES.frames.__EMPTY)
      .setOrigin(0)
      .setScale(3);
    const labelTitle = scene.add.text(60, 10, `skill title`, {
      color: COLORS.white.hexa,
      fontSize: 18,
      fontFamily: FONTS.font2,
      padding: { x: 20, y: 12 },
    });
    const labelvalue = scene.add.text(60, 34, `skill 1`, {
      color: COLORS.white.hexa,
      fontSize: 14,
      fontFamily: FONTS.font1,
      padding: { x: 20, y: 12 },
    });
    const labelChance = scene.add.text(200, 16, `skill 2`, {
      color: COLORS.white.hexa,
      fontSize: 32,
      fontFamily: FONTS.font1,
      padding: { x: 20, y: 12 },
    });

    const rect = scene.add
      .rectangle(0, 0, 300, 90, COLORS.primary2.int, 0.3)
      .setOrigin(0);
    // rect.setStrokeStyle(2, COLORS.white.int);
    this.setSize(rect.width, rect.height);
    this.add([rect, icon, labelTitle, labelvalue, labelChance]);
    this.update();
  }
  setSkill(skillInfo: TSkillValue | null) {
    this.skillInfo = skillInfo;
    this.update();
  }
  updateText(innerText: Phaser.GameObjects.Text, newText: string) {
    if (innerText.text !== newText) {
      const color1 = Phaser.Display.Color.HexStringToColor(COLORS.white.hexa);
      const color2 = Phaser.Display.Color.HexStringToColor(COLORS.accent.hexa);

      // 0 - .5 => 0 =100%
      // .5- 1 => 100% - 0
      const tween = this.scene.tweens.add({
        targets: innerText,
        scale: 1.4,
        duration: 200,
        yoyo: true,
        ease: "sine.out",
        onUpdate: () => {
          const p =
            tween.progress < 0.5 ? tween.progress * 2 : 1 - tween.progress;
          const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            color1,
            color2,
            1,
            p
          );
          const hex = Phaser.Display.Color.RGBToString(
            color.r,
            color.g,
            color.b
          );
          innerText.setColor(hex);
        },
      });
    }
    innerText.setText(newText);
  }
  update(): void {
    const icon = this.list[1] as Phaser.GameObjects.Image;
    const text = this.list[2] as Phaser.GameObjects.Text;
    const value = this.list[3] as Phaser.GameObjects.Text;
    const chance = this.list[4] as Phaser.GameObjects.Text;
    if (this.skillInfo === null) {
      icon.setFrame(TILES.frames.__EMPTY);
      text.setText(`x`);
      return;
    }
    const skillInfo = this.skillInfo!;

    icon.setFrame(TILES.frames.skills[skillInfo.name]);
    text.setText($t(skillInfo.name.toUpperCase()));

    this.updateText(value, skillInfo.value.toFixed(1) + "pts");
    this.updateText(chance, skillInfo.chance + "%");
  }
}
