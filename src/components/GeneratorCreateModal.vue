<template>
    <el-dialog
        title="新建生成器"
        :show-close="false"
        @close="close"
        width="600px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="80px" size="small">
            <el-form-item label="名称" prop="name">
                <el-input v-model="request.name"></el-input>
            </el-form-item>
            <el-form-item label="模板语言" prop="engineType">
                <el-select v-model="request.engineType">
                    <el-option v-for="item in Constant.TemplateEngineTypeEnum" :value="item.value" :key="item.id" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="request.description" type="textarea" :autosize="{minRows: 4, maxRows: 5}"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "GeneratorCreateModal",
        data () {
            return {
                isShow:false,
                request: {
                    name: null,
                    engineType: null,
                    description: null
                },
                validRule: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { type: 'string', max: 255, message: '名称长度不能大于255', trigger: 'blur' }
                    ],
                    engineType: [
                        { type:"number", required: true, message: '请选择模板语言', trigger: 'change' }
                    ],
                    description: [
                        { type: 'string', max: 255, message: '描述长度不能大于255', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.Generator.create(this.request).then((data) => {
                            this.$emit('on-success');
                            this.close();
                        });
                    }
                });
            },
            open(){
                this.isShow = true;
            },
            close(){
                this.isShow = false;
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style scoped lang="less">

</style>