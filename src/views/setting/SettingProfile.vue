<template>
    <div id="setting-profile">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>公众形象</strong>
                    </div>
                    <el-form ref="form" :model="request" :rules="validRule" size="small" label-width="120px">
                        <!--
                        <el-form-item label="头像" prop="password">
                            <el-upload
                                drag
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <template v-else>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">拖到此处，或<em>点击上传</em></div>
                                </template>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        -->
                        <el-form-item label="昵称" prop="nickname" style="width: 300px;">
                            <el-input v-model="request.nickname" type="text"></el-input>
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
                    nickname: this.Auth.body.nickname,
                },
                validRule: {
                    username: [
                        { required: true, message: '请输入昵称', trigger: 'blur'},
                        { type: 'string', pattern: /^[0-9A-Za-z]{4,100}$/, message: '4到100位字母、数字', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            handleSignIn () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.User.profileChange(this.request).then((data) => {
                            this.Auth.body.nickname = this.request.nickname;
                            this.$message({type: 'success', message: '保存成功！'});
                        });
                    }
                })
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
        .el-upload-dragger{
            width: 178px;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>