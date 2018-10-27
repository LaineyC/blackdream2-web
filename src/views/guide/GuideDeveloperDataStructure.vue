<template>
    <div id="guide-developer-data-structure">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>数据结构</strong>
                    </div>
                   <div>

                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperDataStructure",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-developer-data-structure{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>