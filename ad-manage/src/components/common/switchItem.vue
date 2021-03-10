<template>
  <div>
    <el-switch
        :value="value"
        @change="changeStatus"
        active-color="#13ce66" :disabled="isDisabled"
        inactive-color="#ff4949">
    </el-switch>
  </div>
</template>

<script>
  /**
   * val: 当前状态
   * id: 标识这个状态的id 要传数据的 值
   * */
  export default {
    name:'switchItem',
    props:{
      val:{
        type:Boolean
      },
      id:{},
      reqUrl:{
        type:String
      },
      disabled:{
        type:Boolean,
        default:false
      },
    },
    data() {
      return {
        value:false,
        setStatusHttp: null,
        isDisabled: false,
      }
    },
    watch:{
      val(val){
        this.value = val;
      }
    },
    created() {
      let self = this;
      self.value = self.val;
      self.isDisabled = self.disabled;
    },
    methods:{
      changeStatus(){
        let self = this;
        self.isDisabled=true
        self.setStatus()
      },
      setStatus(){
        let status = this.value?-100:100;
        if(this.reqUrl.indexOf('sys')!=-1){
          status = this.value?0:1;
        }
        let data = {
          id:this.id,
          status:status
        }
        if(this.reqUrl.indexOf('sys')!=-1 || this.reqUrl.indexOf('user-web/user/updateStatus')!=-1){
          data = {
            userId:this.id,
            status:status
          }
        }
        this.$post(this.reqUrl,data).then(res => {
            if (res.code == "000000") {
            this.$message({
                type: "success",
                message: res.message
            });
            this.value = !this.value
            this.$emit("result");
            }else{
                this.$message({
                    type: "warning",
                    message: res.message
                });
            };
            this.isDisabled=false;
        })
        .catch((e) => {
            this.$message({
            type: "info",
            message: e
            });
        });
      },
      setStatus1(){
        let status = this.value?1:0;
        this.$post(this.reqUrl,{
            userId:this.id,
            status:status
        }).then(res => {
            if (res.code == "000000") {
            this.$message({
                type: "success",
                message: res.message
            });
            this.value = !this.value
            this.$emit("result");
            }else{
                this.$message({
                    type: "warning",
                    message: res.message
                });
            };
            this.isDisabled=false;
        })
        .catch((e) => {
            this.$message({
            type: "info",
            message: e
            });
        });
      },
    }
  }
</script>