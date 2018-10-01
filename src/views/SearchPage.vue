<template>
    <div id="search-page" class="container">
        <el-row>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header">
                        <strong>排行</strong>
                    </div>
                    <CellGroup>
                        <Cell title="Only show titles">
                            <Badge :count="10" slot="extra" />
                        </Cell>
                        <Cell title="Only show titles">
                            <Badge :count="10" slot="extra" />
                        </Cell>
                        <Cell title="Only show titles">
                            <Badge :count="10" slot="extra" />
                        </Cell>
                        <Cell title="Only show titles">
                            <Badge :count="10" slot="extra" />
                        </Cell>
                        <Cell title="Only show titles">
                            <Badge :count="10" slot="extra" />
                        </Cell>
                    </CellGroup>
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
                                <el-breadcrumb>
                                    <el-breadcrumb-item :to="{ name: '/' }">{{item.user.username}}</el-breadcrumb-item>
                                    <el-breadcrumb-item :to="{ name: 'generatorDetail',params: { generatorId: item.id } }">{{item.name}}</el-breadcrumb-item>
                                </el-breadcrumb>
                                <el-button-group>
                                    <el-button size="mini" type="text" @click="showGeneratorInstanceCreateModal(item)">创建实例</el-button>
                                </el-button-group>
                            </div>
                            <p>{{item.description}}</p>
                            <p>
                                <span>{{item.engineType | enumFormat(Constant.TemplateEngineTypeEnum)}}</span>
                                <span> 最后更新 <Time :time="item.updateTime" :interval="60"/></span>
                            </p>
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
    </div>
</template>

<script>
    export default {
        name: "SearchPage",
        components:{
            GeneratorInstanceCreateModal:() => import('@/components/GeneratorInstanceCreateModal.vue')
        },
        data () {
            return {
                searchRequest:{
                    page: 1,
                    pageSize: 10,
                    name: null,
                    //status: 2,
                    engineType: null
                },
                searchResult:{
                    total: 0,
                    records:[]
                }
            }
        },
        methods:{
            showGeneratorInstanceCreateModal(item){
                this.$refs.generatorInstanceCreateModal.open({
                    generatorId:item.id
                })
            },
            handleGeneratorInstanceCreateSuccess(){
                this.$router.push({ name: 'generatorInstanceManage'});
            },
            search(){
                this.Api.Generator.search(this.searchRequest).then((data) => {
                    this.searchResult = data;
                });
            }
        },
        mounted(){
            this.searchRequest.name = this.$route.params.searchText;
            this.search();
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