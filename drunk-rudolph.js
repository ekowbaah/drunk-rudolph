// @ts-nocheck


/* ----- setup ------ */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
video.width = window.innerWidth;
video.height = window.innerHeight;

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})

let body

// when a body is detected get body data
bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0)
})
let counter=0
let midPointMain=0
let shoulderXGlob=0
let isInBalance=false
let angle=1
let yellowX=150;
yellowY=800
yellowX2=150
yellowY2=800
let comingBack=false
let isAnkleRaised=false
let Radius2=150
let leftAnkleGlob={}
let rightAnkleGlob={}
let reset = false
// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {
 
  // draw the video element into the canvas
 ctx.clearRect(0, 0, canvas.width, canvas.height);

  
 // draw nose and eyes
 if (body) {
    const leftHip = body.getBodyPart(bodyParts.leftHip);
    const rightHip = body.getBodyPart(bodyParts.rightHip);
    
    const leftShoulder = body.getBodyPart(bodyParts.leftShoulder);
    const rightShoulder = body.getBodyPart(bodyParts.rightShoulder);
   
    const leftAnkle = body.getBodyPart(bodyParts.leftAnkle);
    const rightAnkle = body.getBodyPart(bodyParts.rightAnkle);

    leftAnkleGlob=leftAnkle;
    rightAnkleGlob=rightAnkle;
    
    let Radius= 150

   const leftShoulderXFlipped = window.innerWidth - leftShoulder.position.x;
   const rightShoulderXFlipped = window.innerWidth - rightShoulder.position.x;

   const leftHipXFlipped = window.innerWidth - leftHip.position.x;
   const rightHipXFlipped = window.innerWidth - rightHip.position.x;

   const shoulderX = (leftShoulderXFlipped + rightShoulderXFlipped) / 2;
   shoulderXGlob=shoulderX
   const hipX = (leftHipXFlipped + rightHipXFlipped) / 2;

  let midPoint = (shoulderX + hipX) / 2;

  midPointMain=midPoint




  if(isAnkleRaised){
    yellowX=shoulderX
    yellowY=300
    if(isInBalance){
      angle=angle+Math.PI / 220;
      Radius2=150* Math.abs(Math.cos(angle));
    }
    else{
      Radius2=150
    }
  }

    if(yellowY==300){
      reset=true
    }
  if(!isAnkleRaised){
    if (reset){
    yellowX=150
    yellowY=800
    Radius2=150
    reset=false
    }
  if (yellowX==canvas.width-Radius){
    comingBack=true
    yellowY=799
  }
  if(comingBack){
    yellowX=yellowX-5
  }
  if(yellowY==800){
    yellowX=yellowX+5
  }
  if(yellowX==Radius){
    yellowY=800
    comingBack=false
  }
 
}


   ctx.beginPath();
   ctx.arc(720, 300, Radius, 0, 2 * Math.PI);
   ctx.fillStyle = 'purple';
   ctx.fill();

   ctx.beginPath();
   ctx.arc(yellowX, yellowY, Radius2, 0, 2 * Math.PI);
   ctx.fillStyle = 'yellow';
   ctx.fill();
    



 }
  window.requestAnimationFrame(drawCameraIntoCanvas);
  
}

function checkBalance(){
  if(midPointMain < 780 && midPointMain > 700){
    counter++
    if(counter==3){
      isInBalance=true
      console.log(' I balanced for 3 seconds')
    counter=0
    
    }
}
  else{
    counter=0
    isInBalance=false
  }

}

function ankleIsRaised(){
  if (leftAnkleGlob.confidenceScore>0.5 && rightAnkleGlob.confidenceScore>0.5){
    if(leftAnkleGlob.position.y-rightAnkleGlob.position.y>70||rightAnkleGlob.position.y-leftAnkleGlob.position.y>70){
      isAnkleRaised= true
    }
  else{
    isAnkleRaised= false
  }

  }

}


var timer= setInterval(checkBalance,1000)
/* ----- run ------ */

timer
var ankle=setInterval(ankleIsRaised,10)
ankle

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();
