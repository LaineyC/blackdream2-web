<template>
    <div class="template-file-script-help-modal" v-show="isShow">
        <el-card class="box-card">
            <div slot="header" class="card-header-flex">
                <strong>API</strong>
            </div>
            <div>
                dadadadadada
            </div>
        </el-card>
        <br/>
        <el-card class="box-card">
            <div slot="header" class="card-header-flex">
                <strong>模板文件</strong>
            </div>
            <el-collapse>
                <el-collapse-item :title="group.name" v-for="group in treeData" :name="group.name" :key="group.name">
                    <div v-for="item in group.children" :key="item.id">
                        {{item.name}}：<el-tag type="info">var tf_{{item.name}} = new File("{{item.model.code}}");</el-tag>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "TemplateFileScriptHelpModal",
        data () {
            return {
                isShow:false,
                treeData:[]
            }
        },
        methods: {
            toggle(config){
                if(this.isShow){
                    this.close();
                }
                else{
                    this.open(config);
                }
            },
            open({generatorId}){
                if(!this.isLoad){
                    this.Api.TemplateFile.infoQuery({generatorId: generatorId}).then((models) => {
                        models.forEach(model => {
                            let item = this.wrapToItem(model);
                            this.addToTreeData(item);
                        });
                        this.isLoad = true;
                    });
                }
                this.isShow = true;
            },
            close(){
                this.isShow = false;
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
                    this.treeData.push(group);
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
                        this.treeData.splice(i, 0, g);
                        this.addToGroup(item, g);
                        return;
                    }
                    else if(i + 1 === this.treeData.length){
                        let g = this.wrapToGroup(model);
                        this.treeData.push(g);
                        this.addToGroup(item, g);
                        return;
                    }
                }
            },
            addToGroup(item, group){
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
            },
        }
    }
</script>

<style scoped lang="less">
    .template-file-script-help-modal{
        position: absolute;
        right: 0;
        width: 600px;
        overflow-x: hidden;
        height: 100%;
        z-index: 2000;
    }
    .el-tag{
        margin: 2px 0;
        padding: 0 5px;
    }
    .card-header-flex{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>