<template>
    <div id="setting" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu :default-active="activeLink">
                    <el-menu-item :index="tab.linkName" v-for="tab in tabs" :key="tab.linkName" @click="linkTo(tab)">
                        <strong slot="title">{{tab.title}}</strong>
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
                activeLink:this.$route.name,
                tabs:[
                    {title:"形象", linkName:"settingProfile"},
                    {title:"账号", linkName:"settingAccount"},
                    {title:"Key", linkName:"settingKey"},
                ]
            }
        },
        methods:{
            linkTo(tab){
                this.$router.push({ name: tab.linkName,});
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