export interface ITurnAction {
  name: string;
  speed: number;
  readyValue: number;
  action: () => Promise<null | void>;
}
export default class TurnManager {
  active: boolean = true;
  queue: ITurnAction[] = [];
  rounds: number = 0;

  addToQueue(action: ITurnAction) {
    action.readyValue = 0;
    this.queue.push(action);
  }
  __onTurnEndCallback() {}
  onTurnEnd(callbackValidate: () => void) {
    this.__onTurnEndCallback = callbackValidate;
  }
  stop() {
    this.active = false;
  }
  nextTurn() {
    this.rounds++;
    this.__onTurnEndCallback();
    if (!this.active) {
      return;
    }

    setTimeout(() => {
      this.idleState();
    }, 1);
  }
  idleState() {
    let active = true;
    while (active) {
      for (let i in this.queue) {
        this.queue[i].readyValue += this.queue[i].speed;
        
        if (this.queue[i].readyValue >= 100) {
          this.queue[i].readyValue = 0;
          const turnAction = this.queue[i];
          active = false;
          setTimeout(() => {
            this.actionState(turnAction);
          }, 1);

          break;
        }
      }
    }
  }
  actionState(turnAction: ITurnAction) {
    turnAction.action().then(() => {
      this.nextTurn();
    });
  }
}
