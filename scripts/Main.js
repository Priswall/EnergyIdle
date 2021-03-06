import Game from "/scripts/Game.js";
import Utils from "/scripts/Utils.js";

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var d = new Date();
var money = 0;

function render() {
    if(Game.init()) Game.init = ()=>{return false;};
    if(!Utils.c) {
        Utils.c = canvas.getContext("2d");
        Utils.c.textBaseline = "middle";
    }

    Utils.c.fillStyle = "rgb(100, 100, 100)";
    Utils.c.fillRect(0, 0, canvas.width, canvas.height);

    Utils.c.textAlign = "center";
    Game.render();

    Utils.c.textAlign = "left";
    Utils.c.fillStyle = "black";
    Utils.c.font = "5vw StraightRuler Arial";
    Utils.c.fillText("$" + Utils.money, 5, 45);
    Utils.c.fillText(Game.nodes.length, 5, 95);

    Utils.mouse.leftIsClicked = false;
    Utils.mouse.rightIsClicked = false;

    requestAnimationFrame(render);
}

function update() {
    Game.update();
    d = new Date();
    Utils.millis = d.getTime();
    Utils.mouse.px = Utils.mouse.x;
    Utils.mouse.py = Utils.mouse.y;
    Utils.mouse.x = Utils.mouse.realX - Utils.cam.x;
    Utils.mouse.y = Utils.mouse.realY - Utils.cam.y;
}

addEventListener("keydown", e=>{Utils.keys[e.keyCode] = true;});
addEventListener("keyup", e=>{Utils.keys[e.keyCode] = false;});
addEventListener("contextmenu", e=>{e.preventDefault(); return false;});
addEventListener("mousedown", e=>{
    if(e.which == 1) {
        Utils.mouse.leftIsPressed = true;
        Utils.mouse.leftIsClicked = true;
    } else if(e.which == 3) {
        Utils.mouse.rightIsPressed = true;
        Utils.mouse.rightIsClicked = true;
        e.preventDefault();
    }
});
addEventListener("mouseup", e=>{
    if(e.which == 1) Utils.mouse.leftIsPressed = false;
    else if(e.which == 3) {
        Utils.mouse.rightIsPressed = false;
        e.preventDefault();
    }
});
canvas.addEventListener("mousemove", e=>{
    Utils.mouse.realX = e.clientX;
    Utils.mouse.realY = e.clientY;
});
requestAnimationFrame(render);
setInterval(update, 16)
