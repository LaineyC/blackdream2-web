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
        signIn: doPost('/usercenter/user/signIn'),
        signUp: doPost('/usercenter/user/signUp'),
        signOut: doPost('/usercenter/user/signOut'),
        signUpValidCodeSend: doPost('/usercenter/user/signUpValidCodeSend'),
        infoGet: doPost('/usercenter/user/infoGet'),
        get: doPost('/usercenter/user/get'),
        passwordChange: doPost('/usercenter/user/passwordChange'),
        profileChange: doPost('/usercenter/user/profileChange'),
        passwordResetValidCodeSend: doPost('/usercenter/user/passwordResetValidCodeSend'),
        passwordReset: doPost('/usercenter/user/passwordReset'),
    },
    Generator: {
        create: doPost('/generator/generator/create'),
        update: doPost('/generator/generator/update'),
        get: doPost('/generator/generator/get'),
        query: doPost('/generator/generator/query'),
        search: doPost('/generator/generator/search'),
        infoSearch: doPost('/generator/generator/infoSearch'),
        release: doPost('/generator/generator/release'),
    },
    GeneratorInstance: {
        create: doPost('/generator/generatorInstance/create'),
        delete: doPost('/generator/generatorInstance/delete'),
        update: doPost('/generator/generatorInstance/update'),
        get: doPost('/generator/generatorInstance/get'),
        infoSearch: doPost('/generator/generatorInstance/infoSearch'),
        make: doPost('/generator/generatorInstance/make'),
        makeTest: doPost('/generator/generatorInstance/makeTest'),
        download: doPost('/generator/generatorInstance/download'),
        get downloadUri(){
            return getServerUrl('/generator/generatorInstance/download');
        },
        versionSync: doPost('/generator/generatorInstance/versionSync'),
    },
    TemplateFile: {
        create: doPost('/generator/templateFile/create'),
        update: doPost('/generator/templateFile/update'),
        delete: doPost('/generator/templateFile/delete'),
        get: doPost('/generator/templateFile/get'),
        infoQuery: doPost('/generator/templateFile/infoQuery'),
    },
    CreationStrategy: {
        create: doPost('/generator/creationStrategy/create'),
        update: doPost('/generator/creationStrategy/update'),
        delete: doPost('/generator/creationStrategy/delete'),
        get: doPost('/generator/creationStrategy/get'),
        query: doPost('/generator/creationStrategy/query'),
        infoQuery: doPost('/generator/creationStrategy/infoQuery'),
    },
    DataModel: {
        create: doPost('/generator/dataModel/create'),
        update: doPost('/generator/dataModel/update'),
        delete: doPost('/generator/dataModel/delete'),
        get: doPost('/generator/dataModel/get'),
        infoQuery: doPost('/generator/dataModel/infoQuery'),
    },
    GeneratorGuide: {
        save: doPost('/generator/generatorGuide/save'),
        get: doPost('/generator/generatorGuide/get')
    },
    DataModelSchema: {
        save: doPost('/generator/dataModelSchema/save'),
        get: doPost('/generator/dataModelSchema/get')
    },
    GeneratorData: {
        create: doPost('/generator/generatorData/create'),
        delete: doPost('/generator/generatorData/delete'),
        update: doPost('/generator/generatorData/update'),
        get: doPost('/generator/generatorData/get'),
        tree: doPost('/generator/generatorData/tree'),
    },
}