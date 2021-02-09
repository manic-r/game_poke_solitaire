interface Object {
    /**
     * 判断对象是否是数组
     * @param value 判断对象值
     */
    isArray(value: any): boolean;
    /**
     * 判断对象是否合法
     * value != null &7 value != undefined
     */
    isLegal(value: any): boolean;
}

interface String {
    /**
     * 判断字符串是否按照目标字符串开头
     * @param target 目标字符串
     */
    startsWith(target: string): boolean;

    /**
     * 判断字符串是否按照指定字符串结束
     * @param target 目标字符串
     */
    endsWith(target: string): boolean;
}


interface Array<T> {
    /**
     * 获取元素最后一个值
     */
    last<T>(): T;
    /**
     * 深度判断是否包含指定对象
     * @param target 目标字符串
     * @return true: 包含, false: 不包含
     */
    deepContains<T>(target: T): boolean;
    /**
     * 获取指定元素所在的位置下标组
     * @param value 目标元素值
     */
    location<T>(value: T): number[];
    /**
     * 获取指定下标元素
     * @param index 指定下标
     */
    get<T>(...index: number[]): T;
    /**
     * 将指定的元素放在指定集合的末尾（适用于[][]）
     */
    toLast(): void;
    /**
     * 移除指定下标以及其后续所有元素, 返回移除的数据集合
     * @param index 指定下标
     */
    remove<T>(index: number): T[];
    /**
     * 倒叙遍历数组
     * @param callbackfn 回调函数【value: 倒叙对象值, lastValue: 相邻的上一个值, array: 当前数组对象】
     */
    forAnti(callbackfn: (value: T, lastValue: T, array: T[]) => any): void;
    /**
     * 倒叙遍历数组
     * @param callbackfn 回调函数【value: 倒叙对象值, lastValue: 相邻的上一个值, array: 当前数组对象】
     * @returns boolean
     */
    forOrder(callbackfn: (value: T, nextValue: T, array: T[]) => any): void;
}