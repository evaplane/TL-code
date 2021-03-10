<template>
    <!-- 黑名单 -->
    <div class="balcklist">
        <!-- header -->
        <div class="header">
            <h1>访客黑名单</h1>
            <p>统一查看和管理所有已在黑名单的访客</p>
        </div>
        <!-- 内容 -->
        <div class="main">
            <!-- 黑名单筛选表单 -->
            <el-form label-width="100px" :model="form" @keyup.enter.native="getBlacklist(1, form)">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-button
                            type="danger"
                            @click="delRow(delList)"
                            :disabled="!delList.length"
                        >批量删除</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作人">
                            <el-input v-model.trim="form.updatedBy" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否已过期">
                            <el-dropdown @command="listChange">
                                <el-input :value="dropdownList[form.expired].name"></el-input>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="(tmp, i) in dropdownList"
                                        :key="i"
                                        :command="i"
                                    >{{dropdownList[i].name}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="danger" @click="getBlacklist(1, form)">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 黑名单展示的表格 -->
            <el-table :data="tableData" style="width: 100%" @selection-change="change">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="attribution" label="客户信息"></el-table-column>
                <el-table-column prop="updateTime" label="拉黑时间"></el-table-column>
                <el-table-column prop="maskingExpireDate" label="屏蔽到期时间"></el-table-column>
                <el-table-column prop="createdBy" label="操作人"></el-table-column>
                <el-table-column prop="maskingId" label="屏蔽时长" width="100">
                    <template slot-scope="scope">
                        <span
                            v-if="edit !== scope.$index"
                            style="display: inline-block;width:50px;"
                            @click="handleEdit(scope.$index, scope.row, scope)"
                        >{{ type[scope.row.maskingId] }}</span>
                        <span v-if="edit === scope.$index" class="cell-edit-input">
                            <el-dropdown :hide-on-click="false" @command="onChange">
                                <span class="el-dropdown-link">
                                    {{type[scope.row.maskingId]}}
                                    <i
                                        class="el-icon-arrow-down el-icon--right"
                                    ></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="(tmp,i) in type"
                                        :key="i"
                                        :command="i"
                                    >{{tmp}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="expired" label="已过期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.expired ? '是': '否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delRow(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                class="pagerClass"
                background
                layout="prev, pager, next, jumper"
                :total="total"
                @current-change="getBlacklist"
            ></el-pagination>
            <br style="”clear:both;”" />
        </div>
    </div>
</template>

<script>
import { getBlacklist, shield, updateBlacklist } from "@/common/api";

export default {
    components: {},
    data() {
        return {
            edit: -1, // 记录表格中激活状态的row index
            size: 10,
            total: 0,
            form: {
                // 筛选的数据
                updatedBy: "",
                expired: 2
            },
            dropdownList: [
                // 筛选表单的下拉表单
                {
                    value: 0,
                    name: "否"
                },
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 2,
                    name: "全部"
                }
            ],
            tableData: [], // 表格数据
            delList: [], // 勾选的集合（用于删除）
            curpage: "", // 纪录当前选中的分页页码
            type: {
                // 黑名单拉黑时间的数据集合，index和后台对应，注意：是map对象不是object对象
                1: "半小时",
                2: "1小时",
                3: "2小时",
                4: "6小时",
                5: "24小时",
                6: "7天",
                7: "长期"
            }
        };
    },
    methods: {
        listChange(i) {
            // 下拉回调
            this.form.expired = i;
        },
        /**
         * 获取黑名单数据
         * 如果有筛选则带上筛选的数据，后台有点low，非要这么写
         * 是否过期是由前台计算展示的，所以过期删选由前台独立完成
         */
        getBlacklist(current, form) {
            this.curpage = current;
            let params = {
                current,
                size: this.size
            };
            if (form) {
                params.updatedBy = form.updatedBy;
            }
            getBlacklist(params).then(res => {
                if (res.data.data) {
                    let data = res.data.data;
                    this.total = data.total;
                    if (data.records) {
                        let records = data.records;
                        records.forEach(temp => {
                            temp.expired = 0;
                            if (temp.maskingExpireDate) {
                                let now = new Date();
                                let time = new Date(temp.maskingExpireDate);
                                if (time < now) {
                                    temp.expired = 1;
                                }
                            }
                        });
                        if (form && form.expired !== 2) {
                            this.tableData = records.filter((temp, i) => {
                                return (
                                    parseInt(temp.expired) ===
                                    parseInt(form.expired)
                                );
                            });
                        } else {
                            this.tableData = records;
                        }
                    }
                }
            });
        },
        /**
         * 删除行
         */
        delRow(data) {
            let ids = data;
            if (typeof data === "object") {
                ids = data.join(",");
            }
            shield(ids).then(res => {
                if (res.data.code === 0) {
                    this.getBlacklist(this.curpage);
                    this.delList.length = 0;
                    this.$message1({
                        message: "操作成功",
                        type: "success"
                    });
                }
            });
        },
        /**
         * 编辑表格时下拉菜单的回调
         */
        change(selection) {
            let arr = [];
            selection.forEach(ele => {
                arr.push(ele.id);
            });
            this.delList = arr;
        },
        handleEdit(index, row) {
            //遍历数组改变editeFlag
            this.edit = index;
        },
        /**
         * 编辑表格后的保存刷新
         */
        onChange(index) {
            let obj = this.tableData[this.edit];
            obj.maskingId = index;
            updateBlacklist(obj).then(res => {
                if (res.data.code === 0) {
                    this.getBlacklist(this.curpage);
                    // this.tableData.slice(this.edit, 1, obj);
                    this.$message1({
                        message: "操作成功",
                        type: "success"
                    });
                    this.edit = -1;
                }
            });
        }
    },
    created() {
        this.getBlacklist(1);
    }
};
</script>

<style lang="less" scoped>
.balcklist {
    width: 710px;
    background: #fff;
    line-height: 28px;
    padding: 20px 30px;
    .header {
        font-size: 14px;
        margin-bottom: 20px;
        p {
            color: #969faa;
        }
    }
    .main {
        position: relative;
        .pagerClass {
            position: absolute;
            right: 0;
        }
    }
}
.cell-icon {
    cursor: pointer;
    color: #009de7;
}
</style>
