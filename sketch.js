
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

var Mover = function(m, x, y) {
  this.mass = m;
  this.loc = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(random(-0.2,0.2), random(-0.2,0.2));
   
  this.applyForce = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  };
    
  this.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.acc.mult(0);
	//this.vel.mult(.999);
  };
  this.decay = function() {
	  this.vel.mult(.999);
  };

  this.display = function() {
    noStroke();
    fill(255);
    ellipse(this.loc.x, this.loc.y, this.mass/3, this.mass/3);
  };

  this.calculateAttraction = function(m) {
    // Calculate direction of force
    var force = p5.Vector.sub(this.loc, m.loc);
    // Distance between objects
    var d = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    d = constrain(d, 25.0, 100.0);
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
	d = constrain(d, 10.0, 50.0);
	force.normalize();
    var strength = (G * this.mass * 20) / (d * d);
	force.mult(-strength);
    return force;
  }

  this.boundaries = function() {
    if (this.loc.x > windowWidth-this.mass/2 || this.loc.x < this.mass/2) {
      this.vel.x *= -1;
    }
    if (this.loc.y > windowHeight-this.mass/2 || this.loc.y < this.mass/2) {
      this.vel.y *= -1;
    }
  }
}

var movers = [];

var G = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 25; i++) {
    movers[i] = new Mover(random(10, 20), random(20,width-20), random(20,height-20));
  }
  strokeCap(SQUARE);
}

function draw() {
  background(0);

  for (var i = 0; i < movers.length; i++) {
    for (var j = 0; j < movers.length; j++) {
      if (i !== j) {
        var d = dist(movers[i].loc.x,movers[i].loc.y,movers[j].loc.x,movers[j].loc.y);
        if (d < 200){
          var force = movers[j].calculateAttraction(movers[i]);
          movers[j].applyForce(force);
          //force.mult(512/d);
        }
        if (d < 255 && d > 200){
          var force = movers[j].calculateAttraction(movers[i]);
          movers[i].applyForce(force);
        }
        if (d < 255){
          strokeWeight(512/d);
          stroke(255,255,255,255-d);
          line(movers[i].loc.x,movers[i].loc.y,movers[j].loc.x,movers[j].loc.y);
        }
      }
    }
	var mousey = createVector(mouseX,mouseY);
	if(mouseIsPressed){
		var force = movers[i].lerpy(mousey);
		movers[i].applyForce(force);
	} else {
		movers[i].decay();
	}
    movers[i].update();
    movers[i].display();
    movers[i].boundaries();
	
  }
}
		
function mouseReleased(){
	for (var i = 0; i < movers.length; i++) {
		var d = dist(movers[i].loc.x,movers[i].loc.y,mouseX,mouseY);
		movers[i].vel.mult(1-50/d);
	}
}
