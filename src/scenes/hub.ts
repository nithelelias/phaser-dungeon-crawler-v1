import player from "../context/player";
import ROOMS from "../context/rooms";
import { $t, getLang, getLangList, setLang } from "../context/text";
import { COLORS } from "../data/constants";
import EventSystem from "../systems/eventSystem";
import Button from "../ui/button";
import Divider from "../ui/divider";
import EquipementList from "../ui/equipmentList";
import ProgressBar from "../ui/progressBar";
import SkillPanelList from "../ui/skillPanelList";
import StatsPanel from "../ui/statsPanel";

const store = { langs: [""] };

export default class Hub extends Phaser.Scene {
  constructor() {
    super({ key: "hub" });
  }
  preload() {
    if (store.langs.length === 1) {
      store.langs = getLangList();
    }
  }
  create() {
    new Divider(this, 180, 100, $t("STATS"));
    const statsPanel = new StatsPanel(this, 30, 90);

    new Divider(this, 180, statsPanel.y + statsPanel.height + 10, $t("SKILLS"));
    new SkillPanelList(this, 30, statsPanel.y + statsPanel.height + 40);

    new Divider(this, this.scale.width - 200, 100, $t("EQUIPEMENT"));
    new EquipementList(this, this.scale.width - 300, 130);

    this.createRoomInfo();
    this.createLifeBar();

    new Button(this, this.scale.width - 64, 32, getLang(), () => {
      const lang = store.langs.shift();
      if (!lang) return;
      store.langs.push(lang);
      setLang(lang);
      this.scene.restart();
    });
  }
  createRoomInfo() {
    const info = new Divider(
      this,
      this.scale.width / 2,
      30,
      $t("Floor 1 $caveName1")
    );
    EventSystem.current.onRoomChange(() => {
      info.setText($t(ROOMS.getCurrent()!.roomId));
    });
  }
  createLifeBar() {
    const w = 160;
    const h = 28;
    const characterName = "Bob";
    const lifeBar = new ProgressBar(
      this,
      this.scale.width / 2 - w / 2,
      70 - h / 2,
      w,
      h,

      COLORS.red.int,
      COLORS.black.int
    );
    const dividerLife = new Divider(
      this,
      this.scale.width / 2,
      70,
      "Bob HP 10/10"
    ).setTexture("divider001");
    EventSystem.current.onLifeChange(() => {
      const life = player.getCurrentLife();
      const maxlife = player.getMaxLife();
      dividerLife.setText(`${characterName} HP ${life}/${maxlife}`);
      lifeBar.setValue((life / maxlife) * 100);
    });
  }
}
