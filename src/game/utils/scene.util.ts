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
}