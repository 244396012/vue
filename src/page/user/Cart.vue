<template>
  <div class="selection-list">
    <div class="user-nav">
      <router-link :to="'/user-cart'" class="active">待保存清单</router-link>
      <router-link :to="'/user-cart/user-cart-done'">已保存清单</router-link>
    </div>
    <div class="operation">
      <span class="delete" @click="deleteCartList()">删除选中标准</span>
      <span>已选<b> {{totalLength}} </b>条标准</span>
      <span>所需积分：<b>{{totalScore}}</b></span>
      <el-button type="danger" @click.native="addCartList()" :disabled="btn.disabled">{{btn.txt}}</el-button>
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
        prop="stType"
        label="标准类型">
      </el-table-column>
      <el-table-column
        width="150"
        prop="stScore"
        label="所需积分">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'Cart',
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        totalLength: 0,
        totalScore: 0,
        btn: {
          disabled: false,
          txt: '保存清单'
        }
      }
    },
    mounted (){
      this.showCartList()
      this.$ajax.get('/member/info')
    },
    methods: {
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
          this.totalScore += +item.stScore
        })
      },
      showCartList (){
        this.tableData = JSON.parse(sessionStorage.getItem('storage_userCart_')) || []
      },
      deleteCartList (){
        this.multipleSelection.forEach(item => {
          for(let i = 0; i < this.tableData.length; i++){
            const data = this.tableData[i]
            if(item.id === data.id){
              this.tableData.splice(i,1)
              return
            }
          }
        })
        sessionStorage.setItem('storage_userCart_',JSON.stringify(this.tableData))
      },
      addCartList (){
        if(this.multipleSelection.length < 1){
          this.$message({
            message: '请选择标准',
            type: 'warning'
          })
          return
        }
        const mbId = JSON.parse(localStorage.getItem('storage_userInfo_')).id
        const stIds = this.multipleSelection.map(item => item.id).join(',')
        this.btn.txt = '保存中'
        this.btn.disabled = true
        this.$ajax.get('/cart/add',{
          params: {
            mbId: mbId,
            stIds: stIds
          }
        }).then(res => {
          if(res.status === 200){
            this.$message({
              type: 'success',
              message: '申请成功'
            })
            window.setTimeout(()=>{
              this.$router.push('/user-cart/user-cart-done')
              sessionStorage.removeItem('storage_userCart_')
            },1000)
          }
          this.btn.txt = '保存清单'
          this.btn.disabled = false
        })

      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/user-nav";
  @import "../../style/selection";
</style>
