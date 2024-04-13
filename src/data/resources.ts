import { TMapData, TMapTiles } from "../types/types";

export const TILES = {
  name: "tiles",
  src: "./resources/maptile.png",
  config: { frameWidth: 16, frameHeight: 16 },
  frames: {
    blocked: 0,
    charactes:{
      default:399
    }
  },
  
};

export const MAPS: Record<string, TMapTiles> = {
  floor1: {
    ground: [262, 263, 264, 265],
    walls: [[377], [339], [359], [357]],
    corners: [338, 340, 359, 357],
    blocks: [243, 246],
  },
};
