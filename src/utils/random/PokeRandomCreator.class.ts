class PokeRandomCreator {

    private poolArray: string[] = [];

    constructor() {
        ['a', 'b', 'c', 'd'].forEach((type) => {
            for (let i = 1; i < 14; i++) {
                this.poolArray.push(PokeRandomCreator.getPokeName({ type, figure: i }));
            }
        })
    }

    /**
     * 获取扑克牌名称
     * @param param0 类型
     * @param param1 位数
     */
    public static getPokeName({ type, figure }: { type: string, figure: number }): string {
        return `pk_${type}_${figure}`;
    }

    /**
     * 根据扑克牌名称获取类型和位数
     * @param name 扑克牌名称
     */
    public static analysisPokeName(name: string): { type: string, figure: string } {
        const array: string[] = name.split('_');
        return {
            type: array[1],
            figure: array[2]
        }
    }

    /**
     * 获取随机一张扑克牌
     */
    public get poke(): PokeInfoCreator {
        if (this.poolArray.length === 0) {
            return;
        }
        const index: number = getRandomIntInclusive(0, this.poolArray.length - 1);
        const pokeName: string = this.poolArray[index];
        this.poolArray.splice(index, 1);
        const { type, figure } = PokeRandomCreator.analysisPokeName(pokeName);
        return {
            name: pokeName,
            type,
            figure
        };
    }
}

interface PokeInfoCreator {
    // 扑克牌名称
    name: string,
    // 扑克牌类型
    type: string,
    // 扑克牌位数
    figure: string
}