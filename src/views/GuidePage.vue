<template>
    <div id="guide" class="container">
        <el-row>
            <el-col :span="4" style="position: fixed; top:65px;width: 200px">
                <el-menu default-active="1-1" :default-openeds="['1','2']">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <strong>开发手册</strong>
                        </template>
                        <el-menu-item index="1-1" @click="goAnchor('#a1')">我的生成器</el-menu-item>
                        <el-menu-item index="1-2">数据模型</el-menu-item>
                        <el-menu-item index="1-3">模板文件</el-menu-item>
                        <el-menu-item index="1-4">生成策略</el-menu-item>
                        <el-menu-item index="1-5">数据结构</el-menu-item>
                        <el-menu-item index="1-6">注意事项</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <strong>用户手册</strong>
                        </template>
                        <el-menu-item index="2-1">他们的生成器</el-menu-item>
                        <el-menu-item index="2-2">我的实例</el-menu-item>
                        <el-menu-item index="2-3">注意事项</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20" style="margin-left: 205px;">
                <div style="width: 100%;height: 500px;background:darkgray" id="a1">

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuidePage",
        data() {
            return {

            }
        },
        methods: {
            goAnchor(selector) {
                let anchor = this.$el.querySelector(selector);
                console.info(anchor.width);
                document.body.scrollTop = anchor.offsetTop
            }
        }
    }
</script>

<style scoped lang="less">
    #guide{
        padding: 5px;
    }
</style>