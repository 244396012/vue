<template>
  <div class="page maxwidth">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <my-search ref="searchform" :callback="showTableList_r1"></my-search>
        <div v-if="totalInfo"
             class="default-style sy-font-md">{{totalInfo}}</div>
        <el-tab-pane label="费用汇总" :disabled="loading" name="first">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_rm.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                prop=""
                label="所属组别">
              </el-table-column>
              <el-table-column
                width="90"
                prop=""
                label="兼职编码">
              </el-table-column>
              <el-table-column
                prop=""
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop=""
                label="当月兼职费用">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop=""
                label="累计兼职费用">
              </el-table-column>
              <el-table-column
                prop=""
                label="申请费用">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop=""
                label="累计申请费用">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop=""
                label="未申请费用">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop=""
                label="累计扣款费用">
              </el-table-column>
            </el-table>
            <template v-if="data_rm.totalTableList > 0">
              <pagination :callback="showTableList_rm" :total="data_rm.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="笔译详情" :disabled="loading" name="second">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_rm.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="companyGroup"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="projectNo"
                label="项目编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="languagePair"
                label="项目语言对">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="projectManager"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="partTimeId"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="partTimeName"
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="orderTime"
                label="下单时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="finishTime"
                label="完成时间">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="chapter"
                label="章节">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="projectWordCount"
                label="项目字数">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="unitPrice"
                label="单价(千字/元)">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="videoDuration"
                label="影音时长">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="unitOfMeasurement"
                label="计量单位">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="videoUnitPrice"
                label="影音单价">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="videoTask"
                label="影音任务">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="evaluationHappening"
                label="评比情况">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="actualCoping"
                label="实际应付">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="qualityLevel"
                label="质量等级">
              </el-table-column>
            </el-table>
            <template v-if="data_rm.totalTableList > 0">
              <pagination :callback="showTableList_rm" :total="data_rm.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="DTP详情" :disabled="loading" name="third">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_rm.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="companyGroup"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="customerName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="80"
                prop="projectNo"
                label="项目编号">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="projectManager"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="partTimeId"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="partTimeName"
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="finishTime"
                label="完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="taskDetails"
                label="任务详情">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="totalFee"
                label="费用合计">
              </el-table-column>
            </el-table>
            <template v-if="data_rm.totalTableList > 0">
              <pagination :callback="showTableList_rm" :total="data_rm.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="培训详情" :disabled="loading" name="fourth">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_r1.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="60">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="COrgName"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="CustomerName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="125"
                prop="ProjectID"
                label="项目编号">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="PM"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="UserCode"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="Chnname"
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="SourceLan"
                label="项目语言对">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="CompleteTime"
                label="执行时间">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="CourseHour"
                label="课时">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="BasicCoursePrice"
                label="报酬">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="TotalMoney"
                label="费用合计">
              </el-table-column>
            </el-table>
            <template v-if="data_r1.totalTableList > 0">
              <pagination :callback="showTableList_r1" :total="data_r1.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外派详情" :disabled="loading" name="fifth">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_r1.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="COrgName"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="125"
                prop="ProjectID"
                label="项目编号">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="PM"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="UserCode"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="Chnname"
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeStart"
                label="开始时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeEnd"
                label="结束时间">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Price"
                label="单价">
              </el-table-column>
              <el-table-column
                min-width="75"
                prop="dayNum"
                label="天数">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="OtherFee"
                label="其他费用">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="80"
                prop="Yuzhi"
                label="预支费用">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Payables"
                label="应付">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="TotalMoney"
                label="费用合计">
              </el-table-column>
            </el-table>
            <template v-if="data_r1.totalTableList > 0">
              <pagination :callback="showTableList_r1" :total="data_r1.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会展详情" :disabled="loading" name="sixth">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_r1.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="60">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="COrgName"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="CustomerName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                min-width="125"
                prop="ProjectID"
                label="项目编号">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="PM"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="UserCode"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="Chnname"
                label="兼职姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeStart"
                label="开始时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeEnd"
                label="结束时间">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Price"
                label="单价">
              </el-table-column>
              <el-table-column
                min-width="75"
                prop="dayNum"
                label="天数">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="OtherFee"
                label="其他费用">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Percentage"
                label="比例">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="HotelFee"
                label="交通费">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="TranFee"
                label="住宿费">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="OvertimePrice"
                label="加班单">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="OvertimeHours"
                label="加班时">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="koukuan"
                label="扣款">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="80"
                prop="Yuzhi"
                label="预支费用">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Payables"
                label="应付">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="TotalMoney"
                label="费用合计">
              </el-table-column>
            </el-table>
            <template v-if="data_r1.totalTableList > 0">
              <pagination :callback="showTableList_r1" :total="data_r1.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备详情" :disabled="loading" name="seven">
          <div class="default-style">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="data_r1.tableData">
              <el-table-column
                min-width="60"
                prop="num"
                label="#">
              </el-table-column>
              <el-table-column
                width="110"
                prop="COrgName"
                label="项目所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="CustomerName"
                label="客户名称">
              </el-table-column>
              <el-table-column
                min-width="125"
                prop="ProjectID"
                label="项目编号">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="PM"
                label="项目经理">
              </el-table-column>
              <el-table-column
                min-width="95"
                prop="UserCode"
                label="兼职ID">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="DeviceType"
                label="设备类型">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="Chnname"
                label="供应商">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeStart"
                label="开始时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="RequireTimeEnd"
                label="结束时间">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Price"
                label="单价">
              </el-table-column>
              <el-table-column
                min-width="75"
                prop="dayNum"
                label="天数">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="OtherFee"
                label="其他费用">
              </el-table-column>
              <el-table-column
                min-width="60"
                prop="Percentage"
                label="比例">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="TranFee"
                label="交通费">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="HotelFee"
                label="住宿费">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="OvertimePrice"
                label="加班单">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="OvertimeHours"
                label="加班时">
              </el-table-column>
              <el-table-column
                min-width="70"
                prop="koukuan"
                label="扣款">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="Yuzhi"
                label="预支费用">
              </el-table-column>
              <el-table-column
                min-width="80"
                prop="TotalMoney"
                label="费用合计">
              </el-table-column>
            </el-table>
            <template v-if="data_r1.totalTableList > 0">
              <pagination :callback="showTableList_r1" :total="data_r1.totalTableList"></pagination>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>
