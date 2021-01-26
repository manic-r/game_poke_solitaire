interface Object {
    // 判断对象是否是数组
    isArray(value: any): boolean;
}


interface Array<T> {
    // 获取元素最后一个值
    last<T>(): T;
    // 深度判断是否包含指定对象
    deepContains<T>(target: T): boolean;
    // 获取指定元素所在的位置下标组
    location<T>(value: T): number[];
    // 获取指定下标元素
    get<T>(...index: number[]): T;
}