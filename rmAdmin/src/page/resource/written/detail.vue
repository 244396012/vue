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
                    <el-form-item label="项目名称：">
                      <div class="detail-item detail-short"
                           :title="detail.projectName">{{detail.projectName}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" class="wd-el-50">
                    <el-form-item label="专业领域：">
                      <div class="detail-item">{{detail.domain}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" class="wd-el-50">
                    <el-form-item label="语言对：">
                      <div class="detail-item">{{detail.sourceLanguage}} - {{detail.targetLanguage}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
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
                  <el-col :span="8">
                    <el-form-item label="下单人：">
                      <div class="detail-item">{{detail.orderPerson}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="交付日期：">
                      <div class="detail-item">{{detail.deliveryTime}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所需服务：">
                      <div class="detail-item">{{detail.requiredService}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="预计翻译量：">
                      <div class="detail-item">{{detail.estimatedTranslationVolume}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="所需人数：">
                      <div class="detail-item">{{detail.requiredPersonNumber}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="需求类型：">
                      <div class="detail-item">{{detail.requiredType}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户项目状态：">
                      <div class="detail-item">{{detail.customerProjectStatus | formatResourceCusStatus}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="稿件难度：">
                      <div class="detail-item">{{detail.manuscriptDifficulty}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="译员单价范围：">
                      <div class="detail-item">{{detail.unitPriceRange}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否测试：">
                      <div class="detail-item">{{detail.isTested?'是':'否'}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="测试题：">
                      <p style="margin: 8px 0; line-height: 22px">
                        <a class="download"
                           v-if="detail.questionUrl"
                           :href="detail.questionUrl" target="_blank">
                          {{detail.testFileName?detail.testFileName:'点击下载'}}
                        </a>
                      </p>
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
                    <el-form-item label="项目简介：">
                      <div class="detail-item large">{{detail.projectDesc}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他：">
                      <div class="detail-item large">{{detail.otherDesc}}</div>
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
                  min-width="150"
                  prop="specialtyDomain"
                  label="擅长领域">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="age"
                  label="年龄">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="nationality"
                  label="民族">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="education"
                  label="学历">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="profession"
                  label="专业">
                </el-table-column>
                <el-table-column
                  min-width="150"
                  prop="experience"
                  label="经验要求">
                </el-table-column>
                <el-table-column
                  min-width="150"
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
  import { formatResourceCusStatus } from '@/common/filter';
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
      formatResourceCusStatus: formatResourceCusStatus
    },
    methods: {
      handleClick(tab) {
        if(tab.label === '录用详情'){
          this.$refs.employDetail.showEmployList()
        }
      },
      //填充form表单数据
      getDetailData() {
        this.$http.get('/resourceOrder/getTranslationOrderDetails', {
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
