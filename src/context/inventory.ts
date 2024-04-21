import { EQUIPEMENT, ITEM, TConsumable, TEquipment } from "../types/types";
import player from "./player";
const inventoryVersion = {
  version: 1,
};
const invEquipment: Record<EQUIPEMENT | string, TEquipment | null> = {
  [EQUIPEMENT.WEAPON]: null,
  [EQUIPEMENT.SHIELD]: null,
  [EQUIPEMENT.HELMET]: null,
  [EQUIPEMENT.ARMOR]: null,
  [EQUIPEMENT.RING]: null,
  [EQUIPEMENT.AMULET]: null,
};
const invConsumables: Record<string, number> = {};
export function setEquipment(type: EQUIPEMENT, item: TEquipment | null) {
  invEquipment[type] = item;
  inventoryVersion.version++;
}
export function getEquipment() {
  return { ...invEquipment };
}
export function addConsumable(item: TConsumable) {
  if (!invConsumables[item.name]) {
    invConsumables[item.name] = 0;
  }
  invConsumables[item.name] += 1;
  inventoryVersion.version++;
}

export function consumeItem(itemName: string) {
  if (!invConsumables[itemName] || invConsumables[itemName] < 1) {
    return false;
  }
  invConsumables[itemName]--;
  inventoryVersion.version++;
  return true;
}
export function addToInventory(itemHolder: {
  type: ITEM;
  item: TEquipment | TConsumable;
}) {
  if (itemHolder.type === ITEM.EQUIPEMENT) {
    const item = itemHolder.item as TEquipment;
    setEquipment(item.type, item);
  }
  if (itemHolder.type === ITEM.CONSUMABLE) {
    const item = itemHolder.item as TConsumable;
    addConsumable(item);
  }
  player.runCalcStats();
}
export function getInventoryVersion() {
  return inventoryVersion.version;
}
export function resetInventory() {
  inventoryVersion.version = 1;
  Object.keys(invEquipment).forEach((key) => {
    invEquipment[key as EQUIPEMENT] = null;
  });
  Object.keys(invConsumables).forEach((key) => {
    delete invConsumables[key];
  });
}
