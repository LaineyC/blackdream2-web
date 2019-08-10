<template>
  <div id="about" class="container">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <h3>捐赠项目</h3>
          </div>
          <div>
              <el-alert title="如果BlackDream给您带来了帮助，您可以捐赠本项目来表示你的谢意，就好像请我买杯奶茶！！！" type="success" :closable="false" effect="dark">
              </el-alert>
              <img style="width:300px" src="@/assets/image/contribute-zhifubao.jpg"/>
              <el-divider direction="vertical"></el-divider>
              <img style="width:300px" src="@/assets/image/contribute-weixin.jpg"/>
          </div>
      </el-card>
  </div>
</template>

<script>
    export default {
        name: 'ContributePage',
        components:{
        },
        data () {
          return {

          }
        },
        methods:{

        }
    }
</script>

<style scoped lang="less">
  #about{
        .el-card{
            margin: 20px 0;
        }
  }
</style>
