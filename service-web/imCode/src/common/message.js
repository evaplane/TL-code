import Vue from 'vue';
import ElementUI from 'element-ui';

const message = function message(options){
    Vue.prototype.$message.closeAll();
    Vue.prototype.$message(options);
}

export default message;
