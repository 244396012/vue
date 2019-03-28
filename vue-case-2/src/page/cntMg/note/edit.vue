<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.parName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: left;padding-left: 20px;padding-right: 20px">
      <el-button class="default-btn" @click="$router.push(breads.parPath)">返 回</el-button>
      <el-button v-if="$route.params.id === 'ft' || state === '草稿'"
                 class="float-right" type="primary"
                 @click="saveContent"
                 :disabled="confirmBtn.disabled">{{confirmBtn.txt}}</el-button>
      <el-button v-if="$route.params.id === 'ft'"
                 class="float-right" style="margin-right: 20px"
                 @click="saveDraftContent"
                 :disabled="draftBtn.disabled">{{draftBtn.txt}}</el-button>
      <el-button v-else
                 class="float-right" style="margin-right: 20px"
                 @click="putContent"
                 :disabled="putBtn.disabled">{{putBtn.txt}}</el-button>
    </div>
    <!--列表内容-->
    <div class="table mg-top">
      <el-form :model="form" ref="form" style="padding: 10px;">
        <el-form-item label="标题：">
          <el-input v-model="form.title" style="display: inline-block;width: 353px" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="封面图：">
          <el-upload
            class="upload-demo"
            drag
            action="/"
            :data="form"
            ref="newupload"
            :on-change="previewImg"
            :auto-upload="true"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="color: #888;padding-left: 80px">
              请尽量选择200*200的图片，否则展示时可能导致图片不清晰或变形
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片：" v-if="form.imgId">
          <div class="previewImg" :style="'backgroundImage: url('+form.imgUrl+')'"></div>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor
            v-model="form.content">
          </quill-editor>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  export default {
    data (){
      return {
        breads: {
          curName: '',
          parName: '',
          parPath: '',
          originalName: ''
        },
        draftBtn:{
          txt: '保存草稿',
          disabled: false
        },
        confirmBtn: {
          txt: '确认发布',
          disabled: false
        },
        putBtn: {
          txt: '保存修改',
          disabled: false
        },
        state: '',
        form: {
          id: '',
          title: '',
          imgUrl: '',
          imgId: '',
          content: ''
        }
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.breads.curName = this.$route.params.id === 'ft' ? '发帖' : '编辑'
      this.breads.parPath = this.$route.matched[1].path
      this.breads.parName = this.$route.matched[1].name
      this.$route.params.id !== 'ft' && this.fillDetail()
    },
    methods: {
      //本地图片预览
      previewImg(){
        const _this = this
        const event = event || window.event
        const file = event.target.files[0]
        const reader = new FileReader()
        //转base64
        reader.onload = function(e) {
          _this.form.imgUrl = e.target.result //将图片路径赋值给src
        }
        reader.readAsDataURL(file)
      },
      // 保存草稿（等待返回草稿id，再把id发送给确认发布）
      async saveDraftContent (arg){
        //arguments[0] 作为判断条件，给确认发布返回id用
        if(this.form.title === '' || this.form.imgId === '' || this.form.content === ''){
          this.$message({
            type: 'warning',
            message: '请填写“标题”、“封面图”和“内容”'
          })
          return false
        }
        if(arg === 'save'){
          this.confirmBtn.txt = '确认保存中'
          this.confirmBtn.disabled = true
        }else{
          this.draftBtn.txt = '保存草稿中'
          this.draftBtn.disabled = true
        }
        //修改时，如果状态为草稿，直接返回id
        if(this.state === '草稿'){
          return this.form.id
        }
        const data = await this.$http.post('/dictionary/article/save',this.$qs.stringify({
          title: this.form.title,
          imgId: this.form.imgId,
          content: this.form.content
        })).then(res => {
          //确认发布，返回res中的id给returnId
          if(arg === 'save'){
            return res.data
          }
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '草稿保存成功'
            })
            setTimeout(() => {
              this.$router.push(this.breads.parPath)
            },1000)
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.draftBtn.txt = '保存草稿'
          this.draftBtn.disabled = false
        })
        //返回结果
        return data
      },
      //确认发布
      saveContent (){
        const _this = this
        this.saveDraftContent('save').then(data => {
          if(!data) { return false }
		      _this.form.id = _this.state === '草稿' ? data : data.data
          _this.$http.post('/dictionary/article/pub',_this.$qs.stringify({
            id: _this.form.id,
            isTop: false
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '发布成功'
              })
              setTimeout(() => {
                this.$router.push(this.breads.parPath)
              },1000)
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            _this.confirmBtn.txt = '确认发布'
            _this.confirmBtn.disabled = false
          })
        })
      },
      // 上传前对文件的大小的判断
      beforeUpload (file) {
        let fileName = []
        fileName = file.name.split('.')
        const extension = fileName[fileName.length-1] === 'png'
        const extension2 =  fileName[fileName.length-1] === 'jpg'
        const extension3 =  fileName[fileName.length-1] === 'jpeg'
        const extension4 =  fileName[fileName.length-1] === 'bmp'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!extension && !extension2 && !extension3 && !extension4) {
          this.$message({
            message: '只能上传png、jpg、jpeg、bmp格式的图片',
            type: 'warning'
          });
          return false
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过2MB',
            type: 'warning'
          });
          return false
        }
        const fd = new FormData()
        fd.append('imgFile',file) //传图片
        const _this = this
        this.$http.post('/dictionary/article/uploadImg',fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '上传成功'
              })
              _this.form.imgId = res.data.data
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
      },
      // 根据id获取信息，填充内容
      fillDetail (){
        this.$http.get('/dictionary/article/detail?id='+this.$route.params.id)
          .then(res => {
            if(res.data.message === 'success'){
              this.form.id = res.data.data.id
              this.form.imgUrl = res.data.data.imageUrl
              this.form.title = res.data.data.title
              this.form.imgId = res.data.data.imgId
              this.form.content = res.data.data.contentHtml
              this.state = res.data.data.articleState
            }
          })
      },
      // 保存修改
      putContent (){
        if(this.form.title === '' || this.form.imgId === '' || this.form.content === ''){
          this.$message({
            type: 'warning',
            message: '请填写“标题”和“内容”'
          })
          return false
        }
        this.putBtn.txt = '保存中'
        this.putBtn.disabled = true
        this.$http.put('/dictionary/article/updateArticle',this.$qs.stringify({
          id: this.form.id,
          title: this.form.title,
          imgId: this.form.imgId,
          contentHtml: this.form.content
        })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '保存修改成功'
              })
              setTimeout(() => {
                this.$router.push(this.breads.parPath)
              },1000)
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.putBtn.txt = '保存修改'
            this.putBtn.disabled = false
          })
      }
    }
  }
</script>
<style>
  .quill-editor{
    width: 728px;
    float: left;
  }
  .ql-container,
  .ql-editor{
    min-height: 200px;
  }
</style>
<style scoped>
  /deep/ .el-form-item__label{
    width: 85px;
    text-align: right;
    padding: 0 6px 0 0;
  }
  /deep/ .el-form-item__error{
    left: 80px;
  }
</style>
