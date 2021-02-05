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
    }

    /**
     * 移除全部扑克牌节点
     * @param component 扑克牌对象
     */
    public removeBoxChild() {
        this.child = undefined;
    }

    /**
     * 判断是否是可吸附
     * @returns true: 可吸附，false: 不可吸附
     */
    public canAdsorb(): boolean {
        return !this.child;
    }
}