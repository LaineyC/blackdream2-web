<template>
    <el-dialog
        title="级联脚本"
        :show-close="false"
        @close="close"
        width="800px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="85px" size="small">
            <el-form-item prop="cascadeScript" label-width="0px">
                <AceEditor v-model="request.cascadeScript" lang="javascript" theme="chrome" width="100%" height="500px" @init="initAceEditor"/>
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

    export default {
        name: "DataModelCascadeScriptEditModal",
        components: {
            AceEditor,
        },
        data () {
            return {
                sourceAttribute:null,
                isShow:false,
                request: {
                    cascadeScript:""
                },
                validRule: {
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
                        this.$emit('on-confirm');
                        this.close();
                    }
                });
            },
            open({attribute}){
                this.isShow = true;
                this.sourceAttribute = attribute;
                this.resetRequest();
                this.copyAttribute(this.request, this.sourceAttribute);
            },
            resetRequest(){
                this.request = {
                    cascadeScript:""
                }
            },
            copyAttribute(target, source){
                Object.assign(target, source);
            },
            close(){
                this.isShow = false;
                this.resetRequest();
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style scoped lang="less">

</style>