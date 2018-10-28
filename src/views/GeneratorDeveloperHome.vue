<template>
    <div id="generator-developer-home" class="container">
        <el-row>
            <el-col :span="6">
                <el-card shadow="hover">
                    <p slot="header"><strong>{{developer.nickname}}</strong></p>
                    <p><img src="@/assets/image/logo.jpg" class="head-img"/></p>
                    <p>{{developer.username}}</p>
                    <p>{{developer.email}}</p>
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
                            </div>
                            <p>{{item.description}}</p>
                            <p>当前状态 {{item.status | enumFormat(Constant.GeneratorStatusEnum)}}</p>
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
    </div>
</template>

<script>
    export default {
        name: "GeneratorDeveloperHome",
        data () {
            return {
                developer:{},
                searchRequest:{
                    page: 1,
                    pageSize: 10,
                    name: null,
                    status: null,
                    engineType: null,
                    userId: this.$route.params.developerId,
                },
                searchResult:{
                    total: 0,
                    records:[]
                }
            }
        },
        methods:{
            search(){
                this.Api.Generator.search(this.searchRequest).then((data) => {
                    this.searchResult = data;
                });
            },
            linkToGeneratorDetail(item){
                this.$router.push({ name: 'generatorDetail', params: { generatorId: item.id }});
            }
        },
        mounted(){
            this.search();
            this.Api.User.get({id: this.$route.params.developerId}).then((data) => {
                this.developer = data;
            });
        }
    }
</script>

<style scoped lang="less">
    #generator-developer-home{
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