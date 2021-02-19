/**
 * 从local storage中存储的对象信息
 */
interface StoreSave {
    // 扑克牌队列
    pokeQueue: string[][];
    // 收纳盒所在的最上层扑克名称
    gearsQueue: string[];
    // 顶部临时盒子
    topBoxQueue: string[];
}