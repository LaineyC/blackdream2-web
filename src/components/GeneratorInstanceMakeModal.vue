<template>
    <el-dialog

        :show-close="false"
        @close="close"
        width="900px"
        :close-on-press-escape="false"
        custom-class="generator-instance-make-modal"
        :visible.sync="isShow">
        <el-row style="height: 500px;overflow-y: hidden">
           <el-col :span="8" id="tree-panel">
               <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
               </el-tree>
           </el-col>
           <el-col :span="16">
               <el-card shadow="hover">
                   <div slot="header" class="card-header-flex">
                       <div>
                           <el-dropdown trigger="click">
                               <el-button size="small" type="primary">策略<i class="el-icon-arrow-down el-icon--right" style="font-size: inherit"></i></el-button>
                               <el-dropdown-menu slot="dropdown">
                                   <el-dropdown-item v-for="creationStrategy in creationStrategyList" :key="creationStrategy.id"><div @click="make(creationStrategy)">{{creationStrategy.name}}</div></el-dropdown-item>
                               </el-dropdown-menu>
                           </el-dropdown>
                           <el-button-group style="margin-left: 10px">
                               <el-button type="primary" size="small" @click="">测试</el-button>
                               <el-button @click="" type="primary" size="small">运行</el-button>
                           </el-button-group>
                           <el-button style="margin-left: 10px" type="primary" size="small" @click="">清空</el-button>
                       </div>
                   </div>
                  <div id="result">

                  </div>
               </el-card>
           </el-col>
        </el-row>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "GeneratorInstanceMakeModal",
        data () {
            return {
                isShow:false,
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                creationStrategyList:[],
            }
        },
        methods: {
            make(creationStrategy){
                //this.Api.GeneratorInstance.make();
            },
            makeTest(creationStrategy){
                //this.Api.GeneratorInstance.make();
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.GeneratorInstance.create(this.request).then((data) => {
                            this.$emit('on-success');
                            this.close();
                        });
                    }
                });
            },
            open(config){
                this.treeData = config.treeData;
                this.generatorId = config.generatorId;
                this.isShow = true;
            },
            close(){
                this.isShow = false;
            }
        },
        mounted(){/*
            this.Api.CreationStrategy.query({generatorId: generatorInstance.generator.id}).then((creationStrategyList) => {
                creationStrategyList.forEach(value => {
                    this.creationStrategyList.push(value);
                });
            });*/
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
        #tree-panel{
            height: 500px;
            overflow-y: auto;
        }
        #result{
            height: 420px;
            overflow-y: auto;
        }
    }
</style>