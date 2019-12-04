<template>
  <div class="page">
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="项目详情" name="first">
            <div class="detail form">
              <el-form label-width="125px" class="demo-ruleForm resource">
                <h3>订单信息</h3>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目日期：">
                      <div class="detail-item">{{detail.projectName}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" >
                    <el-form-item label="客户名称：">
                      <div class="detail-item detail-short"
                           :title="detail.customerName">{{detail.customerName}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="销售经理：">
                      <div class="detail-item">{{detail.saleManager}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="教务主管：">
                      <div class="detail-item">{{detail.academicDirector}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目周期：">
                      <div class="detail-item">{{detail.startTime && detail.startTime.slice(0,10)}} - {{detail.endTime && detail.endTime.slice(0,10)}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目地点：">
                      <div class="detail-item detail-short"
                           :title="detail.projectCity">{{detail.projectCity}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目状态：">
                      <div class="detail-item">{{detail.projectStatus | formatResourceProStatus}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="语种类别：">
                      <div class="detail-item">{{detail.languageType}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="专业领域：">
                      <div class="detail-item">{{detail.professionalDoamin}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="简历要求：">
                      <div class="detail-item">{{detail.resumeRequirement}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="培训时段：">
                      <div class="detail-item">{{detail.trainingDuration}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证书要求：">
                      <div class="detail-item">{{detail.certificateRequirement}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="培训类型：">
                      <div class="detail-item">{{detail.trainingType}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所需人数：">
                      <div class="detail-item">{{detail.requirePersons}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户报价或报价：">
                      <div class="detail-item">{{detail.customerQuote}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="是否预约：">
                      <div class="detail-item">{{detail.isReservation?'是':'否'}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="具体时间：">
                      <div class="detail-item">{{detail.speicalTime}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工作内容：">
                      <div class="detail-item large">{{detail.workContent}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="老师要求：">
                      <div class="detail-item large">{{detail.teacherRequirement}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="具体地点：">
                      <div class="detail-item large">{{detail.specialPlace}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他备注：">
                      <div class="detail-item large">{{detail.otherDesc}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
          <template v-if="$route.query.t !== '4'">
            <el-tab-pane label="录用详情" name="second">
              <employ-detail ref="employDetail"></employ-detail>
            </el-tab-pane>
          </template>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  import employDetail from '../component/employDetail';
  import { formatResourceProStatus } from '@/common/filter';
  export default {
    components: {
      'employ-detail': employDetail
    },
    data() {
      return {
        activeName: 'first',
        detail: {}
      }
    },
    created (){
      this.getDetailData();
    },
    filters: {
      formatResourceProStatus: formatResourceProStatus
    },
    methods: {
      handleClick(tab) {
        if(tab.label === '录用详情'){
          this.$refs.employDetail.showEmployList()
        }
      },
      //填充form表单数据
      getDetailData() {
        this.$http.get('/resourceOrder/getTrainingOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail = res.data.data;
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-tab-pane .el-col{
    margin-bottom: 0;
  }
</style>
