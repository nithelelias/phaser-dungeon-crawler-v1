import BEntity from "../components/battleEntity";
import { COLORS, FONTS, TILESIZE } from "../data/constants";
import { TILES } from "../data/resources";
import { tweenChainPromise, tweenPromise } from "../utils/tweenPromise";

export async function popIconUp(
  scene: Phaser.Scene,
  coords: { x: number; y: number },
  iconTexture: number
) {
  const halfTiLe = TILESIZE / 2;
  const container = scene.add
    .container(coords.x + halfTiLe, coords.y + halfTiLe, [
      scene.add.sprite(0, 0, TILES.name, iconTexture),
    ])
    .setScale(0.2)
    .setAlpha(0);
  await tweenPromise(container, {
    y: coords.y - halfTiLe,
    scale: 1,
    alpha: 1,
    duration: 100,
    ease: "sine.out",
    hold: 500,
  });
  await tweenPromise(container, {
    y: coords.y - TILESIZE * 2,
    scale: 1,
    alpha: 0,
    duration: 200,
    ease: "sine.out",
  });
  container.destroy();
}

export async function popIconEffectAtBattleEntity(
  entity: BEntity,
  iconEffect: number
) {
  const scene = entity.scene;
  const icon = scene.add
    .sprite(entity.x, entity.y - 4, TILES.name, iconEffect)
    .setScale(0.2)
    .setAlpha(0);

  entity.parentContainer.add(icon);
  await tweenPromise(icon, {
    y: entity.y - 16,
    scale: 1,
    alpha: 1,
    duration: 100,
    ease: "sine.out",
    hold: 100,
  });
  await tweenPromise(icon, {
    y: entity.y - 60,
    scale: 1,
    alpha: 0,
    duration: 200,
    ease: "sine.out",
  });
  icon.destroy();
}

export async function popTextAtBattleEntity(
  entity: BEntity,
  datatext: string[] | string,
  color = COLORS.white.hexa
) {
  const scene = entity.scene;
  const text = scene.add
    .text(entity.x, entity.y - 4, datatext, {
      color: color,
      fontSize: 8,
      fontFamily: FONTS.font1,
    })
    .setScale(0.2);

  entity.parentContainer.add(text);
  await tweenChainPromise(text, {
    tweens: [
      {
        y: entity.y - 32,
        scale: 1,
        duration: 100,
        ease: "sine.in",
        hold: 300,
      },
      {
        y: entity.y - 60,
        alpha: 0,
        duration: 1000,
        ease: "quint.out",
      },
    ],
  });

  text.destroy();
}
