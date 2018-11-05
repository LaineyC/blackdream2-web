<template>
    <div id="creation-strategy-manage">
        <div class="menu-list">
            <el-menu  mode="horizontal">
                <el-menu-item index="0">
                    <el-button @click="$router.go(-1)" type="info" size="small">返回</el-button>
                </el-menu-item>
                <el-menu-item index="1">
                    <el-button @click="save()" type="primary" size="small">保存</el-button>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="split-box">
            <Split v-model="split" :min="0.25" :max="0.5">
                <div slot="left" class="left-split-pane">
                    <AceEditor v-model="guide.content" lang="markdown" theme="chrome" width="100%" height="100%" @init="initAceEditor"/>
                </div>
                <div slot="right" class="right-split-pane">
                    <vue-markdown :source="guide.content"></vue-markdown>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor'
    import 'brace/ext/language_tools'
    import 'brace/mode/markdown'
    import 'brace/theme/chrome'
    import VueMarkdown from'vue-markdown'

    export default {
        name: "GeneratorGuideSave",
        components: {
            VueMarkdown,
            AceEditor,
        },
        data () {
            return {
                split: 0.5,
                guide:{
                    generatorId:this.$route.params.generatorId,
                    docType: this.Constant.GeneratorGuideDocTypeEnum.MARKDOWN.value,
                    content: ""
                }
            }
        },
        methods:{
            setDirty(item){
                item.isDirty = true;
            },
            save(){
                this.Api.GeneratorGuide.save(this.guide).then((data) => {
                    this.$message({type: 'success', message: '保存成功！'});
                });
            },
            initAceEditor:function (editor) {
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
            }
        },
        mounted(){
            this.Api.GeneratorGuide.get({generatorId: this.$route.params.generatorId,}).then((model) => {
                if(model !== undefined && model !== null){
                    Object.assign(this.guide, model);
                }
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
            padding: 5px 5px 1px 10px;
            height: 100%;
            overflow-y: auto;
        }
    }
</style>