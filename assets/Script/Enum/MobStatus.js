const MobStatus = cc.Enum({
    NONE: 0,
    IDLE: 1,
    MOVING: 2,
    ATTACKING: 3,
    DYING: 4,
    DEAD: 5,
    STUNNED: 6,
    FROZEN: 7,
    BURNING: 8,
    POISONED: 9,
    HEALING: 10,
    BUFFED: 11,
    DEBUFFED: 12,
    OUT_OF_SCREEN: 13,
});
module.exports = MobStatus;
