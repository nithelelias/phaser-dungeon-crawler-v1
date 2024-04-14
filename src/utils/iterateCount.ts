export default function iterateCount(
  num: number,
  callback: (idx: number) => void
) {
  for (let i = 0; i < num; i++) {
    callback(i);
  }
}
