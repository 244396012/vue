<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="文章标题">
                <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="12">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click.native="$router.push('/article/official/release')">发布文章</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          label="#"
          width="60">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.isTop" value="置顶" class="item">{{scope.row.num}}</el-badge>
            <el-badge v-else class="item">{{scope.row.num}}</el-badge>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="articleTitle"
          label="文章标题">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="coverId"
          label="封面">
          <template slot-scope="scope"><img class="thumb" :src="scope.row.coverId" alt=""></template>
        </el-table-column>
        <el-table-column
          prop="articleClass"
          label="文章分类">
        </el-table-column>
        <el-table-column
          width="80"
          prop="baseView"
          label="浏览数">
        </el-table-column>
        <el-table-column
          width="80"
          prop="baseLike"
          label="点赞数">
        </el-table-column>
        <el-table-column
          width="100"
          prop="commentsCount"
          label="评论数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="publishTime"
          label="发布时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/article/official/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="!scope.row.isTop"
                       @click="topTableRow(scope.row.id, 1)">置顶</el-button>
            <el-button type="text"
                       v-else
                       @click="topTableRow(scope.row.id, 0)">取消置顶</el-button>
            <el-button type="text" class="del"
                       @click="deleteTableRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        form: {
          title: '',
          rangeTime: ''
        },
        tableData: []
      }
    },
    created (){
      this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/officialArticle/listOfficialArticle', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            articleTitle: this.form.title,
            publishStartTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            publishEndTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.data.content.length >= 0){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
          }
          this.loading = false;
        })
      },
      //置顶
      topTableRow (id, status){
        this.$http.put('/officialArticle/toppingArticle', this.$qs.stringify({
          articleId: id,
          isTop: status
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.showTableList();
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      //删除
      deleteTableRow (id){
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/officialArticle/deleteArticle',{
            params: {
              articleId: id
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
      }
    }
  }
</script>
