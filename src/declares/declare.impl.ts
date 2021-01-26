//////////////////////////////////////////////////////////////////////////////////////////////
// 判断对象是否是Array
Object.isArray = (value: any): boolean => {
    return Object.prototype.toString.call(value) === '[object Array]';
}
//////////////////////////////////////////////////////////////////////////////////////////////
// 获取元素最后一个值
Array.prototype.last = function <T>(): T {
    if (!this) return null;
    if (this.length === 0) return null;
    return this[this.length - 1];
}
// 深度判断是否包含指定对象
Array.prototype.deepContains = function <T>(target: T): boolean {
    for (let ele of this) {
        if (Object.isArray(ele)) {
            if (ele.deepContains(target)) return true;
        } else if (ele === target) {
            return true;
        }
    }
    return false;
}
// 获取指定元素所在的位置下标组
Array.prototype.location = function <T>(val: T): number[] {
    const result = [];
    for (let index = 0; index < this.length; index++) {
        const ele: any = this[index];
        if (Object.isArray(ele)) {
            // 判断当前遍历对象是否包含当前值
            if (ele.deepContains(val)) {
                result.push(index);
                result.push(...ele.location(val));
            }
        } else if (ele === val) {
            result.push(index);
            return result;
        }
    }
    return result;
}
// 获取指定下标元素
Array.prototype.get = function <T>(...point: number[]): T {
    return eval(`this[${point.join('][')}]`);
}
//////////////////////////////////////////////////////////////////////////////////////////////