class PokeRuleUtil {

    // 顶部间距
    public static readonly MARGIN_TOP: number = 20;
    // 纸牌设置的宽度（与exml组件同步）
    public static readonly POKE_WIDTH: number = 60;
    // 纸牌设置的高度（与exml组件同步）
    public static readonly POKE_HEIGHT: number = 86;
    // 列个数
    public static readonly COL_NUM: number = 8;
    // 缝隙宽度
    protected _space: number = 0;

    private static _manager: PokeRuleUtil;

    constructor() { }

    public static get Instance() {
        if (PokeRuleUtil._manager == null) {
            PokeRuleUtil._manager = new PokeRuleUtil();
            const stage: egret.Stage = SceneManagerUtil.Instance.rootLayer.stage;
            // 计算空隙大小（必要）
            PokeRuleUtil._manager._space = (stage.stageWidth - PokeRuleUtil.COL_NUM * PokeRuleUtil.POKE_WIDTH) / (PokeRuleUtil.COL_NUM + 1);
        }
        return PokeRuleUtil._manager;
    }

    // 扑克牌队列
    public pokeQueue: Poke[][] = [];
    // 聚合队列
    public GearsBox: Poke[] = [];
    // 顶部固定队列
    public TopFixedBox: Poke[] = [];
    // 中间固定队列
    public CenterFixedBox: Poke[] = [];

    // 由于顶部和中心部分固定，此处存储顶部和中心部分的碰撞点列
    private static _top_center_hit_point: PokePositions;

    /**
     * 获取固定框触碰点集合
     * @param bool 强制刷新
     */
    private fixedHitPointMapping(bool?: boolean): PokePositions {
        if (bool || (!PokeRuleUtil._top_center_hit_point
            || PokeRuleUtil._top_center_hit_point.length === 0)) {
            PokeRuleUtil._top_center_hit_point = [];
            // 合并顶部队列、中间部分队列
            const list: Poke[] = [...(this.TopFixedBox || []), ...(this.CenterFixedBox || [])];
            list.filter(poke => poke.config.off.openAdsorb)
                .forEach(poke =>
                    // 获取四个点坐标
                    PokeRuleUtil._top_center_hit_point.push(PokeRandomUtil.computeCapePoint(poke))
                )
        }
        return PokeRuleUtil._top_center_hit_point;
    }

    /**
     * 获取扑克牌触碰点集合
     */
    private get pokeHitPointMapping(): PokePositions {
        if (!this.pokeQueue) return [];
        return this.pokeQueue.filter(rowArray =>
            rowArray.length > 0
            && rowArray[rowArray.length - 1].config.off.openAdsorb
        ).map(rowArray =>
            PokeRandomUtil.computeCapePoint(rowArray[rowArray.length - 1])
        )
    }

    /**
     * 获取缝隙宽度
     *
     * @readonly
     * @type {number}
     * @memberof PokeRuleUtil
     */
    public get space(): number {
        return this._space;
    }

    // public layout() {

    // }

    /**
     * 获取全部碰撞点
     * @param bool 强制刷新
     */
    public getHitPoints(bool?: boolean): PokePositions {
        return [
            ...PokeRuleUtil.Instance.fixedHitPointMapping(bool),
            ...PokeRuleUtil.Instance.pokeHitPointMapping
        ]
    }

