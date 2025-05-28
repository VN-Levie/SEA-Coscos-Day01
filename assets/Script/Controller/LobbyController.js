const EventBus = require('../Core/EventBus');
const PopupType = require('../Enum/PopupType');
const LoadingEvent = require('../Enum/LoadingEvent');

let LobbyController = cc.Class({
    extends: cc.Component,

    onLoad() {
        LobbyController.instance = this;
    },

    onClickSetting() {
        EventBus.emit('SHOW_POPUP', PopupType.SETTING);
    },

    onClickRanking() {
        EventBus.emit('SHOW_POPUP', PopupType.RANKING);
    }
});

module.exports = LobbyController;
