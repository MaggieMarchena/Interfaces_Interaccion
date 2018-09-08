/*jshint esversion: 6 */

const WHITE = 'rgba(255, 255, 255, 255)';
const FULL = 255;

class Mouse {
  constructor() {
    this.click = false;
    this.lastX = null;
    this.lastY = null;
    this.currentX = null;
    this.currentY = null;
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

  reset(){
    this.lastX = null;
    this.lastY = null;
  }
}

class Pencil {
  constructor() {
    this.state = 'notActive';
  }

  setState(state){
    this.state = state;
  }

  getState(){
    return this.state;
  }

  draw(e) {
    context.lineWidth = 10;
    context.strokeStyle = color.get();
    context.lineCap = "round";
    mouse.set(e.layerX, e.layerY);
    context.beginPath();
    if (mouse.getLastX() != null || mouse.getLastY() != null) {
      context.moveTo(mouse.getLastX(), mouse.getLastY());
    }
    else {
      context.moveTo(mouse.getCurrentX(), mouse.getCurrentY());
    }
    context.lineTo(mouse.getCurrentX(), mouse.getCurrentY());
    context.closePath();
    context.stroke();
    mouse.update();
  }
}

class Eraser {
  constructor() {
    this.state = 'notActive';
  }

  setState(state){
    this.state = state;
  }

  getState(){
    return this.state;
  }

  erase(e) {
    context.lineWidth = 50;
    context.strokeStyle = WHITE;
    mouse.set(e.layerX, e.layerY);
    context.beginPath();
    if (mouse.getLastX() != null || mouse.getLastY() != null) {
      context.moveTo(mouse.getLastX(), mouse.getLastY());
    }
    else {
      context.moveTo(mouse.getCurrentX(), mouse.getCurrentY());
    }
    context.lineTo(mouse.getCurrentX(), mouse.getCurrentY());
    context.stroke();
    context.closePath();
    mouse.update();
  }
}

class Color {
  constructor() {
    this.picked = WHITE;
    this.black = 'rgba(0, 0, 0, 255)';
    this.red = 'rgba(255, 0, 0, 255)';
    this.blue = 'rgba(0, 0, 255, 255)';
    this.yellow = 'rgba(255, 255, 0, 255)';
  }

  get(){
    return this.picked;
  }

  change(color){
    switch (color) {
      case 'black':
        this.picked =  this.black;
        break;
      case 'red':
        this.picked =  this.red;
        break;
      case 'blue':
        this.picked =  this.blue;
        break;
      case 'yellow':
        this.picked = this.yellow;
        break;
    }
    return this.picked;
  }

}

class Filter {
  constructor(){
    this.imageData = context.getImageData(0,0,canvas.width, canvas.height);
    this.x = 0;
    this.y = 0;
    this.width = 700;
    this.height = 500;
  }

