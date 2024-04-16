import { EQUIPEMENT, ITEM, TConsumable, TEquipment } from "../types/types";

const invEquipment: Record<EQUIPEMENT, TEquipment | null> = {
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
}
export function getEquipment() {
  return { ...invEquipment };
}
export function addConsumable(item: TConsumable) {
  if (!invConsumables[item.name]) {
    invConsumables[item.name] = 0;
  }
  invConsumables[item.name] += 1;
}

export function consumeItem(itemName: string) {
  if (!invConsumables[itemName] || invConsumables[itemName] < 1) {
    return false;
  }
  invConsumables[itemName]--;
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
}
