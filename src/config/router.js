import Vue from "vue";
import Router from 'vue-router'
import config from '@/config/config'
import api from '@/config/api'
import auth from '@/config/auth'
import constant from '@/config/constant'
//
Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: config.baseUrl,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomePage.vue')
        },
        {
            path: '/creation-strategy-manage/:generatorId',
            name: 'creationStrategyManage',
            meta: { isRequiredAuth: true, isDeveloper: true },
            component: () => import('../views/CreationStrategyManage.vue')
        },
        {
            path: '/data-model-manage/:generatorId',
            name: 'dataModelManage',
            meta: { isRequiredAuth: true, isDeveloper: true },
            component: () => import('../views/DataModelManage.vue')
        },
        {
            path: '/generator-data-manage/:generatorInstanceId',
            name: 'generatorDataManage',
            meta: { isRequiredAuth: true},
            component: () => import('../views/GeneratorDataManage.vue')
        },
        {
            path: '/generator-guide-save/:generatorId',
            name: 'generatorGuideSave',
            meta: { isRequiredAuth: true},
            component: () => import('../views/GeneratorGuideSave.vue')
        },
        {
            path: '/generator-detail/:generatorId',
            name: 'generatorDetail',
            component: () => import('../views/GeneratorDetail.vue')
        },
        {
            path: '/developer/:developerId',
            name: 'generatorDeveloperHome',
            component: () => import('../views/GeneratorDeveloperHome.vue')
        },
        {
            path: '/generator-instance-manage',
            name: 'generatorInstanceManage',
            meta: { isRequiredAuth: true},
            component: () => import('../views/GeneratorInstanceManage.vue')
        },
        {
            path: '/generator-manage',
            name: 'generatorManage',
            meta: { isRequiredAuth: true, isDeveloper: true },
            component: () => import('../views/GeneratorManage.vue')
        },
        {
            path: '/guide',
            name: 'guide',
            component: () => import('../views/GuidePage.vue'),
            children: [
                {path: '', redirect:"userGenerator"},
                {path: 'developerGenerator', name: 'guideDeveloperGenerator', component: () => import('../views/guide/GuideDeveloperGenerator.vue'),},
                {path: 'developerDataModel', name: 'guideDeveloperDataModel', component: () => import('../views/guide/GuideDeveloperDataModel.vue'),},
                {path: 'developerTemplateFile', name: 'guideDeveloperTemplateFile', component: () => import('../views/guide/GuideDeveloperTemplateFile.vue'),},
                {path: 'developerCreationStrategy', name: 'guideDeveloperCreationStrategy', component: () => import('../views/guide/GuideDeveloperCreationStrategy.vue'),},
                {path: 'developerDataStructure', name: 'guideDeveloperDataStructure', component: () => import('../views/guide/GuideDeveloperDataStructure.vue'),},
                {path: 'developerNote', name: 'guideDeveloperNote', component: () => import('../views/guide/GuideDeveloperNote.vue'),},
                {path: 'userGenerator', name: 'guideUserGenerator', component: () => import('../views/guide/GuideUserGenerator.vue'),},
                {path: 'userGeneratorInstance', name: 'guideUserGeneratorInstance', component: () => import('../views/guide/GuideUserGeneratorInstance.vue'),},
                {path: 'userNote', name: 'guideUserNote', component: () => import('../views/guide/GuideUserNote.vue'),},
            ]
        },
        {
            path: '/search/:searchText',
            name: 'search',
            component: () => import('../views/SearchPage.vue')
        },
        {
            path: '/setting',
            name: 'setting',
            meta: { isRequiredAuth: true},
            component: () => import('../views/SettingPage.vue'),
            children: [
                {path: '', redirect:'profile'},
                {path: 'account', name: 'settingAccount', component: () => import('../views/setting/SettingAccount.vue'),},
                {path: 'key', name: 'settingKey', component: () => import('../views/setting/SettingKey.vue'),},
                {path: 'profile', name: 'settingProfile', component: () => import('../views/setting/SettingProfile.vue'),},
            ]
        },
        {
            path: '/sign-in',
            name: 'signIn',
            component: () => import('../views/SignIn.vue')
        },
        {
            path: '/sign-up',
            name: 'signUp',
            component: () => import('../views/SignUp.vue')
        },
        {
            path: '/template-file-manage/:generatorId',
            name: 'templateFileManage',
            meta: {isRequiredAuth: true, isDeveloper: true },
            component: () => import('../views/TemplateFileManage.vue')
        },
        {
            path:'*',
            redirect:'/'
        }
    ]
});
let messageDuration = 6 * 1000;
//路由拦截
router.beforeEach((to, from, next) => {
    if (auth.isCertified) {
        if (to.meta.isDeveloper && auth.body.type !== constant.UserTypeEnum.DEVELOPER.value) {
            Vue.prototype.$message({
                showClose: true,
                duration: messageDuration,
                message: '需要开发者权限',
                type: 'error'
            });
        }
        else{
            next();
        }
        return;
    }

    api.User.infoGet({}, {isCustomHandle:true}).then((data) => {
        auth.body = data;
        if (to.meta.isDeveloper && auth.body.type !== constant.UserTypeEnum.DEVELOPER.value) {
            Vue.prototype.$message({
                showClose: true,
                duration: messageDuration,
                message: '需要开发者权限',
                type: 'error'
            });
        }
        else{
            next();
        }
    }, (error) => {
        let errorCode = error.code;
        if(to.meta.isRequiredAuth){
            if (errorCode === 1002) {
                auth.body = null;
                next({name: "signIn"});
            }
            else {
                next();
            }
        }
        next();
    });
});

export default router;