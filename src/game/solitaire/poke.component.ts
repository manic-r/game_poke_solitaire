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
        image.width = this.width;
        image.height = this.height;
        this.addChild(image);
    }

    protected beforeTouchBeginHandle(name: string): boolean {
        // TODO:
        // if (DropBaseUtil.isClock()) return false;
        ConsoleUtil.clips('开始点击的事件', 'DropBaseUtil.isClock()', DropBaseUtil.isClock());
        return !DropBaseUtil.isClock()// && PokeRuleUtil.Instance.validSelectPokeCanDrop(name);
    }

    protected beforeTouchMoveHandle(name: string): boolean {
        ConsoleUtil.clips('beforeTouchMoveHandle', 'this.dropMoveValid()', this.dropMoveValid())
        return this.dropMoveValid()/*  && PokeRuleUtil.Instance.validSelectPokeCanDrop(name) */;
    }

    protected beforeTouchEndHandle(): boolean {
        /**
         * 拦截:
         * 1. 松手时是否时当前控件(前置已验证是当前控件，后续可直接使用`this.Child`)
         * 2. 控件是否是开启可拖拽
         */
        if (!DropBaseUtil.isDropNow(this)/* || !this.config.off.openDrop */) {
            return false;
        }
        // 获取碰撞点
        const hitPokes: Box = DropBaseUtil.getCollisionCheck(this);
        console.log('碰撞点！！！！！！！', hitPokes)
        // 如果未碰撞或者碰撞逻辑不满足时（交叉减小）返回
        if (!hitPokes /* || !PokeRuleUtil.Instance.checkPokeSiteColor(this, hitPokes) */) {
            return false;
        }
        // 扑克牌碰撞逻辑 =================================================
        // 历史列处理
        // 获取扑克牌坐标[拖拽之前]
        const historyPokePoint: PokePoint = PokeRuleUtil.Instance.getPokeImmediatelyPoint(this.name);
        // 历史操作列
        const historyQueue: string[] = PokeRuleUtil.Instance.pokeQueue[historyPokePoint.col];
        // 移除原本数据，返回移除的集合
        const moveQueue: string[] = historyQueue.remove(historyPokePoint.row);
        /**
         * 当historyQueue.last()为false时表示当前扑克牌为本列最后一张扑克牌，会全部移动
         * 此时设置fixed盒子属性
         */
        if (!historyQueue.last()) {
            // 获取对应的fixed盒子信息
            const name: string = PokeRuleUtil.Instance.CenterFixedBox.get(historyPokePoint.col);
            SceneUtil.getComponentByName<FixedBox>(name).removeBoxChild();
        }
        // 目标列处理
        // 如果是头部的收集盒子
        if (hitPokes.config.off.fixed.storey === 'TopFixedBox') {
            const topBox: FixedBox = SceneUtil.getComponentByName(hitPokes.name);
            topBox.addBoxChild(this.name);
            // 计算位置
            const { x, y }: Point = PokeRuleUtil.Instance.reckonPointByNameOrComponent(hitPokes);
            // 移动扑克牌
            DropBaseUtil.moveTween(SceneUtil.getComponentByName(this.name), { x, y });
        } else {
            // 修改增加元素的数组信息
            const orderPoint: PokePoint = PokeRuleUtil.Instance.getPokeImmediatelyPoint(hitPokes.name);
            // 如果放置的是在fixed上，设置fixed属性
            if (PokeRuleUtil.Instance.pokeQueue[orderPoint.col].length === 0) {
                // 获取对应的fixed盒子信息
                const name: string = PokeRuleUtil.Instance.CenterFixedBox.get(orderPoint.col);
                SceneUtil.getComponentByName<FixedBox>(name).removeBoxChild();
            }
            PokeRuleUtil.Instance.pokeQueue[orderPoint.col].push(...moveQueue);
            // 移动扑克牌计算动画 =========
            moveQueue.forEach(pokeName => {
                // 计算位置
                const { x, y } = PokeRuleUtil.Instance.reckonPointByNameOrComponent(pokeName);
                // 移动扑克牌
                DropBaseUtil.moveTween(SceneUtil.getComponentByName(pokeName), { x, y });
            })
        }
        return true;
    }
}