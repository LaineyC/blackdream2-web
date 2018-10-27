<template>
    <div id="sign-up">
        <el-row>
            <el-col :span="8" :offset="8">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>注册</strong>
                        <el-button size="small" type="text" @click="linkToSignIn()">已有账号，去登陆</el-button>
                    </div>
                    <el-form ref="signUpForm" :model="request" :rules="validRule" size="small" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="request.username" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="request.email" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="validCode">
                            <el-row>
                                <el-col :span="16">
                                    <el-input type="text" v-model="request.validCode"></el-input>
                                </el-col>
                                <el-col :span="8">
                                    <el-button style="float: right;" type="success" @click="sendValidCode()">发送验证码</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="request.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSignUp()">提交</el-button>
                            <el-button style="float: right;" type="text" @click="linkToSignIn()">忘记密码？</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SignUp",
        data () {
            return {
                request: {
                    username: null,
                    email: null,
                    validCode: null,
                    password: null
                },
                validRule: {
                    username: [
                        { type: 'string', required: true, message: '请输入用户名', trigger: 'blur'},
                        { type: 'string', pattern: /^[A-Za-z][0-9A-Za-z]{3,16}$/, message: '用户名格式不正确（4到16位字母开头、数字）', trigger: 'blur'}
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur'},
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    validCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9]{6}$/, message: '验证码格式不正确（6位数字）', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            sendValidCode(){
                this.Api.User.signUpEmailValidCodeSend({email: this.request.email}).then((data) => {
                    this.$router.push({ name: 'signIn'});
                });
            },
            handleSignUp () {
                this.$refs.signUpForm.validate((valid) => {
                    if (valid) {
                        this.Api.User.signUp(this.request).then((data) => {

                        });
                    }
                })
            },
            linkToSignIn(){
                this.$router.push({ name: 'signIn'});
            }
        }
    }
</script>

<style scoped lang="less">
    #sign-up{
        padding-top: 64px;
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>