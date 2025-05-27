class EventBus {
    constructor() {
        this._emitter = new cc.EventTarget();
        console.log('EventBus (using cc.EventTarget) initialized.');
    }

    emit(...args) {
        if (args.length > 0) {
            this._emitter.emit(...args);
        } else {
            console.warn("EventBus.emit() called without arguments.");
        }
    }

    on(event, listener, context = null) {
        this._emitter.on(event, listener, context);
    }

    once(event, listener, context = null) {
        this._emitter.once(event, listener, context);
    }

    off(event, listener, context = null) {
        this._emitter.off(event, listener, context);
    }



    removeAll(event) {
        if (typeof event === 'string') {
            this._emitter.removeAllListeners(event.toString());
        } else if (event && typeof event === 'object') {
            this._emitter.targetOff(event);
        } else if (!event) {
            cc.warn("EventBus.removeAll: Called without an argument or with a falsy one. cc.EventTarget does not support removing all listeners for all events globally in this manner. If you intend to remove listeners for a specific event, pass the event name (string). If for a specific target, pass the target object.");
        } else {
            cc.warn(`EventBus.removeAll: Invalid argument type for 'event'. Expected string or target object. Received: ${typeof event}`);
        }
    }
}


const eventBusInstance = new EventBus();
module.exports = eventBusInstance;