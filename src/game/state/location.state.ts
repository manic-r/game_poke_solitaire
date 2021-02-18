class LocationState {
    /*****************控制拖拽状态******************/
    // 被移动的扑克牌ID标识
    public static moveGroupId: string = null;
    // 被移动的扑克牌对象集合
    public static moveQueue: string[] = [];
    // 拖拽锁定状态
    public static clock: boolean = false;
    /*****************控制原始位置******************/

    /**
     * 重置状态
     */
    public static reset(): LocationState {
        this.moveGroupId = null;
        this.moveQueue = [];
        this.clock = false;
        console.log('执行了重置')
        return this;
    }

    public static log() {
        return {
            moveGroupId: this.moveGroupId,
            moveQueue: this.moveQueue,
            clock: this.clock
        }
    }
}