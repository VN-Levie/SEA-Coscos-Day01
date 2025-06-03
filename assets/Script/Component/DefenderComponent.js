const DefenderStateMachine = require('../StateMachine/DefenderStateMachine');
const CoordinateUtils = require('../Utils/CoordinateUtils');

cc.Class({
    extends: cc.Component,
    properties: {
        bulletPrefab: cc.Prefab,
        shootInterval: 0.5,
        shootTimer: 0,
        health: 100,
        maxHealth: 100,
        damage: 20,
        range: 800,
        //ProgressHeathBar
        healthBar: {
            default: null,
            type: cc.ProgressBar
        },
    },

    onLoad() {

        this.damage = 10;
        this.range = 1500;
        this.maxHealth = this.health;
        this.stateMachine = DefenderStateMachine.createStateMachine(this);
        this.shootTimer = this.shootInterval;
        this.targets = [];

        this.scheduleOnce(() => {
            this.initializePosition();
        }, 0);
    },

    initializePosition() {

        this._idleY = this.node.y;
        this._idleScaleY = 0.7;
        this.deltaY = 6.91;
        this.deltaScaleY = 0.75 - 0.7;
        // this.node.scaleY = this._idleScaleY;
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
        this.node.active = false;
    },

    onReset() {
        this.health = this.maxHealth;
        this.targets = [];
        this.node.active = false;
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

    repair() {
        if (this.stateMachine.can('repair')) {
            this.stateMachine.repair();
        }
    },

    upgrade() {
        if (this.stateMachine.can('upgrade')) {
            this.stateMachine.upgrade();

            this.scheduleOnce(() => {
                if (this.stateMachine.can('finishUpgrade')) {
                    this.stateMachine.finishUpgrade();
                }
            }, 2);
        }
    },

    deactivate() {
        if (this.stateMachine.can('deactivate')) {
            this.stateMachine.deactivate();
        }
    },

    reset() {
        if (this.stateMachine.can('reset')) {
            this.stateMachine.reset();
        }
    }
});
