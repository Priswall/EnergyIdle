import * as Tiles from "/scripts/Tile.js";
import Utils from "/scripts/Utils.js";

var Game = {
    nodes: [],
    connectors: [],

    init: function() {
        this.nodes[0] = new Tiles.EnergyMaker(50, 50);
        this.nodes[1] = new Tiles.EnergyExporter(150, 150);
        console.log(this.nodes);
        return true;
    },

    update: function() {
        for(var connector of Game.connectors) {
            connector.update();
        }
        for(var node of Game.nodes) {
            node.update();
            if(Math.sqrt(((Utils.mouse.x - node.pos.x) ** 2) + ((Utils.mouse.y - node.pos.y) ** 2)) < node.radius) node.isHovered = true;
            else node.isHovered = false;

            if(node.isSelected) {
                if(Game.nodes.indexOf(node) < Game.nodes.length - 1) {
                    Game.nodes.push(Game.nodes.splice(Game.nodes.indexOf(node), 1)[0]);
                }
                node.pos.x += Utils.mouse.x - Utils.mouse.px;
                node.pos.y += Utils.mouse.y - Utils.mouse.py;
            } else {
                // Keep tiles from stacking on top of eachother
                for(var otherNode of this.nodes) {
                    if(otherNode != node && !otherNode.isSelected) {
                        if(Math.abs(node.pos.x - otherNode.pos.x) + Math.abs(node.pos.y - otherNode.pos.y) < node.radius + otherNode.radius) {
                            let angle = Math.atan2(node.pos.x - otherNode.pos.x, node.pos.y - otherNode.pos.y);
                            node.pos.x += Math.sin(angle) * Math.abs(node.pos.x - otherNode.pos.x);
                            node.pos.y += Math.cos(angle) * Math.abs(node.pos.y - otherNode.pos.y);
                        }
                    }
                }
            }

            if(node.makingConnector && !Utils.mouse.rightIsPressed) {
                for(var otherNode of Game.nodes) {
                    if(otherNode != node && otherNode.isMouseWithin()) {
                        otherNode.connect(node.outputs[node.outputs.length - 1]);
                        Game.connectors.push(node.outputs[node.outputs.length - 1]);
                        return;
                    }
                }
                node.makingConnector = false;
                node.outputs.splice(node.outputs.length - 1, 1);
            }
        }
    },

    render: function() {
        for(var connector of this.connectors) {
            connector.render();
        }
        for(var node of this.nodes) {
            node.render();
        }
    },
};

export default Game
