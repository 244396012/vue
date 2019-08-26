<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>译员ID：</b>{{adTransResult.translatorCode}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>语言对：</b>{{adTransResult.originLanguageName}} > {{adTransResult.targetLanguageName}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>现有等级：</b>P{{adTransResult.translatorLevel}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>试题等级：</b>{{adTransResult.questionLevel}}</div></el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>开始测试时间：</b>{{adTransResult.examStartTime}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>试题难度：</b>{{cuTransAnswers.questionLevel}}</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple"></div><b>侧重点及权重：</b>{{cuTransAnswers.questionWeight}}</el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="12"><div class="grid-content bg-purple-light"><b>译员领域：</b>{{adTransResult.domains}}</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple"><b>试题领域：</b>{{cuTransAnswers.questionFields}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="24"><div class="grid-content bg-purple"><b>原文：</b>{{cuTransAnswers.question}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 0px">
          <el-col :span="24"><div class="grid-content bg-purple"><b>参考译文：</b>{{cuTransAnswers.correctAnswer}}</div></el-col>
        </el-row>
      </div>
    </div>
    <div class="default-style">
      <h4>结果评定</h4>
      <div class="detail verify-detail">
        <el-row>
          <el-col :span="9">
            <el-form>
              <el-form-item>
                <el-col :span="16">
                  <el-form-item label="准确性">
                    <el-select placeholder="请选择" v-model="form.grammarRatio">
                      <el-option v-for="item in formSelect.levelOptions"
                                 :key="item"
                                 :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.grammarRatio}}</el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="16">
                  <el-form-item label="专业性">
                    <el-select placeholder="请选择" v-model="form.temporalTatio">
                      <el-option v-for="item in formSelect.levelOptions"
                                 :key="item"
                                 :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.temporalTatio}}</el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="16">
                  <el-form-item label="可读性">
                    <el-select placeholder="请选择" v-model="form.vocabularyRatio">
                      <el-option v-for="item in formSelect.levelOptions"
                                 :key="item"
                                 :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.vocabularyRatio}}</el-form-item>
                </el-col>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-input type="textarea" placeholder="请输入你的评语" v-model="form.comment"></el-input>
          </el-col>
          <el-col :span="3">
            <el-button class="exact" @click="calculate">计算</el-button>
          </el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>综合得分：</b><span style="color: orangered">{{result.score}}</span></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>评测结果：</b><span style="color: orangered">{{result.isPass}}</span></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>定级：</b><span style="color: orangered">{{result.level}}</span></el-col>
        </el-row>
        <div style="padding: 25px 55px;">
          <!--<el-button>认定机翻</el-button>-->
          <el-button type="success"
                     @click="confirmResult"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        btn:{
          disabled: false,
          txt: '提交结果'
        },
        formSelect: {
          levelOptions: [1,2,3,4,5,6,7,8,9,10]
        },
        form: {
          comment:'',
          grammarRatio: '',
          temporalTatio: '',
          vocabularyRatio: ''
        },
        weight: {
          translatorLevel: '',
          grammarRatio: '--',
          temporalTatio: '--',
          vocabularyRatio: '--'
        },
        adTransResult: {
          translatorCode: '--',
          originLanguageName: '--',
          targetLanguageName: '--',
          translatorLevel: '--',
          questionLevel: '--',
          examStartTime: '--',
          domains: '--'
        },
        cuTransAnswers:{
          questionLevel: '--',
          questionFields: '--',
          questionWeight: '--',
          question: '--',
          correctAnswer: '--'
        },
        result: {
          score: '--',
          isPass: '--',
          level: '--'
        }
      }
    },
    created (){
      this.showDetail()
    },
    methods: {
      //获取详情
      showDetail (){
        this.$http.get('/exam/admin/getExamDetailTrans', {
          params: {
            resultId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            for(let prop in res.data.data.adTransResult){
              if(prop === 'domains'){
                this.adTransResult[prop] = '';
                const domain = res.data.data.adTransResult[prop]
                domain.forEach(item => {
                  this.adTransResult[prop] += item.fullSpecialtyName + ' '
                })
              }else{
                this.adTransResult[prop] = res.data.data.adTransResult[prop]
              }
              this.weight.translatorLevel = res.data.data.adTransResult.translatorLevel
            }
            for(let prop in res.data.data.cuTransAnswers[0]){
              if(prop === 'questionWeight'){
                const weight = JSON.parse(res.data.data.cuTransAnswers[0][prop])
                this.cuTransAnswers[prop] = `
                        准确性（${weight['grammarRatio']}）
                        专业性（${weight['temporalTatio']}）
                        可读性（${weight['vocabularyRatio']}）`
                this.weight = {...weight}
              }else if(prop === 'questionFields'){
                const field = JSON.parse(res.data.data.cuTransAnswers[0][prop])
                this.cuTransAnswers[prop] = field.join(' ')
              }else{
                this.cuTransAnswers[prop] = res.data.data.cuTransAnswers[0][prop]
              }
            }
          }
        })
      },
      /*
      * 计算分值：准确性得分*准确性权重参考+专业性得分*专业性权重参考+可读性得分*可读性权重参考
      * */
      calculate (){
        if(this.form.grammarRatio === ''
          ||this.form.temporalTatio === ''
          ||this.form.vocabularyRatio === ''){
          this.$message({
            type: 'warning',
            message: '请先选择相关分值'
          })
          return false;
        }
        let total = this.form.grammarRatio*this.weight.grammarRatio
          + this.form.temporalTatio*this.weight.temporalTatio
          + this.form.vocabularyRatio*this.weight.vocabularyRatio;
        this.result.score = total;
        this.result.isPass = this.result.score >= 80 ? '通过':'不通过';
        this.getLevel();
      },
      //根据得分，获取等级
      getLevel (){
        this.$http.get('/exam/admin/getResultByScore',{
          params: {
            currentLevle: 2,
            grade: this.result.score
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            this.result.level = 'p'+res.data.data.calculateLevle
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //提交审核结果
      confirmResult (){
        if(this.result.level === '--'){
          this.$message({
            type: 'warning',
            message: '请先完成结果评定'
          })
          return false;
        }
        this.btn.disabled = true
        this.btn.txt = '保存中'
        this.$http.post('/exam/admin/commitAuditTransResult',this.$qs.stringify({
          resultId: this.$route.params.id,
          auditResult: this.result.isPass,
          comment: this.form.comment,
          grade: this.result.score,
          setLevel: this.result.level.slice(1),
          grammarRatio: this.weight.grammarRatio,
          temporalTatio: this.weight.temporalTatio,
          vocabularyRatio: this.weight.vocabularyRatio
        })).then(res => {
          if(res.data.code === '200'){
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            window.setTimeout(() => {
              this.$router.back(-1)
            },1000)
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.btn.disabled = false
          this.btn.txt = '提交结果'
        })
      }
    }
  }
</script>
