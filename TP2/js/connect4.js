/*jshint esversion: 6 */

const MAXCOL = 7;
const MAXROW = 6;
const LINE = 4;
const RADIUS = 30;
const CHIPS = 21;
const PLAYERS = 2;
const YELLOW = 'yellow';
const RED = 'red';
const BLACK = 'rgba(0, 0, 0, 255)';
const CHIP_SIDE_WIDTH = 100;
const CHIP_SIDE_HEIGHT = 12;
const CHIP_SIZE = 60;

class Mouse {
  constructor() {
    this.click = false;
    this.currentX = null;
    this.currentY = null;
    this.lastX = null;
    this.lastY = null;
    this.dragActive = false;
  }

  clicked(){
    return this.click;
  }

  setClick(state){
    this.click = state;
  }

  setDragActive(state){
    this.dragActive = state;
  }

  set(x, y){
    this.currentX = x;
    this.currentY = y;
  }

  isDragActive(){
    return this.dragActive;
  }

  getLastX(){
    return this.lastX;
  }

  getLastY(){
    return this.lastY;
  }

  getCurrentX(){
    return this.currentX;
  }

  getCurrentY(){
    return this.currentY;
  }

  update(){
    this.lastX = this.currentX;
    this.lastY = this.currentY;
  }

  resetCurrent(){
    this.currentX = null;
    this.currentY = null;
  }

  resetLast(){
    this.lastX = null;
    this.lastY = null;
  }
}

class Tile {
  constructor(x, y) {
    this.filled = false;
    this.player = null;
    this.tileX = x;
    this.tileY = y;
  }

  isFilled(){
    return this.filled;
  }

  putChip(player){
    this.filled = true;
    this.player = player;
    let img;
    if (player.getColor() == YELLOW){
      img = yellow;
    }
    else {
      img = red;
    }
    let x = (this.tileX + (tileWidth / 2)) - RADIUS;
    let y = (this.tileY + (tileHeight / 2)) - RADIUS;
    context.drawImage(img, x, y, CHIP_SIZE, CHIP_SIZE);
    context.beginPath();
    context.arc((x + RADIUS), (y + RADIUS), RADIUS, 0, (Math.PI * 2));
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.strokeStyle = BLACK;
    context.stroke();
    context.closePath();
  }

  getPlayer(){
    return this.player;
  }
}

class Board {
  constructor() {
    this.colums = [];
    let auxX = boardX;
    for (let i = 0; i < MAXCOL; i++) {
      let auxY = boardY;
      this.colums[i] = new Array(MAXROW);
      for (let j = 0; j < MAXROW; j++) {
        this.colums[i][j] = new Tile(auxX, auxY);
        auxY += tileHeight;
      }
      auxX += tileWidth;
    }
  }

  getTile(column, row){
    return this.colums[column][row];
  }
}

class Player {
  constructor(color) {
    this.color = color;
    this.chips = CHIPS;
    this.chipX = 0;
    if (color == YELLOW) {
      this.chipX = chipYellowX;
    }
    else {
      this.chipX = chipRedX;
    }
    this.chipY = chipTopY;
  }

  useChip(){
    if (this.chips >0) {
      this.chips--;
      context.fillStyle = BLACK;
      context.fillRect(this.chipX, this.chipY, CHIP_SIDE_WIDTH, CHIP_SIDE_HEIGHT);
      this.chipY += CHIP_SIDE_HEIGHT;
    }
    else {
      alert('No more chips, start a new game!');
      endGame();
    }
  }

  getColor(){
    return this.color;
  }
}

class Game {
  constructor() {
    this.currentPlayer = new Player(YELLOW);
    this.waitingPlayer = new Player(RED);
    this.winner = null;
    this.board = new Board();
    this.mouse = new Mouse();
    this.counter = 0;
  }

  getMouse(){
    return this.mouse;
  }

  getCurrentPlayer(){
    return this.currentPlayer;
  }

  getWinner(){
    return this.winner;
  }

  playTurn(column){
    let row = this.getEmptyRow(column);
    let tile = this.board.getTile(column, row);
    tile.putChip(this.currentPlayer);
    this.currentPlayer.useChip();
    this.counter++;
    if (this.counter > 6) {
      if (this.checkColumn(column) || this.checkRow(row) || this.checkDiagonals(column, row)) {
        this.winner = this.currentPlayer;
      }
    }
    if (this.winner == null) {
      let auxPlayer = this.currentPlayer;
      this.currentPlayer = this.waitingPlayer;
      this.waitingPlayer = auxPlayer;
      this.mouse.resetLast();
      this.mouse.setDragActive(false);
      this.showChip();
    }
    else {
      let winner = null;
      if (this.winner.getColor() == YELLOW) {
        winner = winnerYellow;
      }
      else {
        winner = winnerRed;
      }
      setTimeout(function() {
        winner.classList.remove("hidden");
        winner.classList.add("visible");
      }, 500);
      endGame();
    }
  }

