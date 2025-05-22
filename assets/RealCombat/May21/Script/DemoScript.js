cc.Class({
    extends: cc.Component,

    properties: {

        lblMessage: {
            default: null,
            type: cc.Label,
            displayName: "Score (player)",
            tooltip: "The score of player",
        },

        iconSprite: {
            default: null,
            type: cc.Sprite,
            displayName: "Score (player)",
            tooltip: "The score of player",
        },
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },

        bgmClip: {
            type: cc.AudioClip,
            default: null,
        },

        clipClip: {
            type: cc.AudioClip,
            default: null,
        },

        alataRegular: {
            default: null,
            type: cc.Font,
        },

        josefinSansBold: {
            default: null,
            type: cc.Font,
        },

        bgmButton: {
            default: null,
            type: cc.Button,
            displayName: "BGM Toggle Button",
            tooltip: "Button to toggle background music",
        },

        bgmButtonLabel: {
            default: null,
            type: cc.Label,
            displayName: "BGM Button Label",
            tooltip: "Label for the BGM toggle button",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log('Game Load');

        this.lblMessage.string = "Hello Cocos from Vscode!";
        this.lblMessage.node.color = cc.Color.RED;
        this.lblMessage.node.anchorX = 0;
        this.lblMessage.node.anchorY = 0;
        this.lblMessage.node.scale = 1;
        this.lblMessage.node.opacity = 255;
        // this.lblMessage.node.angle = 45;
        this.lblMessage.node.x = 50;
        this.lblMessage.node.y = -25;
        this.lblMessage.node.active = true;
        this.iconSprite.spriteFrame = this.spriteFrame;

        // if (this.bgmButton) {
        //     this.bgmButton.node.on('click', this.toggleBGM, this);
        // }

        if (this.bgmButtonLabel) {
            // Assuming BGM is initially off
            if (this.bgmId !== undefined && cc.audioEngine.getState(this.bgmId) === cc.audioEngine.AudioState.PLAYING) {
                this.bgmButtonLabel.string = "Stop BGM";
            } else {
                this.bgmButtonLabel.string = "Play BGM";
            }
        }

    },

    start() {
        console.log('Game Start');

        this.schedule(() => {
            this.lblMessage.font = this.lblMessage.font == this.alataRegular ? this.josefinSansBold : this.alataRegular;
            this.lblMessage.node.color = this.lblMessage.node.color == cc.Color.RED ? cc.Color.BLUE : cc.Color.RED;
            // this.lblMessage.node.scale = this.lblMessage.node.scale == 1 ? 2 : 1;
            this.lblMessage.node.opacity = this.lblMessage.node.opacity == 255 ? 128 : 255;
            // this.lblMessage.node.angle = this.lblMessage.node.angle == 0 ? 45 : 0;
            // this.lblMessage.node.x = Math.random() * 100 - 50;
            // this.lblMessage.node.y = Math.random() * 100 - 50;
            // console.log("Change font");
        }, 1);
    },
    playBGM() {
        console.log("playBGM");        
        if (!this.bgmClip || (this.bgmId !== undefined && cc.audioEngine.getState(this.bgmId) === cc.audioEngine.AudioState.PLAYING)) {
            if (!this.bgmClip) {
                console.log("BGM clip is not assigned.");
            } else {
                console.log("BGM is already playing");
            }
            return;
        }

        this.bgmId = cc.audioEngine.play(this.bgmClip, true, 0.5);
        if (this.bgmId !== cc.audioEngine.INVALID_AUDIO_ID) {
            cc.audioEngine.setVolume(this.bgmId, 0.5);
            console.log("BGM started playing with ID:", this.bgmId);
        } else {
            console.error("Failed to play BGM.");
            this.bgmId = undefined;
        }
    },

    playClick() {
        console.log("playClick");

        this.clickId = cc.audioEngine.play(this.clipClip, false, 1);
        cc.audioEngine.setVolume(this.clickId, 1);
    },


    stopBGM() {
        if (this.bgmId !== undefined && this.bgmId !== cc.audioEngine.INVALID_AUDIO_ID) {
            cc.audioEngine.stop(this.bgmId);
            console.log("BGM stopped");
            this.bgmId = undefined;
        } else {
            console.log("BGM is not playing or bgmId is invalid");
        }
    },

    toggleBGM() {
        console.log("toggleBGM");
        if (this.bgmId !== undefined && cc.audioEngine.getState(this.bgmId) === cc.audioEngine.AudioState.PLAYING) {
            console.log("Stopping BGM");
            this.stopBGM();
            if (this.bgmButtonLabel) {
                this.bgmButtonLabel.string = "Play BGM";
            }
        } else {
            console.log("Playing BGM");
            this.playBGM();
            if (this.bgmId !== undefined && this.bgmId !== cc.audioEngine.INVALID_AUDIO_ID && cc.audioEngine.getState(this.bgmId) === cc.audioEngine.AudioState.PLAYING) {
                if (this.bgmButtonLabel) {
                    this.bgmButtonLabel.string = "Stop BGM";
                }
            } else {
                if (this.bgmButtonLabel) {
                    this.bgmButtonLabel.string = "Play BGM";
                }
            }
        }
    }

    // update (dt) {},
});
