cc.Class({
    extends: require('PopupClass'),

    properties: {
        rankingTable: {
            default: null,
            type: require('RankingTable'),
        },
        data: {
            default: [],
            type: [cc.JsonAsset],
            visible: false,
        },
    },

    onLoad() {
        // this.tableController = this.tableController || cc.find('Canvas/TableController').getComponent('TableController');
        // this.tableController.loadRankingData();
        this.init();
    },

    init() {
        const fakeData = [
            { username: 'JohnDoe', level: 100 },
            { username: 'JaneSmith', level: 99 },
            { username: 'ShadowHunter', level: 99 },
            { username: 'MysticMage', level: 72 },
            { username: 'LunarLight', level: 80 },
            { username: 'StarGazer', level: 88 },
            { username: 'CosmicCrusader', level: 86 },
            { username: 'NebulaNavigator', level: 85 },
            { username: 'GalacticGuardian', level: 89 },
            { username: 'CelestialSage', level: 97 },
        ];

        // this.data ??= fakeData; 
        if (!this.data || this.data.length === 0) {
            this.data = fakeData;
        }
    },

    toggle() {
        this._super();
        if (this.node.active) {
            this.rankingTable.showData(this.data);
        }
    }
});
