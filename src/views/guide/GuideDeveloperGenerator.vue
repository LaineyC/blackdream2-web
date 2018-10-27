<template>
    <div id="guide-developer-generator">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>我的生成器</strong>
                    </div>
                   <div>
                       <p>一个生成器由<span class="text-warning">数据模型</span>、<span class="text-warning">模板文件</span>、<span class="text-warning">生成策略</span>三部分构成。</p>
                       <p>用户先是在工作台根据生成器定义的<span class="text-warning">数据模型</span>输入相应的生成数据，然后选择<span class="text-warning">生成策略</span>执行生成操作，最后生成器根据<span class="text-warning">生成策略</span>及其对应的<span class="text-warning">模板文件</span>来生成相应的文件及文件夹。</p>
                       <p>生成器有<span class="text-warning">发布</span>和<span class="text-warning">维护</span>两个状态，对<span class="text-warning">数据模型</span>、<span class="text-warning">模板文件</span>、<span class="text-warning">生成策略</span>进行编辑（增删改）后，生成器自动进入<span class="text-warning">维护</span>状态，开发者需手动发布才能更改生成器状态为<span class="text-warning">发布</span>状态。在<span class="text-warning">维护</span>状态只有该生成器开发者能够编辑生成数据，使用者必须等待开发者<span class="text-warning">发布</span>生成器后才能编辑。</p>
                       <p>
                           生成器被（除了开发者自己以外的）使用者新建实例后，生成器就不得删除了（同时该生成器定义的<span class="text-warning">数据模型</span>也不能删除了）。
                           因为<span class="text-warning">数据模型</span>定义了使用者生成数据的数据结构，一旦删除，使用者编辑的生成数据将直接失效。
                           而<span class="text-warning">模板文件</span>和<span class="text-warning">生成策略</span>是生成器生成文件时的临时策略，和使用者生成数据并不相关，由开发者维护，所以可以删除。
                       </p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperGenerator",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-developer-generator{
        .card-header-flex{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        p{
            padding: 5px;
        }
    }
</style>