<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      class="pagination"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "../../util/scroll-to";

export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30];
      }
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      }
    }
  },
  methods: {
    // 选择分页下拉时
    handleSizeChange(val) {
      // console.log(val);
      this.$emit("pagination", { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    }
  }
};
</script>
<style scoped>
.pagination-container {
  background: #fff;
  padding: 9px 10px;
  /* position: relative; */
  /* margin: 0 auto; */
}
.pagination-container.hidden {
  display: none;
}
.el-pagination >>> .el-input__inner {
  margin-top: -5px;
  /* position:absolute; */
  /* float: right; */
}

.pagination {
  /* text-align: right; */
}

.el-pager li {
  font-weight: 100 !important;
}
.el-pager li.number,
.el-pagination .btn-next,
.btn-prev,
.btn-quicknext,
.btn-quickprev {
  border: 1px solid #e3e3e3 !important;
  color: #999 !important;
  background-color: transparent !important;
}
.el-pager li.active + li {
  border: 1px solid #e3e3e3 !important;
}
.el-pager li.number.active {
  color: #fff !important;
  background-color: #1890ff !important;
}

.el-tooltip__popper {
  max-width: 300px;
}
</style>
