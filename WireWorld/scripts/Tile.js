class Tile {
    constructor(x = 0, y = 0, sizeX = 20, sizeY = 20, color = "rgb(200, 0, 200)", text = "Default text", outputs = 0, inputs = 0) {
        this.pos = {x: x, y: y};
        this.size = {x: sizeX, y: sizeY};
        this.color = color;
        this.text = text;
        this.outputs = [];
        this.maxOutputs = outputs;
        this.inputs = [];
        this.maxInputs = inputs;
        this.canBeSelected = false;
        this.isSelected = false;
        this.makingConnector = false;
        this.energy = 0;
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
        return (mouse.x > this.pos.x && mouse.x < this.pos.x + this.size.x && mouse.y > this.pos.y && mouse.y < this.pos.y + this.size.y);
    }

    update() {
        // Determine when the node is selected or not
        if(this.isMouseWithin()) {
            if(!mouse.leftIsPressed && !mouse.rightIsPressed) this.canBeSelected = true;
            if(mouse.leftIsPressed && this.canBeSelected) this.isSelected = true;
            else if(mouse.rightIsPressed && this.canBeSelected) this.connect();
            else this.isSelected = false;
        }else if(!this.isSelected) {
            this.canBeSelected = false;
        }

        if(this.isSelected) {
            if(tiles.indexOf(this) < tiles.length - 1) {
                tiles.push(tiles.splice(tiles.indexOf(this), 1)[0]);
            }
            this.pos.x += mouse.x - mouse.px;
            this.pos.y += mouse.y - mouse.py;
        } else {
            // Keep tiles from stacking on top of eachother
            for(var tile of tiles) {
                if(tile != this && !tile.isSelected) {
                    if(this.pos.x < tile.pos.x + tile.size.x && this.pos.x + this.size.x > tile.pos.x && this.pos.y < tile.pos.y + tile.size.y && this.pos.y + this.size.y > tile.pos.y) {
                        let dist = {x: Math.abs((this.pos.x + this.size.x / 2) - (tile.pos.x + tile.size.x / 2)), y: Math.abs((this.pos.y + this.size.y / 2) - (tile.pos.y + tile.size.y / 2))};
                        if(dist.x > dist.y) {
                            if(this.pos.x - tile.pos.x < 0) this.pos.x = tile.pos.x - this.size.x - 5;
                            else this.pos.x = tile.pos.x + tile.size.x + 5;
                        } else {
                            if(this.pos.y - tile.pos.y < 0) this.pos.y = tile.pos.y - this.size.y - 5;
                            else this.pos.y = tile.pos.y + tile.size.y + 5;
                        }
                    }
                }
            }
        }

        for(var i = this.outputs.length - 1; i >= 0; i--) {
            this.outputs[i].update();
            if(!this.outputs[i].isPlaced && this.makingConnector && !mouse.rightIsPressed) {
                for(var tile of tiles) {
                    if(tile.isMouseWithin()) {
                        tile.connect(this.outputs[i]);
                        return;
                    }
                }
                this.makingConnector = false;
                this.outputs.splice(i, 1);
            }
            else if(this.outputs[i].isPlaced) this.outputs[i].transferEnergy();
        }
    }

    render() {
        if(this.makingConnector) for(var output of this.outputs) output.render();
        if(this.isSelected || this.canBeSelected) {
            c.strokeStyle = "rgb(255, 255, 255)";
            c.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
        c.fillStyle = this.color;
        c.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        c.fillStyle = "black";
        c.fillText(this.energy, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    }
}

class EnergyMaker extends Tile {
    constructor(x, y) {
        super(x, y, 50, 50, "rgb(255, 200, 0)", "Energy Maker", 1);
        this.timestamp = 0;
    }

    update() {
        super.update();

        if(millis > this.timestamp) {
            this.energy++;
            this.timestamp = millis + 1000;
        }
    }

    transferEnergy() {
        return 0;
    }
}

class EnergyExporter extends Tile {
    constructor(x, y) {
        super(x, y, 100, 100, "rgb(200, 200, 200)", "Energy Exporter", 0, 1);
    }

    transferEnergy(energy) {
        return energy;
    }
}

tiles = [];

tiles[0] = new EnergyMaker(50, 50);
tiles[1] = new EnergyExporter(150, 150);
