var touching = false;

var target;
var popmax;
var mutationRate;
var population;

this.displayInfo = function(){
  var answer = population.getBest();
  textSize(100);
  fill(255);
  noStroke();
  textAlign(CENTER);
  textFont("Courier");
  textStyle(NORMAL);
  push();
  translate(width/2,height*1/4);
    text(answer, 0, 0);
  pop();
}




var Mover = function(m, x, y) {
  this.mass = m;
  this.loc = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(random(-0.2,0.2), random(-0.2,0.2));
   
  this.applyForce = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  };
  this.applyLerp = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  };
    
  this.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.acc.mult(.9);
    this.vel.mult(.99);
  //this.vel.constrain(this.vel,0,50);
  };

  this.display = function() {

    noStroke();
    fill(random(-2000,2555),200,this.mass*25);
    ellipse(this.loc.x, this.loc.y, this.mass*2, this.mass*2);
  }; 

  this.calculateAttraction = function(m) {
    // Calculate direction of force
    var force = p5.Vector.sub(this.loc, m.loc);
    // Distance between objects
    var d = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    d = constrain(d, 10.0, 500.0);
    // Normalize vector (distance doesn't matter here, we just want this vector for direction                            
    force.normalize();
    // Calculate gravitional force magnitude
    var strength = (G * this.mass * m.mass) / (d * d);
    // Get force vector --> magnitude * direction
    force.mult(strength);
    return force;
  }
  
  this.lerpy = function(m) {
  var force = p5.Vector.sub(this.loc, m);
  var d = force.mag();
  d = constrain(d, 5.0, 500);
  force.normalize();
    var strength = (G * this.mass * 20) / (d * d);
  force.mult(-strength);
    return force;
  }

  this.boundaries = function() {
    //this.loc.x = constrain(this.loc.x, this.mass/2, windowWidth-this.mass/2);
    //this.loc.y = constrain(this.loc.y, this.mass/2, windowWHeight-this.mass/2);
    if (this.loc.x > windowWidth || this.loc.x < 0) {
      this.vel.x *= -1;
    }
    if (this.loc.y > windowHeight+127 ) {
      this.loc.y = -127;
    }
    if (this.loc.y < -127) {
      this.loc.y = windowHeight+127;
    }
  }
}

var movers = [];

var G = 7;

var ig;
var tw;
var tb;
var igSize = 128;

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function link(href, target) {
  if (target !== undef)  window.open(href, target);
  else                   window.location = href;
};

function webpage() {
    link("p5js.org");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 32; i++) {
    movers[i] = new Mover(random(5, 10), random(10,width-10), random(10,height-10));
  }
  strokeCap(SQUARE);
  colorMode(RGB);
  ig = loadImage("ig.png");
  tw = loadImage("tw.png");
  tb = loadImage("tb.png");
  avel = createVector(random(-.1,.1),random(-.1,.1));
  bvel = createVector(random(-.1,.1),random(-.1,.1));
  cvel = createVector(random(-.1,.1),random(-.1,.1));
  dvel = createVector(random(-.1,.1),random(-.1,.1));
  arot = random(-.1,.1);
  brot = random(-.1,.1);
  crot = random(-.1,.1);
  drot = random(-.1,.1);
  imageMode(CENTER);

  target = "Taylor J Knapps";
  popmax = 200;
  mutationRate = 0.02;
  population = new Population(target, mutationRate, popmax);
}



function mouseWheel() {
  print(event.delta);
  //move the square according to the vertical scroll amount
  for (var i = 0; i < movers.length; i++) {
    movers[i].loc.y -= event.delta;
    //movers[i].acc.y += event.delta*event.delta*.01;
    //movers[i].loc.y = constrain(movers[i].loc.y, movers[i].mass/2, windowWHeight-movers[i].mass/2);
  }
  //uncomment to block page scrolling
  //return false;
}
    
function touchStarted(){
  touching = true;
  if (mouseX>width/2-64&&mouseX<width/2+64&&mouseY>height*.8-64&&mouseY<height*.8+64){
    window.open("https://instagram.com/taylorknapps/");
  }
  if (mouseX>width/2-182&&mouseX<width/2-64&&mouseY>height*.8-64&&mouseY<height*.8+64){
    window.open("https://twitter.com/taylorjknapps");
  }
  if (mouseX>width/2+65&&mouseX<width/2+182&&mouseY>height*.8-64&&mouseY<height*.8+64){
    window.open("https://sppankit.tumblr.com/");
  }
}

function touchEnded(){
  touching = false;
}

var p = 0;

function draw() {

  background(0);
  
  image(ig, width/2, height*.8, igSize, igSize);
  image(tw, width/2-128, height*.8, igSize, igSize);
  image(tb, width/2+128, height*.8, igSize*2, igSize*2);
  
  //background(0);
  for (var i = 0; i < movers.length; i++) {
    for (var j = 0; j < movers.length; j++) {
      if (i !== j) {
        var d = dist(movers[i].loc.x,movers[i].loc.y,movers[j].loc.x,movers[j].loc.y);
        if (d < 64){
          var force = movers[j].calculateAttraction(movers[i]);
          movers[j].applyLerp(force);
          //movers[j].applyForce(force);
          //force.mult(512000/(d*movers[j].mass));
        }
        if (d < 127 && d > 64){
          var force = movers[j].calculateAttraction(movers[i]);
          movers[i].applyForce(force);
          //movers[i].applyLerp(force);
        }
        if (d < 350){
          strokeWeight(2000/d);
          stroke(/*0+i*10*//*200-(d/1.5)*/150-(d*d*.002),150-(d*d*d*.001),abs(100-(d/2)),255-(d/2));
          line(movers[i].loc.x,movers[i].loc.y,movers[j].loc.x,movers[j].loc.y);
        }
  }
  if(touching == true){
    //var force = movers[i].lerpy(mousey);
    //movers[i].applyLerp(force);
    //movers[i].loc.lerp(mousey,md*.001/(movers[j].mass));
    movers[i].loc.lerp(mousey,.25/md);
    //movers[i].vel.mult(.1/(d*movers[j].mass));
    movers[i].loc.lerp(touches[0],.5/md);
     
      }
    
    }
  var mousey = createVector(mouseX,mouseY);
  var mforce = p5.Vector.sub(movers[i].loc, mousey);
  var md = mforce.mag();
    movers[i].update();
    movers[i].display();
    movers[i].boundaries();
  }

  population.naturalSelection();
  //Create next generation
  population.generate();
  // Calculate fitness
  population.calcFitness();

  population.evaluate();

  displayInfo();
}
