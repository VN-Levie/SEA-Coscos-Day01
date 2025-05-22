cc.Class({
    extends: cc.Component,
    properties: {
        speed: 60
    },
    update(dt) {
        this.node.angle += this.speed * dt;
    }
});
