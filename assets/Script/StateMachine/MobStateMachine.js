const StateMachine = require('javascript-state-machine');

const MobStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'spawn', from: 'idle', to: 'moving' },
                { name: 'attack', from: 'moving', to: 'attacking' },
                { name: 'move', from: 'attacking', to: 'moving' },
                { name: 'takeDamage', from: ['moving', 'attacking'], to: 'hurt' },
                { name: 'stun', from: ['moving', 'attacking'], to: 'stunned' },
                { name: 'freeze', from: ['moving', 'attacking'], to: 'frozen' },
                { name: 'burn', from: ['moving', 'attacking'], to: 'burning' },
                { name: 'poison', from: ['moving', 'attacking'], to: 'poisoned' },
                { name: 'heal', from: ['hurt', 'poisoned', 'burning'], to: 'healing' },
                { name: 'recover', from: ['hurt', 'stunned', 'frozen', 'healing'], to: 'moving' },
                { name: 'die', from: ['hurt', 'poisoned', 'burning', 'moving', 'attacking'], to: 'dying' },
                { name: 'dead', from: 'dying', to: 'dead' },
                { name: 'outOfScreen', from: ['moving', 'attacking'], to: 'outOfScreen' },
                { name: 'reset', from: ['dead', 'outOfScreen'], to: 'idle' }
            ],
            methods: {
                onSpawn: function() {
                    component.onSpawn();
                },
                onMove: function() {
                    component.onMove();
                },
                onAttack: function() {
                    component.onAttack();
                },
                onTakeDamage: function() {
                    component.onTakeDamage();
                },
                onStun: function() {
                    component.onStun();
                },
                onFreeze: function() {
                    component.onFreeze();
                },
                onBurn: function() {
                    component.onBurn();
                },
                onPoison: function() {
                    component.onPoison();
                },
                onHeal: function() {
                    component.onHeal();
                },
                onRecover: function() {
                    component.onRecover();
                },
                onDie: function() {
                    component.onDie();
                },
                onDead: function() {
                    component.onDead();
                },
                onOutOfScreen: function() {
                    component.onOutOfScreen();
                },
                onReset: function() {
                    component.onReset();
                }
            }
        });
    }
};

module.exports = MobStateMachine;
