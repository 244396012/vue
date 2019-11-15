<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" style="width: 80%;min-width: 900px;">
          <el-form-item label="文章标题：" :prop="'title'" :rules="{ required: true, message: '请输入文章标题', trigger: 'blur' }">
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
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip" style="margin: -20px 0;color: #888;text-align: left">
                图片格式仅限JPG、PNG两种格式，大小不超过3M。
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传封面：" v-if="ruleForm.imgUrl">
            <img class="previewImg" :src="ruleForm.imgUrl" alt="">
          </el-form-item>
          <el-form-item label="文章分类：" :prop="'type'" :rules="{ required: true, message: '请选择文章分类', trigger: 'change' }">
            <el-select v-model="ruleForm.type" placeholder="请选择文章分类" style="width: 400px">
              <el-option v-for="item in formSelect.typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正文内容：" :prop="'content'" :rules="{ required: true, message: '请输入正文内容', trigger: 'blur' }">
            <quill-editor :options="quillOption" v-model="ruleForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="浏览量基数：" :prop="'scanNum'" :rules="{ required: true, message: '请输入浏览量基数', trigger: 'blur' }">
            <el-input type="number" v-model="ruleForm.scanNum" clearable style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="点赞量基数：" :prop="'clickNum'" :rules="{ required: true, message: '请输入点赞量基数', trigger: 'blur' }">
            <el-input type="number" v-model="ruleForm.clickNum" clearable style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button @click="$router.push('/article/official')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor';
  import quillConfig from '@/common/quill-config';
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        quillOption: quillConfig,
        ruleForm: {
          title: '',
          imgUrl: '',
          type: '',
          content: '',
          scanNum: '',
          clickNum: ''
        },
        formSelect: {
          typeOptions: [{label: '行业资讯', value: '行业资讯'}]
        },
        btn: {
          disabled: false,
          txt: '发布文章'
        }
      };
    },
    methods: {
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
        fd.append('multipartFile ',file); //上传封面图
        const _this = this;
        this.$http.post('/interpreterArticle/uploadCover', fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '上传成功'
              });
              _this.ruleForm.imgUrl = w_formatProtocolUrl(res.data.data);
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
      },
      //发布文章
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
            if(this.ruleForm.clickNum < 0 || this.ruleForm.scanNum < 0){
              this.$message({
                type: 'warning',
                message: '基数不能小于0'
              });
              return;
            }
            this.btn.disabled = true;
            this.btn.txt = '发布中';
			      let partTxt = document.querySelector('.ql-editor').innerText.slice(0, 100);
            this.$http.post('/officialArticle/addOfficialArticle', this.$qs.stringify({
              articleId: '',
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
                  message: '发布成功'
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
              this.btn.txt = '发布文章';
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../style/quill.snow.css";
</style>
