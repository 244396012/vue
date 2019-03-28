<template>
  <div>
    <el-dialog
      title="编 辑"
      :visible.sync="$store.state.switchEditModal"
      width="600px"
      center>
      <el-form :model="form" style="padding: 10px;">
        <el-form-item label="术语文件名称：">
          <el-input v-model="form.fileName" style="display: inline-block;width: 353px" placeholder="请输入文件名称"></el-input>
        </el-form-item>
        <el-form-item label="所属领域：">
          <el-select v-model="form.areaValue1" @change="getSecondAreaByValue" placeholder="一级分类">
            <el-option
              v-for="item in firstAreaArr"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
          <el-select v-model="form.areaValue2" placeholder="二级分类">
            <el-option
              v-for="item in secondAreaArr"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择语言：">
          <el-select v-model="form.languageSource" placeholder="源语言">
            <el-option
              v-for="item in languagePairArr"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
          <el-select v-model="form.languageTarget" placeholder="目标语言">
            <el-option
              v-for="item in languagePairArr"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchEditModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="confirmEditFile" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'edit',
    props: ['params','fileid','callback'],
    data (){
      return {
        btn: {
          disabled: false,
          txt: '提 交'
        },
        form: {
          fileId: '',
          fileName: '',
          areaValue1: '',
          areaValue2: '',
          languageSource: '',
          languageTarget: ''
        }
      }
    },
    watch: {
      //监听父组件传递参数变化
      params: {
        handler (newVal, oldVal){
          this.form.fileId = newVal[0]
          this.form.fileName = newVal[1]
          this.form.areaValue1 = newVal[2]
          this.form.areaValue2 = newVal[3]
          this.form.languageSource = newVal[4]
          this.form.languageTarget = newVal[5]
        },
        deep: true
      }
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
        this.form.areaValue2 = ''
        this.getSecondArea(obj.specialtyId)
      },
      // 提交编辑数据
      confirmEditFile (){
        if(this.form.languageSource === this.form.languageTarget){
          this.$message({
            type: 'warning',
            message: '请选择不同的语言'
          })
          return false
        }
        this.btn.txt = '提交中'
        this.btn.disabled = true
        this.$http.put('/dictionary/term/updateFileInfo', this.$qs.stringify({
          fileId: this.form.fileId,
          fileName: this.form.fileName,
          domainName: this.form.areaValue1,
          subDomainName: this.form.areaValue2,
          sourcelanguage: this.form.languageSource,
          targetLanguage: this.form.languageTarget
        })).then(res => {
          res.data.message === 'success'
            ? this.$message({
              type: 'success',
              message: '编辑成功'
            })
            : this.$message({
              type: 'error',
              message: res.data.message
            })
          this.btn.txt = '提 交'
          this.btn.disabled = false
          this.$store.commit('switchEditModal')
          this.callback()
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
</style>
