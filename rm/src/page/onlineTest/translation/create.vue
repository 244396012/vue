<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="语言对：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="languageOrigin">
                <el-select class="exact"  v-model="ruleForm.languageOrigin" placeholder="请选择原文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="languageTarget">
                <el-select class="exact"  v-model="ruleForm.languageTarget" placeholder="请选择译文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="原文：" prop="originTxt" style="margin-bottom: 20px">
            <el-input type="textarea" v-model="ruleForm.originTxt" placeholder="请输入原文"></el-input>
          </el-form-item>
          <el-form-item label="参考译文：" prop="targetTxt">
            <el-input type="textarea" v-model="ruleForm.targetTxt" placeholder="请输入参考译文"></el-input>
          </el-form-item>
          <el-form-item label="侧重点及权重：" class="extra">
            <el-row class="exact">
              <el-col :span="12">侧重点</el-col>
              <el-col :span="12">权重</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">准确性</el-col>
              <el-col :span="12">
                <el-select placeholder="请选择权重"
                           @change="judgeWeight"
                           v-model="ruleForm.weight1">
                  <el-option v-for="item in formSelect.levelOptions"
                             :key="item"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">专业性</el-col>
              <el-col :span="12">
                <el-select placeholder="请选择权重"
                           @change="judgeWeight"
                           v-model="ruleForm.weight2">
                  <el-option v-for="item in formSelect.levelOptions"
                             :key="item"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">可读性</el-col>
              <el-col :span="12">
                <el-select placeholder="请选择权重"
                           @change="judgeWeight"
                           v-model="ruleForm.weight3">
                  <el-option v-for="item in formSelect.levelOptions"
                             :key="item"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <p style="position: absolute;bottom: -44px;font-size: 12px;color: #F56C6C">* 提示：该权重将直接影响评卷老师的打分占比；三项侧重点的权重相加为10</p>
          </el-form-item>
          <el-form-item label="行业领域：" prop="field" class="exact">
            <el-checkbox-group v-model="ruleForm.field" :min="1" :max="5">
              <el-checkbox v-for="item in formSelect.fieldOptions"
                           :key="item.id"
                           :value="item.id"
                           :label="item.id" name="field">{{item.fullSpecialtyName}}</el-checkbox>
            </el-checkbox-group>
            <p style="position: absolute;bottom: -32px;font-size: 12px;color: #F56C6C">* 至少选择1项，最多选择5项</p>
          </el-form-item>
          <el-form-item label="难度等级：" prop="level">
            <el-select v-model="ruleForm.level">
              <el-option v-for="item in formSelect.levelOptions"
                        :key="item"
                        :label="item"
                        :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button style="width: auto"
                       v-if="!$route.query.u"
                       @click="submitForm('ruleForm', 1)"
                       :disabled="btn1.disabled">{{btn1.txt}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          languageOrigin: '',
          languageTarget: '',
          originTxt: '',
          targetTxt: '',
          field: [],
          level: '',
          weight1: 4,
          weight2: 4,
          weight3: 2
        },
        formSelect: {
          totalWeight: 0,
          fieldOptions: [],
          levelOptions: [1,2,3,4,5,6,7,8,9,10]
        },
        rules: {
          languageOrigin: [
            { required: true, message: '请选择原文语言', trigger: 'change' }
          ],
          languageTarget: [
            { required: true, message: '请选择译文语言', trigger: 'change' }
          ],
          originTxt: [
            { required: true, message: '请输入原文', trigger: 'blur' }
          ],
          targetTxt: [
            { required: true, message: '请输入参考译文', trigger: 'blur' }
          ],
          field: [
            { type: 'array', required: true, message: ' ', trigger: 'change' }
          ],
          level: [
            { required: true, message: '请选择难度等级', trigger: 'change' }
          ]
        },
        btn: {
          disabled: false,
          txt: '保存'
        },
        btn1: {
          disabled: false,
          txt: '保存并添加下一条'
        }
      };
    },
    created (){
      this.getFirstField().then(res => {
        this.formSelect.fieldOptions = res
      });
      this.$route.query.u && this.fillInForm()
    },
    methods: {
      //判断权重总和为10
      judgeWeight (val){
        this.formSelect.totalWeight = this.ruleForm.weight1 + this.ruleForm.weight2 + this.ruleForm.weight3;
        if(this.formSelect.totalWeight !== 10){
          this.$message({
            type: 'warning',
            message: '三项侧重点的权重相加为10'
          })
          return false
        }
      },
      //保存、保存并添加下一条
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.languageOrigin === this.ruleForm.languageTarget){
              this.$message({
                type: 'warning',
                message: '原、译文语言对不能相同'
              })
              return false;
            }
            if(this.formSelect.totalWeight !== 10){
              this.$message({
                type: 'warning',
                message: '三项侧重点的权重相加为10'
              })
              return false;
            }
            let type = 'post',
                url = '/translationQuestion/addTranslationQuestion';
            const formData = {
              orignLanguage: this.ruleForm.languageOrigin,
              targetLanguage: this.ruleForm.languageTarget,
              orignContent: this.ruleForm.originTxt,
              targetContent: this.ruleForm.targetTxt,
              grammarRatio: this.ruleForm.weight1,
              temporalTatio: this.ruleForm.weight2,
              vocabularyRatio: this.ruleForm.weight3,
              difficultLevel: this.ruleForm.level,
              domainIds: this.ruleForm.field
            }
            if(this.$route.query.u){
              type = 'put';
              url = '/translationQuestion/updateTranslationQuestion';
              formData.id = this.$route.query.u;
            }
            if(type === 1){
              this.btn1.disabled = true
              this.btn1.txt = '保存中'
            }else {
              this.btn.disabled = true
              this.btn.txt = '保存中'
            }
            this.$http({
              method: type,
              url: url,
              data: this.$qs.stringify(formData)
            }).then(res => {
              if(res.data.code === '200' && res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                window.setTimeout(() => {
                  if(type === 1){
                    this.$refs[formName].resetFields()
                    this.ruleForm.field = []
                  }else {
                    this.$router.back(-1)
                  }
                }, 1000)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              if(type === 1){
                this.btn1.disabled = false
                this.btn1.txt = '保存并添加下一条'
              }else {
                this.btn.disabled = false
                this.btn.txt = '保存'
              }
            })
          }
        })
      },
      //当修改时，填充form表单数据
      fillInForm() {
        this.$http.get('/translationQuestion/TranslationQuestionDetails', {
          params: {
            id: this.$route.query.u
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            this.ruleForm.languageOrigin = res.data.data.orignLanguage
            this.ruleForm.languageTarget = res.data.data.targetLanguage
            this.ruleForm.originTxt = res.data.data.orignContent
            this.ruleForm.targetTxt = res.data.data.targetContent
            this.ruleForm.weight1 = res.data.data.grammarRatio
            this.ruleForm.weight2 = res.data.data.temporalTatio
            this.ruleForm.weight3 = res.data.data.vocabularyRatio
            this.ruleForm.level = res.data.data.difficultLevel
            res.data.data.domains.forEach(item => {
              this.ruleForm.field.push(item.id)
            })
          }
        })
      }
    }
  }
</script>