    /**
     * 判断扑克牌花色是否正确，是否可放置
     * @param localPoke 当前扑克牌
     * @param hitPoke 碰撞的目标扑克牌
     * @returns true: 可放置, false: 不可放置
     */
    public checkPokeSiteColor(localPoke: Poke, hitPoke: Poke): boolean {
        /**
         * 逻辑：
         * 1. 红色和黑色相互穿插
         * 2. 序号逐渐缩小 (碰撞 > 当前)
         */
        // 当前拖动的扑克牌，对象为空，判断为不可放置
        if (!localPoke) return false;
        // 碰撞的目标扑克牌，对象为空，判断为不可放置
        if (!hitPoke) return false;
        // 如果碰撞的扑克是默认固定方块时,判断为可放置
        if (hitPoke.config.off.fixed.is) return true;
        // 判断花色
        // 花色规则：对应Map 【a: '♥（红桃）', b: '♠（黑桃）', c: '♦（方块）', d: '♣（梅花）'】
        // a -> b | d; b -> a | c; c -> b | d; d -> a | c;
        // 处理花色
        const roleMap: { [num: string]: POKE_COLOR } = { a: 'RED', b: 'BLACK', c: 'RED', d: 'BLACK' };
        const localColor: POKE_COLOR = roleMap[localPoke.config.off.type];
        const hitColor: POKE_COLOR = roleMap[hitPoke.config.off.type];
        if (localColor === hitColor) return false;
        // 处理文字序号
        const localFigure: number = Number(localPoke.config.off.figure);
        const hitFigure: number = Number(hitPoke.config.off.figure);
        if ((localFigure + 1) !== hitFigure) return false;
        return true;
    }

    /**
     * 计算扑克牌自动归位
     */
    public handlePokeAccordMove() {
        // 1. 判断每一组最后一张是否是`A`
        PokeRuleUtil.Instance.pokeQueue
            .forEach(array => {
                // 获取最后一张牌
                const lastPoke: Poke = array.pop();
                // 如果为空，则不做处理。不为空 进入逻辑
                if (lastPoke) {

                }
            })
    }

    // 1. 获取所有碰撞点集合
    // 2. 根据碰撞点集合判断碰撞，获取全部碰撞点
    // 3. 根据碰撞点获取扑克

    public debugCode_GetPokeConfig(input: Poke[][] | Poke[]): any {
        const array: any = [];
        // 判断传入对象是否是集合，如果是集合则继续遍历
        if (Object.prototype.toString.call(input) === '[object Array]') {
            for (let row of input) {
                if (row instanceof Poke) {
                    array.push(row.config.off);
                } else if (Object.prototype.toString.call(row) === '[object Array]') {
                    array.push(PokeRuleUtil.Instance.debugCode_GetPokeConfig(row));
                }
            }
        }
        return array;
    }

    public debugCode_GetPoke(input: Poke | Poke[]) {
        if (!input) return;
        const typeMap: {
            a: string, b: string, c: string, d: string
        } = { a: '♥（红桃）', b: '♠（黑桃）', c: '♦（方块）', d: '♣（梅花）' };
        let array: Poke[] = [];
        // 判断传入对象是否是集合，如果是集合则继续遍历
        if (Object.prototype.toString.call(input) !== '[object Array]') {
            array = [input as Poke];
        } else {
            array = [...(input as Poke[])];
        }
        array.forEach(row => {
            console.log('%c' + typeMap[row.config.off.type] + '_ ' + row.config.off.figure, 'color:red;font-size:18px;');
        })
    }

    public debugCode_GetPokeInfo(input: Poke, inputConsoleStr: string = '') {
        if (!input) return;
        const typeMap: {
            a: string, b: string, c: string, d: string
        } = { a: '♥', b: '♠', c: '♦', d: '♣' };
        if (inputConsoleStr && inputConsoleStr.length > 0) console.log(inputConsoleStr);
        console.log('%c======================扑克牌详情 - start ==========================', 'color:#e1ddd8; font-size:12px;');
        console.log(`%c扑克牌：${typeMap[input.config.off.type]} ${input.config.off.figure}, 第${input.config.off.point.col + 1}列, 第${input.config.off.point.row + 1}个`, 'color:#2cbdffb0; font-size:12px;');
        console.log(`%c是否是固定框: ${input.config.off.fixed.is}, 固定盒子类型: ${input.config.off.fixed.type}`, 'color:#2cbdffb0; font-size:12px;');
        console.log(`%c已${input.config.off.openDrop ? ' 开启 ' : ' 关闭 '}拖拽[openDrop], 已${input.config.off.openAdsorb ? ' 开启 ' : ' 关闭 '}吸附[openAdsorb]`, 'color:#2cbdffb0; font-size:12px;')
        console.log('%c======================扑克牌详情 - end  ==========================', 'color:#e1ddd8; font-size:12px;');
    }
}