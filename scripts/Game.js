import * as Nodes from "/scripts/Node.js";
import Utils from "/scripts/Utils.js";
import HUD from "/scripts/HUD.js";
import {Connector} from "/scripts/Connector.js";

var Game = {
    nodes: [],
    connectors: [],

    init: function() {
        this.nodes[0] = new Nodes.EnergyExporter(canvas.width / 2, canvas.height / 2 - 200);
        this.nodes[1] = new Nodes.EnergyExporter(canvas.width / 2, canvas.height / 2);
        this.nodes[2] = new Nodes.EnergyExporter(canvas.width / 2, canvas.height / 2 + 200);
        return true;
    },

    update: function() {
        HUD.update();
        for(var connector of Game.connectors) {
            connector.update();
        }
        for(var node of Game.nodes) {
            node.update();
            if(Utils.dist(Utils.mouse.x, Utils.mouse.y, node.pos.x, node.pos.y) < node.radius) node.isHovered = true;
            else node.isHovered = false;

            if(Utils.mouse.leftIsPressed) node.isSelected = node.isMouseWithin();

            if(node.isSelected) {
                if(Game.nodes.indexOf(node) < Game.nodes.length - 1) {
                    Game.nodes.push(Game.nodes.splice(Game.nodes.indexOf(node), 1)[0]);
                }
                if(Utils.mouse.x != Utils.mouse.px && Utils.mouse.y != Utils.mouse.py) {
                    node.pos.x = Utils.mouse.x;
                    node.pos.y = Utils.mouse.y;
                }
                for(let input of node.inputs) {
                    if(!input.connector) continue;
                    let connector = input.connector;
                    let dist = Math.sqrt(((connector.inputNode.pos.x - connector.outputNode.pos.x) ** 2) + ((connector.inputNode.pos.y - connector.outputNode.pos.y) ** 2));
                    if(dist > Connector.maxDistance) {
                        let angle = Math.atan2(-(connector.inputNode.pos.x - connector.outputNode.pos.x), connector.inputNode.pos.y - connector.outputNode.pos.y);
                        node.pos.x = connector.inputNode.pos.x + Math.cos(Math.PI * 1.5 + angle) * Connector.maxDistance;
                        node.pos.y = connector.inputNode.pos.y + Math.sin(Math.PI * 1.5 + angle) * Connector.maxDistance;
                    }
                }
                if(!Utils.mouse.leftIsPressed) {
                    for(var output of node.outputs) output.updatePos();
                    for(var input of node.inputs) input.updatePos();
                }
            } else {
                // Keep Nodes from stacking on top of eachother
                for(var otherNode of this.nodes) {
                    if(otherNode != node && !otherNode.isSelected) {
                        while(Math.sqrt(((node.pos.x - otherNode.pos.x) ** 2) + ((node.pos.y - otherNode.pos.y) ** 2)) < node.radius + otherNode.radius + 20) {
                            let angle = Math.atan2(node.pos.x - otherNode.pos.x, node.pos.y - otherNode.pos.y);
                            node.pos.x += Math.sin(angle);
                            node.pos.y += Math.cos(angle);
                        }
                    }
                }
            }

            if(node.connectorInProgress && !Utils.mouse.rightIsPressed) {
                for(var otherNode of Game.nodes) {
                    if(otherNode != node && otherNode.isMouseWithin()) {
                        if(Game.lookForLoop(otherNode.outputs, node)) {
                            node.connectorInProgress = undefined;
                            return;
                        }
                        if(otherNode.connect(node.connectorInProgress)) {
                            Game.connectors.push(node.connectorInProgress);
                            node.outputs.push(node.connectorInProgress);
                            node.connectorInProgress = undefined;
                            return;
                        }
                    }
                }
                node.connectorInProgress = undefined;
            }
        }

        if(Utils.keys[Utils.keybinds.panUp]) {
            if(Utils.keys[Utils.keybinds.speedPan]) Utils.cam.y += 8;
            else Utils.cam.y += 4;
        }
        if(Utils.keys[Utils.keybinds.panDown]) {
            if(Utils.keys[Utils.keybinds.speedPan]) Utils.cam.y -= 8;
            else Utils.cam.y -= 4;
        }
        if(Utils.keys[Utils.keybinds.panLeft]) {
            if(Utils.keys[Utils.keybinds.speedPan]) Utils.cam.x += 8;
            else Utils.cam.x += 4;
        }
        if(Utils.keys[Utils.keybinds.panRight]) {
            if(Utils.keys[Utils.keybinds.speedPan]) Utils.cam.x -= 8;
            else Utils.cam.x -= 4;
        }
    },

    lookForLoop: function(parent, node) {
        for(let connector of parent) {
            if(connector.outputNode == node) return true;
            else if(Game.lookForLoop(connector.outputNode.outputs, node)) return true;
        }
        return false;
    },

    render: function() {
        Utils.c.lineWidth = 3;
        Utils.c.strokeStyle = "rgb(50, 50, 50)";
        for(var i = 0; i < 30; i++) {
            Utils.c.beginPath();
            Utils.c.moveTo(i * 50 + Utils.cam.x % 50, 0);
            Utils.c.lineTo(i * 50 + Utils.cam.x % 50, canvas.height);
            Utils.c.stroke();
            Utils.c.beginPath();
            Utils.c.moveTo(0, i * 50 + Utils.cam.y % 50);
            Utils.c.lineTo(canvas.width, i * 50 + Utils.cam.y % 50);
            Utils.c.stroke();
        }

        Utils.c.save();
        Utils.c.translate(Utils.cam.x, Utils.cam.y);
        for(var connector of this.connectors) {
            connector.render();
        }
        for(var node of this.nodes) {
            node.render();
        }
        Utils.c.restore();
        HUD.render();
    },
};

export default Game
