<template>
    <div id="generator-instance-manage" class="container">
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
                                <el-input v-model="searchRequest.name" type="text" placeholder="输入名称搜索" clearable></el-input>
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
                                    <el-link type="primary" @click="linkToGeneratorDataManage(item)"><strong>{{item.name}}</strong></el-link>
                                </div>
                                <el-button-group>
                                    <el-button size="mini" type="primary" @click="showGeneratorInstanceUpdateModal(item)">编辑</el-button>
                                    <el-button size="mini" :disabled="item.generator.status===Constant.GeneratorStatusEnum.DEVELOP.value&&item.generator.user.id!==Auth.body.id" type="success" @click="linkToGeneratorDataManage(item)">工作台</el-button>
                                    <el-button size="mini" type="danger" @click="deleteItem(item)">删除</el-button>
                                </el-button-group>
                            </div>
                            <p>{{item.description}}</p>
                            <p>所属生成器  <el-link type="primary" @click="linkToGeneratorDetail(item)"><strong>{{item.generator.name}}</strong></el-link></p>
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
        <GeneratorInstanceUpdateModal ref="generatorInstanceUpdateModal" @on-success="handleGeneratorInstanceUpdateSuccess" />
    </div>
</template>

<script>
    export default {
        name: "GeneratorInstance",
        components:{
            GeneratorInstanceUpdateModal:() => import('@/components/GeneratorInstanceUpdateModal.vue')
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
            handleGeneratorInstanceUpdateSuccess(){
                this.search();
            },
            showGeneratorInstanceUpdateModal(item){
                this.$refs.generatorInstanceUpdateModal.open({
                    generatorInstanceId:item.id
                });
            },
            linkToGeneratorDataManage(item){
                this.$router.push({ name: 'generatorDataManage', params: { generatorInstanceId: item.id }});
            },
            linkToGeneratorDetail(item){
                this.$router.push({ name: 'generatorDetail', params: { generatorId: item.generator.id }});
            },
            search(){
                this.Api.GeneratorInstance.infoSearch(this.searchRequest).then((data) => {
                    this.searchResult = data;
                });
            },
            deleteItem(item){
                this.$confirm('确定删除所选？', {type: 'warning'})
                .then(() => {
                    this.Api.GeneratorInstance.delete({id:item.id}).then((data) => {
                        this.$message({type: 'success', message: '删除成功！'});
                    });
                });
            }
        },
        mounted(){
            this.search();
        }
    }
</script>

<style scoped lang="less">
    #generator-instance-manage{
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