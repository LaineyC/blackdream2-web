<template>
    <div id="creation-strategy-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-button @click="create()" type="success" size="small">新建</el-button>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-button type="danger" size="small" @click="deleteAll">删除</el-button>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-button type="info" size="small" @click="showTemplateFileScriptHelp">帮助</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <el-tree ref="tree" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                            <strong v-if="!data.model">{{ node.label }}</strong>
                            <span v-else>{{ node.label }}</span>
                            <span>
                                <el-button v-if="!data.model" type="text" size="mini" @click.stop="create(data)">添加</el-button>
                            </span>
                        </div>
                    </el-tree>
                </div>
                <div slot="right" class="right-split-pane">
                    <div v-for="item in tabs" :key="item.id" v-show="item===currentTabItem" class="tab-pane">
                        <el-form :ref="'form' + item.id" label-width="80px" :model="item.model" :rules="validRule" inline size="small">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="item.model.name" placeholder="" />
                            </el-form-item>
                            <el-form-item label="脚本语言" prop="scriptLanguage">
                                <el-select v-model="item.model.scriptLanguage">
                                    <el-option v-for="item in Constant.CreationStrategyLanguageEnum" :value="item.value" :key="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        <el-card shadow="hover">
                            <el-button-group slot="header">
                                <el-button type="primary" size="mini" @click="update(item)">保存</el-button>
                                <el-button type="success" size="mini" @click="insertTemplateFileScript(item)">插入模板代码</el-button>
                            </el-button-group>
                            <div class="code-box">
                                <el-form-item prop="script">
                                    <AceEditor :ref="'aceEditor' + item.id" v-model="item.model.script" lang="javascript" theme="chrome" width="100%" height="100%" @init="initAceEditor"/>
                                </el-form-item>
                            </div>
                        </el-card>
                        </el-form>
                    </div>
                </div>
            </Split>
        </div>
        <TemplateFileScriptHelpModal ref="templateFileScriptHelpModal"/>
    </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor'
    import 'brace/ext/language_tools'
    import 'brace/mode/javascript'
    import 'brace/theme/chrome'

    export default {
        name: "CreationStrategyManage",
        components: {
            AceEditor,
            TemplateFileScriptHelpModal:() => import('@/components/TemplateFileScriptHelpModal.vue'),
        },
        data () {
            return {
                idIncrement : 1,
                split: 0.15,
                generatorId:this.$route.params.generatorId,
                tabs:[],
                currentTabItem:{},
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                validRule: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { type: 'string', max: 255, message: '名称长度不能大于255', trigger: 'blur' }
                    ],
                    scriptLanguage: [
                        { type:"number", required: true, message: '请选择脚本语言', trigger: 'change' }
                    ]
                },
            }
        },
        methods:{
            newId(){
                return this.idIncrement++;
            },
            create(){
                let id = this.newId();
                let model = {
                    id: "$" + id,
                    name: "新建策略" + id,
                    script:"Hello BlackDream",
                    generatorId: this.generatorId,
                    scriptLanguage: this.Constant.CreationStrategyLanguageEnum.JAVASCRIPT.value
                };
                this.Api.CreationStrategy.create(model).then((data) => {
                    model.id = data.id;
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                    this.selectNode(item);
                    this.$message({type: 'success', message: '创建成功！'});
                });
            },
            setDirty(item){
                item.isDirty = true;
            },
            update(item){
                this.$refs['form' + item.id][0].validate((valid) => {
                    if (valid) {
                        this.Api.CreationStrategy.update(item.model).then((data) => {
                            item.name = item.model.name;
                            item.isDirty = false;
                            this.removeFromTreeData(item);
                            this.addToTreeData(item);
                            this.$refs.tree.setCurrentKey(item.id);
                            this.$message({type: 'success', message: '保存成功！'});
                        });
                    }
                });
            },
            deleteAll(){
                let ids = this.$refs.tree.getCheckedKeys(true);
                if(!ids.length){
                    return;
                }
                this.$confirm('确定删除所选？', {type: 'warning'})
                .then(() => {
                    this.Api.CreationStrategy.delete({idList:ids}).then((data) => {
                        let isCurrentIn = false;
                        ids.forEach(id => {
                            this.$refs.tree.remove(id);
                            this.removeFromTab(id);
                            if(this.currentTabItem != null && this.currentTabItem.id === id && !isCurrentIn){
                                isCurrentIn = true;
                            }
                        });
                        if(isCurrentIn && this.tabs.length > 0){
                            this.selectNode(this.tabs[0]);
                        }
                        this.$message({type: 'success', message: '删除成功！'});
                    });
                });
            },
            initAceEditor:function (editor) {
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
            },
            insertTemplateFileScript(item){
                let aceEditor = this.$refs['aceEditor' + item.id][0];
                let code = "";
                this.templateFileList.forEach(group => {
                    code +=  "//" + group.name + ";\n";
                    group.children.forEach(item => {
                        code +=  "var tf_" + item.name + " = $tempUtil.newTmpl(\"" + item.model.code + "\");\n";
                    });
                });
                if(code !== ""){
                    aceEditor.editor.insert("\n");
                    aceEditor.editor.insert(code);
                }
            },
            selectNode(item){
                if(item.isLoaded != null && item.isLoaded){
                    this.addToTab(item);
                    this.selectTab(item);
                    return;
                }
                this.Api.CreationStrategy.get({id: item.model.id}).then((model) => {
                    item.model.script = model.script;
                    item.isLoaded = true;
                    this.addToTab(item);
                    this.selectTab(item);
                });
            },
            selectTab(item){
                this.currentTabItem = item;
            },
            addToTab(item){
                let result = this.tabs.filter(value => {
                    return value.id === item.id;
                });
                if(result.length === 0){
                    this.tabs.push(item);
                }
            },
            removeFromTab(item){
                let index = -1;
                index = this.tabs.indexOf(item);
                if (index > -1) {
                    this.tabs.splice(index, 1);
                }
            },
            wrapToItem(model){
                return {
                    isDirty:false,
                    isLoaded:false,
                    id: model.id,
                    name: model.name,
                    model: model,
                    children: []
                };
            },
            addToTreeData(item){
                if(this.treeData.length === 0){
                    this.$refs.tree.append(item);
                    return;
                }
                for(let i = 0 ; i < this.treeData.length ; i++){
                    let child = this.treeData[i];
                    if(item.name === child.name){
                        this.$refs.tree.insertAfter(item, child);
                        return;
                    }
                    else if(item.name < child.name){
                        this.$refs.tree.insertBefore(item, child);
                        return;
                    }
                    else if(i + 1 === this.treeData.length){
                        this.$refs.tree.append(item);
                        return;
                    }
                }
            },
            removeFromTreeData(item){
                this.$refs.tree.remove(item);
            },
            showTemplateFileScriptHelp(){
                this.$refs.templateFileScriptHelpModal.toggle({generatorId: this.generatorId});
            }
        },
        mounted(){
            this.Api.CreationStrategy.infoQuery({generatorId: this.generatorId}).then((models) => {
                models.forEach(model => {
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                });
            });

            let wrapToGroup = function(model){
                return  {
                    id: model.displayGroup,
                    name: model.displayGroup,
                    children: []
                };
            };
            let wrapToItem = function(model){
                return {
                    id: model.id,
                    name: model.name,
                    model: model,
                    children: []
                };
            };
            let that = this;
            let addToTreeData = function(item){
                let model = item.model;
                if(that.templateFileList.length === 0){
                    let group = wrapToGroup(model);
                    that.templateFileList.push(group);
                    addToGroup(item, group);
                    return;
                }
                for(let i = 0 ; i < that.templateFileList.length ; i++){
                    let group = that.templateFileList[i];
                    if(model.displayGroup === group.name){
                        addToGroup(item, group);
                        return;
                    }
                    else if(model.displayGroup < group.name){
                        let g = wrapToGroup(model);
                        that.templateFileList.splice(i, 0, g);
                        addToGroup(item, g);
                        return;
                    }
                    else if(i + 1 === that.templateFileList.length){
                        let g = wrapToGroup(model);
                        that.templateFileList.push(g);
                        addToGroup(item, g);
                        return;
                    }
                }
            };
            let addToGroup = function(item, group){
                if(group.children.length === 0){
                    group.children.push(item);
                    return;
                }
                for(let i = 0 ; i < group.children.length ; i++){
                    let child = group.children[i];
                    if(item.name === child.name){
                        group.children.splice(i + 1, 0, item);
                        return;
                    }
                    else if(item.name < child.name){
                        group.children.splice(i, 0, item);
                        return;
                    }
                    else if(i + 1 === group.children.length){
                        group.children.push(item);
                        return;
                    }
                }
            };
            this.Api.TemplateFile.infoQuery({generatorId: this.generatorId}).then((templateFileList) => {
                this.templateFileList = [];
                templateFileList.forEach(model => {
                    let item = wrapToItem(model);
                    addToTreeData(item);
                });
            });
        }
    }
</script>

<style scoped lang="less">
    #creation-strategy-manage{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        .menu-list{
            position: absolute;
            top: 0;
            width: 100%;
        }
        .split-box{
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .left-split-pane{
            padding: 0;
            height: 100%;
            overflow-y: auto;
        }
        .right-split-pane{
            padding: 5px 1px 1px 6px;
            height: 100%;
            overflow-y: auto;
        }
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
    }
</style>
<style lang="less">
    #creation-strategy-manage{
        .tab-pane{
            position: relative;
            padding-top: 10px;
            height: 100%;
            overflow: hidden;
            .el-card{
                position: absolute;
                width: 100%;
                top:60px;
                bottom: 0;
                .el-card__header{
                    padding: 10px;
                }
                .el-card__body{
                    position: absolute;
                    width: 100%;
                    top:48px;
                    bottom: 0;
                    padding: 0;
                    .code-box{
                        position: absolute;
                        top:0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        overflow-x: hidden;
                        overflow-y: auto;
                        .el-form-item{
                            height: 100%;
                            width: 100%;
                            margin: 0;
                            .el-form-item__content{
                                height: 100%;
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>