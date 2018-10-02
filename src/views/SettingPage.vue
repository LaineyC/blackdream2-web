<template>
    <div id="setting" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu default-active="1">
                    <el-menu-item index="1">
                        <i class="el-icon-picture"></i>
                        <strong slot="title">个性</strong>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-menu"></i>
                        <strong slot="title">账号</strong>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-phone"></i>
                        <strong slot="title">认证</strong>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" style="margin-left: 205px;">
                    大大大
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SettingPage"
    }
</script>

<style scoped lang="less">
    #setting{
        padding: 5px;
    }
</style>