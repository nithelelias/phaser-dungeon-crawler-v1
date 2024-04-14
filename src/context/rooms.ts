import { TMapData } from "../types/types";

const STORE: Record<string, TMapData> = {};
const CURRENT: { room: TMapData | null } = { room: null };
const ROOMS = { addRoom, getRoom, setCurrent, getCurrent };

function addRoom(roomId: string, room: TMapData) {
  STORE[roomId] = room;
}
function getRoom(roomId: string): TMapData | null {
  if (!STORE.hasOwnProperty(roomId)) {
    return null;
  }
  return STORE[roomId];
}
function setCurrent(roomId: string) {
  CURRENT.room = getRoom(roomId);
  return CURRENT.room
}
function getCurrent() {
  return CURRENT.room;
}
export default ROOMS;
