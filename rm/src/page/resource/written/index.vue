<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="96px">
              <el-form-item label="项目编号">
                <el-input v-model="form.projectNum" clearable placeholder="请输入项目编号"></el-input>
              </el-form-item>
              <el-form-item label="所需服务">
                <el-select
                  v-model="form.resourceService" placeholder="请选择所需服务">
                  <el-option
                    v-for="item in resourceServiceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户项目状态">
                <el-select
                  v-model="form.resourceComStatus" placeholder="请选择客户项目状态">
                  <el-option
                    v-for="item in resourceCusStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="完成状态">
                <el-select
                  v-model="form.resourceProStatus" placeholder="请选择完成状态">
                  <el-option
                    v-for="item in resourceProStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="专业领域" class="width620">
                <el-select
                  @change="selectSecondField"
                  v-model="form.field" placeholder="请选择一级领域">
                  <el-option
                    v-for="item in $store.state.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.fullSpecialtyName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.secondField" placeholder="请选择二级领域">
                  <el-option
                    v-for="item in formSelect.secondOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.fullSpecialtyName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="语言对" class="width620">
                <el-select
                  v-model="form.origin"
                  placeholder="请选择源语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.target"
                  placeholder="请选择目标语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交付日期">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <order-creater ref="orderCreater" ></order-creater>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="doExtraSearch">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="$router.push('/resource/written/create')">新建订单</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          prop="num"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="department"
          label="所属部门">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="projectNo"
          label="项目编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="orderPerson"
          label="派单人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="orderTime"
          label="派单时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="115"
          prop="customerName"
          label="客户名称">
        </el-table-column>
        <el-table-column
          width="110"
          prop="requiredService"
          label="所需服务">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="subDomain"
          label="专业领域">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          label="语言对">
          <template slot-scope="scope"
                    v-if="scope.row.sourceLanguage">{{scope.row.sourceLanguage +' -> '+ scope.row.targetLanguage}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="deliveryTime"
          label="交付日期">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="customerProjectStatus"
          label="客户项目状态">
          <template slot-scope="scope">{{scope.row.customerProjectStatus | formatResourceCusStatus}}</template>
        </el-table-column>
        <el-table-column
          width="100"
          label="状态">
          <template slot-scope="scope">{{scope.row.projectStatus | formatResourceProStatus}}</template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="pm"
          label="PM">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/resource/written/detail/'+scope.row.id+'?p='+scope.row.projectNo)">查看</el-button>
            <el-button type="text" @click="$router.push('/resource/written/modify/'+scope.row.id)">修改</el-button>
            <el-button type="text"
                       v-if="userInfo.roles.includes('ROLE_res_manager')"
                       @click="$router.push('/resource/written/assign-pm/'+scope.row.id+'?t=1&n='+scope.row.projectNo)">分配PM</el-button>
            <template v-if="scope.row.pm.includes(userInfo.name)">
              <el-button type="text" @click="$router.push('/resource/written/assign/'+scope.row.id+'?t=1&n='+scope.row.projectNo)">分配</el-button>
              <el-button type="text" @click="showSetModal(scope.row.id)">设置完成</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <set-complete :callback="showTableList" :api-url="setUrl" :id="id"></set-complete>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import setComplete from '../component/setComplete';
  import orderCreater from '../component/orderCreater';
  import { mapState } from 'vuex';
  import { formatResourceCusStatus,formatResourceProStatus } from '@/common/filter';
  export default {
    components: {
      pagination,
      'set-complete': setComplete,
      'order-creater': orderCreater
    },
    data (){
      return {
        id: '',
        setUrl: '/resourceOrder/updateTranslationOrderStatus',
        form: {
          projectNum: '',
          origin: '',
          target: '',
          field: '',
          secondField: '',
          resourceService: '',
          resourceProStatus: '',
          resourceComStatus: '',
          rangeTime: ''
        },
        formSelect: {
          secondOptions: []
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    computed: {
      ...mapState('select', {
        resourceServiceOptions: state => state.resourceService,
        resourceProStatusOptions: state => state.resourceProStatus,
        resourceCusStatusOptions: state => state.resourceCusStatus
      }),
      ...mapState(['userInfo'])
    },
    filters: {
      formatResourceCusStatus: formatResourceCusStatus,
      formatResourceProStatus: formatResourceProStatus
    },
    mounted (){
      this.showTableList();
    },
    methods: {
      doExtraSearch (){
        this.formSelect.secondOptions = [];
        this.$refs.orderCreater.form.orderCreater = '';
        this.resetSearch(this.form, this.showTableList)
      },
      //获取二级领域
      selectSecondField (name){
        const result = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === name;
        });
        const sid = result.specialtyId || '';
        this.form.secondField = '';
        this.formSelect.secondOptions = [];
        this.getSecondField(sid).then(res => {
          this.formSelect.secondOptions = res;
        });
      },
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/resourceOrder/getTranslationOrders', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            orderPerson: this.$refs.orderCreater.form.orderCreater,
            projectNo: this.form.projectNum,
            sourceLan: this.form.origin,
            targetLan: this.form.target,
            domain: this.form.field,
            subDomain: this.form.secondField,
            requiredService: this.form.resourceService,
            customerProjectStatus: this.form.resourceComStatus,
            projectStatus: this.form.resourceProStatus,
            deliveryStartTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            deliveryEndTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
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
          }
          this.loading = false
        })
      },
      //弹出‘设置完成’modal
      showSetModal (id){
        this.$store.commit('showModal');
        this.id = id
      }
    }
  }
</script>
