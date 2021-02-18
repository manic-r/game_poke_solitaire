class SceneUtil {

    /**
     * 通过名称获取组件对象
     * @param name: 组件名
     */
    public static getComponentByName<T>(name: string): T {
        return (SceneManagerUtil.Instance.rootLayer.getChildByName(name) as any) as T;
    }

    /**
     * 通过名称获取组件对象
     * @param names: 组件名集合
     */
    public static getComponentByNames<T>(names: string[]): T[] {
        return names.map(name => this.getComponentByName(name));
    }

    /**
     * 根据控件名称移除元素
     * @param name 控件名称
     */
    public static removeComponentByName(name: string) {
        SceneManagerUtil.Instance.rootLayer.removeChild(this.getComponentByName(name));
    }

    /**
     * 获取扑克牌即时坐标
     * @param value 控件名称|控件
     */
    public static getPokeImmediatelyPoint<T extends string | Box>(value: T): PokePoint {
        const component: Box =
            typeof value === 'string' ? SceneUtil.getComponentByName(value) : (value as Box);
        let [col, row] = PokeRuleUtil.Instance[component.config.off.fixed.storey].location(component.name);
        // 如果获取的结果为空，则表示未在对应的队列中，此时在Top中查找
        if (!Object.isLegal(col) && !Object.isLegal(row)) {
            [col, row] = PokeRuleUtil.Instance.TopFixedBox.location(
                SceneUtil.getComponentByNames<FixedBox>(PokeRuleUtil.Instance.TopFixedBox)
                    .filter(box => box.hasName(component.name))
                    .map(box => box.name)[0]
            );
        }
        return {
            col: Object.isLegal(col) ? col : -1,
            row: Object.isLegal(row) ? row : -1
        };
    }

    /**
     * 获取选中扑克牌队列
     * @param name 扑克牌名称|扑克牌对象
     */
    public static getSelectPokeQueue<T extends string | Box>(value: T): string[] {
        if (!value) return [];
        const component: Box =
            typeof value === 'string' ? SceneUtil.getComponentByName(value) : (value as Box);
        const point: PokePoint = this.getPokeImmediatelyPoint(component);
        // 在`pokeQueue`中获取对应指定列的数据，如果为空，则返回空集合
        const rowQueue: string[] = PokeRuleUtil.Instance.pokeQueue[point.col] || [];
        // 截取指定下标到最后的数组集合，如果为空，则视为之选中了指定的当前对象
        return point.row > -1 ? rowQueue.slice(point.row) : [component.name];
    }
}