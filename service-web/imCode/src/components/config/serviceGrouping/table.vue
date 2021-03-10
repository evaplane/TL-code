<template>
    <div>
        <el-table :data="data.records" style="width: 100%" max-height="600">
            <el-table-column fixed prop="userId" label="工号"></el-table-column>
            <el-table-column prop="actualName" label="真实姓名"></el-table-column>
            <el-table-column prop="username" label="账号">
                <template slot-scope="scope">
                    <router-link tag="a" :to="{path:'/config/editagent',query: {id: scope.row.userId}}" class="link" v-if="Permission('sys_user_edit')">{{ scope.row.username }}</router-link>
                    <span v-else>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="坐席组ID"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="serviceCeiling" label="客服上限"></el-table-column>
        </el-table>
        <el-pagination
            class="pagerClass"
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            :current-page="data.current"
            :page-size="data.size"
            :total="data.total"
        ></el-pagination>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object
        }
    },
    methods: {
        handleCurrentChange(curPage) {
            this.$emit("pagerChange", curPage);
        }
    }
};
</script>


<style lang="less" scoped>
.pagerClass {
    float: right;
}
.link {
    color: #009de7;
    text-decoration:underline;
}
</style>
