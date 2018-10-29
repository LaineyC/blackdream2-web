<template>
    <div id="guide-developer-note">
        <el-row>
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="card-header-flex">
                        <strong>注意事项</strong>
                    </div>
                   <div>
                       <p>1. 在开发设计生成器时，对需要采集的用户数据和最终生成的文件结构要有清晰的认知。</p>
                       <p>2. 通过对用户数据的抽象封装成一组<span class="text-warning">数据模型</span>来接收用户输入的<span class="text-warning">生成器数据</span>。</p>
                       <p>3. 通过对生成文件结构的抽象封装成一组<span class="text-warning">模板文件</span>和<span class="text-warning">生成策略</span>。</p>
                       <p>4. <span class="text-warning">生成策略</span>结合<span class="text-warning">数据模型</span>和<span class="text-warning">模板文件</span>生成相应的文件和文件结构。</p>
                       <p>5. 在开发设计生成器取变量名时（特别是定义数据模型普通属性名称和联合属性名称时），<strong class="text-warning">不要用关键字（__id__、__ob__、__proto__）</strong>。</p>
                   </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "GuideDeveloperNote",
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    #guide-developer-note{
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