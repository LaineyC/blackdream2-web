<template>
    <div id="guide-developer-creation-strategy">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>生成策略</strong>
                    </div>
                   <div>
                       <p>生成策略定义了生成文件和生成文件夹的规则。</p>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>名称</label></div>
                           <p>生成策略的名称。</p>
                       </el-card>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>脚本语言</label></div>
                           <p>目前支持以下脚本语言：</p>
                           <p><span class="text-warning">JavaScript</span></p>
                           <p>有以下全局变量：</p>
                           <pre style="background-color:inherit;">
<span class="text-success">//工具类</span>
<strong class="text-warning">$tool</strong> <span class="text-success">CreationStrategyScriptTool类型</span>

<span class="text-success">//构建时的全局变量</span>
<strong class="text-warning">$global</strong> <span class="text-success">Global类型</span>

<span class="text-success">//用户数据</span>
<strong class="text-warning">$dataTree</strong> <span class="text-success">TemplateFileContextData类型的树结构，List&lt;TemplateFileContextData&gt;</span>
                           </pre>
                       </el-card>
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
        label {
            display: inline-block;
            max-width: 100%;
            margin-bottom: 5px;
            font-weight: bold;
        }
        p{
            padding: 5px;
        }
        .el-card__body{
            .el-card__header{
                padding: 10px;
            }
            .el-card__body{
                padding: 10px;
            }
            .el-card{
                margin-top: 5px;
            }
        }
    }
</style>