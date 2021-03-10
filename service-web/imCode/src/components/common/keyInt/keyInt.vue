<template>
    <div id="keyInt" ref="keyInt" @click="intBlur">
        <div>
            <span v-for="(tmp,i) in keys" :key="i">{{keyCodes[tmp]}}</span>
            <input type="password" ref="int" @keydown="getKeyVal" v-model="value" />
        </div>
        <p>*Ctrl, Alt, Shift 键 ( Mac 系统 ⌘ ⌥ ⇧ ) 必须包含一个</p>
    </div>
</template>

<script>
export default {
    props: {
        // 获得组合键的keyCodes
        keyCombination: {
            type: String
        }
    },
    data() {
        const keyCodes = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "Pause",
            20: "Caps Lock",
            27: "Escape",
            32: "Space",
            33: "Page Up",
            34: "Page Down",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            42: "Print Screen",
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            91: "Windows",
            93: "Right Click",
            96: "Numpad 0",
            97: "Numpad 1",
            98: "Numpad 2",
            99: "Numpad 3",
            100: "Numpad 4",
            101: "Numpad 5",
            102: "Numpad 6",
            103: "Numpad 7",
            104: "Numpad 8",
            105: "Numpad 9",
            106: "Numpad *",
            107: "Numpad +",
            109: "Numpad -",
            110: "Numpad .",
            111: "Numpad /",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Num Lock",
            145: "Scroll Lock",
            182: "My Computer",
            183: "My Calculator",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        };
        return {
            keyCodes, // keyCodes全部集合
            value: "", // 绑定input的值，保证input的值永远为空
            key: "", // 当前按下的keyCode
            keyObj: {} // 当前按下的key的对象
        };
    },
    methods: {
        /**
         * 点击组件区域时input自动获得焦点
         */
        intBlur() {
            this.$refs.int.select();
        },
        /**
         * 监听input的keydown事件
         */
        getKeyVal(e) {
            // 阻止当前浏览器的按键事件，比如ctrl+1会切换页面
            e.returnValue = false;
            this.value = "";
            this.keyObj = e;
            this.key = e.keyCode;
        }
    },
    watch: {
        /**
         * 监听当前按下的keyCode，保证只有keyCode改变，并且在组合键要求的范围内时才改变状态
         */
        key(val, oldVal) {
            if (val !== oldVal) {
                let { ctrlKey, shiftKey, altKey, keyCode } = this.keyObj;
                if (
                    (ctrlKey || shiftKey || altKey) &&
                    (keyCode >= 48 && keyCode <= 90)
                ) {
                    let arr = Array(0);
                    ctrlKey && arr.push(17);
                    shiftKey && arr.push(16);
                    altKey && arr.push(18);
                    arr.push(keyCode);
                    // props是单向数据流，要保证params是从父组件流向子组建
                    this.$emit("keyDown", arr.join(','));
                } else if (keyCode === 8) {
                    this.$emit("keyDown", '');
                }
            }
        }
    },
    computed: {
        keys() {
            if (this.keyCombination) {
                return this.keyCombination.split(",");
            } else {
                return [];
            }
        }
    }
};
</script>

<style lang="less" scoped>
#keyInt {
    width: 100%;
    > p {
        color: #969faa;
    }
    > div {
        width: 100%;
        // height: 32px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        // margin-bottom: 22px;
        > span {
            font-size: 13px;
            display: inline-block;
            color: #fff;
            min-width: 20px;
            min-height: 20px;
            margin-left: 10px;
            padding: 0 3px;
            vertical-align: middle;
            line-height: 2;
            text-align: center;
            background: rgb(52, 63, 75);
            border-radius: 4px;
            box-shadow: rgba(52, 63, 75, 0.1) 0px 2px 4px 0px,
                rgb(233, 236, 238) 0px -2px 0px 0px inset,
                rgb(242, 244, 245) 0px -1px 0px 0px inset;
        }
        input {
            width: 1px;
            background: none;
            outline: none;
            border: none;
            &:focus {
                border: none;
            }
        }
    }
}
</style>
