<template>
  <div>
    <el-pagination class="diy-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="50"
      center>
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'pagination',
    data() {
      return {
        currentPage: 1
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>
<style lang="scss">
  .diy-pagination{
    text-align: center;
    .el-pager li{
      border: 1px solid #dcdfe6;
      font-weight: normal;
    }
    .el-pager li.active{
      background-color: #00a0e9;
      border-color: #00a0e9;
      color: #fff;
    }
  }
</style>
