cc.Class({
    extends: cc.Component,

    properties: {
        bgmClip: {
            default: null,
            type: cc.AudioClip
        },
        clickClip: {
            default: null,
            type: cc.AudioClip
        },
        bgmToggle: {
            default: null,
            type: cc.Node
        },
        sfxToggle: {
            default: null,
            type: cc.Node
        },
        volumeSlider: {
            default: null,
            type: cc.Slider
        },
    },

    onLoad() {
        this.playBGM();
        this.willPlayClickSFX = true;
    },

    playBGM() {
        this.bgmId = cc.audioEngine.play(this.bgmClip, true, 1);
        console.log("Background music started with ID:", this.bgmId);
    },

    playSFX() {
        if (this.willPlayClickSFX) {
            console.log("Playing click sound effect");

            cc.audioEngine.play(this.clickClip, false, 1);
        }
    },

    toggleBGM() {
        if (this.bgmToggle.getComponent(cc.Toggle).isChecked) {
            cc.audioEngine.resume(this.bgmId);
        }
        else {
            cc.audioEngine.pause(this.bgmId);
        }
    },

    toggleSFX() {
        this.willPlayClickSFX = this.sfxToggle.getComponent(cc.Toggle).isChecked;
    },

    volumeSliderHanlder() {
        const volume = this.musicSlider.progress;
        cc.audioEngine.setVolume(this.bgmId, volume);
    },

});
