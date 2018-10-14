<template>
    <el-dialog
        title="设置数据模型Scheme"
        :show-close="false"
        @close="close"
        width="800px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" :model="request" :rules="validRule" label-width="125px" size="small">
            <el-form-item label="ROOT">
                <el-checkbox-group v-model="request.ruleMap['']">
                    <el-checkbox v-for="dm in dataModelList" :label="dm.id" :key="dm.id" name="type" border>{{dm.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="dataModel.name" v-for="dataModel in dataModelList" :key="dataModel.id">
                <el-checkbox-group v-model="request.ruleMap[dataModel.id]">
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
                    ruleMap:{}
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
                        dataModelCache[item.id] = [];
                        this.$set(this.request.ruleMap, item.id, []);
                    });
                    if(schema){
                        let ruleMap = {};
                        for(let k in schema.ruleMap){
                            if(dataModelCache[k] || k === ""){
                                let ruleArray = ruleMap[k] = [];
                                schema.ruleMap[k].forEach(rule => {
                                    if(dataModelCache[rule]){
                                        ruleArray.push(rule);
                                    }
                                });
                            }
                        }
                        Object.assign(this.request, schema);
                        this.$set(this.request, "ruleMap", ruleMap);
                    }
                    dataModelList.forEach(item => {
                        if(!this.request.ruleMap[item.id]){
                            this.$set(this.request.ruleMap, item.id, []);
                        }
                    });
                    if(!this.request.ruleMap['']){
                        this.$set(this.request.ruleMap, '', []);
                    }
                    console.info(this.request.ruleMap);
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