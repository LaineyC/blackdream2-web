<template>
    <div id="guide-user-generator">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>他们的生成器</strong>
                    </div>
                   <div>
                       <p>由开发者制定好的生成器，使用者搜索出目标生成器即可使用（新建实例）。</p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideUserGenerator",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-user-generator{
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