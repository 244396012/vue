<template>
  <div class="selection-list edit">
    <el-dialog title="申请单明细"
               top="3vh"
               :visible.sync="$store.state.show"
               :close-on-click-modal="false">
      <div class="operation">
        <span>共计<b> {{tableData.length}} </b>条标准</span>
        <span>共计积分：<b>{{totalScore}}</b></span>
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;">
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
  import {mapGetters} from 'vuex'
  export default {
    name: 'edit-app-show',
    computed: {
      ...mapGetters({
        tableData: 'showData'
      }),
      totalScore (){
        let total = 0
        this.tableData.forEach(item => {
          total += item.score
        })
        return total
      }
    },
  }
</script>
<style lang="scss">
  @import "../style/selection";
</style>
