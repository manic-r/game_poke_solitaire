/**
 * 游戏配置场景
 */
class ConfigScene extends SceneBase {

    // 旋转后的宽距
    private rotation_marge: number = 60;
    // 文字大小
    private font_size: number = 30;
    // 固定文本框高度大于文字的大小差值
    private height_more: number = 0;

    constructor() {
        super();
        this.skinName = 'resource/eui_skins/games/solitaire/ConfigScene.exml';
    }

    protected onComplete() {
        // 创建回退按钮
        this.backButton();
        // 处理Logo
        const startIndex: { x: number, y: number } = this.addLogo();
        // 计算开始坐标点
        const marge: number = 40;
        const left_marge: number = 20;
        const x: number = startIndex.x + marge;
        const y: number = startIndex.y + this.rotation_marge + 60;
        btnConfig.forEach(({ label, info, create }, index) => {
            const text: eui.Label = this.createText(label, { x, y: y + (marge + this.font_size) * index });
            const vX: number = x + text.width + left_marge;
            const vY: number = text.y;
            info.x = vX;
            info.y = vY;
            this.addChild(create(info).Component);
        });
    }

    /**
     * 添加logo,返回锚点坐标
     */
    private addLogo(): { x: number, y: number } {
        const { stageWidth }: egret.Stage = SceneManagerUtil.Instance.rootLayer.stage;
        // 创建Logo对象
        const logo: eui.Component = new eui.Component();
        logo.skinName = 'resource/eui_skins/games/solitaire/Logo.exml';
        logo.width = stageWidth / 2;
        this.addChild(logo);
        logo.enabled = false;
        logo.anchorOffsetX = logo.width / 2;
        logo.anchorOffsetY = logo.height * 0.7 / 2;
        logo.rotation = -45;
        logo.x = logo.anchorOffsetX - this.rotation_marge;
        logo.y = logo.anchorOffsetY + this.rotation_marge;
        return {
            x: logo.anchorOffsetX,
            y: logo.anchorOffsetY
        }
    }

    private backButton() {
        const button: eui.Button = new eui.Button();
        button.name = 'BackButton';
        button.label = '主界面';
        button.width = 100;
        button.height = 100;
        button.x = SceneManagerUtil.Instance.rootLayer.stage.stageWidth - 150;
        button.y = 150;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            SceneManagerUtil.Instance.changeScene(new StartScene())
        }, button)
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
type BtnConfig = {
    label: string,
    key: string,
    info: CreateInfo,
    create: (info: CreateInfo) => CreateResponse
};
type ComponentType = 'checkbox' | 'radio';
type CreateInfo = MyCheckBoxParam | MyRadioGroupParam;
type CreateResponse = MyCheckBox | MyRadioGroup;

const btnConfig: BtnConfig[] =
    [
        // 是否开启记录游戏配置项
        {
            label: '游戏数据存储',
            key: '_GAME_SAVING',
            info: { labelItem: { 0: '关闭', 1: '开启' } },
            create: (info: MyCheckBoxParam) => {
                info.selected = SceneManagerUtil.Instance.config.__GAME_SAVING;
                return new MyCheckBox(info)
                    .addChangeEvent((tag) => {
                        egret.localStorage.setItem('_GAME_SAVING', String(tag.selected))
                        SceneManagerUtil.Instance.config.loadConfig();
                    });
            }
        },
        // 选择游戏难度
        {
            label: '游戏难度',
            key: '_GAME_LEVEL',
            info: {
                item: [
                    { label: '简易', value: '1' },
                    { label: '标准', value: '2' },
                    { label: '极难', value: '3', disabled: true }
                ]
            },
            create: (info: MyRadioGroupParam) => {
                info.selectedValue = SceneManagerUtil.Instance.config.__GAME_LEVEL;
                return new MyRadioGroup(info)
                    .addChangeEvent((tag) => {
                        egret.localStorage.setItem('_GAME_LEVEL', String(tag.selectedValue))
                        SceneManagerUtil.Instance.config.loadConfig();
                    });
            }
        },
        // 是否启动提示
        {
            label: '吸附位置提示',
            key: '_GAME_TIP',
            info: { labelItem: { 0: '关闭', 1: '开启' } },
            create: (info: MyCheckBoxParam) => {
                info.selected = SceneManagerUtil.Instance.config.__GAME_TIP;
                return new MyCheckBox(info)
                    .addChangeEvent((tag) => {
                        egret.localStorage.setItem('_GAME_TIP', String(tag.selected))
                        SceneManagerUtil.Instance.config.loadConfig();
                    });
            }
        },
        // 映射关系
        {
            label: '映射关系',
            key: '_GAME_MAPPING',
            info: {
                item: [
                    { label: '异色', value: '1' },
                    { label: '同色', value: '2' },
                ]
            },
            create: (info: MyRadioGroupParam) => {
                info.selectedValue = SceneManagerUtil.Instance.config.__GAME_MAPPING;
                return new MyRadioGroup(info)
                    .addChangeEvent((tag) => {
                        egret.localStorage.setItem('_GAME_MAPPING', String(tag.selectedValue))
                        SceneManagerUtil.Instance.config.loadConfig();
                    });
            }
        },
    ]