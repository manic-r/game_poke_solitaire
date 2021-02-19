class PokeInitUtil {

    private static instance: PokeInitUtil;
    // A类型扑克牌名称
    private static POKE_A_ARRAY: string[] = [];
    private config: Config = SceneManagerUtil.Instance.config;
    constructor() {
        if (PokeInitUtil.instance == null) {
            // 声明扑克牌生成池对象
            PokeInitUtil.instance = this;
            // 创建A类扑克牌名称
            this.config.POKE_TYPE.forEach(type =>
                PokeInitUtil.POKE_A_ARRAY.push(PokeRandomCreator.getPokeName({ type, figure: 1 }))
            )
        }
    }

    /**
     * 创建扑克牌配置信息
     */
    public static pokeQueueCreator(): string[][] {
        const { pokeQueue } = this.instance.config.gameData;
        pokeQueue.map((queue, col) =>
            queue.map((name, row) => {
                const { x, y } = PokeRuleUtil.Instance.getPointByIndex(col, row);
                const { type, figure } = PokeRandomCreator.analysisPokeName(name);
                const config: WidgetConfig = {
                    x: 0, y: 0,
                    skinName: 'resource/eui_skins/games/PokeComponentSkin.exml',
                    off: {
                        imageConfig: { source: `resource/assets/Poke/${name}.jpg` },
                        poke: { type, figure, name },
                        fixed: { is: false, type: null, storey: 'pokeQueue', name: null }
                    }
                };
                const poke: Poke = new Poke(config);
                // 判断如果是A, 高亮标识
                if (this.POKE_A_ARRAY.deepContains(name)) {
                    DropBaseUtil.createMask(poke, { color: 0xD2A2CC, alpha: 0.4 })
                }
                DropBaseUtil.moveTween(poke, { x, y }, () => { });
            }))
        return pokeQueue;
    }

    /**
     * 创建顶部固定盒子
     */
    public static createTopFixedBox(): string[] {
        return this.instance.config.layout.TopFixedBox.map(({ x, y }, i) => {
            // 前四个与后面的不同
            const config: WidgetConfig = {
                x, y,
                off: { fixed: { is: true, type: 'BOX', storey: 'TopFixedBox', name: `top_fixed_box_${i + 1}` } }
            };
            config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
            config.off.point = { col: i, row: 0 };
            return new FixedBox(config).name;
        })
    }

    /**
     * 创建收纳盒
     */
    public static createGearsBox(): string[] {
        return this.instance.config.layout.GearsBox.map(({ x, y }, i) => {
            // 前四个与后面的不同
            const config: WidgetConfig = {
                x, y,
                off: { fixed: { is: true, type: 'MODE', storey: 'GearsBox', name: `gears_fixed_box_${i + 1}` } }
            };
            config.off.point = { col: i, row: 0 };
            config.skinName = 'resource/eui_skins/games/PokeComponentSkin.exml';
            return new FixedBox(config).name;
        })
    }

    /**
     * 创建中心固定格子
     */
    public static createCenterFixedBox(): string[] {
        return this.instance.config.layout.CenterFixedBox.map(({ x, y }, i) => {
            const config: WidgetConfig = {
                x, y,
                off: {
                    point: { col: i, row: 0 },
                    fixed: { is: true, type: 'BOX', storey: 'CenterFixedBox', name: `center_fixed_box_${i + 1}` }
                }
            };
            config.skinName = 'resource/eui_skins/games/PokeBorderSkin.exml';
            return new FixedBox(config).name;
        });
    }

    /**
     * 计算四个点坐标
     */
    public static computeCapePoint(input: Poke | FixedBox): PokePosition {
        const { x, y }: Poke | FixedBox = input;
        return {
            component: input,
            topLeft: new egret.Point(x, y),
            topRight: new egret.Point(x + this.instance.config.POKE_WIDTH, y),
            bottomLeft: new egret.Point(x, y + this.instance.config.POKE_HEIGHT),
            bottomRight: new egret.Point(x + this.instance.config.POKE_WIDTH, y + this.instance.config.POKE_HEIGHT)
        };
    }

    /**
     * 根据参照的扑克牌对象，计算放在其下面的扑克牌对象位置
     * @param box 参照的扑克牌对象
     */
    public static computeNextPokePoint(box: Box): egret.Point {
        // 判断是否是固定位置的对象，如果是，不做偏移
        const marginTop: number = box.config.off.fixed.is ? 0 : this.instance.config.MARGIN_TOP;
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