<template>
  <div id="about" class="container">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <h3>里程碑事件</h3>
          </div>
          <div>
              <el-timeline>
                  <el-timeline-item timestamp="2019年1月1日" placement="top">
                      <el-card>
                          <h4>BlackDream2</h4>
                          <p>BlackDream2上线</p>
                      </el-card>
                  </el-timeline-item>
                  <el-timeline-item timestamp="2016年1月1日" placement="top">
                      <el-card>
                          <h4>BlackDream1</h4>
                          <p>BlackDream1上线</p>
                      </el-card>
                  </el-timeline-item>
              </el-timeline>
          </div>
      </el-card>
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <h3>反馈邮箱</h3>
          </div>
          <div>
              272874065@qq.com
          </div>
      </el-card>
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <h3>捐赠项目</h3>
          </div>
          <div>
              <img style="width:300px" src="@/assets/image/contribute-zhifubao.jpg"/>
              <el-divider direction="vertical"></el-divider>
              <img style="width:300px" src="@/assets/image/contribute-weixin.jpg"/>
          </div>
      </el-card>
  </div>
</template>

<script>
    export default {
        name: 'AboutPage',
        components:{
        },
        data () {
          return {

          }
        },
        methods:{
            linkToGuide(){
                this.$router.push({ name: 'guideUserGenerator'});
            },
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
