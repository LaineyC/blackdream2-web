<template>
    <el-dialog
        title="选择模型"
        :show-close="false"
        @close="close"
        width="600px"
        :close-on-press-escape="false"
        :visible.sync="isShow"
        append-to-body>
        <el-tree ref="tree" node-key="id" :data="treeData" :props="treeProps" :expand-on-click-node="false" highlight-current>
            <div slot-scope="{ node, data }" @dblclick.stop="submit">
                <div><i :class="data.model.dataModel.iconStyle"></i> {{ node.label }}</div>
            </div>
        </el-tree>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "DataModelChooseModal",
        data () {
            return {
                isShow:false,
                currentKey:null,
                treeData:[],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        methods: {
            submit () {
                let node = this.$refs.tree.getCurrentNode();
                this.$emit('on-success', node);
                this.close();
            },
            open(config){
                this.currentKey = config.currentKey;
                this.treeData = config.treeData;
                this.isShow = true;
                this.$nextTick(() => {
                    if(this.currentKey){
                        this.$refs.tree.setCurrentKey(this.currentKey);
                    }
                });
            },
            close(){
                this.isShow = false;
            }
        }
    }
</script>

<style scoped lang="less">

</style>