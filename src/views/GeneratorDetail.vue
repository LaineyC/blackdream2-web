<template>
    <div id="generator-detail" class="container">
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <el-breadcrumb>
                            <el-breadcrumb-item :to="{ name: '/' }">{{generator.user.username}}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{generator.name}}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <el-button-group>
                            <el-button size="mini" @click="showGeneratorUpdateModal">编辑</el-button>
                        </el-button-group>
                    </div>
                    <p>{{generator.description}}</p>
                    <p>
                        <span>{{generator.engineType | enumFormat(Constant.TemplateEngineTypeEnum)}}</span>
                        <span> 最后更新 <Time :time="generator.updateTime" :interval="1"/></span>
                    </p>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <strong>使用指南</strong>
                        <el-button-group>
                            <el-button size="mini" @click="linkToGeneratorGuideSave">编辑</el-button>
                        </el-button-group>
                    </div>
                    <p>
                        <vue-markdown :source="guide.content"></vue-markdown>
                    </p>
                </el-card>
            </el-col>
        </el-row>
        <GeneratorUpdateModal ref="generatorUpdateModal" @on-success="handleGeneratorUpdateSuccess"/>
    </div>
</template>

<script>
    import VueMarkdown from'vue-markdown'

    export default {
        name: "GeneratorDetail",
        components:{
            GeneratorUpdateModal:() => import('@/components/GeneratorUpdateModal.vue'),
            VueMarkdown
        },
        data () {
            return {
                generator: {user:{}, updateTime:""},
                guide:{
                    content:""
                },
                generatorId:this.$route.params.generatorId,
            }
        },
        methods:{
            handleGeneratorUpdateSuccess(){
                this.Api.Generator.get({id: this.generatorId}).then((data) => {
                    this.generator = data;
                });
            },
            linkToGeneratorGuideSave(){
                this.$router.push({ name: 'generatorGuideSave', params: { generatorId: this.generatorId }});
            },
            showGeneratorUpdateModal(){
                this.$refs.generatorUpdateModal.open({
                    generatorId: this.generatorId
                });
            },
        },
        mounted(){
            this.Api.Generator.get({id: this.generatorId}).then((data) => {
                this.generator = data;
            });
            this.Api.GeneratorGuide.get({generatorId: this.generatorId}).then((model) => {
                if(model !== undefined && model != null){
                    this.guide = model;
                }
            });
        }
    }
</script>

<style scoped lang="less">
    #generator-detail{
        .el-col{
            padding: 10px;
        }
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>