class Config implements ConfigInterface {
    POKE_HEIGHT: number = 86;
    POKE_WIDTH: number = 60;
    POKE_TYPE: string[] = ['a', 'b', 'c', 'd'];
    POKE_PATH_PREFIX: string = `resource/assets/Poke/pk_`;
    POKE_PATH_SUFFIX: string = `.jpg`;
    MAX_TYPE_NUM: number = 13;
    MARGIN_TOP: number = 30;
    COL_NUM: number = 8;
    space: number = 0;
    layout: Layout;

    constructor() {
        // 计算空隙大小（必要）
        const stage: egret.Stage = SceneManagerUtil.Instance.rootLayer.stage;
        this.space = (stage.stageWidth - this.POKE_TYPE.length * 2 * this.POKE_WIDTH) / (this.POKE_TYPE.length * 2 + 1);
        // 初始化布局对象 ===
        this.layout = {
            gears: this.createGearsPoint(),
            temporary: {
                out: this.createOutTemporaryPoint(),
                in: this.createInTemporaryPoint()
            }
        }
        // 初始化布局对象 ===
    }

    private createGearsPoint(): Point[] {
        // 定义起始位置
        const startIndex: number = this.POKE_TYPE.length;
        // 根据扑克牌种类获取扑收纳盒个数
        return this.POKE_TYPE.map((_, i) => {
            return {
                x: this.space + (i + startIndex) * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP
            };
        });
    }

    private createOutTemporaryPoint(): Point[] {
        // 根据扑克牌种类获取扑收纳盒个数
        return this.POKE_TYPE.map((_, i) => {
            return {
                x: this.space + i * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP
            };
        });
    }

    private createInTemporaryPoint(): Point[] {
        // 根据扑克牌种类获取扑收纳盒个数
        const length: number = this.POKE_TYPE.length * 2;
        const result: Point[] = [];
        for (let i = 0; i < length; i++) {
            result.push({
                x: this.space + i * (this.space + this.POKE_WIDTH),
                y: this.MARGIN_TOP * 2 + this.POKE_HEIGHT,
            })
        }
        return result;
    }
}