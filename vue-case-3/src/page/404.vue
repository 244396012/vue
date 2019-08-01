<template>
  <div class="not-found">
      <img src="/static/image/404.png" alt="404">
      <p>页面丢失了，<span class="time">{{time}}s</span>后返回首页</p>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        time: 3
      }
    },
    created (){
      this.countDown()
    },
    methods: {
      countDown (){
        let timer = setInterval(() => {
          this.time --
          if(this.time === 0){
            clearInterval(timer)
            this.$router.push('/')
            return false
          }
        }, 1000)
      }
    }
  }
</script>
<style lang="scss">
  .not-found{
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -300px 0 0 -270px;
    text-align: center;
    color: #606060;
    .time{
      color: orangered;
    }
  }
</style>

