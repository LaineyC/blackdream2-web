<template>
    <div id="guide-developer-creation-strategy">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>生成策略</strong>
                    </div>
                   <div>
                       <p>生成策略是一组标签集，定义了生成文件和生成文件夹的规则。</p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperCreationStrategy",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-developer-creation-strategy{
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