export const TILESIZE = 16;
export const HALF_TILESIZE = 8;

export const MAP_MAX_SIZE = {
  width: 20,
  height: 20,
};
export const FONTS = {
  font1: "arcade",
  font2: "oswald",
};
const color = (code: string) => {
  return { hexa: "#" + code, int: parseInt("0x" + code) };
};
export const COLORS = {
  black: color("000000"),
  white: color("ffffff"),
  red: color("e74645"),
  primary: color("fb8500"),
  primary2: color("ffb703"),
  secundary: color("8ecae6"),
  secundary2: color("219ebc"),
  dark: color("023047"),
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
