cc.Class({
    extends: cc.Component,
    properties: {
        bulletPrefab: cc.Prefab,
        shootInterval: 0.5,
        shootTimer: 0
    },
    onLoad() {
        this._idleY = this.node.y;
        this._idleScaleY = 0.7;
        let deltaY = 6.91;
        let deltaScaleY = 0.75 - 0.7;

        this.node.scaleY = this._idleScaleY;

        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(0.75, {
                        scaleY: this._idleScaleY + deltaScaleY,
                        position: cc.v2(this.node.x, this._idleY + deltaY)
                    }, { easing: "sineInOut" })
                    .to(0.75, {
                        scaleY: this._idleScaleY,
                        position: cc.v2(this.node.x, this._idleY)
                    }, { easing: "sineInOut" })
            )
            .start();
    },
    update(dt) {
        this.shootTimer -= dt;
        if (this.shootTimer <= 0) {
            this.shootTimer = this.shootInterval;
            this.shoot();
        }
    },
    shoot() {
        if (!this.bulletPrefab) return;
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.parent = this.node.parent;
        bullet.x = this.node.x + 75;
        bullet.y = this.node.y + 10;
    }
});
