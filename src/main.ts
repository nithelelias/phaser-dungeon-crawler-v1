import Phaser from "phaser";
import "./style.css";
import GameScene from "./scenes/game";
import MapToolScene from "./scenes/maptool";
import BattleScene from "./scenes/battle";

new Phaser.Game({
  width: 1440,
  height: 720,
  type: Phaser.AUTO,
  parent: "app",
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [GameScene, BattleScene, MapToolScene],
});
