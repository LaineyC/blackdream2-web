<template>
    <div id="setting" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu :default-active="activeNav">
                    <el-menu-item :index="nav.linkName" v-for="nav in navs" :key="nav.linkName" @click="linkTo(nav)">
                        <strong slot="title">{{nav.title}}</strong>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" style="margin-left: 205px;">
                <router-view/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SettingPage",
        data(){
            return {
                activeNav:this.$route.name,
                navs:[
                    {title:"形象", linkName:"settingProfile"},
                    {title:"账号", linkName:"settingAccount"},
                    //{title:"Key", linkName:"settingKey"},
                ]
            }
        },
        methods:{
            linkTo(nav){
                this.$router.push({ name: nav.linkName,});
            }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    #setting{
        padding: 5px;
    }
</style>