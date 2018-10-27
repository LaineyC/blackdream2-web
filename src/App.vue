<template>
    <div id="bd-app">
        <el-container>
            <el-header id="bd-header">
                <el-menu id="bd-header-menu" class="container" mode="horizontal" background-color="#545c64"
                         text-color="#fff"
                         active-text-color="#ffd04b">
                    <el-menu-item index="1" @click="linkToHome"><img id="bd-logo" src="@/assets/image/logo.jpg"/></el-menu-item>
                    <el-menu-item index="2">
                        <el-input placeholder="搜索生成器" v-model="searchText" size="mini"  @keyup.enter.native="search">
                            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                        </el-input>
                    </el-menu-item>
                    <el-menu-item index="3-1" @click="linkToGeneratorManage" v-if="Auth.isCertified && Auth.body.type === Constant.UserTypeEnum.DEVELOPER.value">我的生成器</el-menu-item>
                    <el-menu-item index="3-2" @click="linkToGeneratorInstanceManage" v-if="Auth.isCertified">我的实例</el-menu-item>
                    <el-submenu index="4" style="float: right;" v-if="Auth.isCertified">
                        <template slot="title">{{Auth.body.username}}</template>
                        <el-menu-item index="4-1" @click="linkToGuide">指南</el-menu-item>
                        <el-menu-item index="4-2" @click="linkToSetting">设置</el-menu-item>
                        <el-menu-item index="4-3"  @click="signOut">退出</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="6" style="float: right;" @click="linkToSignUp" v-if="!Auth.isCertified">注册</el-menu-item>
                    <el-menu-item index="5" style="float: right;" @click="linkToSignIn" v-if="!Auth.isCertified">登陆</el-menu-item>
                </el-menu>
            </el-header>
            <el-main id="bd-main">
                <router-view/>
            </el-main>
            <el-footer id="bd-footer">2016-2019 &copy; BlackDream 机械重复性的工作如同黑色梦魇，同一个问题并不应该被解决两次！</el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "App",
        data () {
            return {
                searchText: "",
            }
        },
        methods: {
            search(){
                if(this.searchText !== ""){
                    this.$router.push({ name: 'search', params: { searchText: this.searchText }});
                    this.searchText = "";
                }
            },
            signOut(){
                this.$confirm('确定退出系统？', {type: 'warning'})
                .then(() => {
                    this.Api.User.signOut({}).then(() => {
                        this.Auth.body = null;
                        this.$router.push({ name: 'signIn'});
                    });
                });
            },
            linkToHome(){
                this.$router.push({ name: 'home'});
            },
            linkToSignIn(){
                this.$router.push({ name: 'signIn'});
            },
            linkToSignUp(){
                this.$router.push({ name: 'signUp'});
            },
            linkToGuide(){
                this.$router.push({ name: 'guideUserGenerator'});
            },
            linkToSetting(){
                this.$router.push({ name: 'settingProfile'});
            },
            linkToGeneratorManage(){
                this.$router.push({ name: 'generatorManage'});
            },
            linkToGeneratorInstanceManage(){
                this.$router.push({ name: 'generatorInstanceManage'});
            }
        }
    }
</script>

<style scope lang="less">
    #bd-app {
        width:100%;
        height: 100%;
        z-index: 1000;
        padding: 0;
        #bd-header{
            padding: 0;
            background-color: #545c64;
            #bd-header-menu{
                border: 0;
                margin: 0 auto;
            }
        }
        #bd-logo{
            width: 40px;
            height: 40px;
            border-radius: 3px;
            position: relative;
            top:0;
            left:0;
        }
        #bd-main{
            position: absolute;
            padding: 0;
            width: 100%;
            top: 60px;
            bottom: 0;
        }
        #bd-footer{
            position: fixed;
            bottom: 0;
            right: 0;
            padding: 5px 10px;
            background: none;
            height: auto!important;
        }
    }
</style>
