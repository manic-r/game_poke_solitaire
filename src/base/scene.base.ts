abstract class SceneBase extends eui.Component {

    public readonly stage: egret.Stage
    public readonly root: eui.UILayer;
    public readonly gameScene: GameMainScene;

    constructor() {
        super();
        this.root = SceneManagerUtil.Instance.rootLayer;
        this.stage = SceneManagerUtil.Instance.rootLayer.stage;
        // 监听组件创建完毕 也就是场景的外观创建完毕
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this);
    }

    protected abstract onComplete();
}