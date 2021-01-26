class SceneUtil {

    /**
     * 通过名称获取组件对象
     */
    public static getComponentByName<T>(name: string): T {
        return (SceneManagerUtil.Instance.rootLayer.getChildByName(name) as any) as T;
    }
}