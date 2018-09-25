<template>
    <el-dialog
            title="编辑生成器实例"
            :show-close="false"
            width="600px"
            :close-on-press-escape="false"
            :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="80px" size="small">
            <el-form-item label="名称" prop="name">
                <el-input v-model="request.name"></el-input>
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
        name: "GeneratorInstanceUpdateModal",
        data () {
            return {
                isShow:false,
                request: {
                    name: null,
                    description: null
                },
                validRule: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { type: 'string', max: 255, message: '名称长度不能大于255', trigger: 'blur' }
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
                        this.Api.GeneratorInstance.update(this.request).then(() => {
                            this.$emit('on-success');
                            this.close();
                        });
                    }
                });
            },
            open(config){
                this.isShow = true;
                this.Api.GeneratorInstance.get({id: config.generatorInstanceId}).then((data) => {
                    Object.assign(this.request, data);
                });
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