function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
type TValuePair = [any, number];
const createArrayOptions = (
  values: TValuePair[] = [],
  totalMax: number
): any[] => {
  if (isNaN(totalMax)) throw new Error("totalMax must be a number");
  if (totalMax < 1) throw new Error("totalMax must be greater than 0");
  if (values.length === 0) throw new Error("values must be greater than 0");

  const options: number[] = new Array(totalMax).fill(0);
  const avaibleIndx = options.map((_, idx) => idx);

  values.forEach((item) => {
    const [value, weight] = item as TValuePair;
    for (let i = 0; i < weight; i++) {
      const rndIdx = avaibleIndx.splice(
        random(0, avaibleIndx.length - 1),
        1
      )[0];
      options[rndIdx] = value;
    }
  });

  return options;
};
function sumTableValues(values: TValuePair[]) {
  return values.map((row) => row[1]).reduce((a, b) => a + b);
}
export default function MemoryWeightRandom(
  _values: TValuePair[] = [
    ["valor1", 10],
    ["valor2", 2],
    ["valor3", 1],
  ]
) {
  let values = [..._values];
  let totalMax = sumTableValues(values);
  let currentOptions: any[] = [];
  const create = () => {
    currentOptions = createArrayOptions(values, totalMax);
  };
  const getRandom = () => {
    if (currentOptions.length === 0) create();

    const rndIdx = random(0, currentOptions.length - 1);
    const returnValue = currentOptions.splice(rndIdx, 1)[0];

    return returnValue;
  };

  const set = (newValues: TValuePair[]) => {
    totalMax = sumTableValues(newValues);
    values = [...newValues];
    create();
  };
  return {
    set,
    getRandom,
  };
}
