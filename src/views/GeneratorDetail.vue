<template>
    <div id="generator-detail" class="container">
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <div>
                            <el-link type="primary" @click="linkToGeneratorDeveloperHome(generator)"><strong>{{generator.user.username}}</strong></el-link>
                            <span> / </span>
                            <el-link :underline="false"><strong>{{generator.name}}</strong></el-link>
                        </div>
                        <el-button-group v-if="Auth.body.id === generator.user.id">
                            <el-button size="mini" type="primary" @click="showGeneratorUpdateModal">编辑</el-button>
                        </el-button-group>
                    </div>
                    <p>{{generator.description}}</p>
                    <p>模板引擎 {{generator.engineType | enumFormat(Constant.TemplateEngineTypeEnum)}}</p>
                    <p>最后更新 <Time v-if="generator.updateTime" :time="generator.updateTime" :interval="1"/></p>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <strong>使用指南</strong>
                        <el-button-group v-if="Auth.body.id === generator.user.id">
                            <el-button size="mini" type="primary" @click="linkToGeneratorGuideSave">编辑</el-button>
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
    import VueMarkdown from 'vue-markdown'

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
            linkToGeneratorDeveloperHome(generator){
                if (this.Auth.body.id !== generator.user.id) {
                    this.$router.push({ name: 'generatorDeveloperHome', params: { developerId: generator.user.id }});
                }
                else {
                    this.$router.push({ name: 'generatorManage'});
                }
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