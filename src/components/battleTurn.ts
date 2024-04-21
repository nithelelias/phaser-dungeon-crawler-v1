import { COLORS } from "../data/constants";
import {
  popIconEffectAtBattleEntity,
  popTextAtBattleEntity,
} from "../tweens/popUp";
import { SKILLS, STATUSEFFECTS, TSkillValue } from "../types/types";
import waitTime from "../ui/waitTime";
import random from "../utils/random";
import { tweenPromise } from "../utils/tweenPromise";
import BEntity from "./battleEntity";
import {
  DAMAGE_OVERTIME_SKILLS,
  EFFECT_SKILL_ICONS,
  OFFENSIVE_SKILLS,
} from "./skills";

export default function createBattleTurn(entity: BEntity) {
  const spawnPosition = { x: entity.x + 0, y: entity.y + 0 };

  return async () => {
    await triggerTurnStart(entity);

    if (!entity.isAlive()) {
      return null;
    }
    if (entity.isStun()) {
      return null;
    }
    const target = getBestTarget(entity);
    if (target) {
      // put next to target
      await putNextToTarget(entity, target);
      await attack(entity, target);
      await goToSpawn(entity, spawnPosition.x, spawnPosition.y);
    }

    await triggerTurnEnd(entity);
    await waitTime(entity.scene, 300);
  };
}

function getBestTarget(entity: BEntity) {
  const aliveTargets = entity.targets.filter((target) => {
    return target.lifeValue > 0;
  });

  if (aliveTargets.length === 0) {
    return null;
  }
  return aliveTargets.sort((targetA, targetB) => {
    return targetA.lifeValue - targetB.lifeValue;
  })[0];
}
async function putNextToTarget(entity: BEntity, target: BEntity) {
  const dirx = target.x > entity.x ? -1 : 1;
  const y = target.y;
  const x = target.x + 30 * dirx;
  await tweenPromise(entity, { x, y, duration: 200, ease: "quint.in" });
}

async function attackAnimation(entity: BEntity, target: BEntity) {
  const dirx = target.x > entity.x ? -1 : 1;
  await tweenPromise(entity, {
    x: target.x + 10 * dirx,
    y: target.y,
    duration: 200,
    ease: "back.in",
    yoyo: true,
    hold: 100,
  });
}
async function evadeAnimation(entity: BEntity, target: BEntity) {
  const dirx = target.x > entity.x ? -1 : 1;
  await tweenPromise(target, {
    x: target.x + 10 * dirx,
    y: target.y,
    duration: 200,
    ease: "back.in",
    yoyo: true,
    hold: 100,
  });
}
async function attack(entity: BEntity, target: BEntity) {
  let timesToAttack = 1;
  const repeatSkills = entity.skills
    .filter((skill) => {
      return skill.name === SKILLS.repeat && calcChanceToUseSkill(skill);
    })
    .shift();

  if (repeatSkills) {
    timesToAttack = Math.floor(repeatSkills.value);
  }
  while (timesToAttack > 0) {
    if (!target.isAlive()) {
      return;
    }
    const animationPromise = attackAnimation(entity, target);
    const evade = target.triggerEvation();
    if (evade) {
      console.log("evaded!");
      await evadeAnimation(entity, target);
    } else {
      const damage = await calcDamageAfterBlock(
        target,
        calculateDamage(entity, target)
      );

      if (damage > 0) {
        const hplost = await target.hit(damage);
        await applyOffensiveSkills(damage, hplost, entity, target);
      } else {
        popTextAtBattleEntity(target, "blocked", COLORS.red.hexa);
      }
      await executeCounterIfHas(target, entity);
      await waitTime(entity.scene, 200);
    }
    await animationPromise;
    timesToAttack--;
  }
}

function calculateDamage(entity: BEntity, target: BEntity) {
  const attack = entity.info.stats.attack;
  const defense = target.info.stats.defense;
  const damage =
    attack > defense ? attack - defense : attack === defense ? 1 : 0;
  return damage;
}

async function applyOffensiveSkills(
  damage: number,
  hplost: number,
  entity: BEntity,
  target: BEntity
) {
  const skills: TSkillValue[] = entity.skills;
  const totalSkills = skills.length;
  for (let i = 0; i < totalSkills; i++) {
    const skill = skills[i];

    if (OFFENSIVE_SKILLS.hasOwnProperty(skill.name)) {
      const skillFn = OFFENSIVE_SKILLS[skill.name];

      if (calcChanceToUseSkill(skill)) {
        await skillFn({
          damage,
          hplost,
          skillValue: skill.value,
          entity,
          target,
        });
      }
    }
  }
}

async function goToSpawn(entity: BEntity, x: number, y: number) {
  await tweenPromise(entity, {
    x,
    y,
    duration: 200,
    ease: "quint.in",
  });
}

async function triggerTurnStart(entity: BEntity) {
  const skillKeys = Object.keys(entity.statusEffect);
  for (let i = 0; i < skillKeys.length; i++) {
    const status = skillKeys[i] as STATUSEFFECTS;
    if (entity.statusEffect[status as STATUSEFFECTS] > 0) {
      await executeSatusEffect(entity, status as STATUSEFFECTS);
    }
  }
  // execute regen if has to
  await executeRegenIfHas(entity);
}

async function triggerTurnEnd(entity: BEntity) {
  Object.keys(entity.statusEffect).forEach((status) => {
    entity.statusEffect[status as STATUSEFFECTS] = Math.max(
      0,
      entity.statusEffect[status as STATUSEFFECTS] - 1
    );
  });
}
async function executeSatusEffect(entity: BEntity, status: STATUSEFFECTS) {
  if (DAMAGE_OVERTIME_SKILLS.includes(status)) {
    popIconEffectAtBattleEntity(entity, EFFECT_SKILL_ICONS[status]);
    await entity.hit(1);
  }
}

async function executeCounterIfHas(entity: BEntity, target: BEntity) {
  if (!entity.isAlive()) {
    return;
  }
  const skills = entity.skills;
  const skill = skills.find((skill) => skill.name === SKILLS.counter);
  if (skill && calcChanceToUseSkill(skill)) {
    attackAnimation(entity, target);
    const damage = calculateDamage(entity, target);
    await target.hit(damage);
  }
}

async function calcDamageAfterBlock(entity: BEntity, damage: number) {
  if (!entity.isAlive()) {
    return damage;
  }
  const skills = entity.skills;
  const skill = skills.find((skill) => skill.name === SKILLS.block);

  if (skill && calcChanceToUseSkill(skill)) {
    popIconEffectAtBattleEntity(entity, EFFECT_SKILL_ICONS.block);
    return Math.max(0, damage - skill.value);
  }

  return damage;
}

async function executeRegenIfHas(entity: BEntity) {
  if (!entity.isAlive()) {
    return false;
  }
  const skills = entity.skills;
  const skill = skills.find((skill) => skill.name === SKILLS.regen);

  if (skill && calcChanceToUseSkill(skill)) {
    entity.recoverHp(skill.value);
    await popIconEffectAtBattleEntity(entity, EFFECT_SKILL_ICONS.regen);
  }

  return false;
}

function calcChanceToUseSkill(skill: TSkillValue) {
  return skill && skill.chance >= random(0, 100);
}
