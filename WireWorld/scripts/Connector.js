class Connector {

    constructor(node) {
        this.inputNode = node;
        this.outputNode = {pos: {x: mouse.x, y: mouse.y}, size: {x: 0, y: 0}};
        this.isPlaced = false;
        this.energy = 0;
    }

    update() {
        if(!this.isPlaced) {
            this.outputNode.pos.x = mouse.x;
            this.outputNode.pos.y = mouse.y;
        }
    }

    transferEnergy() {
        if(this.inputNode.energy > 0) {
            console.log(this.maxTransfer)
            if(this.inputNode.energy < this.maxTransfer) {
                this.energy += this.inputNode.energy;
                this.inputNode.ebergy = 0;
            } else {
                this.energy += this.maxTransfer;
                this.inputNode.energy -= this.maxTransfer;
            }

            this.energy -= this.outputNode.transferEnergy(this.energy);
        }
    }

    connect(node) {
        connectors.push(this)
        this.outputNode = node;
        this.isPlaced = true;
    }

    render() {
        c.strokeStyle = "rgb(255, 255, 255)";
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(this.inputNode.pos.x + this.inputNode.size.x / 2, this.inputNode.pos.y + this.inputNode.size.y / 2);
        c.lineTo(this.outputNode.pos.x + this.outputNode.size.x / 2, this.outputNode.pos.y + this.outputNode.size.y / 2);
        c.stroke();
    }
}
Connector.maxTransfer = 1;

connectors = [];
