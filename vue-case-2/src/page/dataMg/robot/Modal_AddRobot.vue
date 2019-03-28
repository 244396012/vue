<template>
  <div>
    <el-dialog
      title="新建抓取请求"
      :visible.sync="$store.state.switchAddModal"
      width="600px"
      center>
      <el-form :model="form">
        <el-form-item label="抓取字段：">
          <el-radio-group v-model="form.field">
            <el-radio v-for="item in fieldList"
                         :key="item.id"
                         :label="item.id"
                         name="field">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抓取网站：">
          <el-radio-group v-model="form.website" style="width: 450px">
            <el-radio v-for="item in websiteList"
                         :key="item"
                         :label="item"
                         name="website" style="margin-right: 20px;margin-left: 0;margin-bottom: 10px"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传文档：">
          <el-upload
            class="upload-demo"
            drag
            :data="form"
            :action="uploadUrl"
            :auto-upload="false"
            :before-upload="beforeUpload"
            ref="newupload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="color: #888;text-align: center">
              支持扩展名：xls、xlsx、txt、csv、tbx，且不超过10MB
              <a :href="downloadUrl" class="download" target="_blank"> 下载模版文件</a>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchAddModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="newSubmitForm" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'newSpider',
    props: ['callback','websiteList'],
    data (){
      return {
        downloadUrl: '',
        uploadUrl: '/dictionary/machineScrapy/downloadScrapyModel',
        fieldList: [
          {id: 1, name: '译文'},
          {id: 2, name: '释义'},
          {id: 3, name: '译文和释义'}
        ],
        btn: {
          txt: '提 交',
          disabled: false
        },
        form: {
          field: '',
          website: ''
        }
      }
    },
    mounted (){
      this.downloadUrl = this.$http.defaults.baseURL + '/dictionary/machineScrapy/downloadScrapyModel'
    },
    methods: {
      // 上传前对文件的大小的判断
      beforeUpload (file) {
        let fileName = []
        fileName = file.name.split('.')
        const extension = fileName[fileName.length-1] === 'xls'
        const extension2 =  fileName[fileName.length-1] === 'xlsx'
        const extension3 =  fileName[fileName.length-1] === 'txt'
        const extension4 =  fileName[fileName.length-1] === 'csv'
        const extension5 =  fileName[fileName.length-1] === 'tbx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
          this.$message({
            message: '只能上传xls、xlsx、txt、csv文件',
            type: 'warning'
          });
          return false
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过10MB',
            type: 'warning'
          });
          return false
        }
        this.btn.disabled = true
        this.btn.txt = '提交中'
        const fd = new FormData()
        fd.append('file',file) //传文件
        fd.append('field',this.form.field) //传其他参数
        fd.append('website',this.form.website)
        const _this = this
        this.$http.post('/dictionary/machineScrapy/createScrapyRequest',fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '新建抓取成功'
              })
              _this.$store.commit('switchAddModal')
              _this.form.field = ''
              _this.form.website = ''
              _this.callback()
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            _this.btn.disabled = false
            _this.btn.txt = '提 交'
          })
      },
      //提交上传
      newSubmitForm(){
        if(this.form.field === '' || this.form.website === ''){
          this.$message({
            type: 'warning',
            message: '请选择“抓取字段”和“抓取网站”'
          })
          return false
        }
        if(!document.querySelector('ul.el-upload-list>li')){
          this.$message({
            type: 'warning',
            message: '请上传文件'
          })
          return false
        }
        this.$refs.newupload.submit()
      }
    }
  }
</script>
