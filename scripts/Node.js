import {Connector} from "/scripts/Connector.js";
import Utils from "/scripts/Utils.js";

class Node {
    constructor(x = 0, y = 0, radius = 25, color = "rgb(200, 0, 200)", borderColor = "rgb(255, 255, 255)", text = "Default text", outputs = 0, inputs = 0, maxEnergy = 20, price = 50) {
        this.isHovered = false;
        this.pos = {x: x, y: y};
        this.radius = radius;
        this.color = color;
        this.borderColor = borderColor;
        this.text = text;
        this.outputs = [];
        this.maxOutputs = outputs;
        this.inputs = [];
        this.maxInputs = inputs;
        this.canBeSelected = false;
        this.isSelected = false;
        this.connectorInProgress = undefined;
        this.energy = 0;
        this.maxEnergy = maxEnergy;
        this.borderPercent = 1;
        this.currentOutput = 0;
    }

    connect(connector) {
        if(connector && this.inputs.length < this.maxInputs) {
            if(connector.inputNode == this) {
                this.connectorInProgress = undefined;
            } else {
                this.inputs.push(connector);
                connector.connect(this);
            }
            return true;
        }
        else if(!connector && !this.connectorInProgress && this.outputs.length < this.maxOutputs)
            this.connectorInProgress = new Connector(this);
        return false;
    }

    isMouseWithin() {
        return this.isHovered;
    }

    update() {
        // Determine when the node is selected or not
        if(this.isMouseWithin()) {
            if(!Utils.mouse.leftIsPressed && !Utils.mouse.rightIsPressed) this.canBeSelected = true;
            if(Utils.mouse.leftIsPressed && this.canBeSelected) this.isSelected = true;
            else if(Utils.mouse.rightIsPressed && this.canBeSelected) this.connect();
            else this.isSelected = false;
        }else if(!this.isSelected) {
            this.canBeSelected = false;
        }

        if(this.outputs.length > 0 && this.outputs[this.currentOutput].canTransfer) {
            if(Connector.transferEnergy(this.outputs[this.currentOutput]))
                this.currentOutput = (this.currentOutput + 1) % this.outputs.length;
        }

        if(this.connectorInProgress) this.connectorInProgress.update();
    }

    transferEnergy() {
        return 0;
    }

    render() {
        if(this.connectorInProgress) this.connectorInProgress.render();
        Utils.c.fillStyle = this.color;
        Utils.c.strokeStyle = this.borderColor;
        Utils.c.beginPath();
        Utils.c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        Utils.c.fill();
        if(this.isSelected || this.canBeSelected) {
            Utils.c.fillStyle = "rgba(255, 255, 255, 0.5)";
            Utils.c.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
            Utils.c.fill();
        }
        Utils.c.beginPath();
        Utils.c.lineWidth = this.radius / 10;
        Utils.c.arc(this.pos.x, this.pos.y, this.radius - (this.radius / 20), 0, 2 * Math.PI * this.borderPercent, 1);
        Utils.c.stroke();
        Utils.c.fillStyle = "black";

        Utils.c.font = this.radius / 2 + "px StraightRuler Arial";
        Utils.c.fillText(this.currentOutput, this.pos.x , this.pos.y);
    }
}

export class EnergyMaker extends Node {
    constructor(x, y) {
        super(x, y, 50, "rgb(255, 190, 0)", "rgb(255, 255, 0)", "Energy Maker", 1, 0, 50);
        this.timestamp = 0;
    }

    update() {
        super.update();

        if(Utils.millis > this.timestamp && this.energy < this.maxEnergy) {
            this.energy++;
            this.timestamp = Utils.millis + 1000;
        }

        if(this.energy < this.maxEnergy) this.borderPercent = (this.timestamp - Utils.millis) / 1000;
        else this.borderPercent = 1;
    }
}

export class EnergyExporter extends Node {
    static maxSellRate = 5;
    static energyValue = 1;

    constructor(x, y) {
        super(x, y, 100, "rgb(200, 200, 200)", undefined, "Energy Exporter", 0, 10);
        this.timestamp = 0;
    }

    update() {
        super.update();
        if(this.energy < this.maxEnergy && this.energy > 0 && Utils.millis > this.timestamp) {
            this.timestamp = Utils.millis + 500;
            for(let i = 0; i < EnergyExporter.maxSellRate && i < this.energy; i++) {
                Utils.money += EnergyExporter.energyValue;
                this.energy--;
            }
        }

        if(this.timestamp - Utils.millis > 0) this.borderPercent = (this.timestamp - Utils.millis) / 500;
        else this.borderPercent = 1;

        this.canBeSelected = false;
    }

    transferEnergy(energy) {
        if(this.energy < this.maxEnergy) {
            if(this.energy + energy < this.maxEnergy) {
                this.energy += energy;
                return energy;
            } else {
                let pEnergy = this.energy;
                this.energy = this.maxEnergy;
                return this.maxEnergy - pEnergy;
            }
        }
        return 0;
    }

}

export class EnergySplitter extends Node {
    static maxOutputs = 2;

    constructor(x, y) {
        super(x, y, 50, "rgb(200, 150, 150)", "rgb(255, 200, 200)", "Energy Splitter", EnergySplitter.maxOutputs, 1, undefined, 250);
    }

    update() {
        super.update();
    }

    transferEnergy(energy) {
        if(this.energy < this.maxEnergy) {
            if(this.energy + energy < this.maxEnergy) {
                this.energy += energy;
                return energy;
            } else {
                let pEnergy = this.energy;
                this.energy = this.maxEnergy;
                return this.maxEnergy - pEnergy;
            }
        }
        return 0;
    }

}
