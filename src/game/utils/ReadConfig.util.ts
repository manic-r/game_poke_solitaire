class Config implements ConfigInterface {
    // 纸牌设置的高度（与exml组件同步）
    POKE_HEIGHT: number = 86;
    // 纸牌设置的宽度（与exml组件同步）
    POKE_WIDTH: number = 60;
    // 扑克牌类型 [a, b, c, d]
    POKE_TYPE: string[] = ['a', 'b', 'c', 'd'];
    // URL常量地址
    POKE_PATH_PREFIX: string = `resource/assets/Poke/pk_`;
    POKE_PATH_SUFFIX: string = `.jpg`;
    // 每类牌数最大数
    MAX_TYPE_NUM: number = 13;
    // 每张牌上下间距
    MARGIN_TOP: number = 30;
    // 缝隙宽度
    space: number = 0;
    // 布局锚点
    layout: Layout;
    // 游戏数据
    gameData: StoreSave;

    // 状态标识key
    GAME_END_STATE_KEY: string = 'start';

    constructor() {
        // 计算空隙大小（必要）
        const stage: egret.Stage = SceneManagerUtil.Instance.rootLayer.stage;
        this.space = (stage.stageWidth - this.POKE_TYPE.length * 2 * this.POKE_WIDTH) / (this.POKE_TYPE.length * 2 + 1);
        // 初始化布局对象 ===
        this.layout = {
            GearsBox: this.createGearsPoint(),
            TopFixedBox: this.createOutTemporaryPoint(),
            CenterFixedBox: this.createInTemporaryPoint()
        }
        // 初始化布局对象 ===
        // 获取扑克牌对象
        this.initGameData();
    }

    private createGearsPoint(): Point[] {
        // 定义起始位置
        const startIndex: number = this.POKE_TYPE.length;
        // 根据扑克牌种类获取扑收纳盒个数
        return this.POKE_TYPE.map((_, i) => {
            return {
                x: this.space + (i + startIndex) * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP
            };
        });
    }

    private createOutTemporaryPoint(): Point[] {
        // 根据扑克牌种类获取扑收纳盒个数
        return this.POKE_TYPE.map((_, i) => {
            return {
                x: this.space + i * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP
            };
        });
    }

    private createInTemporaryPoint(): Point[] {
        // 根据扑克牌种类获取扑收纳盒个数
        const length: number = this.POKE_TYPE.length * 2;
        const result: Point[] = [];
        for (let i = 0; i < length; i++) {
            result.push({
                x: this.space + i * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP * 2 + this.POKE_HEIGHT,
            })
        }
        return result;
    }

    /**
     * localStorage中获取游戏数据
     */
    private getGameInfoByLocalStorage(): StoreSave {
        function getInfoInStorage<T>(key: string): T {
            let str: string = egret.localStorage.getItem(key) || '[]';
            str = str === 'null' || str === 'undefined' ? '[]' : str;
            return JSON.parse(str) || [];
        }
        return {
            pokeQueue: getInfoInStorage('pokeQueue'),
            gearsQueue: getInfoInStorage('gearsQueue'),
            topBoxQueue: getInfoInStorage('topBoxQueue')
        };
    }

    /**
     * 新建游戏数据
     */
    private getGameInfoByCreator(): StoreSave {
        // 创建：pokeQueue
        function creator(aClass: Config): string[][] {
            const result: string[][] = [];
            const creator: PokeRandomCreator = new PokeRandomCreator(aClass.POKE_TYPE);
            // 每行个数
            const length: number = aClass.layout.CenterFixedBox.length;
            for (let i = 0;
                i < aClass.MAX_TYPE_NUM * aClass.POKE_TYPE.length;
                i++) {
                // i % length 结果是下标，可以直接获取`input`的值
                const index: number = i % length;
                // 获取每一列的列表
                result[index] = result[index] || [];
                // 获取随机扑克牌对象
                result[index].push(creator.poke.name);
            }
            return result;
        }

        return {
            pokeQueue: creator(this),
            // TODO:
            // pokeQueue: [['pk_d_1'], ['pk_a_1'], ['pk_c_1'], ['pk_b_1']],
            gearsQueue: [],
            topBoxQueue: []
        };
    }

    /**
     * 创建游戏数据
     */
    private initGameData() {
        console.log('out  this.GAME_END_STATE_KEY', this.GAME_END_STATE_KEY)
        /**
         * 获取游戏状态
         * @returns 已结束返回: false, 未结束返回: true
         */
        const that: this = this;
        function gameEndState() {
            console.log('in  this.GAME_END_STATE_KEY', that.GAME_END_STATE_KEY)
            const state: string | boolean = egret.localStorage.getItem(this.GAME_END_STATE_KEY) || '0';
            return state === '1';
        }
        this.gameData = gameEndState() ? this.getGameInfoByLocalStorage() : this.getGameInfoByCreator();
    }
}