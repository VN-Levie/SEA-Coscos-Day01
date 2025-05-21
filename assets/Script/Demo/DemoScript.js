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

        alataRegular: {
            default: null,
            type: cc.Font,
        },

        josefinSansBold: {
            default: null,
            type: cc.Font,
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




        // cc.audioEngine.play(this.bgmClip, true, 1);
        // this.playBGM();
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
        if (this.bgmId !== undefined && cc.audioEngine.getState(this.bgmId) === cc.audioEngine.AudioState.PLAYING) {
            console.log("BGM is already playing");
            return;
        }

        this.bgmId = cc.audioEngine.play(this.bgmClip, true, 0.5);
        cc.audioEngine.setVolume(this.bgmId, 0.5);
    },


    stopBGM() {
        if (this.bgmId !== undefined) {
            cc.audioEngine.stop(this.bgmId);
            this.bgmId = undefined;
        } else {
            console.log("BGM is not playing");
        }
    }

    // update (dt) {},
});
