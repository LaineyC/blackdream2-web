<template>
    <div id="data-model-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-button @click="create()" type="success" size="small">新建</el-button>
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
                    <div v-for="item in tabs" :key="item.id" v-show="item===currentTabItem" class="tab-pane" :class="'tab-pane-' + item.id">
                        <el-form :ref="'form' + item.id" label-width="80px" :model="item.model" :rules="validRule" inline size="small">
                            <el-form-item label=" " label-width="20px">
                                <el-button type="primary" size="mini" @click="update(item)">保存</el-button>
                            </el-form-item>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="item.model.name" placeholder="" />
                            </el-form-item>
                            <el-form-item label="图标" prop="iconStyle">
                                <el-popover placement="bottom" width="400" trigger="click">
                                    <el-button :icon="icon"  v-for="icon in iconStyleList" :key="icon" @click="item.model.iconStyle=icon"></el-button>
                                    <el-button slot="reference"> <i :class="item.model.iconStyle"></i></el-button>
                                </el-popover>
                            </el-form-item>
                            <el-card shadow="hover">
                                <el-button-group slot="header">
                                    <el-button type="success" size="mini" @click="addProperty(item)">添加属性</el-button>
                                </el-button-group>
                                <el-table class="property-table" :data="item.model.propertyList" row-key="id" style="width: 100%">
                                    <el-table-column type="index" width="45" class-name="sort-handle">
                                    </el-table-column>
                                    <el-table-column label="显示设置" align="center">
                                        <el-table-column prop="displayGroup" label="显示分组">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'propertyList.' + $index + '.displayGroup'" :rules="validRule.property.displayGroup">
                                                    <el-input v-model="row.displayGroup" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="comment" label="显示标题">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'propertyList.' + $index + '.comment'" :rules="validRule.property.comment">
                                                    <el-input v-model="row.comment" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="displayWidth" label="显示宽度">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'propertyList.' + $index + '.displayWidth'" :rules="validRule.property.displayWidth">
                                                    <el-input v-model.number="row.displayWidth" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="displayType" label="显示方式" width="125">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item>
                                                    <el-select v-model="row.displayType">
                                                        <el-option v-for="item in Constant.DataModelAttributeDisplayTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="数据设置" align="center">
                                        <el-table-column prop="name" label="属性名称">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'propertyList.' + $index + '.name'" :rules="validRule.property.name">
                                                    <el-input v-model="row.name" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="dataType" label="数据类型" width="125">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item>
                                                    <el-select v-model="row.dataType">
                                                        <el-option v-for="item in Constant.DataModelAttributeDataTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="defaultValue" label="默认值">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-select v-model="row.defaultValue">
                                                        <el-option v-for="item in [{'label':'Null','value':null},{'label':'True','value':true},{'label':'False','value':false}]" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value || row.dataType===Constant.DataModelAttributeDataTypeEnum.NUMBER.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value || row.dataType===Constant.DataModelAttributeDataTypeEnum.NUMBER.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-if="!row.isEnum" v-model="row.defaultValue" />
                                                    <el-select v-else v-model="row.defaultValue">
                                                        <el-option v-for="enumItem in row.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column prop="displayGroup" label="验证规则" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="mini" @click="showDataModelValidateEditModal(item, row)">设置</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="级联脚本" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="mini" @click="showDataModelCascadeScriptEditModal(item, row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="danger" size="mini" @click="removeProperty(item, row, $index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                            <br/>
                            <el-card shadow="hover">
                                <el-button-group slot="header">
                                    <el-button type="success" size="mini" @click="addField(item)">添加字段</el-button>
                                </el-button-group>
                                <el-table class="field-table" :data="item.model.fieldList" row-key="id" style="width: 100%">
                                    <el-table-column type="index" width="45" class-name="sort-handle">
                                    </el-table-column>
                                    <el-table-column label="显示设置" align="center">
                                        <el-table-column prop="displayGroup" label="显示分组">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.displayGroup'" :rules="validRule.field.displayGroup">
                                                    <el-input v-model="row.displayGroup" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="comment" label="显示标题">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.comment'" :rules="validRule.field.comment">
                                                    <el-input v-model="row.comment" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="displayWidth" label="显示宽度">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.displayWidth'" :rules="validRule.field.displayWidth">
                                                    <el-input v-model.number="row.displayWidth" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="displayType" label="显示方式" width="125">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item>
                                                    <el-select v-model="row.displayType">
                                                        <el-option v-for="item in Constant.DataModelAttributeDisplayTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="数据设置" align="center">
                                        <el-table-column prop="name" label="字段名称">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.name'" :rules="validRule.field.name">
                                                    <el-input v-model="row.name" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="dataType" label="数据类型" width="125">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item>
                                                    <el-select v-model="row.dataType">
                                                        <el-option v-for="item in Constant.DataModelAttributeDataTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="defaultValue" label="默认值">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-select v-model="row.defaultValue">
                                                        <el-option v-for="item in [{'label':'Null','value':null},{'label':'True','value':true},{'label':'False','value':false}]" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value || row.dataType===Constant.DataModelAttributeDataTypeEnum.NUMBER.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value || row.dataType===Constant.DataModelAttributeDataTypeEnum.NUMBER.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-if="!row.isEnum" v-model="row.defaultValue" />
                                                    <el-select v-else v-model="row.defaultValue">
                                                        <el-option v-for="enumItem in row.enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column prop="displayGroup" label="验证规则" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="mini" @click="showDataModelValidateEditModal(item, row)">设置</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="级联脚本" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="mini" @click="showDataModelCascadeScriptEditModal(item, row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="danger" size="mini" @click="removeField(item, row, $index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-form>
                    </div>
                </div>
            </Split>
        </div>
        <DataModelValidateEditModal ref="dataModelValidateEditModal"/>
        <DataModelCascadeScriptEditModal ref="dataModelCascadeScriptEditModal" />
    </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor'
    import 'brace/ext/language_tools'
    import 'brace/mode/javascript'
    import 'brace/theme/chrome'
    import Sortable from 'sortablejs'

    export default {
        name: "DataModelManage",
        components: {
            AceEditor,
            DataModelValidateEditModal:() => import('@/components/DataModelValidateEditModal.vue'),
            DataModelCascadeScriptEditModal:() => import('@/components/DataModelCascadeScriptEditModal.vue')
        },
        data () {
            return {
                idIncrement : 1,
                split: 0.15,
                generatorId:this.$route.params.generatorId,
                tabs:[],
                currentTabItem:{},
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                iconStyleList:["el-icon-star-on","el-icon-location", "el-icon-tickets", "el-icon-bell","el-icon-picture"],
                validRule: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { type: 'string', max: 255, message: '名称长度不能大于255', trigger: 'blur' }
                    ],
                    iconStyle: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { type: 'string', max: 255, message: '名称长度不能大于255', trigger: 'blur' }
                    ],
                    property:{
                        displayGroup: [
                            { type: 'string', max: 255, message: '显示分组长度不能大于255', trigger: 'blur' }
                        ],
                        comment: [
                            { required: true, message: '请填写显示标题', trigger: 'blur' },
                            { type: 'string', max: 255, message: '显示标题长度不能大于255', trigger: 'blur' }
                        ],
                        displayWidth: [
                            { type:"number", min: 0, max: 1000, message: '请输入0到1000的数字', trigger: 'blur' }
                        ],
                        name: [
                            { required: true, message: '请填写属性名称', trigger: 'blur' },
                            { type: 'string', max: 255, message: '属性名称长度不能大于255', trigger: 'blur' }
                        ],
                        defaultValue: [

                        ],
                    },
                    field:{
                        displayGroup: [
                            { type: 'string', max: 255, message: '显示分组长度不能大于255', trigger: 'blur' }
                        ],
                        comment: [
                            { required: true, message: '请填写显示标题', trigger: 'blur' },
                            { type: 'string', max: 255, message: '显示标题长度不能大于255', trigger: 'blur' }
                        ],
                        displayWidth: [
                            { type:"number", min: 0, max: 1000, message: '请输入0到1000的数字', trigger: 'blur' }
                        ],
                        name: [
                            { required: true, message: '请填写字段名称', trigger: 'blur' },
                            { type: 'string', max: 255, message: '字段名称长度不能大于255', trigger: 'blur' }
                        ],
                        defaultValue: [

                        ],
                    }
                }
            }
        },
        methods:{
            newId(){
                return this.idIncrement++;
            },
            create(){
                let id = this.newId();
                let model = {
                    id: "$" + id,
                    name: "新建模型" + id,
                    generatorId: this.generatorId,
                    iconStyle: "el-icon-star-on",
                    propertyList: [],
                    fieldList: []
                };
                this.Api.DataModel.create(model).then((data) => {
                    model.id = data.id;
                    data.propertyList.forEach(value => value.id = this.Method.generateId());
                    data.fieldList.forEach(value => value.id = this.Method.generateId());
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
                        this.Api.DataModel.update(item.model).then((data) => {
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
                        this.Api.DataModel.delete({idList:ids}).then((data) => {
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
            initAceEditor:function (editor) {
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
            },
            selectNode(item){
                if(item.isLoaded != null && item.isLoaded){
                    this.addToTab(item);
                    this.selectTab(item);
                    return;
                }
                this.Api.DataModel.get({id: item.model.id}).then((model) => {
                    item.model.propertyList = model.propertyList;
                    item.model.fieldList = model.fieldList;
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
            addToTreeData(item){
                if(this.treeData.length === 0){
                    this.$refs.tree.append(item);
                    return;
                }
                for(let i = 0 ; i < this.treeData.length ; i++){
                    let child = this.treeData[i];
                    if(item.name === child.name){
                        this.$refs.tree.insertAfter(item, child);
                        return;
                    }
                    else if(item.name < child.name){
                        this.$refs.tree.insertBefore(item, child);
                        return;
                    }
                    else if(i + 1 === this.treeData.length){
                        this.$refs.tree.append(item);
                        return;
                    }
                }
            },
            removeFromTreeData(item){
                this.$refs.tree.remove(item);
            },
            addProperty(item){
                item.model.propertyList.push({
                    id:this.Method.generateId(),
                    displayType:this.Constant.DataModelAttributeDisplayTypeEnum.DISPLAY_DEFAULT.value,
                    dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                    isEnum:false
                });
            },
            removeProperty(item, property, index){
                let propertyList = item.model.propertyList;
                propertyList.splice(index, 1);
            },
            addField(item){
                item.model.fieldList.push({
                    id:this.Method.generateId(),
                    displayType:this.Constant.DataModelAttributeDisplayTypeEnum.DISPLAY_DEFAULT.value,
                    dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                    isEnum:false
                });
            },
            removeField(item, field, index){
                let fieldList = item.model.fieldList;
                fieldList.splice(index, 1);
            },
            showDataModelValidateEditModal(item, attribute){
                this.$refs.dataModelValidateEditModal.open({
                    attribute: attribute
                })
            },
            showDataModelCascadeScriptEditModal(item, attribute){
                this.$refs.dataModelCascadeScriptEditModal.open({
                    attribute: attribute
                })
            },
            //行拖拽
            rowDrop(item) {
                this.$nextTick(function () {
                    const propertyTbody = document.querySelector('.tab-pane-' + item.id + ' .property-table .el-table__body-wrapper tbody');
                    Sortable.create(propertyTbody, {
                        animation:100,
                        handle:".sort-handle",
                        onEnd({ newIndex, oldIndex }) {
                            const currRow = item.model.propertyList.splice(oldIndex, 1)[0];
                            item.model.propertyList.splice(newIndex, 0, currRow)
                        }
                    });
                    const fieldTbody = document.querySelector('.tab-pane-' + item.id + ' .field-table .el-table__body-wrapper tbody');
                    Sortable.create(fieldTbody, {
                        animation:100,
                        handle:".sort-handle",
                        onEnd({ newIndex, oldIndex }) {
                            const currRow = item.model.fieldList.splice(oldIndex, 1)[0];
                            item.model.fieldList.splice(newIndex, 0, currRow)
                        }
                    });
                });
            },
        },
        mounted(){
            this.Api.DataModel.infoQuery({generatorId: this.generatorId}).then((models) => {
                models.forEach(model => {
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                });
            });
        }
    }
</script>

<style scoped lang="less">
    #data-model-manage{
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
    #data-model-manage{
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
            .el-form-item--small.el-form-item{
                margin: 0;
            }
        }
        .sort-handle{
            cursor: move;
        }
    }
</style>