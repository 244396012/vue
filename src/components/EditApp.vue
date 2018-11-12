<template>
  <div class="selection-list edit">
    <el-dialog title="申请单明细"
               top="3vh"
               :visible.sync="$store.state.show"
               :close-on-click-modal="false">
      <div class="operation">
        <span class="delete" @click="deleteOrder()" style="margin-top: 0">删除选中标准</span>
        <span>已选<b> {{totalLength}} </b>条标准</span>
        <span>所需积分：<b>{{totalScore}}</b></span>
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="36">
        </el-table-column>
        <el-table-column
          width="40"
          label="全选">
        </el-table-column>
        <el-table-column
          prop="stNum"
          label="标准号">
        </el-table-column>
        <el-table-column
          prop="stNameZh"
          label="标准名（中）">
        </el-table-column>
        <el-table-column
          prop="stNameF"
          label="标准名（外）">
        </el-table-column>
        <el-table-column
          prop="type"
          label="标准类型">
        </el-table-column>
        <el-table-column
          width="150"
          prop="score"
          label="所需积分">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex'
  export default {
    name: 'edit-app',
    data (){
      return {
        multipleSelection: [],
        totalScore: 0,
        totalLength: 0
      }
    },
    computed: {
      ...mapGetters({
        tableData: 'showData'
      })
    },
    methods: {
      ...mapActions(['showModal']),
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.totalScore = 0
        this.multipleSelection = val
        this.totalLength = this.multipleSelection.length
        this.multipleSelection.forEach(item => {
          this.totalScore += +item.score
        })
      },
      deleteOrder (){
        const ids = this.multipleSelection.map(item => item.id)
        this.$ajax.get('/cart/mDelOrderDetails',{
          params: {
            ordId: this.$store.state.orderId,
            ids: ids.join(',')
          }
        }).then(res => {
          if(res.data && res.data.message === '成功'){
            this.showModal()
            this.$message.success({message: '删除成功'})
          }else{
            this.$message.error({message: '删除失败'})
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../style/selection";
</style>
