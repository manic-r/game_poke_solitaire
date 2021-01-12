/**
 * 拖拽控件基类
 */
abstract class DropBase extends SceneBase {

    // 分组Code，标识什么控件分为什么组，在同一个组内，拖拽是唯一的，同一个组内不会影响
    private _GROUP_CODE: string;
    // 是否启动拖拽
    // private _DROP_OPEN: boolean = false;

    // 注入全局的唯一Key
    static readonly TOUCH_SELECTED: string = '_TOUCH_SELECTED';

    // 横向移动位置
    private XTouch: number;
    // 纵向移动位置
    private YTouch: number;
    // 拖拽前所在位置: x
    private _BEFORE_DROP_X: number;
    // 拖拽前所在位置: y
    private _BEFORE_DROP_Y: number;

    // 拖拽遮罩组件名称
    public static MASK_OF_POKE: string = 'MASK_OF_POKE';
    // 注册拖拽
    private _REGISTER: boolean;

    /**
     * 构造函数
     * @param group_code 分组Code，标识什么控件分为什么组，在同一个组内，拖拽是唯一的，同一个组内不会影响
     * @param register 是否注册拖拽 true: 注册, false: 不注册（默认注册）
     */
    constructor(group_code: string, register: boolean = true) {
        super();
        this._GROUP_CODE = group_code;
        this._REGISTER = register;
    }

    protected onComplete() {
        this.onInit(this);
        // 构造拖拽相关属性
        if (this._REGISTER) this.bindDrag();
    }

    /**
     * 构造拖拽
     */
    private bindDrag() {
        // 手指开始点击时
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        // 手指在屏幕移动时
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        // 手指离开时
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchBegin({ stageX, stageY }: egret.TouchEvent) {
        if (!this.beforeTouchBeginHandle()) return;
        this.XTouch = stageX;
        this.YTouch = stageY;
        this._BEFORE_DROP_X = this.Child.x;
        this._BEFORE_DROP_Y = this.Child.y;
        // 记录当前拖拽的唯一值
        DropBaseUtil.recordDropPoke(this._GROUP_CODE, this.Config.off.poke.name);
        // 放置遮罩
        DropBaseUtil.createMask(this, { name: DropBase.MASK_OF_POKE });
        // 拖拽时居上
        this.root.setChildIndex(this.root.getChildByName(this.name), 100);
    }

    /**
     * 设备点击事件执行前的处理
     * @returns true: 继续执行 false: 直接停止
     */
    protected abstract beforeTouchBeginHandle(): boolean;

    private onTouchMove({ stageX, stageY }: egret.TouchEvent) {
        if (!this.beforeTouchMoveHandle()) return;
        // 开启移动锁定
        DropBaseUtil.clock();
        // 根据定位点，移动的x像素大小
        const moveX: number = stageX - this.XTouch;
        // 根据定位点，移动的y像素大小
        const moveY: number = stageY - this.YTouch;
        this.XTouch = stageX;
        this.YTouch = stageY;
        // 移动当前画像
        this.x = this.x + moveX;
        this.y = this.y + moveY;
    }

    /**
     * 设备开始移动时方法执行前的处理
     * @returns true: 继续执行 false: 直接停止
     */
    protected abstract beforeTouchMoveHandle(): boolean;

    private onTouchEnd() {
        DropBaseUtil.onTouchEndHandle(this.beforeTouchEndHandle());
    }

    /**
    * 设备抬手时执行处理
    * @returns 是否可重定位移动 {true: 是, false: 不可移动}
    */
    protected abstract beforeTouchEndHandle(): boolean;

    /**
     * 拖拽时验证
     * @return 如果是当前控件，则返回true
     */
    public dropMoveValid() {
        const touchSelected: TouchSelected = this.stage[DropBase.TOUCH_SELECTED] as TouchSelected || { groupId: undefined, componentName: undefined };
        return this._GROUP_CODE == touchSelected.groupId
            && this.Config.off.poke.name == touchSelected.componentName;
    }

    /**
     *获取子组件控件
     */
    private get Child(): Poke {
        const poke: any = this;
        return poke as Poke;
    }

    /**
     * 获取子组件的配置文件
     */
    private get Config(): WidgetConfig {
        return this.Child['config'] as WidgetConfig || {};
    }

    /**
     * 画面加载完毕函数（可理解为初始化函数）
     */
    protected abstract onInit(parent: DropBase);
}