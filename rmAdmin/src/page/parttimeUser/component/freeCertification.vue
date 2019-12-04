<template>
  <div>
    <el-dialog
      title="身份认证免认证"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form :model="form" ref="form" label-width="130px">
        <el-form-item label="用户真实姓名："
                      style="margin-bottom: 15px"
                      :prop="'realName'" :rules="{ required: true, message: '请输入真实姓名', trigger: 'blur' }">
          <el-input type="text" v-model="form.realName" placeholder="请输入真实姓名" style="width: 280px"></el-input>
        </el-form-item>
        <el-form-item label="证件类型："
                      style="margin-bottom: 15px"
                      :prop="'cerType'" :rules="{ required: true, message: '请选择证件类型', trigger: 'change' }">
          <el-select v-model="form.cerType" placeholder="请选择证件类型" style="width: 280px">
            <el-option label="身份证" value="身份证"></el-option>
            <el-option label="护照" value="护照"></el-option>
            <el-option label="往来台湾通行证" value="往来台湾通行证"></el-option>
            <el-option label="港澳台通行证" value="港澳台通行证"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码："
                      style="margin-bottom: 15px"
                      :prop="'cerNo'" :rules="{ required: true, message: '请输入证件号码', trigger: 'blur' }">
          <el-input type="text" v-model="form.cerNo" placeholder="请输入证件号码" style="width: 280px"></el-input>
        </el-form-item>
        <el-form-item label="证件照正/反面：" required>
          <el-upload
            class="upload-demo"
            drag
            multiple
            action="#"
            :limit="2"
            accept=".png,.jpg"
            :http-request="beforeUpload"
            :auto-upload="false"
            :on-change="changeUpload"
            :on-remove="removeUpload"
            ref="newupload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="text-align: left">上传正/反面照片共两张，只能是jpg/png文件且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmUpload('form')" :disabled="btn.disabled">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ['callback'],
    data (){
      return {
        form: {
          realName: '',
          cerType: '',
          cerNo: '',
          fileList: []
        },
        btn: {
          disabled: false
        }
      }
    },
    methods: {
      changeUpload (file){
        this.form.fileList.push(file);
      },
      removeUpload (file){
        const tempArr = [];
        this.form.fileList.forEach(item => {
          if(item.uid !== file.uid){
            tempArr.push(item)
          }
        });
        this.form.fileList = tempArr
      },
      // 上传前对文件的判断
      beforeUpload () {
        const _this = this;
        for(let i = 0; i<this.form.fileList.length; i++){
          const isLt10M = this.form.fileList[i].size / 1024 / 1024 < 10;
          if (!isLt10M) {
            this.$message.error('上传图片大小不能超过10MB');
            return false
          }
        }
        const fd = new FormData(),
          tempFiles = this.form.fileList.map(item => {
            return item.raw
          }) || [];
        this.btn.disabled = true;
        fd.append('multipartFile', tempFiles[0]); //传文件
        fd.append('multipartFile', tempFiles[1]); //传文件
        fd.append('certificateNum', this.form.cerNo);
        fd.append('certificateType', this.form.cerType);
        fd.append('realName', this.form.realName);
        fd.append('userId', this.$route.params.id);
        this.$http.post('/userExtension/identityUserFree',fd)
          .then(res => {
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '上传成功'
              });
              _this.$store.commit('showModal', false);
              this.doSearch(_this.callback)
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            _this.btn.disabled = false
          })
      },
      //提交上传
      confirmUpload(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            if(document.querySelectorAll('ul.el-upload-list>li').length < 2){
              this.$message({
                type: 'warning',
                message: '请上传证件照正/反面共两张照片'
              });
              return false
            }
            this.$refs.newupload.submit()
          }
        })
      }
    }
  }
</script>
