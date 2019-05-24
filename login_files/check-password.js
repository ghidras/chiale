/**
 * 键盘模式识别
 * @param {string} letters
 */
function identifyKeyboardPatterns(letters) {
    let KEY_BOARD_ADJACENT_MAP = {
        "`": ["`", "~", "1", "!", "q", "Q"],
        "1": ["1", "!", "q", "Q", "`", "~", "2", "@", "w", "W"],
        "2": ["2", "@", "w", "W", "1", "!", "3", "#", "q", "Q", "e", "E"],
        "3": ["3", "#", "e", "E", "2", "@", "4", "$", "w", "W", "r", "R"],
        "4": ["4", "$", "r", "R", "3", "#", "5", "%", "e", "E", "t", "T"],
        "5": ["5", "%", "t", "T", "4", "$", "6", "^", "r", "R", "y", "Y"],
        "6": ["6", "^", "y", "Y", "5", "%", "7", "&", "t", "T", "u", "U"],
        "7": ["7", "&", "u", "U", "6", "^", "8", "*", "y", "Y", "i", "I"],
        "8": ["8", "*", "i", "I", "7", "&", "9", "(", "u", "U", "o", "O"],
        "9": ["9", "(", "o", "O", "8", "*", "0", ")", "i", "I", "p", "P"],
        "0": ["0", ")", "p", "P", "9", "(", "-", "_", "o", "O", "[", "{"],
        "-": ["-", "_", "[", "{", "0", ")", "=", "+", "p", "P", "]", "}"],
        "=": ["=", "+", "]", "}", "-", "_", "[", "{", "\\", "|"],
        q: ["q", "Q", "1", "!", "a", "A", "w", "W", "`", "~", "2", "@", "s", "S"],
        w: ["w", "W", "2", "@", "s", "S", "q", "Q", "e", "E", "1", "!", "3", "#", "a", "A", "d", "D"],
        e: ["e", "E", "3", "#", "d", "D", "w", "W", "r", "R", "2", "@", "4", "$", "s", "S", "f", "F"],
        r: ["r", "R", "4", "$", "f", "F", "e", "E", "t", "T", "3", "#", "5", "%", "d", "D", "g", "G"],
        t: ["t", "T", "5", "%", "g", "G", "r", "R", "y", "Y", "4", "$", "6", "^", "f", "F", "h", "H"],
        y: ["y", "Y", "6", "^", "h", "H", "t", "T", "u", "U", "5", "%", "7", "&", "g", "G", "j", "J"],
        u: ["u", "U", "7", "&", "j", "J", "y", "Y", "i", "I", "6", "^", "8", "*", "h", "H", "k", "K"],
        i: ["i", "I", "8", "*", "k", "K", "u", "U", "o", "O", "7", "&", "9", "(", "j", "J", "l", "L"],
        o: ["o", "O", "9", "(", "l", "L", "i", "I", "p", "P", "8", "*", "0", ")", "k", "K", ";", ":"],
        p: ["p", "P", "0", ")", ";", ":", "o", "O", "[", "{", "9", "(", "-", "_", "l", "L"],
        "[": ["[", "{", "-", "_", "p", "P", "]", "}", "0", ")", "=", "+", ";", ":"],
        "]": ["]", "}", "=", "+", "[", "{", "\\", "|", "-", "_"],
        "\\": ["\\", "|", "]", "}", "=", "+"],
        a: ["a", "A", "q", "Q", "z", "Z", "s", "S", "w", "W", "x", "X"],
        s: ["s", "S", "w", "W", "x", "X", "a", "A", "d", "D", "q", "Q", "e", "E", "z", "Z", "c", "C"],
        d: ["d", "D", "e", "E", "c", "C", "s", "S", "f", "F", "w", "W", "r", "R", "x", "X", "v", "V"],
        f: ["f", "F", "r", "R", "v", "V", "d", "D", "g", "G", "e", "E", "t", "T", "c", "C", "b", "B"],
        g: ["g", "G", "t", "T", "b", "B", "f", "F", "h", "H", "r", "R", "y", "Y", "v", "V", "n", "N"],
        h: ["h", "H", "y", "Y", "n", "N", "g", "G", "j", "J", "t", "T", "u", "U", "b", "B", "m", "M"],
        j: ["j", "J", "u", "U", "m", "M", "h", "H", "k", "K", "y", "Y", "i", "I", "n", "N", ",", "<"],
        k: ["k", "K", "i", "I", ",", "<", "j", "J", "l", "L", "u", "U", "o", "O", "m", "M", ".", ">"],
        l: ["l", "L", "o", "O", ".", ">", "k", "K", ";", ":", "i", "I", "p", "P", ",", "<", "/", "?"],
        ";": [";", ":", "p", "P", "/", "?", "l", "L", "o", "O", "[", "{", ".", ">"],
        z: ["z", "Z", "a", "A", "x", "X", "s", "S"],
        x: ["x", "X", "s", "S", "z", "Z", "c", "C", "a", "A", "d", "D"],
        c: ["c", "C", "d", "D", "x", "X", "v", "V", "s", "S", "f", "F"],
        v: ["v", "V", "f", "F", "c", "C", "b", "B", "d", "D", "g", "G"],
        b: ["b", "B", "g", "G", "v", "V", "n", "N", "f", "F", "h", "H"],
        n: ["n", "N", "h", "H", "b", "B", "m", "M", "g", "G", "j", "J"],
        m: ["m", "M", "j", "J", "n", "N", ",", "<", "h", "H", "k", "K"],
        ",": [",", "<", "k", "K", "m", "M", ".", ">", "j", "J", "l", "L"],
        ".": [".", ">", "l", "L", ",", "<", "/", "?", "k", "K", ";", ":"],
        "/": ["/", "?", ";", ":", ".", ">", "l", "L"],
        "~": ["~", "`", "!", "1", "Q", "q"],
        "!": ["!", "1", "Q", "q", "~", "`", "@", "2", "W", "w"],
        "@": ["@", "2", "W", "w", "!", "1", "#", "3", "Q", "q", "E", "e"],
        "#": ["#", "3", "E", "e", "@", "2", "$", "4", "W", "w", "R", "r"],
        $: ["$", "4", "R", "r", "#", "3", "%", "5", "E", "e", "T", "t"],
        "%": ["%", "5", "T", "t", "$", "4", "^", "6", "R", "r", "Y", "y"],
        "^": ["^", "6", "Y", "y", "%", "5", "&", "7", "T", "t", "U", "u"],
        "&": ["&", "7", "U", "u", "^", "6", "*", "8", "Y", "y", "I", "i"],
        "*": ["*", "8", "I", "i", "&", "7", "(", "9", "U", "u", "O", "o"],
        "(": ["(", "9", "O", "o", "*", "8", ")", "0", "I", "i", "P", "p"],
        ")": [")", "0", "P", "p", "(", "9", "_", "-", "O", "o", "{", "["],
        _: ["_", "-", "{", "[", ")", "0", "+", "=", "P", "p", "}", "]"],
        "+": ["+", "=", "}", "]", "_", "-", "{", "[", "|", "\\"],
        Q: ["Q", "q", "!", "1", "A", "a", "W", "w", "~", "`", "@", "2", "S", "s"],
        W: ["W", "w", "@", "2", "S", "s", "Q", "q", "E", "e", "!", "1", "#", "3", "A", "a", "D", "d"],
        E: ["E", "e", "#", "3", "D", "d", "W", "w", "R", "r", "@", "2", "$", "4", "S", "s", "F", "f"],
        R: ["R", "r", "$", "4", "F", "f", "E", "e", "T", "t", "#", "3", "%", "5", "D", "d", "G", "g"],
        T: ["T", "t", "%", "5", "G", "g", "R", "r", "Y", "y", "$", "4", "^", "6", "F", "f", "H", "h"],
        Y: ["Y", "y", "^", "6", "H", "h", "T", "t", "U", "u", "%", "5", "&", "7", "G", "g", "J", "j"],
        U: ["U", "u", "&", "7", "J", "j", "Y", "y", "I", "i", "^", "6", "*", "8", "H", "h", "K", "k"],
        I: ["I", "i", "*", "8", "K", "k", "U", "u", "O", "o", "&", "7", "(", "9", "J", "j", "L", "l"],
        O: ["O", "o", "(", "9", "L", "l", "I", "i", "P", "p", "*", "8", ")", "0", "K", "k", ":", ";"],
        P: ["P", "p", ")", "0", ":", ";", "O", "o", "{", "[", "(", "9", "_", "-", "L", "l"],
        "{": ["{", "[", "_", "-", "P", "p", "}", "]", ")", "0", "+", "=", ":", ";"],
        "}": ["}", "]", "+", "=", "{", "[", "|", "\\", "_", "-"], "|": ["|", "\\", "}", "]", "+", "="],
        A: ["A", "a", "Q", "q", "Z", "z", "S", "s", "W", "w", "X", "x"],
        S: ["S", "s", "W", "w", "X", "x", "A", "a", "D", "d", "Q", "q", "E", "e", "Z", "z", "C", "c"],
        D: ["D", "d", "E", "e", "C", "c", "S", "s", "F", "f", "W", "w", "R", "r", "X", "x", "V", "v"],
        F: ["F", "f", "R", "r", "V", "v", "D", "d", "G", "g", "E", "e", "T", "t", "C", "c", "B", "b"],
        G: ["G", "g", "T", "t", "B", "b", "F", "f", "H", "h", "R", "r", "Y", "y", "V", "v", "N", "n"],
        H: ["H", "h", "Y", "y", "N", "n", "G", "g", "J", "j", "T", "t", "U", "u", "B", "b", "M", "m"],
        J: ["J", "j", "U", "u", "M", "m", "H", "h", "K", "k", "Y", "y", "I", "i", "N", "n", "<", ","],
        K: ["K", "k", "I", "i", "<", ",", "J", "j", "L", "l", "U", "u", "O", "o", "M", "m", ">", "."],
        L: ["L", "l", "O", "o", ">", ".", "K", "k", ":", ";", "I", "i", "P", "p", "<", ",", "?", "/"],
        ":": [":", ";", "P", "p", "?", "/", "L", "l", "O", "o", "{", "[", ">", "."],
        Z: ["Z", "z", "A", "a", "X", "x", "S", "s"],
        X: ["X", "x", "S", "s", "Z", "z", "C", "c", "A", "a", "D", "d"],
        C: ["C", "c", "D", "d", "X", "x", "V", "v", "S", "s", "F", "f"],
        V: ["V", "v", "F", "f", "C", "c", "B", "b", "D", "d", "G", "g"],
        B: ["B", "b", "G", "g", "V", "v", "N", "n", "F", "f", "H", "h"],
        N: ["N", "n", "H", "h", "B", "b", "M", "m", "G", "g", "J", "j"],
        M: ["M", "m", "J", "j", "N", "n", "<", ",", "H", "h", "K", "k"],
        "<": ["<", ",", "K", "k", "M", "m", ">", ".", "J", "j", "L", "l"],
        ">": [">", ".", "L", "l", "<", ",", "?", "/", "K", "k", ":", ";"],
        "?": ["?", "/", ":", ";", ">", ".", "L", "l"]
    };

    let KEY_BOARD_SAME_MAP = {
        "`": ["`", "~", "1", "!"],
        "1": ["1", "!", "`", "~", "2", "@"],
        "2": ["2", "@", "1", "!", "3", "#"],
        "3": ["3", "#", "2", "@", "4", "$"],
        "4": ["4", "$", "3", "#", "5", "%"],
        "5": ["5", "%", "4", "$", "6", "^"],
        "6": ["6", "^", "5", "%", "7", "&"],
        "7": ["7", "&", "6", "^", "8", "*"],
        "8": ["8", "*", "7", "&", "9", "("],
        "9": ["9", "(", "8", "*", "0", ")"],
        "0": ["0", ")", "9", "(", "-", "_"],
        "-": ["-", "_", "0", ")", "=", "+"],
        "=": ["=", "+", "-", "_"],
        q: ["q", "Q", "w", "W"],
        w: ["w", "W", "q", "Q", "e", "E"],
        e: ["e", "E", "w", "W", "r", "R"],
        r: ["r", "R", "e", "E", "t", "T"],
        t: ["t", "T", "r", "R", "y", "Y"],
        y: ["y", "Y", "t", "T", "u", "U"],
        u: ["u", "U", "y", "Y", "i", "I"],
        i: ["i", "I", "u", "U", "o", "O"],
        o: ["o", "O", "i", "I", "p", "P"],
        p: ["p", "P", "o", "O", "[", "{"],
        "[": ["[", "{", "p", "P", "]", "}"],
        "]": ["]", "}", "[", "{", "\\", "|"],
        "\\": ["\\", "|", "]", "}"],
        a: ["a", "A", "s", "S"],
        s: ["s", "S", "a", "A", "d", "D"],
        d: ["d", "D", "s", "S", "f", "F"],
        f: ["f", "F", "d", "D", "g", "G"],
        g: ["g", "G", "f", "F", "h", "H"],
        h: ["h", "H", "g", "G", "j", "J"],
        j: ["j", "J", "h", "H", "k", "K"],
        k: ["k", "K", "j", "J", "l", "L"],
        l: ["l", "L", "k", "K", ";", ":"],
        ";": [";", ":", "l", "L"],
        z: ["z", "Z", "x", "X"],
        x: ["x", "X", "z", "Z", "c", "C"],
        c: ["c", "C", "x", "X", "v", "V"],
        v: ["v", "V", "c", "C", "b", "B"],
        b: ["b", "B", "v", "V", "n", "N"],
        n: ["n", "N", "b", "B", "m", "M"],
        m: ["m", "M", "n", "N", ",", "<"],
        ",": [",", "<", "m", "M", ".", ">"],
        ".": [".", ">", ",", "<", "/", "?"],
        "/": ["/", "?", ".", ">"],
        "~": ["~", "`", "!", "1"],
        "!": ["!", "1", "~", "`", "@", "2"],
        "@": ["@", "2", "!", "1", "#", "3"],
        "#": ["#", "3", "@", "2", "$", "4"],
        $: ["$", "4", "#", "3", "%", "5"],
        "%": ["%", "5", "$", "4", "^", "6"],
        "^": ["^", "6", "%", "5", "&", "7"],
        "&": ["&", "7", "^", "6", "*", "8"],
        "*": ["*", "8", "&", "7", "(", "9"],
        "(": ["(", "9", "*", "8", ")", "0"],
        ")": [")", "0", "(", "9", "_", "-"],
        _: ["_", "-", ")", "0", "+", "="],
        "+": ["+", "=", "_", "-"],
        Q: ["Q", "q", "W", "w"],
        W: ["W", "w", "Q", "q", "E", "e"],
        E: ["E", "e", "W", "w", "R", "r"],
        R: ["R", "r", "E", "e", "T", "t"],
        T: ["T", "t", "R", "r", "Y", "y"],
        Y: ["Y", "y", "T", "t", "U", "u"],
        U: ["U", "u", "Y", "y", "I", "i"],
        I: ["I", "i", "U", "u", "O", "o"],
        O: ["O", "o", "I", "i", "P", "p"],
        P: ["P", "p", "O", "o", "{", "["],
        "{": ["{", "[", "P", "p", "}", "]"],
        "}": ["}", "]", "{", "[", "|", "\\"],
        "|": ["|", "\\", "}", "]"],
        A: ["A", "a", "S", "s"],
        S: ["S", "s", "A", "a", "D", "d"],
        D: ["D", "d", "S", "s", "F", "f"],
        F: ["F", "f", "D", "d", "G", "g"],
        G: ["G", "g", "F", "f", "H", "h"],
        H: ["H", "h", "G", "g", "J", "j"],
        J: ["J", "j", "H", "h", "K", "k"],
        K: ["K", "k", "J", "j", "L", "l"],
        L: ["L", "l", "K", "k", ":", ";"],
        ":": [":", ";", "L", "l"],
        Z: ["Z", "z", "X", "x"],
        X: ["X", "x", "Z", "z", "C", "c"],
        C: ["C", "c", "X", "x", "V", "v"],
        V: ["V", "v", "C", "c", "B", "b"],
        B: ["B", "b", "V", "v", "N", "n"],
        N: ["N", "n", "B", "b", "M", "m"],
        M: ["M", "m", "N", "n", "<", ","],
        "<": ["<", ",", "M", "m", ">", "."],
        ">": [">", ".", "<", ",", "?", "/"],
        "?": ["?", "/", ">", "."]
    };

    /* key board pattern */
    let KEY_BOARD_PATTERN = {
        NO_PATTERN: false, SAME_ROW: "同行输入", ZIGZAG: "波浪形输入"
    };

    function isSameRow(key1, key2) {
        let adjacentList = KEY_BOARD_SAME_MAP[key1];
        if (adjacentList === undefined) {
            return false;
        }
        let indexValue = adjacentList.indexOf(key2.toString());
        return indexValue !== -1;
    }

    function isAdjacent(key1, key2) {
        let adjacentList = KEY_BOARD_ADJACENT_MAP[key1];
        if (adjacentList === undefined) {
            return false;
        }
        let indexValue = adjacentList.indexOf(key2.toString());
        return indexValue !== -1;
    }

    if (letters.length < 4) {
        return KEY_BOARD_PATTERN.NO_PATTERN;
    }

    let samerow = true;
    let zigzag = true;
    for (let i = 1; i < letters.length; i += 1) {
        let pos1 = letters.charAt(i - 1);
        let pos2 = letters.charAt(i);
        if (isAdjacent(pos1, pos2)) {
            samerow = samerow & isSameRow(pos1, pos2);
            zigzag = zigzag || !isSameRow(pos1, pos2);
        } else {
            return KEY_BOARD_PATTERN.NO_PATTERN;
        }
    }
    if (samerow) {
        return {
            status: true, res: KEY_BOARD_PATTERN.SAME_ROW, word: letters
        };
    }
    if (zigzag) {
        return {
            status: true, res: KEY_BOARD_PATTERN.ZIGZAG, word: letters
        };
    }
    return KEY_BOARD_PATTERN.NO_PATTERN;
}

