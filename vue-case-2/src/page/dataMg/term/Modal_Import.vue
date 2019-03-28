<template>
  <div>
    <el-dialog
      title="导入文件"
      :visible.sync="$store.state.switchImportModal"
      width="600px"
      center>
      <el-form :model="form">
        <el-form-item label="所属领域：">
          <el-select v-model="form.domainName" @change="getSecondAreaByValue" placeholder="一级分类">
            <el-option
              v-for="item in firstAreaArr"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
          <el-select v-model="form.subDomainName" placeholder="二级分类">
            <el-option
              v-for="item in secondAreaArr"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择语言：">
          <el-select v-model="form.source" placeholder="源语言">
            <el-option
              v-for="item in languagePairArr"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
          <el-select v-model="form.target" placeholder="目标语言">
            <el-option
              v-for="item in languagePairArr"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文档：">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :data="form"
            :before-upload="beforeUpload"
            :auto-upload="false"
            ref="newupload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="color: #888;text-align: center">
              支持扩展名：xls、xlsx、txt、csv、tbx，且不超过10MB<br>
              注意：请按照指定的模版格式上传，否则会解析失败<br>
              文档格式：第一列是术语原文，第二列是术语译文，第三列是术语解释
              <a :href="downloadUrl" class="download" target="_blank"> 下载模版文件</a>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchImportModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="newSubmitForm" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'termImport',
    props: ['callback'],
    data (){
      return {
        downloadUrl: '',
        uploadUrl: '/dictionary/term/uploadTermFile',
        form: {
          domainName: '',
          subDomainName: '',
          source: '',
          target: ''
        },
        btn: {
          txt: '提 交',
          disabled: false
        }
      }
    },
    mounted (){
      this.downloadUrl = this.$http.defaults.baseURL + '/dictionary/term/downloadTermFileModel'
    },
    computed: {
      ...mapGetters({
        firstAreaArr: 'firstArea',
        secondAreaArr: 'secondArea',
        languagePairArr: 'languagePair'
      })
    },
    methods: {
      // 获取二级领域
      getSecondAreaByValue (val){
        let obj = {}
        obj = this.firstAreaArr.find((item)=>{
          return item.fullSpecialtyName === val
        })
        this.form.subDomainName = ''
        this.getSecondArea(obj.specialtyId)
      },
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
        fd.append('domainName',this.form.domainName) //传其他参数
        fd.append('subDomainName',this.form.subDomainName)
        fd.append('source',this.form.source)
        fd.append('target',this.form.target)
        const _this = this
        this.$http.post('/dictionary/term/uploadTermFile',fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '导入成功'
              })
              _this.$store.commit('switchImportModal')
              _this.form.domainName = ''
              _this.form.subDomainName = ''
              _this.form.source = ''
              _this.form.target = ''
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
        for(let attr in this.form){
          if(this.form[attr] === ''){
            this.$message({
              type: 'warning',
              message: '请选择“领域”和“语言对”'
            })
            return false
          }
        }
        if(this.form.source === this.form.target){
          this.$message({
            type: 'warning',
            message: '请选择不同的语言'
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
