import { SKILLS, TSkillValue } from "../types/types";
import random from "../utils/random";

const dataVersion = {
  version: 1,
};
const skillSet: TSkillValue[] = []; //[["regen", 1]];

export function getSkillSet(): TSkillValue[] {
  return [...skillSet];
}

export function resetSkillSet() {
  dataVersion.version = 1;
  skillSet.splice(0, skillSet.length);
}

export function addSkill(skillName: SKILLS, initValue = 0, initChance = 0) {
  let willAdd = true;
  const value = initValue || random(1, 20) / 10;
  const chance = initChance || random(1, 5);
  for (let i = 0; i < skillSet.length; i++) {
    if (skillSet[i].name === skillName) {
      willAdd = false;
      skillSet[i].value += value;
      skillSet[i].chance = Math.min(100, skillSet[i].chance + chance);
      break;
    }
  }
  if (willAdd) {
    skillSet.push({
      name: skillName,
      value,
      chance,
    });
  }
  dataVersion.version += 1;
}
export function getSkillVersion() {
  return dataVersion.version;
}
