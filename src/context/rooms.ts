import { TMapData } from "../types/types";

const STORE: Record<string, TMapData> = {};
const CURRENT: { room: TMapData | null } = { room: null };
const ROOMS = { addRoom, getRoom, setCurrent, getCurrent };
const WORLD: Record<string, number> = {};
function addRoom(roomId: string, room: TMapData, level = 1) {
  STORE[roomId] = room;
  WORLD[roomId] = level;
}
function getRoom(roomId: string): TMapData | null {
  if (!STORE.hasOwnProperty(roomId)) {
    return null;
  }
  return STORE[roomId];
}
function setCurrent(roomId: string) {
  CURRENT.room = getRoom(roomId);
  return CURRENT.room;
}
function getCurrent() {
  return CURRENT.room;
}
export function getWorldLevel() {
  if (!CURRENT.room) {
    return 0;
  }
  return WORLD[CURRENT.room!.roomId];
}
export default ROOMS;
