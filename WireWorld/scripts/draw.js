function draw() {

    c.fillStyle = "rgb(100, 100, 100)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    for(var connector of connectors) {
        connector.update();
        connector.render();
    }

    for(var tile of tiles) {
        tile.update();
        tile.render();
    }

    c.fillStyle = "black";
    c.fillText(cam.x + ", " + cam.y, 5, 15);
    c.fillText(mouse.x + ", " + mouse.y, 5, 30);

    d = new Date();
    millis = d.getTime();
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    requestAnimationFrame(draw);
}

addEventListener("keydown", e=>{keys[e.keyCode] = true;});
addEventListener("keyup", e=>{keys[e.keyCode] = false;});
addEventListener("contextmenu", e=>{e.preventDefault(); return false;});
addEventListener("mousedown", e=>{
    if(e.which == 1) mouse.leftIsPressed = true;
    else if(e.which == 3) {
        mouse.rightIsPressed = true;
        e.preventDefault();
    }
});
addEventListener("mouseup", e=>{
    if(e.which == 1) mouse.leftIsPressed = false;
    else if(e.which == 3) {
        mouse.rightIsPressed = false;
        e.preventDefault();
    }
});
canvas.addEventListener("mousemove", e=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
requestAnimationFrame(draw);
