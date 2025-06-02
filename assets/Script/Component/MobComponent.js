const MobStatus = require('MobStatus');
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        health: 100,
        status: {
            default: MobStatus.NONE,
            type: MobStatus
        }
    },
    update(dt) {
        if (this.node && this.node.active) {
            this.node.x -= this.speed * dt;
            //console.log(`Mob position: ${this.node.x}, ${this.node.y}`);
        }
        if (this.node.x < -200) {
            this.status = MobStatus.OUT_OF_SCREEN;
            this.node.active = false;
        }
        return cc.v2(this.node.x, this.node.y);
    },
});
