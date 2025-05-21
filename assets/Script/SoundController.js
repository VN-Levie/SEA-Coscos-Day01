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
        audioClipBGM: {
            type: cc.AudioClip,
            default: null
        },
        audioClipClick: {
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
        audioClipBGM = cc.audioEngine.play(this.audioClipBGM, true, 0.5);
        cc.audioEngine.setVolume(audioClipBGM, 0.5);
        
    },

    playClick() {
        console.log("playClick");
        audioClipClick = cc.audioEngine.play(this.audioClipClick, false, 1);
        cc.audioEngine.setVolume(audioClipClick, 1);

    },


    start() {

    },

    // update (dt) {},
});
