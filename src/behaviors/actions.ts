
import { TCell, TEntity } from "../types/types";
import { getCoordsOfCell } from "../utils/functions";
import { tweenPromise } from "../utils/tweenPromise";

export async function moveToCell(entity: TEntity, targetPosition: TCell) {
  const coords = getCoordsOfCell(targetPosition.col, targetPosition.row);
  await tweenPromise([entity.sprite], {
    targets: [entity.sprite],
    x: coords.x,
    y: coords.y,
    duration: 120,
    ease: "back.out",
  });
}
