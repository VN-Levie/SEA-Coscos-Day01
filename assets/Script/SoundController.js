// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.playBGM();
    },
    playBGM() {

        console.log("playBGM");
        var myAudioClipBGM = cc.audioEngine.play(this.backgroundMusicClip, true, 0.5);
        cc.audioEngine.setVolume(myAudioClipBGM, 0.5);

    },

    playClick() {
        console.log("playClick");
        var mayAudioClipClick = cc.audioEngine.play(this.buttonClickAudioClip, false, 1);
        cc.audioEngine.setVolume(mayAudioClipClick, 1);

    },


    start() {

    },

    // update (dt) {},
});
