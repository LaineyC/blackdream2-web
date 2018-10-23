<template>
    <div id="guide" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu default-active="activeNav" :default-openeds="[navs[0].linkName, navs[1].linkName]">
                    <el-submenu :index="nav.linkName" v-for="nav in navs" :key="nav.linkName">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <strong>{{nav.title}}</strong>
                        </template>
                        <el-menu-item :index="subnav.linkName" v-for="subnav in nav.children" @click="linkTo(nav)">{{subnav.title}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20" style="margin-left: 205px;">
                <div style="width: 100%;height: 500px;background:darkgray" id="a1">

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuidePage",
        data() {
            return {
                activeNav:this.$route.name,
                navs:[
                    {title:"开发手册", linkName:"settingProfilea",
                        children:[
                            {title:"我的生成器", linkName:"settingProfile"},
                            {title:"数据模型", linkName:"settingProfile1"},
                            {title:"模板文件", linkName:"settingProfile2"},
                            {title:"生成策略", linkName:"settingProfile3"},
                            {title:"数据结构", linkName:"settingProfile4"},
                            {title:"注意事项", linkName:"settingProfile5"},
                        ]
                    },
                    {title:"用户手册", linkName:"settingProfileb",
                        children:[
                            {title:"他们的生成器", linkName:"settingProfile6"},
                            {title:"我的实例", linkName:"settingProfil7e"},
                            {title:"注意事项", linkName:"settingProfil77e"},
                        ]
                    },
                    //{title:"Key", linkName:"settingKey"},
                ]
            }
        },
        methods: {
            linkTo(nav){
                this.$router.push({ name: nav.linkName,});
            }
        }
    }
</script>

<style scoped lang="less">
    #guide{
        padding: 5px;
    }
</style>