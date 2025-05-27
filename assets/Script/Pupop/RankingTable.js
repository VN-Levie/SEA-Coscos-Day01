cc.Class({
    extends: cc.Component,

    properties: {
        rankingItem: {
            default: null,
            type: cc.Prefab,
        },
        scrollView: {
            default: null,
            type: cc.ScrollView,
        },
        layoutTable: {
            default: null,
            type: cc.Node,
        },
        cellList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        rankColors: {
            default: [],
            type: [cc.Color],
            visible: false,
        },
    },

    onLoad() {
        this.rankColors = [
            cc.Color.YELLOW,
            cc.Color.ORANGE,
            cc.Color.RED,
            cc.Color.GREEN,
            cc.Color.BLUE,
            cc.Color.MAGENTA,
            cc.Color.GRAY,
            cc.Color.WHITE,
            new cc.Color(200, 200, 200),
            cc.Color.BLACK
        ];
        for (let i = 0; i < 10; i++) {
            let cell = cc.instantiate(this.rankingItem);
            cell.parent = this.layoutTable;

            if (i < this.rankColors.length) {
                cell.color = this.rankColors[i];
            }

            this.cellList.push(cell);
        }
    },

    showData(data) {
        data.sort((a, b) => b.level - a.level);
        data.forEach((item, index) => {
            let cell = this.cellList[index];

            let labelName = cell.getChildByName('NameLabel').getComponent(cc.Label);
            let labelRank = cell.getChildByName('RankLabel').getComponent(cc.Label);
            let labelLv = cell.getChildByName('LevelLabel').getComponent(cc.Label);

            labelLv.string = `Lv: ${item.level}`;
            labelName.string = item.username;
            labelRank.string = (index + 1).toString();
        });
    },
});
