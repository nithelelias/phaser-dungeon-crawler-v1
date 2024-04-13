import Room from "../components/room";

const STORE: Record<string, Room> = {};
const ROOMS = { addRoom, getRoom };

function addRoom(roomId: string, room: Room) {
  STORE[roomId] = room;
}
function getRoom(roomId: string) {
  if (!STORE.hasOwnProperty(roomId)) {
    return null;
  }
  return STORE[roomId];
}
export default ROOMS;
