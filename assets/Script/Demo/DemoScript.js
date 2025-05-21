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

        
       

        cc.audioEngine.play(this.bgmClip, true, 1);
    },

    start() {
        console.log('Game Start');
        
        setInterval(() => {
            this.lblMessage.font = this.lblMessage.font == this.alataRegular ? this.josefinSansBold : this.alataRegular;
            this.lblMessage.node.color = this.lblMessage.node.color == cc.Color.RED ? cc.Color.BLUE : cc.Color.RED;
            // this.lblMessage.node.scale = this.lblMessage.node.scale == 1 ? 2 : 1;
            this.lblMessage.node.opacity = this.lblMessage.node.opacity == 255 ? 128 : 255;
            // this.lblMessage.node.angle = this.lblMessage.node.angle == 0 ? 45 : 0;
            // this.lblMessage.node.x = Math.random() * 100 - 50;
            // this.lblMessage.node.y = Math.random() * 100 - 50;
            console.log("Change font");

        }
            , 1000);
    },

    // update (dt) {},
});
