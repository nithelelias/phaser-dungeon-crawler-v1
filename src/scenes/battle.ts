import BEntity from "../components/battleEntity";
import player from "../context/player";
import { BATTLE_MOBS_ZONES, COLORS, FONTS } from "../data/constants";
import { TILES } from "../data/resources";
import TurnManager, { ITurnAction } from "../systems/turnSystem";
import { TDataEntity } from "../types/types";
import EscapeButton from "../ui/escapeButton";
import { tweenPromise } from "../utils/tweenPromise";

function createBattleTurn(entity: BEntity) {
  const spawnPosition = { x: entity.x + 0, y: entity.y + 0 };
  const putNextToTarget = async (target: BEntity) => {
    const dirx = target.x > entity.x ? -1 : 1;
    const y = target.y;
    const x = target.x + 30 * dirx;
    await tweenPromise(entity, { x, y, duration: 200, ease: "quint.in" });
  };
  const attack = async (target: BEntity) => {
    await attackAnimation(target);
    const damage = entity.info.attack;
    target.hit(damage);
  };
  const attackAnimation = async (target: BEntity) => {
    const dirx = target.x > entity.x ? -1 : 1;
    tweenPromise(entity, {
      x: target.x + 10 * dirx,
      y: target.y,
      duration: 200,
      ease: "back.in",
      yoyo: true,
      hold: 100,
    });
    await tweenPromise(target, {
      x: target.x - 10 * dirx,
      delay: 100,
      duration: 60,
      ease: "back.inOut",
      repeat: 3,
      yoyo: true,
    });
  };
  const returnToSpawn = async () => {
    await tweenPromise(entity, {
      x: spawnPosition.x,
      y: spawnPosition.y,
      duration: 200,
      ease: "quint.in",
    });
  };
  return async () => {
    const aliveTargets = entity.targets.filter((target) => {
      return target.lifeValue > 0;
    });
    if (aliveTargets.length === 0) {
      return null;
    }

    const target = aliveTargets.sort((targetA, targetB) => {
      return targetA.lifeValue - targetB.lifeValue;
    })[0];

    // put next to target
    await putNextToTarget(target);
    await attack(target);

    await returnToSpawn();
  };
}

export interface IBattleProps {
  callback: () => void;
  mobs: TDataEntity[];
}
export default class BattleScene extends Phaser.Scene {
  battleProps: IBattleProps | null = null;
  constructor() {
    super("battle");
  }
  create(battleProps: IBattleProps) {
    this.battleProps = battleProps;
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x111111, 0.8)
      .setOrigin(0);

    this.cameras.main.setZoom(2);
    const turnManager = new TurnManager();
    const escapeButton = new EscapeButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2 + 100,

      () => {
        turnManager.stop();
        this.escapeBattle();
      }
    );
    const entityList: { entity: BEntity; turnInfo: ITurnAction }[] = [];
    this.createEntities().forEach((entity: BEntity) => {
      const turnInfo = {
        name: entity.info.name,
        speed: entity.info.speed + 0,
        readyValue: 0,
        action: createBattleTurn(entity),
      };
      entityList.push({ entity, turnInfo });
      turnManager.addToQueue(turnInfo);
    });

    turnManager.onTurnEnd(() => {
      let totalEnemiesEntities = 0;
      let totalPlayersEntities = 0;
      // validate if win or end
      entityList.forEach(({ entity, turnInfo }) => {
        if (entity.lifeValue > 0) {
          if (entity.isEnemy) {
            totalEnemiesEntities++;
          } else {
            totalPlayersEntities++;
          }
        } else {
          turnInfo.speed = 0;
        }
      });
      if (totalEnemiesEntities === 0) {
        escapeButton.destroy()
        this.endBattle(true);
        turnManager.stop();
      }
      if (totalPlayersEntities === 0) {
        escapeButton.destroy()
        this.endBattle(false);
        turnManager.stop();
      }
    });
    turnManager.nextTurn();
  }
  createEntities() {
    if (!this.battleProps) {
      return [];
    }
    const { mobs } = this.battleProps;
    const center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2,
    };
    const playerData: TDataEntity = {
      name: "Player",
      texture: TILES.frames.charactes.default,
      ...player.getStats(),
    };
    const playerEntity = new BEntity(
      this,
      center.x - 100,
      center.y,
      playerData
    );
    playerEntity.isEnemy = false;
    const zones = BATTLE_MOBS_ZONES[Math.min(5, mobs.length)];
    const entityList = [playerEntity];
    mobs.forEach((data: TDataEntity, idx: number) => {
      const offset = zones[idx];
      const mobEntity = new BEntity(
        this,
        center.x + offset.x,
        center.y + offset.y,
        data
      );
      mobEntity.setTarget([playerEntity]);
      playerEntity.pushTarget(mobEntity);
      entityList.push(mobEntity);
    });

    return entityList;
  }
  escapeBattle() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      0x111111,
      0.8
    );
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Battle ESCAPED", {
        fontSize: 48,
        fontFamily: FONTS.font2,
        color: COLORS.white.hexa,
        align: "center",
      })
      .setOrigin(0.5);
    setTimeout(() => {
      this.returnToWorld();
    }, 2500);
  }
  endBattle(win: boolean) {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      0x111111,
      0.8
    );
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Battle " + (win ? "WIN" : "LOSE"),
        {
          fontSize: 48,
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);
    setTimeout(() => {
      this.returnToWorld();
    }, 2500);
  }
  returnToWorld() {
    this.scene.stop();
    this.battleProps?.callback();
  }
}
