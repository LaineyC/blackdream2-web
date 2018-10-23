import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '@/config/config'
import auth from '@/config/auth'
//
Vue.use(VueAxios, axios);
//
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60 * 1000;
let messageDuration = 6 * 1000;
//http请求拦截
axios.interceptors.request.use(config => {
    Vue.prototype.$Loading.start();
    return config;
}, error => {
    Vue.prototype.$Loading.error();
    Vue.prototype.$message({
        showClose: true,
        duration: messageDuration,
        message: '请求失败',
        type: 'error'
    });
    return Promise.reject(error)
});
//http响应拦截
axios.interceptors.response.use(data => {
    Vue.prototype.$Loading.finish();
    let error = data.data.error;
    if(error != null && error !== undefined){
        if(!data.config.isCustomHandle){
            Vue.prototype.$message({
                showClose: true,
                duration: messageDuration,
                message: data.data.error.message,
                type: 'error'
            });
        }
        return Promise.reject(data.data.error)
    }
    else{
        return data.data.body;
    }
}, error => {
    Vue.prototype.$Loading.error();
    if (error.response && error.response.status === 500) {
        Vue.prototype.$message({
            showClose: true,
            duration: messageDuration,
            message:  '服务器错误！',
            type: 'error'
        });
    }
    else if (error.response && error.response.status === 503) {
        Vue.prototype.$message({
            showClose: true,
            duration: messageDuration,
            message: '服务器正在维护中，请稍后访问！',
            type: 'error'
        });
    }
    else if (error.request && error.request.status === 0) {
        Vue.prototype.$message({
            showClose: true,
            duration: messageDuration,
            message: '请求超时！',
            type: 'error'
        });
    }
    return Promise.reject(error);
});

let getServerUrl = function(uri){
    if(uri){
        return config.serverUrl + "/web" + uri;
    }
    return config.serverUrl;
};

let doPost = function(uri){
    return function(request, config){
        return axios.post(getServerUrl(uri), request, config)
    }
};

export default Vue.prototype.Api = {
    User:{
        signIn: doPost('/user/signIn'),
        signUp: doPost('/user/signUp'),
        signOut: doPost('/user/signOut'),
        signUpEmailValidCodeSend: doPost('/user/signUpEmailValidCodeSend'),
        infoGet: doPost('/user/infoGet'),
        get: doPost('/user/get'),
        passwordChange: doPost('/user/passwordChange'),
        profileChange: doPost('/user/profileChange'),
    },
    Generator: {
        create: doPost('/generator/create'),
        update: doPost('/generator/update'),
        get: doPost('/generator/get'),
        query: doPost('/generator/query'),
        search: doPost('/generator/search'),
        infoSearch: doPost('/generator/infoSearch'),
        release: doPost('/generator/release'),
    },
    GeneratorInstance: {
        create: doPost('/generatorInstance/create'),
        delete: doPost('/generatorInstance/delete'),
        update: doPost('/generatorInstance/update'),
        get: doPost('/generatorInstance/get'),
        infoSearch: doPost('/generatorInstance/infoSearch'),
        make: doPost('/generatorInstance/make'),
        makeTest: doPost('/generatorInstance/makeTest'),
        download: doPost('/generatorInstance/download'),
    },
    TemplateFile: {
        create: doPost('/templateFile/create'),
        update: doPost('/templateFile/update'),
        delete: doPost('/templateFile/delete'),
        get: doPost('/templateFile/get'),
        infoQuery: doPost('/templateFile/infoQuery'),
    },
    CreationStrategy: {
        create: doPost('/creationStrategy/create'),
        update: doPost('/creationStrategy/update'),
        delete: doPost('/creationStrategy/delete'),
        get: doPost('/creationStrategy/get'),
        query: doPost('/creationStrategy/query'),
        infoQuery: doPost('/creationStrategy/infoQuery'),
    },
    DataModel: {
        create: doPost('/dataModel/create'),
        update: doPost('/dataModel/update'),
        delete: doPost('/dataModel/delete'),
        get: doPost('/dataModel/get'),
        infoQuery: doPost('/dataModel/infoQuery'),
    },
    GeneratorGuide: {
        save: doPost('/generatorGuide/save'),
        get: doPost('/generatorGuide/get')
    },
    DataModelSchema: {
        save: doPost('/dataModelSchema/save'),
        get: doPost('/dataModelSchema/get')
    },
    GeneratorData: {
        create: doPost('/generatorData/create'),
        delete: doPost('/generatorData/delete'),
        update: doPost('/generatorData/update'),
        get: doPost('/generatorData/get'),
        tree: doPost('/generatorData/tree'),
    },
}