<template>
    <div id="guide-developer-data-model">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>数据模型</strong>
                    </div>
                    <div>
                        <p>数据模型（<span class="text-warning">DynamicModel</span>类型）定义了生成器所需生成数据的数据类型结构，每个生成器可制定多个数据模型。</p>
                        <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>名称</label></div>
                           <p>数据模型的名称。</p>
                        </el-card>
                        <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>图标</label></div>
                           <p>数据模型的图标。</p>
                        </el-card>
                        <el-card class="box-card">
                           <div slot="header" class="clearfix"><label>Code</label></div>
                           <p>数据模型的唯一编码。</p>
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix"><label>普通属性</label></div>
                            <p>普通属性定义了<span class="text-warning">DataModel</span>类型<span class="text-info">properties</span>属性的数据结构。</p>
                            <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                                <div class="el-table__body-wrapper is-scrolling-none">
                                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                                        <thead>
                                        <tr>
                                           <th width="180"><div class="cell">列</div></th>
                                           <th><div class="cell">说明</div></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>显示分组</label></div></td>
                                           <td><div class="cell">对<span class="text-warning">HTML</span>控件进行分组显示，没有分组的控件换行显示（一行显示一个，标题-控件-换行），在同一个分组的控件内联显示（一行显示多个，分组-标题1-控件1-标题2-控件2-...换行）。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>显示标题</label></div></td>
                                           <td><div class="cell"><span class="text-warning">HTML</span>控件的中文提示。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>显示宽度</label></div></td>
                                           <td><div class="cell">对应的<span class="text-warning">HTML</span>控件的宽度。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>显示方式</label></div></td>
                                           <td><div class="cell">对应的<span class="text-warning">HTML</span>控件的显示方式。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>属性名称</label></div></td>
                                           <td><div class="cell"><span class="text-info">properties</span>对应的<span class="text-info">Key</span><span class="text-warning">（命名不能包含字符$）</span>。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>数据类型</label></div></td>
                                           <td>
                                               <div class="cell">
                                               <p><span class="text-info">properties</span>对应的<span class="text-info">Key</span>的值类型，不同类型对应不同的<span class="text-warning">HTML</span>控件。</p>
                                               <p>支持<span class="text-info">布尔型</span>、<span class="text-info">整数型</span>、<span class="text-info">浮点型</span>、<span class="text-info">字符串型</span>、<span class="text-info">日期型</span>、<span class="text-info">枚举型</span>、<span class="text-info">数据模型</span>。</p>
                                               <p><span class="text-info">布尔型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.lang.Boolean</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[checkbox]</span>控件。</p>
                                               <p><span class="text-info">整数型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.lang.Long</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[number]</span>控件。</p>
                                               <p><span class="text-info">浮点型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.lang.Double</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[number]</span>控件。</p>
                                               <p><span class="text-info">字符串型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.lang.String</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[text]</span>控件。</p>
                                               <p><span class="text-info">枚举型型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.lang.String数组</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">select</span>控件。</p>
                                               <p><span class="text-info">日期型</span>对应<span class="text-warning">Java</span>的<span class="text-info">java.util.Date</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[text]</span>控件（日期插件）。</p>
                                               <p><span class="text-info">数据模型</span>对应当前生成器中已定义的所有<span class="text-warning">DataModel</span>类型，<span class="text-warning">HTML</span>的<span class="text-info">input[text]</span>控件（数据模型选择对话框）。</p>
                                                </div>
                                           </td>
                                        </tr>
                                        <tr class="el-table__row">
                                           <td><div class="cell"><label>默认值</label></div></td>
                                           <td><div class="cell">添加<span class="text-info">properties</span>对应<span class="text-info">Key</span>的值时的默认值。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>验证规则</label></div></td>
                                            <td>
                                                <div class="cell">
                                                   添加<span class="text-info">properties</span>对应<span class="text-info">Key</span>的值的验证规则。
                                                </div>
                                            </td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>级联脚本</label></div></td>
                                            <td>
                                                <div class="cell">
                                                   <p><span class="text-warning">HTML</span>控件<span class="text-info">change</span>事件所触发执行的脚本，一般用作级联操作。</p>
                                                   <p>级联脚本用<span class="text-warning">JavaScript</span>编写， 脚本内置变量<span class="text-info">$property</span>、<span class="text-info">$model</span>、<span class="text-info">$modelTree</span>、<span class="text-info">$global</span>。</p>
                                                   <p><span class="text-info">$property</span>的引用等于<span class="text-info">properties</span>，通过<span class="text-info">$property[名称]</span>或者<span class="text-info">$property.名称</span>来访问属性的值。</p>
                                                   <p><span class="text-info">$model</span>的引用等于当前编辑<span class="text-warning">DataModel</span>的对象实例。</p>
                                                   <p><span class="text-info">$modelTree</span>的引用等于<span class="text-warning">工作台导航树结构</span>的对象。</p>
                                                   <p><span class="text-info">$global</span>的结构{dataModelCache:dataModelCache}，也可用于级联脚本存储数据。</p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix"><label>联合属性</label></div>
                            <p>联合属性定义了<span class="text-warning">DataModel</span>类型<span class="text-info">association</span>属性集合元素的数据结构。</p>
                            <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                                <div class="el-table__body-wrapper is-scrolling-none">
                                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
                                        <thead>
                                        <tr>
                                            <th width="180"><div class="cell">列</div></th>
                                            <th><div class="cell">说明</div></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>显示分组</label></div></td>
                                            <td><div class="cell">对表格列的标题进行分组显示。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>显示标题</label></div></td>
                                            <td><div class="cell">用户在工作台添加时，表格列的标题。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>显示宽度</label></div></td>
                                            <td><div class="cell">用户在工作台添加时，表格列的宽度。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>显示方式</label></div></td>
                                            <td><div class="cell">大师的撒的撒</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>属性名称</label></div></td>
                                            <td><div class="cell">集合元素对应的<span class="text-info">Key</span><span class="text-warning">（命名不能包含字符$）</span>。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>数据类型</label></div></td>
                                            <td>
                                                <div class="cell">
                                                    <p>集合元素对应<span class="text-info">Key</span>的值类型，不同类型对应不同的<span class="text-warning">HTML</span>控件。</p>
                                                    <p>支持类型同<a href="javascript:void(0)" ng-click="anchorScroll('typeApi')">普通属性-类型</a>。</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>默认值</label></div></td>
                                            <td><div class="cell">添加集合元素对应<span class="text-info">Key</span>的值时的默认值。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>验证规则</label></div></td>
                                            <td><div class="cell">添加集合元素对应<span class="text-info">Key</span>的值的验证规则。</div></td>
                                        </tr>
                                        <tr class="el-table__row">
                                            <td><div class="cell"><label>级联脚本</label></div></td>
                                            <td>
                                                <div class="cell">
                                                    <p><span class="text-warning">HTML</span>控件<span class="text-info">change</span>事件所触发执行的脚本，一般用作级联操作。</p>
                                                    <p>级联脚本用<span class="text-warning">JavaScript</span>编写， 脚本内置变量<span class="text-info">$property</span>、<span class="text-info">$model</span>、<span class="text-info">$modelTree</span>、<span class="text-info">$global</span>。</p>
                                                    <p><span class="text-info">$property</span>的引用等于集合元素，通过<span class="text-info">$property[名称]</span>或者<span class="text-info">$property.名称</span>来访问属性的值。</p>
                                                    <p><span class="text-info">$model</span>的引用等于当前编辑<span class="text-warning">DataModel</span>的对象实例。</p>
                                                    <p><span class="text-info">$modelTree</span>的引用等于<span class="text-warning">工作台导航树结构</span>的对象。</p>
                                                    <p><span class="text-info">$global</span>的结构{dataModelCache:dataModelCache}，也可用于级联脚本存储数据。</p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperDataModel",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style lang="less">
    #guide-developer-data-model{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        p{
            padding: 5px;
        }
        label {
            display: inline-block;
            max-width: 100%;
            margin-bottom: 5px;
            font-weight: bold;
        }
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
</style>