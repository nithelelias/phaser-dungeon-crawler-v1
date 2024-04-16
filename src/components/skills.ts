import { TILES } from "../data/resources";
import { STATUSEFFECTS } from "../types/types";
import iterateCount from "../utils/iterateCount";
import random from "../utils/random";
import { tweenPromise } from "../utils/tweenPromise";
import BEntity from "./battleEntity";
type TSkyllArgs = {
  damage: number;
  hplost: number;
  skillValue: number;
  entity: BEntity;
  target: BEntity;
};
export const DAMAGE_OVERTIME_SKILLS = [
  STATUSEFFECTS.POISON,
  STATUSEFFECTS.BLEED,
  STATUSEFFECTS.BURN,
];
export const EFFECT_SKILL_ICONS = {
  [STATUSEFFECTS.POISON]: TILES.frames.effects.poison,
  [STATUSEFFECTS.BLEED]: TILES.frames.effects.bleed,
  [STATUSEFFECTS.BURN]: TILES.frames.effects.burn,
  [STATUSEFFECTS.STUN]: TILES.frames.effects.stun,
  regen: TILES.frames.effects.heal,
  block: TILES.frames.effects.block,
};
export enum ACTION_SKILLS {
  repeat = "repeat",
  block = "block",
  regen = "regen",
  counter = "counter",
}
export const OFFENSIVE_SKILLS: Record<
  string,
  (args: TSkyllArgs) => Promise<any>
> = {
  vampirism,
  poison,
  bleed,
  stun,
  burn,
  projectile,
};
export async function vampirism(args: TSkyllArgs) {
  // steal hp from target and recover that hp
  const hpToRecover = args.hplost * (args.skillValue / 100);
  console.log(hpToRecover);
  args.entity.recoverHp(hpToRecover);

  await popIconEffectAtBattleEntity(args.entity, EFFECT_SKILL_ICONS.regen);
}
export async function poison(args: TSkyllArgs) {
  args.target.addStatusEffect(STATUSEFFECTS.POISON, args.skillValue);
  await popIconEffectAtBattleEntity(
    args.target,
    EFFECT_SKILL_ICONS[STATUSEFFECTS.POISON]
  );
}

export async function bleed(args: TSkyllArgs) {
  args.target.addStatusEffect(STATUSEFFECTS.BLEED, args.skillValue);
  await popIconEffectAtBattleEntity(
    args.target,
    EFFECT_SKILL_ICONS[STATUSEFFECTS.BLEED]
  );
}

export async function stun(args: TSkyllArgs) {
  const willStun = random(0, 100) <= args.skillValue;
  if (!willStun) return false;
  args.target.addStatusEffect(STATUSEFFECTS.STUN, args.skillValue);
  await popIconEffectAtBattleEntity(
    args.target,
    EFFECT_SKILL_ICONS[STATUSEFFECTS.STUN]
  );
  return true;
}
export async function burn(args: TSkyllArgs) {
  args.target.addStatusEffect(STATUSEFFECTS.BURN, args.skillValue);
  await popIconEffectAtBattleEntity(
    args.target,
    EFFECT_SKILL_ICONS[STATUSEFFECTS.BURN]
  );
}
function shotProjectile(entity: BEntity, target: BEntity) {
  const difX = target.x - entity.x;

  const path = new Phaser.Curves.Path(entity.x, entity.y);
  const points: Phaser.Math.Vector2[] = [
    new Phaser.Math.Vector2(
      entity.x + Math.floor(difX / 2),
      target.y + random(16, 48)
    ),
    new Phaser.Math.Vector2(target.x, target.y),
  ];
  path.splineTo(points);
  const projectile = entity.scene.add
    .follower(
      path,
      entity.x,
      entity.y,
      TILES.name,
      TILES.frames.projectile.default
    )
    .setScale(0.5);
  entity.parentContainer.add(projectile);
  return new Promise((resolve) => {
    projectile.startFollow({
      positionOnPath: true,
      duration: 300,
      rotateToPath: true,
      onComplete: () => {
        projectile.stopFollow();
        projectile.destroy();
        resolve(1);
      },
    });
  });
}
export async function projectile(args: TSkyllArgs) {
  // shot projectiles to random targets
  const aliveTargets = args.entity.targets.filter((target) => {
    return target.lifeValue > 0;
  });
  if (aliveTargets.length === 0) {
    return;
  }
  ///
  const projectileDamage = 1;
  const promises: Promise<any>[] = [];
  const maxTargetsIdx = aliveTargets.length - 1;
  iterateCount(args.skillValue, () => {
    const target = aliveTargets[random(0, maxTargetsIdx)];

    promises.push(
      shotProjectile(args.entity, target).then(() => {
        target.hit(projectileDamage);
        return 1;
      })
    );
  });

  await Promise.all(promises);
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
