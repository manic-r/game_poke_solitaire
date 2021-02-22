class StartScene extends SceneBase {

    // 判断游戏是否是存档状态, true: 已存档
    private gameIsStart: boolean;

    constructor() {
        super();
        console.log('SceneManagerUtil.Instance.config', SceneManagerUtil.Instance.config)
        this.gameIsStart = SceneManagerUtil.Instance.config.gameState;
        this.skinName = 'resource/eui_skins/games/solitaire/StartScene.exml';
    }

    protected onComplete() {
        this.initScene();
    }

    private initScene() {
        // const stageW = this.stage.stageWidth;
        // const stageH = this.stage.stageHeight;
        const buttonX = 530, buttonY = 440, buttonHeight = 60, buttonWidth = 300, buttonPadding = 40;

        // // 背景
        // const sky = this.createBitmapByName('index_bg_png');
        // this.addChild(sky);
        // sky.width = stageW;
        // sky.height = stageH;

        // 开始按钮
        const startBtn = new eui.Button();
        startBtn.width = buttonWidth;
        startBtn.height = buttonHeight;
        startBtn.label = this.gameIsStart ? '重新开始' : '开始游戏';
        startBtn.x = buttonX;
        startBtn.y = buttonY;
        this.addChild(startBtn);
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startButtonClick, this);

        // 继续游戏
        const continueBtn = new eui.Button();
        continueBtn.width = buttonWidth;
        continueBtn.height = buttonHeight;
        continueBtn.label = '继续游戏';
        if (!this.gameIsStart) continueBtn.currentState = 'disabled';
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
        const gameScene: GameMainScene = new GameMainScene();
        SceneManagerUtil.Instance.gameLayer = gameScene;
        SceneManagerUtil.Instance.changeScene(gameScene);
    }

    /**
     * h5退出
     */
    private exitButtonClick() {
        window.close();
    }
}