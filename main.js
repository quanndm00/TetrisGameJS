const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 10;
const SQ = 40;
const COLOR = "WHITE";
//tao 1 bien diem
let score = 0;

//tao 1 bien ket qua gameOver
let gameOver = false;
let interval;
//tao ham ve cac o vuong
let drawSquare = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

  ctx.strokeStyle = "#ccc";
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
};
//tao 1 mang 2 chieu chua cot va dong
let board = new Array();
//duyet qua mang, cho tung phan tu bang COLOR
for (let r = 0; r < ROW; r++) {
  board[r] = new Array();
  for (let c = 0; c < COL; c++) {
    board[r][c] = COLOR;
  }
}
console.log(board);
//tao ham ve giao dien game
let drawBoard = () => {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
};
//chay ham ve giao dien
drawBoard();
//hien thi len man hinh
class Piece {
  constructor(tetromino, color) {
    //tetromino la cac hinh ky tu trong file shape.js
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; //chi so goc quay dau tien
    //lay goc quay dua tren chi so roi gan vao thuoc tinh activeTetromino
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
  }
  //them method ve hinh
  fill(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (this.activeTetromino[r][c]) {
          drawSquare(this.x + c, this.y + r, color);
        }
      }
    }
  }
  //them method tao mau
  draw() {
    this.fill(this.color);
  }
  //them method xoa mau khi chuyen xoay hinh
  unDraw() {
    this.fill(COLOR);
  }
  //them method movedown de hinh di chuyen xuong duoi
  moveDown() {
    //kiem tra dieu kien va cham truoc truoc khi ve hinh
    if (!this.collision(0, 1, this.activeTetromino)) {
      this.unDraw();
      this.y++;
      this.draw();
    } else {
      //nguoc lai khoa hinh, khong cho chuyen dong nua
      this.lock();
      p = randomPiece(); //tao lai 1 hinh moi
    }
  }
  //them method moveleft di chuyen sang ben trai
  moveLeft() {
    //kiem tra dieu kien va cham truoc truoc khi ve hinh
    if (!this.collision(-1, 0, this.activeTetromino)) {
      this.unDraw();
      this.x--;
      this.draw();
    }
  }
  //them method moveRight di chuyen sang ben phai
  moveRight() {
    if (!this.collision(1, 0, this.activeTetromino)) {
      //this.x = 3 + c = (this.x + piece[r][c].legth+ x = 1 === COL)
      this.unDraw();
      this.x++;
      this.draw();
    }
  }
  //dinh nghia method khoa hinh
  lock() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (!this.activeTetromino[r][c]) {
          continue;
        }
        if (this.y + r < 0) {
          alert("Game Over");
          gameOver = true;
          break;
        }
        board[this.y + r][this.x + c] = this.color;
      }
    }
    //xu ly an diem
    for (let r = 0; r < ROW; r++) {
      let isFull = true;
      for (let c = 0; c < COL; c++) {
        isFull = isFull && (board[r][c] != COLOR);
      }
      if(isFull){
        //kiem tra xem row full se lam gi
        for (let y = r; y > 1; y--) {
          for (let c = 0; c < COL; c++) {
            board[y][c] = board[y-1][c]
          }
        }
        //tao hang moi o tren dinh cua game board
        for (let c = 0; c < COL; c++) {
          board[0][c] = COLOR;
        }
        //tang diem len
        score += 10;
      }
    }
    //ve lai board game sau khi xoa dong va cap nhat diem
    drawBoard();
    //hien thi diem len man hinh
    document.getElementById('score').innerText = score; 
  }
  //dinh nghia method rotate-xoay hinh
  rotate() {
    let nextPattern =
      this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let move = 0;
    //xu ly cham 2 ben
    if (this.collision(0, 0, nextPattern)) {
      if (this.x > COL / 2) {
        move = -1;
      } else {
        move = 1;
      }
    }
    if (!this.collision(0, 0, nextPattern)) {
      this.unDraw();//xoa hinh cu
      this.x += move;//cap nhat toa do x moi
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;//cap nhat goc xoa moi
      this.activeTetromino = this.tetromino[this.tetrominoN];
      this.draw();
    }
  }
  //them method collision-kiem tra va cham
  collision(x, y, piece) {
    //x la toa do x, y la toa do y, piece la cac hinh ky tu
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        if (!piece[r][c]) {
          continue;
        }
        //tao bien cap nhat toa do moi
        let newX = this.x + c + x;
        let newY = this.y + r + y;

        //kiem tra canh trai canh phai va canh duoi
        if (newX < 0 || newX >= COL || newY >= ROW) {
          return true;
        }
        //kiem tra canh tren
        if (newY < 0) {
          continue;
        }

        //
        if (board[newY][newX] != COLOR) {
          return true;
        }
      }
    }
    return false;
  }
}
//tao bien pieaces luu cac hinh
const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"],
];
//them function dung de random hinh dau tien
let randomPiece = () => {
  let r = Math.floor(Math.random() * PIECES.length);
  return new Piece(PIECES[r][0], PIECES[r][1]);
};
//chay ham randomPiece
let p = randomPiece();
console.log(p);

//lang nghe su kien khi bam vao phim mui ten
document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    p.moveLeft(); //sang trai
  } else if (e.keyCode == 39) {
    p.moveRight(); //sang phai
  } else if (e.keyCode == 40) {
    p.moveDown(); //di xuong duoi
  } else if (e.keyCode == 38) {
    //xoay hinh
    p.rotate();
  }
});

//tao game loop cho nguoi choi
let drop = () => {
  interval = setInterval(() => {
    if (!gameOver) {
      p.moveDown();
    } else {
      clearInterval(interval);
    }
  }, 1000);
};
drop();
