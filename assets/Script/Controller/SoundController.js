cc.Class({
    extends: cc.Component,

    properties: {
        backgroundMusicClip: {
            type: cc.AudioClip,
            default: null
        },
        buttonClickAudioClip: {
            type: cc.AudioClip,
            default: null
        },
    },

    onLoad() {
        // this.playBGM();
    },
    playBGM() {
        var myAudioClipBGM = cc.audioEngine.play(this.backgroundMusicClip, true, 0.5);
        cc.audioEngine.setVolume(myAudioClipBGM, 0.5);

    },

    playClick() {
        var mayAudioClipClick = cc.audioEngine.play(this.buttonClickAudioClip, false, 1);
        cc.audioEngine.setVolume(mayAudioClipClick, 1);

    },


    start() {

    },

    // update (dt) {},
});
