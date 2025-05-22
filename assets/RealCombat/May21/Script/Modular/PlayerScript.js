var config = require("ConfigScript");

cc.Class({
    extends: cc.Component,
    onLoad() {
        cc.log("Speed in config is:", config.moveSpeed);
        // console.log("Speed in config is:", config.moveSpeed);
        
    }
});
