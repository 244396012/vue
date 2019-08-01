<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>题号：</b>{{detail.questionNo}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>原文语言：</b>{{detail.orignLanguage}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>译文语言：</b>{{detail.targetLanguage}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>状态：</b>{{detail.status}}</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">原文：</b>
            <div style="display: table-cell;">
              {{detail.orignContent}}
            </div>
          </div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">参考译文：</b>
            <div style="display: table-cell;">
              {{detail.targetContent}}
            </div>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="20"><div class="grid-content bg-purple"><b style="width: 100px;">侧重点及权重：</b>{{detail.ratio}}</div></el-col>
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
      <div style="padding: 25px"><el-button @click.native="$router.push('/onlineTest/trans/update?u='+$route.params.id)">修改</el-button></div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        detail: {
          questionNo: '--',
          orignLanguage: '--',
          targetLanguage: '--',
          status: '--',
          orignContent: '--',
          targetContent: '--',
          createUser: '--',
          gmtCreate: '--',
          updateUser: '--',
          gmtUpdate: '--',
          field: '--',
          difficultLevel: '--',
          ratio: ''
        }
      }
    },
    created (){
      this.showTableRowDetail()
    },
    methods: {
      //详情
      showTableRowDetail (){
        this.$http.get('/translationQuestion/TranslationQuestionDetails', {
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
              }else if(prop === 'vocabularyRatio' || prop === 'temporalTatio' || prop === 'grammarRatio'){
                this.detail['ratio'] = `
                                        准确性（${res.data.data['grammarRatio']}）
                                        专业性（${res.data.data['temporalTatio']}）
                                        可读性（${res.data.data['vocabularyRatio']}）
                                      `
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
