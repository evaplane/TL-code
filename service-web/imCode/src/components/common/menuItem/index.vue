<template>
    <router-link tag="div" :to="path" class="su-menuItem" :style="{'width': size + 'px', 'height': size + 'px'}">
        <div class="su-imgIcon" :style="{'width': imgSize + 'px', 'height': imgSize + 'px', backgroundImage:'url(' + imgUrl + ')', backgroundPosition: position[0] + 'px ' + position[1] + 'px'}"></div>
        <div class="su-name">{{info}}</div>
    </router-link>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            required: true
        },
        size: {
            type: String|Number,
            default: '100'
        },
        imgSize: {
            type: String|Number,
            default: '48'
        },
        info: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            required: true
        },
        imgPosition: {
            type: String,
            required: true
        }
    },
    computed: {
        position() {
            if(this.imgPosition){
                return this.imgPosition.split(',')
            }else{
                return [0,0];
            }
        }
    }
}
</script>


<style lang="less" scoped>
.su-menuItem {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    .su-imgIcon {
        border-radius: 50%;
        background-repeat: no-repeat;
        margin: 0 auto;
    }
    .su-name {
        color: #5a6978;
    }
}
</style>
