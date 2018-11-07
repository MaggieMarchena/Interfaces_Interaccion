/*jshint esversion: 6 */

class Snack {
  constructor() {
    this.element = document.getElementById('snack');
    this.lane = 0;
  }

  setLane(num){
    this.lane = num;
    switch (this.lane) {
      case 1:
        this.element.classList.remove("snack2", "snack3");
        this.element.classList.add("snack1");
        break;
      case 2:
        this.element.classList.remove("snack1", "snack3");
        this.element.classList.add("snack2");
        break;
      case 3:
        this.element.classList.remove("snack1", "snack2");
        this.element.classList.add("snack3");
        break;
    }
  }

  getLane(){
    return this.lane;
  }

  move(){
    this.element.classList.remove('snackpass');
    this.element.classList.remove('snackcollide');
    this.element.classList.add('snackmove');
  }

  pass(){
    this.element.classList.remove('snackmove');
    this.element.classList.remove('snackcollide');
    this.element.classList.add('snackpass');
    let element = this.element;
    setTimeout(function() {
      element.classList.remove("snack1", "snack2", "snack3");
      element.classList.remove('snackpass');
    }, 600);
  }

  collide(){
    this.element.classList.remove('snackmove');
    this.element.classList.remove('snackpass');
    this.element.classList.add('snackcollide');
  }
}
