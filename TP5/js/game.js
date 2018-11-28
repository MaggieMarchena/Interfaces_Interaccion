/*jshint esversion: 6 */

class Game {
  constructor(scoobyLaugh) {
    this.element = document.getElementById('game-container');
    this.state = "end";
    this.moveAllowed = false;
    this.scooby = new Scooby();
    this.ghost = new Ghost();
    this.snack = new Snack();
    this.score = 0;
    this.element.classList.add("game-idle");
    this.scooby.idle();
    this.ghostIntervalID = 0;
    this.snackIntervalID = 0;
    this.scoreElement = document.getElementById('score');
    this.sound = scoobyLaugh;
  }

  getIntervals(){
    return [this.ghostIntervalId, this.snackIntervalID];
  }

  getState(){
    return this.state;
  }

  start(){
    this.moveAllowed = true;
    this.score = 0;
    this.element.classList.remove("game-end");
    this.element.classList.remove("game-idle");
    this.element.classList.add("game-on");
    this.play();
    this.updateVisual();
  }

  play(){
    this.state = "on";
    this.moveAllowed = true;
    this.scooby.start();
    this.element.classList.remove("game-end", "game-idle");
    this.element.classList.add("game-on");
    let g = this;
    this.ghostIntervalID = setInterval(function() {
      if (g.state == "on") {
        g.showGhost();
      }
    }, 3000);
    let snackIntervalID = this.snackIntervalID;
    setTimeout(function() {
      snackIntervalID = setInterval(function() {
        if (g.state == "on") {
          g.showSnack();
        }
      }, 6000);
    }, 2000);
  }

  end(){
    this.state = "end";
    this.element.classList.remove("game-on");
    this.element.classList.add("game-end");
  }

  getScoobyLane(){
    return this.scooby.getLane();
  }

  updateVisual(){
    this.moveAllowed = true;
    if (this.scooby.getState() == "walking") {
      this.scoobyWalk();
      this.scoreElement.innerHTML = this.score;
    }
    else if (this.scooby.getState() == "fainting") {
      this.scoobyFaint();
    }
  }

  changeScoobyState(state){
    this.scooby.setState(state);
  }

  scoobyWalk(){
    this.scooby.walk();
  }

  scoobyJumpRight(){
    if ((game.getScoobyLane() == 1)) {
      this.scooby.jump1to2();
      this.scooby.moveRight();
    }
    else if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to3();
      this.scooby.moveRight();
    }
  }

  scoobyJumpLeft(){
    if ((game.getScoobyLane() == 2)) {
      this.scooby.jump2to1();
      this.scooby.moveLeft();
    }
    else if ((game.getScoobyLane() == 3)) {
      this.scooby.jump3to2();
      this.scooby.moveLeft();
    }
  }

  scoobyLaugh(){
    this.sound.play();
  }

  scoobyFaint(){
    this.scooby.faint();
    this.end();
  }

  showGhost() {
    let num = getRandomNum();
    this.ghost.setLane(num);
    this.ghost.move();
    let g = this;
    setTimeout(function () {
      g.checkCollision();
    }, 2000);
  }

  showSnack() {
    let num = getRandomNum();
    let ghostLane = this.ghost.getLane();
    while (ghostLane == num) {
      num = getRandomNum();
    }
    this.snack.setLane(num);
    this.snack.move();
    let g = this;
    setTimeout(function () {
      g.checkEat();
    }, 2000);
  }

  checkCollision(){
    if (this.state == "on") {
      if(this.scooby.getLane() == this.ghost.getLane()){
        this.scooby.faint();
        this.ghost.collide();
        this.end();
      }
      else {
        this.changeScoobyState("walking");
        this.ghost.pass();
      }
    }
    else {
      this.ghost.pass();
    }
  }

  checkEat(){
    if (this.state == "on") {
      if(this.scooby.getLane() == this.snack.getLane()){
        this.snack.collide();
        this.changeScoobyState("walking");
        this.scoobyLaugh();
        this.score += 40;
        this.updateVisual();
      }
      else {
        this.changeScoobyState("walking");
        this.snack.pass();
      }
    }
    else {
      this.snack.pass();
    }
  }

  arrowRight(){
    if (this.moveAllowed) {
      this.scoobyJumpRight();
      this.moveAllowed = false;
      let g = this;
      setTimeout(function () {
        g.updateVisual();
      }, 800);
    }
  }

  arrowLeft(){
    if (this.moveAllowed) {
      this.scoobyJumpLeft();
      this.moveAllowed = false;
      let g = this;
      setTimeout(function () {
        g.updateVisual();
      }, 800);
    }
  }
}

let game = null;


$(document).ready( function() {

  let scoobyLaugh = document.createElement("audio");
  scoobyLaugh.src = "sounds/scooby-laugh.wav";
  scoobyLaugh.setAttribute("preload", "auto");
  scoobyLaugh.setAttribute("controls", "none");
  scoobyLaugh.style.display = "none";
  document.body.appendChild(scoobyLaugh);

  game = new Game(scoobyLaugh);
  addEventListeners(scoobyLaugh);

});

function addEventListeners(scoobyLaugh) {
  document.addEventListener('keydown', function(e){
    keyDown(e);
  });

  document.getElementById('new-game').addEventListener('click', function(){
    game.end();
    let intervals = game.getIntervals();
    for (let i = 0; i < intervals.length; i++) {
      window.clearInterval(intervals[i]);
    }
    game = new Game(scoobyLaugh);
    game.start();
  });
}

function keyDown(e) {
  let key = e.keyCode;

  if (game != null && game.getState() != "end"){
    if (key == ARROW_RIGHT) {
      e.preventDefault();
      game.arrowRight();
    }
    else if (key == ARROW_LEFT) {
      e.preventDefault();
      game.arrowLeft();
    }
  }
}

function getRandomNum() {
  return Math.floor(Math.random() * (4 - 1) + 1);
}
