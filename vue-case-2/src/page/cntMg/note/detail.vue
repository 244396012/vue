<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.parName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: left;padding-left: 20px;padding-right: 20px">
      <el-button class="default-btn" @click="$router.push(breads.parPath)">返 回</el-button>
    </div>
    <!--列表内容-->
    <div class="table mg-top" style="padding: 20px;">
      <div style="width: 660px;margin: 0 auto;">
        <h3>{{title}}</h3>
        <p style="overflow: hidden;">
          <span class="time float-left">{{createTime}}</span>
          <span class="scan float-right">浏览人数：{{scanNum}}</span>
        </p>
        <div class="content" v-html="contentHtml"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  export default {
    data (){
      return {
        breads: {
          curName: '',
          parName: '',
          parPath: '',
          originalName: ''
        },
        title: '标题',
        createTime: '--',
        scanNum: '--',
        contentHtml: '内容'
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.breads.parPath = this.$route.matched[1].path
      this.breads.parName = this.$route.matched[1].name
      this.showDetail()
    },
    methods: {
      showDetail (){
        this.$http.get('/dictionary/article/detail?id='+this.$route.params.id)
          .then(res => {
            if(res.data.message === 'success'){
              this.title = res.data.data.title
              this.createTime = res.data.data.pubTime
              this.scanNum = res.data.data.countClick
              this.contentHtml = res.data.data.contentHtml
            }
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
/deep/ span.time,span.scan{
  color: #888;
  font-size: 14px;
}
  /deep/ .content{
    margin-top: 40px;
    line-height: 1.6;
    font-size: 14px;
    color: #333;
    img{
      width: 100%;
    }
  }
</style>
