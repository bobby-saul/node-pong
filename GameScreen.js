const ScreenInterface = require("./ScreenInterface");
const settings = require("./settings");
const PLAY_TO = 11;

class GameScreen extends ScreenInterface {
  constructor(process) {
    super(process);
    this.name = "GameScreen";
    this.players = 2;
    this.resetGame();
  }

  resetGame() {
    this.p1 = {
      direction: 0,
      position: Math.floor(settings.MIN_ROW / 2),
      score: 0,
    };
    this.p2 = {
      direction: 0,
      position: Math.floor(settings.MIN_ROW / 2),
      score: 0,
    };
    this.ball = {
      x: Math.floor(settings.MIN_COLUMN / 2),
      y: Math.floor(settings.MIN_ROW / 2),
      direction: Math.random() > 0.5 ? 1 : -1,
      vertical: 0,
    };
    this.setCpuPosition();
    this.rallyCount = 0;
  }

  active(state) {
    if (state && state.restart) {
      this.resetGame();
    }
    if (state && state.players) {
      this.players = state.players;
    }
    switch (this.process.nodePong.difficulty) {
      case settings.MEDIUM:
        this.gameEngine.setClockCycle(settings.CLOCK_CYCLE - 15);
        break;
      case settings.HARD:
        this.gameEngine.setClockCycle(settings.CLOCK_CYCLE - 30);
        break;
      default:
        this.gameEngine.setClockCycle(settings.CLOCK_CYCLE);
        break;
    }
  }

  onKeyPress(str, key) {
    super.onKeyPress(str, key);
    switch (key.name) {
      case "w":
        this.p1.direction = 1;
        break;
      case "s":
        this.p1.direction = -1;
        break;
      case "up":
        if (this.players > 1) {
          this.p2.direction = 1;
        } else {
          this.p1.direction = 1;
        }
        break;
      case "down":
        if (this.players > 1) {
          this.p2.direction = -1;
        } else {
          this.p1.direction = -1;
        }
        break;
      case "p":
      case "escape":
        this.gameEngine.setClockCycle(settings.CLOCK_CYCLE);
        this.gameEngine.setCurrentScreen("PauseScreen", this.getScore());
        break;
      default:
        break;
    }
  }

  movePlayerTwo() {
    if (this.ball.direction === -1) {
      this.p2.direction = Math.floor(Math.random() * 3) - 1;
      return;
    }
    if (this.p2.position > this.cpuPosition) {
      this.p2.direction = 1;
      return;
    }
    if (this.p2.position < this.cpuPosition) {
      this.p2.direction = -1;
      return;
    }
    this.p2.direction = 0;
  }

  getFutureY() {
    let currentY = this.ball.y;
    let currentX = this.ball.x;
    let currentVert = -this.ball.vertical;
    while (currentX < settings.MIN_COLUMN - 1) {
      currentX = currentX + 1;
      currentY = currentY + currentVert;
      if (currentY <= 1) {
        currentY = 2;
        currentVert = 1;
      }
      if (currentY >= settings.MIN_ROW - 2) {
        currentY = settings.MIN_ROW - 3;
        currentVert = -1;
      }
    }
    return currentY;
  }

  setCpuPosition() {
    // Find where the ball is going to hit
    this.rallyCount = this.rallyCount + 1;
    let willHitAt = this.ball.y;
    if (this.ball.vertical !== 0) {
      willHitAt = this.getFutureY();
    }
    // Depending on the difficulty set the cpu position to be where the ball
    // will be +/-1
    let difficultyCoefficient = 90;
    switch (this.process.nodePong.difficulty) {
      case settings.MEDIUM:
        difficultyCoefficient = 180;
        break;
      case settings.HARD:
        difficultyCoefficient = 300;
      default:
        break;
    }
    // if its an easy return
    if (this.ball.vertical === 0) {
      if ((Math.random() > 0.5 && willHitAt > 3) || willHitAt === 12) {
        willHitAt = willHitAt - 1;
      } else {
        willHitAt = willHitAt + 1;
      }
    } else {
      if ((Math.random() * difficultyCoefficient) / this.rallyCount < 25) {
        if (willHitAt > settings.MIN_ROW / 2) {
          willHitAt = willHitAt - 2;
        } else {
          willHitAt = willHitAt + 2;
        }
      } else {
        willHitAt = willHitAt + Math.floor(Math.random() * 3) - 1;
      }
    }
    this.cpuPosition = willHitAt;
  }

  getScore() {
    return {
      p1: this.p1.score,
      p2: this.p2.score,
    };
  }

  onClockTick() {
    this.movePieces();
    this.drawScreen();
  }

