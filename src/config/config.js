import Vue from 'vue'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/css/style.css';
//
Vue.use(ElementUI);
//
Vue.use(iView);
//
Vue.config.productionTip = false;

export default Vue.prototype.Config = {

    get serverUrl (){
        return process.env.VUE_APP_SERVER_URL;
    },

    get baseUrl(){
        return process.env.BASE_URL;
    }

};