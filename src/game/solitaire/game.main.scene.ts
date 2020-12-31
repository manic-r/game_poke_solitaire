class GameMainScene extends SceneBase {

    // 顶部间距
    readonly _margin_top: number = 20;
    // 纸牌设置的宽度（与exml组件同步）
    public static _pokeWidth: number = 60;
    // 纸牌设置的高度（与exml组件同步）
    public static _pokeHeight: number = 86;
    // 列个数
    readonly _colNum: number = 8;
    // 缝隙宽度
    protected _space: number = 0;

    public static gameScene: GameMainScene;

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        // 计算空隙大小（必要）
        this._space = (this.stage.stageWidth - this._colNum * GameMainScene._pokeWidth) / (this._colNum + 1);
        PokeRuleUtil.Instance.topFixedArray = this.createTopFixedBox();
        PokeRuleUtil.Instance.centerFixedArray = this.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeRandomUtil.creator(PokeRuleUtil.Instance.centerFixedArray);
        // 手指离开时, 为了处理鼠标移动过快，导致的图片跟不上产生的问题
        this.addEventListener(egret.TouchEvent.TOUCH_END, () => DropBaseUtil.onTouchEndHandle(false), this);
    }

    /**
     * 创建顶部固定盒子
     */
    private createTopFixedBox(): Poke[] {
        const result: Poke[] = [];
        for (let i = 0; i < this._colNum; i++) {
            // 前四个与后面的不同
            const config: PokeConfig = {
                x: this._space + i * (this._space + GameMainScene._pokeWidth), y: this._margin_top,
                off: { openDrop: false, fixed: { is: true, type: 'MODE', storey: 1 } }
            };
            if (i < 4) {
                config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
                config.off.openAdsorb = true;
                config.off.point = { col: i, row: 0 };
                config.off.fixed.type = 'BOX';
            } else {
                config.skinName = 'resource/eui_skins/games/PokeComponentSkin.exml';
            }
            const poke: Poke = new Poke(config);
            // 记录
            result.push(poke);
        }
        return result;
    }

    /**
     * 创建中心固定格子
     */
    private createCenterFixedBox(): Poke[] {
        const result: Poke[] = [];
        for (let i = 0; i < this._colNum; i++) {
            // 前四个与后面的不同
            const config: PokeConfig = {
                x: this._space + i * (this._space + GameMainScene._pokeWidth),
                y: this._margin_top * 2 + GameMainScene._pokeHeight,
                off: { openDrop: false, openAdsorb: false, point: { col: i, row: 0 }, fixed: { is: true, type: 'BOX', storey: 2 } }
            };
            config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
            const poke: Poke = new Poke(config);
            // 记录
            result.push(poke);
        }
        return result;
    }
}