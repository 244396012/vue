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
                    <el-form-item label="项目名称：">
                      <div class="detail-item detail-short"
                           :title="detail.projectName">{{detail.projectName}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所需服务：">
                      <div class="detail-item">{{detail.requiredService}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户名称：">
                      <div class="detail-item detail-short"
                           :title="detail.customerName">{{detail.customerName}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="销售经理：">
                      <div class="detail-item">{{detail.saleManager}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="下单人：">
                      <div class="detail-item">{{detail.orderPerson}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="派单时间：">
                      <div class="detail-item">{{detail.orderTime}}</div>
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
                    <el-form-item label="语言对：">
                      <div class="detail-item">{{detail.sourceLanguage}} - {{detail.targetLanguage}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户角色：">
                      <div class="detail-item">{{detail.customerRole}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="客户联系人部门：">
                      <div class="detail-item">{{detail.customerContactDepart}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="译员角色：">
                      <div class="detail-item">{{detail.interpreterRole}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目周期：" >
                      <div class="detail-item">{{detail.startTime && detail.startTime.slice(0,10)}} - {{detail.endTime && detail.endTime.slice(0,10)}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目地点：">
                      <div class="detail-item">{{detail.province+detail.city+detail.area}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="上岗日期：">
                      <div class="detail-item">{{detail.appointmentTime}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所需人数：">
                      <div class="detail-item">{{detail.requiredPersonNumber}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="储备人数：">
                      <div class="detail-item">{{detail.reservePersonNumber}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="交付日期：">
                      <div class="detail-item">{{detail.deliveryTime}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户项目进展：" >
                      <div class="detail-item">{{detail.customerProjectProgress}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="客户报价：">
                      <div class="detail-item">{{detail.customerQuote}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户项目状态：">
                      <div class="detail-item">{{detail.customerProjectStatus | formatResourceCusStatus}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户预算：">
                      <div class="detail-item">{{detail.customerBudget}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="译员成本：">
                      <div class="detail-item">{{detail.interpreterCost}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工作内容：">
                      <div class="detail-item">{{detail.workContent}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="签证费用：">
                      <div class="detail-item">{{detail.visaFees}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="食宿交通：">
                      <div class="detail-item large">{{detail.accommodationTransportation}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="休假情况：">
                      <div class="detail-item large">{{detail.vacationSituation}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他福利：">
                      <div class="detail-item large" >{{detail.otherWelfare}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="项目合同：">
                      <p style="margin: 8px 0; line-height: 22px">
                        <a class="download"
                           v-if="detail.questionUrl"
                           :href="detail.projectContractUrl" target="_blank">
                          {{detail.contractName?detail.contractName:'点击下载'}}
                        </a>
                      </p>
                    </el-form-item>
                  </el-col>
                </el-row>
                <h3>人员要求</h3>
              </el-form>
              <el-table
                border
                stripe
                :max-height="$store.state.tableHeight"
                :data="tableInfo">
                <el-table-column
                  type="index"
                  label="#"
                  width="50">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  prop="specialtyDomain"
                  label="擅长领域">
                </el-table-column>
                <el-table-column
                  min-width="70"
                  prop="sex"
                  label="性别">
                </el-table-column>
                <el-table-column
                  min-width="70"
                  prop="age"
                  label="年龄">
                </el-table-column>
                <el-table-column
                  min-width="80"
                  prop="education"
                  label="学历">
                </el-table-column>
                <el-table-column
                  min-width="80"
                  prop="nationality"
                  label="民族">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="profession"
                  label="专业">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="certifacate"
                  label="证书">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="experience"
                  label="工作年限">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="location"
                  label="所在地">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="passport"
                  label="护照">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="visa"
                  label="签证">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="insurance"
                  label="保险">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  prop="overseasExperience"
                  label="海外经历">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  prop="other"
                  label="其他">
                </el-table-column>
              </el-table>
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
        detail: {},
        tableInfo: []
      }
    },
    created (){
      this.getDetailData();
    },
    filters: {
      formatResourceCusStatus: formatResourceProWpStatus
    },
    methods: {
      handleClick(tab) {
        if(tab.label === '录用详情'){
          this.$refs.employDetail.showEmployList()
        }
      },
      //填充form表单数据
      getDetailData() {
        this.$http.get('/resourceOrder/getExpatriateOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail = res.data.data;
            this.tableInfo = res.data.data.peopleRequireds || []
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
