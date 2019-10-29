<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">

          <el-form-item label="语言对：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="origin">
                <el-select v-model="ruleForm.origin" placeholder="请选择源语言" style="width: 99%">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="target">
                <el-select v-model="ruleForm.target" placeholder="请选择目标语言" style="width: 100%">
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
                  <el-option v-for="item in levelOptions"
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
                  <el-option v-for="item in levelOptions"
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
                  <el-option v-for="item in levelOptions"
                             :key="item"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <p style="position: absolute;bottom: -44px;font-size: 12px;color: #F56C6C">* 提示：该权重将直接影响评卷老师的打分占比；三项侧重点的权重相加为10</p>
          </el-form-item>
          <el-form-item label="难度等级：" prop="level">
            <el-select v-model="ruleForm.level">
              <el-option v-for="item in levelOptions"
                        :key="item"
                        :label="item"
                        :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业领域：">
            <el-select v-model="ruleForm.field"
                       @change="getSecondFields"
                       placeholder="请选择一级领域">
              <el-option v-for="item in $store.state.fieldOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.specialtyId"></el-option>
            </el-select>
            <el-select v-model="ruleForm.secondField" placeholder="请选择二级领域" multiple :collapse-tags="true">
              <el-option v-for="item in formSelect.secondOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.id"></el-option>
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
  import { mapState } from 'vuex';
  export default {
    data() {
      return {
        ruleForm: {
          origin: '',
          target: '',
          originTxt: '',
          targetTxt: '',
          field: '',
          secondField: [],
          level: '',
          weight1: 4,
          weight2: 4,
          weight3: 2
        },
        formSelect: {
          totalWeight: 0,
          secondOptions: []
        },
        rules: {
          origin: [
            { required: true, message: '请选择原文语言', trigger: 'change' }
          ],
          target: [
            { required: true, message: '请选择译文语言', trigger: 'change' }
          ],
          originTxt: [
            { required: true, message: '请输入原文', trigger: 'blur' }
          ],
          targetTxt: [
            { required: true, message: '请输入参考译文', trigger: 'blur' }
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
    computed: {
      ...mapState('select',{
        levelOptions: state => state.level
      })
    },
    created (){
      this.$route.query.u && this.fillInForm()
    },
    methods: {
      //获取二级领域
      getSecondFields (id){
        this.ruleForm.secondField = [];
        this.formSelect.secondOptions = [];
        this.getSecondField(id).then(res => {
          this.formSelect.secondOptions = res;
        })
      },
      //判断权重总和为10
      judgeWeight (val){
        this.formSelect.totalWeight = this.ruleForm.weight1 + this.ruleForm.weight2 + this.ruleForm.weight3;
        if(this.formSelect.totalWeight !== 10){
          this.$message({
            type: 'warning',
            message: '三项侧重点的权重相加为10'
          });
          return false
        }
      },
      //保存、保存并添加下一条
      submitForm(formName, btn) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.origin === this.ruleForm.target){
              this.$message({
                type: 'warning',
                message: '原、译文语言对不能相同'
              });
              return false
            }
            this.formSelect.totalWeight = this.ruleForm.weight1 + this.ruleForm.weight2 + this.ruleForm.weight3;
            if(this.formSelect.totalWeight !== 10){
              this.$message({
                type: 'warning',
                message: '三项侧重点的权重相加为10'
              });
              return false
            }
            let domainId = '';
            const firstDomain = this.$store.state.fieldOptions.find(item => {
              return this.ruleForm.field === item.specialtyId
            }) || {};
            if(firstDomain.id && this.ruleForm.secondField.length < 1){
              domainId = firstDomain.id
            }else if(this.ruleForm.secondField.length > 0){
              domainId = this.ruleForm.secondField
            }
            const formData = {
              orignLanguage: this.ruleForm.origin,
              targetLanguage: this.ruleForm.target,
              orignContent: this.ruleForm.originTxt,
              targetContent: this.ruleForm.targetTxt,
              grammarRatio: this.ruleForm.weight1,
              temporalTatio: this.ruleForm.weight2,
              vocabularyRatio: this.ruleForm.weight3,
              difficultLevel: this.ruleForm.level,
              domainIds: domainId
            };
            let type = '', url = '';
            if(this.$route.query.u){
              type = 'put';
              url = '/translationQuestion/updateTranslationQuestion';
              formData.id = this.$route.query.u;
            }else{
              type = 'post';
              url = '/translationQuestion/addTranslationQuestion';
            }
            if(btn){
              this.btn1.disabled = true;
              this.btn1.txt = '保存中'
            }else {
              this.btn.disabled = true;
              this.btn.txt = '保存中'
            }
            this.$http({
              method: type,
              url: url,
              data: this.$qs.stringify(formData)
            }).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                setTimeout(() => {
                  if(btn){
                    this.$refs[formName].resetFields();
                    this.ruleForm.field = '';
                    this.ruleForm.secondField = [];
                  }else {
                    this.$router.push('/onlineTest/trans')
                  }
                }, 1000)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              if(btn){
                this.btn1.disabled = false;
                this.btn1.txt = '保存并添加下一条'
              }else {
                this.btn.disabled = false;
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
          if(res.data.message === 'success'){
            const data = res.data.data;
            this.ruleForm.origin = data.orignLanguage;
            this.ruleForm.target = data.targetLanguage;
            this.ruleForm.originTxt = data.orignContent;
            this.ruleForm.targetTxt = data.targetContent;
            this.ruleForm.weight1 = data.grammarRatio;
            this.ruleForm.weight2 = data.temporalTatio;
            this.ruleForm.weight3 = data.vocabularyRatio;
            this.ruleForm.level = data.difficultLevel;
            const domains = data.domains || [];
            if(domains.length > 0){
              this.ruleForm.field = domains[0].pSpecialtyId;
              setTimeout(() => {
                this.getSecondField(this.ruleForm.field).then(res => {
                  this.formSelect.secondOptions = res;
                  this.ruleForm.secondField = domains.map(item => {
                    return item.id
                  })
                })
              }, 10)
            }
          }
        })
      }
    }
  }
</script>