  showChip(){
    let img;
    let x = 0;
    let y = centerChipY - RADIUS;
    if (this.currentPlayer.getColor() == YELLOW) {
      x = centerChipYellowX - RADIUS;
      img = yellow;
    }
    else {
      x = centerChipRedX - RADIUS;
      img = red;
    }
    context.drawImage(img, x, y, CHIP_SIZE, CHIP_SIZE);
  }

  pickChip(e){
    this.mouse.set(e.layerX, e.layerY);

    let currentX = this.mouse.getCurrentX();
    let currentY = this.mouse.getCurrentY();
    let lastX = this.mouse.getLastX();
    let lastY = this.mouse.getLastY();

    let limitTop = 0;
    let limitBottom;
    if (((currentX > 0) && (currentX < boardX - RADIUS)) || (((currentX > boardX + boardWidth + RADIUS) && (currentX < canvas.width)))) {
      limitBottom = boardY + tileHeight;
    }
    else {
      limitBottom = boardY - RADIUS - 5;
    }

    let limitLeft;
    let limitRight;
    let img;
    if (this.currentPlayer.getColor() == YELLOW) {
      limitLeft = 0;
      limitRight = boardX + boardWidth;
      img = yellow;
    }
    else {
      limitLeft = boardX;
      limitRight = canvas.width;
      img = red;
    }

    if ((currentX > limitLeft) && (currentX < limitRight) && (currentY > limitTop) && (currentY < limitBottom)) {
      if (lastX != null && lastY != null) {
        context.clearRect((lastX - RADIUS - 5), (lastY - RADIUS - 5), CHIP_SIZE + 10, CHIP_SIZE + 10);
      }

      context.drawImage(img, currentX - RADIUS, currentY - RADIUS, CHIP_SIZE, CHIP_SIZE);
    }
    else {
      this.mouse.setClick(false);
      context.clearRect((lastX - RADIUS - 5), (lastY - RADIUS - 5), CHIP_SIZE + 10, CHIP_SIZE + 10);
      this.mouse.resetCurrent();
    }

    this.mouse.update();
  }

  dropChip(e){
    let lastX = this.mouse.getLastX();
    let lastY = this.mouse.getLastY();

    if (lastX != null && lastY != null) {

      context.clearRect((lastX - RADIUS - 5), (lastY - RADIUS - 5), CHIP_SIZE + 10, CHIP_SIZE + 10);

      if ((this.mouse.getLastX() > boardX) && (this.mouse.getLastX() < boardX + boardWidth) && (this.mouse.getLastY() < boardY) && (this.mouse.getLastY() > 0)) {
        let column = this.getColumn();
        if (this.columnNotFull(column)){
          this.playTurn(column);
        }
        else {
          this.showChip();
        }
      }
      else {
        this.showChip();
      }
    }
    else {
      this.showChip();
    }
  }

  getColumn(){
    let column = 0;
    for (let i = 0; i < MAXCOL; i++) {
      if ((this.mouse.getLastX() > boardX + (i * tileWidth)) && (this.mouse.getLastX() < boardX + ((i+1) * tileWidth))) {
        column = i;
      }
    }
    return column;
  }

  columnNotFull(column){
    for (let i = 0; i < MAXROW; i++) {
      if (!this.board.getTile(column, i).isFilled()) {
        return true;
      }
    }
    return false;
  }

  getEmptyRow(column){
    let row = MAXROW - 1;
    while (row >= 0) {
      if (!this.board.getTile(column, row).isFilled()) {
        return row;
      }
      row--;
    }
  }

  checkColumn(column){
    let counter = 0;
    let row = 0;
    while (counter < LINE && row < MAXROW) {
      let tile = this.board.getTile(column, row);
      if (tile.getPlayer() == this.currentPlayer) {
        counter++;
        if (counter == LINE) {
          return true;
        }
      }
      else {
        counter = 0;
      }
      row++;
    }
    return false;
  }

  checkRow(row){
    let counter = 0;
    let column = 0;
    while (counter < LINE && column < MAXCOL) {
      let tile = this.board.getTile(column, row);
      if (tile.getPlayer() == this.currentPlayer) {
        counter++;
        if (counter == LINE) {
          return true;
        }
      }
      else {
        counter = 0;
      }
      column++;
    }
    return false;
  }

  checkDiagonals(column, row){
    let diagonal1 = this.checkDiagonal1(column, row);
    let diagonal2 = this.checkDiagonal2(column, row);
    if (diagonal1 || diagonal2) {
      return true;
    }
    return false;
  }

