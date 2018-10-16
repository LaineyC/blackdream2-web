<template>
    <el-dialog
        title="构建"
        :show-close="false"
        @close="close"
        width="1000px"
        :close-on-press-escape="false"
        custom-class="generator-instance-make-modal"
        :visible.sync="isShow">
        <el-row style="height: 500px;overflow-y: hidden">
            <el-col :span="8" id="tree-panel">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <div>
                            <el-checkbox border size="small">全选</el-checkbox>
                        </div>
                   </div>
                    <div id="tree-body">
                        <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover">
                    <div slot="header" class="card-header-flex">
                        <div>
                           <el-form ref="form" :model="request" :rules="validRule" label-width="80px" size="small" inline :show-message="false">
                               <el-form-item prop="runFunction">
                                   <el-radio-group v-model="request.runFunction" size="small">
                                       <el-radio-button label="makeTest">测试</el-radio-button>
                                       <el-radio-button label="make">正式</el-radio-button>
                                   </el-radio-group>
                               </el-form-item>
                               <el-form-item prop="creationStrategyId">
                                   <el-select v-model="request.creationStrategyId" placeholder="请选择策略" size="small" style="margin-left: 10px">
                                       <el-option v-for="item in creationStrategyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                   </el-select>
                               </el-form-item>
                           </el-form>
                       </div>
                       <div>
                           <el-button @click="run" type="primary" size="small">运行</el-button>
                           <el-button @click="clear" size="small">清空</el-button>
                       </div>
                    </div>
                    <div id="result-body">
                        <div class="result-item" v-show="request.runFunction==='makeTest'" v-for="item in testResultList">
                            <el-card style="margin: 2px;" v-if="item.type==='test'">
                                <el-tree ref="tree" node-key="id" :data="item.data" :props="testTreeProps" default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
                            </el-card>
                            <el-card style="margin: 2px;" v-else-if="item.type==='message'">
                                <el-tree ref="tree" node-key="id" :data="item.data" :props="messageTreeProps" default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
                            </el-card>
                        </div>
                        <div class="result-item" v-show="request.runFunction==='make'" v-for="item in prodResultList">
                            <el-card style="margin: 2px;" v-if="item.type==='message'">
                                <el-tree ref="tree" node-key="id" :data="item.data" :props="messageTreeProps" default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
                            </el-card>
                            <el-card style="margin: 2px;" v-else-if="item.type==='prod'">
                                <el-button type="text" ><i class="el-icon-download"></i><a :href="downloadUrl(item.data.url)">{{item.data.fileName}}</a></el-button>
                            </el-card>
                        </div>
                    </div>
               </el-card>
           </el-col>
        </el-row>
        <div slot="footer">
            <el-button @click="close" type="primary">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "GeneratorInstanceMakeModal",
        data () {
            return {
                request:{
                    runFunction: "makeTest",
                    creationStrategyId: null,
                },
                validRule:{
                    creationStrategyId: [
                        { required: true, message: '请选择', trigger: 'blur' },],
                },
                isShow:false,
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                testTreeProps: {
                    children: 'children',
                    label: 'name'
                },
                messageTreeProps: {
                    children: 'children',
                    label: 'name'
                },
                creationStrategyList:[],
                testResultList:[],
                prodResultList:[]
            }
        },
        methods: {
            clear(){
                if(this.request.runFunction === "makeTest"){
                    this.testResultList = [];
                }
                else{
                    this.prodResultList = [];
                }
            },
            downloadUrl(url){
                return this.Config.serverUrl + "/web/generatorInstance/download?url=" + url;
            },
            download(url){
                //
            },
            run(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let request = {
                            id:this.generatorInstance.id,
                            creationStrategyId:this.request.creationStrategyId,
                        };
                        this.Api.GeneratorInstance[this.request.runFunction](request).then((data) => {
                            if(this.request.runFunction === "makeTest"){
                                if(data.errorMessageList.length){
                                    this.testResultList.push({
                                        type:"prod",
                                        data: data.errorMessageList
                                    });
                                }else{
                                    this.testResultList.push({
                                        type:"test",
                                        data: data.resultFileTree
                                    });
                                }

                            }
                            else{
                                if(data.errorMessageList.length){
                                    this.prodResultList.push({
                                        type:"prod",
                                        data: data.errorMessageList
                                    });
                                }
                                else{
                                    this.prodResultList.push({
                                        type:"prod",
                                        data: {url:data.url, fileName:data.fileName}
                                    });
                                }
                            }
                        });
                    }
                });

                //this.Api.GeneratorInstance.make();
            },
            open(config){
                this.treeData = config.treeData;
                this.generatorInstance = config.generatorInstance;
                this.isShow = true;
                this.Api.CreationStrategy.query({generatorId: this.generatorInstance.generator.id}).then((creationStrategyList) => {
                    this.creationStrategyList = [];
                    creationStrategyList.forEach(value => {
                        this.creationStrategyList.push(value);
                    });
                });
            },
            close(){
                this.isShow = false;
            }
        },
        mounted(){

        }
    }
</script>

<style lang="less">
    .generator-instance-make-modal{
        .el-col{
            padding: 1px;
        }
        .el-dialog__body{
            padding: 15px;
        }
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #tree-panel{
            height: 500px;
            overflow-y: auto;
        }
        #tree-body,
        #result-body{
            height: 432px;
            overflow-y: auto;
        }
        .result-item{
            .el-card__body{
                max-height: 424px;
                overflow-y: auto;
            }
        }
        .el-form-item{
            margin: 0;
        }
    }
</style>