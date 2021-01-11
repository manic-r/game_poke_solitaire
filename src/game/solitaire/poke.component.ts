class Poke extends DropBase {
    // 图片原图 width: height = 7: 10
    // width: 105
    // height: 150
    config: WidgetConfig;

    constructor(config: WidgetConfig = {}, group_code?: string) {
        group_code = group_code || 'POKE_ONLY';
        super(group_code);
        this.config = config;
        this.name = config.off.name;
        this.root.addChild(this);
    }

    protected onInit() {
        // 构造属性
        this.initConfig();
        // 获取扩展配置
        const otherConfig = this.config.off || { fixed: { is: null, type: null, storey: null } };
        // 创建图片
        this.createImage(otherConfig.imageConfig);
    }

    /**
     * 初始化构造配置
     */
    private initConfig() {
        for (let key in this.config) {
            if (key !== 'off') {
                this[key] = this.config[key];
            }
        }
    }

    /**
     * 创建图片
     * @param config 图像配置文件
     */
    private createImage(config: ImageConfig) {
        if (!config) return;
        const image: eui.Image = new eui.Image();
        image.source = config.source;
        // image.scale9Grid = new egret.Rectangle(10,10,80,80);
        image.width = this.width;
        image.height = this.height;
        this.addChild(image)
    }

    protected beforeTouchBeginHandle(): boolean {
        return !DropBaseUtil.isClock() && this.config.off.openDrop;
    }

    protected beforeTouchMoveHandle(): boolean {
        return this.dropMoveValid() && this.config.off.openDrop;
    }

    protected beforeTouchEndHandle(): boolean {
        /**
         * 拦截:
         * 1. 松手时是否时当前控件(前置已验证是当前控件，后续可直接使用`this.Child`)
         * 2. 控件是否是开启可拖拽
         */
        if (!DropBaseUtil.isDropNow(this) || !this.config.off.openDrop) {
            return false;
        }
        // 碰撞检测
        return true;
    }
}