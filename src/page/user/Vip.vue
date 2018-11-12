<template>
  <div>
    <div class="user-nav">
      <router-link class="active" :to="'/user-vip'">会员详情</router-link>
      <router-link :to="'/user-vip/points'">积分明细</router-link>
    </div>
    <div class="user-vip">
      <div class="vip-info">
        <div class="normal-user" v-if="!user.isVip">
          <span>您目前为普通用户，升级会员享受特权</span>
          <el-button type="primary" @click.native="openVip">立即成为会员>></el-button>
        </div>
        <div class="vip-user" v-else>
          <span>
            您目前为<b>会员</b>，剩余积分：<b>{{user.score}}</b> <br>
            <span class="time">有效期：{{user.startTime}} - {{user.endTime}}</span>
          </span>
          <el-button type="primary" @click.native="openVip">立即充值>></el-button>
        </div>
        <div class="vip-app">
          <h3>会员特权</h3>
          <span>提供标准翻译服务</span>
          <span>优先处理译文申请</span>
          <span>3-5天修改申请</span>
        </div>
      </div>
      <h3 class="title">充值介绍</h3>
      <el-table class="vip-bg"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="col1"
          label="充值金额">
        </el-table-column>
        <el-table-column
          label="获取会员权益">
          <template scope="scope">
            <img src="../../../static/image/vip.png" width="24"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="col2"
          label="积分">
        </el-table-column>
        <el-table-column
          prop="col3"
          label="赠送积分">
        </el-table-column>
        <el-table-column
          prop="col4"
          label="活动积分总计">
        </el-table-column>
      </el-table>
      <p>* 对外承包商会的会员可额外获取1%充值的积分</p>
      <p>* 会员的有效期为1年，在积分清空前，每次充值能保留之前未使用完的积分</p>
    </div>
  </div>
</template>
<script>
  import Utils from '../../utils'
  export default {
    name: 'Vip',
    data() {
      return {
        user:{
          isVip: false,
          score: 0,
          startTime: '/',
          endTime: '/'
        },
        tableData: []
      }
    },
    mounted (){
      this.getScoreInfo()
      this.getUserInfo()
    },
    methods: {
      openVip (){
        this.$router.push('/user-open-vip')
      },
      getScoreInfo (){
        this.$ajax.get('/common/scoreDeclare')
        .then(res =>{
          if(res.status === 200 && res.data.length > 0 && Array.isArray(res.data)){
            res.data.forEach(item => {
              const row = {
                col1: item.score,
                col2: item.score,
                col3: item.presentScore+'%',
                col4: item.amount
              }
              this.tableData.push(row)
            })
          }
        })
      },
      /* 获取用户信息 */
      getUserInfo (){
        this.$ajax.get('/member/info')
          .then(res => {
            if(res.data){
              if(res.data.mbClass && res.data.mbClass > 0){
                this.user.isVip = true
                this.user.score = res.data.myScore
                this.user.startTime = Utils.formatTime(res.data.mbStartTime)
                this.user.endTime = Utils.formatTime(res.data.mbEndTime)
              }
            }
          })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/user-nav";
  @import "../../style/vip";
</style>
