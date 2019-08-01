<template>
  <div>
    <el-dialog
      title="批量导入"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form>
        <el-form-item class="rm-right" style="margin-bottom: 10px;">
          <el-button @click="downLoad(downloadUrl)" type="text">选择题模版下载</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo rm-center"
            drag
            action="/choiceQuestion/batchAddChoiceQuestions"
            :before-upload="beforeUpload"
            :auto-upload="false"
            ref="newupload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">支持格式：xls、xlsx</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click.native="confirmUpload" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'modal-import',
    props: ['callback'],
    data (){
      return {
        downloadUrl: '/choiceQuestion/downloadChoiceQuestionModel',
        btn: {
          txt: '保 存',
          disabled: false
        }
      }
    },
    methods: {
      // 上传前对文件的判断
      beforeUpload (file) {
        let fileName = file.name.split('.')
        const extension = fileName[fileName.length-1] === 'xls'
        const extension2 =  fileName[fileName.length-1] === 'xlsx'
        if (!extension && !extension2) {
          this.$message({
            message: '只能上传xls、xlsx文件',
            type: 'warning'
          });
          return false
        }
        const fd = new FormData()
        const _this = this
        fd.append('multipartFile', file) //传文件
        this.$http.post('/choiceQuestion/batchAddChoiceQuestions',fd)
          .then(res => {
            if(res.data.code === '200' && res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '导入成功'
              })
              _this.$store.commit('showModal', false)
              _this.callback()
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            _this.btn.disabled = false
            _this.btn.txt = '保 存'
          })
      },
      //提交上传
      confirmUpload(){
        if(!document.querySelector('ul.el-upload-list>li')){
          this.$message({
            type: 'warning',
            message: '请先导入文件'
          })
          return false
        }
        this.btn.disabled = true
        this.btn.txt = '保存中'
        this.$refs.newupload.submit()
      }
    }
  }
</script>
