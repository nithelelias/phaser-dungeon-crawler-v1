import { TILES } from "../data/resources";

export default class MapToolScene extends Phaser.Scene {
  constructor() {
    super({ key: "maptool" });
  }
  preload() {
    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
  }
  create() { 
    this.cameras.main.setZoom(1.5)
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x111111, 0.8)
      .setOrigin(0);
    const tiles = this.textures.get(TILES.name);
    const cols = tiles.source[0].width / TILES.config.frameWidth;
    const rows = tiles.source[0].height / TILES.config.frameHeight;

    const totalFrames = cols * rows;
    const container = this.add.container(
      this.scale.width / 2 - tiles.source[0].width / 2,
      this.scale.height / 2 - tiles.source[0].height / 2,
      []
    );
    let row = 0;
    let col = 0;
    let i = 0;
    const rect = this.add
      .rectangle(
        0,
        0,
        TILES.config.frameWidth,
        TILES.config.frameHeight,
        0xfff000,
        0.5
      )
      .setOrigin(0);
    const text = this.add.text(this.scale.width / 2, 100, "ON:");
    for (let i = 0; i < totalFrames; i++) {
      if (col >= cols) {
        row++;
        col = 0;
      }
      //console.log(col, row);
      const x = col * TILES.config.frameWidth,
        y = row * TILES.config.frameHeight;
      const img = this.add
        .image(
          x,
          y,

          TILES.name,
          i
        )
        .setOrigin(0)
        .setInteractive({ cursor: "pointer" })
        .on("pointerover", () => {
          rect.setPosition(x, y);
          text.setText("ON:" + i);
        })
        .on("pointerdown", () => {
          console.log(i);
          text.setText("ON:" + i);
        });
      container.add(img);
      col++;
    }
    container.add(rect);
    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.stop(); 
    });
  }
}
