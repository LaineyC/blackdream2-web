<template>
    <el-dialog
        title="设置数据模型Scheme"
        :show-close="false"
        @close="close"
        width="900px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="125px" size="small">
            <el-form-item label="ROOT" v-if="request.ruleItemMap['']">
                <el-checkbox-group v-model="request.ruleItemMap[''].children">
                    <el-checkbox v-for="dm in dataModelList" :label="dm.code" :key="dm.id" name="type" border>{{dm.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="dataModel.name" v-for="dataModel in dataModelList" :key="dataModel.code">
                <el-checkbox-group v-model="request.ruleItemMap[dataModel.code].children">
                    <el-checkbox v-for="dm in dataModelList" :label="dm.code" :key="dm.id" name="type" border>{{dm.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "GeneratorInstanceCreateModal",
        data () {
            return {
                isShow:false,
                dataModelList:[],
                request: {
                    generatorId: null,
                    ruleItemMap:{

                    }
                },
                validRule: {

                }
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Api.DataModelSchema.save(this.request).then((data) => {
                            this.$emit('on-success');
                            this.close();
                            this.$message({type: 'success', message: '保存成功！'});
                        });
                    }
                });
            },
            open({generatorId,dataModelList}){
                this.request.generatorId = generatorId;
                this.Api.DataModelSchema.get({generatorId: generatorId}).then((schema) => {
                    let code_dataModelCache = {};
                    dataModelList.forEach(item => {
                        code_dataModelCache[item.code] = item;
                        this.$set(this.request.ruleItemMap, item.code, {children:[]});
                    });
                    if(schema){
                        let ruleItemMap = {};
                        for(let k in schema.ruleItemMap){
                            if(code_dataModelCache[k] || k === ""){
                                let ruleItem = ruleItemMap[k] = {children:[]};
                                schema.ruleItemMap[k].children.forEach(rule => {
                                    if(code_dataModelCache[rule]){
                                        ruleItem.children.push(rule);
                                    }
                                });
                            }
                        }
                        Object.assign(this.request, schema);
                        this.$set(this.request, "ruleItemMap", ruleItemMap);
                    }
                    dataModelList.forEach(item => {
                        if(!this.request.ruleItemMap[item.code]){
                            this.$set(this.request.ruleItemMap, item.code, {children:[]});
                        }
                    });
                    if(!this.request.ruleItemMap['']){
                        this.$set(this.request.ruleItemMap, '', {children:[]});
                    }
                    this.dataModelList = dataModelList;
                });
                this.isShow = true;
            },
            reset(){
                this.dataModelList = [];
                this.$refs.form.resetFields();
            },
            close(){
                this.reset();
                this.isShow = false;
            }
        },
    }
</script>

<style scoped lang="less">

</style>