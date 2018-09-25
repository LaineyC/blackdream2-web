<template>
  <div id="home" class="container">
      <el-card>
          <h1>Welcome to BlackDream!</h1>
      </el-card>
      <el-card style="margin-top: 10px;">
          <h1>一个让开发者快速构建的文本生成器平台。</h1>
      </el-card>
      <el-card style="margin-top: 10px;">
          <h1>机械重复性的工作如同黑色梦魇，同一个问题并不应该被解决两次！</h1>
      </el-card>
      <el-card style="margin-top: 10px;">
          <el-button type="text" @click="linkToGuide"><strong style="font-size: 24px;">指南</strong></el-button>
      </el-card>
  </div>
</template>

<script>
    export default {
        name: 'HomePage',
        components:{
        },
        data () {
          return {

          }
        },
        methods:{
            linkToGuide(){
                this.$router.push({ name: 'guide'});
            },
        }
    }
</script>

<style scoped lang="less">
  #home{
        .el-card{
            margin: 20px 0;
        }
  }
</style>
