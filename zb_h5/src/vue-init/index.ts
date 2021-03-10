import './filter';
import './directive';
import Vue from 'vue';
import scroll from '@/components/common/scroll/index.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
Vue.component('scroll', scroll);
Vue.component('nativeScroll', nativeScroll);
