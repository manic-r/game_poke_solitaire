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

    public debugCode_GetPokeNum(input: Poke | Poke[]) {
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

    public debugCode_GetPokePoint(input: Poke, inputConsoleStr: string = '') {
        if (!input) return;
        const typeMap: {
            a: string, b: string, c: string, d: string
        } = { a: '♥', b: '♠', c: '♦', d: '♣' };
        if (inputConsoleStr && inputConsoleStr.length > 0) console.log(inputConsoleStr);
        console.log('%c======================扑克牌详情 - start ==========================', 'color:#e1ddd8; font-size:12px;');
        console.log(`扑克牌：${typeMap[input.config.off.type]} ${input.config.off.figure}, 第${input.config.off.point.col + 1}列, 第${input.config.off.point.row + 1}个`);
        console.log(`是否是固定位置[fixed]: ${input.config.off.fixed.is}, 固定盒子类型: ${input.config.off.fixed.type}`);
        console.log(`是否已开启拖拽[openDrop]：${input.config.off.openDrop}, 是否开启吸附[openAdsorb]: ${input.config.off.openAdsorb}`)
        console.log('%c======================扑克牌详情 - end  ==========================', 'color:#e1ddd8; font-size:12px;');
    }
}