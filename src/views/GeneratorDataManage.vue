<template>
    <div id="generator-data-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-dropdown trigger="click">
                        <el-button size="small" type="success">新建<i class="el-icon-arrow-down el-icon--right" style="font-size: inherit"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="dataModel in dataModelList" :key="dataModel.id"><div @click="create(null, dataModel)">{{dataModel.name}}</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-button type="danger" size="small" @click="deleteAll">删除</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                            <strong v-if="!data.model">{{ node.label }}</strong>
                            <span v-else>{{ node.label }}</span>
                            <span>
                                <el-button v-if="!data.model" type="text" size="mini" @click.stop="create(data)">添加</el-button>
                            </span>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">

                </div>
            </Split>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        name: "GeneratorDataManage",
        components: {
        },
        data () {
            return {
                incrementer: this.Method.newIncrementer(),
                split: 0.15,
                generatorInstanceId:this.$route.params.generatorInstanceId,
                tabs:[],
                currentTabItem:{},
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                dataModelList:[],
                validRule: {

                }
            }
        },
        methods:{
            create(parent, dataModel){
                let id = this.incrementer.next();
                let model = {
                    //id: "$" + id,
                    name: "新建数据" + id,
                    generatorInstanceId: this.generatorInstanceId,
                    dataModelId: dataModel.id,
                    parentId: !parent ? null : parent.id,
                    properties: {},
                    tupleList: []
                };
                this.Api.GeneratorData.create(model).then((data) => {
                    model.id = data.id;
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                    this.selectNode(item);
                    this.$message({type: 'success', message: '创建成功！'});
                });
            },
            setDirty(item){
                item.isDirty = true;
            },
            update(item){
                this.$refs['form' + item.id][0].validate((valid) => {
                    if (valid) {
                        this.Api.GeneratorData.update(item.model).then((data) => {
                            item.name = item.model.name;
                            item.isDirty = false;
                            this.removeFromTreeData(item);
                            this.addToTreeData(item);
                            this.$refs.tree.setCurrentKey(item.id);
                            this.$message({type: 'success', message: '保存成功！'});
                        });
                    }
                });
            },
            deleteAll(){
                let ids = this.$refs.tree.getCheckedKeys(true);
                if(!ids.length){
                    return;
                }
                this.$confirm('确定删除所选？', {type: 'warning'})
                    .then(() => {
                        this.Api.GeneratorData.delete({idList:ids}).then((data) => {
                            let isCurrentIn = false;
                            ids.forEach(id => {
                                this.$refs.tree.remove(id);
                                this.removeFromTab(id);
                                if(this.currentTabItem != null && this.currentTabItem.id === id && !isCurrentIn){
                                    isCurrentIn = true;
                                }
                            });
                            if(isCurrentIn && this.tabs.length > 0){
                                this.selectNode(this.tabs[0]);
                            }
                            this.$message({type: 'success', message: '删除成功！'});
                        });
                    });
            },
            selectNode(item){
                if(item.isLoaded != null && item.isLoaded){
                    this.addToTab(item);
                    this.selectTab(item);
                    return;
                }
                this.Api.GeneratorData.get({id: item.model.id}).then((model) => {
                    item.model.properties = model.properties;
                    item.model.tupleList = model.tupleList;
                    item.isLoaded = true;
                    this.addToTab(item);
                    this.selectTab(item);
                    this.rowDrop(item);
                });
            },
            selectTab(item){
                this.currentTabItem = item;
            },
            addToTab(item){
                let result = this.tabs.filter(value => {
                    return value.id === item.id;
                });
                if(result.length === 0){
                    this.tabs.push(item);
                }
            },
            removeFromTab(item){
                let index = -1;
                index = this.tabs.indexOf(item);
                if (index > -1) {
                    this.tabs.splice(index, 1);
                }
            },
            wrapToItem(model){
                return {
                    isDirty:false,
                    isLoaded:false,
                    id: model.id,
                    name: model.name,
                    model: model,
                    children: []
                };
            },
            addToTreeData(item, parent){
                let children = !parent ? this.treeData : parent.children;
                if(children.length === 0){
                    this.$refs.tree.append(item, parent);
                    return;
                }
                for(let i = 0 ; i < children.length ; i++){
                    let child = children[i];
                    if(item.name === child.name){
                        this.$refs.tree.insertAfter(item, child);
                        return;
                    }
                    else if(item.name < child.name){
                        this.$refs.tree.insertBefore(item, child);
                        return;
                    }
                    else if(i + 1 === children.length){
                        this.$refs.tree.append(item);
                        return;
                    }
                }
            },
            removeFromTreeData(item){
                this.$refs.tree.remove(item);
            },
            addTuple(item){
                item.model.tupleList.push({
                    id:this.Method.generateId(),
                });
            },
            removeTuple(item, property, index){
                let tupleList = item.model.tupleList;
                tupleList.splice(index, 1);
            },
        },
        computed:{
            //dataModel
        },
        mounted(){
            this.Api.GeneratorInstance.get({id: this.generatorInstanceId}).then((generatorInstance) => {
                //this.generatorInstance = generatorInstance;
                let infoQueryRequest = this.Api.DataModel.infoQuery({generatorId: generatorInstance.generator.id, fetchLazy:false});
                let treeRequest = this.Api.GeneratorData.tree({generatorInstanceId: this.generatorInstanceId});
                this.$http.all([infoQueryRequest, treeRequest])
                .then(([dataModelList, generatorDataTree]) => {
                    this.dataModelCache = {};
                    this.dataModelList = dataModelList;
                    dataModelList.forEach(model => {
                        this.dataModelCache[model.id] = model;
                    });

                    let that = this;
                    let init = function(children, parent){
                        children.forEach(child => {
                            let item = that.wrapToItem(child);
                            init(child.children, item);
                            that.addToTreeData(item, parent);
                        });
                    };
                    init(generatorDataTree);
                });
            });
        }
    }
</script>

<style scoped lang="less">
    #generator-data-manage{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        .menu-list{
            position: absolute;
            top: 0;
            width: 100%;
        }
        .split-box{
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .left-split-pane{
            padding: 0;
            height: 100%;
            overflow-y: auto;
        }
        .right-split-pane{
            padding: 5px 1px 1px 6px;
            height: 100%;
            overflow-y: auto;
        }
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
        .tab-pane {
            position: relative;
            padding-top: 10px;
            height: 100%;
        }
    }
</style>
<style lang="less">
    #generator-data-manage{
        .el-table td, .el-table th{
            padding: 5px 0;
        }
        .el-table .cell{
            padding: 0 5px;
        }
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
            margin-right: 0;
        }
        .el-table, .el-table .cell, .el-table__body-wrapper, .el-card{
            overflow: inherit;
        }
        .el-popover{
            padding: 1px;
        }
        .el-card__header{
            padding: 10px;
        }
        .el-card__body{
            padding: 5px;
            .el-form-item--small.el-form-item, .el-form-item--mini.el-form-item{
                margin: 0;
            }
        }
        .sort-handle{
            cursor: move;
        }
    }
</style>