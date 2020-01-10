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
  import { mapState } from 'vuex';
  export default {
    name: 'pagination',
    props: ['callback','total'],
    data (){
      return {
        currentPage: 1,
        pageSize: 20,
        pageSizes: [20, 50, 100]
      }
    },
    computed: {
      ...mapState(['resetSearchState'])
    },
    watch: {
      //监听重置搜索状态，true时代表重置状态，current设为1
      resetSearchState () {
        if(this.resetSearchState){
          this.currentPage = 1;
        }
      }
    },
    methods: {
      handleSizeChange(size) {
        this.currentPage = 1;
        this.pageSize = size;
        this.$route.query.pgSize = size;
        this.callback({
          pageNo: this.currentPage,
          pageSize: this.pageSize
        });
      },
      handleCurrentChange(curr) {
        this.currentPage = curr;
        this.callback({
          pageNo: this.currentPage,
          pageSize: this.pageSize
        });
        this.$store.state.resetSearchState = false;
      }
    }
  }
</script>
