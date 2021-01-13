class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        PokeRuleUtil.Instance.TopFixedBox = PokeRandomUtil.createTopFixedBox();
        PokeRuleUtil.Instance.GearsBox = PokeRandomUtil.createGearsBox();
        PokeRuleUtil.Instance.CenterFixedBox = PokeRandomUtil.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeRandomUtil.creator(PokeRuleUtil.Instance.CenterFixedBox);
    }
}