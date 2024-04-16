export default function waitTime(scene: Phaser.Scene, delay: number = 100) {
  return new Promise((resolve) => {
    scene.time.addEvent({
      delay,
      callback: () => resolve(true),
    });
  });
}
