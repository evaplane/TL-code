<template>
<!-- 团队客服名单模块 -->
<div class="nameCard">
    <header class="header">
        <p>团队客服名单</p>
        <p>开启无消息访客过滤时团队客服名片将会展示给访客。</p>
    </header>
    <div class="main">
        <div class="portrait">
            <div class="userPhoto">
                <img src="../../../assets/img/default-avatar.jpg" alt="">
            </div>
            <div>
                <input ref="portraitInt" type="file" class="hide" accept="image/png, image/jpeg, image/gif">
                <span @click="upFile">换一个新头像</span>
                <p>你可以选择 jpg, gif, png 格式的图片，最大 5Mb</p>
            </div>
        </div>
        <div>
            <label>名称</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>自定义签名</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>座机</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>手机</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>邮箱</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>QQ</label>
            <el-input v-model="input"></el-input>
        </div>
        <div>
            <label>微信</label>
            <el-input v-model="input"></el-input>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            input: ''
        }
    },
    methods: {
        upFile() {
            this.$refs.portraitInt.click()
        }
    }
}
</script>


<style lang="less" scoped>
.nameCard {
    width: 710px;
    font-size: 14px;
    line-height: 38px;
    background-color: #fff;
    padding: 20px 30px;
    .header {
        border-bottom: 1px solid #f5f5f5;
        p:nth-child(2) {
            color: #969faa;
        }
    }
    .main {
        margin-top: 20px;
        div.portrait {
            display: flex;
            flex-flow: row nowrap;
            .userPhoto {
                width: 15%;
                min-height: 30px;
                overflow: hidden;
                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                }
            }
            span {
                color: #009de7;
                cursor: pointer;
            }
            p {
                color: #969faa;
            }
            .hide {
                display: none;
                visibility: hidden;
            }
        }
    }
}
</style>
