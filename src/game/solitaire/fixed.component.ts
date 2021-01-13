/**
 * 固定盒子
 */
class FixedBox extends SceneBase {

    config: WidgetConfig;

    /**
     * 放置在当前box上的扑克牌队列。
     * 如果是·MODE·类型放置多个，如果是·BOX·类型则只可放置一个
     */
    private child: Poke[] = [];

    constructor(config: WidgetConfig = {}) {
        super();
        this.config = config;
        if (config.off && config.off.fixed) {
            this.name = config.off.fixed.name;
        }
        this.root.addChild(this);
    }

    protected onComplete() {
        // 初始化构造配置
        for (let key in this.config) {
            if (key !== 'off') {
                this[key] = this.config[key];
            }
        }
    }

    public addBoxChild<T>(component: T) {

    }
}