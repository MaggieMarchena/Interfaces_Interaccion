/*jshint esversion: 6 */

class Scooby {
  constructor() {
    this.element = document.getElementById('scooby');
    this.lane = 2;
    this.state = "walking";
  }

  idle(){
    if (this.lane == 1) {
      this.element.style.left = SCOOBY1;
    }
    else if (this.lane == 2) {
      this.element.style.left = SCOOBY2;
    }
    else {
      this.element.style.left = SCOOBY3;
    }
    this.element.classList.remove("scooby-walk");
    this.element.classList.remove("scooby-jump-1to2", "scooby-jump-2to3", "scooby-jump-3to2", "scooby-jump-2to1");
    this.element.classList.add("scooby-idle");
  }

  start(){
    this.walk();
  }

  getLane(){
    return this.lane;
  }

  moveRight(){
    if (this.lane == 1) {
      this.lane = 2;
      this.element.style.left = SCOOBY2;
    }
    else if (this.lane == 2) {
      this.lane = 3;
      this.element.style.left = SCOOBY3;
    }
  }

  moveLeft(){
    if (this.lane == 3) {
      this.lane = 2;
      this.element.style.left = SCOOBY2;
    }
    else if (this.lane == 2) {
      this.lane = 1;
      this.element.style.left = SCOOBY1;
    }
  }

  getState(){
    return this.state;
  }

  setState(state){
    this.state = state;
  }

  walk(){
    this.element.classList.remove("scooby-idle", "scooby-fainted", "scooby-fainting");
    this.element.classList.remove("scooby-jump-1to2", "scooby-jump-2to3", "scooby-jump-3to2", "scooby-jump-2to1");
    this.element.classList.add("scooby-walk");
  }

  jump1to2(){
    this.element.classList.remove("scooby-walk", "scooby-idle");
    this.element.classList.remove("scooby-jump-2to3", "scooby-jump-3to2", "scooby-jump-2to1");
    this.element.classList.add("scooby-jump-1to2");
  }

  jump2to3(){
    this.element.classList.remove("scooby-walk", "scooby-idle");
    this.element.classList.remove("scooby-jump-1to2", "scooby-jump-3to2", "scooby-jump-2to1");
    this.element.classList.add("scooby-jump-2to3");
  }

  jump3to2(){
    this.element.classList.remove("scooby-walk", "scooby-idle");
    this.element.classList.remove("scooby-jump-1to2", "scooby-jump-2to3", "scooby-jump-2to1");
    this.element.classList.add("scooby-jump-3to2");
  }

  jump2to1(){
    this.element.classList.remove("scooby-walk", "scooby-idle");
    this.element.classList.remove("scooby-jump-2to3", "scooby-jump-2to3", "scooby-jump-3to2");
    this.element.classList.add("scooby-jump-2to1");
  }

  faint(){
    this.element.classList.remove("scooby-walk", "scooby-idle");
    this.element.classList.remove("scooby-jump-1to2", "scooby-jump-2to3", "scooby-jump-3to2", "scooby-jump-2to1");
    this.element.classList.add("scooby-faint");
    let element = this.element;
    setTimeout(function () {
      element.classList.remove("scooby-walk", "scooby-faint", "scooby-idle");
      element.classList.add("scooby-fainted");
    }, 750);
  }
}
