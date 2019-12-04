<template>
  <div class="page">
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文章信息" name="first">
            <div class="detail form">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" style="width: 80%;min-width: 900px;">
                <el-form-item label="文章标题：" prop="title">
                  <el-input type="text" v-model="ruleForm.title" clearable placeholder="请输入文章标题" style="width: 400px"></el-input>
                  {{ruleForm.title.length}}/50
                </el-form-item>
                <el-form-item label="文章封面：" required>
                  <el-upload
                    class="upload-demo"
                    drag
                    action="/"
                    :data="ruleForm"
                    ref="newupload"
                    :auto-upload="true"
                    :before-upload="beforeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"><em>点击重新上传</em></div>
                    <div class="el-upload__tip" slot="tip" style="margin: -20px 0;color: #888;text-align: left">
                      图片格式仅限JPG、PNG两种格式，大小不超过3M。
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="已上传封面：" v-if="ruleForm.imgUrl">
                  <img class="previewImg" :src="ruleForm.imgUrl" alt="">
                </el-form-item>
                <el-form-item label="文章分类：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="请选择文章分类" style="width: 400px">
                    <el-option v-for="item in formSelect.typeOptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="正文内容：" prop="content">
                  <quill-editor :options="quillOption" v-model="ruleForm.content"></quill-editor>
                </el-form-item>
                <el-form-item style="margin-top: 2rem">
                  <el-button type="success"
                             @click="submitForm('ruleForm')"
                             :disabled="btn.disabled">{{btn.txt}}</el-button>
                  <el-button @click="$router.push('/article/official')">取 消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论列表" name="second">
            <div class="detail">
              <el-row>
                <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">运营数据
                  <template v-if="business.disabled">
                    <el-button type="success" @click="business.disabled = false" style="float: right">基数修改</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success" style="float: right;margin-left: 10px"
                               @click="modifyOptParam">保存</el-button>
                    <el-button @click="business.disabled = true" style="float: right;">取消</el-button>
                  </template>
                </p>
                <table class="business-table">
                  <tr>
                    <td>真实浏览数</td>
                    <td>{{business.viewCount}}</td>
                    <td>浏览量基数</td>
                    <td style="padding: 0"><input type="number" :disabled="business.disabled" v-model="business.scanNum"></td>
                    <td>显示浏览量</td>
                    <td>{{business.viewCount + business.baseView}}</td>
                  </tr>
                  <tr>
                    <td>真实点赞数</td>
                    <td>{{business.likeCount}}</td>
                    <td>点赞量基数</td>
                    <td style="padding: 0"><input type="number" :disabled="business.disabled" v-model="business.clickNum"></td>
                    <td>显示点赞量</td>
                    <td>{{business.likeCount + business.baseLike}}</td>
                  </tr>
                  <tr>
                    <td>真实评论数</td>
                    <td>{{business.commentsCount}}</td><td></td><td></td><td></td><td></td>
                  </tr>
                </table>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <p class="sy-bold sy-title">评论信息列表</p>
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
                                   @click="$router.push('/article/official/reply/'+scope.row.id)">{{`查看${scope.row.replies.length}条回复`}}</el-button>
                        <el-button type="text" class="del" @click="deleteComment(scope.row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <template v-if="comment.totalTableList > 0">
                    <pagination-comment :callback="showCommentTableList" :total="comment.totalTableList"></pagination-comment>
                  </template>
                </el-col>
                <el-col :span="24">
                  <p class="sy-bold sy-title">点赞用户列表</p>
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
      'quill-editor': quillEditor,
      'pagination-comment': pagination,
      'pagination-click': pagination
    },
    data() {
      return {
        activeName: 'first',
        quillOption: quillConfig,
        ruleForm: {
          title: '',
          imgUrl: '',
          type: '',
          content: ''
        },
        formSelect: {
          typeOptions: [{label: '行业资讯', value: '行业资讯'}]
        },
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择文章分类', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入正文内容', trigger: 'blur' }
          ]
        },
        btn: {
          disabled: false,
          txt: '确认发布'
        },
        business: {
          disabled: true,
          scanNum: 0,
          clickNum: 0
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
        }
      };
    },
    mounted (){
      this.fillInForm();
    },
    methods: {
      handleClick(tab, event) {
        if(tab.label === '评论列表'){
          this.showCommentTableList();
          this.showClickTableList();
        }
      },
      // 上传前对文件的大小的判断
      beforeUpload (file) {
        let fileName = [];
        fileName = file.name.split('.');
        const extension = fileName[fileName.length-1] === 'png';
        const extension2 =  fileName[fileName.length-1] === 'jpg';
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!extension && !extension2) {
          this.$message({
            message: '图片格式不符合',
            type: 'warning'
          });
          return false
        }
        if (!isLt3M) {
          this.$message({
            message: '图片大小超过3MB',
            type: 'warning'
          });
          return false
        }
        const fd = new FormData();
        fd.append('multipartFile',file); //上传封面图
        const _this = this;
        this.$http.post('/interpreterArticle/uploadCover', fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '上传成功'
              });
              _this.ruleForm.imgUrl = res.data.data;
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
      },
      // 发布文章
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.title.length > 50){
              this.$message({
                type: 'warning',
                message: '文章标题长度超过限制'
              });
              return
            }
            if(!this.ruleForm.imgUrl){
              this.$message({
                type: 'warning',
                message: '请上传文章封面'
              });
              return;
            }
            this.btn.disabled = true;
            this.btn.txt = '发布中';
            let partTxt = document.querySelector('.ql-editor').innerText.slice(0, 100);
            this.$http.put('/officialArticle/editOfficialArticle', this.$qs.stringify({
              articleId: this.$route.params.id,
              status: '',
              articleTitle: this.ruleForm.title,
              coverId: this.ruleForm.imgUrl,
              content: this.ruleForm.content,
              partContent: partTxt,
              label: this.ruleForm.type,
              likeCount: this.ruleForm.clickNum,
              viewCount: this.ruleForm.scanNum
            })).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '确认发布'
                });
                setTimeout(() => {
                  this.$router.push('/article/official');
                }, 1000);
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
              this.btn.txt = '确认发布';
            })
          }
        })
      },
      // 当修改时，填充form表单数据
      fillInForm() {
        this.$http.get('/officialArticle/officialArticleDetails', {
          params: {
            articleId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.ruleForm.title = res.data.data.articleTitle;
            this.ruleForm.imgUrl = res.data.data.coverId;
            this.ruleForm.content = res.data.data.contentHtml;
            this.ruleForm.type = res.data.data.articleClass;
            this.business.clickNum = res.data.data.baseLike;
            this.business.scanNum = res.data.data.baseView;
            Object.assign(this.business, res.data.data);
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //修改运营参数
      modifyOptParam (){
        if(!this.business.clickNum || !this.business.scanNum){
          this.$message({
            type: 'warning',
            message: '请输入基数'
          });
          return;
        }
        if(+this.business.clickNum < 0 || +this.business.scanNum < 0){
          this.$message({
            type: 'warning',
            message: '基数不能小于0'
          });
          return;
        }
        this.$http.put('/officialArticle/updateArticleBaseData', this.$qs.stringify({
          articleId: this.$route.params.id,
          likeBase: this.business.clickNum,
          viewBase: this.business.scanNum
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.business.disabled = true;
            this.fillInForm();
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        });
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
            res.data.results.forEach((item, index) => {
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
            res.data.data.results.forEach((item, index) => {
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
