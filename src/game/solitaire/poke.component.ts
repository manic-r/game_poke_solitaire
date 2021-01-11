class Poke extends DropBase {
    // 图片原图 width: height = 7: 10
    // height: 150
    // width: 105
    config: PokeConfig;

    constructor(config: PokeConfig = {}, group_code?: string) {
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
}