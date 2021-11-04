let video;
let poseNet;
let poses = [];
let noseX = 0;
let noseY = 0;
var osc, fft;

function setup() {
  createCanvas(640, 480);
  
  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(.1);

  fft = new p5.FFT();
  osc.start();

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);

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
  noseX = poses[0].pose.nose.x;
  noseY = poses[0].pose.nose.y;
}

function draw() {
  image(video, 0, 0, width, height);
  fill(255,0,0);
   // change oscillator frequency based on mouseX
  var freq = map(noseX, 0, width, -50, 400);
  osc.freq(freq);
  var amp = map(noseY, 0, height, 4, 0.5);
  osc.amp(amp);
  ellipse(noseX, noseY, 20,20);
}
