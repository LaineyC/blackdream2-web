<template>
  <div id="about" class="container">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <h3>里程碑</h3>
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
              <h3>联系我们</h3>
          </div>
          <div>
              通过邮箱<a href="mailto:272874065@qq.com" target="_blank">272874065@qq.com</a>联系我。
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
