var canvas = document.getElementById("main_canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
const square_size = 20;
const graphic_inverval = 1;

var bjumping = false;
const max_jump_height = 60; 
window.addEventListener("keydown", (e) => {
    if(event.keyCode == 32){
        console.log("space key entered.");
        bjumping = true;
        console.log("bjumping : " + bjumping);
    }
});
ctx.fillStyle = "#0000FF";
let timerId = setInterval("canvas_timer()", 1);
var moving_case = 0;
var i = 0;
var jump_height = 0;
var bjump_upward = true;
var hurdle_location = [[],[],[],[]] ;
var hurdle_scored = [0];
var m_score = 0;

console.log("initial i : ",i);


[hurdle_location, hurdle_scored] = set_hurdle(canvas, hurdle_location, hurdle_scored);

function canvas_timer(){
    //console.log("i : " + i);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    if(bjumping && bjump_upward){
        jump_height++;
        if(jump_height >= max_jump_height) bjump_upward = false;  
    } else if(bjumping && !bjump_upward){
        jump_height--;
        if(jump_height <= 0){
            bjump_upward = true;
            bjumping = false;
        }
    }
    // console.log(bjumping);
    // console.log(jump_height);
    //console.log(m_score);

    
    draw_hurdle(canvas, ctx, hurdle_location);
    for(var item of hurdle_scored){
        //console.log("item : " + item);
        //console.log(i);
        if(item < i){
            m_score++;
            const idx = hurdle_scored.indexOf(item);
            if (idx > -1) hurdle_scored.splice(idx, 1);
        } 
    }
    //console.log(moving_case);
    switch(moving_case){
        case 0:
            //console.log("i : " + i);
            ctx.fillRect(i,canvas.height - square_size - jump_height, square_size, square_size);
            i+=graphic_inverval;
            if(i >= canvas.width - square_size){
                [hurdle_location, hurdle_scored] = set_hurdle(canvas, hurdle_location, hurdle_scored, moving_case);
                moving_case++;
                i = 0;
                
            }
            break;
        case 1:
            ctx.fillRect(canvas.width - square_size - jump_height,canvas.height - square_size - i, square_size, square_size);
            i+=graphic_inverval;
            if(i >= canvas.height - square_size){
                [hurdle_location, hurdle_scored] = set_hurdle(canvas, hurdle_location, hurdle_scored, moving_case);
                moving_case++;
                i = 0;
            }
            break;
        case 2:
            ctx.fillRect(canvas.width - square_size - i, jump_height, square_size, square_size);
            i+=graphic_inverval;
            if(i >= canvas.width - square_size){
                [hurdle_location, hurdle_scored] = set_hurdle(canvas, hurdle_location, hurdle_scored, moving_case);
                moving_case++;
                i = 0;
            }
            break;
        case 3:
            ctx.fillRect(jump_height,i, square_size, square_size);
            i+=graphic_inverval;
            if(i >= canvas.height - square_size){
                [hurdle_location, hurdle_scored] = set_hurdle(canvas, hurdle_location, hurdle_scored, moving_case);
                moving_case = 0;
                i = 0;
            }
            break;
        default:
            break;

    }


    // for(var i of hurdle_location){
    //     console.log(i);//test
    // }
    //console.log("moving case ",moving_case);
    //console.log("jump ",jump_height);

    var btorchedhurdle =  IsTouchedHurdle(i, hurdle_scored, jump_height,square_size,20/*hurdle_size*/ );
    if(btorchedhurdle){
        //console.log("Game Over!");
        var msg = "Game Over!";
        ctx.fillText(msg, canvas.width/2,canvas.height/2 + 100);
        clearInterval(timerId);
    } else{
        var msg = "현재 점수 : " + m_score + "점";
        ctx.fillText(msg, canvas.width/2,canvas.height/2);
    }
    var msg = "현재 점수 : " + m_score + "점";
    ctx.fillText(msg, canvas.width/2,canvas.height/2);
    
}

function set_hurdle(canvas, hurdle_location, hurdle_scored,  moving_case = -1){
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    var hurdle_num = 4;
    var hurdle_size = 20;
    if(moving_case == -1){
        for(var i = 0; i<4;i++){
            for(var j = 0; j<hurdle_num; j++){
                max_num = i % 2 == 0 ? canvas.width : canvas.height;
                hurdle_location[i][j] = rand(max_num/6, max_num - hurdle_size);
                //console.log("i : ",i, " j : ",j, " ", hurdle_location[i][j]);
                //console.log(hurdle_location[i]);
            }
        }
        hurdle_scored = hurdle_location[0].slice();
        //console.log(hurdle_location);
        //console.log(hurdle_location[0].slice());
        return [hurdle_location, hurdle_scored];
    }

    for(var j = 0; j<hurdle_num; j++){
        max_num = moving_case % 2 == 0 ? canvas.width : canvas.height;
        hurdle_location[moving_case][j] = rand(hurdle_size, max_num - hurdle_size);
    }
    hurdle_scored = hurdle_location[(moving_case + 1) % 4].slice();
    return [hurdle_location, hurdle_scored];
}

function draw_hurdle(canvas, ctx, hurdle_location){
    var hurdle_size = 20;
    ctx.fillStyle = "#FF0000";
    for(var n of hurdle_location[0]){
        ctx.beginPath();
        ctx.moveTo(n, canvas.height);
        ctx.lineTo(n+hurdle_size/2, canvas.height - hurdle_size);
        ctx.lineTo(n+hurdle_size, canvas.height);
        ctx.fill();
        ctx.closePath();
    }
    for(var n of hurdle_location[1]){
        ctx.beginPath();
        ctx.moveTo(canvas.width, canvas.height - n);
        ctx.lineTo(canvas.width-hurdle_size, canvas.height - n - hurdle_size/2);
        ctx.lineTo(canvas.width, canvas.height - n - hurdle_size);
        ctx.fill();
    }
    for(var n of hurdle_location[2]){
        ctx.beginPath();
        ctx.moveTo(canvas.width - n, 0);
        ctx.lineTo(canvas.width - n - hurdle_size/2, hurdle_size);
        ctx.lineTo(canvas.width - n - hurdle_size, 0);
        ctx.fill();
    }
    for(var n of hurdle_location[3]){
        ctx.beginPath();
        ctx.moveTo(0, n);
        ctx.lineTo(hurdle_size, n + hurdle_size/2);
        ctx.lineTo(0, n + hurdle_size);
        ctx.fill();
    }
    ctx.fillStyle = "#0000FF";
}

function IsTouchedHurdle(player_x, arrhurdle_x, jump_y, sq_size, hd_size){
    console.log("player_x : " + player_x, "arrhurdle_x : " + arrhurdle_x);
    console.log("jump_y : " + jump_y, "sq_size : " + sq_size);
    console.log("hd_size : " + hd_size);
    for(var hurdle_x of arrhurdle_x){
        
        if(jump_y < 2*(player_x + sq_size) - 2*(hurdle_x) && jump_y <= hd_size){
            console.log("o? hurdle_x : " + hurdle_x);
                console.log("o??");
                console.log("IsTouchedHurdle true");
                return true;
        } // y < 2x-2n
    }
    return false;
}