<script>
  import domain from '@/api/index';
  import search from './search_component';
  import pagination from '@/components/pagination';
  import { mapState } from 'vuex'
  export default {
    components: {
      pagination,
      'my-search': search
    },
    data (){
      return {
        activeName: 'first',
        loading: false,
        formSelect: {
          groupOptions: [],
        },
        //从rm获取
        data_rm: {
          tableData: [],
          totalTableList: 0
        },
        //从r1获取报表
        data_r1: {
          tableData: [],
          totalTableList: 0
        },
        totalInfo: '',
        url: ''
      }
    },
    computed :{
      ...mapState(['userCode'])
    },
    methods: {
      handleClick(tab, event) {
        //切换tab页，重置search值
        for(let key in this.$refs.searchform.form){
          this.$refs.searchform.form[key] = '';
        }
        this.data_r1.totalTableList = 0;
        switch (tab.label){
          case '费用汇总':


            break;
          case '笔译详情':
            this.url = '/orderAndComment/getBiYiList';
            this.showTableList_rm();
            this.getTotalFees('/orderAndComment/getBiyiTotalMoney');
            break;
          case 'DTP详情':
            this.url = '/orderAndComment/getDtpList';
            this.showTableList_rm();
            this.getTotalFees('/orderAndComment/getDtpTotalMoney');
            break;
          case '培训详情':
            this.url = '/pangu/GetTrainFeeList';
            this.showTableList_r1();
            break;
          case '外派详情':
            this.url = '/pangu/GetAssignFeeList';
            this.showTableList_r1();
            break;
          case '会展详情':
            this.url = '/pangu/GetInterFeeList';
            this.showTableList_r1();
            break;
          case '设备详情':
            this.url = '/pangu/GetDeviceFeeList';
            this.showTableList_r1();
            break;
        }
      },
      //培训详情、外派详情、会展详情、设备详情
      showTableList_r1 (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        const getForm = this.$refs.searchform.form,
          sortFd = this.url.includes('GetTrainFeeList')?'CompleteTime':'RequireTimeEnd';//培训，默认按Complete排序
        this.loading = true;
        this.totalInfo = '';
        this.$http.defaults.baseURL = domain.baseReportURL_r1;
        this.$http.post(this.url, {
          Sortfield: sortFd,
          SortDirect: 'desc',
          LoginUserCode: this.userCode,
          pageindex: config.pageNo,
          pagesize: config.pageSize,
          usercode: getForm.code,
          chnname: getForm.name,
          OrgID: getForm.group,
          StartDate: getForm.rangeTime.length>0 ? getForm.rangeTime[0] : '',
          EndDate: getForm.rangeTime.length>0 ? getForm.rangeTime[1] : ''
        }).then(res => {
          this.data_r1.tableData = [];
          if(res.data.Success){
            const list = res.data.Data.Rows;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.data_r1.tableData.push(item)
            });
            this.data_r1.totalTableList = res.data.Data.Total;
            this.totalInfo = res.data.Data.Sum
          }
          this.loading = false;
        });
        //加载后，重置baseUrl
        this.$http.defaults.baseURL = domain.baseRMURL;
      },
      //笔译详情、dtp详情
      showTableList_rm (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        const getForm = this.$refs.searchform.form;
        this.loading = true;
        this.totalInfo = '';
        this.$http.defaults.baseURL = domain.baseRMURL;
        this.$http.get(this.url, {
          params: {
            pageNo: config.pageNo - 1,
            pageSize: config.pageSize,
            userCode: getForm.code,
            name: getForm.name,
            group: getForm.group,
            startTime: getForm.rangeTime.length>0 ? getForm.rangeTime[0] : '',
            endTime: getForm.rangeTime.length>0 ? getForm.rangeTime[1] : ''
          }
        }).then(res => {
          this.data_rm.tableData = [];
          if(res.data.message === 'success'){
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.data_rm.tableData.push(item)
            });
            this.data_rm.totalTableList = res.data.data.totalElements;
          }
          this.loading = false;
        })
      },
      //获取dtp、笔译总费用
      getTotalFees (url){
        this.$http.get(url).then(res => {
          if(res.data.message === 'success'){
            this.totalInfo = '兼职总费用：'+res.data.data
          }
        })
      }
    }
  }
</script>
