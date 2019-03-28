<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="$store.state.switchModal"
      width="600px"
      center>
      <el-form :model="form" ref="form" style="padding: 10px;">
        <el-form-item label="词典名称：">
          <el-input v-model="form.dictName" style="display: inline-block;width: 353px" placeholder="请输入词典名称"></el-input>
        </el-form-item>
        <el-form-item label="外文名：">
          <el-input v-model="form.englishName" style="display: inline-block;width: 353px"  placeholder="请输入外文名"></el-input>
        </el-form-item>
        <el-form-item label="背景图片：">
          <el-upload
            class="upload-demo"
            drag
            action="/"
            :data="form"
            :on-change="previewImg"
            :before-upload="beforeUpload"
            :auto-upload="true">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="color: #888;text-align: center">
              请尽量选择1920*205的图片，否则展示时可能导致图片不清晰或变形
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片：" v-if="form.imgId">
          <div class="previewImg" :style="'backgroundImage: url('+form.imgUrl+')'"></div>
        </el-form-item>
        <el-form-item label="关联领域：">
          <el-select v-model="form.areaValue1" @change="getSecondAreaByValue" placeholder="请选择" style="width: 353px">
            <el-option
              v-for="item in firstAreaArr"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="checkbox" style="padding-left: 130px;">
          <el-checkbox-group v-model="form.areaValue2Arr">
            <el-checkbox v-for="item in secondAreaArr"
                         :key="item.id"
                         :label="item.fullSpecialtyName+','+item.specialtyId">{{item.fullSpecialtyName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="newSubmitForm" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'addDict',
    props: ['callback','editData'],
    data (){
      return {
        title: '新建专业词典',//或者 “编辑词典”
        btn: {
          txt: '提 交',
          disabled: false
        },
        form: {
          id: '',
          imgId: '',
          imgUrl: '',
          dictName: '',
          englishName: '',
          areaName: '',
          areaId: '',
          areaValue1: '',
          areaValue2Arr: []
        }
      }
    },
    watch: {
      editData: {
        handler (newVal){
          for(let attr in this.form){
            this.form[attr] = ''
          }
          this.form.id = newVal.id
          this.form.imgId = newVal.imgId
          this.form.imgUrl = 'data:image/png;base64,'+newVal.imgUrl
          this.form.dictName = newVal.name
          this.form.englishName = newVal.enName
          this.form.areaName = newVal.areaName
          this.form.areaId = newVal.areaId
          this.form.areaValue1 = newVal.areaName
          this.$store.commit('secondArea',[])
          newVal.id ? (this.title = '编辑词典') : (this.title = '新建专业词典')
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters({
        firstAreaArr: 'firstArea',
        secondAreaArr: 'secondArea'
      })
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
      //获取二级领域
      getSecondAreaByValue (val){
        let obj = {}
        obj = this.firstAreaArr.find((item)=>{
          return item.fullSpecialtyName === val
        })
        this.form.areaValue2Arr = []
        this.getSecondArea(obj.specialtyId)
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
        this.$http.post('/dictionary/dic/uploadImg',fd)
          .then(function(res){
            if(res.data.message === 'success'){
              _this.$message({
                type: 'success',
                message: '上传图片成功'
              })
              _this.form.imgId = res.data.data
              _this.form.imgName = file.name
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
      },
      //提交上传
      newSubmitForm(){
        if(this.form.dictName === ''
          || this.form.englishName === ''
          || this.form.areaValue1 === ''){
          this.$message({
            type: 'warning',
            message: '请填写“词典名称”、“外文名”和“关联领域”'
          })
          return false
        }
        //是否上传图片
        if(this.form.imgId === ''){
          this.$message({
            type: 'warning',
            message: '请上传背景图片'
          })
          return false
        }
        //判断关联领域的值
        if(this.form.areaValue2Arr.length > 0){
          this.form.areaName = ''
          this.form.areaId = ''
          this.form.areaValue2Arr.forEach(item => {
            this.form.areaName += item.split(',')[0] + ','
            this.form.areaId += item.split(',')[1] + ','
          })
          this.form.areaName = this.form.areaName.substring(0,this.form.areaName.length-1)
          this.form.areaId = this.form.areaId.substring(0,this.form.areaId.length-1)
        }else{
          let area = {}
          area = this.firstAreaArr.find(item => {
            return item.fullSpecialtyName === this.form.areaValue1
          })
          if(area && area.fullSpecialtyName){
            this.form.areaName = area.fullSpecialtyName
            this.form.areaId = area.specialtyId
          }
        }
        let url = '/dictionary/dic/addDic'
        const data = {
          fileid: this.form.imgId,
          dicName: this.form.dictName,
          dicNameEn: this.form.englishName,
          linkedAreaName: this.form.areaName,
          linkedAreaId: this.form.areaId,
        }
        //判断form.id有值，则为编辑，否则为新建
        if(this.form.id !== ''){
          data.id = this.form.id
          url = '/dictionary/dic/updateDic'
        }
        this.btn.txt = '提交中'
        this.btn.disabled = true
        this.$http.post(url, this.$qs.stringify(data)).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.$store.commit('switchModal')
            this.callback()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.btn.txt = '提 交'
          this.btn.disabled = false
          for(let attr in this.form){
            this.form[attr] = ''
          }
          this.$store.commit('secondArea',[])
        })
      }
    }
  }
</script>
<style scoped>
  /deep/ .el-form-item__label{
    width: 130px;
    text-align: right;
  }
  /deep/ .el-select{
    width: 33%;
  }
  /deep/ .el-form-item__error{
    left: 130px;
  }
  /deep/ .el-checkbox{
    margin-right: 20px;
    margin-left: 0;
  }
/deep/ .el-form-item__content{
  line-height: 24px;
}
</style>
