class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        new PokeInitUtil();
        // PokeRuleUtil.Instance.TopFixedBox = PokeInitUtil.createTopFixedBox();
        // PokeRuleUtil.Instance.GearsBox = PokeInitUtil.createGearsBox();
        // PokeRuleUtil.Instance.CenterFixedBox = PokeInitUtil.createCenterFixedBox();
        // PokeRuleUtil.Instance.pokeQueue = PokeInitUtil.creator(PokeRuleUtil.Instance.CenterFixedBox);
        console.log(PokeInitUtil.pokeQueueCreator())
        // console.log(PokeRuleUtil.Instance.pokeQueue)
    }
}