import player from "../context/player";
import { $t } from "../context/text";
import { COLORS, FONTS } from "../data/constants";
import EventSystem from "../systems/eventSystem";

export default class StatsPanel extends Phaser.GameObjects.Container {
  statsVersion: number = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const statsText = scene.add
      .text(0, 40, ["HP", "ATACK", "DEFENSE", "SPEED", "EVASION"], {
        color: COLORS.white.hexa,
        fontSize: 16,
        fontFamily: FONTS.font1,
        lineSpacing: 20,
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0);
    const rect = scene.add
      .rectangle(0, 0, 300, 230, COLORS.primary2.int, 0.1)
      .setOrigin(0);
    rect.postFX.addShine(COLORS.white.int, 1, 0.1, false);
    this.setSize(rect.width, rect.height);
    this.add([rect, statsText]);
    this.update();

    EventSystem.current.onStatsUpdate(this.update.bind(this));
  }
  update() {
    const stats = player.getCalcStats();
    const statsText = this.getAt(1) as Phaser.GameObjects.Text;
    statsText.setText([
      `${$t("HP")}: ${stats.hp}`,
      `${$t("ATACK")}: ${stats.attack}`,
      `${$t("DEFENSE")}: ${stats.defense}`,
      `${$t("SPEED")}: ${stats.speed}`,
      `${$t("EVASION")}: ${stats.evation}`,
    ]);
  }
}
