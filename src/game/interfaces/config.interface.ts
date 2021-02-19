interface ConfigInterface {
    // 扑克牌类型 [a, b, c, d]
    POKE_TYPE: string[];
    // 每类牌数最大数
    MAX_TYPE_NUM: number;
    // 每张牌上下间距
    MARGIN_TOP: number;
    // URL常量地址
    POKE_PATH_PREFIX: string;
    POKE_PATH_SUFFIX: string;
    // 纸牌设置的宽度（与exml组件同步）
    POKE_WIDTH: number;
    // 纸牌设置的高度（与exml组件同步）
    POKE_HEIGHT: number;
    // 缝隙宽度
    space: number;
    // 布局锚点
    layout: Layout;
    // 游戏数据
    gameData: StoreSave;
    // 组件移动时间(ms)
    moveTime: number;
}

interface Layout {
    // 临时盒子：扑克牌可放置的额外盒子
    // 外部
    TopFixedBox: Point[],
    // 内部（默认压在上面的）
    CenterFixedBox: Point[],
    // 收纳盒：满足条件后统一收回的位置
    GearsBox: Point[]
}

interface Point {
    // x轴坐标
    x: number,
    // y轴坐标
    y: number
}