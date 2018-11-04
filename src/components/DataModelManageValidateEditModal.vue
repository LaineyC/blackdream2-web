<template>
    <el-dialog
        title="验证规则"
        :show-close="false"
        @close="close"
        width="800px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="85px" size="small">
            <el-tabs v-model="currentTabName" tab-position="left">
                <el-tab-pane v-for="dataTypeEnum in Constant.DataModelAttributeDataTypeEnum" :label="dataTypeEnum.label" :name="dataTypeEnum.value + ''" :key="dataTypeEnum.value">
                    <span slot="label">
                         <strong v-if="sourceAttribute.dataType===dataTypeEnum.value">{{dataTypeEnum.label}}</strong>
                        <span v-else>{{dataTypeEnum.label}}</span>
                    </span>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.NONE.value">
                        <el-col :span="24">
                            <el-form-item label="无设置"></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value !== Constant.DataModelAttributeDataTypeEnum.NONE.value">
                        <el-col :span="24">
                            <el-form-item label="是否必须" :prop="dataTypeEnum.value + '.isRequired'" :rules="validRule.isRequired">
                                <el-switch v-model="request[dataTypeEnum.value].isRequired"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.STRING.value">
                        <el-col :span="6">
                            <el-form-item label="是否枚举" :prop="dataTypeEnum.value + '.isEnum'" :rules="validRule.isEnum">
                                <el-switch v-model="request[dataTypeEnum.value].isEnum"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18" v-if="request[dataTypeEnum.value].isEnum">
                            <el-row>
                                <el-col :span="4">
                                    <el-button type="success" size="mini" @click="addEnumItem(dataTypeEnum)">添加值</el-button>
                                </el-col>
                                <el-col :span="20">
                                    <el-row v-for="(enumItem, $index) in request[dataTypeEnum.value].enumList" :key="$index">
                                        <el-col :span="9">
                                            <el-form-item label-width="10px" :prop="dataTypeEnum.value + '.enumList.' + $index + '.label'" :rules="validRule.enumLabel">
                                                <el-input placeholder="label" v-model="enumItem.label"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item label-width="10px" :prop="dataTypeEnum.value + '.enumList.' + $index + '.value'" :rules="validRule.enumValue">
                                                <el-input placeholder="value" v-model="enumItem.value"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label-width="10px">
                                                <el-button type="danger" size="mini" @click="removeEnumItem(enumItem, $index)">删除</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.STRING.value">
                        <el-col :span="8">
                            <el-form-item label="长度" :prop="dataTypeEnum.value + '.length'" :rules="validRule.length">
                                <el-input v-model.number="request[dataTypeEnum.value].length"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最小长度" :prop="dataTypeEnum.value + '.minLength'" :rules="validRule.minLength">
                                <el-input v-model.number="request[dataTypeEnum.value].minLength"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最大长度" :prop="dataTypeEnum.value + '.maxLength'" :rules="validRule.maxLength">
                                <el-input v-model.number="request[dataTypeEnum.value].maxLength"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.STRING.value">
                        <el-col :span="12">
                            <el-form-item label="正则表达式" :prop="dataTypeEnum.value + '.regex'" :rules="validRule.regex">
                                <el-input v-model="request[dataTypeEnum.value].regex"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="正则提示" :prop="dataTypeEnum.value + '.regexMessage'" :rules="validRule.regexMessage">
                                <el-input v-model="request[dataTypeEnum.value].regexMessage"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.INTEGER.value || dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                        <el-col :span="12">
                            <el-form-item label="最小值" :prop="dataTypeEnum.value + '.minValue'" :rules="validRule.minValue">
                                <el-input v-model.number="request[dataTypeEnum.value].minValue"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最大值" :prop="dataTypeEnum.value + '.maxValue'" :rules="validRule.maxValue">
                                <el-input v-model.number="request[dataTypeEnum.value].maxValue"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.DATE.value">
                        <el-col :span="12">
                            <el-form-item label="最小值" :prop="dataTypeEnum.value + '.minValue'">
                                <el-date-picker v-model="request[dataTypeEnum.value].minValue" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最大值" :prop="dataTypeEnum.value + '.maxValue'">
                                <el-date-picker v-model="request[dataTypeEnum.value].maxValue" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.TIME.value">
                        <el-col :span="12">
                            <el-form-item label="最小值" :prop="dataTypeEnum.value + '.minValue'">
                                <el-time-picker v-model="request[dataTypeEnum.value].minValue" value-format="HH:mm:ss"></el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最大值" :prop="dataTypeEnum.value + '.maxValue'">
                                <el-time-picker v-model="request[dataTypeEnum.value].maxValue" value-format="HH:mm:ss"></el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value === Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                        <el-col :span="12">
                            <el-form-item label="最小值" :prop="dataTypeEnum.value + '.minValue'">
                                <el-date-picker v-model="request[dataTypeEnum.value].minValue" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最大值" :prop="dataTypeEnum.value + '.maxValue'">
                                <el-date-picker v-model="request[dataTypeEnum.value].maxValue" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dataTypeEnum.value !== Constant.DataModelAttributeDataTypeEnum.NONE.value">
                        <el-col :span="24">
                            <el-form-item label="自定义验证" :prop="dataTypeEnum.value + '.validateScript'" :rules="validRule.validateScript">
                                <AceEditor v-model="request[dataTypeEnum.value].validateScript" lang="javascript" theme="chrome" width="100%" height="350px" @init="initAceEditor"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import AceEditor from 'vue2-ace-editor'
    import 'brace/ext/language_tools'
    import 'brace/mode/javascript'
    import 'brace/theme/chrome'
    import Vue from 'vue'

    export default {
        name: "DataModelValidateEditModal",
        components: {
            AceEditor,
        },
        data () {
            return {
                currentTabName:this.Constant.DataModelAttributeDataTypeEnum.NONE.value + "",
                sourceAttribute:{},
                isShow:false,
                request: this.resetRequest(),
                validRule: {
                    name: [
                        { required: true, message: '请填写', trigger: 'blur' },
                        { type: 'string', max: 255, message: '长度不能大于255', trigger: 'blur' }
                    ],
                    minValue: [
                        { type:"number", min: Number.MIN_VALUE, max: Number.MAX_VALUE, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    maxValue: [
                        { type:"number", min: Number.MIN_VALUE, max: Number.MAX_VALUE, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    length: [
                        { type:"integer", min: 1, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    minLength: [
                        { type:"integer", min: 1, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    maxLength: [
                        { type:"integer", min: 1, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    regex: [
                        { type: 'string', max: 255, message: '不能大于255', trigger: 'blur' }
                    ],
                    regexMessage: [
                        { type: 'string', max: 255, message: '长度不能大于255', trigger: 'blur' }
                    ],
                    enumLabel: [
                        { required: true, message: '请填写', trigger: 'blur' },
                        { type: 'string', max: 255, message: '长度不能大于255', trigger: 'blur' }
                    ],
                    enumValue: [
                        { required: true, message: '请填写', trigger: 'blur' },
                        { type: 'string', max: 255, message: '长度不能大于255', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            initAceEditor:function (editor) {
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.copyAttribute(this.sourceAttribute.dataValidatorMap, this.request);
                        this.close();
                        this.$emit('on-confirm');
                    }
                });
            },
            open({attribute}){
                this.isShow = true;
                this.sourceAttribute = attribute;
                this.currentTabName = attribute.dataType + '';
                this.request = this.resetRequest();
                this.copyAttribute(this.request, this.sourceAttribute.dataValidatorMap);
            },
            copyAttribute(target, source){
                for(let k in this.Constant.DataModelAttributeDataTypeEnum){
                    let dataTypeEnum = this.Constant.DataModelAttributeDataTypeEnum[k];
                    let targetValue = target[dataTypeEnum.value];
                    let sourceValue = source[dataTypeEnum.value];
                    if(sourceValue === null){
                        continue;
                    }
                    targetValue.isRequired = sourceValue.isRequired;
                    targetValue.isEnum = sourceValue.isEnum;
                    targetValue.minValue = sourceValue.minValue;
                    targetValue.maxValue = sourceValue.maxValue;
                    targetValue.length = sourceValue.length;
                    targetValue.minLength = sourceValue.minLength;
                    targetValue.maxLength = sourceValue.maxLength;
                    targetValue.regex = sourceValue.regex;
                    targetValue.regexMessage = sourceValue.regexMessage;
                    targetValue.validateScript = sourceValue.validateScript ? sourceValue.validateScript : "";
                    targetValue.enumList = [];
                    if(sourceValue.enumList && sourceValue.enumList.length){
                        sourceValue.enumList.forEach(value => {
                            targetValue.enumList.push({
                                ...value
                            });
                        })
                    }
                }
            },
            resetRequest(){
                let request = {};
                for(let k in this.Constant.DataModelAttributeDataTypeEnum){
                    let dataTypeEnum = this.Constant.DataModelAttributeDataTypeEnum[k];
                    request[dataTypeEnum.value] = {
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
                return request;
            },
            close(){
                this.isShow = false;
                this.request = this.resetRequest();
                this.$refs.form.resetFields();
            },
            addEnumItem(dataTypeEnum){
                this.request[dataTypeEnum.value].enumList.push({value:null, label:null});
            },
            removeEnumItem(enumItem, $index){
                this.request.enumList.splice($index, 1);
            }
        },
    }
</script>

<style scoped lang="less">

</style>