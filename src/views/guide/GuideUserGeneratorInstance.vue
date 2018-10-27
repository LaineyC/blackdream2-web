<template>
    <div id="guide-user-generator-instance">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>我的实例</strong>
                    </div>
                   <div>
                       <p>每个生成器可以创建多个实例，一个实例一份数据。</p>
                       <p>用户通过搜索出的生成器新建实例，然后进工作台进行生成器数据的输入，最后通过生成器工具生成目标文件。</p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideUserGeneratorInstance",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-user-generator-instance{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        p{
            padding: 5px;
        }
    }
</style>