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
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">原文：</b>
            <div style="display: table-cell;">
              {{cuTransAnswers.question}}
            </div>
          </div></el-col>
        </el-row>
        <el-row style="margin-bottom: 0px">
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">参考译文：</b>
            <div style="display: table-cell;">
              {{cuTransAnswers.correctAnswer}}
            </div>
          </div></el-col>
        </el-row>
      </div>
    </div>
    <div class="default-style">
      <h4>结果评定<span style="float: right;font-size: 14px;font-weight: 400">审核人：{{adTransResult.auditUserName}}</span></h4>
      <div class="detail verify-detail">
        <el-row>
          <el-col :span="8">
            <el-form>
              <el-form-item>
                <el-col :span="10">
                  <el-form-item label="准确性">{{gradePartition.grammarRatio}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.grammarRatio}}</el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="10">
                  <el-form-item label="专业性">{{gradePartition.temporalTatio}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.temporalTatio}}</el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col :span="10">
                  <el-form-item label="可读性">{{gradePartition.vocabularyRatio}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="权重参考">{{weight.vocabularyRatio}}</el-form-item>
                </el-col>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="14" style="padding-top: 8px">
            <el-row class="exact">
              <el-col :span="8"><div class="grid-content bg-purple"><b>综合得分：</b><span style="color: orangered">{{adTransResult.grade}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple-light"><b>评测结果：</b><span style="color: orangered">{{adTransResult.auditResult}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"></div><b>定级：</b><span style="color: orangered">{{adTransResult.setLevel}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><b>评语：</b>{{adTransResult.comment}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
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
          grammarRatio: '--',
          temporalTatio: '--',
          vocabularyRatio: '--'
        },
        gradePartition: {
          grammarRatio: '--',
          temporalTatio: '--',
          vocabularyRatio: '--'
        },
        adTransResult: {
          auditUserName: '--',
          translatorCode: '--',
          originLanguageName: '--',
          targetLanguageName: '--',
          translatorLevel: '--',
          questionLevel: '--',
          examStartTime: '--',
          domains: '--',
          grade: '--',
          comment: '--',
          auditResult: '--',
          setLevel: '--'
        },
        cuTransAnswers:{
          questionLevel: '--',
          questionFields: '--',
          questionWeight: '--',
          question: '--',
          correctAnswer: '--'
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
              }else if(prop === 'setLevel'){
                this.adTransResult[prop] = 'P'+res.data.data.adTransResult[prop]
              }else if(prop === 'gradePartition'){
                const gradePartition = JSON.parse(res.data.data.adTransResult[prop])
                this.gradePartition = {...gradePartition}
              }else {
                this.adTransResult[prop] = res.data.data.adTransResult[prop]
              }
            }
            for(let prop in res.data.data.cuTransAnswers[0]){
              if(prop === 'questionWeight'){
                const weight = JSON.parse(res.data.data.cuTransAnswers[0][prop])
                this.cuTransAnswers[prop] = `
                        准确性（${weight['grammarRatio']}）
                        专业性（${weight['temporalTatio']}）
                        可读性（${weight['vocabularyRatio']}）`;
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
      }
    }
  }
</script>
