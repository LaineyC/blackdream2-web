<template>
    <div id="guide" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu :default-active="activeNav" :default-openeds="[navs[0].linkName, navs[1].linkName]">
                    <el-submenu :index="nav.linkName" v-for="nav in navs" :key="nav.linkName">
                        <template slot="title"><strong>{{nav.title}}</strong></template>
                        <el-menu-item :index="subnav.linkName" v-for="subnav in nav.children" @click="linkTo(subnav)">{{subnav.title}}</el-menu-item>
                    </el-submenu>
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
        name: "GuidePage",
        data() {
            return {
                activeNav:this.$route.name,
                navs:[
                    {title:"开发手册", linkName:"developer",
                        children:[
                            {title:"我的生成器", linkName:"guideDeveloperGenerator"},
                            {title:"数据模型", linkName:"guideDeveloperDataModel"},
                            {title:"模板文件", linkName:"guideDeveloperTemplateFile"},
                            {title:"生成策略", linkName:"guideDeveloperCreationStrategy"},
                            {title:"数据结构", linkName:"guideDeveloperDataStructure"},
                            {title:"注意事项", linkName:"guideDeveloperNote"},
                        ]
                    },
                    {title:"用户手册", linkName:"user",
                        children:[
                            {title:"他们的生成器", linkName:"guideUserGenerator"},
                            {title:"我的实例", linkName:"guideUserGeneratorInstance"},
                            {title:"注意事项", linkName:"guideUserNote"},
                        ]
                    },
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