/**
 * @constructor
 * Initialize your data structure here.
 */
let TrieNode = function (key) {
    return {
        key: key, isWord: false
    };
};

let Trie = function () {
    this.root = TrieNode("root");
};

/**
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
    let tree = this.root;
    let i;
    let curr;
    for (i = 0; i < word.length; i++) {
        curr = word[i];
        if (!tree[curr]) {
            tree[curr] = new TrieNode(curr);
        }
        tree = tree[curr];
    }
    if (!tree[curr]) tree.isWord = true;
};

/**
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
    let tree = this.root;
    for (let i = 0; i < word.length; i++) {
        if (!tree[word[i]]) {
            return false;
        }
        tree = tree[word[i]];
        3
    }
    return tree.isWord;
};

/**
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
    let tree = this.root;
    for (let i = 0; i < prefix.length; i++) {
        if (!tree[prefix[i]]) {
            return false;
        }
        tree = tree[prefix[i]];
    }
    return true;
};

let trie = (function () {
    let pinyinList = ["a", "ai", "an", "ang", "ao", "ba", "bai", "ban", "bang", "bao",
        "bei", "ben", "beng", "bi", "bian", "biao", "bie", "bin", "bing", "bo",
        "bu", "ca", "cai", "can", "cang", "cao", "ce", "cen", "ceng", "cha",
        "chai", "chan", "chang", "chao", "che", "chen", "cheng", "chi", "chong",
        "chou", "chu", "chuai", "chuan", "chuang", "chui", "chun", "chuo",
        "ci", "cong", "cou", "cu", "cuan", "cui", "cun", "cuo", "da", "dai",
        "dan", "dang", "dao", "de", "dei", "deng", "di", "dian", "diao", "die",
        "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo", "e",
        "en", "eng", "fa", "fan", "fang", "fei", "fen", "feng", "fo", "fou",
        "fu", "ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "geng",
        "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun",
        "guo", "ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng",
        "hong", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun",
        "huo", "ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing",
        "jiong", "jiu", "ju", "juan", "jue", "jun", "ka", "kai", "kan", "kang",
        "kao", "ke", "kei", "ken", "keng", "kong", "kou", "ku", "kua", "kuai",
        "kuan", "kuang", "kui", "kun", "kuo", "la", "lai", "lan", "lang", "lao",
        "le", "lei", "len", "leng", "li", "lia", "lian", "liang", "liao", "lie",
        "lin", "ling", "liu", "long", "lou", "lu", "lu", "luan", "lue", "lun",
        "luo", "ma", "mai", "man", "mang", "mao", "mei", "men", "meng", "mi",
        "mian", "miao", "mie", "min", "ming", "miu", "mo", "mou", "mu", "na",
        "nai", "nan", "nang", "nao", "nei", "nen", "neng", "ni", "nian", "niang",
        "niao", "nie", "nin", "ning", "niu", "nong", "nou", "nu", "nu", "nuan",
        "nue", "nuo", "ou", "pa", "pai", "pan", "pang", "pao", "pei", "pen",
        "peng", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pou", "pu",
        "qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiong",
        "qiu", "qu", "quan", "que", "qun", "ran", "rang", "rao", "re", "ren",
        "reng", "ri", "rong", "rou", "ru", "ruan", "rui", "run", "ruo", "sa",
        "sai", "san", "sang", "sao", "se", "sen", "seng", "sha", "shai", "shan",
        "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu",
        "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo", "si", "song",
        "sou", "su", "suan", "sui", "sun", "suo", "ta", "tai", "tan", "tang",
        "tao", "te", "teng", "ti", "tian", "tiao", "tie", "ting", "tong", "tou",
        "tu", "tuan", "tui", "tun", "tuo", "wa", "wai", "wan", "wang", "wei",
        "wen", "weng", "wo", "wu", "xi", "xia", "xian", "xiang", "xiao", "xie",
        "xin", "xing", "xiong", "xiu", "xu", "xuan", "xue", "xun", "ya", "yan",
        "yang", "yao", "ye", "yi", "yin", "ying", "yong", "you", "yu", "yuan",
        "yue", "yun", "za", "zai", "zan", "zang", "zao", "ze", "zei", "zen",
        "zeng", "zha", "zhai", "zhan", "zhang", "zhao", "zuo", "zhei", "zhen",
        "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan",
        "zhuang", "zhui", "zhun", "zhuo", "zi", "zong", "zou", "zu", "zuan",
        "zui", "zun", "zuo"];
    let maxLength = 0;
    for (let i = 0; i < pinyinList.length; i += 1) {
        let item = pinyinList[i];
        if (typeof item === "string" && maxLength < item.length) {
            maxLength = pinyinList[i].length;
        }
    }
    let trieInternal = new Trie();
    for (let i = 0; i < pinyinList.length; i += 1) {
        trieInternal.insert(pinyinList[i]);
    }

    checkPinyinInternal = function (letters) {
        if (letters.length === 0) {
            return [];
        }
        let result = [];
        for (let i = maxLength; i > 0; i -= 1) {
            let searchWord = letters.substring(0, i);
            if (trie.search(searchWord)) {
                result.push(searchWord);
                return result.concat(
                    checkPinyinInternal(letters.substring(i, letters.length))
                );
            }
        }
        return result;
    };

    trieInternal.checkPinYin = function (letters) {
        /**
         * @type {string []} result
         */

        let result = checkPinyinInternal(letters);
        //let a = {};
        if (result.join("") === letters) {
            return {
                //   statusCode:502
                status: true, words: result
            };
            // a.statusCode = 502;
            //a.status = true;
            //a.words = result;
            // a.hint = "该密码是拼音";
            // return JSON.stringify(a)
        }
        return {
            status: false, words: []
        };
        // a.statusCode = 200;
        // a.hint = "无匹配模式"
        // a.status = false;
        //a.words = [];
        //return JSON.stringify(a)
    };
    return trieInternal;
})();

