const EventBus = require('../Core/EventBus');
const PopupType = require('../Enum/PopupType');
const LoadingEvent = require('../Enum/LoadingEvent');

let LobbyController = cc.Class({
    extends: cc.Component,

    onLoad() {
        LobbyController.instance = this;
    },
  
    onClickStartGame() {
        console.log("Start Game button clicked");
        EventBus.emit(LoadingEvent.LOAD_SCENE, "GameRoom");
    },
});

module.exports = LobbyController;
