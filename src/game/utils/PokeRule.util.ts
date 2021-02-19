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
    public pokeQueue: string[][] = [];
    // 聚合队列
    public GearsBox: string[] = [];
    // 顶部固定队列
    public TopFixedBox: string[] = [];
    // 中间固定队列
    public CenterFixedBox: string[] = [];

    // 由于顶部和中心部分固定，此处存储顶部和中心部分的碰撞点列
    private static _top_center_hit_point: PokePositions;

    // ===============================================================================
    /**
         * 根据坐标获取对应的坐标点信息
         * @param col 所在列第几个位置(从0开始)
         * @param row 所在行第几个位置(从0开始)
         */
    public getPointByIndex(col: number, row: number): Point {
        const layout: Point[] = SceneManagerUtil.Instance.config.layout.CenterFixedBox;
        const marge: number = SceneManagerUtil.Instance.config.MARGIN_TOP;
        return {
            x: layout[col].x,
            y: row * marge + layout[col].y
        }
    }
    /**
     * 处理扑克牌合并
     */
    public handleMarge() {
        // 判断游戏是否结束，结束则跳转结束画面
        if (PokeRuleUtil.Instance.gameEnding()) {
            setTimeout(() => {
                alert('通关成功！')
            }, SceneManagerUtil.Instance.config.moveTime)
            return;
        }
        SceneUtil.getComponentByNames<FixedBox>(this.GearsBox)
            .filter(component => component.next)
            .forEach(component => {
                const next: string = component.next;
                // 获取扑克牌列表和TopQueue内容列表
                const queue: string[][] = this.margeTopWidthPoke();
                for (let pokeQueue of queue) {
                    const lastPoke: string = pokeQueue.last();
                    if (lastPoke && (lastPoke === next
                        || lastPoke.endsWith(next))) {
                        // 移除扑克队列对象
                        pokeQueue.pop();
                        // 将当前扑克牌移动至对应位置
                        egret.Tween.get(SceneUtil.getComponentByName<Poke>(lastPoke))
                            .to({ x: component.x, y: component.y }, SceneManagerUtil.Instance.config.moveTime, egret.Ease.sineIn)
                            .call(() => {
                                SceneUtil.removeComponentByName(lastPoke);
                                // 记录当前队列扑克
                                component.addBoxChild(lastPoke);
                                this.handleMarge();
                            })
                        break;
                    }
                }
            })
    }

    /**
     * 合并top和poke队列
     */
    public margeTopWidthPoke(): string[][] {
        // 获取扑克牌列表和TopQueue内容列表
        const queue: string[][] = [...this.pokeQueue];
        this.TopFixedBox.map(name => SceneUtil.getComponentByName<FixedBox>(name).body)
            .filter(name => name)
            .forEach(name => queue.push([name]));
        return queue;
    }

    /**
     * 计算控件坐落位置（通过控件名称）
     * @param value 控件名称|控件
     */
    public reckonPointByNameOrComponent<T extends string | Box>(value: T): Point {
        const component: Box =
            typeof value === 'string' ? SceneUtil.getComponentByName(value) : (value as Box);
        let storey: FixedStorey;
        let name: string;
        if (this.isInTopQueue(value)) {
            storey = 'TopFixedBox';
            name = SceneUtil.getComponentByNames<FixedBox>(this.TopFixedBox)
                .filter(box => box.hasName(component.name))
                .map(box => box.name)[0];
        } else {
            storey = component.config.off.fixed.storey;
            name = component.name;
        }
        const queue: string[] | string[][] = this[storey];
        const [col, row]: number[] = queue.location(name);
        const layout: Point[] = SceneManagerUtil.Instance.config.layout[storey === 'pokeQueue' ? 'CenterFixedBox' : storey];
        if (!Object.isLegal(col) && !Object.isLegal(row)) {
            throw Error(`计算控件坐落位置, 获取位置不合法：${storey} => ${component.name} => ${col}-${row}`)
        }
        return {
            x: layout[col].x,
            y: (row || 0) * SceneManagerUtil.Instance.config.MARGIN_TOP + layout[col].y
        }
    }

    /**
     * 判断扑克牌是否是在TopQueue队列中
     * @param value 控件名称|控件
     * @returns {true: 在TopQueue中, false: 不在TopQueue中}
     */
    public isInTopQueue<T extends string | Box>(value: T): boolean {
        const component: Box =
            typeof value === 'string' ? SceneUtil.getComponentByName(value) : (value as Box);
        // 判断是否是在`pokeQueue`中
        const is: boolean = this.pokeQueue.deepContains(component.name);
        // 如果存在, 则返回`false`
        if (is) return false;
        // 判断是否是在`TopFixedBox`中
        // 规则：检查`TopFixedBox`控件是否是存在名称控件
        const fixedBox: FixedBox[] = SceneUtil.getComponentByNames(this.TopFixedBox);
        const exist: boolean = fixedBox.filterOwner(box => box.hasName(component.name));
        if (exist) return true;
        throw Error(`\`TopQueue\`队列中获取扑克牌属性异常！`)
    }

    /**
     * 根据坐标在[pokeQueue]获取扑克牌队列
     * @param index 坐标
     */
    public getPokeQueueByIndex(index: number): string[] {
        return this.pokeQueue[index] || [];
    }

    /**
     * 验证游戏是否结束
     */
    public gameEnding(): boolean {
        return this.GearsBox.filter(name => {
            const box: FixedBox = SceneUtil.getComponentByName(name);
            return box.ending();
        }).length === 4;
    }
    // ===============================================================================

    /**
     * 获取固定框触碰点集合
     * @param bool 强制刷新
     */
    private fixedHitPointMapping(bool?: boolean): PokePositions {
        if (bool || (!PokeRuleUtil._top_center_hit_point
            || PokeRuleUtil._top_center_hit_point.length === 0)) {
            PokeRuleUtil._top_center_hit_point = [];
            // 合并顶部队列、中间部分队列
            const names: string[] = [...(this.TopFixedBox || []), ...(this.CenterFixedBox || [])];
            SceneUtil.getComponentByNames<FixedBox>(names)
                .filter(fixed => fixed.canAdsorb())
                .forEach(fixed =>
                    // 获取四个点坐标
                    PokeRuleUtil._top_center_hit_point.push(PokeInitUtil.computeCapePoint(fixed))
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
        ).map(rowArray =>
            PokeInitUtil.computeCapePoint(SceneUtil.getComponentByName(rowArray.last()))
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
    public checkPokeSiteColor(localPoke: Poke, hitPoke: Box): boolean {
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
        const roleMap: { [num: string]: POKE_COLOR } = SceneManagerUtil.Instance.config.roleMap;
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
     * 判断选中扑克牌列是否满足可拖拽效果
     * @param name 选中扑克牌名称
     * @return true:可拖拽, false: 不可拖拽
     */
    public validSelectPokeCanDrop(name: string): boolean {
        const roleMap: { [num: string]: POKE_COLOR } = SceneManagerUtil.Instance.config.roleMap;
        // 获取扑克牌队列
        const index: number[] = this.pokeQueue.location(name);
        // 判断对象是否是在pokeQueue队列中
        if (!Object.isLegal(index) || index.length === 0) {
            // 如果不在队列中，扑克牌在TopFixed中，必视为可拖拽
            return true;
        }
        // 获取其下队列
        const queue: string[] = SceneUtil.getSelectPokeQueue(name);
        // 获取扑克牌队列
        const pokes: Poke[] = SceneUtil.getComponentByNames(queue);
        for (let i = 0; i < pokes.length - 1; i++) {
            const value: Poke = pokes[i];
            const next: Poke = pokes[i + 1];
            /**
             * 实际判断逻辑：颜色交叉递减！
             */
            // 判断花色
            // 花色规则：对应Map 【a: '♥（红桃）', b: '♠（黑桃）', c: '♦（方块）', d: '♣（梅花）'】
            // a -> b | d; b -> a | c; c -> b | d; d -> a | c;
            // 处理花色
            const localColor: POKE_COLOR = roleMap[value.config.off.poke.type];
            const nextColor: POKE_COLOR = roleMap[next.config.off.poke.type];
            if (localColor === nextColor) return false;
            // 处理文字序号
            const localFigure: number = Number(value.config.off.poke.figure);
            const nextFigure: number = Number(next.config.off.poke.figure);
            if ((localFigure - 1) !== nextFigure) return false;
        }
        return true;
    }

    /**
     * 拖拽时验证
     * @return 如果是当前控件，则返回true
     */
    public dropMoveValid(name: string) {
        const touchSelected: TouchSelected = DropBaseUtil.getDropPoke();
        return touchSelected.componentName.deepContains(name);/* this._GROUP_CODE == touchSelected.groupId && */
    }
}