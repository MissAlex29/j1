//Se declaran variables para el estado de juego
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Variables para Trex y para el suelo
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//Variables para nubes y obstáculos 
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Variable para el puntaje 
var score=0;

//Variables para reinicio y fin del juego 
var gameOver, restart;

//Variables para sonidos 
var jumpSound , checkPointSound, dieSound;

//Función de precarga 
function preload(){
  //Cargar imágenes Trex animado 
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //Cargar imágenes del suelo 
  groundImage = loadImage("ground2.png");
  
  //Cargar imágenes de nubes 
  cloudImage = loadImage("cloud.png");
  
  //Cargar imágenes de obstáulos 
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //Cargar imagen de reinicio y fin del juego
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  //Cargar sonidos 
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Objeto Trex 
  
  trex = createSprite(50,height-70,20,50);
  
  //Asignar animación al objeto de Trex 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //Objeto para suelo 
  ground = createSprite(width/2,height-70,width,2);
  
  //Asignar animación al suelo y modo infinito 
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
   //Se escalan los objetos 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //Se establece visibilidad de los objetos 
  gameOver.visible = false;
  restart.visible = false;
  
   //Objeto para suelo incvisible 
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.visible = false;
  
  //Grupos de obtaculos y nubes
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //Configuración del colisionador 
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  //Inicialización del puntaje 
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  //Código para aparecer objetos
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-70,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //genera obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
