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
                    <el-checkbox v-for="dm in dataModelList" :label="dm.id" :key="dm.id" name="type" border>{{dm.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="dataModel.name" v-for="dataModel in dataModelList" :key="dataModel.id">
                <el-checkbox-group v-model="request.ruleItemMap[dataModel.id].children">
                    <el-checkbox v-for="dm in dataModelList" :label="dm.id" :key="dm.id" name="type" border>{{dm.name}}</el-checkbox>
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
            open({generatorId}){
                this.request.generatorId = generatorId;
                let getRequest = this.Api.DataModelSchema.get({generatorId: generatorId});
                let infoQueryRequest = this.Api.DataModel.infoQuery({generatorId: generatorId});
                this.$http.all([getRequest, infoQueryRequest])
                .then((data) => {
                    let schema = data[0];
                    let dataModelList = data[1];
                    let dataModelCache = {};
                    dataModelList.forEach(item => {
                        dataModelCache[item.id] = item;
                        this.$set(this.request.ruleItemMap, item.id, {children:[]});
                    });
                    if(schema){
                        let ruleItemMap = {};
                        for(let k in schema.ruleItemMap){
                            if(dataModelCache[k] || k === ""){
                                let ruleItem = ruleItemMap[k] = {children:[]};
                                schema.ruleItemMap[k].children.forEach(rule => {
                                    if(dataModelCache[rule]){
                                        ruleItem.children.push(rule);
                                    }
                                });
                            }
                        }
                        Object.assign(this.request, schema);
                        this.$set(this.request, "ruleItemMap", ruleItemMap);
                    }
                    dataModelList.forEach(item => {
                        if(!this.request.ruleItemMap[item.id]){
                            this.$set(this.request.ruleItemMap, item.id, {children:[]});
                        }
                    });
                    if(!this.request.ruleItemMap['']){
                        this.$set(this.request.ruleItemMap, '', {children:[]});
                    }
                    this.dataModelList = dataModelList.sort((a, b) => {
                        if(a.name > b.name){
                            return 1;
                        }
                        else if(a.name === b.name){
                            return 0;
                        }
                        else{
                            return -1;
                        }
                    });
                });
                this.isShow = true;
            },
            close(){
                this.isShow = false;
                this.$refs.form.resetFields();
            }
        },
    }
</script>

<style scoped lang="less">

</style>