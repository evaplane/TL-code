<template>
  <div class="headerhome">
    <div class="head-body">
      <div style="text-align:right;">
        <div class="title" @click="$router.push('/')"><img style="height:100%;" src="../../assets/5a80b63d127c8a834f397efaf398ef60.jpg" alt=""></div>
        <div class="usercontrol">
          <div v-if="$store.state.userId" @click="$router.push('/user')" class="headImg" v-lazy-container="{ selector: 'img' }">
            <img :data-src="$store.state.userData.userPic" :data-error="avatarurl" :key="$store.state.userData.userPic"> 
          </div>
          <el-image
            class="quit"
            :src="url"
            fit="fill" @click="quit"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "top",
  data() {
    return {
      userData:null,
      avatarurl:require("../../assets/07.jpg"),
      url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAJ1BMVEVHcEwzMzMxMTEpKSkuLi4yMjIgICAyMjIyMjIyMjIyMjIxMTEzMzPESQfvAAAADHRSTlMA8iwOHGYE2sh+r03kX5gqAAAA40lEQVQ4y42UWQ4EIQhEURREvf95B+0lk7QK9dVJP9ksAcBcwkG1IQxhDf0smWDuphopx73XmLaKRf+PeMpHgq1I8/HDwUFervk4Uq544iEH8XAaEiwuSnu/DxzWzplcXA/N5qDpZYVs1wdxgmj3G9+IxlyGD8JwljW/B/xweeVb+XDIK6vyhyNZYCEv6iP8V9rVt2qDrH5nNHt+aYxZ7PstrvudfnmMdeZ0ILavSP1MDg6IyOP7K3m5cjveuev9qn28+4Ad++rdQ2P/4T5cqvf+E3ufzn7HgaPCnS4Jn7ByPd8fcg8VUPjK9nQAAAAASUVORK5CYII=',
      input:'',
      form: {
        name: '',
        passwrd: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible:false
    };
  },
  created() {
    !this.$store.state.userId&&this.$router.push("/install?name=login");
  },
  mounted(){
  },
  watch:{
  $route(to,from){
    this.updateUserInfo();
  }
},
  methods: {
    ...mapActions([
        'removeUser','updateUserInfo'
    ]),
    quit(){
      this.removeUser();
      this.$router.push('install?name=login');
    },
    login(){
      alert("跳转主页");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.headerhome {
  background-color:#fff;
  height:80px;
  position: fixed;
  top:0;
  width:100%;
  z-index: 1000;
  .head-body{
    margin:0 auto;
    height:100%;
    .title{
      float:left;
      padding-top:10px;
      margin-left: -26px;
      cursor: pointer;
      height:60px;
      line-height:80px;
    }
    .usercontrol{
      position:relative;float:right;height:100%;height:80px;
      .headImg{
        width:40px;height:40px;border-radius:50%;cursor: pointer;
        margin-top:20px;margin-right:30px;
        display: inline-block;
        overflow: hidden;
        img{
          width:100%;
          height:100%;
          object-fit: cover;
        }
      }
      .quit{
        width:26px;height:26px;top:-6px;cursor: pointer;margin-top: 28px;
      }
    }
  }
}
@media (min-width: 0px){
  .head-body{
    max-width: 700px;
  }
} /*>=1024的设备  700px*/
@media (min-width: 1100px) {
  .head-body{
    max-width: 900px;
  }
} /*>=1100的设备  900px*/
@media (min-width: 1280px) {
  .head-body{
    max-width: 1200px;
  }
} /*>=1280的设备  1200px*/
</style>
