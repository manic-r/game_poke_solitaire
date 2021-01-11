class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        PokeRuleUtil.Instance.handlePokeAccordMove();
        // 计算空隙大小（必要）
        PokeRuleUtil.Instance.TopFixedBox = PokeRandomUtil.createTopFixedBox();
        PokeRuleUtil.Instance.GearsBox = PokeRandomUtil.createGearsBox();
        PokeRuleUtil.Instance.CenterFixedBox = PokeRandomUtil.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeRandomUtil.creator(PokeRuleUtil.Instance.CenterFixedBox);
        // 手指离开时, 为了处理鼠标移动过快，导致的图片跟不上产生的问题
        this.addEventListener(egret.TouchEvent.TOUCH_END, () => DropBaseUtil.onTouchEndHandle(false), this);

        console.log(PokeRuleUtil.Instance.debugCode_GetPokeConfig(PokeRuleUtil.Instance.TopFixedBox))
        console.log(PokeRuleUtil.Instance.debugCode_GetPokeConfig(PokeRuleUtil.Instance.GearsBox))
        console.log(PokeRuleUtil.Instance.debugCode_GetPokeConfig(PokeRuleUtil.Instance.CenterFixedBox))
        console.log(PokeRuleUtil.Instance.debugCode_GetPokeConfig(PokeRuleUtil.Instance.pokeQueue))
    }
}