<template>
<!-- 设置菜单界面框架组件 -->
    <div class="su-menuCard">
        <div class="su-header">
            <i :class="['ld-icon', icon]"></i><span>{{title}}</span>
        </div>
        <div class="su-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 框架上的图标，支持所有引入的图标库
        icon: {
            type: String,
            default: ''
        },
        // 框架上的标题
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        updateType() {
            return Number(this.type)
        }
    }
}
</script>


<style lang="less" scoped>
.su-menuCard {
    padding: 20px;
    >.su-header {
        color: #969faa;
        i {
            font-size: 20px;
            margin-right: 12px;
            vertical-align: -5px;
        }
        span {
            font-size: 14px;
        }
    }
    >.su-container {
        padding: 10px 30px 0;
    }
}
</style>
