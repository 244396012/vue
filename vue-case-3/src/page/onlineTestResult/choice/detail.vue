<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="4"><div class="grid-content bg-purple"><b>译员：</b>{{detail.translatorCode}}</div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple-light"><b>语言：</b>{{detail.targetLanguageName}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>测试开始时间：</b>{{detail.examStartTime}}</el-col>
          <el-col :span="5"><div class="grid-content bg-purple-light"><b>测试情况：</b>{{detail.examOverview}}</div></el-col>
          <el-col :span="5"><div class="grid-content bg-purple-light"><b>测试结果：</b>
            <span style="color: orangered">{{detail.examResult}}</span></div></el-col>
        </el-row>
        <el-table
          border
          stripe
          v-loading="loading"
          :data="tableData">
          <el-table-column
            prop="questionIndex"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="questionCode"
            label="题号">
          </el-table-column>
          <el-table-column
            label="题目要求">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['questionRequirement']}}
            </template>
          </el-table-column>
          <el-table-column
            label="题目">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['questionHead']}}
            </template>
          </el-table-column>
          <el-table-column
            label="选项A">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['A:']}}
            </template>
          </el-table-column>
          <el-table-column
            label="选项B">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['B:']}}
            </template>
          </el-table-column>
          <el-table-column
            label="选项C">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['C:']}}
            </template>
          </el-table-column>
          <el-table-column
            label="选项D">
            <template slot-scope="scope">
              {{JSON.parse(scope.row.question)['D:']}}
            </template>
          </el-table-column>
          <el-table-column
            width="90"
            prop="correctAnswer"
            label="正确答案">
          </el-table-column>
          <el-table-column
            width="90"
            prop="answer"
            label="译员答案">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        loading: false,
        detail: {
          translatorCode: '--',
          targetLanguageName: '--',
          examStartTime: '--',
          examOverview: '--',
          examResult: '--'
        },
        tableData: []
      }
    },
    created (){
      this.showDetail()
    },
    methods: {
      showDetail (){
        this.$http.get('/exam/admin/getExamDetailSelect',{
          params: {
            resultId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            for(let prop in res.data.data.adChoiceResult){
              this.detail[prop] = res.data.data.adChoiceResult[prop]
            }
            this.tableData = res.data.data.cuChoiceAnswers
          }
        })
      }
    }
  }
</script>
