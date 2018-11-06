<template>
    <div id="setting-account">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>修改密码</strong>
                    </div>
                    <el-form ref="form" :model="request" :rules="validRule" size="small" label-width="120px" style="width: 400px">
                        <el-form-item label="旧密码" prop="oldPassword">
                            <el-input v-model="request.oldPassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="request.newPassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="request.confirmPassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="commit()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SettingAccount",
        data () {
            let validateConfirmPassword = (rule, value, callback, source, options) => {
                let errors = [];
                if(value !== this.request.newPassword){
                    errors.push("两次密码不一致")
                }
                callback(errors);
            };
            return {
                request: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword:null
                },
                validRule: {
                    oldPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'}
                    ],
                    newPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'},
                        { validator:validateConfirmPassword, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            commit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.User.passwordChange(this.request).then((data) => {
                            this.$message({type: 'success', message: '保存成功！'});
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped lang="less">
    #setting-account{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>