<template>
    <div id="home" class="container">
        <el-card>
            <h1>Welcome to BlackDream!</h1>
        </el-card>
        <el-card style="margin-top: 10px;">
            <h1>一个让开发者快速构建的文本生成器平台。</h1>
        </el-card>
        <el-card style="margin-top: 10px;">
            <h1>机械重复性的工作如同黑色梦魇，同一个问题并不应该被解决两次！</h1>
        </el-card>
        <el-card style="margin-top: 10px;">
            <el-button type="text" @click="linkToGuide"><strong style="font-size: 24px;">指南</strong></el-button>
        </el-card>
        <el-card style="margin-top: 10px;">
            <el-button type="text" @click="linkToAbout"><strong style="font-size: 24px;">关于</strong></el-button>
        </el-card>
        <el-card style="margin-top: 10px;">
            <el-button type="text" @click="linkToContribute"><strong style="font-size: 24px;">赞助</strong></el-button>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h1>ToDoList</h1>
            </div>
            <div>
                <el-collapse accordion>
                    <el-collapse-item title="导入 导出 复制" name="1">
                        <template slot="title">
                            导入 导出 复制
                        </template>
                        <div></div>
                    </el-collapse-item>
                    <el-collapse-item title="自动生成sdk" name="2">
                        <template slot="title">
                            自动生成sdk
                        </template>
                        <div></div>
                    </el-collapse-item>
                    <el-collapse-item title="接入thymeleaf、jsp" name="3">
                        <template slot="title">
                            接入thymeleaf、jsp
                        </template>
                        <div></div>
                    </el-collapse-item>
                    <el-collapse-item title="生成策略的文档完善" name="4">
                        <template slot="title">
                            生成策略的文档完善
                        </template>
                        <div></div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'HomePage',
        components:{
        },
        data () {
          return {

          }
        },
        methods:{
            linkToGuide(){
                this.$router.push({ name: 'guideUserGenerator'});
            },
            linkToAbout(){
                this.$router.push({ name: 'about'});
            },
            linkToContribute(){
                this.$router.push({ name: 'contribute'});
            },
        }
    }
</script>

<style scoped lang="less">
  #home{
        .el-card{
            margin: 20px 0;
        }
  }
</style>
