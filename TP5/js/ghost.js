/*jshint esversion: 6 */

class Ghost {
  constructor() {
    this.element = document.getElementById('ghost');
    this.lane = 0;
  }

  setLane(num){
    this.lane = num;
    switch (this.lane) {
      case 1:
        this.element.classList.remove("ghost2", "ghost3");
        this.element.classList.add("ghost1");
        break;
      case 2:
        this.element.classList.remove("ghost1", "ghost3");
        this.element.classList.add("ghost2");
        break;
      case 3:
        this.element.classList.remove("ghost1", "ghost2");
        this.element.classList.add("ghost3");
        break;
    }
  }

  getLane(){
    return this.lane;
  }

  move(){
    this.element.classList.remove('pass');
    this.element.classList.remove('collide');
    this.element.classList.add('move');
  }

  pass(){
    this.element.classList.remove('move');
    this.element.classList.remove('collide');
    this.element.classList.add('pass');
    let element = this.element;
    setTimeout(function() {
      element.classList.remove("ghost1", "ghost2", "ghost3");
      element.classList.remove('pass');
    }, 500);
  }

  collide(){
    this.element.classList.remove('move');
    this.element.classList.remove('pass');
    this.element.classList.add('collide');
  }
}
