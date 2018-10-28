<template>
    <div id="guide-developer-template-file">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>模板文件</strong>
                    </div>
                   <div>
                       <p>模板文件定义了生成文件的模板。</p>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>名称</label></div>
                           <p>模板文件的名称。</p>
                       </el-card>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>模板语言</label></div>
                           <p>目前支持以下模板引擎：</p>
                           <p><span class="text-warning">Velocity</span></p>
                           <p><span class="text-warning">FreeMarker</span></p>
                       </el-card>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>分组</label></div>
                           <p>模板文件的分组。</p>
                       </el-card>
                       <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>Code</label></div>
                           <p>模板文件的唯一编码。</p>
                       </el-card>
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