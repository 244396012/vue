<template>
  <div class="page">
    <div class="default-style">
      <p class="sy-bold">原评论信息</p>
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        :data="comment.tableData">
        <el-table-column
          label="#"
          prop="num"
          width="50">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="用户头像">
          <template slot-scope="scope">
            <img class="thumb" :src="scope.row.userHeadId" alt="">
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="userNickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="createTime"
          label="评论时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="content"
          label="评论内容">
        </el-table-column>
      </el-table>
      <p class="sy-bold">回复信息</p>
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="reply.loading"
        :data="reply.tableData">
        <el-table-column
          label="#"
          prop="num"
          width="50">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="用户头像">
          <template slot-scope="scope">
            <img class="thumb" :src="scope.row.userHeadId" alt="">
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="userNickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="replyTarget"
          label="回复对象">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="replyTime"
          label="回复时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="content"
          label="回复内容">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" class="del" @click="deleteComment(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import paginationComment from '@/components/pagination';
  import paginationClick from '@/components/pagination';
  export default {
    components: {
      'pagination-origin': paginationComment,
      'pagination-reply': paginationClick
    },
    data() {
      return {
        comment: {
          tableData: []
        },
        reply: {
          loading: false,
          tableData: []
        }
      };
    },
    mounted (){
      this.showCommentTableList();
    },
    methods: {
      //获取“评论信息”
      showCommentTableList (){
        this.reply.loading = true;
        this.$http.post('/commentAndLog/getCommentDetails', this.$qs.stringify({
          commentId: this.$route.params.id
        })).then(res => {
          if(res.status === 200){
            res.data.num = 1;
            res.data.replies.forEach((item, index) => {
              item.num = (index + 1);
              this.reply.tableData.push(item);
            });
            this.comment.tableData.push(res.data);
          }
          this.reply.loading = false;
        })
      },
      //删除
      deleteComment (id){
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/interpreterArticle/deleteReply',{
            params: {
              replyId: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.doSearch(this.showCommentTableList)
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
