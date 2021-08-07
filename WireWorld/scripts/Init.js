var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
c.lineWidth = 3;
var keys = [];
var d = new Date();
var millis = d.getTime();
var mouse = {
    leftIsPressed: false,
    rightIsPressed: false,
    x: 0,
    y: 0,
    px: 0,
    py: 0
}
var cam = {
    x: 0,
    y: 0
}
