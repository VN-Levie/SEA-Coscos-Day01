const EventEmitter = require('events');

class EventBus {
    constructor() {
        this._emitter = new EventEmitter();
        this._emitter.setMaxListeners(100);
        console.log('EventBus initialized with max listeners set to 100');
        
    }

    emit(...args) {
        this._emitter.emit(...args);
    }

    on(event, listener, context = null) {
        if (context) {
            this._emitter.on(event, listener.bind(context));
        } else {
            this._emitter.on(event, listener);
        }
    }

    once(event, listener, context = null) {
        if (context) {
            this._emitter.once(event, listener.bind(context));
        } else {
            this._emitter.once(event, listener);
        }
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    removeAll(event) {
        this._emitter.removeAllListeners(event);
    }
}

// Export **instance** trực tiếp, dùng rất gọn:
module.exports = new EventBus();
