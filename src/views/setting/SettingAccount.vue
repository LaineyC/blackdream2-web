<template>
    <div id="setting-account">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>修改密码</strong>
                    </div>
                    <el-form ref="signInForm" :model="request" :rules="validRule" size="small" label-width="120px" style="width: 300px">
                        <el-form-item label="旧密码" prop="username">
                            <el-input v-model="request.username" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="password">
                            <el-input v-model="request.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="password">
                            <el-input v-model="request.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSignIn()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SignIn",
        data () {
            return {
                request: {
                    username: null,
                    password: null
                },
                validRule: {
                    username: [
                        { type: 'string', required: true, message: '请输入用户名或邮箱', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{4,100}$/, message: '用户名或邮箱（4到100位字母、数字）', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSignIn () {
                this.$refs.signInForm.validate((valid) => {
                    if (valid) {
                        this.Api.User.signIn(this.request).then((data) => {
                            this.linkToGeneratorInstanceManage();
                        });
                    }
                })
            },
            linkToGeneratorInstanceManage(){
                this.$router.push({ name: 'generatorInstanceManage'});
            }
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