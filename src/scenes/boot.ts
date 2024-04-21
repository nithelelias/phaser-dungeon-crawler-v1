import { initCsvTextRaw } from "../context/text";
import { TILES } from "../data/resources";
import preloaderProgressBar from "../ui/preloader-progress-bar";
const GLOBAL = window as any;
export default class Boot extends Phaser.Scene {
  static onEnd = () => {
    `Override This to start your main scene`;
  };
  constructor() {
    super({ key: "boot" });
  }
  preload() {
    preloaderProgressBar(this);
    this.load.text("text", "resources/texts.csv");
    this.load.image("divider000", "resources/divider-000.png");
    this.load.image("divider001", "resources/divider-001.png");
    this.load.image("divider003", "resources/divider-003.png");
    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
    this.load.script("webfont", "resources/webfont.js");
  }

  create() {
    initCsvTextRaw(this.cache.text.get("text"));
    GLOBAL.WebFont.load({
      custom: {
        families: ["arcade", "oswald", "miology"],
      },
      active: () => {
        this.completed();
      },
    });
  }
  completed() {
    Boot.onEnd();
  }
}
