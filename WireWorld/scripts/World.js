class World {
    constructor(name) {
        this.name = name;
        this.tiles = [];
    }

    addTile(type, _x, _y) {
        var x = Math.floor(_x / 20) * 20;
        var y = Math.floor(_y/ 20) * 20;
        for(var t of this.tiles)
            if(t.x == x && t.y == y && t.type == type)  return false;
        this.tiles.push(new Tile(x, y, tileType.wire));
    }

    removeTile(_x, _y) {
        var x = Math.floor(_x / 20) * 20;
        var y = Math.floor(_y / 20) * 20;
        for(var i = this.tiles.length - 1; i >= 0; i--) {
            if(this.tiles[i].x == x && this.tiles[i].y == y)
                this.tiles.splice(i, 1);
        }
    }
}

var world = new World("Testing");
