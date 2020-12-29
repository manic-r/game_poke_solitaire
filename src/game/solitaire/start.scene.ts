class StartScene extends SceneBase {

    // 判断游戏是否是存档状态, true: 已存档
    private gameIsStart: boolean;

    constructor() {
        super();
        this.gameIsStart = LocalStorageUtil.gameEndState();
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
        const endBtn = new eui.Button();
        endBtn.width = buttonWidth;
        endBtn.height = buttonHeight;
        endBtn.label = '继续游戏';
        if (!this.gameIsStart) endBtn.currentState = 'disabled';
        endBtn.x = buttonX;
        endBtn.y = buttonY + buttonPadding + buttonHeight;
        this.addChild(endBtn);

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
        if (this.gameIsStart) {

        }
        startGame();
    }

    /**
     * h5退出
     */
    private exitButtonClick() {
        window.close();
    }
}