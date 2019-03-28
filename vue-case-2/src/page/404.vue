<template>
  <div style="text-align: center;">
    <div class="position">
      <img src="../../static/image/404.png" alt="404">
      <div style="padding-top: 10px">
        <el-button type="primary" @click="back()">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      back (){
        this.$router.push('/')
      }
    }
  }
</script>
<style scoped>
  div.position{
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -350px 0 0 -360px
  }
</style>
