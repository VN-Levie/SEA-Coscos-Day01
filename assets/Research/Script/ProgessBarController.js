cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        speed: 0.2,
        direction: -1
    },

    onLoad() {
        this.progress = 0;
        this.running = false;
        this.node.on('touchstart', this.onTouch, this);
    },

    onTouch() {
        if (!this.running) {
            this.running = true;
            this.progress = 0;
        }
    },

    update(dt) {
        if (!this.running) return;
        this.progress += dt * this.speed;
        if (this.progress >= 1) {
            this.progress = 0;
            this.running = false;
        }
        this.sprite.fillRange = this.direction === 1 ? this.progress : -this.progress;
    }
});
