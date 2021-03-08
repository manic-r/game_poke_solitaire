class Config implements ConfigInterface {
    // 纸牌设置的高度（与exml组件同步）
    POKE_HEIGHT: number = 86;
    // 纸牌设置的宽度（与exml组件同步）
    POKE_WIDTH: number = 60;
    // 扑克牌类型 [a, b, c, d]
    POKE_TYPE: string[] = [];
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
    // 组件移动时间(ms)
    moveTime: number = 300;
    // 花色映射关系
    roleMap: { [num: string]: POKE_COLOR } = { a: 'RED', b: 'BLACK', c: 'RED', d: 'BLACK' };
    // 反向对应关系(对应配置中的`_GAME_MAPPING`)
    colorReverse: { [color: string]: POKE_COLOR };
    // 默认A的颜色
    defaultAColor: number = 0xCCFF80;
    // 默认提示的颜色
    defaultTipColor: number = 0xD2A2CC;

    // ==================================
    // 游戏是否保存
    __GAME_SAVING: boolean;
    // 游戏难度 (1: 简单, 2: 标准)
    __GAME_LEVEL: string;
    // 游戏吸附提示
    __GAME_TIP: boolean;
    // 映射关系 (1: 异色, 2: 同色)
    __GAME_MAPPING: string;
    // ==================================

    // 游戏状态标识key
    private GAME_END_STATE_KEY: boolean;

    constructor() {
        // 初始化布局对象 ===
        // 初始化获取游戏状态
        this.GAME_END_STATE_KEY = LocalStorageUtil.gameState;
        this.loadConfig();
        return this;
    }

    public init(): this {
        // 计算空隙大小（必要）
        const stage: egret.Stage = SceneManagerUtil.Instance.rootLayer.stage;
        this.space = (stage.stageWidth - this.POKE_TYPE.length * 2 * this.POKE_WIDTH) / (this.POKE_TYPE.length * 2 + 1);
        // 初始化布局对象 ===
        this.layout = {
            GearsBox: this.createGearsPoint(),
            TopFixedBox: this.createOutTemporaryPoint(),
            CenterFixedBox: this.createInTemporaryPoint()
        }
        // 获取扑克牌对象
        this.initGameData();
        return this;
    }

    private createGearsPoint(): Point[] {
        // 定义起始位置
        const startIndex: number = this.POKE_TYPE.length;
        console.log('this.POKE_TYPE', this.POKE_TYPE)
        // 根据扑克牌种类获取扑收纳盒个数
        return this.POKE_TYPE.map((_, i) => {
            return {
                x: this.space + (i + startIndex) * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP
            };
        });
    }

    private createOutTemporaryPoint(): Point[] {
        console.log('TopFixedBox', this.POKE_TYPE)
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
            gearsQueue: [],
            topBoxQueue: []
        };
    }

    /**
     * 创建游戏数据
     */
    private initGameData() {
        this.gameData = this.GAME_END_STATE_KEY ? this.getGameInfoByLocalStorage() : this.getGameInfoByCreator();
    }

    public get gameState(): boolean {
        return this.GAME_END_STATE_KEY;
    }

    public updateGameState(state?: GameState) {
        if (Object.isLegal(state)) {
            this.GAME_END_STATE_KEY = state === '1';
        } else {
            this.GAME_END_STATE_KEY = !this.GAME_END_STATE_KEY;
        }
    }

    // ========== 游戏配置对象加载 ===========
    public loadConfig(): this {
        // 游戏数据存储
        const save: string = egret.localStorage.getItem('_GAME_SAVING') || 'true';
        this.__GAME_SAVING = save === 'true';
        // 游戏难度
        const level: string = egret.localStorage.getItem('_GAME_LEVEL') || '2';
        this.__GAME_LEVEL = level;
        // 吸附位置提示
        const tip: string = egret.localStorage.getItem('_GAME_TIP') || 'true';
        this.__GAME_TIP = tip === 'true';
        // 映射关系
        const mapping: string = egret.localStorage.getItem('_GAME_MAPPING') || '1';
        this.__GAME_MAPPING = mapping;
        this.handle();
        return this;
    }

    private handle() {
        // 花色关系
        this.colorReverse = this.__GAME_MAPPING === '1' ? { 'RED': 'BLACK', 'BLACK': 'RED' } : { 'RED': 'RED', 'BLACK': 'BLACK' };
        // 游戏难度
        if (this.__GAME_LEVEL === '2') {
            this.POKE_TYPE = ['a', 'b', 'c', 'd'];
        } else if (this.__GAME_LEVEL === '1') {
            const map: { [index: string]: string[] } = {};
            for (let key in this.roleMap) {
                map[this.roleMap[key]] = map[this.roleMap[key]] || [];
                map[this.roleMap[key]].push(key)
            }
            // 异色
            if (this.__GAME_MAPPING === '1') {
                // 随机两个不同花色
                this.POKE_TYPE = [map['RED'][Object.random1<number>(0, 1)], map['BLACK'][Object.random1<number>(0, 1)]];
            }
            // 同色
            else if (this.__GAME_MAPPING === '2') {
                const array: string[][] = Object.keys(map).map(key => map[key]);
                this.POKE_TYPE = array[Object.random1<number>(0, 1)];
            }
        }
    }

    public _GAME_SAVING(value: any): this {
        if (egret.localStorage.setItem('_GAME_SAVING', value)) {
            this.__GAME_SAVING = value;
        }
        return this;
    }
    public _GAME_LEVEL(value: any): this {
        if (egret.localStorage.setItem('_GAME_LEVEL', value)) {
            this.__GAME_SAVING = value;
        }
        return this;
    }
    public _GAME_TIP(value: any): this {
        if (egret.localStorage.setItem('_GAME_LEVEL', value)) {
            this.__GAME_TIP = value;
        }
        return this;
    }
    public _GAME_MAPPING(value: any): this {
        if (egret.localStorage.setItem('_GAME_LEVEL', value)) {
            this.__GAME_MAPPING = value;
        }
        return this;
    }
}