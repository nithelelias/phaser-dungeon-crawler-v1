import { getSkillSet, getSkillVersion } from "../context/skills";
import EventSystem from "../systems/eventSystem";
import PanelSkill from "./panelSkill";

export default class SkillPanelList extends Phaser.GameObjects.Container {
  skillVersion: number = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    scene.add.existing(this);
    this.add([]);
    this.updateList();
    EventSystem.current.onSkillsUpdate(this.updateList.bind(this));
  }
  updateList() {
    const skillVersion = getSkillVersion();
    if (this.skillVersion === skillVersion) return;
    const yGap = 90;
    const skillSet = getSkillSet();
    this.skillVersion = skillVersion + 0;
    skillSet.forEach((skill, idx) => {
      if (idx >= this.length) {
        this.add(new PanelSkill(this.scene, 0, idx * yGap, skill));
      } else {
        const panelSkill = this.list[idx] as PanelSkill;
        panelSkill.setSkill(skill);
      }
    });
  }
}
