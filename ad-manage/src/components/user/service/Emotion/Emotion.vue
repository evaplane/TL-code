<template>
  <div class="ly-emotion" ref="emotion">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ly-emotion',
  mounted () {
    let name = this.$refs.emotion.innerHTML;
    const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', '不', '好', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
    let index = list.indexOf(name)
    let imgHTML = `<a href="javascript:void(0)" class="qqface qqface${index}"></a>`
    this.$nextTick(() => {
       this.$refs.emotion.innerHTML= imgHTML
    })
  },
}
</script>
<style>
.ly-emotion {
  display: inline-block
}
.ly-static-emotion {
  width: 24px;
  height: 24px;
  display: inline-block;
}
.qqface{
  background-image: url("../../../../assets/images/wxface.png");
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.qqface0 {
   background-position: -4px -4px;
}

.qqface1 {
    background-position: -33px -4px;
}

.qqface2 {
    background-position: -62px -4px;
}

.qqface3 {
    background-position: -91px -4px
}

.qqface4 {
    background-position: -120px -4px
}

.qqface5 {
    background-position: -149px -4px
}

.qqface6 {
    background-position: -178px -4px
}

.qqface7 {
    background-position: -207px -4px
}

.qqface8 {
    background-position: -236px -4px
}

.qqface9 {
    background-position: -265px -4px
}

.qqface10 {
    background-position: -294px -4px
}

.qqface11 {
    background-position: -323px -3px
}

.qqface12 {
    background-position: -352px -4px
}

.qqface13 {
    background-position: -381px -4px
}

.qqface14 {
    background-position: -410px -4px
}

.qqface15 {
    background-position: -4px -33px
}

.qqface16 {
    background-position: -33px -33px
}

.qqface17 {
    background-position: -62px -33px
}

.qqface18 {
    background-position: -91px -33px
}

.qqface19 {
    background-position: -120px -33px
}

.qqface20 {
    background-position: -149px -33px
}

.qqface21 {
    background-position: -178px -33px
}

.qqface22 {
    background-position: -207px -33px
}

.qqface23 {
    background-position: -236px -33px
}

.qqface24 {
    background-position: -265px -33px
}

.qqface25 {
    background-position: -294px -33px
}

.qqface26 {
    background-position: -323px -33px
}

.qqface27 {
    background-position: -352px -33px
}

.qqface28 {
    background-position: -381px -33px
}

.qqface29 {
    background-position: -410px -33px
}

.qqface30 {
    background-position: -4px -62px
}

.qqface31 {
    background-position: -33px -62px
}

.qqface32 {
    background-position: -62px -62px
}

.qqface33 {
    background-position: -91px -62px
}

.qqface34 {
    background-position: -120px -62px
}

.qqface35 {
    background-position: -149px -62px
}

.qqface36 {
    background-position: -178px -62px
}

.qqface37 {
    background-position: -207px -62px
}

.qqface38 {
    background-position: -236px -62px
}

.qqface39 {
    background-position: -265px -62px
}

.qqface40 {
    background-position: -294px -62px
}

.qqface41 {
    background-position: -323px -62px
}

.qqface42 {
    background-position: -352px -62px
}

.qqface43 {
    background-position: -381px -62px
}

.qqface44 {
    background-position: -410px -62px
}

.qqface45 {
    background-position: -4px -91px
}

.qqface46 {
    background-position: -33px -91px
}

.qqface47 {
    background-position: -62px -91px
}

.qqface48 {
    background-position: -91px -91px
}

.qqface49 {
    background-position: -120px -91px
}

.qqface50 {
    background-position: -149px -91px
}

.qqface51 {
    background-position: -178px -91px
}

.qqface52 {
    background-position: -207px -91px
}

.qqface53 {
    background-position: -236px -91px
}

.qqface54 {
    background-position: -265px -91px
}

.qqface55 {
    background-position: -294px -91px
}

.qqface56 {
    background-position: -323px -91px
}

.qqface57 {
    background-position: -352px -91px
}

.qqface58 {
    background-position: -381px -91px
}

.qqface59 {
    background-position: -410px -91px
}

.qqface60 {
    background-position: -4px -120px
}

.qqface61 {
    background-position: -33px -120px
}

.qqface62 {
    background-position: -62px -120px
}

.qqface63 {
    background-position: -91px -120px
}

.qqface64 {
    background-position: -120px -120px
}

.qqface65 {
    background-position: -149px -120px
}

.qqface66 {
    background-position: -178px -120px
}

.qqface67 {
    background-position: -207px -120px
}

.qqface68 {
    background-position: -236px -120px
}

.qqface69 {
    background-position: -265px -120px
}

.qqface70 {
    background-position: -294px -120px
}

.qqface71 {
    background-position: -323px -120px
}

.qqface72 {
    background-position: -352px -120px
}

.qqface73 {
    background-position: -381px -120px
}

.qqface74 {
    background-position: -410px -120px
}

.qqface75 {
    background-position: -4px -149px
}

.qqface76 {
    background-position: -33px -149px
}

.qqface77 {
    background-position: -62px -149px
}

.qqface78 {
    background-position: -91px -145=9px
}

.qqface79 {
    background-position: -120px -149px
}

.qqface80 {
    background-position: -149px -149px
}

.qqface81 {
    background-position: -178px -149px
}

.qqface82 {
    background-position: -207px -149px
}

.qqface83 {
    background-position: -236px -149px
}

.qqface84 {
    background-position: -265px -149px
}

.qqface85 {
    background-position: -294px -149px
}

.qqface86 {
    background-position: -323px -149px
}

.qqface87 {
    background-position: -352px -149px
}

.qqface88 {
    background-position: -381px -149px
}

.qqface89 {
    background-position: -410px -149px
}

.qqface90 {
    background-position: -4px -178px
}

.qqface91 {
    background-position: -33px -178px
}

.qqface92 {
    background-position: -62px -178px
}

.qqface93 {
    background-position: -91px -178px
}

.qqface94 {
    background-position: -120px -178px
}

.qqface95 {
    background-position: -149px -178px
}

.qqface96 {
    background-position: -178px -178px
}

.qqface97 {
    background-position: -207px -178px
}

.qqface98 {
    background-position: -236px -178px
}

.qqface99 {
    background-position: -265px -178px
}

.qqface100 {
    background-position: -294px -178px
}

.qqface101 {
    background-position: -323px -178px
}

.qqface102 {
    background-position: -352px -178px
}

.qqface103 {
    background-position: -381px -178px
}

.qqface104 {
    background-position: -410px -178px
}
</style>