  setImageData(x, y, width, height){
    this.imageData = context.getImageData(x, y, width, height);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  reset(){
    this.imageData = context.getImageData(0,0,canvas.width, canvas.height);
    this.x = 0;
    this.y = 0;
    this.width = 700;
    this.height = 500;
  }

  transform(filter){
    switch (filter) {
      case 'bw':
        this.bw();
        break;
      case 'sepia':
        this.sepia();
        break;
      case 'sepia':
        this.sepia();
        break;
      case 'negative':
        this.negative();
        break;
      case 'sat':
        this.sat();
        break;
      case 'contrast':
        this.contrast();
        break;
      case 'blur':
        this.blur();
        break;
    }
  }

  bw(){
    for(let i=0; i < this.imageData.data.length; i+=4){
      let color = (this.imageData.data[i] + this.imageData.data[i+1] + this.imageData.data[i+2]) / 3;
      this.imageData.data[i] = color;
      this.imageData.data[i+1] = color;
      this.imageData.data[i+2] = color;
      this.imageData.data[i+3] = FULL;
    }
    context.putImageData(this.imageData, this.x, this.y);
  }

  sepia(){
    for(let i=0; i < this.imageData.data.length; i+=4){
      let r = (this.imageData.data[i] * 0.393) + (this.imageData.data[i+2] * 0.769) + (this.imageData.data[i+2] * 0.189);
      let g = (this.imageData.data[i] * 0.349) + (this.imageData.data[i+2] * 0.686) + (this.imageData.data[i+2] * 0.168);
      let b = (this.imageData.data[i] * 0.272) + (this.imageData.data[i+2] * 0.534) + (this.imageData.data[i+2] * 0.131);
      this.imageData.data[i] = r;
      this.imageData.data[i+1] = g;
      this.imageData.data[i+2] = b;
      this.imageData.data[i+3] = FULL;
    }
    context.putImageData(this.imageData, this.x, this.y);
  }

  negative(){
    for(let i=0; i < this.imageData.data.length; i+=4){
      this.imageData.data[i] = 255 - this.imageData.data[i];
      this.imageData.data[i+1] = 255 - this.imageData.data[i+1];
      this.imageData.data[i+2] = 255 - this.imageData.data[i+2];
      this.imageData.data[i+3] = FULL;
    }
    context.putImageData(this.imageData, this.x, this.y);
  }

  contrast(){
    let C = 200;
    let factor = (259 * (C + 225)) / (255 * (259 - C));
    for(let i=0; i < this.imageData.data.length; i+=4){
      this.imageData.data[i] = factor * (this.imageData.data[i] - 128) - 128;
      this.imageData.data[i+1] = factor * (this.imageData.data[i+1] - 128) - 128;
      this.imageData.data[i+2] = factor * (this.imageData.data[i+2] - 128) - 128;
      this.imageData.data[i+3] = FULL;
    }
    context.putImageData(this.imageData, this.x, this.y);
  }

  sat(){
    //source: http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
    for(let i=0; i < this.imageData.data.length; i+=4){
      //get original values
      let R = this.imageData.data[i] / FULL;
      let G = this.imageData.data[i+1] / FULL;
      let B = this.imageData.data[i+2] / FULL;

      //convert to HSL
      let min = Math.min(R, G, B);
      let max = Math.max(R, G, B);

      let L = (min + max) / 2;

      let S = 0;
      if (L < 0.5) {
        S = (max - min) / (max + min);
      }
      else {
        S = (max - min) / (2 - max - min);
      }

      let H = 0;
      if (max != min) {
        if (max == R) {
          H = ((G - B) / (max - min)) * 60;
        }
        else if (max == G) {
          H = (2 + (B - R) / (max - min)) * 60;
        }
        else if (max == B) {
          H = (4 + (R - G) / (max - min)) * 60;
        }
      }

      if(H < 0){
        H  = Math.abs(H);
      }

      S += 0.5 * S;

      //convert back to RGB
      let temp1 = 0;
      let temp2 = 0;
      if (S == 0) {
        R = G = B = S * FULL;
      }
      else {
        if (L < 0.5) {
          temp1 = L * (1 + S);
        }
        else {
          temp1 = L + S - (L * S);
        }
      }
      temp2 = (2 * L)  - temp1;

      H /= 360;

      let tempR = H + 0.333;
      if (tempR < 0) {
        tempR += 1;
      }
      else if (tempR > 1) {
        tempR -= 1;
      }

      let tempG = H;
      if (tempG < 0) {
        tempG += 1;
      }
      else if (tempG > 1) {
        tempG -= 1;
      }

      let tempB = H - 0.333;
      if (tempB < 0) {
        tempB += 0;
      }
      else if (tempB > 1) {
        tempB += 1;
      }

      let newR = testRGB(tempR, temp1, temp2);
      let newG = testRGB(tempG, temp1, temp2);
      let newB = testRGB(tempB, temp1, temp2);

      //apply to pixel data
      this.imageData.data[i] = Math.round(newR * FULL);
      this.imageData.data[i+1] = Math.round(newG * FULL);
      this.imageData.data[i+2] = Math.round(newB * FULL);
      this.imageData.data[i+3] = FULL;

      //only to check if code is still running
      console.log(1);
    }
    context.putImageData(this.imageData, this.x, this.y);
  }

  blur(){
    //source: https://www.script-tutorials.com/html5-canvas-image-effects-app-adding-blur/
    for(let i=0; i < this.imageData.data.length; i+=4){

      //width of every row of data
      let drw = this.width * 4;

      //sum of RGBA values
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumA = 0;

      //count of elements
      let c = 0;

      //index in imageData.data of surrounding pixels
      let sp = [
        //top pixels
        i - drw - 4, i - drw, i - drw + 4,
        //middle pixels
        i - 4, i + 4,
        //bottom pixels
        i + drw - 4, i + drw, i + drw + 4
      ];

      //get sum of every value from sp
      for (let j = 0; j < sp.length; j++) {
        //check if pixel exists
        if ((sp[j] >= 0) && (sp[j] <= this.imageData.data.length - 3)) {
          sumA += this.imageData.data[sp[j]];
          sumR += this.imageData.data[sp[j] + 1];
          sumG += this.imageData.data[sp[j] + 2];
          sumB += this.imageData.data[sp[j] + 3];
          c++;
        }
      }

      //apply average value to imageData
      this.imageData.data[i] = (sumA / c);
      this.imageData.data[i+1] = (sumR / c);
      this.imageData.data[i+2] = (sumG / c);
      this.imageData.data[i+3] = (sumB / c);

      //only to check if code is still running
      console.log(1);
    }
    context.putImageData(this.imageData, this.x, this.y);
  }
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let color = new Color();
let filter = new Filter();
let pencil = new Pencil();
let eraser = new Eraser();
let mouse = new Mouse();

$(document).ready( function() {

  function loadCanvas() {
    let imgData=context.createImageData(canvas.height, canvas.width);
		for (let x=0; x<imgData.width; x++){
			for (let y = 0; y < imgData.height; y++) {
				let i = (x + y * imgData.width)*4;
				imgData.data[i+0]=255;
	  		imgData.data[i+1]=255;
	  		imgData.data[i+2]=255;
	  		imgData.data[i+3]=255;
			}
  	}
		context.putImageData(imgData,0,0);
    filter.reset();
  }

  canvas.addEventListener('mousedown', function(e) {
    mouse.setClick(true);
  });

  canvas.addEventListener('mousemove', function(e) {
    if (mouse.clicked()) {
      if (pencil.getState() == 'active') {
        pencil.draw(e);
      }
      else if (eraser.getState() == 'active') {
        eraser.erase(e);
      }
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    mouse.setClick(false);
    mouse.reset();
  });

  $("#open").on('change', function(e) {
    let reader = new FileReader();
    reader.onload = function(event) {
      let img = new Image();
      img.onload = function() {
        let values = fitImage(img);
        context.drawImage(img, values.x, values.y, values.imageWidth, values.imageHeight);
        filter.setImageData(values.x, values.y, values.imageWidth, values.imageHeight);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  $("#start").on('click', loadCanvas());

  $("#save").on('click', function() {
    saveImage();
  });

  $("#pencil").on('click', function() {
    $('.tools').removeClass('active');
    eraser.setState('notActive');
    pencil.setState('active');
    $(this).addClass('active');
  });

  $("#eraser").on('click', function() {
    $('.tools').removeClass('active');
    pencil.setState('notActive');
    eraser.setState('active');
    $(this).addClass('active');
  });

  $('.colors').on('click', function() {
    $('.colors').removeClass('active');
    color.change(this.id);
    $(this).addClass('active');
  });

  $('.filters').on('click', function(e) {
    e.preventDefault();
    filter.transform(this.name);
  });
});

function fitImage(image) {
  let imageAspectRatio = image.width / image.height;
  let canvasAspectRatio = canvas.width / canvas.height;
  let values = {
    imageWidth:0,
    imageHeight:0,
    x:0,
    y:0,
  };

  if (imageAspectRatio < canvasAspectRatio) {
    values.imageHeight = canvas.height;
    values.imageWidth = Math.round(image.width * (values.imageHeight / image.height));
    values.x = (canvas.width - values.imageWidth) / 2;
    values.y = 0;
  }
  else if (imageAspectRatio > canvasAspectRatio) {
    values.imageWidth = canvas.width;
    values.imageHeight = Math.round(image.height * (values.imageWidth / image.width));
    values.y = (canvas.height - values.imageHeight) / 2;
    values.x = 0;
  }
  else {
    values.imageHeight = canvas.height;
    values.imageWidth = canvas.width;
    values.x = 0;
    values.y = 0;
  }

  return values;
}

function saveImage() {
  let link = document.getElementById('save');
  link.setAttribute('href', canvas.toDataURL());
  link.setAttribute('download', 'image.png');
}

function testRGB(tColor, t1, t2) {
  let color = 0;
  if ((6 * tColor) < 1) {
    color = t2 + (t1 - t2) * 6 * tColor;
  }
  else {
    if ((2 * tColor) < 1) {
    color = t1;
    }
    else if (3 * tColor < 2) {
      color = t2 + (t1 - t2) * (0.666 - tColor) * 6;
    }
    else {
      color = t2;
    }
  }
  return color;
}
