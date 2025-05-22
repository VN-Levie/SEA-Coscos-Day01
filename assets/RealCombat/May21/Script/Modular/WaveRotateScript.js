var BaseRotate = require("BaseRotateScript");

cc.Class({
    extends: BaseRotate,
    update(dt) {
        this.node.angle += this.speed * Math.sin(dt * 10);
    }
});
