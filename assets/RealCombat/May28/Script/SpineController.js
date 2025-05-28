cc.Class({
    extends: cc.Component,

    properties: {
        spine: {
            default: null,
            type: sp.Skeleton
        },
        buttonLayout: {
            default: null,
            type: cc.Layout
        },
        animationButton: {
            default: null,
            type: cc.Prefab,
        },

    },


    onLoad() {
        if (!this.spine || !this.spine.skeletonData) {
            console.error("Spine or skeleton data missing");
            return;
        }

        const animations = this.spine.skeletonData.skeletonJson.animations;
        for (let animName in animations) {
            const animBtn = cc.instantiate(this.animationButton);
            const label = animBtn.getComponentInChildren(cc.Label);
            label.string = animName;
            const clickEvent = this.createClickEvent(animName);
            animBtn.getComponent(cc.Button).clickEvents.push(clickEvent);
            animBtn.parent = this.buttonLayout.node;

        }
    },

    createClickEvent(animName) {
        const event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = "SpineController";
        event.handler = "playAnimation";
        event.customEventData = animName;
        return event;
    },

    playAnimation(event, animName) {
        this.spine.setAnimation(0, animName, false);
    }



});
