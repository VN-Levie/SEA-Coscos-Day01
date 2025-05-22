cc.Class({
    extends: cc.Component,
    editor: {
        executionOrder: -10,
    },
    onLoad() {
        cc.log("ScriptA - onLoad");
    },
    start() {
        cc.log("ScriptA - start");
    }
});
