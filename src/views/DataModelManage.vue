<template>
    <div id="data-model-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-button @click="create" type="success" size="small">新建</el-button>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-button type="danger" size="small" @click="deleteAll">删除</el-button>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-button @click="showDataModelSchemaSaveModal" type="primary" size="small">Scheme设置</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                            <span><i :class="data.iconStyle"></i> {{ node.label }}</span>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">
                    <div v-for="item in tabs" :key="item.id" v-show="item===currentTabItem" class="tab-pane" :class="'tab-pane-' + item.id">
                        <el-form :ref="'form' + item.id" label-width="80px" :model="item.model" :rules="validRule" inline size="small">
                            <el-form-item label=" " label-width="20px">
                                <el-button type="primary" size="small" @click="update(item)">保存</el-button>
                            </el-form-item>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="item.model.name" placeholder="" />
                            </el-form-item>
                            <el-form-item label="图标" prop="iconStyle">
                                <el-popover placement="bottom" width="350" trigger="click">
                                    <el-button style="margin: 5px;font-size: 24px;padding: 2px;" :icon="icon"  v-for="icon in iconStyleList" :key="icon" @click="item.model.iconStyle=icon" plain></el-button>
                                    <el-button slot="reference" style="font-size: 24px;padding: 2px;"> <i :class="item.model.iconStyle"></i></el-button>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="code">
                                <el-input readonly v-model="item.model.code" placeholder="" />
                            </el-form-item>
                            <el-card shadow="hover">
                                <el-button-group slot="header">
                                    <el-button type="success" size="mini" @click="addProperty(item)">添加属性</el-button>
                                </el-button-group>
                                <el-table class="property-table" :data="item.model.propertyList" row-key="id" style="width: 100%">
                                    <el-table-column type="index" width="28" class-name="sort-handle">
                                    </el-table-column>
                                    <el-table-column label="显示设置" align="center">
                                        <el-table-column label="显示分组">
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
                                        <el-table-column label="显示标题">
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
                                        <el-table-column label="显示宽度" width="100">
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
                                        <el-table-column label="显示方式" width="125">
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
                                        <el-table-column label="属性名称">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'propertyList.' + $index + '.name'" :rules="buildPropertyNameValidator(row, item, validRule.property.name)">
                                                    <el-input :readonly="row.isPrimary" v-model="row.name" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="数据类型" width="140">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="!row.isPrimary" :prop="'propertyList.' + $index + '.dataType'" :rules="validRule.property.dataType">
                                                    <el-select v-model="row.dataType" @change="changeDataType(item, row, $index)">
                                                        <el-option v-for="item in Constant.DataModelAttributeDataTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <span style="padding-left: 14px;" v-else>{{row.dataType | enumFormat(Constant.DataModelAttributeDataTypeEnum)}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="默认值" width="230">
                                            <template slot-scope="{ row, column, $index }">
                                                <span v-if="row.isPrimary"></span>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-select v-model="row.defaultValue">
                                                        <el-option v-for="item in [{'label':'Null','value':null},{'label':'True','value':true},{'label':'False','value':false}]" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-input v-if="!row.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="row.defaultValue" />
                                                    <el-select v-else v-model="row.defaultValue">
                                                        <el-option v-for="enumItem in row.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-date-picker v-model="row.defaultValue" type="date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-time-picker v-model="row.defaultValue" value-format="yyyy-MM-dd HH:mm:ss"></el-time-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                    <el-date-picker v-model="row.defaultValue" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'propertyList.' + $index + '.defaultValue'" :rules="validRule.property.defaultValue">
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="验证规则" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="small" @click="showDataModelManageValidateEditModal(item, row)">设置</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="级联脚本" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="small" @click="showDataModelManageCascadeScriptEditModal(item, row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <span v-if="row.isPrimary"></span>
                                            <el-button v-else type="danger" size="small" @click="removeProperty(item, row, $index)">删除</el-button>
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
                                    <el-table-column type="index" width="28" class-name="sort-handle">
                                    </el-table-column>
                                    <el-table-column label="显示设置" align="center">
                                        <el-table-column label="显示分组">
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
                                        <el-table-column label="显示标题">
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
                                        <el-table-column label="显示宽度" width="100">
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
                                        <el-table-column label="显示方式" width="125">
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
                                        <el-table-column label="字段名称">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.name'" :rules="buildFieldNameValidator(row, item, validRule.field.name)">
                                                    <el-input v-model="row.name" />
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="数据类型" width="140">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item :prop="'fieldList.' + $index + '.dataType'" :rules="validRule.field.dataType">
                                                    <el-select v-model="row.dataType" @change="changeDataType(item, row, $index)">
                                                        <el-option v-for="item in Constant.DataModelAttributeDataTypeEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="默认值" width="230">
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-select v-model="row.defaultValue">
                                                        <el-option v-for="item in [{'label':'Null','value':null},{'label':'True','value':true},{'label':'False','value':false}]" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-model.number="row.defaultValue" />
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-input v-if="!row.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="row.defaultValue" />
                                                    <el-select v-else v-model="row.defaultValue">
                                                        <el-option v-for="enumItem in row.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-date-picker v-model="row.defaultValue" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-time-picker v-model="row.defaultValue" value-format="HH:mm:ss"></el-time-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                    <el-date-picker v-model="row.defaultValue" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </el-form-item>
                                                <el-form-item v-else-if="row.dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'fieldList.' + $index + '.defaultValue'" :rules="validRule.field.defaultValue">
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="验证规则" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="small" @click="showDataModelManageValidateEditModal(item, row)">设置</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="级联脚本" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="primary" size="small" @click="showDataModelManageCascadeScriptEditModal(item, row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80">
                                        <template slot-scope="{ row, column, $index }">
                                            <el-button type="danger" size="small" @click="removeField(item, row, $index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-form>
                    </div>
                </div>
            </Split>
        </div>
        <DataModelManageValidateEditModal ref="dataModelManageValidateEditModal"/>
        <DataModelManageCascadeScriptEditModal ref="dataModelManageCascadeScriptEditModal" />
        <DataModelSchemaSaveModal ref="dataModelSchemaSaveModal" />
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        name: "DataModelManage",
        components: {
            DataModelManageValidateEditModal:() => import('@/components/DataModelManageValidateEditModal.vue'),
            DataModelManageCascadeScriptEditModal:() => import('@/components/DataModelManageCascadeScriptEditModal.vue'),
            DataModelSchemaSaveModal:() => import('@/components/DataModelSchemaSaveModal.vue'),
        },
        data () {
            return {
                incrementer: this.Method.newIncrementer(),
                split: 0.15,
                generatorId:this.$route.params.generatorId,
                tabs:[],
                currentTabItem:{},
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                iconStyleList:[
                    "el-icon-info","el-icon-error", "el-icon-success", "el-icon-warning","el-icon-question", "el-icon-back",
                    "el-icon-arrow-left", "el-icon-arrow-down", "el-icon-arrow-right", "el-icon-arrow-up", "el-icon-caret-left", "el-icon-caret-bottom",
                    "el-icon-caret-top", "el-icon-caret-right", "el-icon-d-arrow-left", "el-icon-d-arrow-right", "el-icon-minus", "el-icon-plus",
                    "el-icon-remove", "el-icon-circle-plus", "el-icon-remove-outline", "el-icon-circle-plus-outline", "el-icon-close", "el-icon-check",
                    "el-icon-circle-close", "el-icon-circle-check", "el-icon-circle-close-outline", "el-icon-circle-check-outline", "el-icon-zoom-out", "el-icon-zoom-in",
                    "el-icon-d-caret", "el-icon-sort", "el-icon-sort-down", "el-icon-sort-up", "el-icon-tickets", "el-icon-document",
                    "el-icon-goods", "el-icon-sold-out", "el-icon-news", "el-icon-message", "el-icon-date", "el-icon-printer",
                    "el-icon-time", "el-icon-bell", "el-icon-mobile-phone", "el-icon-service", "el-icon-view", "el-icon-menu",
                    "el-icon-more", "el-icon-more-outline", "el-icon-star-on", "el-icon-star-off", "el-icon-location", "el-icon-location-outline",
                    "el-icon-phone", "el-icon-phone-outline", "el-icon-picture", "el-icon-picture-outline", "el-icon-delete", "el-icon-search",
                    "el-icon-edit", "el-icon-edit-outline", "el-icon-rank", "el-icon-refresh", "el-icon-share", "el-icon-setting",
                    "el-icon-upload", "el-icon-upload2", "el-icon-download", "el-icon-loading",
                ],
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
                        dataType: [
                            { required: true, message: '请选择数据类型', trigger: 'change' }
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
                        dataType: [
                            { required: true, message: '请选择数据类型', trigger: 'change' }
                        ],
                        defaultValue: [

                        ],
                    }
                }
            }
        },
        methods:{
            buildPropertyNameValidator(property, item, rules){
                let ruleArray = [...rules];
                ruleArray.push(
                    {
                        validator(rule, value, callback, source, options) {
                            let errors = [];
                            for(let i = 0 ; i < item.model.propertyList.length ; i ++){
                                let v = item.model.propertyList[i];
                                if(v.name === property.name && v !== property){
                                    errors.push("属性名称不能重复");
                                    break;
                                }
                            }
                            callback(errors);
                        },
                        trigger: 'blur'
                    }
                );
                return ruleArray
            },
            buildFieldNameValidator(field, item, rules){
                let ruleArray = [...rules];
                ruleArray.push(
                    {
                        validator(rule, value, callback, source, options) {
                            let errors = [];
                            for(let i = 0 ; i < item.model.fieldList.length ; i ++){
                                let v = item.model.fieldList[i];
                                if(v.name === field.name && v !== field){
                                    errors.push("字段名称不能重复");
                                    break;
                                }
                            }
                            callback(errors);
                        },
                        trigger: 'blur'
                    }
                );
                return []
            },
            buildDataValidatorMap(){
                let dataValidatorMap = {};
                for(let k in this.Constant.DataModelAttributeDataTypeEnum){
                    let dataTypeEnum = this.Constant.DataModelAttributeDataTypeEnum[k];
                    dataValidatorMap[dataTypeEnum.value] = {
                        isEnum:false,
                        enumList:[],
                        isRequired:false,
                        minValue:null,
                        maxValue:null,
                        length:null,
                        minLength:null,
                        maxLength:null,
                        regex:null,
                        regexMessage:null,
                        validateScript:""
                    }
                }
                return dataValidatorMap;
            },
            create(){
                let stringTypeValue = this.Constant.DataModelAttributeDataTypeEnum.STRING.value;
                let buildDataValidatorMap = this.buildDataValidatorMap();
                buildDataValidatorMap[stringTypeValue].isRequired = true;
                let id = this.incrementer.next();
                let model = {
                    id: "$" + id,
                    name: "新建模型" + id,
                    generatorId: this.generatorId,
                    iconStyle: "el-icon-menu",
                    propertyList: [{
                        id:this.Method.generateId(),
                        name:"name",
                        isPrimary:true,
                        comment:"名称",
                        displayType:this.Constant.DataModelAttributeDisplayTypeEnum.DISPLAY_ONLY.value,
                        dataType:stringTypeValue,
                        displayWidth:100,
                        defaultValue:null,
                        dataValidatorMap:buildDataValidatorMap
                    }],
                    fieldList: []
                };
                this.Api.DataModel.create(model).then((data) => {
                    model.id = data.id;
                    model.code = data.code;
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
                            item.iconStyle = item.model.iconStyle;
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
            selectNode(item){
                if(item.isLoaded != null && item.isLoaded){
                    this.addToTab(item);
                    this.selectTab(item);
                    return;
                }
                this.Api.DataModel.get({id: item.model.id}).then((model) => {
                    model.propertyList.forEach(value => value.id = this.Method.generateId());
                    model.fieldList.forEach(value => value.id = this.Method.generateId());
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
                    iconStyle:model.iconStyle,
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
                    isPrimary:false,
                    displayType:this.Constant.DataModelAttributeDisplayTypeEnum.DISPLAY_DEFAULT.value,
                    dataType:null,//this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                    defaultValue:null,
                    dataValidatorMap:this.buildDataValidatorMap(),
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
                    dataType:null,//this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                    defaultValue:null,
                    dataValidatorMap:this.buildDataValidatorMap(),
                });
            },
            removeField(item, field, index){
                let fieldList = item.model.fieldList;
                fieldList.splice(index, 1);
            },
            showDataModelManageValidateEditModal(item, attribute){
                this.$refs.dataModelManageValidateEditModal.open({
                    attribute: attribute
                })
            },
            showDataModelManageCascadeScriptEditModal(item, attribute){
                this.$refs.dataModelManageCascadeScriptEditModal.open({
                    attribute: attribute
                })
            },
            showDataModelSchemaSaveModal(){
                this.$refs.dataModelSchemaSaveModal.open({
                    generatorId: this.generatorId
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
            changeDataType(item, attribute, index){
                this.$set(attribute, "defaultValue", null);
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
        .property-table .el-form-item,.field-table .el-form-item,
        .property-table .el-form-item__content,.field-table .el-form-item__content{
            width: 100%;
        }
    }
</style>