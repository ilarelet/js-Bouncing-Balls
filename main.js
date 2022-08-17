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

class Shape{
    constructor(x, y, velX, velY){
        this.x = x;
        this.y= y;
        this.velX = velX;
        this.velY = velY;
    }
}


class Ball extends Shape{
    constructor(x, y, velX, velY, size, color,exists){
        super(x, y, velX, velY);
        this.size = size;
        this.color = color;
        this.exists = true
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size,0,2*Math.PI);
        ctx.fill();
    }

    update(){
        if ((this.x+this.size>=width)||(this.x-this.size<=0)){
            this.velX = - (this.velX);
        };
        
        if ((this.y+this.size>=height)||(this.y-this.size<=0)){
            this.velY = - (this.velY);
        };

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect(){
        for (const checkBall of balls){
            if ((this != checkBall)&&checkBall.exists){
                const dx = Math.abs(this.x-checkBall.x);
                const dy = Math.abs(this.y-checkBall.y);
                
                const dist = Math.sqrt(dx**2 + dy**2);

                if (dist<(this.size+checkBall.size)){
                  this.color=checkBall.color=randomRGB();
                }
            }
        }
    }

}

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

    draw(){
        ctx.beginPath();
        ctx.lineWidth=4;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size,0,2*Math.PI);
        ctx.stroke();
    }

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

const ballNum = 20;

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

let timer = 0;

function loop(){

    let alive = 0

    ctx.fillStyle='rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);
    
    for (const ball of balls){
        if (ball.exists){
            ball.update();
            ball.collisionDetect();
            ball.draw();
            alive++;
        }
    };

   scoreCount.textContent=`You caught ${ballNum-alive} balls - ${alive} left!\nYour loser score is ${Math.floor(timer/10)}`;

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);
    timer += 1;

    if (alive === 0){
        alert(`Congrats! Your loser score is ${Math.floor(timer/10)}`);
    }

}

loop();