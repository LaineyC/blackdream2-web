<template>
    <div id="generator-manage" class="container">
        <el-row>
            <el-col :span="6">
                <el-card shadow="hover">
                    <p slot="header"><strong>{{Auth.body.nickname}}</strong></p>
                    <p><img src="@/assets/image/logo.jpg" class="head-img"/></p>
                    <p>{{Auth.body.username}}</p>
                    <p>{{Auth.body.email}}</p>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" size="small">
                            <el-form-item>
                                <el-input v-model="searchRequest.name" type="text" placeholder="输入名称搜索"></el-input>
                            </el-form-item>
                            <el-form-item style="width: 120px;">
                                <el-select v-model="searchRequest.engineType" placeholder="模板语言">
                                    <el-option value="">全部</el-option>
                                    <el-option v-for="item in Constant.TemplateEngineTypeEnum" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width: 120px;">
                                <el-select v-model="searchRequest.status" placeholder="状态">
                                    <el-option value="">全部</el-option>
                                    <el-option v-for="item in Constant.GeneratorStatusEnum" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="search">搜索</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="showGeneratorCreateModal" type="success">新建</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row v-for="item in searchResult.records" :key="item.id">
                    <el-col :span="24">
                        <el-card shadow="hover">
                            <div slot="header" class="card-header-flex">
                                <div>
                                    <el-button type="text" size="mini" @click="linkToGeneratorDetail(item)"><strong>{{item.name}}</strong></el-button>
                                </div>
                                <div>
                                    <el-button-group>
                                        <el-button size="mini" type="primary" @click="showGeneratorUpdateModal(item)">编辑</el-button>
                                        <el-button size="mini" type="primary" @click="release(item)">发布</el-button>
                                    </el-button-group>
                                    <el-button-group style="margin-left: 5px;">
                                        <el-button size="mini" type="success" @click="linkToDataModelManage(item)">模型</el-button>
                                        <el-button size="mini" type="success" @click="linkToTemplateFileManage(item)">模板</el-button>
                                        <el-button size="mini" type="success" @click="linkToCreationStrategyManage(item)">策略</el-button>
                                        <el-button size="mini" type="success" @click="linkToGeneratorGuideSave(item)">指南</el-button>
                                        <el-button size="mini" type="success" @click="showGeneratorInstanceCreateModal(item)">实例</el-button>
                                    </el-button-group>
                                </div>
                            </div>
                            <p>当前状态 {{item.status | enumFormat(Constant.GeneratorStatusEnum)}}</p>
                            <p>模板引擎 {{item.engineType | enumFormat(Constant.TemplateEngineTypeEnum)}}</p>
                            <p>最后更新  <Time :time="item.updateTime" :interval="60"/></p>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-pagination
                            :page-size="10"
                            layout="total, prev, pager, next, jumper"
                            background
                            :total="searchResult.total">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <GeneratorCreateModal ref="generatorCreateModal" @on-success="handleGeneratorCreateSuccess"/>
        <GeneratorUpdateModal ref="generatorUpdateModal" @on-success="handleGeneratorUpdateSuccess"/>
        <GeneratorInstanceCreateModal ref="generatorInstanceCreateModal" @on-success="handleGeneratorInstanceCreateSuccess"/>
    </div>
</template>

<script>
    export default {
        name: "GeneratorManage",
        components:{
            GeneratorCreateModal:() => import('@/components/GeneratorCreateModal.vue'),
            GeneratorUpdateModal:() => import('@/components/GeneratorUpdateModal.vue'),
            GeneratorInstanceCreateModal:() => import('@/components/GeneratorInstanceCreateModal.vue')
        },
        data () {
            return {
                searchRequest:{
                    page: 1,
                    pageSize: 10,
                    name: null,
                    status: null,
                    engineType: null
                },
                searchResult:{
                    total: 0,
                    records:[]
                }
            }
        },
        methods:{
            handleGeneratorCreateSuccess(){
                this.search();
            },
            handleGeneratorUpdateSuccess(){
                this.search();
            },
            handleGeneratorInstanceCreateSuccess(){
                this.$router.push({ name: 'generatorInstanceManage'});
            },
            showGeneratorInstanceCreateModal(item){
                this.$refs.generatorInstanceCreateModal.open({
                    generatorId:item.id
                })
            },
            showGeneratorCreateModal(){
                this.$refs.generatorCreateModal.open();
            },
            showGeneratorUpdateModal(item){
                this.$refs.generatorUpdateModal.open({
                    generatorId:item.id
                });
            },
            release(item){
                this.Api.Generator.release({id:item.id}).then((data) => {

                });
            },
            search(){
                this.Api.Generator.infoSearch(this.searchRequest).then((data) => {
                    this.searchResult = data;
                });
            },
            linkToGeneratorGuideSave(item){
                this.$router.push({ name: 'generatorGuideSave', params: { generatorId: item.id }});
            },
            linkToDataModelManage(item){
                this.$router.push({ name: 'dataModelManage', params: { generatorId: item.id }});
            },
            linkToTemplateFileManage(item){
                this.$router.push({ name: 'templateFileManage', params: { generatorId: item.id }});
            },
            linkToCreationStrategyManage(item){
                this.$router.push({ name: 'creationStrategyManage', params: { generatorId: item.id }});
            },
            linkToGeneratorDetail(item){
                this.$router.push({ name: 'generatorDetail', params: { generatorId: item.id }});
            }
        },
        mounted(){
            this.search();
        }
    }
</script>

<style scoped lang="less">
    #generator-manage{
        .el-col{
            padding: 10px;
        }
        .head-img{
            width: 100%;
            max-height: 300px;
        }
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>