// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
const WALL = 1;
class MazeBuilder {
  width: number;
  height: number;
  cols: number;
  rows: number;
  maze: any;
  entrance: any;
  exit: any;
  constructor(cols: number, rows: number) {
    this.width = Math.floor(cols / 2) - 1;
    this.height = Math.floor(rows / 2) - 1;

    this.cols = cols;
    this.rows = rows;

    this.maze = this.initArray(0);

    // place initial walls
    this.maze.forEach((row, r) => {
      row.forEach((cell, c) => {
        switch (r) {
          case 0:
          case this.rows - 1:
            this.maze[r][c] = WALL;
            break;

          default:
            if (r % 2 == 1) {
              if (c == 0 || c == this.cols - 1) {
                this.maze[r][c] = WALL;
              }
            } else if (c % 2 == 0) {
              this.maze[r][c] = WALL;
            }
        }
      });

      if (r == 0) {
        // place exit in top row
        let doorPos = this.posToSpace(this.rand(2, this.width - 2));
        this.maze[r][doorPos] = 0;
        this.exit = { col: doorPos, row: r };
      }

      if (r == this.rows - 1) {
        // place entrance in bottom row
        let doorPos = this.posToSpace(this.rand(2, this.width - 2));
        this.maze[r][doorPos] = 0;
        this.entrance = { col: doorPos, row: r };
      }
    });

    // start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1);
  }

  initArray(value) {
    return new Array(this.rows)
      .fill(null)
      .map(() => new Array(this.cols).fill(value));
  }

  rand(min, max) {
    return min + Math.floor(Math.random() * (1 + max - min));
  }

  posToSpace(x) {
    return 2 * (x - 1) + 1;
  }

  posToWall(x) {
    return 2 * x;
  }

  inBounds(r, c) {
    if (
      typeof this.maze[r] == "undefined" ||
      typeof this.maze[r][c] == "undefined"
    ) {
      return false; // out of bounds
    }
    return true;
  }

  shuffle(array) {
    // sauce: https://stackoverflow.com/a/12646864
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  partition(r1, r2, c1, c2) {
    // create partition walls
    // ref: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method

    let horiz, vert, x, y, start, end;

    if (r2 < r1 || c2 < c1) {
      return false;
    }

    if (r1 == r2) {
      horiz = r1;
    } else {
      x = r1 + 1;
      y = r2 - 1;
      start = Math.round(x + (y - x) / 4);
      end = Math.round(x + (3 * (y - x)) / 4);
      horiz = this.rand(start, end);
    }

    if (c1 == c2) {
      vert = c1;
    } else {
      x = c1 + 1;
      y = c2 - 1;
      start = Math.round(x + (y - x) / 3);
      end = Math.round(x + (2 * (y - x)) / 3);
      vert = this.rand(start, end);
    }

    for (let i = this.posToWall(r1) - 1; i <= this.posToWall(r2) + 1; i++) {
      for (let j = this.posToWall(c1) - 1; j <= this.posToWall(c2) + 1; j++) {
        if (i == this.posToWall(horiz) || j == this.posToWall(vert)) {
          this.maze[i][j] = WALL;
        }
      }
    }

    let gaps = this.shuffle([true, true, true, false]);

    // create gaps in partition walls

    if (gaps[0]) {
      let gapPosition = this.rand(c1, vert);
      this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] = 0;
    }

    if (gaps[1]) {
      let gapPosition = this.rand(vert + 1, c2 + 1);
      this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] =0;
    }

    if (gaps[2]) {
      let gapPosition = this.rand(r1, horiz);
      this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] =0;
    }

    if (gaps[3]) {
      let gapPosition = this.rand(horiz + 1, r2 + 1);
      this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] =0;
    }

    // recursively partition newly created chambers

    this.partition(r1, horiz - 1, c1, vert - 1);
    this.partition(horiz + 1, r2, c1, vert - 1);
    this.partition(r1, horiz - 1, vert + 1, c2);
    this.partition(horiz + 1, r2, vert + 1, c2);
  }

  isGap(...cells) {
    return cells.every((array) => {
      let row, col;
      [row, col] = array;
      if (this.maze[row][col].length > 0) {
        if (!this.maze[row][col].includes("door")) {
          return false;
        }
      }
      return true;
    });
  }

  countSteps(array, r, c, val, stop) {
    if (!this.inBounds(r, c)) {
      return false; // out of bounds
    }

    if (array[r][c] <= val) {
      return false; // shorter route already mapped
    }

    if (!this.isGap([r, c])) {
      return false; // not traversable
    }

    array[r][c] = val;

    if (this.maze[r][c].includes(stop)) {
      return true; // reached destination
    }

    this.countSteps(array, r - 1, c, val + 1, stop);
    this.countSteps(array, r, c + 1, val + 1, stop);
    this.countSteps(array, r + 1, c, val + 1, stop);
    this.countSteps(array, r, c - 1, val + 1, stop);
  }
}

export default function generateMaze(width: number, height: number) {
  const mazeBuilder = new MazeBuilder(width, height);
  return {
    entrance: mazeBuilder.entrance,
    exit: mazeBuilder.exit,
    walls: mazeBuilder.maze,
  };
}
