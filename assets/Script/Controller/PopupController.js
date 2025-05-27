const EventBus = require('Core/EventBus');
const PopupType = require('Enum/PopupType');

let PopupController = cc.Class({
    extends: cc.Component,

    properties: {
        SettingPopup: require('Popup/SettingPopup'),
        RankingPopup: require('Popup/RankingPopup'),
    },

    onLoad() {
        PopupController.instance = this;
        this.closeAllPopups();
        this._showPopupHandler = (type) => this.onShowPopup(type);
        EventBus.on('SHOW_POPUP', this._showPopupHandler);
    },

    onDestroy() {
        EventBus.off('SHOW_POPUP', this._showPopupHandler);
    },

    closeAllPopups() {
        this.closeAllPopupsExcept(null);
    },

    closeAllPopupsExcept(exceptPopup = null) {
        [this.SettingPopup, this.RankingPopup].forEach(popup => {
            if (popup instanceof cc.Component && popup !== exceptPopup) {
                popup.node.active = false;
            }
        });
    },

    onShowPopup(type) {
        let targetPopup = null;
        switch (type) {
            case PopupType.SETTING:
                targetPopup = this.SettingPopup;
                break;
            case PopupType.RANKING:
                targetPopup = this.RankingPopup;
                break;
            default:
                return;
        }
        this.closeAllPopupsExcept(targetPopup);
        if (!targetPopup.node.active) {
            targetPopup.toggle();
        }

    },

    closePopup(targetPopup) {
        if (targetPopup instanceof cc.Component) {
            targetPopup.node.active = false;
        }
    },

    closeSettingPopup() {
        this.closePopup(this.SettingPopup);
    }
    ,
    closeRankingPopup() {
        this.closePopup(this.RankingPopup);
    }
});

module.exports = PopupController;
