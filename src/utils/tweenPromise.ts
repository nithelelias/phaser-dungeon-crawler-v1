import Phaser from "phaser";
export function tweenPromise(
  gameObjectTargets:
    | Phaser.GameObjects.GameObject
    | Phaser.GameObjects.GameObject[],
  tweenConfig:
    | Phaser.Types.Tweens.TweenBuilderConfig
    | Phaser.Types.Tweens.TweenChainBuilderConfig
    | Phaser.Tweens.Tween
    | Phaser.Tweens.TweenChain
    | any
) {
  return new Promise((resolve) => {
    const targets: Phaser.GameObjects.GameObject[] = Array.isArray(
      gameObjectTargets
    )
      ? gameObjectTargets
      : [gameObjectTargets];
    const scene: Phaser.Scene = targets[0].scene;
    scene.tweens.add({
      targets,
      ...tweenConfig,
      onComplete: () => {
        resolve(1);
      },
    } as any);
  });
}
