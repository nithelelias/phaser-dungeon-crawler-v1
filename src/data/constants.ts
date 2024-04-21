export const TILESIZE = 16;
export const HALF_TILESIZE = 8;

export const MAP_MAX_SIZE = {
  width: 20,
  height: 20,
};
export const FONTS = {
  font1: "arcade", // PRINCIPAL FOR LARGE CONTENT TEXTS
  font2: "miology", // FOR UI GENERAL
  font3: "oswald", // FOR NOTIFICAIONS
};
const color = (code: string) => {
  return { hexa: "#" + code, int: parseInt("0x" + code) };
};
export const COLORS = {
  black: color("000000"),
  white: color("ffffff"),
  red: color("EA340B"), 
  green: color("84C318"), 
  text: color("96BBBB"),
  primary: color("01161E"),
  primary2: color("022B3B"),
  secundary: color("96BBBB"),
  secundary2: color("A9C7C7"),
  accent: color("FF7700"),
  error: color("EA340B"),
  success: color("84C318"),
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

export const STATSALIAS: Record<string, string> = {
  hp: "hp",
  defense: "def",
  attack: "atk",
  evation: "ev",
  speed: "spd",
};

export const COLORSBYQUALITYLEVEL: Record<number, number> = {
  0: 0x889d9d,
  1: 0xffffff,
  2: 0x0070ff,
  3: 0xa335ee,
  4: 0xff8000,
  5: 0xe6cc80,
};