  movePieces() {
    // Player one
    if (this.p1.direction === 1 && this.p1.position !== 2) {
      this.p1.position = this.p1.position - 1;
    } else if (
      this.p1.direction === -1 &&
      this.p1.position !== settings.MIN_ROW - 3
    ) {
      this.p1.position = this.p1.position + 1;
    }
    this.p1.direction = 0;
    // Player two
    if (this.players === 1) {
      this.movePlayerTwo();
    }
    if (this.p2.direction === 1 && this.p2.position !== 2) {
      this.p2.position = this.p2.position - 1;
    } else if (
      this.p2.direction === -1 &&
      this.p2.position !== settings.MIN_ROW - 3
    ) {
      this.p2.position = this.p2.position + 1;
    }
    this.p2.direction = 0;
    // Move ball
    this.ball.x = this.ball.x + this.ball.direction;
    this.ball.y = this.ball.y + this.ball.vertical;
    // Check for bounce
    // Off walls
    if (this.ball.y <= 1) {
      this.ball.y === 2;
      this.ball.vertical = 1;
    } else if (this.ball.y >= settings.MIN_ROW - 2) {
      this.ball.y === settings.MIN_ROW - 3;
      this.ball.vertical = -1;
    }
    // Off player one
    if (this.ball.x === 2 && this.ball.y === this.p1.position) {
      this.ball.direction = 1;
      this.ball.vertical = 0;
      this.setCpuPosition();
      process.stdout.write(settings.SOUND);
    } else if (this.ball.x === 2 && this.ball.y === this.p1.position + 1) {
      this.ball.direction = 1;
      this.ball.vertical = 1;
      this.setCpuPosition();
      process.stdout.write(settings.SOUND);
    } else if (this.ball.x === 2 && this.ball.y === this.p1.position - 1) {
      this.ball.direction = 1;
      this.ball.vertical = -1;
      this.setCpuPosition();
      process.stdout.write(settings.SOUND);
    }
    // Off player two
    if (
      this.ball.x === settings.MIN_COLUMN - 3 &&
      this.ball.y === this.p2.position
    ) {
      this.ball.direction = -1;
      this.ball.vertical = 0;
      process.stdout.write(settings.SOUND);
    } else if (
      this.ball.x === settings.MIN_COLUMN - 3 &&
      this.ball.y === this.p2.position + 1
    ) {
      this.ball.direction = -1;
      this.ball.vertical = 1;
      process.stdout.write(settings.SOUND);
    } else if (
      this.ball.x === settings.MIN_COLUMN - 3 &&
      this.ball.y === this.p2.position - 1
    ) {
      this.ball.direction = -1;
      this.ball.vertical = -1;
      process.stdout.write(settings.SOUND);
    }
    // Check for goal
    if (this.ball.x === 0 || this.ball.x === settings.MIN_COLUMN - 1) {
      // Add point to the proper player
      if (this.ball.x === 0) {
        this.p2.score = this.p2.score + 1;
      } else {
        this.p1.score = this.p1.score + 1;
      }
      // Reset ball
      this.ball.x = Math.floor(settings.MIN_COLUMN / 2);
      this.ball.y = Math.floor(settings.MIN_ROW / 2);
      this.ball.direction = Math.random() > 0.5 ? 1 : -1;
      this.ball.vertical = 0;
      this.setCpuPosition();
      this.rallyCount = 0;
      // Check if the game is over.
      this.checkIfGameOver();
    }
  }

  checkIfGameOver() {
    if (
      (this.p1.score >= PLAY_TO || this.p2.score >= PLAY_TO) &&
      Math.abs(this.p1.score - this.p2.score) > 1
    ) {
      this.gameEngine.setCurrentScreen("GameOverScreen", this.getScore());
    }
  }

  getBoundary() {
    const boundary = [];
    for (let rowIndex = 0; rowIndex < settings.MIN_ROW; rowIndex++) {
      const row = [];
      for (
        let columnIndex = 0;
        columnIndex < settings.MIN_COLUMN;
        columnIndex++
      ) {
        if (columnIndex === 0 || columnIndex === settings.MIN_COLUMN - 1) {
          row.push(settings.WHITE + "|");
        } else if (rowIndex === 0 || rowIndex === settings.MIN_ROW - 1) {
          row.push(settings.WHITE + "-");
        } else {
          row.push(" ");
        }
      }
      boundary.push(row);
    }
    return boundary;
  }

  drawScreen() {
    // Clear the screen first
    this.process.stdout.write(settings.CLEAR_TERMINAL);

    const screen = this.getBoundary();
    // p1
    screen[this.p1.position][1] = settings.RED + "|";
    screen[this.p1.position - 1][1] = settings.RED + "|";
    screen[this.p1.position + 1][1] = settings.RED + "|";
    // p2
    screen[this.p2.position][settings.MIN_COLUMN - 2] = settings.GREEN + "|";
    screen[this.p2.position - 1][settings.MIN_COLUMN - 2] =
      settings.GREEN + "|";
    screen[this.p2.position + 1][settings.MIN_COLUMN - 2] =
      settings.GREEN + "|";
    // ball
    screen[this.ball.y][this.ball.x] = settings.WHITE + "O";

    screen.forEach((row) => {
      this.process.stdout.write(
        settings.BLACK_BACKGROUND + row.join("") + settings.ASCII_RESET + "\n"
      );
    });
    this.process.stdout.write(
      `${settings.BLACK_BACKGROUND + settings.RED}Player 1: ${
        settings.WHITE + this.p1.score + settings.GREEN
      } Player 2: ${settings.WHITE + this.p2.score + settings.ASCII_RESET}`
    );
    this.process.stderr.write(settings.HIDE_CURSOR);
  }
}

module.exports = GameScreen;
