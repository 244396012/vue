<template>
  <div class="page">
    <div class="default-style">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="addNewLabel">新增标签</el-button>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        style="width: 900px"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          prop="num"
          label="标签序号">
        </el-table-column>
        <el-table-column
          prop="lableName"
          label="标签名称">
        </el-table-column>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyLabel(scope.row.id,scope.row.lableName)">修改</el-button>
            <el-button type="text" class="del" @click="deleteLabelRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-modal :callback="showTableList" :uLabel.sync="label"></add-modal>
  </div>
</template>
<script>
  import addModal from './modal_add';
  export default {
    components: {
      'add-modal': addModal
    },
    data (){
      return {
        label: '',
        loading: false,
        tableData: []
      }
    },
    mounted (){
     this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.post('/interpreterArticle/listArticleLabel')
          .then(res => {
            if(res.data.message === 'success' && res.data.data.length >= 0){
              this.tableData = [];
              res.data.data.forEach((item, index) => {
                item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
                this.tableData.push(item)
              });
            }
            this.loading = false
        })
      },
      //删除
      deleteLabelRow (id){
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/interpreterArticle/deleteArticleLabel',{
            params: {
              labelId: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.showTableList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      addNewLabel (){
        this.label = '';
        this.$store.commit('showModal');
      },
      modifyLabel (id, label){
        this.label = {
          id: id,
          name: label
        };
        this.$store.commit('showModal');
      }
    }
  }
</script>
