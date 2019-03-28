<template>
  <div>
    <p class="bread-nav" v-show="isBreadNav" v-html="breadNav"></p>
    <template v-if="list.length > 0">
      <ul class="content-list" :key="item.id" v-for="item in list">
        <li>
          <el-row style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap">
            <el-col :span="8"><div class="grid-content bg-purple">
              <span class="list-question">标准号：</span><span class="list-answer">{{item.stNum}}</span>
            </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light">
              <span class="list-question">外文名称：</span><span class="list-answer" :title="item.stNameF">{{item.stNameF}}</span>
            </div></el-col>
            <!-- <el-col :span="8"><div class="grid-content bg-purple"><span class="list-question">标准状态：</span><span class="list-answer">{{}}</span></div></el-col> -->
          </el-row>
          <el-row style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap">
            <el-col :span="8"><div class="grid-content bg-purple">
              <span class="list-question">标准语种：</span><span class="list-answer">{{item.stLang}}</span>
            </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light">
              <span class="list-question">中文名称：</span><span class="list-answer" :title="item.stNameZh">{{item.stNameZh}}</span>
            </div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">
              <span class="list-question">发布日期：</span><span class="list-answer">{{item.createTimeStr}}</span>
            </div></el-col>
            <!-- <el-col :span="8"><div class="grid-content bg-purple-light"><span class="list-question">实施日期：</span><span class="list-answer">{{}}</span></div></el-col> -->
            <el-col :span="12"><div class="grid-content bg-purple">
              <el-button type="danger" @click.native="addToCart(item)">加入意向清单</el-button>
              <el-button type="primary" @click.native="showDetail(item.id,item.stNum, item)">查看详情</el-button>
            </div></el-col>
          </el-row>
        </li>
      </ul>
    </template>
    <template v-else>
      <p style="text-align: center;color: #808080;font-size: 14px">暂无数据</p>
    </template>
  </div>
</template>
<script>
  import Utils from '../../utils'
  import Axios from 'axios'
  export default {
    name: 'SortList',
    data (){
      return {
        breadNav: '',
        isBreadNav: false,
        list : []
      }
    },
    beforeRouteEnter (curr, prev, next) {
      next(vm => {
        let html = Utils.getBreadNav(2,curr,prev)
        if(html){
          vm.isBreadNav = true
          vm.breadNav = html
        }
      })
    },
    methods: {
      addToCart (data){
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
      showDetail (pid, type, item){
        let path = this.$route.path.split('/')[1]
        this.$router.push({
          path: '/'+ path +'/detail/'+pid,
          query: {pid: pid, type: type}
        })
      }
    },
    mounted(){
      const id =  this.$route.query.tId
      Axios.get('/type/get_foreignOrChina', {
        params: {
          id: id
        }
      }).then(response => {
        this.list = response.data
      })
    }
  }
</script>
<style lang="scss">
  @import "../../style/sort";
</style>
