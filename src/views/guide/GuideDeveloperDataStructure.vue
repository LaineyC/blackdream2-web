<template>
    <div id="guide-developer-data-structure">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>数据结构</strong>
                    </div>
                   <div>
                           <pre style="background-color:inherit;">
<span class="text-success">//全局变量（生成器在生成运行时的一些信息）</span>
<strong class="text-warning">Global</strong> <span class="text-warning">{</span>
    <span class="text-success">//生成号</span>
    <span class="text-primary">String</span> <span class="text-info">generateId</span>
    <span class="text-success">//生成文件时的用户</span>
    <span class="text-primary">User</span> <span class="text-info">user</span>
    <span class="text-success">//生成器开发者</span>
    <span class="text-primary">User</span> <span class="text-info">developer</span>
    <span class="text-success">//生成器</span>
    <span class="text-primary">Generator</span> <span class="text-info">generator</span>
    <span class="text-success">//生成器实例</span>
    <span class="text-primary">GeneratorInstance</span> <span class="text-info">generatorInstance</span>
    <span class="text-success">//生成策略</span>
    <span class="text-primary">CreationStrategy</span> <span class="text-info">creationStrategy</span>
<span class="text-warning">}</span>

<span class="text-success">//构建文件时（通过GeneratorData 转换而来）</span>
<strong class="text-warning">TemplateFileContextData</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//数据对象的名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
    <span class="text-success">//上级</span>
    <span class="text-primary">TemplateFileContextData</span> <span class="text-info">parent</span>
    <span class="text-success">//子级</span>
    <span class="text-primary">List&lt;TemplateFileContextData></span> <span class="text-info">children</span>
    <span class="text-success">//由数据模型设定的属性</span>
    <span class="text-primary">Map&lt;String, Object></span> <span class="text-info">properties</span>
    <span class="text-success">//由数据模型设定的字段</span>
    <span class="text-primary">List&lt;Map&lt;String, Object>></span> <span class="text-info">tupleList</span>
    <span class="text-success">//定义该DataModel的properties属性和tupleList属性的模型</span>
    <span class="text-primary">DataModel</span> <span class="text-info">dataModel</span>
<span class="text-warning">}</span>

<span class="text-success">//生成器数据（在工作台输入的用于生成器的源数据）</span>
<strong class="text-warning">GeneratorData</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//数据对象的名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
    <span class="text-success">//上级</span>
    <span class="text-primary">GeneratorData</span> <span class="text-info">parent</span>
    <span class="text-success">//子级</span>
    <span class="text-primary">List&lt;GeneratorData></span> <span class="text-info">children</span>
    <span class="text-success">//由数据模型设定的属性</span>
    <span class="text-primary">Map&lt;String, Control></span> <span class="text-info">properties</span>
    <span class="text-success">//由数据模型设定的字段</span>
    <span class="text-primary">List&lt;Map&lt;String, Control>></span> <span class="text-info">tupleList</span>
    <span class="text-success">//定义该DataModel的properties属性和tupleList属性的模型</span>
    <span class="text-primary">DataModel</span> <span class="text-info">dataModel</span>
<span class="text-warning">}</span>

<span class="text-success">//控件对象</span>
<strong class="text-warning">Control</strong> <span class="text-warning">{</span>
    <span class="text-success">//控件值类型</span>
    <span class="text-primary">Integer</span> <span class="text-info">dataType</span>
    <span class="text-success">//控件值</span>
    <span class="text-primary">Object</span> <span class="text-info">value</span>
<span class="text-warning">}</span>

<span class="text-success">//用户</span>
<strong class="text-warning">User</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//用户名</span>
    <span class="text-primary">String</span> <span class="text-info">username</span>
<span class="text-warning">}</span>

<span class="text-success">//生成器</span>
<strong class="text-warning">Generator</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//生成器名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
<span class="text-warning">}</span>

<span class="text-success">//生成器实例</span>
<strong class="text-warning">GeneratorInstance</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//生成器实例名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
<span class="text-warning">}</span>

<span class="text-success">//生成策略</span>
<strong class="text-warning">CreationStrategy</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//生成策略名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
<span class="text-warning">}</span>

<span class="text-success">//数据模型</span>
<strong class="text-warning">DataModel</strong> <span class="text-warning">{</span>
    <span class="text-success">//ID</span>
    <span class="text-primary">String</span> <span class="text-info">id</span>
    <span class="text-success">//Code</span>
    <span class="text-primary">String</span> <span class="text-info">code</span>
    <span class="text-success">//数据模型名称</span>
    <span class="text-primary">String</span> <span class="text-info">name</span>
<span class="text-warning">}</span>
                            </pre>
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
        label {
            display: inline-block;
            max-width: 100%;
            margin-bottom: 5px;
            font-weight: bold;
        }
        p{
            padding: 5px;
        }
    }
</style>