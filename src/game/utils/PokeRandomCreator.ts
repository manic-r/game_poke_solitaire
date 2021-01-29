class PokeRandomCreator {

    private poolArray: string[] = [];

    constructor(type: string[] = []) {
        type.forEach(type => {
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

    /**
     * 扑克牌正常序列
     */
    public order(): PokeRandomCreator {
        this.poolArray.reverse();
        const pokeName: string[][] = [];
        this.poolArray.forEach((row) => {
            const sp: number = pokeName.length <= 4 ? 7 : 6;
            const rowName: string[] = pokeName.pop() || [];
            pokeName.push(rowName);
            if (rowName.length < sp) {
                rowName.push(row);
            } else {
                pokeName.push([row]);
            }
        })
        this.poolArray = [];
        for (let i = 0; i < pokeName.length; i++) {
            pokeName.forEach(row => {
                if (row[i]) {
                    let name: string = row[i];
                    // if (i % 2 == 0) {
                    //     name = name.replace(/a/g, 'b');
                    //     name = name.replace(/b/g, 'c');
                    //     name = name.replace(/c/g, 'd');
                    //     name = name.replace(/d/g, 'a');
                    // }
                    this.poolArray.push(name);
                }
            });
        }
        console.log(this.poolArray)
        return this;
    }

    /**
     * 顺序获取扑克牌
     */
    public get orderPoke(): PokeInfoCreator {
        const pokeName: string = this.poolArray[0];
        this.poolArray.splice(0, 1);
        const { type, figure } = PokeRandomCreator.analysisPokeName(pokeName);
        return {
            name: pokeName,
            type,
            figure
        };
    }
}