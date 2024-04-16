import { CONTROLS } from "../data/constants";

export type TKeyControlMap = Record<string, boolean>;
function keyListen(event: KeyboardEvent) {
  const keymap: TKeyControlMap = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  if (CONTROLS.hasOwnProperty(event.key)) {
    const direction = CONTROLS[event.key.toString()];
    keymap[direction] = true;
  }
  return keymap;
}

export default function initController(
  scene: Phaser.Scene,
  callback: (keyMap: TKeyControlMap, event: KeyboardEvent) => void
) {
  let pressed = false;
  const last: {
    event: KeyboardEvent | null;
  } = {
    event: null,
  };
  const onKeyDown = (event: KeyboardEvent) => {
    pressed = true;
    last.event = event;
    scene.events.once("pause", () => {
      pressed = false;
    });
    scene.input.keyboard?.once("keyup", () => {
      pressed = false;
    });
  };
  const onEnterframe = () => {
    if (pressed && last.event) {
      callback(keyListen(last.event), last.event);
    }
  };
  scene.events.on("update", onEnterframe);
  scene.input.keyboard?.on("keydown", onKeyDown);
  return () => {
    scene.input.keyboard?.off("keydown", onKeyDown);
    scene.events.off("update", onEnterframe);
  };
}
