const StateMachine = require('javascript-state-machine');

const DefenderStateMachine = {
    createStateMachine(component) {
        return new StateMachine({
            init: 'setup',
            transitions: [
                { name: 'finishSetup', from: 'setup', to: 'active' },
                { name: 'activate', from: 'idle', to: 'active' },
                { name: 'startShooting', from: 'active', to: 'shooting' },
                { name: 'stopShooting', from: 'shooting', to: 'active' },
                { name: 'takeDamage', from: ['active', 'shooting'], to: 'damaged' },
                { name: 'repair', from: 'damaged', to: 'active' },
                { name: 'upgrade', from: ['active', 'shooting'], to: 'upgrading' },
                { name: 'finishUpgrade', from: 'upgrading', to: 'active' },
                { name: 'overload', from: 'shooting', to: 'overloaded' },
                { name: 'cooldown', from: 'overloaded', to: 'active' },
                { name: 'deactivate', from: ['active', 'shooting', 'damaged', 'overloaded'], to: 'idle' },
                { name: 'destroy', from: ['damaged', 'active', 'shooting'], to: 'destroyed' },
                { name: 'reset', from: 'destroyed', to: 'idle' }
            ],
            methods: {
                onActivate: function () {
                    component.onActivate();
                },
                onStartShooting: function () {
                    component.onStartShooting();
                },
                onStopShooting: function () {
                    component.onStopShooting();
                },
                onTakeDamage: function () {
                    component.onTakeDamage();
                },
                onRepair: function () {
                    component.onRepair();
                },
                onUpgrade: function () {
                    component.onUpgrade();
                },
                onFinishUpgrade: function () {
                    component.onFinishUpgrade();
                },
                onOverload: function () {
                    component.onOverload();
                },
                onCooldown: function () {
                    component.onCooldown();
                },
                onDeactivate: function () {
                    component.onDeactivate();
                },
                onDestroy: function () {
                    component.onDestroy();
                },
                onReset: function () {
                    component.onReset();
                }
            }
        });
    }
};

module.exports = DefenderStateMachine;
