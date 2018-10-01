<template>
    <div id="template-file-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-button @click="create()" type="primary" size="small">添加</el-button>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-button type="danger" size="small" @click="deleteAll">删除</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <div class="left-split-inner-pane">
                        <div style="padding: 5px;"><el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini"></el-input></div>
                        <el-tree ref="tree" :filter-node-method="filterNode" show-checkbox node-key="id" :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false" highlight-current>
                            <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick.stop="selectNode(data)">
                                <strong v-if="!data.model">{{ node.label }}</strong>
                                <span v-else>{{ node.label }}</span>
                                <span>
                                    <el-button v-if="!data.model" type="text" size="mini" @click.stop="create(data)">添加</el-button>
                                </span>
                            </div>
                        </el-tree>
                    </div>
                </div>
                <div slot="right" class="right-split-pane">
                    <el-tabs ref="tabs" type="card" @tab-click="clickTab">
                        <el-tab-pane :label="item.name" v-for="item in tabs" :key="item.id" :name="item.id">
                            <el-form :ref="'form' + item.id" label-width="80px" :model="item.model" :rules="validRule" inline size="small">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="item.model.name" placeholder="" />
                                </el-form-item>
                                <el-form-item label="模板语言" prop="engineType">
                                    <el-select v-model="item.model.engineType">
                                        <el-option v-for="item in Constant.TemplateEngineTypeEnum" :value="item.value" :key="item.id" :label="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="分组" prop="displayGroup">
                                    <el-input v-model="item.model.displayGroup" placeholder="" >
                                        <el-select v-model="item.model.displayGroup" slot="append" placeholder="请选择">
                                            <el-option v-for="group in treeData" :key="group.id" :value="group.id" :label="group.name"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>

                            <el-card shadow="hover">
                                <el-button-group slot="header">
                                    <el-button type="primary" size="mini" @click="update(item)">保存</el-button>
                                </el-button-group>
                                <div class="code-box">
                                    <el-form-item prop="script">
                                        <AceEditor v-model="item.model.script" :lang="['','velocity','ftl'][item.model.engineType]" theme="chrome" width="100%" height="100%" @init="initAceEditor"/>
                                    </el-form-item>
                                </div>
                            </el-card>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor'
    import 'brace/ext/language_tools'
    import 'brace/mode/ftl'
    import 'brace/mode/velocity'
    import 'brace/theme/chrome'

    export default {
        name: "TemplateFileManage",
        components: {
            AceEditor,
        },
        data () {
            return {
                idIncrement : 1,
                split: 0.15,
                generatorId:this.$route.params.generatorId,
                tabs:[],
                currentTabItem:{},
                filterText: '',
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
                    engineType: [
                        { type:"number", required: true, message: '请选择模板语言', trigger: 'change' }
                    ],
                    displayGroup: [
                        { required: true, message: '请填写分组', trigger: 'blur' },
                        { type: 'string', max: 255, message: '分组长度不能大于255', trigger: 'change' }
                    ]
                }
            }
        },
        methods:{
            newId(){
                return this.idIncrement++;
            },
            create(group){
                let id = this.newId();
                let model = {
                    id: "$" + id,
                    name: "新建模板" + id,
                    displayGroup: group != null ? group.name : "默认分组",
                    script:"Hello BlackDream",
                    generatorId: this.generatorId,
                    engineType: this.generator == null ? this.Constant.TemplateEngineTypeEnum.VELOCITY.value : this.generator.engineType
                };
                this.Api.TemplateFile.create(model).then((data) => {
                    model.id = data.id;
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                    this.selectNode(item);
                });
            },
            setDirty(item){
                item.isDirty = true;
            },
            update(item){
                this.$refs['form' + item.id][0].validate((valid, errors) => {console.info(this.$refs['form' + item.id][0])
                    if (valid) {
                        this.Api.TemplateFile.update(item.model).then((data) => {
                            item.name = item.model.name;
                            item.isDirty = false;
                            this.removeFromTreeData(item);
                            this.addToTreeData(item);
                            //this.$refs.tree.setCurrentKey(item.id);
                        });
                    }
                });
            },
            deleteAll(){
                let ids = this.$refs.tree.getCheckedKeys(true);
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
            },
            initAceEditor:function (editor) {
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
            },
            clickTab(tab){
                //this.$refs.tree.setCurrentKey(tab.name);
                let index = this.tabs.findIndex(item => item.id === tab.name);
                if(index !== -1){
                    this.currentTabItem = this.tabs[index];
                }
            },
            selectTab(item){
                this.$refs.tabs.setCurrentName(item.id);
                this.currentTabItem = item;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            selectNode(item){
                if(item.model == null){
                    return;
                }
                if(item.isLoadScript != null && item.isLoadScript){
                    this.addToTab(item);
                    this.selectTab(item);
                    return;
                }
                this.Api.TemplateFile.get({id: item.model.id}).then((model) => {
                    item.model.script = model.script;
                    item.isLoadScript = true;
                    this.addToTab(item);
                    this.selectTab(item);
                });
            },
            wrapToGroup(model){
                return  {
                    id: model.displayGroup,
                    name: model.displayGroup,
                    children: []
                };
            },
            wrapToItem(model){
                return {
                    isDirty:false,
                    isLoadScript:false,
                    id: model.id,
                    name: model.name,
                    model: model,
                    children: []
                };
            },
            addToTreeData(item){
                let model = item.model;
                if(this.treeData.length === 0){
                    let group = this.wrapToGroup(model);
                    this.$refs.tree.append(group);
                    this.addToGroup(item, group);
                    return;
                }
                for(let i = 0 ; i < this.treeData.length ; i++){
                    let group = this.treeData[i];
                    if(model.displayGroup === group.name){
                        this.addToGroup(item, group);
                        return;
                    }
                    else if(model.displayGroup < group.name){
                        let g = this.wrapToGroup(model);
                        this.$refs.tree.insertBefore(g, group);
                        this.addToGroup(item, g);
                        return;
                    }
                    else if(i + 1 === this.treeData.length){
                        let g = this.wrapToGroup(model);
                        this.$refs.tree.append(g);
                        this.addToGroup(item, g);
                        return;
                    }
                }
            },
            addToGroup(item, group){
                if(group.children.length === 0){
                    this.$refs.tree.append(item, group);
                    return;
                }
                for(let i = 0 ; i < group.children.length ; i++){
                    let child = group.children[i];
                    if(item.name === child.name){
                        this.$refs.tree.insertAfter(item, child);
                        return;
                    }
                    else if(item.name < child.name){
                        this.$refs.tree.insertBefore(item, child);
                        return;
                    }
                    else if(i + 1 === group.children.length){
                        this.$refs.tree.append(item, group);
                        return;
                    }
                }
            },
            removeFromTreeData(item){
/*
                for(let i = 0 ; i < this.treeData.length ; i++){
                    let group = this.treeData[i];
                    for(let j = 0 ; j < group.children.length ; j++){
                        let child = group.children[j];
                        if(item.id === child.id){
                            this.$refs.tree.remove(item);
                            if(group.children.length === 0){
                                this.$refs.tree.remove(group);
                            }
                            return;
                        }
                    }
                }
*/
                this.$refs.tree.remove(item);
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
                if(typeof item === "string"){
                    index = this.tabs.findIndex(tab => tab.id === item);
                }
                else{
                    index = this.tabs.indexOf(item);
                }
                if (index > -1) {
                    this.tabs.splice(index, 1);
                }
            },
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted(){
            this.Api.TemplateFile.infoQuery({generatorId: this.generatorId}).then((models) => {
                models.forEach(model => {
                    let item = this.wrapToItem(model);
                    this.addToTreeData(item);
                });
            });
            this.Api.Generator.get({id: this.generatorId}).then((data) => {
                this.generator = data;
            });
        }
    }
</script>

<style scoped lang="less">
    #template-file-manage{
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
 /*
        .left-split-pane{
            padding: 0;
            height: 100%;
            overflow: hidden;
            .left-split-inner-pane{
                height: 100%;
                margin-right: -18px;
                overflow-y: auto;
            }
        }
*/
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
    #template-file-manage{
        .el-tabs{
            position: relative;
            height: 100%;
            overflow: hidden;
            .el-tabs__content{
                position: absolute;
                width: 100%;
                top:60px;
                bottom: 0;
                .el-tab-pane{
                    position: absolute;
                    width: 100%;
                    top:0;
                    bottom: 0;
                    .el-card{
                        position: absolute;
                        width: 100%;
                        top:55px;
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
        }
    }
</style>