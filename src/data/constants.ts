export const TILESIZE = 16;

export const MAP_MAX_SIZE = {
  width: 20,
  height: 20,
};
export const FONTS = {
  font1: "arcade",
  font2: "oswald",
};
const color = (hexa: string, int: number) => {
  return { hexa, int };
};
export const COLORS = {
  black: color("#000000", 0x000000),
  white: color("#ffffff", 0xffffff),
  primary: color("#48d6d2", 0x48d6d2),
  secundary: color("#fefcbf", 0xfefcbf),
};
export const BATTLE_MOBS_ZONES: Record<number, { x: number; y: number }[]> = {
  1: [
    {
      x: 0,
      y: 0,
    },
  ],
  2: [
    {
      x: 0,
      y: -50,
    },
    {
      x: 0,
      y: 50,
    },
  ],
  3: [
    {
      x: 0,
      y: -50,
    },
    {
      x: 30,
      y: 0,
    },
    {
      x: 0,
      y: 50,
    },
  ],
  4: [
    {
      x: 0,
      y: -50,
    },
    {
      x: 50,
      y: -30,
    },
    {
      x: 50,
      y: 30,
    },
    {
      x: 0,
      y: 50,
    },
  ],
  5: [
    {
      x: 0,
      y: -50,
    },
    {
      x: 50,
      y: -30,
    },
    {
      x: 50,
      y: 30,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 50,
    },
  ],
};

export const CONTROLS: Record<string, string> = {
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
  ArrowUp: "up",
  w: "up",
  ArrowDown: "down",
  s: "down",
  space: "action",
};
