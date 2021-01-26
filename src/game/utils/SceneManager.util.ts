class SceneManagerUtil {

    private static _manager: SceneManagerUtil;

    constructor() {
    }

    public static get Instance() {
        if (SceneManagerUtil._manager == null) {
            SceneManagerUtil._manager = new SceneManagerUtil();
        }
        return SceneManagerUtil._manager;
    }

    // 起始场景
    public rootLayer: eui.UILayer;
    // 游戏场景
    public gameLayer: GameMainScene;
    // 需要显示的场景
    private currentScene: SceneBase;
    // 弹出场景层
    private pop_scene: SceneBase;
    // 系统配置
    public config: Config;
    // 切换场景
    public changeScene(s: SceneBase) {
        if (this.currentScene) {
            this.rootLayer.removeChild(this.currentScene);
            this.currentScene = null;
        }
        this.rootLayer.addChild(s);
        this.currentScene = s;
    }
    // 弹出场景层
    public pushScene(s: SceneBase) {
        this.popScene();
        if (!this.pop_scene) {
            this.rootLayer.addChild(s);
            this.pop_scene = s;
        }
    }
    // 关闭场景层
    public popScene() {
        if (this.pop_scene) {
            this.rootLayer.removeChild(this.pop_scene);
            this.pop_scene = null;
        }
    }
}