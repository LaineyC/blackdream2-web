<template>
    <div id="setting-profile">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>公众形象</strong>
                    </div>
                    <el-form ref="form" :model="request" :rules="validRule" size="small" label-width="120px">
                        <el-form-item label="头像" prop="password">
                            <el-upload
                                class="avatar-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="昵称" prop="username" style="width: 300px;">
                            <el-input v-model="request.username" type="text"></el-input>
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
                imageUrl: '',
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
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.User.signIn(this.request).then((data) => {
                            this.linkToGeneratorInstanceManage();
                        });
                    }
                })
            },
            linkToGeneratorInstanceManage(){
                this.$router.push({ name: 'generatorInstanceManage'});
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style scoped lang="less">
    #setting-profile{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>
<style lang="less">
    #setting-profile{
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>