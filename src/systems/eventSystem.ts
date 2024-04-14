import { TCell } from "../types/types";

export default class EventSystem {
  static current: EventSystem;
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    EventSystem.current = this;
  }
  static create(scene: Phaser.Scene) {
    return new EventSystem(scene);
  }
  __createListener(eventName: string, callback: (...args: any) => void) {
    this.scene.events.on(eventName, callback);
    return () => this.scene.events.off(eventName, callback);
  }
  emitTurnEnd() {
    this.scene.events.emit("turnEnd");
  }
  onTurnEnd(callback: () => void) {
    return this.__createListener("turnEnd", callback);
  }
  playerMoved(position: TCell) {
    this.scene.events.emit("playerMoved", { position });
  }
  onPlayerMoved(callback: (position: TCell) => void) {
    return this.__createListener("playerMoved", callback);
  }
}
