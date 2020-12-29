/**
 * 点位坐标
 */
interface PokePosition {
    poke: Poke;
    topLeft: egret.Point;
    topRight: egret.Point;
    bottomRight: egret.Point;
    bottomLeft: egret.Point;
}
type PokePositions = PokePosition[];

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
    // 顶部固定队列
    public topFixedArray: Poke[] = [];
    // 中间固定队列
    public centerFixedArray: Poke[] = [];

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
            const list: Poke[] = [...(this.topFixedArray || []), ...(this.centerFixedArray || [])];
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
        // return this.pokeQueue.filter(rowArray => rowArray.length > 0).map(rowArray =>
        //     PokeRandomUtil.computeCapePoint(rowArray[rowArray.length - 1])
        // )
        return this.pokeQueue.filter(rowArray =>
            rowArray.length > 0
            && rowArray[rowArray.length - 1].config.off.openAdsorb
        ).map(rowArray =>
            PokeRandomUtil.computeCapePoint(rowArray[rowArray.length - 1])
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
}