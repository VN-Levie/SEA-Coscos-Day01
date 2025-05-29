const EventBus = require('../Core/EventBus');
const PopupType = require('../Enum/PopupType');
const LoadingEvent = require('../Enum/LoadingEvent');

let HeaderComponent = cc.Class({
    extends: cc.Component,

    onLoad() {
        HeaderComponent.instance = this;
    },

    onClickSetting() {
        EventBus.emit('SHOW_POPUP', PopupType.SETTING);
    },

    onClickRanking() {
        EventBus.emit('SHOW_POPUP', PopupType.RANKING);
    },

    onClickHome() {
        console.log("Start Game button clicked");
        EventBus.emit(LoadingEvent.LOAD_SCENE, "Lobby");
    },
});

module.exports = HeaderComponent;
