// setup canvas

const canvas = document.querySelector('canvas');
const scoreCount = document.querySelector('p');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// creating a class for moving objects (ball and the evil circle)
class Shape{
    constructor(x, y, velX, velY){
        this.x = x;
        this.y= y;
        this.velX = velX;
        this.velY = velY;
    }
}

// creating a subclass for balls. They have a random color and a boolean showing if it's alive or not
class Ball extends Shape{
    constructor(x, y, velX, velY, size, color,exists){
        super(x, y, velX, velY);
        this.size = size;
        this.color = color;
        this.exists = true
    }

    // a method to create a ball
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size,0,2*Math.PI);
        ctx.fill();
    }

    // a method to move a ball
    update(){
        // if the ball hits a wall it changes the direction
        if ((this.x+this.size>=width)||(this.x-this.size<=0)){
            this.velX = - (this.velX);
        };
        
        if ((this.y+this.size>=height)||(this.y-this.size<=0)){
            this.velY = - (this.velY);
        };

        this.x += this.velX;
        this.y += this.velY;
    }

    //method checking if two balls collide and describing what to do
    collisionDetect(){
        for (const checkBall of balls){
        //we iterate through the list of all the balls
        //for each ball we see if it 'touches' the inspected one
            if ((this != checkBall)&&checkBall.exists){
                const dx = Math.abs(this.x-checkBall.x);
                const dy = Math.abs(this.y-checkBall.y);
                
                const dist = Math.sqrt(dx**2 + dy**2);

                if (dist<(this.size+checkBall.size)){
                    // if they do touch - we change the color of both
                    this.color=checkBall.color=randomRGB();
                    //     ADD MOMENTUM EQUATION
                }
            }
        }
    }

}

// creating a subclass for an evil circle
class evilCircle extends Shape{
    constructor(x,y){
        super(x,y, 30, 30);
        this.color='white';
        this.size=10;

        window.addEventListener('keydown', (e)=>{
            switch(e.key) {
                case "ArrowUp":
                    this.y-=this.velY;
                    break;
                case "ArrowLeft":
                    this.x-=this.velX;
                    break;
                case "ArrowDown":
                    this.y+=this.velY;
                    break;
                case "ArrowRight":
                    this.x+=this.velX;
                    break;      
            }
        });
    }

    // a method to create the circle
    draw(){
        ctx.beginPath();
        ctx.lineWidth=4;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size,0,2*Math.PI);
        ctx.stroke();
    }

    //a method to make the ball bounce back from the edges of the screen
    checkBounds(){
        if (this.x+this.size>=width){
            this.x-=this.size;
        };

        if (this.x-this.size<=0){
            this.x+=this.size;
        };
        
        if (this.y+this.size>=height){
            this.y-=this.size;
        };
        
        if (this.y-this.size<=0){
            this.y+=this.size;
        };
    }


    collisionDetect(){
        //  if the circle touches the ball - the ball ceises to exist
        for (const checkBall of balls){
            if (checkBall.exists) {
                const dx = Math.abs(this.x-checkBall.x);
                const dy = Math.abs(this.y-checkBall.y);
                
                const dist = Math.sqrt(dx**2 + dy**2);

                if (dist<(this.size+checkBall.size)){
                  checkBall.exists=false;

                }
            }
        }
    }   
}

const ballNum = 20; // <<<<<<< EDITABLE number of balls

//creating all the balls
const balls = [];
while (balls.length < ballNum){
    const size = random (10,20);
    const color = randomRGB();
    const newBall = new Ball(
        random(size,width-size),
        random(size,height-size),
        random(-10,10),
        random(-10,10),
        size,
        color);
    balls.push(newBall);
}

const evil = new evilCircle(random(0,50), random(0,50));

//creating the timer
let startTime =  Date.now();
//the looping function that gets the game going
function loop(){
    // every loop we recalculate how many balls are alive
    let alive = 0
    // repainting the canvas with 25% transparancy to make the traces of the balls visible
    ctx.fillStyle='rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);
    //iterationg through the balls uodating the location of every alive one and counting them
    for (const ball of balls){
        if (ball.exists){
            ball.update();
            ball.collisionDetect();
            ball.draw();
            alive++;
        }
    };
    //Calculating the current time
    let currentTime = (Math.round((Date.now() - startTime)/1000)).toString();
    //updating the text with the score
    scoreCount.textContent=`You caught ${ballNum-alive} balls - ${alive} left!\nCurrent time: ${currentTime} seconds.`;
    //updating the evil circle
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();
    requestAnimationFrame(loop); //get the loop going
    if (alive === 0){
        //Victory message
        alert(`Congrats! Your time is ${currentTime} seconds!\n\nWanna start a new game?`);
        //reload the page to prevent being stuck on the victory message
        location.reload()
    }
}

loop();