class PokeRuleUtil {

    private static _manager: PokeRuleUtil;

    constructor() { }

    public static get Instance() {
        if (PokeRuleUtil._manager == null) {
            PokeRuleUtil._manager = new PokeRuleUtil();
        }
        return PokeRuleUtil._manager;
    }

    // 扑克牌队列
    public pokeQueue: Poke[][] = [];
    // 聚合队列
    public GearsBox: Poke[] = [];
    // 顶部固定队列
    public TopFixedBox: FixedBox[] = [];
    // 中间固定队列
    public CenterFixedBox: FixedBox[] = [];

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
            const list: FixedBox[] = [...(this.TopFixedBox || []), ...(this.CenterFixedBox || [])];
            list.filter(poke => poke.config.off.openAdsorb)
                .forEach(poke =>
                    // 获取四个点坐标
                    PokeRuleUtil._top_center_hit_point.push(PokeInitUtil.computeCapePoint(poke))
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
            PokeInitUtil.computeCapePoint(rowArray[rowArray.length - 1])
        )
    }

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
        const localColor: POKE_COLOR = roleMap[localPoke.config.off.poke.type];
        const hitColor: POKE_COLOR = roleMap[hitPoke.config.off.poke.type];
        if (localColor === hitColor) return false;
        // 处理文字序号
        const localFigure: number = Number(localPoke.config.off.poke.figure);
        const hitFigure: number = Number(hitPoke.config.off.poke.figure);
        if ((localFigure + 1) !== hitFigure) return false;
        return true;
    }

    /**
     * 获取扑克牌即时坐标
     * @param poke 扑克牌对象
     */
    public getPokeImmediatelyPoint(poke: Poke): PokePoint {
        for (let colIndex in this.pokeQueue) {
            for (let rowIndex in this.pokeQueue[colIndex]) {
                if (this.pokeQueue[colIndex][rowIndex] === poke) {
                    return {
                        col: Number(colIndex),
                        row: Number(rowIndex)
                    };
                }
            }
        }
        return null;
    }

    /**
     * 获取指定扑克牌其下面的扑克
     * @param poke 扑克牌对象
     */
    public getPokeNextPokes(poke: Poke): Poke[] {
        // 获取指定扑克牌所在的即时坐标
        const point: PokePoint = this.getPokeImmediatelyPoint(poke);
        if (!point) return [];
        const rowQueue: Poke[] = this.pokeQueue[point.col];
        return rowQueue.slice(point.row);
    }

    /**
     * 处理历史所在位置时列数据对象
     */
    public historyQueueHandle(poke: Poke) {
        // 获取扑克牌坐标[拖拽之前]
        const pokePoint: PokePoint = PokeRuleUtil.Instance.getPokeImmediatelyPoint(poke);
        console.log(pokePoint);
        // 获取所在列扑克牌信息
        const pokeQueue: Poke[] = this.pokeQueue[pokePoint.col];
        // 判断：扑克牌下标和数组长度，判断是否是最后一张
        const isLast: boolean = pokeQueue.length > (pokePoint.row + 1) ? false : true;
    }

    /**
     * 根据坐标获取对应的坐标点信息
     * @param col 所在列第几个位置(从0开始)
     * @param row 所在行第几个位置(从0开始)
     */
    public getPointByIndex(col: number, row: number): Point {
        const layout: Point[] = SceneManagerUtil.Instance.config.layout.temporary.in;
        const marge: number = SceneManagerUtil.Instance.config.MARGIN_TOP;
        return {
            x: layout[col].x,
            y: row * marge + layout[col].y
        }
    }
}