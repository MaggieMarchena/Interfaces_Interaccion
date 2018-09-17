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
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const CHIP_SIDE_WIDTH = 100;
const CHIP_SIDE_HEIGHT = 12;

class Mouse {
  constructor() {
    this.click = false;
    this.currentX = null;
    this.currentY = null;
    this.lastX = null;
    this.lastY = null;
  }

  clicked(){
    return this.click;
  }

  setClick(state){
    this.click = state;
  }

  set(x, y){
    this.currentX = x;
    this.currentY = y;
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
    let x = this.tileX + (tileWidth / 2);
    let y = this.tileY + (tileHeight / 2);
    let image = context.createPattern(img, 'repeat');
    context.fillStyle = image;
    context.beginPath();
    context.arc(x, y, RADIUS, 0, (Math.PI * 2));
    context.fill();
    context.closePath();
    context.beginPath();
    context.arc(x, y, RADIUS, 0, (Math.PI * 2));
    context.lineWidth = 2;
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
  }

  useChip(){
    if (this.chips >0) {
      this.chips--;
      //erase one chip visual
    }
    else {
      //some sign saying no more chips
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

  playTurn(column){
    let row = this.getEmptyRow(column);
    let tile = this.board.getTile(column, row);
    tile.putChip(this.currentPlayer);
    this.currentPlayer.useChip();
    this.counter++;
    if (this.counter > 6) {
      if (this.checkColumn(column) || this.checkRow(row) || this.checkDiagonals(column, row)) {
        this.winner = this.currentPlayer;
        alert('Winner: ' + this.winner.getColor());
        //lockAll
      }
    }
    let auxPlayer = this.currentPlayer;
    this.currentPlayer = this.waitingPlayer;
    this.waitingPlayer = auxPlayer;
  }

  pickChip(e){
    this.mouse.update();
    this.mouse.set(e.layerX, e.layerY);

    let currentX = this.mouse.getCurrentX();
    let currentY = this.mouse.getCurrentY();
    let lastX = this.mouse.getLastX();
    let lastY = this.mouse.getLastY();

    let limitTop = 0;
    let limitBottom;
    if ((currentX > 0) && (currentX < boardX)) {
      limitBottom = boardY + tileHeight*2;
    }
    else {
      limitBottom = boardY;
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

    if (lastX != null && lastY != null) {
      context.clearRect((lastX - RADIUS - 5), (lastY - RADIUS - 5), (RADIUS*2 + 20), (RADIUS*2 + 20));
    }

    if ((currentX > limitLeft) && (currentX < limitRight) && (currentY > limitTop) && (currentY < limitBottom)) {
      canvas.classList.remove("blocked");
      canvas.classList.add("grabbing");
      let image = context.createPattern(img, 'no-repeat');
      context.fillStyle = image;
      context.beginPath();
      context.arc(currentX, currentY, RADIUS, 0, (Math.PI * 2));
      context.fill();
      context.closePath();
    }
    else {
      canvas.classList.remove("grabbing");
      canvas.classList.add("blocked");
    }
  }

  dropChip(e){
    let lastX = this.mouse.getLastX();
    let lastY = this.mouse.getLastY();
    canvas.classList.remove("blocked");
    canvas.classList.remove("grabbing");
    context.clearRect((lastX - RADIUS - 5), (lastY - RADIUS - 5), (RADIUS*2 + 20), (RADIUS*2 + 20));
    canvas.style.cursor = "default";
    if ((this.mouse.getLastX() > boardX) && (this.mouse.getLastX() < boardX + boardWidth) && (this.mouse.getLastY() < boardY) && (this.mouse.getLastY() > 0)) {
      let column = this.getColumn();
      if (this.columnNotFull(column)){
        this.playTurn(column);
      }
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
    if (this.checkDiagonal1(column, row) || this.checkDiagonal2(column, row)) {
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
    while ((counter < LINE) && (baseCol < MAXCOL-1) && (baseRow < MAXROW-1)) {
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
        return false;
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
    while ((counter < LINE) && (baseCol < MAXCOL-1) && (baseRow > 0)) {
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
        return false;
      }
      baseCol++;
      baseRow--;
    }
    return false;
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let yellow = new Image();
yellow.src = "./images/backYellow.png";
let red = new Image();
red.src = "./images/backRed.png";

let boardX = 0;
let boardY = 0;

let boardWidth = 525;
let boardHeight = 402;

let tileWidth = 0;
let tileHeight = 0;

let game = null;

$(document).ready( function() {

  function hola() {
    console.log('hola');
  }

  $("#new").on('click', function (e) {
    e.preventDefault();
    context.clearRect(0, 0, canvas.width, canvas.height);
    boardX = (canvas.width / 2) - (boardWidth / 2);
    boardY = (canvas.height / 2) - (boardHeight / 2) + 20;
    tileWidth = Math.round(boardWidth / 7);
    tileHeight = boardHeight / 6;
    game = new Game();
  });

  canvas.addEventListener('mousedown', function(e){
    game.getMouse().setClick(true);
  });

  canvas.addEventListener('mousemove', function(e) {
    if (game != null) {
      if (game.getMouse().clicked()) {
        game.pickChip(e);
      }
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    game.getMouse().setClick(false);
    if (game != null) {
      game.dropChip();
    }
  });

});
