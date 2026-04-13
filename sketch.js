let seaweeds = [];
let bgBubbles = [];
let fishGroup = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < 18; i++) {
    seaweeds.push(new Seaweed(random(width)));
  }
  
  for (let i = 0; i < 30; i++) {
    bgBubbles.push(new BgBubble());
  }

  for (let i = 0; i < 8; i++) {
    fishGroup.push(new Fish());
  }
}

function draw() {
  noStroke();
  fill(224, 247, 250, 80); 
  rect(0, 0, width, height);
  
  drawWaterReflections(); 

  for (let s of seaweeds) {
    s.update();
    s.display();
  }

  for (let f of fishGroup) {
    f.update();
    f.display();
  }

  for (let b of bgBubbles) {
    b.update();
    b.display();
  }
}

class Seaweed {
  constructor(x) {
    this.x = x;
    this.h = random(height * 0.2, height * 0.6);
    this.seed = random(1000);
    this.baseWidth = random(8, 15);
    let colors = [
      color(255, 173, 173, 200), color(255, 214, 165, 200), color(253, 255, 182, 200),
      color(202, 255, 191, 200), color(155, 246, 255, 200), color(189, 178, 255, 200),
      color(255, 198, 255, 200)
    ];
    this.clr = random(colors);
    this.swayAmp = 1; 
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, height - this.h/2);
    if (d < 150) {
      this.swayAmp = map(d, 0, 150, 6, 1);
    } else {
      this.swayAmp = lerp(this.swayAmp, 1, 0.08);
    }
  }

  display() {
    noStroke();
    fill(this.clr);
    beginShape();
    for (let i = 0; i < this.h; i += 20) {
      let sway = sin(frameCount * 0.02 + i * 0.03 + this.seed) * (i * 0.1) * this.swayAmp;
      let w = map(i, 0, this.h, this.baseWidth, 1);
      vertex(this.x + sway - w, height - i);
    }
    for (let i = this.h; i >= 0; i -= 20) {
      let sway = sin(frameCount * 0.02 + i * 0.03 + this.seed) * (i * 0.1) * this.swayAmp;
      let w = map(i, 0, this.h, this.baseWidth, 1);
      vertex(this.x + sway + w, height - i);
    }
    endShape(CLOSE);
  }
}

class BgBubble {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, random(-0.5, -1.5));
    this.acc = createVector(0, 0);
    this.r = random(5, 12);
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let d = p5.Vector.dist(this.pos, mouse);
    if (d < 120) {
      let flee = p5.Vector.sub(this.pos, mouse);
      flee.setMag(0.8); 
      this.acc.add(flee);
    }
    this.vel.add(this.acc);
    this.vel.limit(4); 
    this.pos.add(this.vel);
    this.acc.mult(0.92); 
    this.vel.y = lerp(this.vel.y, -1.2, 0.03);
    this.vel.x = lerp(this.vel.x, 0, 0.03);
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
  }

  display() {
    stroke(255, 200);
    strokeWeight(1.5);
    noFill();
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Fish {
  constructor() {
    let startLeftSide = random(1) < 0.5;
    this.w = width * 0.04; // 這裡調大了魚的大小
    this.h = this.w * 0.6;
    if (startLeftSide) {
      this.pos = createVector(random(-width * 0.1, 0), random(height * 0.1, height * 0.9));
      this.vel = createVector(random(0.8, 2.0), random(-0.2, 0.2));
    } else {
      this.pos = createVector(random(width, width * 1.1), random(height * 0.1, height * 0.9));
      this.vel = createVector(random(-2.0, -0.8), random(-0.2, 0.2));
    }
    this.seed = random(1000);
    let colors = [
      color(255, 173, 173, 150), color(255, 214, 165, 150), color(253, 255, 182, 150),
      color(202, 255, 191, 150), color(155, 246, 255, 150), color(189, 178, 255, 150),
      color(255, 198, 255, 150)
    ];
    this.clr = random(colors);
  }

  update() {
    this.pos.add(this.vel);
    this.pos.y += sin(frameCount * 0.02 + this.seed) * 0.2;
    let margin = width * 0.15;
    if (this.vel.x > 0 && this.pos.x > width + margin) {
      this.pos.x = -margin;
      this.pos.y = random(height * 0.1, height * 0.9);
    } else if (this.vel.x < 0 && this.pos.x < -margin) {
      this.pos.x = width + margin;
      this.pos.y = random(height * 0.1, height * 0.9);
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.x < 0) scale(-1, 1); 
    noStroke();
    fill(this.clr);
    ellipse(0, 0, this.w, this.h);
    fill(red(this.clr), green(this.clr), blue(this.clr), 100);
    let tailWave = sin(frameCount * 0.1 + this.seed) * this.h * 0.3;
    let tailSize = this.w * 0.35;
    let tailX = -this.w * 0.45;
    beginShape();
    vertex(tailX, 0);
    vertex(tailX - tailSize, -tailSize/2 + tailWave);
    vertex(tailX - tailSize * 0.7, tailWave * 0.3);
    vertex(tailX - tailSize, tailSize/2 - tailWave);
    endShape(CLOSE);
    fill(0, 200);
    circle(this.w * 0.3, -this.h * 0.1, this.h * 0.2);
    pop();
  }
}

function drawWaterReflections() {
  noStroke();
  fill(255, 30);
  for (let i = 0; i < 4; i++) {
    let x = (noise(i, frameCount * 0.001) * width * 1.5) - width * 0.25;
    rect(x, 0, 45, height, 22);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}