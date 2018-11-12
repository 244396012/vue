<template>
  <div>
    <p class="bread-nav" v-if="isBreadNav" v-html="breadNav"></p>
    <ul class="content-list">
      <li>
        <el-row>
          <el-col :span="7"><div class="grid-content bg-purple"><span class="list-question">标准号：</span><span class="list-answer">{{detailsList.stNum}}</span></div></el-col>
          <el-col :span="7"><div class="grid-content bg-purple-light"><span class="list-question">语种：</span><span class="list-answer extra">{{detailsList.stLang}}</span></div></el-col>
          <el-col :span="10"><div class="grid-content bg-purple">
            <span class="list-question">所需积分：</span><span class="list-answer extra">{{detailsList.stScore}}</span>
            <el-button type="danger" @click.native.prevent="addToCart(detailsList)">加入意向清单</el-button>
          </div></el-col>
        </el-row>
      </li>
      <li class="content">
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple extra">标准简介</div></el-col>
          <el-col :span="20"><div class="grid-content bg-purple-light"><p class="extra"></p></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="1"><div class="grid-content bg-purple">&nbsp;</div></el-col>
          <el-col :span="23"><div class="grid-content bg-purple-light"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple extra">基本信息</div></el-col>
          <el-col :span="20"><div class="grid-content bg-purple-light"><p class="extra"></p></div></el-col>
        </el-row>
        <el-row class="extra">
          <el-col :span="2"><div class="grid-content bg-purple">&nbsp;</div></el-col>
          <el-col :span="22"><div class="grid-content bg-purple-light">
            <p><span>标准号：</span><span>{{detailsList.stNum}}</span></p>
            <p><span>标准中文名：</span><span>{{detailsList.stNameZh}}</span></p>
            <p><span>标准名称：</span><span>{{detailsList.stNameF}}</span></p>
            <!-- <p><span>标准状态：</span><span>{{}}</span></p> -->
            <!-- <p><span>发布日期：</span><span>{{}}</span></p> -->
            <!-- <p><span>实施日期：</span><span>{{}}</span></p> -->
            <p><span>出版语种：</span><span>{{detailsList.stLang}}</span></p>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple extra">内容信息</div></el-col>
          <el-col :span="20"><div class="grid-content bg-purple-light"><p class="extra"></p></div></el-col>
        </el-row>
        <el-row class="extra">
          <el-col :span="2"><div class="grid-content bg-purple">&nbsp;</div></el-col>
          <el-col :span="22"><div class="grid-content bg-purple-light">
            <p><span>页数：</span><span>{{detailsList.stPage}}</span></p>
            <p><span>字数：</span><span>{{detailsList.stCharAmount}}</span></p>
            <p><span>现有版本：</span><span>{{detailsList.stVn}}</span></p>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple extra">其他信息</div></el-col>
          <el-col :span="20"><div class="grid-content bg-purple-light"><p class="extra"></p></div></el-col>
        </el-row>
        <el-row class="extra">
          <el-col :span="2"><div class="grid-content bg-purple">&nbsp;</div></el-col>
          <el-col :span="22"><div class="grid-content bg-purple-light">
            <p><span>标准类型：</span><span>{{detailsList.tyName}}</span></p>
            <!-- <p><span>标准属性：</span><span>{{detailsList}}</span></p> -->
          </div></el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>
<script>
  import Utils from '../../utils'
  import Axios from "axios"
  export default {
    name: 'Detail',
    data (){
      return {
        breadNav: '',
        isBreadNav: false,
        detailsList: {}
      }
    },
    beforeRouteEnter (curr, prev, next) {
      next(vm => {
        let html = Utils.getBreadNav(3,curr,prev)
        if(html){
          vm.isBreadNav = true
          vm.breadNav = html
        }
      })
    },
    mounted(){
      this.showDetails()
    },
    methods: {
      addToCart (data){
        if(!data) return
        const cartList = JSON.parse(sessionStorage.getItem('storage_userCart_')) || []
        this.$message({
          message: '加入成功',
          type: 'success'
        })
        const isAdd = cartList.some(item => {
          return item.id === data.id
        })
        if(!isAdd){
          cartList.push(data)
          sessionStorage.setItem('storage_userCart_',JSON.stringify(cartList))
        }
      },
      showDetails (){
        const id = this.$route.query.pid
        Axios.get("/type/get_standardDetails",{
          params: {
            id: id
          }
        }).then(response => {
          console.log(response)
          this.detailsList = response.data
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/sort";
</style>
<style lang="scss" scoped>
  .el-button{float: right;}
  .el-row{
    div.extra{
      color: #515151;
    }
    p.extra{
      border-bottom: 1px solid #f2f2f2;
      height: 4px;
    }
  }
  .el-row.extra{
    height: auto!important;
    line-height: 24px!important;
    p>span:first-child{
      display: inline-block;
      width: 90px;
      text-align: right;
      color: #8a8a8a;
    }
  }
  .list-answer.extra{color: #f44f4f;font-weight: bold}
  .content{
    margin-top: -10px;
    border-top: none;
  }
</style>
