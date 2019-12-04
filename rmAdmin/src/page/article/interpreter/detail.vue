<template>
  <div class="page">
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文章信息" name="first">
            <div class="detail rm-right" v-if="+detail.status === 1">
              <el-button type="success" @click="reviewArticlePass()">审核通过</el-button>
              <el-button type="default" @click="reviewArticleRefuse()">审核不通过</el-button>
            </div>
            <div class="detail">
              <el-row class="exact">
                <el-col :span="8"><div class="grid-content bg-purple"><b>文章标题：</b>{{detail.articleTitle}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"><b>发布作者：</b>{{detail.publishUser}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div><b>提交时间：</b>{{detail.submissionTime}}</el-col>
              </el-row>
              <el-row style="margin-bottom: 0px;">
                <el-col :span="8"><div class="grid-content bg-purple">
                  <b style="display: inline-block;height: 100px;vertical-align: 88px;">文章封面：</b>
                  <img class="thumb-lg" :src="detail.coverId" alt=""></div></el-col>
                <template v-if="+detail.status === 2">
                  <el-col :span="16"><div class="grid-content bg-purple-light" style="color: red">审核未通过：{{detail.reviewDesc}}</div></el-col>
                </template>
                <template v-else-if="+detail.status === 4">
                  <el-col :span="16"><div class="grid-content bg-purple-light" style="color: red">发布撤回：{{detail.reviewDesc}}</div></el-col>
                </template>
                <template v-else-if="+detail.status === 3">
                  <el-col :span="8"><div class="grid-content bg-purple-light"><b>文章标签：</b>{{detail.lable}}</div></el-col>
                  <el-col :span="8"><div class="grid-content bg-purple"></div><b>发布时间：</b>{{detail.publishTime}}</el-col>
                </template>
              </el-row>

              <el-row class="exact">
                <el-col :span="20">
                  <div class="grid-content bg-purple sy-line">
                    <b style="display: table-cell;">正文内容：</b>
                    <div style="display: table-cell;">
                      <quill-editor :options="quillOption" v-model="detail.contentHtml" disabled></quill-editor>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="exact">
                <el-col :span="20"><div class="grid-content bg-purple">
                  <b style="margin-bottom: 10px">操作日志</b>
                  <el-table
                    border
                    stripe
                    :max-height="$store.state.tableHeight"
                    v-loading="operation.loading"
                    :data="operation.tableData">
                    <el-table-column
                      label="#"
                      prop="num"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      min-width="120"
                      prop="operateUserId"
                      label="日志id">
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      min-width="120"
                      prop="operateTime"
                      label="操作时间">
                    </el-table-column>
                    <el-table-column
                      min-width="100"
                      prop="operateUser"
                      label="操作人">
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      min-width="150"
                      prop="content"
                      label="操作内容">
                    </el-table-column>
                  </el-table>
                  <template v-if="operation.totalTableList > 0">
                    <pagination-log :callback="showLogTableList" :total="operation.totalTableList"></pagination-log>
                  </template>
                </div></el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论列表" name="second">
            <div class="detail">
              <el-row style="margin-bottom: 0">
                <el-col :span="8"><div class="grid-content bg-purple"><b>评论数量：</b>{{detail.commentsNumber}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"><b>浏览数量：</b>{{detail.viewCount}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div><b>点赞数量：</b>{{detail.likeNumber}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <p class="sy-bold">评论信息列表</p>
                  <el-table
                    border
                    stripe
                    :max-height="$store.state.tableHeight"
                    v-loading="comment.loading"
                    :data="comment.tableData">
                    <el-table-column
                      label="#"
                      prop="num"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      label="用户头像">
                      <template slot-scope="scope">
                        <img class="thumb" :src="scope.row.userHeadId" alt="">
                      </template>
                    </el-table-column>
                    <el-table-column
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
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="140">
                      <template slot-scope="scope">
                        <el-button type="text"
                                   v-if="scope.row.replies.length > 0"
                                   @click="$router.push('/article/interpreter/reply/'+scope.row.id)">{{`查看${scope.row.replies.length}条回复`}}</el-button>
                        <el-button type="text" class="del" @click="deleteComment(scope.row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <template v-if="comment.totalTableList > 0">
                    <pagination-comment :callback="showCommentTableList" :total="comment.totalTableList"></pagination-comment>
                  </template>
                </el-col>
                <el-col :span="20" style="padding-left: 5px">
                  <p class="sy-bold">点赞用户列表</p>
                  <el-table
                    border
                    stripe
                    :max-height="$store.state.tableHeight"
                    v-loading="point.loading"
                    :data="point.tableData">
                    <el-table-column
                      label="#"
                      prop="num"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      label="用户头像">
                      <template slot-scope="scope">
                        <img class="thumb" :src="scope.row.userAvatarId" alt="">
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="userNickName"
                      label="用户昵称">
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      min-width="100"
                      prop="likeTime"
                      label="点赞时间">
                    </el-table-column>
                  </el-table>
                  <template v-if="point.totalTableList > 0">
                    <pagination-click :callback="showClickTableList" :total="point.totalTableList"></pagination-click>
                  </template>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor';
  import quillConfig from '@/common/quill-config';
  import pagination from '@/components/pagination';
  export default {
    components: {
      quillEditor,
      'pagination-log': pagination,
      'pagination-comment': pagination,
      'pagination-click': pagination
    },
    data() {
      return {
        quillOption: quillConfig,
        activeName: 'first',
        detail: {},
        btn: {
          disabled: false,
          txt: '确认发布'
        },
        business: {
          disabled: true,
          scanNum: 0,
          clickNum: 0,
        },
        comment: {
          loading: false,
          totalTableList: 0,
          tableData: []
        },
        point: {
          loading: false,
          totalTableList: 0,
          tableData: []
        },
        operation: {
          loading: false,
          totalTableList: 0,
          tableData: []
        }
      };
    },
    mounted (){
      this.fillInForm();
      this.showLogTableList();
    },
    methods: {
      handleClick(tab, event) {
        if(tab.label === '评论列表'){
          this.showCommentTableList();
          this.showClickTableList();
        }
      },
      //填充form表单数据
      fillInForm() {
        this.$http.get('/interpreterArticle/InterpreterArticle', {
          params: {
            articleId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail = res.data.data;
            this.detail.contentHtml = res.data.data.contentHtml.replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>');
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //审核通过
      reviewArticlePass(){
        this.$confirm('是否确认通过，操作后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/interpreterArticle/reviewArticle',this.$qs.stringify({
            articleId: this.$route.params.id,
            status: 3,
            desc: ''
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '审核通过'
              });
              setTimeout(() => {
                this.$router.push('/article/interpreter');
              }, 1000);
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //审核不通过
      reviewArticleRefuse (){
        this.$prompt('不通过理由', '是否确认不通过，操作后无法撤回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '请输入不通过理由'
        }).then(({ value }) => {
          this.$http.put('/interpreterArticle/reviewArticle', this.$qs.stringify({
            articleId: this.$route.params.id,
            status: 2,
            desc: value
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              setTimeout(() => {
                this.$router.push('/article/interpreter');
              }, 1000);
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //获取操作日志
      showLogTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.post('/commentAndLog/getBussinessLogs', this.$qs.stringify({
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          bussinessId: this.$route.params.id
        })).then(res => {
          if(res.status === 200 && res.data.results.length >= 0){
            this.operation.tableData = [];
            const list = res.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.operation.tableData.push(item)
            });
            this.operation.totalTableList = res.data.totalCount
          }
          this.operation.loading = false;
        })
      },
      //获取“评论”详情数据
      showCommentTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.comment.loading = true;
        this.$http.post('/commentAndLog/getCommentAndReply', this.$qs.stringify({
          bussinessId: this.$route.params.id,
          pageNo: config.pageNo-1,
          pageSize: config.pageSize
        })).then(res => {
          if(res.status === 200 && res.data.results.length >= 0){
            this.comment.tableData = [];
            const list = res.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.comment.tableData.push(item);
            });
            this.comment.totalTableList = res.data.totalCount;
          }
          this.comment.loading = false;
        })
      },
      //获取“点赞”详情数据
      showClickTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.point.loading = true;
        this.$http.get('/interpreterArticle/likeList', {
          params: {
            articleId: this.$route.params.id,
            pageNo: config.pageNo-1,
            pageSize: config.pageSize
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.results.length >= 0){
            this.point.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.point.tableData.push(item);
            });
            this.point.totalTableList = res.data.data.totalCount;
          }
          this.point.loading = false;
        })
      },
      //删除评论
      deleteComment (id){
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/commentAndLog/deleteComment',this.$qs.stringify({
            commentId: id
          })).then(res => {
            if(res.data.msg === '成功'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.showCommentTableList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.obj
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../style/quill.snow.css";
</style>
