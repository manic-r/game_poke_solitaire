class GameMainScene extends SceneBase {

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/BackGround.exml';
    }

    protected onComplete() {
        PokeRuleUtil.Instance.handlePokeAccordMove();
        // 计算空隙大小（必要）
        PokeRuleUtil.Instance.topFixedArray = PokeRandomUtil.createTopFixedBox();
        PokeRuleUtil.Instance.GearsBox = PokeRandomUtil.createGearsBox();
        PokeRuleUtil.Instance.centerFixedArray = PokeRandomUtil.createCenterFixedBox();
        PokeRuleUtil.Instance.pokeQueue = PokeRandomUtil.creator(PokeRuleUtil.Instance.centerFixedArray);
        // 手指离开时, 为了处理鼠标移动过快，导致的图片跟不上产生的问题
        this.addEventListener(egret.TouchEvent.TOUCH_END, () => DropBaseUtil.onTouchEndHandle(false), this);
    }
}