  checkDiagonal1(column, row){
    let counter = 0;

    let baseCol = column;
    let baseRow = row;
    while ((baseCol > 0) && (baseRow > 0)) {
      baseCol--;
      baseRow--;
    }
    while ((counter < LINE) && (baseCol <= MAXCOL-1) && (baseRow <= MAXROW-1)) {
      let tile = this.board.getTile(baseCol, baseRow);
      if (tile.isFilled()) {
        if (tile.getPlayer() == this.currentPlayer) {
          counter++;
          if (counter == LINE) {
            return true;
          }
        }
        else {
          counter = 0;
        }
      }
      else {
        counter = 0;
      }
      baseCol++;
      baseRow++;
    }
    return false;
  }

  checkDiagonal2(column, row){
    let counter = 0;

    let baseCol = column;
    let baseRow = row;
    while ((baseCol > 0) && (baseRow < MAXROW-1)) {
      baseCol--;
      baseRow++;
    }
    while ((counter < LINE) && (baseCol <= MAXCOL-1) && (baseRow >= 0)) {
      let tile = this.board.getTile(baseCol, baseRow);
      if (tile.isFilled()) {
        if (tile.getPlayer() == this.currentPlayer) {
          counter++;
          if (counter == LINE) {
            return true;
          }
        }
        else {
          counter = 0;
        }
      }
      else {
        counter = 0;
      }
      baseCol++;
      baseRow--;
    }
    return false;
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let winnerYellow = document.getElementById('winner1');
let winnerRed = document.getElementById('winner2');

let yellow = new Image();
yellow.src = "images/chipYellow.png";
let red = new Image();
red.src = "images/chipRed.png";

let boardX = 0;
let boardY = 0;

let boardWidth = 525;
let boardHeight = 402;

let tileWidth = 0;
let tileHeight = 0;

let chipYellowX = 0;
let chipRedX = 0;
let chipBottomY = 0;
let chipTopY = 0;
let centerChipY = 0;
let centerChipYellowX = 0;
let centerChipRedX = 0;

let game = null;

$(document).ready( function() {

  loadGame();
  game = new Game();
  yellow.onload = function() {
    game.showChip();
  };

  addEventListeners();

  $("#new").on('click', function(e) {
    e.preventDefault();
    context.clearRect(0, 0, canvas.width, canvas.height);
    loadGame();
    game = new Game();
    game.showChip();
  });

});

function loadGame() {
  winner1.classList.remove("visible");
  winner2.classList.remove("visible");
  winner1.classList.add("hidden");
  winner2.classList.add("hidden");
  boardX = (canvas.width / 2) - (boardWidth / 2);
  boardY = (canvas.height / 2) - (boardHeight / 2) + 70;
  tileWidth = Math.round(boardWidth / 7);
  tileHeight = boardHeight / 6;
  chipYellowX = (boardX/2) - (CHIP_SIDE_WIDTH/2);
  chipRedX = (boardX + boardWidth) + chipYellowX;
  chipBottomY = canvas.height - CHIP_SIDE_HEIGHT;
  chipTopY = chipBottomY - (CHIPS*CHIP_SIDE_HEIGHT);
  centerChipY = (boardY + (tileHeight/2));
  centerChipYellowX = boardX/2;
  centerChipRedX = boardX + boardWidth + (boardX/2);
}

function addEventListeners() {
  canvas.addEventListener('mousedown', function(e){
    mouseDown(e);
  });

  canvas.addEventListener('mousemove', function(e) {
    mouseMove(e);
  });

  canvas.addEventListener('mouseup', function(e) {
    mouseUp();
  });
}

function mouseDown(e) {
  if (game != null) {
    game.getMouse().setClick(true);
    if (game.getCurrentPlayer().getColor() == YELLOW && isClickOnChip(e.layerX, e.layerY, centerChipYellowX, centerChipY)) {
      game.getMouse().setDragActive(true);
    }
    else if (game.getCurrentPlayer().getColor() == RED && isClickOnChip(e.layerX, e.layerY, centerChipRedX, centerChipY)) {
      game.getMouse().setDragActive(true);
    }
    else {
      game.getMouse().setDragActive(false);
    }
  }
}

function mouseMove(e) {
  if (game != null) {
    if (game.getMouse().clicked() && game.getMouse().isDragActive()) {
      game.pickChip(e);
    }
  }
}

function mouseUp() {
  if (game != null) {
    game.getMouse().setClick(false);
    game.dropChip();
  }
}

function isClickOnChip(x0, y0, x1, y1) {
  let distance = Math.sqrt((x1 - x0)*(x1 - x0) + (y1 - y0)*(y1-y0));
  return (distance < RADIUS);
}

function endGame() {
  game = null;
}
