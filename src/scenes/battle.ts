import BEntity from "../components/battleEntity";
import createBattleTurn from "../components/battleTurn";
import player from "../context/player";
import { getSkillSet } from "../context/skills";
import { BATTLE_MOBS_ZONES, COLORS, FONTS } from "../data/constants";
import { TILES } from "../data/resources";
import EventSystem from "../systems/eventSystem";
import TurnManager, { ITurnAction } from "../systems/turnSystem";
import { TDataEntity } from "../types/types";
import EscapeButton from "../ui/escapeButton";

type TCallbackProps = {
  escaped: boolean;
  win: boolean;
};
export interface IBattleProps {
  callback: ({ win, escaped }: TCallbackProps) => void;
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

    //this.cameras.main.setZoom(2);
    const turnManager = new TurnManager();
    const escapeButton = new EscapeButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2 + 300,

      () => {
        turnManager.stop();
        this.escapeBattle();
      }
    );
    const entityList: { entity: BEntity; turnInfo: ITurnAction }[] = [];
    const entitysContainer = this.add
      .container(this.scale.width / 2, this.scale.height / 2)
      .setScale(3);
    this.createEntities().forEach((entity: BEntity) => {
      const turnInfo = {
        name: entity.info.name,
        speed: entity.info.stats.speed + 0,
        readyValue: 0,
        action: createBattleTurn(entity),
      };
      entityList.push({ entity, turnInfo });
      turnManager.addToQueue(turnInfo);

      entitysContainer.add(entity);
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
        escapeButton.destroy();
        this.endBattle(true);
        turnManager.stop();
      }
      if (totalPlayersEntities === 0) {
        escapeButton.destroy();
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

    const playerData: TDataEntity = {
      name: "Player",
      texture: TILES.frames.charactes.default,
      stats: player.getCalcStats(),
    };

    const playerEntity = new BEntity(this, -100, 0, playerData);
    playerEntity.skills = getSkillSet();
    playerEntity.onHit = () => {
      player.setCurrentLife(playerEntity.lifeValue);
      EventSystem.current.playerLifeChange();
    };
    playerEntity.isEnemy = false;
    const zones = BATTLE_MOBS_ZONES[Math.min(5, mobs.length)];
    const entityList = [playerEntity];
    mobs.forEach((data: TDataEntity, idx: number) => {
      const offset = zones[idx];
      const mobEntity = new BEntity(this, offset.x, offset.y, data);
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
        fontFamily: FONTS.font1,
        color: COLORS.white.hexa,
        align: "center",
      })
      .setOrigin(0.5);
    setTimeout(() => {
      this.returnToWorld({ win: false, escaped: true });
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
          fontFamily: FONTS.font3,
        }
      )
      .setOrigin(0.5);
    setTimeout(() => {
      this.returnToWorld({ win, escaped: false });
    }, 2500);
  }
  returnToWorld(args: TCallbackProps) {
    this.scene.stop();
    this.battleProps?.callback(args);
  }
}
