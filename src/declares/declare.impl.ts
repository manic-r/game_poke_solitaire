//////////////////////////////////////////////////////////////////////////////////////////////
// 判断对象是否是Array
Object.isArray = (value: any): boolean => {
    return Object.prototype.toString.call(value) === '[object Array]';
}
Object.isLegal = (value: any): boolean => {
    return value != null && value != undefined;
}
//////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.startsWith = function (target: string): boolean {
    return this.indexOf(target) === 0;
}
String.prototype.endsWith = function (target: string): boolean {
    return this.substring(this.lastIndexOf(target)) === target;
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
// 移除指定下标以及其后续所有元素
Array.prototype.remove = function <T>(index: number): T[] {
    return this.splice(index, this.length);
}
// 倒叙遍历数组
Array.prototype.forAnti = function <T>(callbackfn: (value: T, lastValue: T, array: T[]) => any): void {
    for (let i = this.length - 1; i >= 0; i--) {
        if (i - 1 < 0) return;
        const nowValue: T = this[i];
        const lastValue: T = this[i - 1];
        const callback: any = callbackfn(nowValue, lastValue, this);
        if (Object.prototype.toString.call(callback) === '[object Boolean]'
            && !callback
        ) {
            return;
        }
    }
}
// 倒叙遍历数组
Array.prototype.forOrder = function <T>(callbackfn: (value: T, nextValue: T, array: T[]) => any): void {
    for (let i = 0; i < this.length - 1; i++) {
        const nowValue: T = this[i];
        const nextValue: T = this[i + 1];
        const callback: any = callbackfn(nowValue, nextValue, this);
        if (Object.prototype.toString.call(callback) === '[object Boolean]'
            && !callback
        ) {
            return;
        }
    }
}
// 根据指定的数值分组遍历数据
Array.prototype.forMoreEach = function <T>(callbackfn: (...array: T[]) => any, groupNum: number = 2): void {
    // 获取遍历次数
    const forIndex: number = Math.ceil(this.length / groupNum);
    for (let i = 0; i < forIndex; i++) {
        const array: T[] = [];
        for (let j = 0; j < groupNum; j++) {
            array.push(this.shift());
        }
        callbackfn(...array);
    }
}
// 判断两个数组元素是否一致
Array.prototype.isEquals = function <T>(array: T[]): boolean {
    if (!array) return false;
    if (this.length !== array.length) return false;
    return this.every((value: T) => array.deepContains(value));
}
// 自定义逻辑判断是否满足
Array.prototype.filterOwner = function <T>(predicate: (value: T) => boolean): boolean {
    const array: T[] = this.filter(predicate);
    if (array.length === 0) {
        return false;
    }
    return true;
}
//////////////////////////////////////////////////////////////////////////////////////////////