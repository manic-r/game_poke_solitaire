type PokePositions = PokePosition[];
type POKE_COLOR = 'RED' | 'BLACK';
// 固定扑克牌类型 BOX: 可放置  MODE：不可放置
type FixedType = 'BOX' | 'MODE';
type FixedStorey = 'TopFixedBox' | 'GearsBox' | 'CenterFixedBox' | 'pokeQueue';
// 扑克牌对象和盒子对象
type Box = Poke | FixedBox;