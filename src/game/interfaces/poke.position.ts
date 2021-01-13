/**
 * 点位坐标
 */
interface PokePosition {
    component: Poke | FixedBox;
    topLeft: egret.Point;
    topRight: egret.Point;
    bottomRight: egret.Point;
    bottomLeft: egret.Point;
}