class LocalStorageUtil {

    // 游戏结束状态，0：结束；1：未结束；null: 结束；
    public static GAME_END_STATE_KEY: string = 'GAME_END_STATE';

    /**
     * 获取游戏状态
     * @returns 已结束返回: false, 未结束返回: true
     */
    public static get gameState(): boolean {
        const state: string | boolean = egret.localStorage.getItem(this.GAME_END_STATE_KEY) || '0';
        return state === '1';
    }

    /**
     * 设置游戏状态
     * @returns 已结束返回: false, 未结束返回: true
     */
    public static get setGameState(): {
        isStart: () => Config,
        restart: () => Config
    } {
        function set(state: GameState) {
            egret.localStorage.setItem(LocalStorageUtil.GAME_END_STATE_KEY, state);
            SceneManagerUtil.Instance.config.updateGameState();
            return SceneManagerUtil.Instance.config;
        }
        return {
            isStart: () => set('1'),
            restart: () => set('0')
        }
    }
}