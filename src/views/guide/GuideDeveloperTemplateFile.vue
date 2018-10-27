<template>
    <div id="guide-developer-template-file">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>模板文件</strong>
                    </div>
                   <div>
                       <p>模板文件定义了生成文件的模板，采用<span class="text-warning">Velocity</span>模板实现。</p>
                       <p><span class="text-warning">Velocity</span>模板所能访问的变量由生成策略的<span class="text-warning">TemplateContext</span>标签定义。</p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperTemplateFile",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-developer-template-file{
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