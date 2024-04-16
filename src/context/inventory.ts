import { EQUIPEMENT, TEquipment } from "../types/types";

const invEquipment: Record<EQUIPEMENT, TEquipment | null> = {
  [EQUIPEMENT.WEAPON]: null,
  [EQUIPEMENT.SHIELD]: null,
  [EQUIPEMENT.HELMET]: null,
  [EQUIPEMENT.ARMOR]: null,
  [EQUIPEMENT.RING]: null,
  [EQUIPEMENT.AMULET]: null,
};

export function setEquipment(type: EQUIPEMENT, item: TEquipment | null) {
  invEquipment[type] = item;
}
export function getEquipment() {
  return { ...invEquipment };
}
