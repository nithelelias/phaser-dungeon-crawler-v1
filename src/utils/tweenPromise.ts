import Phaser from "phaser";
type TTweenTarget =
  | Phaser.GameObjects.GameObject
  | Phaser.GameObjects.GameObject[];

type TTweenConfig =
  | Phaser.Types.Tweens.TweenBuilderConfig
  | Phaser.Types.Tweens.TweenChainBuilderConfig
  | Phaser.Tweens.Tween
  | Phaser.Tweens.TweenChain
  | any;
export function tweenPromise(
  gameObjectTargets: TTweenTarget,
  tweenConfig: TTweenConfig
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

export function tweenChainPromise(
  gameObjectTargets: TTweenTarget,
  props: TTweenConfig
) {
  return new Promise((resolve) => {
    const targets: Phaser.GameObjects.GameObject[] = Array.isArray(
      gameObjectTargets
    )
      ? gameObjectTargets
      : [gameObjectTargets];
    const scene: Phaser.Scene = targets[0].scene;
    scene.tweens.chain({
      targets,
      ...props,
      onComplete: resolve,
    });
  });
}
