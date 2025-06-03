const GAME_AREA = {
    topLeft: cc.v2(0, 450),
    topRight: cc.v2(1560, 450),
    bottomLeft: cc.v2(0, 0),
    bottomRight: cc.v2(1560, 0)
};
const MobStatus = require('MobStatus');

cc.Class({
    extends: cc.Component,
    properties: {
        timerLabel: cc.Label,
        timer: { default: 0, type: cc.Integer },
        mob: { default: null, type: cc.Prefab },
        mobs: [],
        defender: { default: null, type: cc.Prefab },
        defenders: [],
        mobCount: { default: 50, type: cc.Integer },
        lastLane: { default: 0, type: cc.Integer },
        laneCount: { default: 3, type: cc.Integer },
        spawnInterval: { default: 3.5, type: cc.Float },
        spawnTimer: { default: 0, type: cc.Float },
    },

    onLoad() {
        this.timer = 90;
        this.updateTimerLabel();
        this.generateMobs(this.mobCount);
        this.spawnTimer = 0;
        cc.director.getCollisionManager().enabled = true;
        this.generateDefenders();
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    update(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
            if (this.timer < 0) this.timer = 0;
            this.updateTimerLabel();
        }
        this.spawnTimer -= dt;


        if (this.spawnTimer <= 0) {
            this.trySpawnMob();
            this.spawnTimer = this.spawnInterval;

        }
        let activeMobs = this.mobs.filter(mob => mob.active);
        if (activeMobs.length > 0) {
            this.defenders.forEach(defender => {
                let defenderComponent = defender.getComponent('DefenderComponent');
                if (defenderComponent && defenderComponent.stateMachine.can('activate')) {
                    defenderComponent.activate();
                }
            });
        }
    },
    trySpawnMob() {
        let activeMobs = this.mobs.filter(mob => mob.active);

        if (activeMobs.length >= 6) {
            var int = Math.floor(Math.random() * 100);
            console.log(`Active mobs: ${activeMobs.length}, Random int: ${int}`);

            if (int < 30) {
                return;
            }
        }


        let laneIndex = this.getLane(this.lastLane);
        let mob = this.mobs.find(mob => !mob.active && mob.getComponent('MobComponent') && mob.getComponent('MobComponent').stateMachine.can('spawn'));
        if (!mob) {
            //TODO: Check điều kiện thắng
            console.warn("No available mob to spawn");
            return;
        }
        let mobComponent = mob.getComponent('MobComponent');
        if (!mobComponent) {
            console.warn("MobComponent not found on mob");
            return;
        }

        mob.setPosition(GAME_AREA.topRight.x, this.getLanePosition(laneIndex));
        mobComponent.spawn();
    },
    getLane(lastLane) {
        let laneIndex = Math.floor(Math.random() * this.laneCount);
        while (laneIndex === lastLane) {
            laneIndex = Math.floor(Math.random() * this.laneCount);
        }
        this.lastLane = laneIndex;
        return laneIndex;
    },
    getLanePosition(laneIndex) {
        const startY = GAME_AREA.bottomLeft.y + 100;
        const endY = GAME_AREA.bottomLeft.y + 500;
        const step = (endY - startY) / (this.laneCount - 1);
        return startY + laneIndex * step;
    },

    generateMobs(count) {
        this.mobs = [];
        for (let i = 0; i < count; i++) {
            let mob = cc.instantiate(this.mob);
            mob.parent = this.node;
            mob.active = false;
            this.mobs.push(mob);
        }
    },
    generateDefenders() {
        this.defenders.forEach(d => d.destroy && d.destroy());
        this.defenders = [];
        let xList = [
            GAME_AREA.bottomLeft.x + 100,
            GAME_AREA.bottomLeft.x + 300,
            GAME_AREA.bottomLeft.x + 100
        ];
        for (let i = 0; i < this.laneCount; i++) {
            let defender = cc.instantiate(this.defender);
            defender.parent = this.node;
            defender.setPosition(cc.v2(xList[i], this.getLanePosition(i)));
            let defenderComponent = defender.getComponent('DefenderComponent');
            if (defenderComponent) {
                defenderComponent.node.group = "DefenderGroup";
            }
            defenderComponent.name = `Defender ${i}`;
            defenderComponent.node.scaleY = 0;
            defender.active = true;

            this.defenders.push(defender);
        }
    },
    updateTimerLabel() {
        if (!this.timerLabel) return;
        let minutes = Math.floor(this.timer / 60);
        let seconds = Math.floor((this.timer % 60));
        this.timerLabel.string = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.one:
                this.applyRandomEffectsToMobs();
                break;
            case cc.macro.KEY.two:
                this.logGameState();
                break;
            case cc.macro.KEY.three:
                this.testMobStateMachine();
                break;
            case cc.macro.KEY.four:
                this.testDefenderStateMachine();
                break;
            case cc.macro.KEY.five:
                this.debugCoordinates();
                break;
            case cc.macro.KEY.six:
                this.testRangeDetection();
                break;
            default:
                break;
        }
    },

});
