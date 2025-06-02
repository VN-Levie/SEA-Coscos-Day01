cc.Class({
    extends: cc.Component,
    properties: {
        speed: 600,
        damage: 10,
        explosionPrefab: cc.Prefab 
    },
    update(dt) {
        this.node.x += this.speed * dt;
        if (this.node.x > 1600) {
            this.node.destroy();
        }
    },
    onCollisionEnter(other, self) {
        //console.log(`Bullet collided with: ${other.node.group}`);

        if (other.node.group === "MobGroup") {
            let mobComp = other.node.getComponent("MobComponent");
            if (mobComp) {
                mobComp.health -= this.damage;
                if (mobComp.health <= 0) {
                    other.node.active = false;
                }
            }
            let bulletWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            let effectLayer = cc.find('Canvas/GameArea');
            let effectLocalPos = effectLayer.convertToNodeSpaceAR(bulletWorldPos);
            let effect = cc.instantiate(this.explosionPrefab);
            effect.parent = effectLayer;
            effect.setPosition(effectLocalPos);
            this.node.destroy();
        }
    }
});
