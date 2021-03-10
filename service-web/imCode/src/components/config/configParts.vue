<template>
    <MenuCard :icon="data.icon" :title="data.name">
        <div class="containLayout">
            <div v-for="(item, i) in data.children" :key="i">
                <!-- 有些菜单还没做，但是后台已经生成了 -->
                <MenuItem :info="item.name" :imgUrl="item.icon" :imgPosition="item.component" :path="item.path" :arr="item" v-if="item.path"></MenuItem>
            </div>
        </div>
    </MenuCard>
</template>

<script>
// 布局组件
import MenuCard from "@/components/common/menuCard"
// 菜单组件
import MenuItem from "@/components/common/menuItem"

export default {
    components: {
        MenuCard,
        MenuItem
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>

.containLayout {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    >div {
        margin-right: 10px;
    }
}
</style>
