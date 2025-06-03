const MobStatus = require('MobStatus');
const MobStateMachine = require('../StateMachine/MobStateMachine');

cc.Class({
    extends: cc.Component,
    properties: {
        speed: 100,
        health: 100,
        maxHealth: 100,
        damage: 5,
        status: {
            default: MobStatus.NONE,
            type: MobStatus
        },
        healthBar: {
            default: null,
            type: cc.ProgressBar
        },
    },
    statics: {
        numDie: 0,
    },

    onLoad() {
        this.maxHealth = this.health;
        this.stateMachine = MobStateMachine.createStateMachine(this);
        this.effectTimers = {};
    },

    update(dt) {
        if (this.node && this.node.active) {
            if (this.stateMachine.state === 'moving') {
                
                if (!this.isMovementBlocked()) {
                    this.node.x -= this.speed * dt;
                }

                this.checkDefenderCollision();
                this.checkMobCollision();
            }
            this.updateEffects(dt);
            if (this.node.x < -200 && this.stateMachine.can('outOfScreen')) {
                this.stateMachine.outOfScreen();
            }
        }
        if (this.healthBar) {
            this.healthBar.progress = this.health / this.maxHealth;
        }
        return cc.v2(this.node.x, this.node.y);
    },

    checkDefenderCollision() {
        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return;

        let activeDefenders = roomController.defenders.filter(d => {
            if (!d.active) return false;
            
            let defenderComponent = d.getComponent('DefenderComponent');
            if (!defenderComponent) return false;
            
            
            if (defenderComponent.isRespawning || defenderComponent.stateMachine.state === 'destroyed') {
                return false;
            }
            
            return true;
        });

        for (let defender of activeDefenders) {
            if (this.isCollidingWith(defender)) {
                this.attackDefender(defender);
                break;
            }
        }
    },

    isMovementBlocked() {
        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return false;

        
        let allDefenders = roomController.defenders.filter(d => {
            if (!d.active) return false;
            
            let defenderComponent = d.getComponent('DefenderComponent');
            if (!defenderComponent) return false;
            
            
            if (defenderComponent.stateMachine.state === 'destroyed') {
                return false;
            }
            
            return true;
        });

        for (let defender of allDefenders) {
            if (this.isPhysicallyCollidingWith(defender)) {
                return true;
            }
        }

        return false;
    },

    isPhysicallyCollidingWith(defenderNode) {
        const CoordinateUtils = require('../Utils/CoordinateUtils');
        let mobWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let defenderWorldPos = CoordinateUtils.getWorldPosition(defenderNode);
        
        
        if (mobWorldPos.x <= defenderWorldPos.x) {
            return false; 
        }
        
        let laneToleranceY = 60;
        let verticalDistance = Math.abs(mobWorldPos.y - defenderWorldPos.y);

        if (verticalDistance > laneToleranceY) {
            return false; 
        }

        
        let mobBox = {
            left: mobWorldPos.x - this.node.width * 0.3,
            right: mobWorldPos.x + this.node.width * 0.3,
            top: mobWorldPos.y + this.node.height * 0.3,
            bottom: mobWorldPos.y - this.node.height * 0.3
        };

        let defenderBox = {
            left: defenderWorldPos.x - defenderNode.width * 0.3,
            right: defenderWorldPos.x + defenderNode.width * 0.3,
            top: defenderWorldPos.y + defenderNode.height * 0.3,
            bottom: defenderWorldPos.y - defenderNode.height * 0.3
        };

        return mobBox.left < defenderBox.right &&
            mobBox.right > defenderBox.left &&
            mobBox.bottom < defenderBox.top &&
            mobBox.top > defenderBox.bottom;
    },

    isCollidingWith(defenderNode) {
        const CoordinateUtils = require('../Utils/CoordinateUtils');
        let mobWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let defenderWorldPos = CoordinateUtils.getWorldPosition(defenderNode);
        
        
        let defenderComponent = defenderNode.getComponent('DefenderComponent');
        if (defenderComponent && (defenderComponent.isRespawning || defenderComponent.stateMachine.state === 'destroyed')) {
            return false; 
        }

        
        if (mobWorldPos.x <= defenderWorldPos.x) {
            return false; 
        }

        
        let laneToleranceY = 60;
        let verticalDistance = Math.abs(mobWorldPos.y - defenderWorldPos.y);

        if (verticalDistance > laneToleranceY) {
            return false; 
        }

        
        let mobBox = {
            left: mobWorldPos.x - this.node.width * 0.4,
            right: mobWorldPos.x + this.node.width * 0.4,
            top: mobWorldPos.y + this.node.height * 0.4,
            bottom: mobWorldPos.y - this.node.height * 0.4
        };

        let defenderBox = {
            left: defenderWorldPos.x - defenderNode.width * 0.4,
            right: defenderWorldPos.x + defenderNode.width * 0.4,
            top: defenderWorldPos.y + defenderNode.height * 0.4,
            bottom: defenderWorldPos.y - defenderNode.height * 0.4
        };

        return mobBox.left < defenderBox.right &&
            mobBox.right > defenderBox.left &&
            mobBox.bottom < defenderBox.top &&
            mobBox.top > defenderBox.bottom;
    },

    attackDefender(defenderNode) {
        let defenderComponent = defenderNode.getComponent('DefenderComponent');
        if (defenderComponent && this.stateMachine.can('attack')) {
            
            if (defenderComponent.isRespawning || defenderComponent.stateMachine.state === 'destroyed') {
                return; 
            }

            this.playAttackEffect();

            this.stateMachine.attack();
            defenderComponent.takeDamageFromMob(this.getDamageValue());

            this.scheduleOnce(() => {
                if (this.stateMachine.can('move')) {
                    this.stateMachine.move();
                }
            }, 0.5);
        }
    },

    getDamageValue() {
        return this.damage || 15;
    },

    updateEffects(dt) {
        if (this.stateMachine.state === 'burning') {
            this.effectTimers.burning = (this.effectTimers.burning || 3) - dt;
            if (this.effectTimers.burning <= 0) {
                this.health -= 10;
                if (this.health <= 0 && this.stateMachine.can('die')) {
                    this.stateMachine.die();
                } else if (this.stateMachine.can('recover')) {
                    this.stateMachine.recover();
                }
            }
        }
        if (this.stateMachine.state === 'poisoned') {
            this.effectTimers.poisoned = (this.effectTimers.poisoned || 5) - dt;
            if (this.effectTimers.poisoned <= 0) {
                this.health -= 5;
                if (this.health <= 0 && this.stateMachine.can('die')) {
                    this.stateMachine.die();
                } else if (this.stateMachine.can('heal')) {
                    this.stateMachine.heal();
                }
            }
        }
        if (this.stateMachine.state === 'stunned') {
            this.effectTimers.stunned = (this.effectTimers.stunned || 2) - dt;
            if (this.effectTimers.stunned <= 0 && this.stateMachine.can('recover')) {
                this.stateMachine.recover();
            }
        }

        if (this.stateMachine.state === 'frozen') {
            this.effectTimers.frozen = (this.effectTimers.frozen || 3) - dt;
            if (this.effectTimers.frozen <= 0 && this.stateMachine.can('recover')) {
                this.stateMachine.recover();
            }
        }
    },


    onSpawn() {
        this.status = MobStatus.MOVING;
        this.node.active = true;
    },

    onMove() {
        this.status = MobStatus.MOVING;
    },

    onAttack() {
        this.status = MobStatus.ATTACKING;
    },

    onTakeDamage() {
        this.status = MobStatus.NONE;
        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            let originalColor = sprite.node.color.clone();
            sprite.node.color = cc.Color.RED;
            cc.tween(sprite.node)
                .to(0.05, { color: originalColor })
                .start();
        }

        cc.tween(this.node)
            .by(0.06, { x: 10 }, { easing: 'sineOut' })
            .by(0.06, { x: -20 }, { easing: 'sineInOut' })
            .by(0.06, { x: 10 }, { easing: 'sineIn' })
            .start();
    },

    onStun() {
        this.status = MobStatus.STUNNED;
        this.effectTimers.stunned = 2;
    },

    onFreeze() {
        this.status = MobStatus.FROZEN;
        this.effectTimers.frozen = 3;
    },

    onBurn() {
        this.status = MobStatus.BURNING;
        this.effectTimers.burning = 3;
    },

    onPoison() {
        this.status = MobStatus.POISONED;
        this.effectTimers.poisoned = 5;
    },

    onHeal() {
        this.status = MobStatus.HEALING;
        this.health = Math.min(this.health + 20, this.maxHealth);
        if (this.stateMachine.can('recover')) {
            this.scheduleOnce(() => {
                this.stateMachine.recover();
            }, 1);
        }
    }, onRecover() {
        this.status = MobStatus.MOVING;
        this.effectTimers = {};
    },

    onDie() {
        this.status = MobStatus.DYING;
        cc.tween(this.node)
            .parallel(
                cc.tween().to(0.4, { scale: 0.1 }, { easing: 'quadIn' }),
                cc.tween().to(0.4, { opacity: 0 }, { easing: 'quadIn' })
            )
            .call(() => {
                this.node.scale = 1;
                this.node.opacity = 255;
                if (this.stateMachine.can('dead')) {
                    this.stateMachine.dead();
                }
            })
            .start();
    },

    onDead() {
        this.status = MobStatus.DEAD;
        this.node.active = false;
        this.constructor.numDie++;
        console.log(`Mob died. Total deaths: ${this.constructor.numDie}`);
    },

    onOutOfScreen() {
        this.status = MobStatus.OUT_OF_SCREEN;
        this.node.active = false;
    },

    onReset() {
        this.status = MobStatus.NONE;
        this.health = this.maxHealth;
        this.effectTimers = {};
        this.node.active = false;
    },


    spawn() {
        console.log(`Spawning mob at position: ${this.node.x}, ${this.node.y}`);

        if (this.stateMachine.can('spawn')) {
            this.stateMachine.spawn();
        } else {
            console.warn("Cannot spawn mob, current state:", this.stateMachine.state);
        }
    },

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            if (this.stateMachine.can('die')) {
                this.stateMachine.die();
            }
        } else if (this.stateMachine.can('takeDamage')) {
            this.stateMachine.takeDamage();

            this.scheduleOnce(() => {
                if (this.stateMachine.can('recover')) {
                    this.stateMachine.recover();
                }
            }, 0.5);
        }
    },

    applyStun() {
        if (this.stateMachine.can('stun')) {
            this.stateMachine.stun();
        }
    },

    applyFreeze() {
        if (this.stateMachine.can('freeze')) {
            this.stateMachine.freeze();
        }
    },

    applyBurn() {
        if (this.stateMachine.can('burn')) {
            this.stateMachine.burn();
        }
    },

    applyPoison() {
        if (this.stateMachine.can('poison')) {
            this.stateMachine.poison();
        }
    },

    reset() {
        if (this.stateMachine.can('reset')) {
            this.stateMachine.reset();
        }
    },


    checkMobCollision() {
        let roomController = this.node.parent.getComponent('RoomController');
        if (!roomController) return;

        let activeMobs = roomController.mobs.filter(m => m.active && m !== this.node);

        for (let otherMob of activeMobs) {
            if (this.isCollidingWithMob(otherMob)) {
                this.handleMobCollision(otherMob);
                break;
            }
        }
    },


    isCollidingWithMob(otherMobNode) {
        const CoordinateUtils = require('../Utils/CoordinateUtils');
        let mobWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let otherMobWorldPos = CoordinateUtils.getWorldPosition(otherMobNode);


        let laneToleranceY = 60;
        let verticalDistance = Math.abs(mobWorldPos.y - otherMobWorldPos.y);

        if (verticalDistance > laneToleranceY) {
            return false;
        }


        let mobBox = {
            left: mobWorldPos.x - this.node.width * 0.3,
            right: mobWorldPos.x + this.node.width * 0.3,
            top: mobWorldPos.y + this.node.height * 0.3,
            bottom: mobWorldPos.y - this.node.height * 0.3
        };

        let otherMobBox = {
            left: otherMobWorldPos.x - otherMobNode.width * 0.3,
            right: otherMobWorldPos.x + otherMobNode.width * 0.3,
            top: otherMobWorldPos.y + otherMobNode.height * 0.3,
            bottom: otherMobWorldPos.y - otherMobNode.height * 0.3
        };

        return mobBox.left < otherMobBox.right &&
            mobBox.right > otherMobBox.left &&
            mobBox.bottom < otherMobBox.top &&
            mobBox.top > otherMobBox.bottom;
    },


    handleMobCollision(otherMobNode) {
        let otherMobComponent = otherMobNode.getComponent('MobComponent');
        if (!otherMobComponent) return;

        const CoordinateUtils = require('../Utils/CoordinateUtils');
        let mobWorldPos = CoordinateUtils.getWorldPosition(this.node);
        let otherMobWorldPos = CoordinateUtils.getWorldPosition(otherMobNode);


        if (mobWorldPos.x > otherMobWorldPos.x) {

            this.pushBack();
        } else {

            otherMobComponent.pushBack();
        }
    },


    pushBack() {
        if (this.stateMachine.state !== 'moving') return;


        if (this.stateMachine.can('stun')) {
            this.stateMachine.stun();
        }


        let pushDistance = 20;
        let originalX = this.node.x;

        cc.tween(this.node)
            .to(0.2, { x: originalX + pushDistance }, { easing: 'quadOut' })
            .call(() => {

                if (this.stateMachine.can('recover')) {
                    this.stateMachine.recover();
                }
            })
            .start();
        //this.playPushBackEffect();
    },


    playAttackEffect() {

        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            let originalColor = sprite.node.color.clone();
            sprite.node.color = cc.Color.RED;
            cc.tween(sprite.node)
                .to(0.1, { color: cc.Color.WHITE })
                .to(0.1, { color: cc.Color.RED })
                .to(0.1, { color: originalColor })
                .start();
        }


        let originalScale = this.node.scale;
        cc.tween(this.node)
            .to(0.1, { scale: originalScale * 1.3 }, { easing: 'backOut' })
            .to(0.2, { scale: originalScale }, { easing: 'backIn' })
            .start();


        let originalPos = this.node.position.clone();
        cc.tween(this.node)
            .by(0.05, { x: 5 }, { easing: 'sineOut' })
            .by(0.05, { x: -10 }, { easing: 'sineInOut' })
            .by(0.05, { x: 5 }, { easing: 'sineIn' })
            .to(0.05, { position: originalPos })
            .start();
    },


    playPushBackEffect() {

        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            let originalColor = sprite.node.color.clone();
            sprite.node.color = cc.Color.YELLOW;
            cc.tween(sprite.node)
                .to(0.3, { color: originalColor })
                .start();
        }


        let originalPos = this.node.position.clone();
        cc.tween(this.node)
            .by(0.03, { y: 3 }, { easing: 'sineOut' })
            .by(0.03, { y: -6 }, { easing: 'sineInOut' })
            .by(0.03, { y: 3 }, { easing: 'sineIn' })
            .start();


        this.createStunEffect();
    },


    createStunEffect() {
        for (let i = 0; i < 3; i++) {
            let star = new cc.Node('Star');
            let starLabel = star.addComponent(cc.Label);
            starLabel.string = '★';
            starLabel.fontSize = 20;
            starLabel.node.color = cc.Color.YELLOW;

            star.parent = this.node.parent;
            let mobPos = this.node.position.clone();
            star.setPosition(mobPos.x, mobPos.y + this.node.height * 0.5);

            let radius = 30;
            let angle = (i * 120) * Math.PI / 180;

            cc.tween(star)
                .parallel(
                    cc.tween()
                        .repeatForever(
                            cc.tween()
                                .by(0.5, {}, {
                                    progress: (t) => {
                                        let currentAngle = angle + t * 2 * Math.PI;
                                        star.x = mobPos.x + Math.cos(currentAngle) * radius;
                                        star.y = mobPos.y + this.node.height * 0.5 + Math.sin(currentAngle) * radius;
                                        return t;
                                    }
                                })
                        ),

                    cc.tween().to(1.0, { opacity: 0 })
                )
                .call(() => {
                    star.destroy();
                })
                .start();
        }
    }
});
