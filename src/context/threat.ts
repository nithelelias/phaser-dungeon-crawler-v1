const WORLDTHREAT = {
  current: 0,
};

function getCurrent() {
  return WORLDTHREAT.current;
}

function increase() {
  WORLDTHREAT.current++;
}
function decrease() {
  WORLDTHREAT.current--;
}
function reset() {
  WORLDTHREAT.current = 0;
}
export default {
  getCurrent,
  increase,
  decrease,
  reset,
};
