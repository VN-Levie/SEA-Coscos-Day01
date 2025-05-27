cc.Class({
    extends: cc.Component,

    properties: {
        SettingPopup: require('PopupClass'),
        RankingPopup: require('PopupClass'),
    },

    onLoad() {
        this.closeAllPopups();
    },

    closeAllPopups(exceptPopup = null) {
        Object.values(this).forEach(popup => {
            if (popup instanceof cc.Component && popup !== exceptPopup) {
                popup.node.active = false;
            }
        });
    },

    togglePopup(targetPopup) {
        this.closeAllPopups(targetPopup);
        targetPopup.toggle();
    },

    toggleSetting() {
        this.togglePopup(this.SettingPopup);
    },

    toggleRanking() {
        this.togglePopup(this.RankingPopup);
    },
});
