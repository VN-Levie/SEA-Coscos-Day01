const DefenderStateMachine = require('../StateMachine/DefenderStateMachine');
const CoordinateUtils = require('../Utils/CoordinateUtils');

cc.Class({
    extends: cc.Component,
    properties: {
        bulletPrefab: cc.Prefab,
        explosionPrefab: cc.Prefab,
        shootInterval: 0.5,
        shootTimer: 0,
        health: 1000,
        maxHealth: 1000,
        damage: 20,
        range: 800,
        explosionRange: 600,
        respawnTime: 5,
        healthBar: {
            default: null,
            type: cc.ProgressBar
        },
    },

    onLoad() {
        this.explosionRange = 600;
        this.damage = 10;
        this.range = 1000;
        this.maxHealth = this.health;
        this.stateMachine = DefenderStateMachine.createStateMachine(this);
        this.shootTimer = this.shootInterval;
        this.targets = [];
        this.isRespawning = false;
        this.originalOpacity = 255;

        this.scheduleOnce(() => {
            this.initializePosition();
        }, 0);
    },

    initializePosition() {

        this._idleY = this.node.y;
        this._idleScaleY = 0.7;
        this.deltaY = 6.91;
        this.deltaScaleY = 0.75 - 0.7;

        this.node.scaleY = 0;
        this.setupIdleAnimation();
    },

    setupIdleAnimation() {
        console.log("Setup animation - node.x:", this.node.x, "node.y:", this.node.y, "_idleY:", this._idleY);
        if (this._idleY === undefined || this._idleY === 0) {
            console.warn("Invalid _idleY, retrying position setup...");
            this.scheduleOnce(() => {
                this.initializePosition();
            }, 0.1);
            return;
        }
        cc.tween(this.node)
            .set({
                scaleY: 0,
                position: cc.v2(this.node.x, this._idleY - this.node.height * 0.5)
            })
            .to(1,
                {
                    scaleY: this._idleScaleY,
                    position: cc.v2(this.node.x, this._idleY)
                },
                {
                    easing: "sineInOut"
                }
            )
            .call(() => {
                this.startIdleAnimation();

                this.scheduleOnce(() => {
                    if (this.stateMachine.can('finishSetup')) {
                        this.stateMachine.finishSetup();
                    }
                }, 1);
            })
            .start();

    },
    startIdleAnimation() {

        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(0.75, {
                        scaleY: this._idleScaleY + this.deltaScaleY,
                        position: cc.v2(this.node.x, this._idleY + this.deltaY)
                    }, { easing: "sineInOut" })
                    .to(0.75, {
                        scaleY: this._idleScaleY,
                        position: cc.v2(this.node.x, this._idleY)
                    }, { easing: "sineInOut" })
            ).start();
    },

    update(dt) {
        if (this.stateMachine.state === 'shooting') {
            this.shootTimer -= dt;
            if (this.shootTimer <= 0) {
                this.shootTimer = this.shootInterval;
                this.shoot();
            }
        }

        this.updateTargeting();
        this.checkMobCollision();
    },

    updateTargeting() {
        let mobsInRange = this.findMobsInRange();
        if (mobsInRange.length > 0 && this.stateMachine.can('startShooting')) {
            this.targets = mobsInRange;
            this.stateMachine.startShooting();
        } else if (mobsInRange.length === 0 && this.stateMachine.can('stopShooting')) {
            this.targets = [];
            this.stateMachine.stopShooting();
        }
    },

    findMobsInRange() {
        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return [];
        let validMobs = roomController.mobs.filter(mob => mob.active);
        let mobsInRange = CoordinateUtils.findNodesInRange(
            this.node,
            validMobs,
            this.range,
            true,
            50
        );
        let defenderWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let approachingMobs = mobsInRange.filter(mob => {
            let mobWorldPos = CoordinateUtils.getWorldPosition(mob);
            return mobWorldPos.x > defenderWorldPos.x;
        });
        return approachingMobs;
    },

    checkMobCollision() {
        if (this.isRespawning || this.stateMachine.state === 'destroyed') return;

        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return;

        let activeMobs = roomController.mobs.filter(m => m.active);

        for (let mob of activeMobs) {
            let mobComponent = mob.getComponent('MobComponent');
            if (mobComponent && this.isCollidingWithMob(mob)) {
                this.takeDamageFromMob(mobComponent.getDamageValue());
                break;
            }
        }
    },

    isCollidingWithMob(mobNode) {
        let defenderWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let mobWorldPos = CoordinateUtils.getWorldPosition(mobNode);

        let laneToleranceY = 60;
        let verticalDistance = Math.abs(mobWorldPos.y - defenderWorldPos.y);

        if (verticalDistance > laneToleranceY) {
            return false;
        }

        let defenderBox = {
            left: defenderWorldPos.x - this.node.width * 0.4,
            right: defenderWorldPos.x + this.node.width * 0.4,
            top: defenderWorldPos.y + this.node.height * 0.4,
            bottom: defenderWorldPos.y - this.node.height * 0.4
        };

        let mobBox = {
            left: mobWorldPos.x - mobNode.width * 0.4,
            right: mobWorldPos.x + mobNode.width * 0.4,
            top: mobWorldPos.y + mobNode.height * 0.4,
            bottom: mobWorldPos.y - mobNode.height * 0.4
        };

        return !(defenderBox.right < mobBox.left ||
            defenderBox.left > mobBox.right ||
            defenderBox.top < mobBox.bottom ||
            defenderBox.bottom > mobBox.top);
    },

    onActivate() {
        this.node.active = true;
    },

    onStartShooting() {
        this.shootTimer = 0;
    },

    onStopShooting() {
        this.targets = [];
    },

    onTakeDamage() {

        //this.playDamageEffect();
        this.updateHealthBar();
    },

    onRepair() {
        this.health = this.maxHealth;
    },

    onUpgrade() {
    },

    onFinishUpgrade() {
        this.damage += 10;
        this.shootInterval = Math.max(0.2, this.shootInterval - 0.1);
    },

    onOverload() {
    },

    onCooldown() {
    },

    onDeactivate() {
        this.node.active = false;
    },

    onDestroy() {
        console.log('Defender destroyed');
        this.createExplosionEffect();
        this.explodeAllMobsInLine();
        this.startRespawning();
    },

    onReset() {
        this.health = this.maxHealth;
        this.targets = [];
        this.updateHealthBar();

        this.scheduleOnce(() => {
            if (this.stateMachine.can('activate')) {
                this.stateMachine.activate();
            }
        }, 0.5);
    },

    shoot() {
        if (!this.bulletPrefab || this.targets.length === 0) return;

        this.targets = CoordinateUtils.sortByDistance(this.node, this.targets);

        let target = this.targets[0];
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.parent = this.node.parent;

        let defenderWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let bulletSpawnWorldPos = cc.v2(defenderWorldPos.x + this.node.width / 2, defenderWorldPos.y + this.node.height * 0.01);
        let bulletSpawnLocalPos = CoordinateUtils.worldToLocal(bulletSpawnWorldPos, this.node.parent);
        bullet.setPosition(bulletSpawnLocalPos);

        let bulletComponent = bullet.getComponent('BulletComponent');
        if (bulletComponent) {
            bulletComponent.target = target;
            bulletComponent.damage = this.damage;
        }
    },

    activate() {
        if (this.stateMachine.can('activate')) {
            this.stateMachine.activate();
        }
    },

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            if (this.stateMachine.can('destroy')) {
                this.stateMachine.destroy();
            }
        } else if (this.stateMachine.can('takeDamage')) {
            this.stateMachine.takeDamage();
        }
    },

    takeDamageFromMob(damage) {
        console.log(`Defender taking ${damage} damage from mob`);
        this.health -= damage;
        this.health = Math.max(0, this.health);

        //this.playDamageEffect();
        this.updateHealthBar();
        this.createDamageNumber(damage);

        if (this.health <= 0) {
            if (this.stateMachine.can('destroy')) {
                this.stateMachine.destroy();
            }
        } else if (this.stateMachine.can('takeDamage')) {
            this.stateMachine.takeDamage();
        }
    },

    playDamageEffect() {
        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            let originalColor = sprite.node.color.clone();
            sprite.node.color = cc.Color.RED;
            cc.tween(sprite.node)
                .to(0.15, { color: originalColor })
                .start();
        }

        let originalPos = this.node.position.clone();
        cc.tween(this.node)
            .by(0.03, { x: 8 }, { easing: 'sineOut' })
            .by(0.03, { x: -16 }, { easing: 'sineInOut' })
            .by(0.03, { x: 12 }, { easing: 'sineInOut' })
            .by(0.03, { x: -8 }, { easing: 'sineInOut' })
            .by(0.03, { x: 4 }, { easing: 'sineIn' })
            .to(0.05, { position: originalPos })
            .start();

        let originalScale = this.node.scale;
        cc.tween(this.node)
            .to(0.08, { scale: originalScale * 1.15 }, { easing: 'backOut' })
            .to(0.12, { scale: originalScale }, { easing: 'backIn' })
            .start();

        this.createScreenShake();
        this.createDamageNumber();
    },

    createScreenShake() {
        let canvas = cc.find('Canvas');
        if (canvas) {
            let originalPos = canvas.position.clone();
            cc.tween(canvas)
                .by(0.04, { x: Math.random() * 12 - 6, y: Math.random() * 12 - 6 })
                .by(0.04, { x: Math.random() * 8 - 4, y: Math.random() * 8 - 4 })
                .by(0.04, { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 })
                .to(0.06, { position: originalPos })
                .start();
        }
    },

    createExplosionEffect() {
        if (!this.explosionPrefab) return;

        let bulletWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let effectLayer = cc.find('Canvas/GameArea');
        if (!effectLayer) {
            effectLayer = this.node.parent;
        }

        let effectLocalPos = effectLayer.convertToNodeSpaceAR(bulletWorldPos);
        let effect = cc.instantiate(this.explosionPrefab);
        effect.parent = effectLayer;
        effect.setPosition(effectLocalPos);
    },

    explodeAllMobsInLine() {
        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return;

        let defenderWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let mobsToDestroy = [];

        roomController.mobs.forEach(mob => {
            if (!mob.active) return;

            let mobWorldPos = CoordinateUtils.getWorldPosition(mob);
            let verticalDistance = Math.abs(mobWorldPos.y - defenderWorldPos.y);
            let horizontalDistance = Math.abs(mobWorldPos.x - defenderWorldPos.x);

            if (verticalDistance <= 60 && horizontalDistance <= this.explosionRange) {
                mobsToDestroy.push(mob);
            }
        });

        mobsToDestroy.forEach(mob => {
            let mobComponent = mob.getComponent('MobComponent');
            if (mobComponent && mobComponent.stateMachine.can('die')) {
                mobComponent.stateMachine.die();
            }
        });

        console.log(`Explosion destroyed ${mobsToDestroy.length} mobs in line`);
    },

    startRespawning() {
        this.isRespawning = true;
        this.node.opacity = 50;
        this.health = 0;

        let respawnProgress = 0;
        let respawnTimer = 0;

        let respawnUpdate = () => {
            respawnTimer += 0.1;
            respawnProgress = respawnTimer / this.respawnTime;

            this.node.opacity = 50 + (respawnProgress * 205);
            this.health = this.maxHealth * respawnProgress;
            this.updateHealthBar();

            if (respawnProgress >= 1) {
                this.finishRespawning();
                this.unschedule(respawnUpdate);
            }
        };

        this.schedule(respawnUpdate, 0.1);
    },

    finishRespawning() {
        this.isRespawning = false;
        this.node.opacity = 255;
        this.health = this.maxHealth;
        this.updateHealthBar();

        if (this.stateMachine.can('reset')) {
            this.stateMachine.reset();
        }

        let originalScale = this.node.scale;
        cc.tween(this.node)
            .to(0.2, { scale: originalScale * 1.2 }, { easing: 'backOut' })
            .to(0.15, { scale: originalScale }, { easing: 'backIn' })
            .start();
    },

    createDamageNumber(damage) {
        let damageNode = new cc.Node('DamageText');
        let labelComponent = damageNode.addComponent(cc.Label);
        labelComponent.string = '-' + (damage || Math.floor(Math.random() * 20 + 10));
        labelComponent.fontSize = 30;
        labelComponent.node.color = cc.Color.RED;

        damageNode.parent = this.node.parent;
        let defenderWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let damageLocalPos = CoordinateUtils.worldToLocal(defenderWorldPos, this.node.parent);
        damageNode.setPosition(damageLocalPos.x, damageLocalPos.y + this.node.height * 0.5);

        cc.tween(damageNode)
            .parallel(
                cc.tween().by(1.0, { y: 50 }, { easing: 'quadOut' }),
                cc.tween().to(1.0, { opacity: 0 }, { easing: 'quadIn' })
            )
            .call(() => {
                damageNode.destroy();
            })
            .start();
    },

    updateHealthBar() {
        if (this.healthBar) {
            let healthPercent = this.health / this.maxHealth;
            cc.tween(this.healthBar)
                .to(0.2, { progress: healthPercent })
                .start();


            let healthBarNode = this.healthBar.node;
            if (healthPercent < 0.3) {
                healthBarNode.color = cc.Color.RED;
            } else if (healthPercent < 0.6) {
                healthBarNode.color = cc.Color.YELLOW;
            } else {
                healthBarNode.color = cc.Color.GREEN;
            }
        }
    },

});