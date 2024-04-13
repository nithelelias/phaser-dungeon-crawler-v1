import Room from "../components/room";
import { TCell, TEntity } from "../types/types";
import { tweenPromise } from "../utils/tweenPromise";

export default async function moveToCell(entity: TEntity, targetPosition: TCell) {
  
  const coords = Room.getCoordsOfCell(targetPosition.col, targetPosition.row);
  await tweenPromise([entity.sprite], {
    targets: [entity.sprite],
    x: coords.x,
    y: coords.y,
    duration: 120,
    ease: "quint.in",
  });
}
