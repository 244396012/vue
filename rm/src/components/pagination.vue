<template>
  <div class="rm-right">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'pagination',
    props: ['callback','total'],
    data (){
      return {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50]
      }
    },
    mounted (){
      sessionStorage.setItem('sy_rm_current_page', 1);
    },
    methods: {
      handleSizeChange(size) {
        this.currentPage = 1;
        this.pageSize = size;
        this.callback({
          pageNo: this.currentPage,
          pageSize: this.pageSize
        })
      },
      handleCurrentChange(curr) {
        this.currentPage = curr;
        this.callback({
          pageNo: this.currentPage,
          pageSize: this.pageSize
        });
        sessionStorage.setItem('sy_rm_current_page', curr)
      }
    }
  }
</script>
