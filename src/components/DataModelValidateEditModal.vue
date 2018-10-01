<template>
    <el-dialog
        title="验证规则"
        :show-close="false"
        @close="close"
        width="800px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="85px" size="small">
            <el-form-item label="是否必须" prop="isRequired">
                <el-switch v-model="request.isRequired"></el-switch>
            </el-form-item>
            <el-row v-if="validateShow.isShowEnum">
                <el-col :span="6">
                    <el-form-item label="是否枚举" prop="isEnum">
                        <el-switch v-model="request.isEnum"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="18" v-if="request.isEnum">
                    <el-row>
                        <el-col :span="4">
                            <el-button type="success" size="mini" @click="addEnumItem">添加值</el-button>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(enumItem, $index) in request.enumList">
                                <el-col :span="6">
                                    <el-form-item label-width="10px" :prop="'enumList.' + $index + '.label'" :rules="validRule.enumLabel">
                                        <el-input placeholder="label" v-model="enumItem.label"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label-width="10px" :prop="'enumList.' + $index + '.value'" :rules="validRule.enumValue">
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
            <el-row v-if="validateShow.isShowValue">
                <el-col :span="8">
                    <el-form-item label="最小值" prop="minValue">
                        <el-input v-model.number="request.minValue"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最大值" prop="maxValue">
                        <el-input v-model.number="request.maxValue"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="validateShow.isShowLength">
                <el-col :span="8">
                    <el-form-item label="最小长度" prop="minLength">
                        <el-input v-model.number="request.minLength"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最大长度" prop="maxLength">
                        <el-input v-model.number="request.maxLength"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="长度" prop="length">
                        <el-input v-model.number="request.length"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  v-if="validateShow.isShowRegex">
                <el-col :span="12">
                    <el-form-item label="正则表达式" prop="regex">
                        <el-input v-model="request.regex"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="正则提示" prop="regexMessage">
                        <el-input v-model="request.regexMessage"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="自定义脚本" prop="validateScript">
                <AceEditor v-model="request.validateScript" lang="javascript" theme="chrome" width="100%" height="300px" @init="initAceEditor"/>
            </el-form-item>
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

    let DataModelAttributeDataTypeEnum = Vue.prototype.Constant.DataModelAttributeDataTypeEnum;
    let dataModelValidateShowRule = {
        [DataModelAttributeDataTypeEnum.BOOLEAN.value] : {
            isShowEnum:false,
            isShowValue:false,
            isShowLength:false,
            isShowRegex:false
        },
        [DataModelAttributeDataTypeEnum.INTEGER.value] : {
            isShowEnum:false,
            isShowValue:true,
            isShowLength:false,
            isShowRegex:false
        },
        [DataModelAttributeDataTypeEnum.NUMBER.value] : {
            isShowEnum:false,
            isShowValue:true,
            isShowLength:false,
            isShowRegex:false
        },
        [DataModelAttributeDataTypeEnum.STRING.value] : {
            isShowEnum:true,
            isShowValue:false,
            isShowLength:true,
            isShowRegex:true
        },
        [DataModelAttributeDataTypeEnum.MODEL_REF.value] : {
            isShowEnum:false,
            isShowValue:false,
            isShowLength:false,
            isShowRegex:false
        },
    };

    export default {
        name: "DataModelValidateEditModal",
        components: {
            AceEditor,
        },
        data () {
            return {
                sourceAttribute:null,
                isShow:false,
                request: {
                    dataType:null,
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
                },
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
                        { type:"integer", min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    minLength: [
                        { type:"integer", min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
                    ],
                    maxLength: [
                        { type:"integer", min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, message: '输入数值超过范围', trigger: 'blur' }
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
                        this.copyAttribute(this.sourceAttribute, this.request);
                        this.request.enumList = [];
                        this.$emit('on-confirm');
                        this.close();
                    }
                });
            },
            open({attribute}){
                this.isShow = true;
                this.sourceAttribute = attribute;
                this.copyAttribute(this.request, this.sourceAttribute);
            },
            copyAttribute(target, source){
                Object.assign(target, source);
                target.enumList = !source.enumList || !source.enumList.length ? [] : [...source.enumList];
            },
            close(){
                this.isShow = false;
                this.$refs.form.resetFields();
            },
            addEnumItem(){
                this.request.enumList.push({value:null, label:null});
            },
            removeEnumItem(enumItem, $index){
                this.request.enumList.splice($index, 1);
            }
        },
        computed: {
            validateShow: function () {
                if(!this.request.dataType){
                    return {};
                }
                return dataModelValidateShowRule[this.request.dataType];
            }
        }
    }
</script>

<style scoped lang="less">

</style>