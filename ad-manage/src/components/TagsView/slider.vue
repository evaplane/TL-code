<template>
    <div class="slider" ref="wrapper">
    <div class="slider-group" ref="sliderGroup">
      <div style="display:none">{{visitedviewsSlider}}</div>
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { mapGetters } from 'vuex'
  import { setTimeout } from 'timers';
  export default {
    name:'slider',
    props: {
      // 点击列表是否派发click事件
      click: {
        type: Boolean,
        default: true
      },
      // 是否派发滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否派发列表滚动开始的事件
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 当数据更新后，刷新scroll的延时。
      refreshDelay: {
        type: Number,
        default: 20
      },
      
    },
    data(){
      return {
        children:"",
        bodyWidth:'',
        scrollWidth:''
      }
    },
    mounted() {
      // 保证在DOM渲染完毕后初始化better-scroll
      this.$nextTick(() => {
        this._initScroll()
        this.setSliderWidth()
        this.setSliderLocation()
      })
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
              loop: this.loop,
              threshold: 0.3,
              speed: 400
            },
            click: true
        })
        // 是否派发滚动事件
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      setSliderWidth() {
        if(this.$refs.sliderGroup) {
          this.children = this.$refs.sliderGroup.children
          let width = 0
          let scrollWidth=0
          for(let i=0; i<this.children.length; i++) {
             let child = this.children[i]
             width += child.clientWidth+20
             scrollWidth += child.clientWidth
          }
          this.$refs.sliderGroup.style.width = width+'px'
        }
       
      },
      setSliderLocation(){
        if(this.$refs.sliderGroup.children){
          let children = this.$refs.sliderGroup.children
          let currentChild = 0;
          this.scrollWidth = 0
          for(let i=0; i<children.length; i++) {
             let child = this.children[i]
              this.scrollWidth += child.clientWidth+2
             if(this.$route.meta.title==child.innerText.trim()){
              currentChild = child;
              break
             }
          }
          this.bodyWidth = document.body.clientWidth-300
          if((this.bodyWidth-this.scrollWidth)<100){
            let currentWidth = -(this.scrollWidth-this.bodyWidth+currentChild.clientWidth);
            this.$refs.sliderGroup.style.transform="translate("+currentWidth+"px, 0px) scale(1)"
            this.$refs.sliderGroup.style.transition=".5s"
          }else{
            this.$refs.sliderGroup.style.transform="translate(0px, 0px) scale(1)"
            this.$refs.sliderGroup.style.transition=".5s"
          }
        }
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
    },
    computed:{
      visitedviewsSlider () {
        return this.$store.getters.visitedviews.length
      },
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      visitedviewsSlider(){
        this.refresh()
        setTimeout(()=>{
          this.setSliderWidth()
        },10)
      },
      $route(){
        setTimeout(() => {
            this.setSliderLocation()
        }, 100);
      }
      
    }
  }
</script>

<style lang="scss">
  .slider{
    height: 38px;
  }
</style>
