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
<span class="text-success">//工具</span>
<strong class="text-warning">$tool</strong> <span class="text-warning">{</span>
    <span class="text-success">//定义变量 varName变量名 varValue变量值</span>
    <span class="text-primary">newVar(varName, varValue)</span>
    <span class="text-success">//定义模板 tmplCode模板code</span>
    <span class="text-primary">newTmpl(tmplCode)</span>
    <span class="text-success">//定义文件 fileName文件名 相对路径用'/'分割 templateRef模本对象 templateContext模板上下文Json结构</span>
    <span class="text-primary">newFile(fileName, templateRef, templateContext)</span>
    <span class="text-success">//定义目录 dirName目录名 相对路径用'/'分割</span>
    <span class="text-primary">newDir(dirName)</span>
<span class="text-warning">}</span>

<strong class="text-warning">$global</strong> <span class="text-success">Global类型</span>

<strong class="text-warning">$dataTree</strong> <span class="text-success">TemplateFileContextData类型的树结构</span>
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