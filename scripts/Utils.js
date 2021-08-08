var Utils = {
    mouse: {
        leftIsPressed: false,
        rightIsPressed: false,
        leftIsClicked: false,
        rightIsClicked: false,
        x: 0,
        y: 0,
        px: 0,
        py: 0,
        realX: 0,
        realY: 0
    },
    cam: {
        x: 0,
        y: 0
    },
    keybinds: {
        panUp: 87,
        panDown: 83,
        panLeft: 65,
        panRight: 68,
        speedPan: 16
    },
    keys: [],
    millis: 0,
    c: undefined,
    money: 0,
    dist: function(x1, y1, x2, y2) {
        return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2))
    }
}

export default Utils;
