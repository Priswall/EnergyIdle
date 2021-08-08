import * as Nodes from "/scripts/Node.js";
import Utils from "/scripts/Utils.js";
import Game from "/scripts/Game.js";

var HUD = {
    selectedNode: undefined,
    update: function() {
        if(this.selectedNode) {
            this.selectedNode.pos = {x: Utils.mouse.realX, y: Utils.mouse.realY};
            if(!Utils.mouse.leftIsPressed) {
                this.selectedNode.pos = {x: Utils.mouse.x, y: Utils.mouse.y};
                Game.nodes.unshift(this.selectedNode);
                this.selectedNode = undefined;
            }
        }
        if(!this.selectedNode && Utils.dist(Utils.mouse.realX, Utils.mouse.realY, canvas.width / 2 - 45, canvas.height - 60) < 45 && Utils.mouse.leftIsPressed) {
            this.selectedNode = new Nodes.EnergyMaker(Utils.mouse.x, Utils.mouse.y);
        }
        if(!this.selectedNode && Utils.dist(Utils.mouse.realX, Utils.mouse.realY, canvas.width / 2 + 45, canvas.height - 60) < 45 && Utils.mouse.leftIsPressed) {
            this.selectedNode = new Nodes.EnergySplitter(Utils.mouse.x, Utils.mouse.y);
        }
    },
    render: function() {
        Utils.c.lineWidth = 4
        Utils.c.fillStyle = "rgb(255, 190, 0)";
        Utils.c.strokeStyle = "rgb(255, 255, 0)";
        Utils.c.beginPath();
        Utils.c.arc(canvas.width / 2 - 45, canvas.height - 60, 40, 0, 2 * Math.PI);
        Utils.c.fill();
        Utils.c.stroke();
        Utils.c.fillStyle = "rgb(200, 150, 150)";
        Utils.c.strokeStyle = "rgb(255, 200, 200)";
        Utils.c.beginPath();
        Utils.c.arc(canvas.width / 2 + 45, canvas.height - 60, 40, 0, 2 * Math.PI);
        Utils.c.fill();
        Utils.c.stroke();
        if(this.selectedNode) this.selectedNode.render();
    }
}

export default HUD;