function checkPinYin(letters) {
    return trie.checkPinYin(letters);
}

function checkPhone(letters) {
    // $.ajax({
    //   method: "GET",    //   url: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=" + letters,    //   cache: false,    //   dataType: "jsonp",    //   async: false,    //   data: { tel: letters },    //   success: function(data) {
    //     if (data.catName) {
    //       alert("该密码为手机号");
    //     }
    //   }
    // });
    let reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
    if (reg.test(letters)) {
        return {
            status: true, res: letters
        };
    } else {
        return false;
    }
}

function checkWirePhone(letters) {
    let re = /^0\d{2,3}-?\d{7,8}$/;
    if (re.test(letters)) {
        return {
            status: true, res: letters
        };
    } else {
        return false;
    }
}

function checkBadSet(letters) {
    // noinspection JSAnnotator
    let BAD_SET = [
        111111, 123123, 111000, 112233, 100200, 111222, 121212, 520520, 110110, 123000, 101010, 111333, 110120, 102030,
        110119, 121314, 521125, 120120, 010203, 122333, 121121, 101101, 131211, 100100, 321123, 110112, 112211, 111112,
        520521, 110111
    ];
    let number = parseInt(letters);
    // check if it exists in the bad set
    return !!(number && BAD_SET.indexOf(number) !== -1);
}

