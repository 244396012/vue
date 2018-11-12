<template>
  <div>
    <div class="user-nav">
      <router-link :to="'/user-application'">待处理申请</router-link>
      <router-link :to="'/user-application/doing'" class="active">处理中申请</router-link>
      <router-link :to="'/user-application/done'">已完成申请</router-link>
      <router-link :to="'/user-application/cancel'">已取消申请</router-link>
    </div>
    <div class="user-vip">
      <el-table class="application"
                :data="tableData"
                border
                style="width: 100%">
        <el-table-column
          prop="orderNum"
          label="编号">
        </el-table-column>
        <el-table-column
          align="left"
          label="订单信息">
          <template scope="scope">
            <p>下单人：{{scope.row.orderLink}}</p>
            <p>电话：{{scope.row.orderTel}}</p>
            <p>要求：{{scope.row.orderRequ}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间">
          <template scope="scope">
            {{scope.row.orderTime | getTime}}
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="TotalScore"
          label="积分">
        </el-table-column>
        <el-table-column
          width="100"
          label="状态">
          <template scope="scope">
            {{scope.row.orderStatus | getType}}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="操作">
          <template scope="scope">
            <el-button type="text" class="div" @click="openModal(scope.row.id)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-app-show></edit-app-show>
  </div>
</template>
<script>
  import ElButton from "element-ui/packages/button/src/button"
  /* 模态框：编辑申请单 */
  import EditAppShow from '../../components/EditAppShow'
  import Utils from '../../utils'
  import { mapActions } from "vuex"

  export default {
    components: { ElButton,
      'edit-app-show': EditAppShow
    },
    name: 'ApplicationDoing',
    data (){
      return {
        account: null,
        status: 4,
        page: 1,
        pageSize: 99,
        tableData: []
      }
    },
    filters: {
      getType (val){
        let type = ''
        switch (val){
          case 1: type = '意向单';break
          case 2: type = '订单';break
          case 3: type = '待商会确认';break
          case 4: type = '已接单';break
          case 5: type = '已完成';break
          case 6: type = '取消';break
        }
        return type
      },
      getTime (val){
        return val ? Utils.formatTime(val,true) : '/'
      }
    },
    mounted (){
      this.account = JSON.parse(localStorage.getItem('storage_userInfo_'))
      this.account && this.showCartList()
    },
    methods: {
      ...mapActions([
        'showModal', 'showData'
      ]),
      showCartList (){
        this.$ajax.get('/order/list',{
          params: {
            mbId: this.account.id,
            startTime: '',
            endTime: '',
            SelectStatus: this.status,
            Page: this.page,
            PageSize: this.pageSize
          }
        }).then(res => {
          res.status === 200 && res.data.list && (this.tableData = res.data.list)
        })
      },
      openModal (id){
        this.showModal()
        this.$ajax.get('cart/selectOrderDetailsListByOrderId',{
          params: {
            orderId: id,
            Page: this.page,
            PageSize: this.pageSize
          }
        }).then(res => {
          res.data && this.showData(res.data) && (this.$store.state.orderId = id)
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/user-nav";
  @import "../../style/vip";
  .el-button.div{
    padding: 2px 10px;
  }
  .el-table.application{
    a{
      text-decoration: none;
      color: #00a0e9;
      margin: 0 4px;
      &:hover{
        color: #393939;
      }
    }
  }
  .cell>p{color: #333!important;margin-top: 0!important;}
</style>
<style lang="scss" scoped>
  .el-button+.el-button{margin-left: 0}
</style>
