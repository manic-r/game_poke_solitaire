abstract class SceneBase extends eui.Component {

    public readonly stage: egret.Stage;
    public readonly root: eui.UILayer;
    public readonly gameScene: GameMainScene;

    /**
     * @param closeTouchEnd 关闭touchEnd默认处理
     */
    constructor(closeTouchEnd: boolean = false) {
        super();
        this.root = SceneManagerUtil.Instance.rootLayer;
        this.stage = SceneManagerUtil.Instance.rootLayer.stage;
        // 监听组件创建完毕 也就是场景的外观创建完毕
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this);
        // 手指离开时, 为了处理鼠标移动过快，导致的图片跟不上产生的问题
        if (!closeTouchEnd) {
            this.addEventListener(egret.TouchEvent.TOUCH_END, () => DropBaseUtil.onTouchEndHandle(false), this);
        }
    }

    protected abstract onComplete();
}