function checkDate(letters) {
    function isDate(year, month, day) {
        let date = new Date(`${year}-${month}-${day}`);
        if (date instanceof Date) { //  && date != "Invalid Date"
            let realDay = date.getDate().toString();
            let realMonth = (date.getMonth() + 1).toString();
            if (realDay.length < 2) {
                realDay = "0" + realDay;
            }
            if (realMonth.length < 2) {
                realMonth = "0" + realMonth;
            }
            if (realDay === day && realMonth === month) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param {string} inputDate
     */
    function isYYYYMMDD(inputDate) {
        let year = inputDate.substring(0, 4);
        let month = inputDate.substring(4, 6);
        let day = inputDate.substring(6, 8);
        return isDate(year, month, day);
    }

    function isMMDDYYYY(inputDate) {
        let year = inputDate.substring(4, 8);
        let month = inputDate.substring(0, 2);
        let day = inputDate.substring(2, 4);
        return isDate(year, month, day);
    }

    function isDDMMYYYY(inputDate) {
        let year = inputDate.substring(4, 8);
        let month = inputDate.substring(2, 4);
        let day = inputDate.substring(0, 2);
        return isDate(year, month, day);
    }

    function isYYMMDD(inputDate) {
        let year = inputDate.substring(0, 2);
        let month = inputDate.substring(2, 4);
        let day = inputDate.substring(4, 6);
        return isDate(year, month, day);
    }

    function isMMDDYY(inputDate) {
        let year = inputDate.substring(4, 6);
        let month = inputDate.substring(0, 2);
        let day = inputDate.substring(2, 4);
        return isDate(year, month, day);
    }

    function isDDMMYY(inputDate) {
        let year = inputDate.substring(4, 6);
        let month = inputDate.substring(2, 4);
        let day = inputDate.substring(0, 2);
        return isDate(year, month, day);
    }

    if (letters.length === 8) {
        if (isYYYYMMDD(letters) || isMMDDYYYY(letters) || isDDMMYYYY(letters)) {
            return {
                status: true, res: letters
            };
        }
    }
    if (letters.length === 6) {
        if (isYYMMDD(letters) || isMMDDYY(letters) || isDDMMYY(letters)) {
            return {
                status: true, res: letters
            };
        }
    }

    return false;
}

function checkEmail(letters) {
    let regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    if (regex.test(letters)) {
        return {
            status: true, res: letters
        };
    } else {
        return false;
    }
}


function reportCharacter(msg, intent = "middle") {
    // let ele = document.getElementById('check_character');
    // ele.className = "check_inside_progress " + intent;
    // ele.innerText = msg;
}

function reportNumber(msg, intent = "middle") {
    // let ele = document.getElementById('check_number');
    // ele.className = "check_inside_progress " + intent;
    // ele.innerText = msg;
    // console.log("report number: " + ele.className);
}

function reportPattern(msg, intent = "middle") {
    // let ele = document.getElementById('check_pattern');
    // ele.className = "check_inside_progress " + intent;
    // ele.innerText = msg;
}

/**
 * 检查密码
 * @param {string} letters
 */
function checkPassword(letters) {
    if (!letters)
        return "";
    let res = "";
    let isNumber = parseInt(letters);
    let isN = isNaN(isNumber);
    let letter = letters.match(/[a-z|A-Z]+/gi);
    let digit = letters.match(/\d+/gi);
    let isDate = false;
    let isBad = false;
    let isPhone = false;
    let isWirePhone = false;

    //let chinese = letters.match(/[\u4e00-\u9fa5]+/gi);
    //console.log(letter);
    //console.log(digit);
    //console.log(isNumber);
    // console.log(letter.length);
    // console.log(digit.length);
    if (isNumber && letters.length === 11) {
        isPhone = checkPhone(letters);
    }
    if (isNumber) {
        isBad = checkBadSet(letters);
    }
    if (isNumber) {
        isDate = checkDate(letters);
    }
    if (isNumber) {
        isWirePhone = checkWirePhone(letters);
    }
    let isKeyBoardPattern = identifyKeyboardPatterns(letters);
    let isPinYin = checkPinYin(letters);
    let isEmail = checkEmail(letters);
    let a = {};

    // let fso = new ActiveXObject(Scripting.FileSystemObject);
    // let f = fso.createtextfile("C:\\Users\\admin\\Desktop\\pass\\csdn.txt",1,false);
    // while(!f.AtEndOfStream){
    //     s = f.Readline();
    // }
    // f.close();
    // let count = 0;

    if (isPinYin.status) {
        a.statusCode = 402;
        a.pattern = "包含拼音：" + isPinYin.words + "，共" + isPinYin.words.length + "个音节";
        console.log(a);

        res = JSON.stringify(a);
    } else if (isDate.status && !isBad) {
        a.statusCode = 302;
        a.pattern = "包含日期：" + isDate.res;

        res = JSON.stringify(a);
    } else if (isKeyBoardPattern.status) {
        a.statusCode = 201;
        a.pattern = "含有键盘模式：" + isKeyBoardPattern.res;
        // a.pattern = "含有键盘模式：" + isKeyBoardPattern.res + " " + isKeyBoardPattern.word;

        res = JSON.stringify(a);
    } else if (isEmail.status) {
        a.statusCode = 101;
        a.pattern = "含有邮箱地址：" + isEmail.res;

        res = JSON.stringify(a);
    } else if (isWirePhone.status) {
        a.statusCode = 304;
        a.pattern = "含有电话号码：" + isWirePhone.res;

        res = JSON.stringify(a);
    } else if (isPhone.status) {
        a.statusCode = 303;
        a.pattern = "含有手机号码：" + isPhone.res;

        res = JSON.stringify(a);
    } else if (!isN && !letter) {
        a.statusCode = 301;
        a.pattern = "仅含有数字";

        res = JSON.stringify(a);
    } else if (isN && !digit) {
        a.statusCode = 401;
        a.pattern = "仅含有代码";

        res = JSON.stringify(a);
    } else {
        let isPYin = [];
        let isDT = [];
        let isPE = [];
        let isWE = [];
        for (let i = 0; i < letter.length; i += 1) {
            isPYin[i] = checkPinYin(letter[i]);
            if (isPYin[i]) {
                for (let j = 0; j < digit.length; j += 1) {
                    isDT[j] = checkDate(digit[j]);
                    //console.log(isDT[i]);
                    isPE[j] = checkPhone(digit[j]);
                    //console.log(isPE[i]);
                    isWE[j] = checkWirePhone(digit[j]);
                    //console.log(isWE[i]);
                    if (isPE[j]) {
                        a.statusCode = 502;
                        a.pattern = "含有拼音：" + isPYin[i].words + "，共" + isPYin[i].words.length + "个音节";
                        a.pattern2 = "含有手机号码：" + isPE[j].res;

                        res = JSON.stringify(a);
                    } else if (isDT[j].status) {
                        a.statusCode = 503;
                        a.pattern = "含有拼音：" + isPYin[i].words + "，共" + isPYin[i].words.length + "个音节";
                        a.pattern2 = "含有日期：" + isDT[j].res;

                        res = JSON.stringify(a);
                    } else if (isWE[j]) {
                        a.statusCode = 504;
                        a.pattern = "含有拼音：" + isPYin[i].words + "，共" + isPYin[i].words.length + "个音节";
                        a.pattern2 = "含有电话号码：" + isWE[j].res;

                        res = JSON.stringify(a);
                    } else {
                        a.statusCode = 501;
                        a.pattern = "字母加数字模式";

                        res = JSON.stringify(a);
                    }
                }
            }
        }
    }
    return res;
}
