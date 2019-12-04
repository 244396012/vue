<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.transId" placeholder="译员ID"></el-input>
          <el-input v-model="form.assign" placeholder="审核人"></el-input>
          <el-select v-model="form.assignType" placeholder="审核人类型" class="width120">
            <el-option
              v-for="(item,index) in formSelect.assignTypeOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="form.assignState" placeholder="状态">
            <el-option
              v-for="(item,index) in formSelect.assignStateOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="el-button-2">
            <el-select v-model="form.languageOrigin" placeholder="源语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select> -
            <el-select v-model="form.languageTarget" placeholder="目标语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select>
          </div>
          <div class="el-button-2">
            <el-select v-model="form.field" @change="selectSecondField" placeholder="试题领域">
              <el-option
                v-for="item in $store.state.fieldOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.id">
              </el-option>
            </el-select> -
            <el-select v-model="form.secondField" placeholder="二级领域">
              <el-option
                v-for="item in formSelect.secondOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <el-date-picker v-model="form.rangeTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="测试时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-select v-model="form.result" placeholder="审核结果" class="width110">
            <el-option
              v-for="(item,index) in formSelect.resultOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="doExtraSearch">重 置</el-button>
        </div>
        <div class="button"> </div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        v-loading="loading"
        :data="tableData">
        <el-table-column
          fixed
          prop="num"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          min-width="70"
          prop="auditState"
          label="状态">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="translatorCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="auditUserName"
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="auditPositionType"
          label="审核人类型"
          min-width="100">
        </el-table-column>
        <el-table-column
          min-width="90"
          label="译员等级">
          <template slot-scope="scope">{{'P'+scope.row.translatorLevel}}</template>
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="questionLevel"
          label="试题等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          label="语言对">
          <template slot-scope="scope">{{scope.row.originLanguageName +'-'+scope.row.targetLanguageName}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="试题领域">
          <template slot-scope="scope">{{scope.row.subDomains | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="examStartTime"
          label="测试开始时间">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="auditResult"
          label="审核结果">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="测试后等级">
          <template slot-scope="scope">{{scope.row.setLevel?'P'+scope.row.setLevel:''}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button type="text"
                       v-if="scope.row.auditState === '已审'"
                       @click="$router.push('/onlineTestResult/assign/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="scope.row.auditState === '未分'"
                       @click="showAssignModal(scope.row.id)">分配</el-button>
            <el-button type="text"
                       v-if="scope.row.auditState === '待审'"
                       @click="showAssignModal(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <assign-modal :callback="showTableList" :assignId="assignId"></assign-modal>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import assign_modal from './assign_modal';
  import { formatDomainsStr } from '@/common/filter';
  export default {
    components: {
      pagination,
      'assign-modal': assign_modal
    },
    data (){
      return {
        form: {
          transId: '',
          languageOrigin: '',
          languageTarget: '',
          field: '',
          secondField: '',
          assignState: '',
          assign: '',
          assignType: '',
          result: '',
          rangeTime: ''
        },
        formSelect: {
          secondOptions: [],
          assignStateOptions: ['已审核','待审核'],
          assignTypeOptions: ['专职','兼职'],
          resultOptions: ['未通过','已通过'],
          levelOptions: ['初级','中级','高级']
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        assignId: ""
      }
    },
    filters: {
      formatDomain: formatDomainsStr
    },
    created (){
      this.showTableList()
    },
    methods: {
      doExtraSearch (){
        this.formSelect.secondOptions = [];
        this.resetSearch(this.form, this.showTableList)
      },
      //获取二级领域
      selectSecondField (id){
        const result = this.$store.state.fieldOptions.find(item => {
          return item.id === id;
        });
        const sid = result.specialtyId || '';
        this.form.secondField = '';
        this.formSelect.secondOptions = [];
        this.getSecondField(sid).then(res => {
          this.formSelect.secondOptions = res;
        });
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/exam/admin/listTransResult', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            translatorCode: this.form.transId,
            originLanguageCode: this.form.languageOrigin,
            targetLanguageCode: this.form.languageTarget,
            domainIds: this.form.field,
            subDomainIds: this.form.secondField,
            auditState: this.form.assignState,
            auditUserName: this.form.assign,
            auditPositionType: this.form.assignType,
            auditResult: this.form.result,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false
        })
      },
      //分配、修改
      showAssignModal (id){
        this.assignId = id;
        this.$store.commit('showModal')
      }
    }
  }

</script>
