<template>
  <div class="page">
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="项目详情" name="first">
            <div class="detail form">
              <el-form label-width="110px" class="demo-ruleForm resource">
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
                      <div class="detail-item">{{detail.projectManager}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目地点：">
                      <div class="detail-item detail-short"
                           :title="detail.projectPlace">{{detail.projectPlace}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目日期：">
                      <div class="detail-item">{{detail.startTime && detail.startTime.slice(0,10)}} - {{detail.endTime && detail.endTime.slice(0,10)}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="语言对：">
                      <div class="detail-item">{{detail.sourceLanguage}} - {{detail.targetLanguage}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="专业领域：">
                      <div class="detail-item">{{detail.domain}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="交付日期：">
                      <div class="detail-item">{{detail.deliveryTime}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户项目状态：">
                      <div class="detail-item">{{detail.customerProjectStatus | formatResourceProWpStatus}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="所需服务：">
                      <div class="detail-item">{{detail.requiredService}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所需人数：">
                      <div class="detail-item">{{detail.requiredPersonNumber}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务人数：">
                      <div class="detail-item">{{detail.servicePersonNumber}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目时长：">
                      <div class="detail-item">{{detail.projectDuration}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户报价：">
                      <div class="detail-item">{{detail.customerQuote}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="简历要求：">
                      <div class="detail-item">{{detail.resumeRequired}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="会议规模：">
                      <div class="detail-item">{{detail.meetingScale}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他：">
                      <div class="detail-item large">{{detail.otherDesc}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="录用详情" name="second">
            <employ-detail ref="employDetail"></employ-detail>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  import employDetail from '../component/employDetail';
  import { formatResourceProWpStatus } from '@/common/filter';
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
      formatResourceProWpStatus: formatResourceProWpStatus
    },
    methods: {
      handleClick(tab) {
        if(tab.label === '录用详情'){
          this.$refs.employDetail.showEmployList()
        }
      },
      //填充form表单数据
      getDetailData() {
        this.$http.get('/resourceOrder/getExhibitionOrderDetails', {
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
