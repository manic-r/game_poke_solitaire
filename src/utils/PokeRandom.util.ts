class PokeRandomUtil {

    // url常量地址
    static readonly POKE_PATH_PREFIX: string = `resource/assets/Poke/pk_`;
    static readonly POKE_PATH_SUFFIX: string = `.jpg`;
    // 扑克类型
    static readonly PokeType: string[] = ['a', 'b', 'c', 'd'];

    // 每类牌数最大数
    static readonly MAX_TYPE_NUM: number = 13;
    // 每张牌上下间距
    static readonly MARGIN_TOP: number = 30;

    /**
     * 获取扑克🎴布局
     * 布局结构 [ [Poke, Poke, ...], [Poke, Poke, ...], [Poke, Poke, ...], ... ]
     */
    public static creator(input: FixedBox[]): Poke[][] {
        // 声明扑克牌生成池对象
        // TODO
        // const creator: PokeRandomCreator = new PokeRandomCreator();
        const creator: PokeRandomCreator = new PokeRandomCreator().order();
        const length: number = input.length;
        // 返回的数据体
        const result: Poke[][] = [];
        for (let i = 0;
            i < PokeRandomUtil.MAX_TYPE_NUM * PokeRandomUtil.PokeType.length;
            i++) {
            // i % length 结果是下标，可以直接获取`input`的值
            const index: number = i % length;
            // 获取每一列的列表
            result[index] = result[index] || [];
            // [注：得到的是每一个分组后对应组的数据个数下标， 同：result[index].length]
            // 也可以直接使用 row = result[index].length;
            const row: number = Math.floor(i / length);
            // 获取随机扑克牌对象
            // TODO
            // const pokeInfoCreator: PokeInfoCreator = creator.poke;
            const pokeInfoCreator: PokeInfoCreator = creator.orderPoke;
            const poke = new Poke({
                x: input[index].x,
                y: input[index].y + row * this.MARGIN_TOP,
                skinName: 'resource/eui_skins/games/PokeComponentSkin.exml',
                off: {
                    // 默认打开扑克牌的拖拽功能
                    openDrop: true,
                    // 默认开启可吸附
                    openAdsorb: true,
                    imageConfig: { source: `resource/assets/Poke/${pokeInfoCreator.name}.jpg` },
                    poke: {
                        type: pokeInfoCreator.type,
                        figure: pokeInfoCreator.figure,
                        name: pokeInfoCreator.name
                    },
                    point: { col: index, row },
                    fixed: { is: false, type: null, storey: 'pokeQueue', name: null }
                }
            });
            // 在每一次像已存在数组中添加新的`poke`对象时，将上一个`poke`的拖拽设置为关闭，同时吸附设置为关闭
            // 生成数据结构为每一组集合中的最后一个为可拖拽和可吸附模式
            // 后续在每次拖走一个时，将当前变更集合中最后一个设置为启动
            if (result[index].length > 0) {
                // 获取序列中最后一个对象
                const pk: Poke = result[index][result[index].length - 1];
                // 可吸附关闭
                pk.config.off.openAdsorb = false;
                /**
                 * 可拖拽, 需要根据需求设置
                 * 1. 判断是否与上一个扑克满足【游戏规则】，如果满足设置上一个为可拖拽
                 * 2. 如果不满足【游戏规则】，则判断当前列，将（除当前以外）所有的扑克牌全部设置为不可拖拽
                 */
                console.log('PokeRuleUtil.Instance.checkPokeSiteColor(poke, pk)', PokeRuleUtil.Instance.checkPokeSiteColor(poke, pk))
                if (PokeRuleUtil.Instance.checkPokeSiteColor(poke, pk)) {
                    pk.config.off.openDrop = true;
                } else {
                    // 获取当前扑克牌所在的列对象，并设置不可拖拽
                    result[index].forEach(row => row.config.off.openDrop = false);
                }
            }
            result[index].push(poke);
        }
        return result;
    }

    /**
     * 创建顶部固定盒子
     */
    public static createTopFixedBox(): FixedBox[] {
        const result: FixedBox[] = [];
        for (let i = 0; i < 4; i++) {
            // 前四个与后面的不同
            const config: WidgetConfig = {
                x: PokeRuleUtil.Instance.space + i * (PokeRuleUtil.Instance.space + PokeRuleUtil.POKE_WIDTH), y: PokeRuleUtil.MARGIN_TOP,
                off: { openDrop: false, fixed: { is: true, type: 'BOX', storey: 'TopFixedBox', name: `top_fixed_box_${i + 1}` } }
            };
            config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
            config.off.openAdsorb = true;
            config.off.point = { col: i, row: 0 };
            const box: FixedBox = new FixedBox(config);
            // 记录
            result.push(box);
        }
        return result;
    }

    /**
     * 创建收纳盒
     */
    public static createGearsBox(): Poke[] {
        const result: Poke[] = [];
        const index: number = 4;
        for (let i = 0; i < 4; i++) {
            // 前四个与后面的不同
            const config: WidgetConfig = {
                x: PokeRuleUtil.Instance.space + (i + index) * (PokeRuleUtil.Instance.space + PokeRuleUtil.POKE_WIDTH), y: PokeRuleUtil.MARGIN_TOP,
                off: { openDrop: false, fixed: { is: true, type: 'MODE', storey: 'GearsBox', name: null } }
            };
            config.off.point = { col: i, row: 0 };
            config.skinName = 'resource/eui_skins/games/PokeComponentSkin.exml';
            const poke: Poke = new Poke(config);
            // 记录
            result.push(poke);
        }
        return result;
    }

    /**
     * 创建中心固定格子
     */
    public static createCenterFixedBox(): FixedBox[] {
        const result: FixedBox[] = [];
        for (let i = 0; i < PokeRuleUtil.COL_NUM; i++) {
            // 前四个与后面的不同
            const config: WidgetConfig = {
                x: PokeRuleUtil.Instance.space + i * (PokeRuleUtil.Instance.space + PokeRuleUtil.POKE_WIDTH),
                y: PokeRuleUtil.MARGIN_TOP * 2 + PokeRuleUtil.POKE_HEIGHT,
                off: {
                    openDrop: false, openAdsorb: false, point: { col: i, row: 0 },
                    fixed: { is: true, type: 'BOX', storey: 'CenterFixedBox', name: `center_fixed_box_${i + 1}` }
                }
            };
            config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
            const box: FixedBox = new FixedBox(config);
            // 记录
            result.push(box);
        }
        return result;
    }

    /**
     * 计算四个点坐标
     */
    public static computeCapePoint(input: Poke | FixedBox): PokePosition {
        const { x, y }: Poke | FixedBox = input;
        return {
            // poke,
            component: input,
            topLeft: new egret.Point(x, y),
            topRight: new egret.Point(x + PokeRuleUtil.POKE_WIDTH, y),
            bottomLeft: new egret.Point(x, y + PokeRuleUtil.POKE_HEIGHT),
            bottomRight: new egret.Point(x + PokeRuleUtil.POKE_WIDTH, y + PokeRuleUtil.POKE_HEIGHT)
        };
    }

    /**
     * 根据参照的扑克牌对象，计算放在其下面的扑克牌对象位置
     * @param box 参照的扑克牌对象
     */
    public static computeNextPokePoint(box: Box): egret.Point {
        // 判断是否是固定位置的对象，如果是，不做偏移
        const marginTop: number = box.config.off.fixed.is ? 0 : this.MARGIN_TOP;
        return new egret.Point(
            box.x, box.y + marginTop
        )
    }
}

// 随机数： https://blog.csdn.net/xutongbao/article/details/89098939
const getRandomIntInclusive = (min: number, max: number, ignore: number[] = []): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    // 含最大值，含最小值
    let resultNum: number = Math.floor(Math.random() * (max - min + 1)) + min;
    if (ignore && ignore.length > 0 && ignore.indexOf(resultNum) > -1) {
        return getRandomIntInclusive(min, max, ignore);
    }
    return resultNum;
}

/**
 * 随机数： https://blog.csdn.net/xutongbao/article/details/89098939
 * @param min 最小值范围
 * @param max 最大值范围
 * @param handle 处理函数（返回true视为通过，不进行retry）
 */
const getRandomIntInclusiveWithFun = (min: number, max: number, handle: Function): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    // 含最大值，含最小值
    let resultNum: number = Math.floor(Math.random() * (max - min + 1)) + min;
    if (handle && !handle(resultNum)) {
        return getRandomIntInclusiveWithFun(min, max, handle);
    }
    return resultNum;
}