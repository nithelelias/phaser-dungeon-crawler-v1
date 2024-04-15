export default class EndGame extends Phaser.Scene {
  constructor() {
    super("endgame");
  }
  create({ win }: { win: boolean }) {
    const bg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      0x111111,
      0.8
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Battle " + (win ? "WIN" : "PLAYER DIED"),
        {
          fontSize: 48,
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: bg,
      duration: 1000,
      alpha: 1,
      onComplete: () => {
        this.cameras.main.fadeOut(1000);
        setTimeout(() => {
          this.scene.stop();
          this.scene.stop("game");
          this.scene.start("intro");
        }, 1500);
        setTimeout(() => {}, 2000);
      },
    });
  }
}
