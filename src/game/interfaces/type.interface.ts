type PokePositions = PokePosition[];
type POKE_COLOR = 'RED' | 'BLACK';
// 固定扑克牌类型 BOX: 可放置  MODE：不可放置
type FixedType = 'BOX' | 'MODE';
type FixedStorey = 'TopFixedBox' | 'GearsBox' | 'CenterFixedBox' | 'pokeQueue';
// 扑克牌对象和盒子对象
type Box = Poke | FixedBox;
// 游戏状态(1: 已有开始游戏, 0: 无开始游戏)
type GameState = '1' | '0';