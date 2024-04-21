import { TCell, TEntity } from "../types/types";
import { getCoordsOfCell } from "../utils/functions";
import { tweenChainPromise, tweenPromise } from "../utils/tweenPromise";

export default function moveBehavior() {
  let swing = 1;

  return async (entity: TEntity, targetPosition: TCell) => {
    const coords = getCoordsOfCell(targetPosition.col, targetPosition.row);
    swing *= -1;
    const anim1 = tweenPromise([entity.container], {
      targets: [entity.container],

      x: coords.x,
      y: coords.y,
      duration: 120,
      ease: "linear",
    });
    const anim2 = tweenPromise([entity.sprite], {
      targets: [entity.sprite],
      angle: swing * 4,
      y: entity.sprite.y - 2,
      duration: 120,
      yoyo: true,
      ease: "sine",
    });

    await Promise.all([anim1, anim2]);
  };
}
