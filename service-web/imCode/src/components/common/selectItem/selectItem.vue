<template>
    <!-- 类似于按钮的控件，本身是为了封装项目需要使用的插件 -->
    <ul>
        <li :class="['selectItem', checkedIndex === i?'checked':'']" v-for="(tmp, i) in data" :key="i" @click="handleClick(i, tmp)">
            <!-- 为客服与分组——新建分组功能做的小控件 -->
            {{tmp[name] || tmp}}
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        // 需要循环展示的数据
        data: {
            type: Array
        },
        name: {
            type: String,
            default: 'name'
        }
    },
    data() {
        return {
            // 该控价是否被选定（激活）
            checkedIndex: {
                type: Boolean,
                default: false
            }
        };
    },
    // API
    methods: {
        handleClick(i, tmp) {
            this.checkedIndex = i
            this.$emit('onClick', i, tmp)
        }
    }
};
</script>


<style lang="less" scoped>
.selectItem {
    font-size: 13px;
    color: #767d85;
    width: 160px;
    height: 32px;
    padding: 5px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 3px;
    line-height: 26px;
    margin: 3px 0;
    cursor: pointer;
    .selItemIcon {
        float: right;
        margin-left: 5px;
        display: none;
    }
    &:hover {
        background: #f4f5f7;
        .selItemIcon {
            color: #009de7;
            display: inline;
        }
    }
    &.checked {
        background: #f4f5f7;
    }
    > span {
        margin-left: 5px;
    }
}
</style>
