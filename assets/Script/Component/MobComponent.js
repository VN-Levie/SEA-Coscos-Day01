const MobStatus = require('MobStatus');
const MobStateMachine = require('../StateMachine/MobStateMachine');

cc.Class({
    extends: cc.Component,
    properties: {
        speed: 100,
        health: 100,
        maxHealth: 100,
        status: {
            default: MobStatus.NONE,
            type: MobStatus
        },
        //healthBar
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
                this.node.x -= this.speed * dt;
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
    },

    onRecover() {
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
    }
});
