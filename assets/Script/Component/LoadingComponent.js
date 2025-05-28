const EventBus = require("EventBus");
const LoadingEvent = require("LoadingEvent");

cc.Class({
    extends: cc.Component,

    properties: {
        loadingCircle: cc.Node,
        progressLabel: cc.Label,
        slider: cc.Slider,
    },

    onLoad() {
        this.slider.node.active = false;
        this.loadingCircle.active = false;
        this._lastPercent = -1;
        this.rotateCircle();
        EventBus.on(LoadingEvent.LOAD_SCENE, this.preloadScene, this);
    },

    onDestroy() {
        EventBus.off(LoadingEvent.LOAD_SCENE, this.preloadScene);
    },

    rotateCircle() {
        cc.tween(this.loadingCircle)
            .by(1, { angle: -360 })
            .repeatForever()
            .start();
    },

    preloadScene(sceneName) {
        this.slider.node.active = true;
        this.loadingCircle.active = true;
        this.node.opacity = 255;

        cc.director.preloadScene(sceneName, (completedCount, totalCount) => {
            let percent = Math.floor((completedCount / totalCount) * 100);
            let progress = totalCount > 0 ? completedCount / totalCount : 0;
            this.slider.progress = progress;
            if (this._lastPercent !== percent) {
                this._lastPercent = percent;
                this.progressLabel.string = `Loading... ${percent}% (${completedCount}/${totalCount})`;
            }
        }, () => {
            cc.tween(this.node)
                .to(0.75, { opacity: 0 })
                .call(() => cc.director.loadScene(sceneName))
                .start();
        });
    },
});
