<template>
    <el-dialog
        title="粘贴板"
        :show-close="false"
        custom-class="tuple-clipboard-modal"
        @close="close"
        width="1600px"
        :close-on-press-escape="false"
        :visible.sync="isShow">
        <el-form ref="form" inline size="small">
            <el-card shadow="hover">
                <div class="tupleList" style="width: 100%">
                    <el-table class="field-table" row-key="__id__.value" :data="data.tupleList" style="width: 100%">
                        <el-table-column type="index" width="28" class-name="sort-handle"></el-table-column>
                        <el-table-column type="selection" width="25"></el-table-column>
                        <el-table-column :width="group.isGroup ? '' : group.model.displayWidth" :label="group.name" v-for="group in dataModel.fieldGroup" :key="group.id" :align="group.isGroup?'center':'left'">
                            <el-table-column v-if="group.isGroup" v-for="field in group.children" :label="field.comment" :width="field.displayWidth">
                                <template slot-scope="{ row, column, $index }">
                                    <el-form-item v-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" >
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                    <el-form-item v-else-if="row[field.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value">
                                        {{row[field.name].value}}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <template slot-scope="{ row, column, $index }">
                                <el-form-item v-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.BOOLEAN.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.INTEGER.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DECIMAL.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.STRING.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATE.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.TIME.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.DATETIME.value" >
                                    {{row[group.model.name].value}}
                                </el-form-item>
                                <el-form-item v-else-if="row[group.model.name].dataType===Constant.DataModelAttributeDataTypeEnum.MODEL_REF.value" >
                                    {{row[group.model.name].label}}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template slot-scope="{ row, column, $index }">
                                <el-button type="danger" size="small" @click="remove(row, $index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-form>
        <div slot="footer">
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "TupleClipboardModal",
        data () {
            return {
                isShow:false,
                data:{
                    tupleList:[]
                },
                dataModel:{}
            }
        },
        methods: {
            remove(row, index){
                let tupleList = this.data.tupleList;
                tupleList.splice(index, 1);
            },
            submit () {
                this.close();
            },
            open(config){
                this.dataModel = config.dataModel;
                this.data.tupleList = this.Storage.getTupleClipboard(this.dataModel.id);
                this.isShow = true;
            },
            close(){
                this.isShow = false;
            }
        }
    }
</script>

<style lang="less">
    #tuple-clipboard-modal{
        .el-table td, .el-table th{
            padding: 5px 0;
        }
        .el-table .cell{
            padding: 0 5px;
        }
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
            margin-right: 0;
        }
        .el-table, .el-table .cell, .el-table__body-wrapper, .el-card{
            //overflow: visible;
        }
        .el-table__body-wrapper .cell{
            overflow: visible;
        }
        .el-table__body-wrapper table{
            padding-bottom: 40px;
        }
        .el-popover{
            padding: 1px;
        }
        .el-card__header{
            padding: 10px;
        }
        .el-card__body{
            padding: 5px;
            .el-form-item--small.el-form-item, .el-form-item--mini.el-form-item{
                margin: 0;
            }
        }
        .sort-handle{
            cursor: move;
        }
        .properties .el-form-item{
            margin-left: 10px;
        }
        .el-tabs {
            position: relative;
            height: 100%;
            overflow: hidden;
            .el-tabs__content {
                position: absolute;
                width: 100%;
                top: 55px;
                bottom: 0;
                .el-tab-pane {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    bottom: 0;
                    overflow-y: auto;
                }
            }
            .group-label, .group-item{
                display: inline-block;
            }

            .properties .el-form-item,
            .tupleList .el-form-item,
            .tupleList .el-form-item__content{
                width: 100%;
            }
        }
    }
</style>