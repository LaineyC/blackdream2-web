<template>
    <div id="search-page" class="container">
        <el-row>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header">
                        <strong>TOP 10</strong>
                    </div>
                    <div v-for="generator in generatorList" :key="generator.id">
                        <el-link type="primary" @click="linkToGeneratorDeveloperHome(generator)"><strong>{{generator.user.username}}</strong></el-link>
                        <span> / </span>
                        <el-link type="primary" @click="linkToGeneratorDetail(generator)"><strong>{{generator.name}}</strong></el-link>
                        <el-divider></el-divider>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" size="small">
                            <el-form-item>
                                <el-input v-model="searchRequest.name" type="text" placeholder="输入名称搜索" clearable></el-input>
                            </el-form-item>
                            <el-form-item style="width: 120px;">
                                <el-select v-model="searchRequest.engineType" placeholder="模板语言" clearable>
                                    <el-option v-for="item in Constant.TemplateEngineTypeEnum" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="search">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row v-for="item in searchResult.records" :key="item.id">
                    <el-col :span="24">
                        <el-card shadow="hover">
                            <div slot="header" class="card-header-flex">
                                <div>
                                    <el-link type="primary" @click="linkToGeneratorDeveloperHome(item)"><strong>{{item.user.username}}</strong></el-link>
                                    <span> / </span>
                                    <el-link type="primary" @click="linkToGeneratorDetail(item)"><strong>{{item.name}}</strong></el-link>
                                </div>
                                <el-button-group v-if="Auth.isCertified">
                                    <el-button v-if="Auth.body.type === Constant.UserTypeEnum.DEVELOPER.value" size="mini" type="success" @click="showDataModelCreateFromModal(item)">复制</el-button>
                                    <el-button size="mini" type="success" @click="showGeneratorInstanceCreateModal(item)">创建实例</el-button>
                                </el-button-group>
                            </div>
                            <p>{{item.description}}</p>
                            <p>模板引擎 {{item.engineType | enumFormat(Constant.TemplateEngineTypeEnum)}}</p>
                            <p>最后更新 <Time :time="item.updateTime" :interval="60"/></p>
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
        <GeneratorInstanceCreateModal ref="generatorInstanceCreateModal" @on-success="handleGeneratorInstanceCreateSuccess"/>
        <GeneratorCreateFromModal ref="generatorCreateFromModal" @on-success="handleGeneratorCreateFromSuccess"/>
    </div>
</template>

<script>
    export default {
        name: "SearchPage",
        components:{
            GeneratorInstanceCreateModal:() => import('@/components/GeneratorInstanceCreateModal.vue'),
            GeneratorCreateFromModal:() => import('@/components/GeneratorCreateFromModal.vue')
        },
        data () {
            return {
                generatorList:[],
                searchRequest:{
                    page: 1,
                    pageSize: 10,
                    name: null,
                    status: this.Constant.GeneratorStatusEnum.RELEASE.value,
                    engineType: null
                },
                searchResult:{
                    total: 0,
                    records:[]
                }
            }
        },
        methods:{
            showDataModelCreateFromModal(item) {
                this.$refs.generatorCreateFromModal.open({
                    generatorId:item.id
                })
            },
            showGeneratorInstanceCreateModal(item) {
                this.$refs.generatorInstanceCreateModal.open({
                    generatorId:item.id
                })
            },
            handleGeneratorCreateFromSuccess() {
                this.$router.push({ name: 'generatorManage'});
            },
            handleGeneratorInstanceCreateSuccess(){
                this.$router.push({ name: 'generatorInstanceManage'});
            },
            search(){
                this.Api.Generator.search(this.searchRequest).then((data) => {
                    this.searchResult = data;
                });
            },
            linkToGeneratorDeveloperHome(item){
                if (this.Auth.body.id !== item.user.id) {
                    this.$router.push({ name: 'generatorDeveloperHome', params: { developerId: item.user.id }});
                }
                else{
                    this.$router.push({ name: 'generatorManage'});
                }
            },
            linkToGeneratorDetail(item){
                this.$router.push({ name: 'generatorDetail', params: { generatorId: item.id }});
            },
        },
        watch: {
            '$route.query.keyword' (to, from) {
                this.searchRequest.name = this.$route.query.keyword;
                this.search();
            }
        },
        mounted(){
            this.searchRequest.name = this.$route.query.keyword;
            this.search();

            this.Api.Generator.queryTop({}).then((data) => {
                this.generatorList = data;
            });
        }
    }
</script>

<style scoped lang="less">
    #search-page{
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