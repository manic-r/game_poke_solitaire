/**
 * 控件配置信息
 */
interface WidgetConfig {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    skinName?: string,
    // 非组件原有属性，为了不污染本身属性，使用此属性进行过滤
    off?: {
        // 是否是固定位置
        fixed: {
            // 是否是固定位置
            is: boolean,
            type: FixedType,
            // 对应的fixed框id
            storey: FixedStorey,
            // 控件名称
            name: string,
            pokeName?: string
        },
        imageConfig?: ImageConfig,
        // 扑克牌 三属性
        poke?: PokeInfoCreator,
        // 是否开启拖拽，[false: 关闭拖拽，true: 启动拖拽]
        openDrop?: boolean,
        // 是否开启吸附功能
        openAdsorb?: boolean,
        // 扑克牌生成的布局结构中，当前扑克牌所对应的下标，从零开始
        point?: {
            // 第几列（对应结构中最外层）
            col: number,
            // 第几行（对应机构中第二层）
            row: number
        }
    }
}