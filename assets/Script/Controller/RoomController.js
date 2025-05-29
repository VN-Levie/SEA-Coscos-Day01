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
        mobCount: { default: 50, type: cc.Integer },
        lastLane: { default: 0, type: cc.Integer },
        laneCount: { default: 3, type: cc.Integer },
        spawnInterval: { default: 3.5, type: cc.Float },
        spawnTimer: { default: 0, type: cc.Float }
    },
    onLoad() {
        this.timer = 90;
        this.updateTimerLabel();
        this.generateMobs(this.mobCount);
        this.spawnTimer = 0;
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
    },
    trySpawnMob() {
        let activeMobs = this.mobs.filter(mob => mob.active);

        if (activeMobs.length >= 6) {
            var int = Math.floor(Math.random() * 100);
            console.log(`Active mobs: ${activeMobs.length}, Random int: ${int}`);

            if (int < 50) {
                return;
            }

        }
        let laneIndex = this.getLane(this.lastLane);
        let mob = this.mobs.find(mob => !mob.active && mob.getComponent('MobController').status === MobStatus.NONE);
        if (!mob) return;
        let mobController = mob.getComponent('MobController');
        mob.setPosition(this.getLanePosition(laneIndex));
        mob.active = true;
        mobController.status = MobStatus.MOVING;
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
        let x = GAME_AREA.topRight.x;
        let yList = [
            GAME_AREA.bottomLeft.y + 100,
            GAME_AREA.bottomLeft.y + 250,
            GAME_AREA.bottomLeft.y + 400
        ];
        let y = yList[laneIndex];
        return cc.v2(x, y);
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
    updateTimerLabel() {
        if (!this.timerLabel) return;
        let minutes = Math.floor(this.timer / 60);
        let seconds = Math.floor((this.timer % 60));
        this.timerLabel.string = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
