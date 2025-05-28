const EventBus = require('../Core/EventBus');
const LoadingEvent = require('../Enum/LoadingEvent');
cc.Class({
    extends: cc.Component,
    onLoad() {
        EventBus.emit(LoadingEvent.LOAD_SCENE, "Lobby");
    },

});
