class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        // 初始状态设置
        new PokeInitUtil();
        // 开始游戏
        SceneManagerUtil.Instance.config.init();
        // 标记已开始
        LocalStorageUtil.setGameState.isStart();
        // 初始化游戏所需数据
        PokeRuleUtil.Instance.TopFixedBox = PokeInitUtil.createTopFixedBox();
        PokeRuleUtil.Instance.GearsBox = PokeInitUtil.createGearsBox();
        PokeRuleUtil.Instance.CenterFixedBox = PokeInitUtil.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeInitUtil.pokeQueueCreator();
        PokeRuleUtil.Instance.handleMarge();
        // 存储游戏数据
        PokeRuleUtil.Instance.saveToLocal();
    }
}