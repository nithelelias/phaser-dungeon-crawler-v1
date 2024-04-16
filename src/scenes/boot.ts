import { TILES } from "../data/resources";
import preloaderProgressBar from "../ui/preloader-progress-bar";
const GLOBAL = window as any;
export default class Boot extends Phaser.Scene {
  static onEnd = () => {`Override This to start your main scene`};
  constructor() {
    super({ key: "boot" });
  }
  preload() {
    preloaderProgressBar(this);

    this.load.spritesheet(TILES.name, TILES.src, TILES.config);
    this.load.script("webfont", "resources/webfont.js");
  }

  create() {
    GLOBAL.WebFont.load({
      custom: {
        families: ["arcade", "oswald"],
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
