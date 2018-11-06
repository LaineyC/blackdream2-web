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
                            <el-dropdown-item v-for="dataModel in schemeRuleItemMap[''].children" :key="dataModel.id"><div @click="create(null, dataModel)"><i :class="dataModel.iconStyle"></i> {{dataModel.name}}</div></el-dropdown-item>
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
            <Split v-model="split" :min="0.1" :max="0.5">
                <div slot="left" class="left-split-pane">
                    <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                            <span><i :class="dataModelCache[data.dataModel.id].iconStyle"></i> {{ node.label }}</span>
                            <el-dropdown trigger="click" v-if="schemeRuleItemMap[data.dataModel.id].children.length">
                                <span class="el-dropdown-link"><i class="el-icon-circle-plus"></i></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="dataModel in schemeRuleItemMap[data.dataModel.id].children" :key="dataModel.id"><div @click="create(data, dataModel)"><i :class="dataModel.iconStyle"></i> {{dataModel.name}}</div></el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">
                    <el-tabs ref="tabs" type="card" @tab-click="clickTab">
                        <el-tab-pane :label="item.name" v-for="item in tabs" :key="item.id" :name="item.id" :class="'tab-pane-' + item.id">
                            <span slot="label"><i :class="item.dataModel.iconStyle"></i> {{item.name}}</span>
                            <el-form :ref="'form' + item.id" :model="item" inline :rules="validRule" size="small">
                                <div class="properties">
                                    <template v-for="group in dataModelCache[item.dataModel.id].propertyGroup">
                                        <div v-if="group.isGroup">
                                            <div class="group-label">
                                                <el-form-item>{{group.name}}</el-form-item>
                                            </div>
                                            <div class="group-item" v-for="property in group.children" :key="property.id">
                                                <div class="group-label" :class="{'is-required':property.dataValidatorMap[item.properties[property.name].dataType].isRequired}" style="margin-left: 5px;">
                                                     <el-form-item>{{property.comment}}</el-form-item>
                                                </div>
                                                <div class="group-item" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }">
                                                    <el-form-item v-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-checkbox v-model="item.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"></el-checkbox>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-input v-model.number="item.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"/>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-input v-model.number="item.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"/>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-input v-if="!property.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="item.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"/>
                                                        <el-select v-else v-model="item.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)">
                                                            <el-option v-for="enumItem in property.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-date-picker v-model="item.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" type="date" value-format="yyyy-MM-dd" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"></el-date-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-time-picker v-model="item.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" value-format="HH:mm:ss" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"></el-time-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-date-picker v-model="item.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(property.cascadeFunction, item.properties[property.name], item.properties, item)"></el-date-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="item.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, item.properties[property.name], item.properties, item)">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[item.properties[property.name].value]?'info':''" :style="{ width: property.displayWidth ? (property.displayWidth - 56) + 'px' : '' }"
                                                                       size="small" @click="showDataModelChooseModal(property.cascadeFunction, 'properties.' + property.name + '.value', item.properties[property.name], item.properties, item)">{{generatorDataCache[item.properties[property.name].value] ? generatorDataCache[item.properties[property.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(property.cascadeFunction, 'properties.' + property.name + '.value', item.properties[property.name], item.properties, item)" icon="el-icon-close"></el-button>
                                                        </el-button-group>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="group-label" :class="{'is-required':group.model.dataValidatorMap[item.properties[group.model.name].dataType].isRequired}">
                                                <el-form-item>{{group.model.comment}}</el-form-item>
                                            </div>
                                            <div class="group-item" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }">
                                                <el-form-item v-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-checkbox v-model="item.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"></el-checkbox>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-input v-model.number="item.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"/>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-input v-model.number="item.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"/>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-input v-if="!group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="item.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"/>
                                                    <el-select v-else v-model="item.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)">
                                                        <el-option v-for="enumItem in group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-date-picker v-model="item.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" type="date" value-format="yyyy-MM-dd" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"></el-date-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-time-picker v-model="item.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" value-format="HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"></el-time-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-date-picker v-model="item.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, item.properties[group.model.name], item.properties, item)"></el-date-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="item.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, item.properties[group.model.name], item.properties, item)">
                                                    <el-button-group>
                                                        <el-button :type="generatorDataCache[item.properties[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small"
                                                                   @click="showDataModelChooseModal(group.model.cascadeFunction, 'properties.' + group.model.name + '.value', item.properties[group.model.name], item.properties, item)">{{generatorDataCache[item.properties[group.model.name].value] ? generatorDataCache[item.properties[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(group.model.cascadeFunction, 'properties.' + group.model.name + '.value', item.properties[group.model.name], item.properties, item)" icon="el-icon-close"></el-button>
                                                    </el-button-group>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <el-card shadow="hover">
                                    <div slot="header">
                                        <el-button-group>
                                            <el-button type="primary" size="mini" @click="update(item)">保存</el-button>
                                            <el-button type="success" size="mini" @click="addTuple(item)">添加</el-button>
                                        </el-button-group>
<!--
                                        <el-dropdown trigger="click" split-button type="success" @click="addTuple(item)" size="mini" style="margin-left: 5px;vertical-align: middle;">
                                            从设置添加
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item>加入设置</el-dropdown-item>
                                                <el-dropdown-item>打开设置</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
-->
                                        <el-dropdown trigger="click" split-button type="success" @click="addTupleFromClipboard(item)" size="mini" style="margin-left: 5px;vertical-align: middle;">
                                            从粘贴板添加
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item><div @click="copyTupleInClipboard(item)">加入粘贴板</div></el-dropdown-item>
                                                <el-dropdown-item><div @click="showClipboardModel(item)">打开粘贴板</div></el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                    <div class="tupleList" style="width: 100%">
                                    <el-table :ref="'table' + item.id" class="field-table" row-key="__id__.value" :data="item.tupleList" style="width: 100%">
                                        <el-table-column type="index" width="28" class-name="sort-handle"></el-table-column>
                                        <el-table-column type="selection" width="25"></el-table-column>
                                        <el-table-column :width="group.isGroup ? '' : group.model.displayWidth" :label="group.name" v-for="group in dataModelCache[item.dataModel.id].fieldGroup" :key="group.id" :align="group.isGroup?'center':'left'">
                                            <template slot="header" slot-scope="scope"><span :class="{'is-required':group.model.dataValidatorMap[group.model.dataType].isRequired}">{{group.name}}</span></template>
                                            <el-table-column v-if="group.isGroup" v-for="field in group.children" :label="field.comment" :width="field.displayWidth">
                                                <template slot="header" slot-scope="scope"><span :class="{'is-required':field.dataValidatorMap[field.dataType].isRequired}">{{field.comment}}</span></template>
                                                <template slot-scope="{ row, column, $index }">
                                                    <el-form-item v-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value"  :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-checkbox v-model="row[field.name].value" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"></el-checkbox>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value"  :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-input v-model.number="row[field.name].value" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"/>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value"  :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-input v-model.number="row[field.name].value" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"/>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-input v-if="!field.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="row[field.name].value" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"/>
                                                        <el-select v-else v-model="row[field.name].value" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)">
                                                            <el-option v-for="enumItem in field.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                        </el-select>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-date-picker v-model="row[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" type="date" value-format="yyyy-MM-dd" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"></el-date-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-time-picker v-model="row[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" value-format="HH:mm:ss" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"></el-time-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-date-picker v-model="row[field.name].value" :style="{ width: field.displayWidth ? (field.displayWidth - 10) + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(field.cascadeFunction, row[field.name], row, item)"></el-date-picker>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'tupleList.' + $index + '.' + field.name + '.value'" :rules="buildAttributeValidator(field, row[field.name], row, item)">
                                                        <el-button-group>
                                                            <el-button :type="generatorDataCache[row[field.name].value]?'info':''" :style="{ width: field.displayWidth ? (field.displayWidth - 56) + 'px' : '' }" size="small"
                                                                       @click="showDataModelChooseModal(field.cascadeFunction, 'tupleList.' + $index + '.' + field.name + '.value', row[field.name], row, item)">{{generatorDataCache[row[field.name].value] ? generatorDataCache[row[field.name].value].name : '请选择'}}</el-button>
                                                            <el-button type="warning" size="small" @click="clearDataModelChoose(field.cascadeFunction, 'tupleList.' + $index + '.' + field.name + '.value', row[field.name], row, item)" icon="el-icon-close"></el-button>
                                                        </el-button-group>
                                                        <template slot="error" slot-scope="{ error }">
                                                            <el-popover placement="bottom" trigger="manual" :value="true">
                                                                <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                            </el-popover>
                                                        </template>
                                                    </el-form-item>
                                                </template>
                                            </el-table-column>
                                            <template slot-scope="{ row, column, $index }">
                                                <el-form-item v-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-checkbox v-model="row[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"></el-checkbox>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-input v-model.number="row[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"/>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-input v-model.number="row[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"/>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-input v-if="!group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="row[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"/>
                                                    <el-select v-else v-model="row[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)">
                                                        <el-option v-for="enumItem in group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                                    </el-select>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-date-picker v-model="row[group.model.name].value" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" type="date" value-format="yyyy-MM-dd" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"></el-date-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-time-picker v-model="row[group.model.name].value" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" value-format="HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"></el-time-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-date-picker v-model="row[group.model.name].value" type="datetime" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 10) + 'px' : '' }" value-format="yyyy-MM-dd HH:mm:ss" @change="cascadeFunction(group.model.cascadeFunction, row[group.model.name], row, item)"></el-date-picker>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
                                                </el-form-item>
                                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'tupleList.' + $index + '.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, row[group.model.name], row, item)">
                                                    <el-button-group>
                                                        <el-button :type="!!generatorDataCache[row[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small"
                                                                   @click="showDataModelChooseModal(group.model.cascadeFunction, 'tupleList.' + $index + '.' + group.model.name + '.value', row[group.model.name], row, item)">{{generatorDataCache[row[group.model.name].value] ? generatorDataCache[row[group.model.name].value].name : '请选择'}}</el-button>
                                                        <el-button type="warning" size="small" @click="clearDataModelChoose(group.model.cascadeFunction, 'tupleList.' + $index + '.' + group.model.name + '.value', row[group.model.name], row, item)" icon="el-icon-close"></el-button>
                                                    </el-button-group>
                                                    <template slot="error" slot-scope="{ error }">
                                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                                        </el-popover>
                                                    </template>
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
        <TupleClipboardModal ref="tupleClipboardModal"/>
        <GeneratorDataCreateModal ref="generatorDataCreateModal"  @on-success="handleGeneratorDataCreateModalSuccess"/>
    </div>
</template>

<script>
    import Sortable from 'sortablejs'

    export default {
        name: "GeneratorDataManage",
        components:{
            TupleClipboardModal:() => import('@/components/TupleClipboardModal.vue'),
            DataModelChooseModal:() => import('@/components/DataModelChooseModal.vue'),
            GeneratorInstanceMakeModal:() => import('@/components/GeneratorInstanceMakeModal.vue'),
            GeneratorDataCreateModal:() => import('@/components/GeneratorDataCreateModal.vue'),
        },
        data () {
            return {
                schemeRuleItemMap:{"":{children:[]}},
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
            copyTupleInClipboard(model){
                let tupleClipboard = this.Storage.getTupleClipboard(model.dataModel.id);
                let table = this.$refs['table' + model.id][0];
                let selection = table.selection;
                let dataModel = this.dataModelCache[model.dataModel.id];
                let fieldList = dataModel.fieldList;
                selection.forEach(value => {
                    let tuple = {};
                    fieldList.forEach(field => {
                        let control = value[field.name];
                        if(control.dataType === this.Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value){
                            let generatorData = this.generatorDataCache[control.value];
                            tuple[field.name] = {
                                dataType:control.dataType,
                                value: control.value,
                                label:generatorData ? generatorData.name : null
                            }
                        }
                        else{
                            tuple[field.name] = {
                                dataType:control.dataType,
                                value: control.value,
                            }
                        }
                    });
                    tuple.__id__ = {
                        dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                        value:this.Method.generateId() + ""
                    };
                    tupleClipboard.push(tuple);
                });
                table.clearSelection();
            },
            addTupleFromClipboard(model){
                let tupleClipboard = this.Storage.getTupleClipboard(model.dataModel.id);
                let dataModel = this.dataModelCache[model.dataModel.id];
                let fieldList = dataModel.fieldList;
                tupleClipboard.forEach(value => {
                    let tuple = {};
                    fieldList.forEach(field => {
                        let control = value[field.name];
                        if(control.dataType === this.Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value){
                            let generatorData = this.generatorDataCache[control.value];
                            tuple[field.name] = {
                                dataType:control.dataType,
                                value: generatorData ? control.value : null,
                            }
                        }
                        else{
                            tuple[field.name] = {
                                dataType:control.dataType,
                                value: control.value,
                            }
                        }
                    });
                    tuple.__id__ = {
                        dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                        value:this.Method.generateId() + ""
                    };
                    model.tupleList.push(tuple);
                });
            },
            showClipboardModel(model){
                this.$refs.tupleClipboardModal.open({
                    dataModel:model.dataModel,
                });
            },
            cascadeFunction(fn, control, row, model){
                //("$control","$properties", "$data", "$dataTree", $global",
                fn && fn(control, row, model, this.treeData, this.global);
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
            handleDataModelChooseSuccess(model){
                if(!model){
                    return;
                }
                this.$set(this.currentChange.control, "value", model.id);
                this.currentChange.fn && this.currentChange.fn(this.currentChange.control, this.currentChange.attribute, this.currentChange.model, this.treeData, this.global);
                this.$refs['form' + this.currentChange.model.id][0].validateField(this.currentChange.name)
            },
            showDataModelChooseModal(fn, name, control, attribute, model){
                this.currentChange = {fn, name, control, attribute, model};
                this.$refs.dataModelChooseModal.open({
                    currentKey:control.value,
                    treeData:this.treeData
                });
            },
            clearDataModelChoose(fn, name, control, attribute, model){
                this.$set(control, "value", null);
                fn && fn(control, attribute, model, this.treeData, this.global);
                this.$refs['form' + model.id][0].validateField(name)
            },
            create(parent, dataModel){
                let id = this.incrementer.next();
                let model = {
                    id: "$" + id,
                    name: "新建" + dataModel.name + id,
                    generatorInstanceId: this.generatorInstanceId,
                    dataModelId: dataModel.id,
                    parentId: !parent ? null : parent.id,
                    properties: this.buildProperties(dataModel),
                    tupleList: [],
                    parent:{id:!parent ? null : parent.id},
                    dataModel: {id:dataModel.id},
                    generatorInstance: {id:this.generatorInstanceId},
                };
                model.properties[dataModel.primaryProperty.name].value = model.name;
                this.$refs.generatorDataCreateModal.open({
                    model,
                    parent,
                    dataModel,
                    generatorDataCache:this.generatorDataCache,
                    dataModelCache:this.dataModelCache,
                    treeData:this.treeData,
                    global:this.global,
                });
/*
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
 */
            },
            handleGeneratorDataCreateModalSuccess(model, parent){
                this.generatorDataCache[model.id] = model;
                this.wrapToItem(model);
                this.addToTreeData(model, parent);
                this.selectNode(model);
            },
            setDirty(model){
                model.isDirty = true;
            },
            update(model){
                this.$refs['form' + model.id][0].validate((valid) => {
                    if (valid) {
                        let dataModel = this.dataModelCache[model.dataModel.id];
                        let parent = model.parent;
                        this.Api.GeneratorData.update({
                            id:model.id,
                            name: model.properties[dataModel.primaryProperty.name].value,
                            parentId:parent ? parent.id : null,
                            properties: model.properties,
                            tupleList: model.tupleList
                        }).then((data) => {
                            model.name = model.properties[dataModel.primaryProperty.name].value;
                            model.isDirty = false;
                            this.removeFromTreeData(model);
                            this.addToTreeData(model, parent != null ? this.$refs.tree.getNode(parent.id).data : null);
                            this.$refs.tree.setCurrentKey(model.id);
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
            selectNode(model){
                if(model.isLoaded != null && model.isLoaded){
                    this.addToTab(model);
                    this.selectTab(model);
                    return;
                }
                this.Api.GeneratorData.get({id: model.id}).then((data) => {
                    let dataModel = this.dataModelCache[data.dataModel.id];
                    model.properties = this.compatibleProperty(data.properties, dataModel);
                    data.tupleList.forEach(tuple => {
                        tuple = this.compatibleTuple(tuple, dataModel);
                        tuple.__id__ = {
                            dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                            value:this.Method.generateId() + ""
                        };
                        model.tupleList.push(tuple);
                    });
                    model.isLoaded = true;
                    this.addToTab(model);
                    this.selectTab(model);
                    this.rowDrop(model);
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
            selectTab(model){
                this.$refs.tabs.setCurrentName(model.id);
                this.currentTabItem = model;
            },
            addToTab(model){
                let result = this.tabs.filter(value => {
                    return value.id === model.id;
                });
                if(result.length === 0){
                    this.tabs.push(model);
                }
            },
            removeFromTab(model){
                let index = -1;
                index = this.tabs.indexOf(model);
                if (index > -1) {
                    this.tabs.splice(index, 1);
                }
            },
            wrapToItem(model){
/*
                return {
                    isDirty:false,
                    isLoaded:false,
                    id: model.id,
                    name: model.name,
                    model: model,
                    children: []
                };
*/
                //model.isDirty = false;
                //model.isLoaded = false;
                return model;
            },
            addToTreeData(model, parent){
                let children = !parent ? this.treeData : parent.children;
                if(children.length === 0){
                    this.$refs.tree.append(model, parent);
                    return;
                }
                for(let i = 0 ; i < children.length ; i++){
                    let child = children[i];
                    if(model.name === child.name){
                        this.$refs.tree.insertAfter(model, child);
                        return;
                    }
                    else if(model.name < child.name){
                        this.$refs.tree.insertBefore(model, child);
                        return;
                    }
                    else if(i + 1 === children.length){
                        this.$refs.tree.append(model, parent);
                        return;
                    }
                }
            },
            removeFromTreeData(model){
                this.$refs.tree.remove(model);
            },
            addTuple(model){
                let dataModel = this.dataModelCache[model.dataModel.id];
                let fieldList = dataModel.fieldList;
                let tuple = {};
                fieldList.forEach(field => {
                    tuple[field.name] = {
                        dataType:field.dataType,
                        value: field.defaultValue === null || field.defaultValue === undefined ? null : field.defaultValue,
                    }
                });
                tuple.__id__ = {
                    dataType:this.Constant.DataModelAttributeDataTypeEnum.STRING.value,
                    value:this.Method.generateId() + ""
                };
                model.tupleList.push(tuple);
            },
            removeTuple(model, tuple, index){
                let tupleList = model.tupleList;
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
            rowDrop(model) {
                this.$nextTick(function () {
                    const tupleTbody = document.querySelector('.tab-pane-' + model.id + ' .field-table .el-table__body-wrapper tbody');
                    Sortable.create(tupleTbody, {
                        animation:100,
                        handle:".sort-handle",
                        onEnd({ newIndex, oldIndex }) {
                            const currRow = model.tupleList.splice(oldIndex, 1)[0];
                            model.tupleList.splice(newIndex, 0, currRow)
                        }
                    });
                });
            },
            buildAttributeValidator(attribute, control, row, model){
                //("$control","$properties", "$data", "$global",
                //fn && fn(control, row, model, this.global);
                let dataType = control.dataType;
                let ruleListMap = attribute.ruleListMap;
                let dataValidatorMap = attribute.dataValidatorMap;
                let ruleList = ruleListMap[dataType];
                let dataValidator = dataValidatorMap[dataType];
                let ruleArray = [...ruleList];
                if(dataValidator.validateFunction){
                    ruleArray.push(
                        {
                            validator(rule, value, callback, source, options) {
                                let error = dataValidator.validateFunction(control, row, model, this.treeData, this.global);
                                if(error !== null && error !== undefined){
                                    if(Array.isArray(error)){
                                        callback(error);
                                    }
                                    else if(typeof error === "string"){
                                        callback([error]);
                                    }
                                }
                                else{
                                    callback([]);
                                }
                            },
                            trigger: 'change'
                        }
                    );
                }

                return ruleArray;
            },
            buildValidRuleList(attribute, isProperty){
                let dataValidatorMap = attribute.dataValidatorMap;
                let ruleListMap = attribute.ruleListMap = {};

                let rowVarName = isProperty  ? "$properties" : "$tuple";

                let dataTypeEnum = this.Constant.DataModelAttributeDataTypeEnum.NONE;
                let dataType = dataTypeEnum.value;
                let dataValidator = dataValidatorMap[dataType];
                let ruleList = ruleListMap[dataType] = [];
                if(dataValidator != null){
                    //do nothing
                }

                let dataTypeEnumBoolean = this.Constant.DataModelAttributeDataTypeEnum.BOOLEAN;
                let dataTypeBoolean = dataTypeEnumBoolean.value;
                let dataValidatorBoolean = dataValidatorMap[dataTypeBoolean];
                let ruleListBoolean = ruleListMap[dataTypeBoolean] = [];
                if(dataValidatorBoolean != null){
                    ruleListBoolean.push({ type: 'boolean', message: '必须布尔', trigger: 'change' });
                    if(dataValidatorBoolean.isRequired){
                        ruleListBoolean.push({ required: true, message: '必输项', trigger: 'change' });
                    }
                    if(dataValidatorBoolean.validateScript){
                        dataValidatorBoolean.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorBoolean.validateScript);
                    }
                }

                let dataTypeEnumInteger = this.Constant.DataModelAttributeDataTypeEnum.INTEGER;
                let dataTypeInteger = dataTypeEnumInteger.value;
                let dataValidatorInteger = dataValidatorMap[dataTypeInteger];
                let ruleListInteger = ruleListMap[dataTypeInteger] = [];
                if(dataValidatorInteger != null){
                    ruleListInteger.push({ type: 'integer', message: '必须整型', trigger: 'blur' });
                    if(dataValidatorInteger.isRequired){
                        ruleListInteger.push({ required: true, message: '必输项', trigger: 'blur' });
                    }
                    if(dataValidatorInteger.minValue !== null && dataValidatorInteger.minValue !== undefined){
                        ruleListInteger.push( { type:"integer", min: dataValidatorInteger.minValue, message: '最小' + dataValidatorInteger.minValue , trigger: 'blur' });
                    }
                    if(dataValidatorInteger.maxValue !== null && dataValidatorInteger.maxValue !== undefined){
                        ruleListInteger.push({ type:"integer", max: dataValidatorInteger.maxValue, message: '最大' + dataValidatorInteger.maxValue, trigger: 'blur' });
                    }
                    if(dataValidatorInteger.validateScript){
                        dataValidatorInteger.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorInteger.validateScript);
                    }
                }

                let dataTypeEnumDecimal = this.Constant.DataModelAttributeDataTypeEnum.DECIMAL;
                let dataTypeDecimal = dataTypeEnumDecimal.value;
                let dataValidatorDecimal = dataValidatorMap[dataTypeDecimal];
                let ruleListDecimal = ruleListMap[dataTypeDecimal] = [];
                if(dataValidatorDecimal != null){
                    ruleListDecimal.push({ type: 'number', message: '必须数字', trigger: 'blur' });
                    if(dataValidatorDecimal.isRequired){
                        ruleListDecimal.push({ required: true, message: '必输项', trigger: 'blur' });
                    }
                    if(dataValidatorDecimal.minValue !== null && dataValidatorDecimal.minValue !== undefined){
                        ruleListDecimal.push( { type:"number", min: dataValidatorDecimal.minValue, message: '最小' + dataValidatorDecimal.minValue , trigger: 'blur' });
                    }
                    if(dataValidatorDecimal.maxValue !== null && dataValidatorDecimal.maxValue !== undefined){
                        ruleListDecimal.push({ type:"number", max: dataValidatorDecimal.maxValue, message: '最大' + dataValidatorDecimal.maxValue, trigger: 'blur' });
                    }
                    if(dataValidatorDecimal.validateScript){
                        dataValidatorDecimal.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorDecimal.validateScript);
                    }
                }

                let dataTypeEnumString = this.Constant.DataModelAttributeDataTypeEnum.STRING;
                let dataTypeString = dataTypeEnumString.value;
                let dataValidatorString = dataValidatorMap[dataTypeString];
                let ruleListString = ruleListMap[dataTypeString] = [];
                if(dataValidatorString != null){
                    ruleListString.push({ type: 'string', message: '必须字符', trigger: dataValidatorString.isEnum ? 'change' : 'blur' });
                    if(dataValidatorString.isRequired){
                        ruleListString.push({ required: true, message: '必输项', trigger: dataValidatorString.isEnum ? 'change' : 'blur' });
                    }
                    if(dataValidatorString.length !== null && dataValidatorString.length !== undefined){
                        ruleListString.push( { type:"string", len: dataValidatorString.length, message: '长度' + dataValidatorString.length , trigger: 'blur' });
                    }
                    if(dataValidatorString.minLength !== null && dataValidatorString.minLength !== undefined){
                        ruleListString.push( { type:"string", min: dataValidatorString.minLength, message: '最短' + dataValidatorString.minLength , trigger: 'blur' });
                    }
                    if(dataValidatorString.maxLength !== null && dataValidatorString.maxLength !== undefined){
                        ruleListString.push( { type:"string", max: dataValidatorString.maxLength, message: '最短' + dataValidatorString.maxLength , trigger: 'blur' });
                    }
                    if( dataValidatorString.regex !== null && dataValidatorString.regex !== undefined){
                        ruleListString.push( { type:"string", pattern: dataValidatorString.regex, message:dataValidatorString.regexMessage ? dataValidatorString.regexMessage : "格式不匹配" + dataValidatorString.pattern , trigger: 'blur' });
                    }
                    if(dataValidatorString.validateScript){
                        dataValidatorString.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorString.validateScript);
                    }
                }

                let dataTypeEnumDate = this.Constant.DataModelAttributeDataTypeEnum.DATE;
                let dataTypeDate = dataTypeEnumDate.value;
                let dataValidatorDate = dataValidatorMap[dataTypeDate];
                let ruleListDate = ruleListMap[dataTypeDate] = [];
                if(dataValidatorDate != null){
                    if(dataValidatorDate.isRequired){
                        ruleListDate.push({ required: true, message: '必输项', trigger: 'change' });
                    }
                    ruleListDate.push({
                        validator(rule, value, callback, source, options) {
                            let errors = [];
                            if(dataValidatorDate.minValue !== null && dataValidatorDate.minValue !== undefined){
                                if(value < dataValidatorDate.minValue){
                                    errors.push( '最小' + dataValidatorDate.minValue);
                                }
                            }
                            if(dataValidatorDate.maxValue !== null && dataValidatorDate.maxValue !== undefined){
                                if(value > dataValidatorDate.maxValue){
                                    errors.push( '最大' + dataValidatorDate.maxValue);
                                }
                            }
                            callback(errors);
                        }, trigger: 'change'
                    });
                    if(dataValidatorDate.validateScript){
                        dataValidatorDate.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorDate.validateScript);
                    }
                }

                let dataTypeEnumTime = this.Constant.DataModelAttributeDataTypeEnum.TIME;
                let dataTypeTime = dataTypeEnumTime.value;
                let dataValidatorTime = dataValidatorMap[dataTypeTime];
                let ruleListTime = ruleListMap[dataTypeTime] = [];
                if(dataValidatorTime != null){
                    if(dataValidatorTime.isRequired){
                        ruleListTime.push({ required: true, message: '必输项', trigger: 'change' });
                    }
                    ruleListTime.push({
                        validator(rule, value, callback, source, options) {
                            let errors = [];
                            if(dataValidatorTime.minValue !== null && dataValidatorTime.minValue !== undefined){
                                if(value < dataValidatorTime.minValue){
                                    errors.push( '最小' + dataValidatorTime.minValue);
                                }
                            }
                            if(dataValidatorTime.maxValue !== null && dataValidatorTime.maxValue !== undefined){
                                if(value > dataValidatorTime.maxValue){
                                    errors.push( '最大' + dataValidatorTime.maxValue);
                                }
                            }
                            callback(errors);
                        }, trigger: 'change'
                    });
                    if(dataValidatorTime.validateScript){
                        dataValidatorTime.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorTime.validateScript);
                    }
                }

                let dataTypeEnumDateTime = this.Constant.DataModelAttributeDataTypeEnum.DATETIME;
                let dataTypeDateTime = dataTypeEnumDateTime.value;
                let dataValidatorDateTime = dataValidatorMap[dataTypeDateTime];
                let ruleListDateTime = ruleListMap[dataTypeDateTime] = [];
                if(dataValidatorDateTime != null){
                    if(dataValidatorDateTime.isRequired){
                        ruleListDateTime.push({ required: true, message: '必输项', trigger: 'change' });
                    }
                    ruleListDateTime.push({
                        validator(rule, value, callback, source, options) {
                            let errors = [];
                            if(dataValidatorDateTime.minValue !== null && dataValidatorDateTime.minValue !== undefined){
                                if(value < dataValidatorDateTime.minValue){
                                    errors.push( '最小' + dataValidatorDateTime.minValue);
                                }
                            }
                            if(dataValidatorDateTime.maxValue !== null && dataValidatorDateTime.maxValue !== undefined){
                                if(value > dataValidatorDateTime.maxValue){
                                    errors.push( '最大' + dataValidatorDateTime.maxValue);
                                }
                            }
                            callback(errors);
                        }, trigger: 'change'
                    });
                    if(dataValidatorDateTime.validateScript){
                        dataValidatorDateTime.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorDateTime.validateScript);
                    }
                }

                let dataTypeEnumModel = this.Constant.DataModelAttributeDataTypeEnum.MODEL_REF;
                let dataTypeModel = dataTypeEnumModel.value;
                let dataValidatorModel = dataValidatorMap[dataTypeModel];
                let ruleListModel = ruleListMap[dataTypeModel] = [];
                if(dataValidatorModel != null){
                    if(dataValidatorModel.isRequired){
                        ruleListModel.push({ required: true, message: '必输项', trigger: 'change' });
                    }
                    if(dataValidatorModel.validateScript){
                        dataValidatorModel.validateFunction = new Function("$control", rowVarName, "$data", "$dataTree", "$global", dataValidatorModel.validateScript);
                    }
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
                this.Api.Generator.get({id:generatorInstance.generator.id}).then((generator) => {
                    if(generator.status === this.Constant.GeneratorStatusEnum.DEVELOP.value && generator.user.id !== generatorInstance.user.id){
                        this.$message({message: "当前生成器正在维护，请暂停操作等待发布！", type: 'error'});
                    }
                    else{
                        if(generatorInstance.releaseVersion !== generator.releaseVersion){
                            this.$alert("当前生成器已升级发布，请确认！", {
                                confirmButtonText: '确定',
                                callback: (action) => {
                                    this.Api.GeneratorInstance.versionSync({id:this.generatorInstanceId}).then((data) => {
                                        this.$message({type: 'success', message: '同步成功！'});
                                    })
                                }
                            });
                        }
                    }
                });

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
                                property.cascadeFunction = new Function("$control","$properties", "$data", "$dataTree", "$global", property.cascadeScript);
                            }

                            this.buildValidRuleList(property, true);
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
                                field.cascadeFunction = new Function("$control", "$tuple", "$data", "$dataTree", "$global", field.cascadeScript);
                            }

                            this.buildValidRuleList(field, false);
                        });
                    });

                    this.schemeRuleItemMap = {};
                    let schemeRuleItemMap = scheme ? scheme.ruleItemMap : {};
                    let keys = [""];
                    for(let k in this.dataModelCache){
                        keys.push(k);
                    }
                    keys.forEach(k => {
                        let children = [];
                        if(schemeRuleItemMap[k]){
                            schemeRuleItemMap[k].children.forEach(value => {
                                if(value in this.dataModelCache){
                                    children.push(this.dataModelCache[value]);
                                }
                            });
                        }
                        this.schemeRuleItemMap[k] = {children};
                    });

                    let that = this;
                    this.generatorDataCache = {};
                    let init = function(children){
                        children.sort((data1, data2) =>{
                            if(data1.name < data2.name){
                                return -1;
                            }
                            else if(data1.name > data2.name){
                                return 1
                            }
                            else{
                                return 0;
                            }
                        })
                        children.forEach(child => {
                            child.dataModel = that.dataModelCache[child.dataModel.id];
                            that.wrapToItem(child);
                            init(child.children);
                            that.generatorDataCache[child.id] = child;
                        });
                    };
                    init(generatorDataTree);
                    generatorDataTree.forEach(data => {
                       this.treeData.push(data);
                    });

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
        }
        .tupleList{
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

            .group-label.is-required .el-form-item__content::before{
                display: inline-block;
                content: "*";
                color: #f56c6c;
                margin-right: 2px;
            }

            .tupleList{
                .is-required{
                    color: #f56c6c;
                }
            }
            .properties .el-form-item,
            .tupleList .el-form-item,
            .tupleList .el-form-item__content{
                width: 100%;
            }
        }
    }
</style>