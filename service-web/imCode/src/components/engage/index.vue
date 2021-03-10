<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-09 10:44:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-14 10:03:07
 -->
<template>
  <div class="main">
    <div class="visitor-visitor">
      <div class="visitor-header">
        <div class="visitor-title">
          <span>顾客管理</span>
        </div>
        <!-- <div class="visitor-header-rightk">
          <a class="visitor-export-data">
            导出数据
          </a>
        </div>-->
      </div>
      <section class="visitors engage flex-table">
        <el-table :data="tableData" style="width: 100%;" height="100%">
          <el-table-column label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientName" label="姓名" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.clientName">{{scope.row.clientName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerGender" label="性别" width="100">
            <template slot-scope="scope">
              <span :title="scope.row.customerGender">{{scope.row.customerGender}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerAge" label="年龄" width="100">
            <template slot-scope="scope">
              <span :title="scope.row.customerAge">{{scope.row.customerAge}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerQq" label="QQ" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.customerQq">{{scope.row.customerQq}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerPhone" label="电话" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.customerPhone">{{scope.row.customerPhone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerEmail" label="邮箱" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.customerEmail">{{scope.row.customerEmail}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerWx" label="微信" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.customerWx">{{scope.row.customerWx}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerAddress" label="地址" width="200">
            <template slot-scope="scope">
              <span :title="scope.row.customerAddress">{{scope.row.customerAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerRemark" label="备注" width="200">
            <template slot-scope="scope">
              <span :title="scope.row.customerRemark">{{scope.row.customerRemark}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientBrowser" label="浏览器" width="100">
            <template slot-scope="scope">
              <span :title="scope.row.clientBrowser">{{scope.row.clientBrowser}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientPlatform" label="操作系统" width="100">
            <template slot-scope="scope">
              <span :title="scope.row.clientPlatform">{{scope.row.clientPlatform}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientCountry" label="国家" width="100">
            <template slot-scope="scope">
              <span :title="scope.row.clientCountry">{{scope.row.clientCountry}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientProvince" label="省份" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.clientProvince">{{scope.row.clientProvince}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="clientCity" label="城市" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.clientCity">{{scope.row.clientCity}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerLinkman" label="联系人" width="150">
            <template slot-scope="scope">
              <span :title="scope.row.customerLinkman">{{scope.row.customerLinkman}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerTag" label="标签" width="200">
            <template slot-scope="scope">
              <span class="tag" :title="formatter(scope.row)">{{formatter(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdate" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="updatedate" label="更新时间" width="200"></el-table-column>
        </el-table>
        <el-pagination
          class="pagerClass"
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="prev, pager, next, jumper"
          :page-size="pageSize"
          :total="total"
        ></el-pagination>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allLables: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    getAllLables() {
      this.$axios.get(this.$httpServer.getLabele).then(res => {
        if (res.data.data) {
          res.data.data.map((v, i) => {
            this.allLables[v.id] = v.labelName;
          });
        }
        this.loading();
      });
    },
    /**
     * 数据加载
     */
    loading() {
      console.log(this.allLables);
      let that = this;
      this.$axios
        .get(
          this.$httpServer.getOnlineClientInfoList +
            "?current=" +
            this.currentPage
        )
        .then(res => {
          that.tableData = [];
          that.total = res.data.data.total;
          res.data.data.records.map((v, i) => {
            let newData = {
              clientName: v.clientName == null ? "" : v.clientName,
              customerGender: v.customerGender == null ? "" : v.customerGender,
              customerAge: v.customerAge == null ? "" : v.customerAge,
              customerQq: v.customerQq == null ? "" : v.customerQq,
              customerPhone: v.customerPhone == null ? "" : v.customerPhone,
              customerEmail: v.customerEmail == null ? "" : v.customerEmail,
              customerWx: v.customerWx == null ? "" : v.customerWx,
              customerAddress:
                v.customerAddress == null ? "" : v.customerAddress,
              customerRemark: v.customerRemark == null ? "" : v.customerRemark,
              clientBrowser: v.clientBrowser == null ? "" : v.clientBrowser,
              clientPlatform: v.clientPlatform == null ? "" : v.clientPlatform,
              clientCountry: v.clientCountry == null ? "中国" : v.clientCountry,
              clientProvince: v.clientProvince == null ? "" : v.clientProvince,
              clientCity: v.clientCity == null ? "" : v.clientCity,
              customerLinkman:
                v.customerLinkman == null ? "" : v.customerLinkman,
              customerTag: v.customerTag == null ? "" : v.customerTag,
              createdate: v.createdate == null ? "" : v.createdate,
              updatedate: v.updatedate == null ? "" : v.updatedate
            };
            that.tableData.push(newData);
          });
        });
    },
    formatter(row) {
      let arr = row.customerTag.split(",");
      let newArr = [];
      arr.forEach(obj => {
        if (this.allLables[obj]) {
          newArr.push(this.allLables[obj]);
        }
      });
      let str = newArr.join("|");
      return str;
    },
    handleCurrentChange() {
      this.loading();
    }
  },
  mounted() {
    this.getAllLables();
  }
};
</script>
<style scoped>
.main {
  position: relative;
  height: 100%;
  min-height: 100%;
  min-width: 1200px;
  margin-left: 70px;
  background-color: #f2f3f5;
}
.main .visitor-visitor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.main .visitor-visitor .visitor-header {
  display: flex;
  /* height: 60px; */
  padding: 15px 30px;
  background-color: #fff;
  border-bottom: 1px solid #e0e1e3;
  justify-content: space-between;
}
.visitor-title {
  width: 150px;
  font-size: 16px;
  color: #323c42;
  line-height: 30px;
}
.visitor-title span {
  float: left;
}
.visitor-title .visitor-divider {
  font-size: 13px;
  color: #f0f0f0;
  display: inline-block;
  margin: 0 5px;
}
.visitor-title .visitor-info {
  font-size: 13px;
  color: #767d85;
}
.visitor-export-data {
  display: inline-block;
  margin-left: 20px;
  line-height: 30px;
  font-size: 13px;
  color: #009de7;
  text-decoration: none;
}
.visitors {
  color: #c7cac9;
  display: block;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: #fff;
  margin: 20px;
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  padding: 15px;
}
.visitors .tag {
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.visitor-info {
  position: relative;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 13px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  flex: 10;
}
.visitor-info .el-icon-time {
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  margin: auto 0;
  border-radius: 16px;
  font-size: 18px;
}
.pagerClass {
  text-align: right;
  margin-top: 20px;
}
.engage{
    overflow-y: auto;
}
</style>
