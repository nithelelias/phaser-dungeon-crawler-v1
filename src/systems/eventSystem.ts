import { getInventoryVersion } from "../context/inventory";
import player from "../context/player";
import ROOMS from "../context/rooms";
import { getSkillVersion } from "../context/skills";
import { TCell } from "../types/types";

export default class EventSystem {
  static current: EventSystem;
  versioninfo = {
    inventory: 0,
    stats: 0,
    skills: 0,
    hp: 0,
    roomId: "",
  };
  binds: (() => void)[] = [];
  emitter: Phaser.Events.EventEmitter;
  constructor(scene: Phaser.Scene) {
    this.emitter = new Phaser.Events.EventEmitter();
    EventSystem.current = this;

    scene.events.once(
      "shutdown",
      () => {
        this.binds.forEach((unbindCallback) => {
          unbindCallback();
        });
        //this.game.events.off("update", this.dispatcher, this);
      },
      this
    );

    scene.events.on("update", this.dispatcher, this);
  }
  static create(scene: Phaser.Scene) {
   /*  if (EventSystem.current) {
      return EventSystem.current;
    } */
    return new EventSystem(scene);
  }
  __createListener(eventName: string, callback: (...args: any) => void) {
    this.emitter.on(eventName, callback);
    const unbind = () => this.emitter.off(eventName, callback);
    this.binds.push(unbind);
    return this.binds;
  }
  __emit(eventName: string, ...args: any) {
    this.emitter.emit(eventName, ...args);
  }
  dispatcher() {
    const currentVersion = {
      inventory: getInventoryVersion(),
      stats: player.getStatsVersion(),
      skills: getSkillVersion(),
      hp: player.getCurrentLife(),
      roomId: ROOMS.getCurrent()!.roomId,
    };
    if (this.versioninfo.inventory !== currentVersion.inventory) {
      this.__emit("inventoryUpdate");
      this.versioninfo.inventory = currentVersion.inventory;
    }
    if (this.versioninfo.hp !== currentVersion.hp) {
      this.__emit("lifeChange");
      this.versioninfo.hp = currentVersion.hp;
    }
    if (this.versioninfo.skills !== currentVersion.skills) {
      this.__emit("skillsUpdate");
      this.versioninfo.skills = currentVersion.skills;
    }
    if (this.versioninfo.stats !== currentVersion.stats) {
      this.__emit("statsUpdate");
      this.versioninfo.stats = currentVersion.stats;
    }
    if (this.versioninfo.roomId !== currentVersion.roomId) {
      this.__emit("roomChange");
      this.versioninfo.roomId = currentVersion.roomId;
    }
  }
  emitTurnEnd() {
    this.__emit("turnEnd");
  }
  onTurnEnd(callback: () => void) {
    return this.__createListener("turnEnd", callback);
  }
  playerMoved(position: TCell) {
    this.__emit("playerMoved", { position });
  }
  onPlayerMoved(callback: (position: TCell) => void) {
    return this.__createListener("playerMoved", callback);
  }
  playerLifeChange() {
    this.__emit("lifeChange");
  }
  onLifeChange(callback: () => void) {
    return this.__createListener("lifeChange", callback);
  }
  onInventoryUpdate(callback: () => void) {
    return this.__createListener("inventoryUpdate", callback);
  }
  onSkillsUpdate(callback: () => void) {
    return this.__createListener("skillsUpdate", callback);
  }
  onStatsUpdate(callback: () => void) {
    return this.__createListener("statsUpdate", callback);
  }
  onRoomChange(callback: () => void) {
    return this.__createListener("roomChange", callback);
  }
}
