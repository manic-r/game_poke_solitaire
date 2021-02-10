/**
 * 固定盒子
 */
class FixedBox extends SceneBase {

    config: WidgetConfig;

    /**
     * 放置在当前box上的扑克牌队列。
     * 如果是·MODE·类型放置多个，如果是·BOX·类型则只可放置一个
     */
    private child: string;

    constructor(config: WidgetConfig = {}) {
        super();
        this.config = config;
        if (config.off && config.off.fixed) {
            this.name = config.off.fixed.name;
        }
        this.root.addChild(this);
        // TODO 测试使用，console当前对象
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => console.log(this), this);
    }

    protected onComplete() {
        // 初始化构造配置
        for (let key in this.config) {
            if (key !== 'off') {
                this[key] = this.config[key];
            }
        }
    }

    /**
     * 添加一个扑克牌节点
     * @param component 扑克牌对象
     */
    public addBoxChild(name: string) {
        this.child = name;
        if (this.config.off.fixed.is
            && this.config.off.fixed.type === 'MODE') {
            const image: eui.Image = new eui.Image();
            image.source = `resource/assets/Poke/${name}.jpg`;
            image.width = this.width;
            image.height = this.height;
            this.addChild(image);
        }
    }

    /**
     * 移除全部扑克牌节点
     * @param component 扑克牌对象
     */
    public removeBoxChild() {
        this.child = undefined;
    }

    /**
     * 获取下一张扑克牌信息
     */
    public get next(): string {
        if (this.config.off.fixed.is
            && this.config.off.fixed.type === 'MODE') {
            // 如果当前存入为空，则随机一个花色A
            if (!this.child) {
                return '_1';
            }
            const [start, type, num] = this.child.split('_');
            if (Number(num) >= 13) return;
            return `${start}_${type}_${Number(num) + 1}`;
        }
    }

    /**
     * 判断是否是可吸附
     * @returns true: 可吸附，false: 不可吸附
     */
    public canAdsorb(): boolean {
        /**
         * 1. `child`如果为空，则表示已经有复合的扑克牌，直接返回不可吸附
         * 2. 如果盒子类型为`CenterFixedBox`则获取对应的`pokeQueue`数据，判断对应的扑克牌队列是否为空
         * 3. 如果盒子类型为`TopFixedBox`则判断拖拽列表是否是1个，如果是1个则可吸附
         */
        if (this.child) return false;
        if (this.config.off.fixed.storey === 'CenterFixedBox') {
            const { col } = PokeRuleUtil.Instance.getPokeImmediatelyPoint(this.name);
            const queue: string[] = PokeRuleUtil.Instance.pokeQueue[col];
            return queue.length === 0;
        } else if (this.config.off.fixed.storey === 'TopFixedBox') {
            // 获取拖拽扑克牌名称
            const names: string[] = DropBaseUtil.getDropPokeName();
            if (names.length != 1) return false;
        }
        return true;
    }
}