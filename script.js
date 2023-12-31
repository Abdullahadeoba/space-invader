var canvas;
var ctx;
var width = 1008;
var height = 654;
//enemy variables
var enemy_x = 40;
var enemy_y = -130;
var enemy_width = 52;
var enemy_height = 112;
var enemyNo = 8;
var enemyArray = [];
var ppf = 1;
// shuttle variables
var shuttle_width = 86;
var shuttle_height = 148;
var shuttle_x = (width/2)-(shuttle_width/2);
var shuttle_y = height-shuttle_height-30;
var sppf = 4;
//buttons
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var bulletArray=[];
//sound
var explode = new Audio('Audio/explosion.wav');
var laser = new Audio('Audio/laser.mp3');
var background = new Audio('Audio/background.mp3');
var lose = new Audio('Audio/lose.mp3');
var scoreBoard;
//var dead = false;
var livesLeft = document.getElementById('live');
var playLevel = document.getElementById("level");
var enemy_reset_x = 50;
var nameEntered = document.getElementById('playerName');
for(var i=0; i<enemyNo; i++){
	enemyArray.push([enemy_x, enemy_y, enemy_width, enemy_height, ppf]);
	enemy_x +=enemy_width+65;
}
function begin(){
	background.loop=true;
	background.play();
	name = prompt("please enter your name below");
	nameEntered.innerHTML = name;
	if(name==""){
	nameEntered.innerHTML = "Anonymous";
	}
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	shuttleImg = new Image();
	shuttleImg.src = 'images/shuttle.jpeg';
	enemyImg = new Image();
	enemyImg.src = 'images/character.jpeg';
	scoreBoard= document.getElementById("score")
	scoreBoard.innerHTML = 0;
	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);
}
function keyDownHandler(e){
	if(e.keyCode==39){
		rightPressed=true;
	}else if(e.keyCode==37){
		leftPressed=true;
	}
	if(e.keyCode == 38){
		upPressed = true;
	}else if(e.keyCode == 40){
		downPressed = true
	}
	if(e.keyCode == 32){
		bulletArray.push([shuttle_x+(shuttle_width/2)-3, shuttle_y-34, 5,30]);
		laser.play();
	}
}
function keyUpHandler(e){
	if(e.keyCode==39){
		rightPressed=false;
	}else if(e.keyCode==37){
		leftPressed=false;
	}
	if(e.keyCode==38){
		upPressed=false;
	}else if(e.keyCode==40){
		downPressed = false;
	}
	
}
function moveShuttle(){
	if(rightPressed  && shuttle_x<(width-shuttle_width)){
		shuttle_x +=sppf;
	}else if(leftPressed && shuttle_x>0){
		shuttle_x -=sppf;
	}
	if(upPressed && shuttle_y>height/4){
		shuttle_y -=sppf;
	}else if(downPressed && shuttle_y<(height-shuttle_height)){
		shuttle_y +=sppf;
	}
}
function drawShuttle(){
	ctx.drawImage(shuttleImg,shuttle_x,shuttle_y);
	moveShuttle();
}
function drawBullet(){
	for(var i=0; i<bulletArray.length; i++){
		ctx.fillStyle = "red";
		ctx.fillRect(bulletArray[i][0], bulletArray[i][1], bulletArray[i][2], bulletArray[i][3]);
		if(bulletArray[i][1]>-35){
			bulletArray[i][1] -= 10;
		}
	}
}
function hitBullet(){
	for(var i=0; i<bulletArray.length; i++){
		for(var j=0; j<enemyArray.length; j++){
			if(bulletArray[i][0]>=enemyArray[j][0] && bulletArray[i][0]<=enemyArray[j][2]+enemyArray[j][0] && bulletArray[i][1]<=enemyArray[j][1]+enemyArray[j][2] && bulletArray[i][1]>=enemyArray[j][1]){
				//remove = true;
				enemyArray.splice(j,1);
				enemyArray.push([(Math.random()*800), -130, enemy_width, enemy_height,ppf]);
				//if(remove==true){
				bulletArray.splice(i,1);
				//remove=false;
				scoreBoard.innerHTML=parseInt(scoreBoard.innerHTML)+5;
				//}
			}
		}
	}
}

function shuttleCollide(){
	for(var i=0; i<enemyArray.length; i++){
	if(shuttle_x>enemyArray[i][0] && shuttle_x+22<=enemyArray[i][0]+enemy_width && shuttle_y+40<enemyArray[i][1]+enemyArray[i][3] && shuttle_y+shuttle_height>enemyArray[i][1]){
		checkLife();
		
	}else if(shuttle_x+shuttle_width-20>enemyArray[i][0]&&shuttle_x<enemyArray[i][0] && shuttle_y+40<enemyArray[i][1]+enemyArray[i][3] && shuttle_y+shuttle_height>enemyArray[i][1]){
		checkLife();
	}
	
	//head-on collision

}
}

function checkLife(){
	highScore = document.getElementById("highScore");
	if(livesLeft.innerHTML>1){
		explode.loop =false;
		explode.play();
		livesLeft.innerHTML -=1;
		repositioning();
}else if(livesLeft.innerHTML==1){
		//livesLeft.innerHTML = 0;
		//location.reload();
		livesLeft.innerHTML=3;
		lose.play();
		repositioning();
		if(parseInt(scoreBoard.innerHTML)>parseInt(highScore.innerHTML)){
			highScore.innerHTML = parseInt(scoreBoard.innerHTML);
		}
		scoreBoard.innerHTML=0;	
	}

}
function repositioning(){
	shuttle_x = (width/2)-(shuttle_width/2);
	shuttle_y = height-shuttle_height-30;
 for (var i = 0; i < enemyArray.length; i++) {
 		enemyArray[i][0]+=0;
 		enemyArray[i][1] = -130;
 		enemyArray[i][2] = 52;
 		enemyArray[i][3] = 112;
 		enemyArray[i][4]=1;

	}
}

function clearCanvas(){
	ctx.clearRect(0,0, width, height);
}
function drawEnemy(){
	for(var i=0; i<enemyArray.length; i++){
	ctx.drawImage(enemyImg, enemyArray[i][0], enemyArray[i][1]);
}
}
function moveEnemy(){
	for(var i=0; i<enemyArray.length; i++){
		if(enemyArray[i][1] < height){
			enemyArray[i][1] += enemyArray[i][4];
		}else if(enemyArray[i][1] > height-1){
			enemyArray[i][1] = -130;
		}
	}
}

function level(){
	if(scoreBoard.innerHTML>=1000 && scoreBoard.innerHTML<1800){
		playLevel.innerHTML = 2;
		ppf=2;
		sppf=5
	}else if(scoreBoard.innerHTML>=1800){
		playLevel.innerHTML = 3;
		ppf=5;
		sppf=7;
	}else{
		playLevel.innerHTML = 1;
		ppf=1;
		sppf=4;
	}
}

function home(){
	clearCanvas();
	//if(dead==false){
	drawShuttle();
	drawEnemy();
	moveEnemy();
	drawBullet();
	hitBullet();
	shuttleCollide();
	level();
//}	
}
setInterval(home,20);
window.onload = begin();
