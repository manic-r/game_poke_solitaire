class DropBaseUtil {

    /**
     * 创建拖拽遮罩
     */
    public static createMask(input: eui.Component, { name, color, alpha }: CreateMaskType = {}) {
        name = name || `${Date.now()}_${getRandomIntInclusive(1000, 9999)}`;
        color = color || 0xF5F5DC;
        alpha = alpha || 0.8;
        const maskNum: number = input.$children.filter(component => component instanceof egret.Shape && component.name == name).length;
        if (maskNum > 0) return;
        const square: egret.Shape = new egret.Shape();
        square.graphics.beginFill(0xF5F5DC, 0.8);
        square.graphics.drawRect(0, 0, input.width, input.height);
        square.graphics.endFill();
        square.name = name;
        input.addChild(square);
    }

    /**
     * 移除拖拽遮罩
     */
    public static removeMask(input: eui.Component, name: string) {
        // 为了防止多次创建遮罩而不被销毁
        input.$children.filter(component => component instanceof egret.Shape && component.name === name)
            .forEach(component => input.removeChild(component));
    }

    /**
     * 移动动画
     * @param func 回调函数, 默认重置锁定
     */
    public static moveTween(target: any, { x, y }, func: Function = () => DropBaseUtil.unClock()) {
        egret.Tween.get(target).to({ x, y }, 300, egret.Ease.sineIn)
            .call(func);
    }

    /**
     * 获取选中的组件(拖拽标记的)
     */
    public static getSelectedPoke(name: string): Poke {
        // 获取做拽的控件内容
        const touchSelected: TouchSelected = SceneManagerUtil.Instance.rootLayer.stage[name] as TouchSelected;
        if (!touchSelected || !touchSelected.componentName) return;
        // 根据名称获取组件对象
        const poke: Poke = SceneUtil.getComponentByName(touchSelected.componentName);
        return poke;
    }

    /**
     * 记录当前拖拽扑克牌
     */
    public static recordDropPoke(groupId: string, name: string) {
        SceneManagerUtil.Instance.rootLayer.stage[DropBase.TOUCH_SELECTED] = { groupId, componentName: name };
    }

    /**
     * 移除当前拖拽扑克牌
     */
    public static deleteDropPoke() {
        SceneManagerUtil.Instance.rootLayer.stage[DropBase.TOUCH_SELECTED] = { groupId: null, componentName: null };
    }

    /**
     * onTouchEnd处理事件
     * @param canMove 是否可重定位移动 {true: 是, false: 不可移动}
     */
    public static onTouchEndHandle(canMove: boolean) {
        // ================================================
        // 为了避免抬起时是在扑克牌上，此处直接获取选中扑克牌信息
        const poke: Poke = DropBaseUtil.getSelectedPoke(DropBase.TOUCH_SELECTED);
        if (!poke) return;
        // ================================================
        // 获取所有拖拽的扑克
        const index = PokeRuleUtil.Instance.pokeQueue.location(poke.name);
        const pokeNames: string[] = index.length === 0 ? [poke.name] : PokeRuleUtil.Instance.pokeQueue[index[0]].slice(index[1]);
        pokeNames.forEach(pokeName => {
            const poke: Poke = SceneUtil.getComponentByName(pokeName);
            // 移除遮罩
            DropBaseUtil.removeMask(poke, DropBase.MASK_OF_POKE);
            // 重置扑克牌记录
            DropBaseUtil.deleteDropPoke();
            if (!canMove) {
                // 重置回到上一次的位置
                DropBaseUtil.moveTween(poke, { x: poke._BEFORE_DROP_X, y: poke._BEFORE_DROP_Y });
            } else {
                DropBaseUtil.unClock();
            }
        })
        if (canMove) {
            PokeRuleUtil.Instance.handleMarge();
        }
    }

    /**
     * 获取全部碰撞检测点对应的扑克牌对象
     * @param poke 当前操作的扑克
     */
    public static getCollisionChecks(poke: Poke): Box[] {
        // 获取全部碰撞点（强制重新获取）
        const hitPoints: PokePositions = PokeRuleUtil.Instance.getHitPoints(true);
        // 记录碰撞点对应的扑克牌对象
        const hitPokes: Box[] = [];
        // 获取当前扑克牌以及下方列表中全部扑克牌名称
        const point: PokePoint = PokeRuleUtil.Instance.getPokeImmediatelyPoint(poke.name);
        const select: string[] = PokeRuleUtil.Instance.pokeQueue[point.col];
        hitPoints.filter(hitPoint => !select.deepContains(hitPoint.component.name)).forEach(hitPoint => {
            const isHit: boolean = poke.hitTestPoint(hitPoint.topLeft.x, hitPoint.topLeft.y)
                || poke.hitTestPoint(hitPoint.topRight.x, hitPoint.topRight.y)
                || poke.hitTestPoint(hitPoint.bottomLeft.x, hitPoint.bottomLeft.y)
                || poke.hitTestPoint(hitPoint.bottomRight.x, hitPoint.bottomRight.y);
            if (isHit) hitPokes.push(hitPoint.component);
        });
        return hitPokes;
    }

    /**
    * 获取碰撞检测对应的扑克牌对象，如果同时碰撞多个，则返回碰撞面积大的碰撞点
    * @param poke 当前操作的扑克
    */
    public static getCollisionCheck(poke: Poke): Box {
        // 获取全部碰撞扑克牌
        const collision: Box[] = DropBaseUtil.getCollisionChecks(poke);
        // TODO 是否需要做判断操作 还是只是获取第一个
        if (collision.length === 1) {
            return collision[0];
        }
    }

    /**
     * 验证是否是当前扑克牌对象
     * @param poke 扑克牌对象
     * @returns { true: 是, false: 不是 }
     */
    public static isDropNow(poke: Poke): boolean {
        if (!poke) return false;
        const select: Poke = DropBaseUtil.getSelectedPoke(DropBase.TOUCH_SELECTED);
        if (!select) return false;
        return select.name === poke.name;
    }

    /**
     * 锁定拖拽（控制移动时全局只可同时移动一个）
     * (true: 锁定, false: 非锁定)
     */
    public static clock() {
        SceneManagerUtil.Instance.rootLayer.stage['clock'] = true;
    }

    /**
     * 解锁拖拽
     */
    public static unClock() {
        SceneManagerUtil.Instance.rootLayer.stage['clock'] = false;
    }

    /**
     * 获取拖拽锁定状态
     * @returns true: 锁定, false: 非锁定
     */
    public static isClock(): boolean {
        return SceneManagerUtil.Instance.rootLayer.stage['clock'];
    }
}