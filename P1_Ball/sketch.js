// Nathan Ellis 2/7/2025
// THE PLAN IS SIMPLE:
// create array for blocks
// create paddle and ball
// paddle movement with A and D keys
// collision detection between ball and other objects
// collision detection between ball and walls
// overall game score

// game score
let score = 0;
let blocksBroken = 0;

class pongBall {
  // constructor
  constructor(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.collidingx = false;
    this.collidingy = false;
    this.long = 20;
    this.tall = 20;
  }
  
  // update the ball
  update(){
    // collide with walls
    if(abs(this.x - 300) >= 290){
      this.collidingx = true;
    }
    if(this.y <= 10){
      this.collidingy = true;
    }
    if (this.y >= 400){
      // reset
      score -= 5;
      this.x = 300;
      this.y = 200;
      this.dx = -3;
      this.dy = 3;
      this.collidingx = false;
      this.collidingy = false;
    }
    
    // check for collision in x
    if(this.collidingx){
      // flip x direction
      this.dx = this.dx * -1;
      this.collidingx = false;
    }
    
    // check for collision in y
    if(this.collidingy){
      // flip y direction
      this.dy = this.dy * -1;
      this.collidingy = false;
    }
    
    // update position
    this.x += this.dx;
    this.y += this.dy;
    
    // draw ball
    ellipseMode(CENTER);
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.long, this.tall);
  }
}

class breakBlock {
  // constructor
  constructor(x, y, hp, b, s){
    this.x = x;
    this.y = y;
    this.hitPoints = hp;
    this.ball = b;
    this.long = 50;
    this.tall = 30;
    this.colliding = false;
  }
  
  // update
  update(){
    // set fill based on HP
    stroke(255);
    strokeWeight(2);
    fill(0, 30+(this.hitPoints*30), 
         50+(this.hitPoints*50));
    
    // draw block if it is alive
    if(this.hitPoints > 0){
      rectMode(CENTER);
      rect(this.x, this.y, this.long, this.tall);
    }
    
    // check collision with the ball
    checkCollision(this, this.ball);
    
    // lose hp if colliding
    if(this.colliding){
      this.hitPoints -= 1;
      // update score
      if(this.hitPoints <= 0){
        this.y -= 400;
        score++;
        blocksBroken++;
      }
      this.colliding = false;
    }
  }
}

class pongPaddle {
  // constructor
  constructor(cx, cy, b){
    this.x = cx;
    this.y = cy;
    this.ball = b;
    this.long = 100;
    this.tall = 20;
    this.colliding = false;
  }
  
  // update
  update(){
    // check movement
    if(keyIsDown(65) && this.x > 50){
      this.x -= 5;
    } 
    if(keyIsDown(68) && this.x < 550){
      this.x += 5;
    }
    
    // actually draw the paddle
    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.long, this.tall);
    
    // check collision with the ball
    checkCollision(this, this.ball);
    
    // mess with ball x direction
    if(this.colliding){
      this.ball.dx += (this.ball.x - this.x)/12;
      this.colliding = false;
    }
  }
}

// ball
let playerBall = new pongBall(300, 200, -3, 3);

// paddle
let playerPaddle = new pongPaddle(300, 350, playerBall);

// block array
let blockArray = [];

// manually read array size
let arraySize = 0;

function setup() {
  createCanvas(600, 400);
  
  // add blocks to block array
  for(j=50; j<=140; j+=30){
    for(i=25; i<=575; i+=50){
      blockArray.push(new breakBlock(i, j, 3, playerBall));
      arraySize++;
    }
  }
}

function draw() {
  background(50);
  
  // update paddle
  playerPaddle.update();
  
  // update all blocks
  for(i=0; i<arraySize; i++){
    blockArray[i].update();
  }
  
  // countdown to ball spawn
  if(frameCount < 180){
    let countDown = 3 - int(frameCount/60);
    textAlign(CENTER, CENTER);
    textSize(40);
    stroke(255);
    fill(255);
    strokeWeight(1);
    text(str(countDown), 300, 200);
  } else if(blocksBroken < 48) {
    // update ball
    playerBall.update();
  } else {
    textAlign(CENTER, CENTER);
    textSize(40);
    stroke(255);
    fill(255);
    strokeWeight(1);
    text("YOU WIN!", 300, 200);
  }
  
  // display score
  textSize(20);
  textAlign(LEFT, TOP);
  stroke(255);
  strokeWeight(1);
  text("Score: " + str(score), 0, 0);
}

// function to check for collisions
function checkCollision(obj1, obj2){
  // check the distance between the two objects
  if(abs(obj1.y-obj2.y) < (obj1.tall/2)+(obj2.tall/2) &&
     abs(obj1.x-obj2.x) < (obj1.long/2)+(obj2.long/2)){
    obj1.colliding = true;
    if(abs(obj1.y-obj2.y)/(obj1.tall/2)+(obj2.tall/2) >=
       abs(obj1.x-obj2.x)/(obj1.long/2)+(obj2.long/2)){
      obj2.collidingy = true;
    } else {
      obj2.collidingx = true;
    }
  }
}