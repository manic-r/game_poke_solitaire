/**
 * 组件封装父类
 */
class BaseGroup extends eui.Group {

    // 文字大小
    private font_size: number = 30;
    // 固定文本框高度大于文字的大小差值
    private height_more: number = 0;

    constructor() {
        super();
        const hLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
        hLayout.gap = 20;
        hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.layout = hLayout;
        // this.createText()
    }

    private createText(name: string, { x, y }: { x: number, y: number }) {
        const component: eui.Label = new eui.Label();
        component.textFlow = <Array<egret.ITextElement>>[
            { text: name, style: { 'textColor': 0x336699, 'size': this.font_size, 'strokeColor': 0x6699cc, 'stroke': 2 } },
        ];
        component.textAlign = 'center';
        component.x = x;
        component.y = y;
        component.width = 200;
        component.height = this.font_size + this.height_more;
        this.addChild(component);
        return component;
    }
}