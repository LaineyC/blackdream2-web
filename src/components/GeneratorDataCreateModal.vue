<template>
    <el-dialog
        :title="title"
        :show-close="false"
        @close="close"
        width="1400px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form id="generator-data-create-modal" :ref="'form'" :model="model" inline size="small">
            <div class="properties" v-if="dataModelCache&&dataModelCache[model.dataModel.id]">
                <template v-for="group in dataModelCache[model.dataModel.id].propertyGroup">
                    <div v-if="group.isGroup">
                        <div class="group-label">
                            <el-form-item>{{group.name}}</el-form-item>
                        </div>
                        <div class="group-item" v-for="property in group.children" :key="property.id">
                            <div class="group-label" :class="{'is-required':property.dataValidatorMap[model.properties[property.name].dataType]&&property.dataValidatorMap[model.properties[property.name].dataType].isRequired}" style="margin-left: 5px;">
                                <el-form-item>{{property.comment}}</el-form-item>
                            </div>
                            <div class="group-item" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }">
                                <el-form-item v-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-checkbox v-model="model.properties[property.name].value" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"></el-checkbox>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-input v-model.number="model.properties[property.name].value" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"/>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-input v-model.number="model.properties[property.name].value" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"/>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-input v-if="!property.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value]||!property.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="model.properties[property.name].value" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"/>
                                    <el-select v-else v-model="model.properties[property.name].value" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)">
                                        <el-option v-for="enumItem in property.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                    </el-select>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-date-picker v-model="model.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" type="date" value-format="yyyy-MM-dd" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"></el-date-picker>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-time-picker v-model="model.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" value-format="HH:mm:ss" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"></el-time-picker>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-date-picker v-model="model.properties[property.name].value" :style="{ width: property.displayWidth ? property.displayWidth + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="property.placeholder" @change="cascadeFunction(property.cascadeFunction, model.properties[property.name], model.properties, model)"></el-date-picker>
                                    <template slot="error" slot-scope="{ error }">
                                        <el-popover placement="bottom" trigger="manual" :value="true">
                                            <el-alert :title="error" type="error" :closable="false"></el-alert>
                                        </el-popover>
                                    </template>
                                </el-form-item>
                                <el-form-item v-else-if="model.properties[property.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'properties.' + property.name + '.value'" :rules="buildAttributeValidator(property, model.properties[property.name], model.properties, model)">
                                    <el-button-group>
                                        <el-button :type="generatorDataCache[model.properties[property.name].value]?'info':''" :style="{ width: property.displayWidth ? (property.displayWidth - 56) + 'px' : '' }"
                                                   size="small" @click="showDataModelChooseModal(property.cascadeFunction, 'properties.' + property.name + '.value', model.properties[property.name], model.properties, model)">{{generatorDataCache[model.properties[property.name].value] ? generatorDataCache[model.properties[property.name].value].name : (property.placeholder?property.placeholder:'请选择')}}</el-button>
                                        <el-button type="warning" size="small" @click="clearDataModelChoose(property.cascadeFunction, 'properties.' + property.name + '.value', model.properties[property.name], model.properties, model)" icon="el-icon-close"></el-button>
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
                        <div class="group-label" :class="{'is-required':group.model.dataValidatorMap[model.properties[group.model.name].dataType]&&group.model.dataValidatorMap[model.properties[group.model.name].dataType].isRequired}">
                            <el-form-item>{{group.model.comment}}</el-form-item>
                        </div>
                        <div class="group-item" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }">
                            <el-form-item v-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-checkbox v-model="model.properties[group.model.name].value" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"></el-checkbox>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-input v-model.number="model.properties[group.model.name].value" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"/>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-input v-model.number="model.properties[group.model.name].value" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"/>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-input v-if="!group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value]||!group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].isEnum" v-model="model.properties[group.model.name].value" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"/>
                                <el-select v-else v-model="model.properties[group.model.name].value" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)">
                                    <el-option v-for="enumItem in group.model.dataValidatorMap[Constant.DataModelAttributeDataTypeEnum.STRING.value].enumList" :value="enumItem.value" :key="enumItem.value" :label="enumItem.label"></el-option>
                                </el-select>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-date-picker v-model="model.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" type="date" value-format="yyyy-MM-dd" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"></el-date-picker>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-time-picker v-model="model.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" value-format="HH:mm:ss" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"></el-time-picker>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-date-picker v-model="model.properties[group.model.name].value" :style="{ width: group.model.displayWidth ? group.model.displayWidth + 'px' : '' }" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="group.model.placeholder" @change="cascadeFunction(group.model.cascadeFunction, model.properties[group.model.name], model.properties, model)"></el-date-picker>
                                <template slot="error" slot-scope="{ error }">
                                    <el-popover placement="bottom" trigger="manual" :value="true">
                                        <el-alert :title="error" type="error" :closable="false"></el-alert>
                                    </el-popover>
                                </template>
                            </el-form-item>
                            <el-form-item v-else-if="model.properties[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" :prop="'properties.' + group.model.name + '.value'" :rules="buildAttributeValidator(group.model, model.properties[group.model.name], model.properties, model)">
                                <el-button-group>
                                    <el-button :type="generatorDataCache[model.properties[group.model.name].value]?'info':''" :style="{ width: group.model.displayWidth ? (group.model.displayWidth - 56) + 'px' : '' }" size="small"
                                               @click="showDataModelChooseModal(group.model.cascadeFunction, 'properties.' + group.model.name + '.value', model.properties[group.model.name], model.properties, model)">{{generatorDataCache[model.properties[group.model.name].value] ? generatorDataCache[model.properties[group.model.name].value].name : (group.model.placeholder?group.model.placeholder:'请选择')}}</el-button>
                                    <el-button type="warning" size="small" @click="clearDataModelChoose(group.model.cascadeFunction, 'properties.' + group.model.name + '.value', model.properties[group.model.name], model.properties, model)" icon="el-icon-close"></el-button>
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
            <DataModelChooseModal ref="dataModelChooseModal" @on-success="handleDataModelChooseSuccess"/>
        </el-form>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "GeneratorDataCreateModal",
        components:{
            DataModelChooseModal:() => import('@/components/DataModelChooseModal.vue'),
        },
        data () {
            return {
                isShow:false,
                title:null,
                model:{
                    dataModel:{}
                },
                dataModelCache:{}
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.model.name = this.model.properties[this.dataModel.primaryProperty.name].value;
                        this.Api.GeneratorData.create(this.model).then((data) => {
                            this.model.id = data.id;
                            this.model.dataModel = this.dataModel;
                            this.$emit('on-success', this.model, this.parent);
                            this.close();
                            this.$message({type: 'success', message: '创建成功！'});
                        });
                    }
                });
            },
            open({model, parent, dataModel, dataModelCache, generatorDataCache, treeData, global}){
                this.title = '新建' + dataModel.name;
                this.isShow = true;
                this.parent = parent;
                this.dataModel = dataModel;
                this.dataModelCache = dataModelCache;
                this.generatorDataCache = generatorDataCache;
                this.model = model;
                this.treeData = treeData;
                this.global = global;
            },
            reset(){
                this.parent = null;
                this.dataModel = null;
                this.dataModelCache = null;
                this.generatorDataCache = null;
                this.model = {
                    dataModel:{}
                };
                this.treeData = [];
                this.global = null;
                this.$refs.form.resetFields();
            },
            close(){
                this.isShow = false;
                this.reset();
            },
            cascadeFunction(fn, control, row, model){
                //("$control","$properties", "$data", "$dataTree", $global",
                fn && fn(control, row, model, this.treeData, this.global);
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
                this.$refs.form.validateField(name)
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
                if(dataValidator && dataValidator.validateFunction){
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
            handleDataModelChooseSuccess(model){
                if(!model){
                    return;
                }
                this.$set(this.currentChange.control, "value", model.id);
                this.currentChange.fn && this.currentChange.fn(this.currentChange.control, this.currentChange.attribute, this.currentChange.model, this.treeData, this.global);
                this.$refs.form.validateField(this.currentChange.name)
            },
        }
    }
</script>

<style lang="less">
    #generator-data-create-modal{
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
            margin-right: 0;
        }
        .properties .el-form-item{
            margin-left: 10px;
            width: 100%;
        }
        .el-card__body{
            padding: 5px;
        }
        .group-label .el-form-item__content{
            font-weight: bold;
        }
        .group-label, .group-item{
            display: inline-block;
        }
/*
        .group-label.is-required .el-form-item__content::before{
            display: inline-block;
            content: "*";
            color: #f56c6c;
            margin-right: 2px;
        }
*/
        .group-label.is-required .el-form-item__content{
            color: #f56c6c;
        }
    }
</style>