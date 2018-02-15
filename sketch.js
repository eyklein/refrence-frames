var stopWatch;
var tree, car, airPlane;
//var RF="g";
//var RFDraw;



var start=false;
var updateOnce=false;
var showVelocity=false;
var refrenceFrame;
function setup() {
  createCanvas(1000,1000);
  background(0);
  
  stopWatch=new StopWatch();

  
  tree=new PhysicalObject("tree", createVector(400,400),createVector(0,0),createVector(0,0), drawTree)
  road=new PhysicalObject("road", createVector(0,400),createVector(0,0),createVector(0,0), drawRoad)
  car=new PhysicalObject("car", createVector(700,400),createVector(-20,0),createVector(0,0), drawCar)
  airPlane = new PhysicalObject("plane", createVector(500,200),createVector(200,0),createVector(0,0), drawPlane)
  
  refrenceFrame=new RefrenceFrame(tree);
  road.display();
  tree.display();
  car.display();
  
  airPlane.display();
  
  
  startButton=createButton("Start");
  startButton.position(0,50);
  startButton.mousePressed(function(){
    start=!start;
    stopWatch.setZero();
    
    if(start){
      startButton.getCaptionLabel="Stop";
    }else{
      startButton.getCaptionLabel="Start";
    }
  })
  
  velButton=createButton("Show Velocity");
  velButton.position(50,50);
  velButton.mousePressed(function(){
    showVelocity=!showVelocity;
    updateOnce=true;
    stopWatch.setZero();
  })
  
  groundButton=createButton("Ground Refrence Frame");
  groundButton.position(0,0);
  groundButton.mousePressed(function(){
    //RF="g";
    refrenceFrame.switchTracking(tree);
    updateOnce=true;
    stopWatch.setZero();
  })
  carButton=createButton("Car Refrence Frame");
  carButton.position(200,0);
  carButton.mousePressed(function(){
    //RF="c";
    refrenceFrame.switchTracking(car);
    updateOnce=true;
    stopWatch.setZero();
  })
  planeButton=createButton("Plane Refrence Frame");
  planeButton.position(400,0);
  planeButton.mousePressed(function(){
    //RF="p";
    refrenceFrame.switchTracking(airPlane);
    updateOnce=true;
    stopWatch.setZero();
  })
  
  
}

function draw() {
  if(start || updateOnce){
    background(0);
    
    stopWatch.update();
    car.update();
    airPlane.update();
    
    
    refrenceFrame.translate();
    
    
    // if(RF=="g"){
    //   translate(-tree.pos.x+tree.posInital.x,0)
    //   console.log("g")
    // }else if(RF=="c"){
    //   translate(-car.pos.x+car.posInital.x,0)
    //   console.log("c")
    // }else if(RF=="p"){
    //   translate(-plane.pos.x+plane.posInital.x,0)
    //   console.log("p")
    // }
    road.display();
    tree.display();
    car.display();
    airPlane.display();
    updateOnce=false;
  }
  
  
}

function StopWatch(){
  
  this.deltaTime=0;
  this.lastTime;
  this.deltaTimeSec=0;
  
  this.setZero=function(){
    this.deltaTime=0;
    this.lastTime=millis();
    this.deltaTimeSec=0;
    
  }
  
  
  this.update=function(){
    if(!this.lastTime){
      this.lastTime=millis();
    }
    
    
    var curTime=millis();
    this.deltaTime=curTime-this.lastTime;
    this.deltaTimeSec=this.deltaTime/1000;
    this.lastTime=curTime;
    
  }
}

function PhysicalObject(_name, _pos, _vel, _acc, _drawing, _parent){
  this.name=_name;
  this.posInital=createVector(_pos.x,_pos.y);
  this.pos=_pos;
  this.vel=_vel;
  this.acc=_acc;
  this.drawing=_drawing;
  
  this.parentObj=_parent;

  this.getRefFrameVel=function(){
    if(this.parentObj){
      // print(this.vel.x+this.parentObj.vel.x)
      // print(this.vel.y+this.parentObj.vel.y)
      
      var myVec = createVector(this.vel.x+this.parentObj.vel.x,this.vel.y+this.parentObj.vel.y);
      print(myVec.x + " ? " + myVec.y)
      return myVec;
    }else{
      return this.vel;
    }
  }
  
  this.update=function(){
    if(stopWatch.deltaTime){
      
      //this.pos.x=this.pos.x+this.getRelativeVel().x*stopWatch.deltaTimeSec;\
      
      
      
      //this.pos.x=this.pos.x+this.vel.x*stopWatch.deltaTimeSec;
      
      this.pos.x=this.pos.x+this.getRefFrameVel().x*stopWatch.deltaTimeSec;
      
    }

  }
  
  
  
  this.getRelativeVel=function(){
    
    return this.getRefFrameVel().x-refrenceFrame.trackingRefrence.getRefFrameVel().x;
  }
  
  this.display=function(){
    push();
    translate(this.pos.x,this.pos.y);
    this.drawing()
    
    if(this == refrenceFrame.trackingRefrence)
    refrenceFrame.display();
    
    if(showVelocity){
      noStroke()
      fill(20,20,250);
      var myVel = this.getRelativeVel();
      textAlign(CENTER);
      text(myVel,0,40);
      
      ellipse(0,45,4,4);
      stroke(20,20,250);
      line(0,45,myVel,45)
      translate(myVel,0)
      triangle(0,45,-abs(myVel)/myVel*5,50,-abs(myVel)/myVel*5,40)
    }
    
    pop();
  }
}


function RefrenceFrame(_trackerObj){
  
  //this.position;
  
  this.trackingRefrence=_trackerObj;
  
  this.switchTracking=function(_trackerObj){
    this.trackingRefrence=_trackerObj;
  }
  
  this.translate=function(){
    
    translate(-this.trackingRefrence.pos.x+this.trackingRefrence.posInital.x,0)
  }
  
  this.display=function(){
    stroke(200,0,0);
    line(0,0,60,0);
    triangle(60,-5,65,0,60,5);
    line(0,0,0,-60);
    triangle(-5,-60,0,-65,5,-60);
  }
}


