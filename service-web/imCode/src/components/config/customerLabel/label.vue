<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-14 11:09:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-09 10:25:43
 -->

<template>
  <!-- 顾客标签 -->
  <div class="main">
    <div class="main-conter">
      <div class="main-block">
        <div class="main-blockInner">
          <h3>标签管理</h3>
          <p class="main-sub">通过标签，客服可对顾客进行分类，以方便后续的整理和分析。</p>
          <div>
            <button class="main-btn" @click="addOrAddLabel">添加新标签</button>
          </div>
        </div>
      </div>
      <div class="main-block" v-if="tableData.length > 0">
        <div class="main-table">
            <el-table :data="tableData" row-key="id">
              <el-table-column label="标签" width="250">
                <template slot-scope="scope">
                  <span
                    class="laberClass"
                    :title="scope.row.name"
                    :style="{backgroundColor:scope.row.bgColor}"
                  >{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="使用次数" width="120"></el-table-column>
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
    <addLable v-if="centerDialogVisible" :labelData="labelData" :type="'customer'"></addLable>
  </div>
</template>
<script>
import addLable from "./add";
import Sortable from 'sortablejs';
import { changeCustomerLabel } from "@/common/api";
export default {
  components: {
    addLable
  },
  data() {
    return {
      centerDialogVisible: false, //是否显示新增弹框
      colorLable: [
        "#ffb652",
        "#b59177",
        "#6fd048",
        "#9264cd",
        "#fc7cb3",
        "#ff8947",
        "#00ce7d",
        "#4ca0ff",
        "#ff5c5e",
        "#707070"
      ], //标签颜色
      tableData: [],
      labelData: {
        type: "",
        active: -1,
        lableText: "",
        id: -1
      },
      dragList: []
    };
  },
  methods: {
    /**
     * 查询所有顾客标签
     */
    getLabele() {
      let that = this;
      this.$axios.get(this.$httpServer.getLabele).then(res => {
        that.tableData = [];
        res.data.data.map((v, i) => {
          let newData = {
            index: parseInt(i) + 1,
            name: v.labelName, //标签名
            id: v.id, // 标签ID
            num: v.labelUseCount == null ? 0 : v.labelUseCount, // 标签使用次数
            bgColor: that.colorLable[parseInt(v.labelStype)], //标签颜色
            bgColorIndex: v.labelStype // 标签颜色下标
          };
		  this.tableData.push(newData);
		  setTimeout(() => {
			  that.rowDrop();
		  },300)
        });
      });
    },
    /**
     * 新增、关闭顾客标签
     */
    addOrAddLabel() {
      this.labelData = {
        type: "add",
        id: -1,
        active: 0,
        lableText: ""
      };
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    /**
     * 编辑
     */
    handleEdit(index, row) {
      this.labelData = {
        type: "upd",
        id: row.id,
        active: row.bgColorIndex,
        lableText: row.name
      };
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    /**
     * 删除
     */
    handleDelete(index, row) {
      let that = this;
      that
        .$confirm(
          "删除后，系统将从所有对话中取消本标签，确认删除标签？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning"
          }
        )
        .then(() => {
          that.$axios
            .delete(that.$httpServer.delLabel + "/" + row.id)
            .then(res => {
              that.getLabele();
              that.$message1({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          that.$message1({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rowDrop () {
		// 此时找到的元素是要拖拽元素的父容器
		const tbody = document.querySelector('.el-table__body-wrapper tbody');
		const _this = this;
		Sortable.create(tbody, {
		//  指定父元素下可被拖拽的子元素
			draggable: ".el-table__row",
			onEnd ({ newIndex, oldIndex }) {
				const currRow = _this.tableData.splice(oldIndex, 1)[0];
				_this.tableData.splice(newIndex, 0, currRow);
				let obj = {
					position: newIndex
				}
				changeCustomerLabel(currRow.id,obj).then( res => {

				})
			}
		});
	},
  },
  mounted() {
	this.getLabele();
  }
};
</script>
<style scoped>
.main .main-conter {
  width: 680px;
}
.main .main-conter .main-block {
  height: 100%;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(52, 63, 75, 0.1);
}
.main .main-conter .main-block .main-table {
  text-align: left;
  padding: 20px 30px;
  display: block;
}
.main .main-conter .main-block .main-table .laberClass {
  max-width: 120px;
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  margin-right: 5px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  text-align: left;
  white-space: nowrap;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}
.main .main-conter .main-block .main-blockInner {
  padding: 20px 30px;
  display: block;
}
.main .main-conter .main-block .main-blockInner h3 {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  font-size: 14px;
  color: #323c42;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 13px;
}
.main .main-conter .main-block .main-blockInner .main-sub {
  font-size: 14px;
  color: #969faa;
  margin-top: 0;
  margin-bottom: 15px;
}
.main .main-conter .main-block .main-blockInner .main-btn {
  display: inline-block;
  position: relative;
  padding: 7px 21px;
  margin-bottom: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.385;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #009de7;
}
</style>
