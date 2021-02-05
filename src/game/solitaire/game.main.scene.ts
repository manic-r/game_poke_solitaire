class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        new PokeInitUtil();
        PokeRuleUtil.Instance.TopFixedBox = PokeInitUtil.createTopFixedBox();
        PokeRuleUtil.Instance.GearsBox = PokeInitUtil.createGearsBox();
        PokeRuleUtil.Instance.CenterFixedBox = PokeInitUtil.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeInitUtil.pokeQueueCreator();
        console.log(PokeRuleUtil.Instance.pokeQueue, PokeRuleUtil.Instance.GearsBox)
        ConsoleUtil.componentByName('pk_b_4');
        ConsoleUtil.componentByName('center_fixed_box_1');
        ConsoleUtil.componentByName('gears_fixed_box_1');
        console.log('component.name'.startsWith('com'))
    }
}