interface MyCheckBoxParam {
    x?: number;
    y?: number;
    selected?: boolean;
    labelItem?: {
        // 对应未勾选
        0?: string
        // 对应勾选
        1?: string
    } | string;
}

/**
 * Checkbox封装
 */
class MyCheckBox {

    private checkbox: eui.CheckBox = new eui.CheckBox();

    constructor(config: MyCheckBoxParam = {}) {
        const skinName: string = `
            <e:Skin states="up,down,disabled,upAndSelected,downAndSelected,disabledAndSelected" xmlns:e="http://ns.egret.com/eui">
                <e:Group width="100%" height="100%">
                    <e:layout>
                        <e:HorizontalLayout verticalAlign="middle"/>
                    </e:layout>
                    <e:Image fillMode="scale" alpha="1" alpha.disabled="0.5" alpha.down="0.7"
                            source="resource/assets/CheckBox/checkbox_unselect.png"
                            source.upAndSelected="resource/assets/CheckBox/checkbox_select_up.png"
                            source.downAndSelected="resource/assets/CheckBox/checkbox_select_down.png"
                            source.disabledAndSelected="resource/assets/CheckBox/checkbox_select_disabled.png"/>
                    <e:Label id="labelDisplay" size="20" textColor="0x8B4513"
                            style="margin-left: 20px;"
                            strokeColor="0xA0522D" stroke="2"
                            textAlign="center" verticalAlign="middle"
                            fontFamily="Tahoma"/>
                </e:Group>
            </e:Skin>
        `
        this.checkbox.skinName = skinName;
        for (let key in config) {
            this.checkbox[key] = config[key];
        }
        this.labelChangeListener();
        if (!Object.isString(config.labelItem)) {
            this.addChangeEvent(() => this.labelChangeListener());
        }
    }

    public get Component(): eui.CheckBox {
        return this.checkbox;
    }

    /**
     * 添加数据change监听器
     */
    public addChangeEvent(func: (component: eui.CheckBox, event: Event) => any | void): this {
        this.checkbox.addEventListener(egret.Event.CHANGE, (event: Event) => {
            func(this.checkbox, event);
        }, this.checkbox);
        return this;
    }

    /**
     * label与值对应关系
     */
    private labelChangeListener() {
        const mapping: { 'true': number, 'false': number } = { 'true': 1, 'false': 0 };
        const type: string = mapping[String(this.checkbox.selected)];
        const labelItem = this.checkbox['labelItem'] || '';
        this.checkbox.label = !Object.isString(labelItem) ? this.checkbox['labelItem'][type] : this.checkbox['labelItem'];
        // 设置margin
        if (this.checkbox.label) this.checkbox.label = `  ${this.checkbox.label}`;
    }
}