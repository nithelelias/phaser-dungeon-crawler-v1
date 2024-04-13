import Phaser from "phaser";
import "./style.css";
import GameScene from "./scenes/game";

new Phaser.Game({
  width: 1440,
  height: 720,
  type: Phaser.AUTO,
  parent: "app",
  scale: {
    mode: Phaser.Scale.FIT, 
  },
  scene: [GameScene],
});
