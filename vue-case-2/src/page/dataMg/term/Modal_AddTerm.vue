<template>
  <div>
    <el-dialog
      title="添加术语"
      :visible.sync="$store.state.switchAddModal"
      width="600px"
      center>
      <el-form :model="form" ref="form" style="padding: 10px;">
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
        <el-form-item label="术语原文：">
          <el-input v-model="form.termSource" style="display: inline-block;width: 353px" placeholder="请输入术语原文"></el-input>
        </el-form-item>
        <el-form-item label="术语译文：">
          <el-input v-model="form.termTarget" style="display: inline-block;width: 353px" placeholder="请输入术语译文"></el-input>
        </el-form-item>
        <el-form-item label="术语解释：">
          <el-input v-model="form.explain" type="textarea" style="display: inline-block;width: 353px" placeholder="请输入术语解释"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchAddModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'edit',
    data (){
      return {
        btn: {
          txt: '提 交',
          disabled: false
        },
        form: {
          termSource: '',
          termTarget: '',
          areaValue1: '',
          areaValue2: '',
          languageSource: '',
          languageTarget: '',
		  explain: ''
        }
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
      // 添加术语：提交数据
      submitForm(formName) {
		for(let attr in this.form){
			if(this.form[attr] === '' && attr !== 'explain'){
			 this.$message({
				type: 'warning',
				message: '请填写“领域”、“语言”和“术语原译文”'
			  })
			  return false
			}
		}
		if(this.form.languageSource === this.form.languageTarget){
		  this.$message({
			type: 'warning',
			message: '请选择不同的语言'
		  })
		  return false
		}
		this.btn.txt = '提交中'
		this.btn.disabled = true
		this.$http.post('/dictionary/term/saveterm', this.$qs.stringify({
		  domain: this.form.areaValue1,
		  subDomain: this.form.areaValue2,
		  source1: this.form.languageSource,
		  target1: this.form.languageTarget,
		  source: this.form.termSource,
		  target: this.form.termTarget,
		  targetDesc: this.form.explain
		})).then(res => {
		  if(res.data.message === 'success'){
			this.$message({
			  type: 'success',
			  message: '提交成功'
			})
			for(let attr in this.form){
				this.form[attr] = ""
			}
			this.$store.commit('switchAddModal')
		  }else{
			this.$message({
			  type: 'error',
			  message: res.data.message
			})
		  }
		  this.btn.txt = '提 交'
		  this.btn.disabled = false
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
</style>
