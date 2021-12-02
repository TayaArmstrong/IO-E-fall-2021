//https://www.openprocessing.org/sketch/157576
let video;
let poseNet;
let poses = [];
let noseX = 0;
let noseY = 0;

var num = 2000;
var noiseScale=500, noiseStrength=1;
var particles = [num];
var man = false;
var manMove = false;
var lastX = 0;
var lastY = 0;
var watch;
var vel;
var d;  //direction change 

function setup() {
  let cnv = createCanvas(windowWidth - 20, windowHeight - 20);
  cnv.position(10, 10);
  noStroke();
  for (let i=0; i<num; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    var loc = createVector(random(width*1.2), random(height), 2);
    var angle = 0; //any value to initialize
    var dir = createVector(cos(angle), sin(angle));
    var speed = random(0.5,2);
    //var speed = random(5,map(mouseX,0,width,5,20));   // faster
    particles[i]= new Particle(loc, dir, speed);
  }

   // load up your video
   video = createCapture(VIDEO);
   video.size(width, height);
   //video.scale(-1, 1);
 
   // Create a new poseNet method with a single detection
   poseNet = ml5.poseNet(video, modelReady);
   // Hide the video element, and just show the canvas
   video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
  poseNet.on('pose', gotPose);
  // This sets up an event that fills the global variable "poses"
}

function gotPose(results) {
  poses = results;
  
  // with an array every time new poses are detected
  if (! poses || poses.length < 1) return;
  //leave this function if the results don't look right
  //console.log(poses[0].pose.nose.x);
  noseX = width - poses[0].pose.nose.x;
  noseY = poses[0].pose.nose.y;
}

function windowResized() {
  resizeCanvas(windowWidth - 20, windowHeight - 20);
}
function draw() {
  //scale(-1, 1);
  //image(video, 0, 0, width, height);
  //scale(-1, 1);
  // background(0);
  fill(30,112,108, 70);
  noStroke();
  rect(0, 0, width, height);
  //make the ellipse follow your mouse 
  if (noseX > 0 && noseY > 0 && noseX < width && noseY < height){
    fill (0);
    man = true;
    if (noseX - lastX != 0 && noseY - lastY != 0){
      manMove = true;
      fill (255);
    }
    else{
      manMove = false;
    }
    //textSize(32);
    //text(str(watch), 10, 30);
    //ellipse(mouseX,mouseY,20,20);
    ellipse(noseX,noseY,20,20);
    lastX = noseX;
    lastY = noseY;
  }
  else {
    man = false;
    manMove = false;
  }
  
  for (let i=0; i<particles.length; i++) {
    particles[i].run();
  }
}

class Particle{
  constructor(_loc,_dir,_speed){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
  	// var col;
  }
  run() {
    this.move();
    this.checkEdges();
    this.update();
  }
  move(){
    if (man == true){
      let angle=noise(noseX/noiseScale, noseY/noiseScale, frameCount/noiseScale)*TWO_PI*noiseStrength; //0-2PI
    var delX = noseX - this.loc.x;
    var delY = noseY - this.loc.y;
    var dis = sqrt(delX*delX + delY*delY);
    //translate(mouseX, mouseY);
    //translate(p5.Vector.fromAngle(millis() / 1000, 5 ));
     //this.dir.x = cos(angle);
     //this.dir.y = sin(angle);
    this.dir.x = (noseX - this.loc.x)* 0.005;
    this.dir.y = (noseY - this.loc.y)* 0.005;
    //var vel = this.dir.copy();
    //var d =0.5;  //direction change
    vel = this.dir.copy();
    d =0.5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel;
    }
    else{
    let angle=noise(this.loc.x/noiseScale, this.loc.y/noiseScale, frameCount/noiseScale)*TWO_PI*noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    vel = this.dir.copy();
    d =1;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
      }
  }
  checkEdges(){
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.loc.x<0 || this.loc.x>width || this.loc.y<0 || this.loc.y>height) {    
      this.loc.x = random(width*1.2);
      this.loc.y = random(height*3);
    }
  }
  update(){
    fill(255);
    //ellipse(this.loc.x, this.loc.y, this.loc.z);
    ellipse(this.loc.x, this.loc.y, 4, 4);
  }
}


