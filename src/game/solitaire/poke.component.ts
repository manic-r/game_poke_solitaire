/**
 * 扑克牌类
 */
class Poke extends DropBase {
    // 图片原图 width: height = 7: 10
    // width: 105
    // height: 150
    config: WidgetConfig;

    constructor(config: WidgetConfig = {}, group_code?: string) {
        group_code = group_code || 'POKE_ONLY';
        super(group_code);
        this.config = config;
        if (config.off && config.off.poke) {
            this.name = config.off.poke.name;
        }
        this.root.addChild(this);
    }

    protected onInit() {
        // 构造属性
        this.initConfig();
        // 获取扩展配置
        const otherConfig = this.config.off || { fixed: { is: null, type: null, storey: null, name: null } };
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
        // 获取碰撞点
        const hitPokes: Box = DropBaseUtil.getCollisionCheck(this);
        // 如果未碰撞或者碰撞逻辑不满足时（交叉减小）返回
        if (!hitPokes /* || !PokeRuleUtil.Instance.checkPokeSiteColor(this, hitPokes) */) {
            return false;
        }
        return;
        // 碰撞逻辑
        // 修改坐标信息数据
        // 修改移除元素的数据信息（被拽走的所在列）
        const movePokeArray: Poke[] = PokeRuleUtil.Instance.pokeQueue[this.config.off.point.col];
        // 移除元素
        movePokeArray.pop();
        // 将当前末尾元素设置可拖拽和吸附
        // 如果是最后一个元素，获取当前列的位置，获取对应的固定图像，设置为可吸附
        if (movePokeArray.length === 0) {
            const fixed: FixedBox = PokeRuleUtil.Instance.CenterFixedBox[this.config.off.point.col];
            fixed.config.off.openAdsorb = true;
        } else {
            const tailPoke: Poke = this.root.getChildByName(movePokeArray[movePokeArray.length - 1].name) as Poke;
            tailPoke.config.off.openAdsorb = true;
            tailPoke.config.off.openDrop = true;
        }

        // 将碰撞检测覆盖的扑克牌设置不可拖拽和吸附
        const lastPoke: Poke = this.root.getChildByName(hitPokes.name) as Poke;
        lastPoke.config.off.openAdsorb = false;
        lastPoke.config.off.openDrop = false;

        // 修改增加元素的数组信息（吸附检测对应的）
        const addPokeArray: Poke[] = PokeRuleUtil.Instance.pokeQueue[hitPokes.config.off.point.col];
        // 如果`addPokeArray`为空，则表示中心吸附控件抛露，此时设置吸附控件为不可以吸附
        if (addPokeArray.length === 0) {
            const fixed: FixedBox = PokeRuleUtil.Instance.CenterFixedBox[hitPokes.config.off.point.col];
            fixed.config.off.openAdsorb = false;
        }
        // 修改元素坐标
        this.config.off.point.col = hitPokes.config.off.point.col;
        this.config.off.point.row = addPokeArray.length;
        addPokeArray.push(this);

        // 计算位置
        const point: egret.Point = PokeRandomUtil.computeNextPokePoint(hitPokes);
        // 移动扑克牌
        DropBaseUtil.moveTween(this, { x: point.x, y: point.y });
        return true;
    }
}