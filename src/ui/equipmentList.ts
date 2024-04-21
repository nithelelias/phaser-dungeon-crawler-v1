import { getEquipment, getInventoryVersion } from "../context/inventory";
import EventSystem from "../systems/eventSystem";
import { EQUIPEMENT } from "../types/types";
import PanelEquipment from "./panelEquipment";
const equipmentOrder = [
  EQUIPEMENT.HELMET,
  EQUIPEMENT.ARMOR,
  EQUIPEMENT.WEAPON,
  EQUIPEMENT.SHIELD,
  EQUIPEMENT.RING,
  EQUIPEMENT.AMULET,
];
export default class EquipementList extends Phaser.GameObjects.Container {
  inventoryVersion: number = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.add([
      new PanelEquipment(scene, 0, 0, null),
      new PanelEquipment(scene, 0, 0, null),
      new PanelEquipment(scene, 0, 0, null),
      new PanelEquipment(scene, 0, 0, null),
      new PanelEquipment(scene, 0, 0, null),
      new PanelEquipment(scene, 0, 0, null),
    ]);
    this.updateList();
    EventSystem.current.onInventoryUpdate(this.updateList.bind(this));
  }
  updateList() {
    const inversion = getInventoryVersion();
    const scene = this.scene;
    const yGap = 90;
    if (this.inventoryVersion === inversion) return;
    this.inventoryVersion = inversion;
    equipmentOrder
      .map((equipementType: EQUIPEMENT, idx: number) => {
        const equipItem = this.list[idx] as PanelEquipment;
        equipItem.setItem(getEquipment()[equipementType]);
        equipItem.setVisible(equipItem.item ? true : false);
        return equipItem;
      })
      .filter((equipItem) => equipItem.item !== null)
      .forEach((equipItem, idx: number) => {
        scene.tweens.add({
          targets: equipItem,
          y: idx * yGap,
          duration: 500,
          ease: "Power2",
        });
      });
  }
}
