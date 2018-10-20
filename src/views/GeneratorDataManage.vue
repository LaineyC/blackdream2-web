<template>
    <div id="generator-data-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-dropdown trigger="click">
                        <el-button size="small" type="success">新建</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="dataModel in schemeRuleMap['']" :key="dataModel.id"><div @click="create(null, dataModel)"><i :class="dataModel.iconStyle"></i> {{dataModel.name}}</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-button type="danger" size="small" @click="deleteAll">删除</el-button>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-button @click="showGeneratorInstanceMakeModal()" type="primary" size="small">构建</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                            <span><i :class="data.model.dataModel.iconStyle"></i> {{ node.label }}</span>
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link"><i class="el-icon-circle-plus"></i></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="dataModel in schemeRuleMap[data.model.dataModel.id]" :key="dataModel.id"><div @click="create(data, dataModel)"><i :class="dataModel.iconStyle"></i> {{dataModel.name}}</div></el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">
                    <el-tabs ref="tabs" type="card" @tab-click="clickTab">
                        <el-tab-pane :label="item.name" v-for="item in tabs" :key="item.id" :name="item.id" :class="'tab-pane-' + item.id">
                            <span slot="label"><i :class="item.model.dataModel.iconStyle"></i> {{item.name}}</span>
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
                                                        <el-checkbox v-model="item.model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"></el-checkbox>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                        <el-input v-model.number="item.model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"/>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                                                        <el-input v-model.number="item.model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"/>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                        <el-input v-if="!property.isEnum" v-model="item.model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"/>
                                                        <el-select v-else v-model="item.model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)">
                                                            <el-option v-for="enumItem in property.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value">
                                                        <el-date-picker v-model="item.model.properties[property.name].value" type="date" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value">
                                                        <el-time-picker v-model="item.model.properties[property.name].value" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"></el-time-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                                                        <el-date-picker v-model="item.model.properties[property.name].value" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)"></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[item.model.properties[property.name].value]?'info':''" :style="{ width: property.displayWidth ? (property.displayWidth - 56) + 'px' : '' }"
                                                                       size="small" @click="showDataModelChooseModal(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)">{{generatorDataCache[item.model.properties[property.name].value] ? generatorDataCache[item.model.properties[property.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(property.cascadeFunction, item.model.properties[property.name], item.model.properties, item.model)" icon="el-icon-close"></el-button>
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
                                                    <el-checkbox v-model="item.model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"></el-checkbox>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                    <el-input v-model.number="item.model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"/>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                                                    <el-input v-model.number="item.model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"/>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                    <el-input v-if="!group.model.isEnum" v-model="item.model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"/>
                                                    <el-select v-else v-model="item.model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)">
                                                        <el-option v-for="enumItem in group.model.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value">
                                                    <el-date-picker v-model="item.model.properties[group.model.name].value" type="date" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value">
                                                    <el-time-picker v-model="item.model.properties[group.model.name].value" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"></el-time-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                                                    <el-date-picker v-model="item.model.properties[group.model.name].value" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                    <el-button-group>
                                                        <el-button :type="generatorDataCache[item.model.properties[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small"
                                                                   @click="showDataModelChooseModal(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)">{{generatorDataCache[item.model.properties[group.model.name].value] ? generatorDataCache[item.model.properties[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(group.model.cascadeFunction, item.model.properties[group.model.name], item.model.properties, item.model)" icon="el-icon-close"></el-button>
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
                                    <div class="tupleList" style="width: 100%">
                                    <el-table class="field-table" :data="item.model.tupleList" row-key="id" style="width: 100%">
                                        <el-table-column type="index" width="28" class-name="sort-handle"></el-table-column>
                                        <el-table-column type="selection" width="25"></el-table-column>
                                        <el-table-column :width="group.isGroup ? '' : group.model.displayWidth" :label="group.name" v-for="group in dataModelCache[item.model.dataModel.id].fieldGroup" :key="group.id" :align="group.isGroup?'center':'left'">
                                            <el-table-column v-if="group.isGroup" v-for="field in group.children" :label="field.comment" :width="field.displayWidth">
                                                <template slot-scope="{ row, column, $index }">
                                                    <el-form-item v-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                        <el-checkbox v-model="row.tuple[field.name].value" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"></el-checkbox>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                        <el-input v-model.number="row.tuple[field.name].value" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"/>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                                                        <el-input v-model.number="row.tuple[field.name].value" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"/>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                        <el-input v-if="!field.isEnum" v-model="row.tuple[field.name].value" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"/>
                                                        <el-select v-else v-model="row.tuple[field.name].value" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)">
                                                            <el-option v-for="enumItem in field.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value">
                                                        <el-date-picker v-model="row.tuple[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" type="date" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value">
                                                        <el-time-picker v-model="row.tuple[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"></el-time-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                                                        <el-date-picker v-model="row.tuple[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)"></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row.tuple[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[row.tuple[field.name].value]?'info':''" :style="{ width: field.displayWidth ? (field.displayWidth - 56) + 'px' : '' }" size="small"
                                                                       @click="showDataModelChooseModal(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)">{{generatorDataCache[row.tuple[field.name].value] ? generatorDataCache[row.tuple[field.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(field.cascadeFunction, row.tuple[field.name], row.tuple, item.model)" icon="el-icon-close"></el-button>
                                                        </el-button-group>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                                    <el-checkbox v-model="row.tuple[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"></el-checkbox>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value">
                                                    <el-input v-model.number="row.tuple[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"/>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                                                    <el-input v-model.number="row.tuple[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"/>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                                    <el-input v-if="!group.model.name.isEnum" v-model="row.tuple[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"/>
                                                    <el-select v-else v-model="row.tuple[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)">
                                                        <el-option v-for="enumItem in group.model.name.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value">
                                                    <el-date-picker v-model="row.tuple[group.model.name].value" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" type="date" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value">
                                                    <el-time-picker v-model="row.tuple[group.model.name].value" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"></el-time-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                                                    <el-date-picker v-model="row.tuple[group.model.name].value" type="datetime" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.tuple[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                                    <el-button-group>
                                                        <el-button :type="!!generatorDataCache[row.tuple[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small"
                                                                   @click="showDataModelChooseModal(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)">{{generatorDataCache[row.tuple[group.model.name].value] ? generatorDataCache[row.tuple[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(group.model.cascadeFunction, row.tuple[group.model.name], row.tuple, item.model)" icon="el-icon-close"></el-button>
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
        <GeneratorInstanceMakeModal ref="generatorInstanceMakeModal"/>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        name: "GeneratorDataManage",
        components:{
            DataModelChooseModal:() => import('@/components/DataModelChooseModal.vue'),
            GeneratorInstanceMakeModal:() => import('@/components/GeneratorInstanceMakeModal.vue'),
        },
        data () {
            return {
                schemeRuleMap:{"":[]},
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
            cascadeFunction(fn, control, attribute, model){
                //("$control","$properties", "$data", "$global",
                fn && fn(control, attribute, model, this.global);
            },
            showGeneratorInstanceMakeModal(){
                if(!this.generatorInstance){
                    return;
                }
                this.$refs.generatorInstanceMakeModal.open({
                    generatorInstance:this.generatorInstance,
                    treeData:this.treeData
                })
            },
            handleDataModelChooseSuccess(item){
                if(!item){
                    return;
                }
                this.$set(this.currentChange.control, "value", item.id);
                this.currentChange.fn && this.currentChange.fn(this.currentChange.control, this.currentChange.attribute, this.currentChange.model, this.global);
            },
            showDataModelChooseModal(fn, control, attribute, model){
                this.currentChange = {fn,attribute,model,control};
                this.$refs.dataModelChooseModal.open({
                    currentKey:control.value,
                    treeData:this.treeData
                })
            },
            clearDataModelChoose(fn, control, attribute, model){
                this.$set(control, "value", null);
                fn && fn(control, attribute, model, this.global);
            },
            create(parent, dataModel){
                let id = this.incrementer.next();
                let model = {
                    //id: "$" + id,
                    name: "新建" + dataModel.name + id,
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
                        dataModel: dataModel,
                        parent: parent,
                        properties: model.properties,
                        tupleList: model.tupleList
                    };
                    this.generatorDataCache[m.id] = m;
                    let item = this.wrapToItem(m);
                    this.addToTreeData(item, parent);
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
                        let parent = model.parent;
                        this.Api.GeneratorData.update({
                            id:model.id,
                            name: model.name,
                            parentId:parent ? parent.id : null,
                            properties: model.properties,
                            tupleList: tupleList
                        }).then((data) => {
                            item.name = model.name;
                            item.isDirty = false;
                            this.removeFromTreeData(item);
                            this.addToTreeData(item, parent != null ? this.$refs.tree.getNode(parent.id).data : null);
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
                    let dataModel = this.dataModelCache[model.dataModel.id];
                    item.model.properties = this.compatibleProperty(model.properties, dataModel);
                    model.tupleList.forEach(tuple => {
                        item.model.tupleList.push({
                            id:this.Method.generateId(),
                            tuple:this.compatibleTuple(tuple, dataModel)
                        });
                    });
                    item.isLoaded = true;
                    this.addToTab(item);
                    this.selectTab(item);
                    this.rowDrop(item);
                });
            },
            //后添加的属性也能兼容
            compatibleProperty(properties, dataModel){
                dataModel.propertyList.forEach(property => {
                    if(!(property.name in properties)){
                        properties[property.name] = {
                            dataType:property.dataType,
                            value: property.defaultValue === null || property.defaultValue === undefined ? null : property.defaultValue,
                        }
                    }
                });
                return properties;
            },
            //后添加的字段也能兼容
            compatibleTuple(tuple, dataModel){
                dataModel.fieldList.forEach(field => {
                    if(!(field.name in tuple)) {
                        tuple[field.name] = {
                            dataType: field.dataType,
                            value: field.defaultValue === null || field.defaultValue === undefined ? null : field.defaultValue,
                        }
                    }
                });
                return tuple;
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
            buildValidRuleList(attribute){
                let dateType = attribute.dateType;
                let ruleMap = attribute.ruleMap = {};
                let ruleList = ruleMap[dateType] = [];
                if(dateType === this.Constant.DataModelAttributeDataTypeEnum.NONE.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value){
                    //{ required: true, message: '请填写字段名称', trigger: 'blur' },
                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.INTEGER.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.DECIMAL.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.STRING.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.DATE.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.TIME.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.DATETIME.value){

                }
                else if(dateType === this.Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value){

                }
            }
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
                this.generatorInstance = generatorInstance;
                let infoQueryRequest = this.Api.DataModel.infoQuery({generatorId: generatorInstance.generator.id, fetchLazy:false});
                let treeRequest = this.Api.GeneratorData.tree({generatorInstanceId: this.generatorInstanceId});
                let schemeRequest = this.Api.DataModelSchema.get({generatorId: generatorInstance.generator.id});
                this.$http.all([infoQueryRequest, treeRequest, schemeRequest])
                .then(([dataModelList, generatorDataTree, scheme]) => {
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
                            if(property.cascadeScript){
                                property.cascadeFunction = new Function("$control","$properties", "$data", "$global", property.cascadeScript);
                            }

                            this.buildValidRuleList(property);
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
                            if(field.cascadeScript){
                                field.cascadeFunction = new Function("$control", "$tuple", "$data", "$global", field.cascadeScript);
                            }

                            this.buildValidRuleList(field);
                        });
                    });
                    this.schemeRuleMap = {};
                    let schemeRuleMap = scheme.ruleMap || {};
                    for(let k in schemeRuleMap){
                        let ruleArray = [];
                        if(k in this.dataModelCache || k === ""){
                            schemeRuleMap[k].forEach(value => {
                                if(value in this.dataModelCache){
                                    ruleArray.push(this.dataModelCache[value]);
                                }
                            });
                            this.schemeRuleMap[k] = ruleArray;
                        }
                    }

                    let that = this;
                    this.generatorDataCache = {};
                    let init = function(children, parent){
                        children.forEach(child => {
                            child.dataModel = that.dataModelCache[child.dataModel.id];
                            let item = that.wrapToItem(child);
                            that.addToTreeData(item, parent);
                            init(child.children, item);
                            that.generatorDataCache[child.id] = child;
                        });
                    };
                    init(generatorDataTree);
                    this.global = {
                        dataCache:this.generatorDataCache
                    };
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
            //overflow: visible;
        }
        .el-table__body-wrapper .cell{
            overflow: visible;
        }
        .el-table__body-wrapper table{
            padding-bottom: 40px;
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