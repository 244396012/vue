<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact" style="line-height: 32px">
          <el-col :span="4"><div class="grid-content bg-purple"><b>题号：</b>{{detail.questionNo}}</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light"><b>语言对：</b>{{detail.orignLanguage}} -> {{detail.targetLanguage}}</div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple"><b>难度等级：</b>{{detail.difficultLevel}}</div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple"></div><b>状态：</b>{{detail.status}}</el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <el-button @click="$router.push('/onlineTest/trans/update?u='+$route.params.id)">修改</el-button>
          </div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">原文：</b>
            <div style="display: table-cell;">{{detail.orignContent}}</div>
          </div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="24"><div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">参考译文：</b>
            <div style="display: table-cell;">{{detail.targetContent}}</div>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple"><b style="width: 100px;">侧重点及权重：</b>{{detail.ratio}}</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light"><b>行业领域：</b>{{detail.field}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>正确率：{{detail.correctNumber}}</b></div></el-col>
        </el-row>
        <el-row class="exact" style="padding-top: 15px;border-top: 1px solid #dedede">
          <el-col :span="20"><div class="grid-content bg-purple">
            <b style="margin-bottom: 10px">操作日志</b>
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="operation.loading"
              :data="operation.tableData">
              <el-table-column
                label="#"
                prop="num"
                width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="operateUserId"
                label="日志id">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="operateTime"
                label="操作时间">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="operateUser"
                label="操作人">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="content"
                label="操作内容">
              </el-table-column>
            </el-table>
            <template v-if="operation.totalTableList > 0">
              <pagination-log :callback="showLogTableList" :total="operation.totalTableList"></pagination-log>
            </template>
          </div></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  export default {
    components: {
      'pagination-log': pagination
    },
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
        },
        operation: {
          loading: false,
          totalTableList: 0,
          tableData: []
        }
      }
    },
    created (){
      this.showTableRowDetail();
      this.showLogTableList()
    },
    methods: {
      //详情
      showTableRowDetail (){
        this.$http.get('/translationQuestion/TranslationQuestionDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const data = res.data.data || {};
            for(let prop in data){
              if(prop === 'domains'){
                let field = '';
                data[prop].forEach(item => {
                  field += item.fullSpecialtyName + ','
                });
                this.detail['field'] = field.slice(0, -1)
              }else if(prop === 'status'){
                this.detail[prop] = data[prop] ? '启用':'禁用'
              }else if(prop === 'vocabularyRatio' || prop === 'temporalTatio' || prop === 'grammarRatio'){
                this.detail['ratio'] = `准确性（${data['grammarRatio']}）
                                        专业性（${data['temporalTatio']}）
                                        可读性（${data['vocabularyRatio']}）`
              }else{
                this.detail[prop] = data[prop]
              }
            }
          }
        })
      },
      //操作日志
      showLogTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.post('/commentAndLog/getBussinessLogs', this.$qs.stringify({
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          bussinessId: this.$route.params.id
        })).then(res => {
          if(res.status === 200){
            this.operation.tableData = [];
            res.data.results.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.operation.tableData.push(item)
            });
            this.operation.totalTableList = res.data.totalCount
          }
          this.operation.loading = false
        })
      }
    }
  }
</script>
