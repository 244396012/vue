<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.projectNum" placeholder="项目编号"></el-input>
          <el-select v-model="form.resourceService" placeholder="所需服务">
            <el-option
              v-for="item in resourceServiceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.resourceProStatus" placeholder="完成状态">
            <el-option
              v-for="item in resourceProStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.resourceComStatus" placeholder="客户项目状态" class="width120">
            <el-option
              v-for="item in resourceCusStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="el-button-2">
            <el-select v-model="form.field" @change="selectSecondField" placeholder="专业领域">
              <el-option
                v-for="item in $store.state.fieldOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.fullSpecialtyName">
              </el-option>
            </el-select> -
            <el-select v-model="form.secondField" placeholder="二级领域">
              <el-option
                v-for="item in formSelect.secondOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.fullSpecialtyName">
              </el-option>
            </el-select>
          </div>
          <div class="el-button-2">
            <el-select v-model="form.origin" placeholder="源语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select> -
            <el-select v-model="form.target" placeholder="目标语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select>
          </div>
          <el-date-picker
            v-model="form.rangeTime"
            :clearable="false"
            :unlink-panels="true"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="交付日期"
            end-placeholder="结束时间">
          </el-date-picker>
          <order-creater ref="orderCreater" ></order-creater>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="doExtraSearch">重 置</el-button>
        </div>
        <div class="button"
             v-if="$store.state.secondPermission['/resourceOrder/addTranslationOrder'] !== undefined">
          <el-button type="success" @click="$router.push('/resource/written/create')">新建订单</el-button>
        </div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          fixed
          prop="num"
          label="#"
          width="60">
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
          min-width="80"
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
          min-width="110"
          prop="customerName"
          label="客户名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="requiredService"
          label="所需服务">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="domain"
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
          min-width="110"
          prop="customerProjectStatus"
          label="客户项目状态">
          <template slot-scope="scope">{{scope.row.customerProjectStatus | formatResourceCusStatus}}</template>
        </el-table-column>
        <el-table-column
          min-width="90"
          label="状态">
          <template slot-scope="scope">{{scope.row.projectStatus | formatResourceProStatus}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="pm"
          label="PM">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <template v-if="$store.state.secondPermission['/resourceOrder/editTranslationOrder'] === undefined &&
                            $store.state.secondPermission['/resourceOrder/distributePm'] === undefined &&
                            $store.state.secondPermission['/resourceOrder/distributeInterpreter'] === undefined">
              <router-link :to="{path:'/resource/written/detail/'+scope.row.id+'?p='+scope.row.projectNo}"
                           class="blank"
                           target="_blank">查看</router-link>
            </template>
            <template v-else>
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link :to="{path:'/resource/written/detail/'+scope.row.id+'?p='+scope.row.projectNo}"
                                 class="blank"
                                 target="_blank">查看</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$store.state.secondPermission['/resourceOrder/editTranslationOrder'] !== undefined">
                    <el-button type="text" @click="$router.push('/resource/written/modify/'+scope.row.id)">修改</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$store.state.secondPermission['/resourceOrder/distributePm'] !== undefined">
                    <router-link :to="{path: '/resource/written/assign-pm/'+scope.row.id+'?t=1&p='+scope.row.projectNo+'&time='+scope.row.deliveryTime}"
                                 class="blank"
                                 target="_blank">分配PM</router-link>
                    </el-dropdown-item>
                  <template v-if="$store.state.secondPermission['/resourceOrder/distributeInterpreter'] !== undefined &&
                                  scope.row.pmCode.includes($store.state.userCode)">
                    <el-dropdown-item>
                      <router-link :to="{path: '/resource/written/assign/'+scope.row.id+'?t=1&p='+scope.row.projectNo}"
                                   class="blank"
                                   target="_blank">分配兼职</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text"
                                 @click="showSetModal(scope.row.id)">设置完成</el-button>
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
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
        config.pageSize = config.pageSize || 20;
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
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
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
