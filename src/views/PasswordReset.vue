<template>
    <div id="password-reset">
        <el-row>
            <el-col :span="8" :offset="8">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>密码找回</strong>
                        <div>
                        <el-button size="small" type="text" @click="linkToSignUp()">注册</el-button>
                        <el-button size="small" type="text" @click="linkToSignIn()">登陆</el-button>
                        </div>
                    </div>
                    <el-form ref="form" :model="request" :rules="validRule" size="small" label-width="120px">
                        <el-form-item label="用户名或邮箱" prop="username">
                            <el-input v-model="request.username" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="validCode">
                            <el-row>
                                <el-col :span="16">
                                    <el-input type="text" v-model="request.validCode"></el-input>
                                </el-col>
                                <el-col :span="8">
                                    <el-button style="float: right;" type="success" @click="sendValidCode()">{{timerInterval ?  timerInterval + '秒后重新发送' : '发送验证码'}}</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="request.newPassword" type="newPassword"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSignUp()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "PasswordReset",
        data () {
            return {
                request: {
                    username: null,
                    validCode: null,
                    newPassword: null
                },
                validRule: {
                    username: [
                        { type: 'string', required: true, message: '请输入用户名或邮箱', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z\\.@]{4,100}$/, message: '用户名或邮箱（4到100位字母、数字）', trigger: 'blur'}
                    ],
                    validCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9]{6}$/, message: '验证码格式不正确（6位数字）', trigger: 'blur'}
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{6,24}$/, message: '密码格式不正确（6到24位字母、数字）', trigger: 'blur'}
                    ]
                },
                timerInterval:null
            }
        },
        methods: {
            setTimer: function (interval) {
                let that = this;
                this.timerInterval = interval;
                this.timer = setInterval(() => {
                    if(that.timerInterval){
                        that.timerInterval--;
                    }
                    else{
                        clearInterval(that.timer);
                    }
                }, 1000);
            },
            sendValidCode(){
                if(this.timerInterval){
                    return;
                }

                this.$refs.form.validateField("username",(error) => {
                    if (!error) {
                        this.Api.User.passwordResetValidCodeSend({username: this.request.username}).then((data) => {
                            this.setTimer(data.interval);
                        });
                    }
                })
            },
            handleSignUp () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.User.passwordReset(this.request).then((data) => {
                            this.$message({type: 'success', message: '重置成功！'});
                            this.linkToSignIn();
                        });
                    }
                })
            },
            linkToSignUp(){
                this.$router.push({ name: 'signUp'});
            },
            linkToSignIn(){
                this.$router.push({ name: 'signIn'});
            }
        },
        mounted() {
            clearInterval(this.timer)
        },
        destroyed: function () {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped lang="less">
    #password-reset{
        padding-top: 64px;
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>