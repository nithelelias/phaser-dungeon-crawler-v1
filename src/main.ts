import Phaser from "phaser";
import "./style.css";
import GameScene from "./scenes/game";
import MapToolScene from "./scenes/maptool";
import BattleScene from "./scenes/battle";
import Boot from "./scenes/boot";
import EndGame from "./scenes/endGame";
import IntroScene from "./scenes/intro";
import Hub from "./scenes/hub";

const game = new Phaser.Game({
  /* width: 1440,
  height: 720, */
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  parent: "app",
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [Boot, IntroScene, GameScene, BattleScene, EndGame, Hub, MapToolScene],
});
Boot.onEnd = () => {
  game.scene.start("intro");
};
