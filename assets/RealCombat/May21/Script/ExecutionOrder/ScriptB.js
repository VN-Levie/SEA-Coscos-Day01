cc.Class({
    extends: cc.Component,
    editor: {
        executionOrder: 10,
    },
    onLoad() {
        cc.log("ScriptB - onLoad");
    },
    start() {
        cc.log("ScriptB - start");
    }
});
