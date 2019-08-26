<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>题号：</b>{{detail.questionNo}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>语言：</b>{{detail.language}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>状态：</b>{{detail.status}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>类型：</b>{{detail.type}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple"><b>题目要求：</b>请选择以下翻译正确的一项</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 15px;">
          <el-col :span="24"><div class="grid-content bg-purple"><b>题目：</b>{{detail.questionHead}}</div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple"><b>选项A：</b>{{detail.optiona}}</div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple"><b>选项B：</b>{{detail.optionb}}</div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple"><b>选项C：</b>{{detail.optionc}}</div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple"><b>选项D：</b>{{detail.optiond}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"><b>正确答案：</b>{{detail.correctAnswer}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"><b>添加人：</b>{{detail.createUser}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>添加时间：</b>{{detail.gmtCreate}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"><b>修改人：</b>{{detail.updateUser}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>修改时间：</b>{{detail.gmtUpdate}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"><b>难度等级：</b>{{detail.difficultLevel}}</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light"><b>行业领域：</b>{{detail.field}}</div></el-col>
        </el-row>
      </div>
      <div style="padding: 25px"><el-button @click.native="$router.push('/onlineTest/choice/update?u='+$route.params.id)">修改</el-button></div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        detail: {
          questionNo: '--',
          language: '--',
          status: '--',
          type: '--',
          questionHead: '--',
          optiona: '--',
          optionb: '--',
          optionc: '--',
          optiond: '--',
          correctAnswer: '--',
          createUser: '--',
          gmtCreate: '--',
          updateUser: '--',
          gmtUpdate: '--',
          field: '--',
          difficultLevel: '--'
        }
      }
    },
    created (){
      this.showTableRowDetail()
    },
    methods: {
      //详情
      showTableRowDetail (){
        this.$http.get('/choiceQuestion/choiceQuestionDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            for(let prop in res.data.data){
              if(prop === 'domains'){
                let field = ''
                res.data.data[prop].forEach(item => {
                  field += item.fullSpecialtyName + ' '
                })
                this.detail['field'] = field
              }else if(prop === 'status'){
                this.detail[prop] = res.data.data[prop] ? '启用':'禁用'
              }else{
                this.detail[prop] = res.data.data[prop]
              }
            }
          }
        })
      }
    }
  }
</script>
