import { TMapTiles } from "../types/types";

export const TILES = {
  name: "tiles",
  src: "./resources/maptile.png",
  config: { frameWidth: 16, frameHeight: 16 },
  frames: {
    blocked: 0,
    __WHITE: 29,
    charactes: {
      default: 399,
    },
  },
};

export const MAPS: Record<string, TMapTiles> = {
  floor1: {
    ground: [262, 263, 264, 265],
    walls: [[377], [339], [359], [357]],
    corners: [338, 340, 359, 357],
    blocks: [243, 246],
  },
  floor2: {
    ground: [224, 225, 226, 227],
    walls: [[434], [396], [416], [414]],
    corners: [395, 397, 416, 414],
    blocks: [205, 227],
  },
  floor3: {
    ground: [148, 149, 150, 151],
    walls: [[129], [129], [129], [129]],
    corners: [129, 129, 129, 129],
    blocks: [129, 132],
  },
};
