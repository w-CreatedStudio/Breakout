var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var notBug = 30;
function sleep(msec){
    return new Promise(function(resolve){
        setTimeout(function(){resolve(),msec});
    })
}
async function stop(){
    await sleep(1000);
}

//パドル変数
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = canvas.height-paddleHeight-notBug;
var rightPressed = false;
var leftPressed = false;

//座標関連の変数
var x = canvas.width/2;
var y = paddleY-20;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//ブロック変数
var brickRowCount = 4;           //行数
var brickColumnCount = 7;       //列数
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30

//スコア変数
var score = 0;

//ライフ変数
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(var r=0; r <brickRowCount; r++){
        bricks[c][r] = {x: 0,y: 0,status:1};
    }
}

//マウス操作判定
document.addEventListener("mousemove",mouseMoveHandler,false);
function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX-paddleWidth/2;
        if(paddleX < 0){
            paddleX = 0;
        }else if(paddleX > canvas.width-paddleWidth){
            paddleX = canvas.width-paddleWidth;
        }
    }
}

//キー入力判定
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

//ブロックあたり判定
function collisionDetection(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(x >b.x && x < b.x+brickWidth && y > b.y && y< b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    //クリア後動作
                    if(score == brickRowCount*brickColumnCount){
                        alert("YOU WIN,CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//スコア描画
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score,8,20);
}

//ライフ描画
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives,canvas.width-65,20);
}

//ボール描画
function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
//パドル描画
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,paddleY,paddleWidth,paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//ブロック描画
function drawBricks(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Interval 10ms
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    if(y + dy < ballRadius){
        dy = -dy;
    }else if(y + dy > canvas.height-ballRadius){
        if(y == paddleY && x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }else if(y == 320-ballRadius){
            lives--;
            if(!lives){
                alert("GAME OVER");
                document.location.reload();
            }else{
                stop();
                x = canvas.width/2;
                y = paddleY;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }else if(y == paddleY && x > paddleX && x < paddleX + paddleWidth){
        dy = -dy;
    }
    //パドル動作
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
stop();
draw();