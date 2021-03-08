class StartScene extends SceneBase {

    // 判断游戏是否是存档状态, true: 已存档
    private gameIsStart: boolean;

    constructor() {
        super();
        this.gameIsStart = SceneManagerUtil.Instance.config.gameState;
        this.skinName = 'resource/eui_skins/games/solitaire/StartScene.exml';
    }

    protected onComplete() {
        this.initScene();
    }

    private initScene() {
        const buttonX = 530, buttonY = 440, buttonHeight = 60, buttonWidth = 300, buttonPadding = 40;
        // 开始按钮
        const startBtn: eui.Button = new eui.Button();
        startBtn.width = buttonWidth;
        startBtn.height = buttonHeight;
        startBtn.label = this.gameIsStart ? '重新开始' : '开始游戏';
        startBtn.x = buttonX;
        startBtn.y = buttonY;
        this.addChild(startBtn);
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startButtonClick, this);

        // 继续游戏|配置按钮
        const continueBtn: eui.Button = new eui.Button();
        continueBtn.width = buttonWidth;
        continueBtn.height = buttonHeight;
        continueBtn.label = this.gameIsStart ? '继续游戏' : '配置';
        // if (!this.gameIsStart) continueBtn.currentState = 'disabled';
        continueBtn.x = buttonX;
        continueBtn.y = buttonY + buttonPadding + buttonHeight;
        this.addChild(continueBtn);
        continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueButtonClick, this);

        // 退出
        const exitBtn = new eui.Button();
        exitBtn.width = buttonWidth;
        exitBtn.height = buttonHeight;
        exitBtn.label = '退   出';
        exitBtn.x = buttonX;
        exitBtn.y = buttonY + (buttonPadding + buttonHeight) * 2
        this.addChild(exitBtn)
        exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitButtonClick, this);
    }

    /**
     * 开始游戏按钮
     */
    private startButtonClick() {
        function startGame() {
            const gameScene: GameMainScene = new GameMainScene();
            SceneManagerUtil.Instance.gameLayer = gameScene;
            SceneManagerUtil.Instance.changeScene(gameScene);
        }
        // 如果是重新开始，则重置记录
        if (this.gameIsStart) {
            LocalStorageUtil.setGameState.restart();
        }
        startGame();
    }

    /**
     * 继续游戏按钮
     */
    private continueButtonClick() {
        // 判断是否是`配置`按钮，如果是配置按钮，则跳转配置场景
        let scene: GameMainScene | ConfigScene = null;
        if (this.gameIsStart) {
            // 跳转游戏场地
            scene = new GameMainScene();
            SceneManagerUtil.Instance.gameLayer = scene;
        } else {
            // 跳转配置场景
            scene = new ConfigScene();
        }
        SceneManagerUtil.Instance.changeScene(scene);
    }

    /**
     * h5退出
     */
    private exitButtonClick() {
        window.close();
    }
}