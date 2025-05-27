cc.Class({
    extends: cc.Component,
    toggle() {
        this.node.active = !this.node.active;
    }
});
