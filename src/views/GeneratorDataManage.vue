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
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button type="text" size="mini" @click.stop="create(data)">添加</el-button>
                            </span>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">
                    <el-tabs ref="tabs" type="card" @tab-click="clickTab">
                        <el-tab-pane :label="item.name" v-for="item in tabs" :key="item.id" :name="item.id" :class="'tab-pane-' + item.id">
                            <el-form :ref="'form' + item.id" :model="item.model" inline :rules="validRule" size="small">
                                <div class="properties">
                                    <template v-for="group in dataModelCache[item.model.dataModel.id].propertyGroup">
                                        <div v-if="group.isGroup">
                                            <div class="group-label">
                                                <el-form-item>{{group.name}}</el-form-item>
                                            </div>
                                            <div class="group-item" v-for="property in group.children" :key="property.id">
                                                <div class="group-label" style="margin-left: 5px;">
                                                     <el-form-item>{{property.comment}}</el-form-item>
                                                </div>
                                                <div class="group-item" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }">
                                                    <el-form-item v-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                        <el-checkbox v-model="item.model.properties[property.name].value"></el-checkbox>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                        <el-input v-model.number="item.model.properties[property.name].value" />
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.FLOAT.value">
                                                        <el-input v-model.number="item.model.properties[property.name].value" />
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                        <el-input v-if="!property.isEnum" v-model="item.model.properties[property.name].value" />
                                                        <el-select v-else v-model="item.model.properties[property.name].value">
                                                            <el-option v-for="enumItem in property.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[item.model.properties[property.name].value]?'info':''" :style="{ width: property.displayWidth ? (property.displayWidth - 56) + 'px' : '' }" size="small" @click="showDataModelChooseModal(item.model.properties[property.name])">{{generatorDataCache[item.model.properties[property.name].value] ? generatorDataCache[item.model.properties[property.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(item.model.properties[field.name])" icon="el-icon-close"></el-button>
                                                        </el-button-group>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="group-label">
                                                <el-form-item>{{group.model.comment}}</el-form-item>
                                            </div>
                                            <div class="group-item">
                                                <el-form-item v-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                    <el-checkbox v-model="item.model.properties[group.model.name].value"></el-checkbox>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                    <el-input v-model.number="item.model.properties[group.model.name].value" />
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.FLOAT.value">
                                                    <el-input v-model.number="item.model.properties[group.model.name].value" />
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                    <el-input v-if="!group.model.isEnum" v-model="item.model.properties[group.model.name].value" />
                                                    <el-select v-else v-model="item.model.properties[group.model.name].value">
                                                        <el-option v-for="enumItem in group.model.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                    <el-button-group>
                                                        <el-button :type="generatorDataCache[item.model.properties[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small" @click="showDataModelChooseModal(item.model.properties[group.model.name])">{{generatorDataCache[item.model.properties[group.model.name].value] ? generatorDataCache[item.model.properties[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(item.model.properties[group.model.name])" icon="el-icon-close"></el-button>
                                                    </el-button-group>
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <el-card shadow="hover">
                                    <el-button-group slot="header">
                                        <el-button type="primary" size="mini" @click="update(item)">保存</el-button>
                                        <el-button type="success" size="mini" @click="addTuple(item)">添加记录</el-button>
                                    </el-button-group>
                                    <div class="tupleList">
                                    <el-table class="field-table" :data="item.model.tupleList" row-key="id" style="width: 100%">
                                        <el-table-column type="index" width="28" class-name="sort-handle"></el-table-column>
                                        <el-table-column type="selection" width="25"></el-table-column>
                                        <el-table-column :width="group.isGroup ? '' : group.model.displayWidth" :label="group.name" v-for="group in dataModelCache[item.model.dataModel.id].fieldGroup" :key="group.id" :align="group.isGroup?'center':'left'">
                                            <el-table-column v-if="group.isGroup" v-for="field in group.children" :label="field.comment" :width="field.displayWidth">
                                                <template slot-scope="{ row, column, $index }">
                                                    <el-form-item v-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                        <el-checkbox v-model="row.tuple[field.name].value"></el-checkbox>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                        <el-input v-model.number="row.tuple[field.name].value" />
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.FLOAT.value">
                                                        <el-input v-model.number="row.tuple[field.name].value" />
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                        <el-input v-if="!field.isEnum" v-model="row.tuple[field.name].value" />
                                                        <el-select v-else v-model="row.tuple[field.name].value">
                                                            <el-option v-for="enumItem in field.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[row.tuple[field.name].value]?'info':''" :style="{ width: field.displayWidth ? (field.displayWidth - 56) + 'px' : '' }" size="small" @click="showDataModelChooseModal(row.tuple[field.name])">{{generatorDataCache[row.tuple[field.name].value] ? generatorDataCache[row.tuple[field.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(row.tuple[field.name])" icon="el-icon-close"></el-button>
                                                        </el-button-group>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                    <el-checkbox v-model="row.tuple[group.model.name].value"></el-checkbox>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                    <el-input v-model.number="row.tuple[group.model.name].value" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.FLOAT.value">
                                                    <el-input v-model.number="row.tuple[group.model.name].value" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                    <el-input v-if="!group.model.name.isEnum" v-model="row.tuple[group.model.name].value" />
                                                    <el-select v-else v-model="row.tuple[group.model.name].value">
                                                        <el-option v-for="enumItem in group.model.name.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                    <el-button-group>
                                                        <el-button :type="!!generatorDataCache[row.tuple[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small" @click="showDataModelChooseModal(row.tuple[group.model.name])">{{generatorDataCache[row.tuple[group.model.name].value] ? generatorDataCache[row.tuple[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(row.tuple[group.model.name])" icon="el-icon-close"></el-button>
                                                    </el-button-group>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>

                                        <el-table-column label="操作" width="80">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-button type="danger" size="small" @click="removeTuple(item, row, $index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    </div>
                                </el-card>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </Split>
        </div>
        <DataModelChooseModal ref="dataModelChooseModal" @on-success="handleDataModelChooseSuccess"/>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        name: "GeneratorDataManage",
        components:{
            DataModelChooseModal:() => import('@/components/DataModelChooseModal.vue'),
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
            handleDataModelChooseSuccess(item){
                if(!item){
                    return;
                }
                //this.currentControl.value = item.id;
                this.$set(this.currentControl, "value", item.id);
            },
            showDataModelChooseModal(control){
                this.currentControl = control;
                this.$refs.dataModelChooseModal.open({
                    currentKey:control.value,
                    treeData:this.treeData
                })
            },
            clearDataModelChoose(control){
                this.$set(control, "value", null);
            },
            create(parent, dataModel){
                let id = this.incrementer.next();
                let model = {
                    //id: "$" + id,
                    name: dataModel.name + id,
                    generatorInstanceId: this.generatorInstanceId,
                    dataModelId: dataModel.id,
                    parentId: !parent ? null : parent.id,
                    properties: this.buildProperties(dataModel),
                    tupleList: []
                };
                model.properties[dataModel.primaryProperty.name].value = model.name;
                this.Api.GeneratorData.create(model).then((data) => {
                    let m = {
                        id: data.id,
                        name: model.name,
                        generatorInstance: {id:model.generatorInstanceId},
                        dataModel: {id:model.dataModelId},
                        parent: {id:model.parentId},
                        properties: model.properties,
                        tupleList: model.tupleList
                    };
                    let item = this.wrapToItem(m);
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
                        let model = item.model;
                        let dataModel = this.dataModelCache[model.dataModel.id];
                        let tupleList = [];
                        model.tupleList.forEach(tuple => {
                            tupleList.push(tuple.tuple);
                        });
                        model.name = model.properties[dataModel.primaryProperty.name].value;
                        this.Api.GeneratorData.update({
                            id:model.id,
                            name: model.name,
                            properties: model.properties,
                            tupleList: tupleList
                        }).then((data) => {
                            item.name = model.name;
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
                    model.tupleList.forEach(tuple => {
                        item.model.tupleList.push({
                            id:this.Method.generateId(),
                            tuple:tuple
                        });
                    });
                    item.isLoaded = true;
                    this.addToTab(item);
                    this.selectTab(item);
                    this.rowDrop(item);
                });
            },
            clickTab(tab){
                let index = this.tabs.findIndex(item => item.id === tab.name);
                if(index !== -1){
                    this.currentTabItem = this.tabs[index];
                }
            },
            selectTab(item){
                this.$refs.tabs.setCurrentName(item.id);
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
                let dataModel = this.dataModelCache[item.model.dataModel.id];
                let fieldList = dataModel.fieldList;
                let tuple = {};
                fieldList.forEach(field => {
                    tuple[field.name] = {
                        dataType:field.dataType,
                        value: field.defaultValue === null || field.defaultValue === undefined ? null : field.defaultValue,
                    }
                });
                item.model.tupleList.push({
                    id: this.Method.generateId(),
                    tuple:tuple
                });
            },
            removeTuple(item, tuple, index){
                let tupleList = item.model.tupleList;
                tupleList.splice(index, 1);
            },
            buildProperties(dataModel){
                let propertyList = dataModel.propertyList;
                let properties = {};
                propertyList.forEach(property => {
                    properties[property.name] = {
                        dataType:property.dataType,
                        value: property.defaultValue === null || property.defaultValue === undefined ? null: property.defaultValue,
                    }
                });
                return properties;
            },
            rowDrop(item) {
                this.$nextTick(function () {
                    const tupleTbody = document.querySelector('.tab-pane-' + item.id + ' .field-table .el-table__body-wrapper tbody');
                    Sortable.create(tupleTbody, {
                        animation:100,
                        handle:".sort-handle",
                        onEnd({ newIndex, oldIndex }) {
                            const currRow = item.model.tupleList.splice(oldIndex, 1)[0];
                            item.model.tupleList.splice(newIndex, 0, currRow)
                        }
                    });
                });
            },
        },
        computed:{/*
            dataModelCache(){
                let cache = {};
                this.dataModelList.forEach(value => {
                    cache[value.id] = value;
                });
                return cache;
            }*/
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

                        let propertyGroupPrevious = null;
                        model.propertyGroup = [];
                        model.propertyList.forEach(property => {
                            let displayGroup = property.displayGroup;
                            if(displayGroup !== undefined && displayGroup !== null && displayGroup !== ""){
                                if(propertyGroupPrevious != null && propertyGroupPrevious.isGroup && propertyGroupPrevious.name === displayGroup){
                                    propertyGroupPrevious.children.push(property);
                                }
                                else{
                                    propertyGroupPrevious = {
                                        id:this.Method.generateId(),
                                        name:displayGroup,
                                        isGroup:true,
                                        children:[property]
                                    };
                                    model.propertyGroup.push(propertyGroupPrevious);
                                }
                            }
                            else{
                                let comment = property.comment;
                                propertyGroupPrevious = {
                                    id:this.Method.generateId(),
                                    name:comment,
                                    isGroup:false,
                                    model:property
                                };
                                model.propertyGroup.push(propertyGroupPrevious);
                            }

                            if(property.isPrimary){
                                model.primaryProperty = property;
                            }
                        });

                        let fieldGroupPrevious = null;
                        model.fieldGroup = [];
                        model.fieldList.forEach(field => {
                            let displayGroup = field.displayGroup;
                            if(displayGroup !== undefined && displayGroup !== null && displayGroup !== ""){
                                if(fieldGroupPrevious != null && fieldGroupPrevious.isGroup && fieldGroupPrevious.name === displayGroup){
                                    fieldGroupPrevious.children.push(field);
                                }
                                else{
                                    fieldGroupPrevious = {
                                        id:this.Method.generateId(),
                                        name:displayGroup,
                                        isGroup:true,
                                        children:[field]
                                    };
                                    model.fieldGroup.push(fieldGroupPrevious);
                                }
                            }
                            else{
                                let comment = field.comment;
                                fieldGroupPrevious = {
                                    id:this.Method.generateId(),
                                    name:comment,
                                    isGroup:false,
                                    model:field
                                };
                                model.fieldGroup.push(fieldGroupPrevious);
                            }
                        });
                    });

                    let that = this;
                    this.generatorDataCache = {};
                    let init = function(children, parent){
                        children.forEach(child => {
                            let item = that.wrapToItem(child);
                            init(child.children, item);
                            that.addToTreeData(item, parent);
                            that.generatorDataCache[child.id] = child;
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
        .properties .el-form-item{
            margin-left: 10px;
        }
        .el-tabs {
            position: relative;
            height: 100%;
            overflow: hidden;
            .el-tabs__content {
                position: absolute;
                width: 100%;
                top: 55px;
                bottom: 0;
                .el-tab-pane {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    bottom: 0;
                    overflow-y: auto;
                }
            }
            .group-label, .group-item{
                display: inline-block;
            }

            .properties .el-form-item,
            .tupleList .el-form-item,
            .tupleList .el-form-item__content{
                width: 100%;
            }
        }
    }
</style>