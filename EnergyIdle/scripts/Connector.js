import Utils from "/scripts/Utils.js";

export class Connector {
    static maxTransfer = 1;
    static transferRate = 5;

    constructor(node) {
        this.inputNode = node;
        this.outputNode = {pos: {x: Utils.mouse.x, y: Utils.mouse.y}, radius: 0};
        this.isPlaced = false;
        this.energy = 0;
        this.lightUp = 0;
        this.timestamp = 0;
    }

    update() {
        if(!this.isPlaced) {
            this.outputNode.pos.x = Utils.mouse.x;
            this.outputNode.pos.y = Utils.mouse.y;
        } else if(Utils.millis >= this.timestamp){
            this.timestamp = Utils.millis + 1000 / Connector.transferRate;
            Connector.transferEnergy(this);
        }
        if(this.lightUp) this.lightUp -= 0.1;
    }

    static transferEnergy(connector) {
        if(connector.inputNode.energy > 0) {
            if(connector.inputNode.energy < this.maxTransfer) {
                connector.energy += connector.inputNode.energy;
                connector.inputNode.energy = 0;
                connector.lightUp = 1;
            } else {
                connector.energy += this.maxTransfer;
                connector.inputNode.energy -= this.maxTransfer;
                connector.lightUp = 1;
            }

            connector.energy -= connector.outputNode.transferEnergy(connector.energy);
        }
    }

    connect(node) {
        this.outputNode = node;
        this.isPlaced = true;
    }

    render() {
        Utils.c.beginPath();
        Utils.c.moveTo(this.inputNode.pos.x, this.inputNode.pos.y);
        Utils.c.lineTo(this.outputNode.pos.x, this.outputNode.pos.y);
        Utils.c.lineWidth = 15;
        Utils.c.strokeStyle = "rgb(200, 200, 200)";
        Utils.c.stroke();
        Utils.c.lineWidth = 5;
        Utils.c.strokeStyle = "rgb(150, 150, 150)";
        Utils.c.stroke();
        if(this.lightUp) {
            Utils.c.strokeStyle = "rgba(255, 255, 0, " + this.lightUp + ")";
            Utils.c.stroke();
        }

        Utils.c.fillStyle = "rgb(175, 175, 175)"
        Utils.c.save();
        Utils.c.translate(this.inputNode.pos.x, this.inputNode.pos.y);
        Utils.c.rotate((0.5 * Math.PI) + Math.atan2(-(this.inputNode.pos.x - this.outputNode.pos.x), this.inputNode.pos.y - this.outputNode.pos.y));
        Utils.c.fillRect(5-this.inputNode.radius, -10, -10, 20);
        Utils.c.resetTransform();
        Utils.c.translate(this.outputNode.pos.x, this.outputNode.pos.y);
        Utils.c.rotate((0.5 * Math.PI) + Math.atan2(-(this.outputNode.pos.x - this.inputNode.pos.x), this.outputNode.pos.y - this.inputNode.pos.y));
        Utils.c.fillRect(5-this.outputNode.radius, -10, -10, 20);
        Utils.c.restore();
    }
}
