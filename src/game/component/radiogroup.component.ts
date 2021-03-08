interface MyRadioGroupItem {
    label: string;
    value: any;
    disabled?: boolean;
}

interface MyRadioGroupParam {
    x?: number;
    y?: number;
    item?: MyRadioGroupItem[],
    selectedValue?: any;
}
/**
 * RadioButtonGroup封装
 */
class MyRadioGroup {

    private radioGroup: eui.Group;
    private radioSkinName: string;
    private radioName: string = `RADIO_NAME_${new Date().getTime()}_${Object.random1<string>(1000, 9999)}`;

    constructor(config: MyRadioGroupParam = {}) {
        this.radioSkinName =
            `<e:Skin states="up,down,disabled,upAndSelected,downAndSelected,disabledAndSelected" xmlns:e="http://ns.egret.com/eui">
                <e:Group width="100%" height="100%">
                    <e:layout>
                        <e:HorizontalLayout verticalAlign="middle"/>
                    </e:layout>
                    <e:Image fillMode="scale" alpha="1" alpha.disabled="0.5" alpha.down="0.7"
                            source="resource/assets/RadioButton/radioButton_unselect.png"
                            source.upAndSelected="resource/assets/RadioButton/radioButton_select_up.png"
                            source.downAndSelected="resource/assets/RadioButton/radioButton_select_down.png"
                            source.disabledAndSelected="resource/assets/RadioButton/radioButton_select_disabled.png"/>
                    <e:Label id="labelDisplay" size="20" textColor="0x8B4513"
                            strokeColor="0xA0522D" stroke="2"
                            textAlign="center" verticalAlign="middle"/>
                </e:Group>
            </e:Skin>`;
        var hLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
        hLayout.gap = 24;
        hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.radioGroup = new eui.Group();
        this.radioGroup.layout = hLayout;
        for (let key in config) {
            this.radioGroup[key] = config[key];
        }
        this.build();
    }

    private build(): eui.Group {
        const uuid: string = new Date().getTime() + Object.random1<string>(1000, 9999);
        ((this.radioGroup['item'] || []) as MyRadioGroupItem[]).forEach(item => {
            const radio: eui.RadioButton = new eui.RadioButton();
            radio.skinName = this.radioSkinName;
            radio.groupName = uuid;
            radio.name = this.radioName;
            radio.value = item.value;
            radio.label = `  ${item.label}`;
            radio.enabled = !item.disabled;
            this.radioGroup.addChild(radio);
        });
        (this.radioGroup.getChildByName(this.radioName) as eui.RadioButton).group.selectedValue = this.radioGroup['selectedValue'];
        return this.radioGroup;
    }

    public get Component(): eui.Group {
        return this.radioGroup;
    }

    /**
     * 添加数据change监听器
     */
    public addChangeEvent(func: (component: eui.RadioButtonGroup) => any | void): this {
        (this.radioGroup.getChildByName(this.radioName) as eui.RadioButton).group
            .addEventListener(egret.Event.CHANGE, (event: any) => {
                func(event.target as eui.RadioButtonGroup);
            }, this.radioGroup);
        return this;
    }
}