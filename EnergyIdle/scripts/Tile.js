import {Connector} from "/scripts/Connector.js";
import Utils from "/scripts/Utils.js";

class Tile {
    constructor(x = 0, y = 0, radius = 25, color = "rgb(200, 0, 200)", borderColor = "rgb(255, 255, 255)", text = "Default text", outputs = 0, inputs = 0, maxEnergy = 20) {
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
        this.makingConnector = false;
        this.energy = 0;
        this.maxEnergy = maxEnergy;
        this.borderPercent = 1;
    }

    connect(connector) {
        if(connector && this.inputs.length < this.maxInputs) {
            if(connector.inputNode == this) {
                this.makingConnector = false;
                this.outputs.splice(this.outputs.indexOf(connector, 1));
            } else {
                this.inputs.push(connector);
                connector.connect(this);
                connector.inputNode.makingConnector = false;
            }
        }
        else if(!connector && this.outputs.length < this.maxOutputs) {
            let c = new Connector(this);
            this.outputs.push(c);
            this.makingConnector = true;
        }
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
    }

    exportEnergy() {
        for(var i = this.outputs.length - 1; i >= 0; i--) {
            this.outputs[i].update();
        }
    }

    transferEnergy() {
        return 0;
    }

    render() {
        if(this.makingConnector) for(var output of this.outputs) output.render();
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
        Utils.c.fillText(this.energy, this.pos.x , this.pos.y);
    }
}

export class EnergyMaker extends Tile {
    constructor(x, y) {
        super(x, y, 50, "rgb(255, 190, 0)", "rgb(255, 255, 0)", "Energy Maker", 1);
        this.timestamp = 0;
    }

    update() {
        super.update();

        if(Utils.millis > this.timestamp && this.energy < this.maxEnergy) {
            this.energy++;
            this.timestamp = Utils.millis + 1000;
        }
        super.exportEnergy();

        if(this.energy < this.maxEnergy) this.borderPercent = (this.timestamp - Utils.millis) / 1000;
        else this.borderPercent = 1;
    }
}

export class EnergyExporter extends Tile {
    static maxSellRate = 5;
    static energyValue = 1;

    constructor(x, y) {
        super(x, y, 100, "rgb(200, 200, 200)", undefined, "Energy Exporter", 0, 1);
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

export class EnergySplitter extends Tile {
    constructor(x, y) {
        super(x, y, 50, "rgb(200, 150, 150)", "rgb(255, 200, 200)", "Energy Splitter", 2, 1);
    }

    update() {
        super.update();
    }

    static maxOutputs = 2;
}
