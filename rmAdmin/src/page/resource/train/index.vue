<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.projectNum" placeholder="项目编号"></el-input>
          <el-select v-model="form.resourceProStatus" placeholder="完成状态">
            <el-option
              v-for="item in resourceProStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.field" placeholder="专业领域">
            <el-option label="基础语言类" value="基础语言类"></el-option>
            <el-option label="商务语言类" value="商务语言类"></el-option>
            <el-option label="专业语言类" value="专业语言类"></el-option>
            <el-option label="文化风俗类" value="文化风俗类"></el-option>
            <el-option label="商务礼仪类" value="商务礼仪类"></el-option>
            <el-option label="陪同口译" value="陪同口译"></el-option>
            <el-option label="会议口译" value="会议口译"></el-option>
            <el-option label="同声传译" value="同声传译"></el-option>
            <el-option label="翻译技巧类-笔译" value="翻译技巧类-笔译"></el-option>
          </el-select>
          <el-select v-model="form.languageType" placeholder="语言类型">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
          <el-select v-model="form.resourceCusStatus" placeholder="客户项目状态">
            <el-option
              v-for="item in resourceCusStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="form.rangeTime"
            :clearable="false"
            :unlink-panels="true"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="项目日期"
            end-placeholder="结束时间">
          </el-date-picker>
          <order-creater ref="orderCreater"></order-creater>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="doExtraSearch">重 置</el-button>
        </div>
        <div class="button"
             v-if="$store.state.secondPermission['/resourceOrder/addTrainingOrder'] !== undefined">
          <el-button type="success" @click="$router.push('/resource/train/create')">新建订单</el-button>
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
          min-width="90"
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
          min-width="110"
          prop="workContent"
          label="工作内容">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="professionalDoamin"
          label="专业领域">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="languageType"
          label="语言类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="speicalTime"
          label="具体时间">
        </el-table-column>
        <el-table-column
          min-width="90"
          label="状态">
          <template slot-scope="scope">{{scope.row.projectStatus | formatResourceProStatus}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="pm"
          label="PM">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <template v-if="$store.state.secondPermission['/resourceOrder/editTrainingOrder'] === undefined &&
                            $store.state.secondPermission['/resourceOrder/distributePm'] === undefined &&
                            $store.state.secondPermission['/resourceOrder/distributeTrainingInterpreter'] === undefined">
              <router-link :to="{path: '/resource/train/detail/'+scope.row.id+'?t=4&p='+scope.row.projectNo}"
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
                    <router-link :to="{path: '/resource/train/detail/'+scope.row.id+'?t=4&p='+scope.row.projectNo}"
                                 class="blank"
                                 target="_blank">查看</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$store.state.secondPermission['/resourceOrder/editTrainingOrder'] !== undefined">
                    <el-button type="text"
                               @click="$router.push('/resource/train/modify/'+scope.row.id)">修改</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$store.state.secondPermission['/resourceOrder/distributePm'] !== undefined">
                    <router-link :to="{path: '/resource/train/assign-pm/'+scope.row.id+'?t=4&p='+scope.row.projectNo}"
                                 class="blank"
                                 target="_blank">分配PM</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$store.state.secondPermission['/resourceOrder/distributeTrainingInterpreter'] !== undefined &&
                                          scope.row.pmCode.includes($store.state.userCode)">
                    <el-button type="text"
                               @click="showSetModal(scope.row.id)">设置完成</el-button>
                  </el-dropdown-item>
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
  import { setAccountStatus } from "@/common/operate";
  import { formatResourceProStatus } from '@/common/filter';
  export default {
    components: {
      pagination,
      'order-creater': orderCreater,
      'set-complete': setComplete
    },
    data (){
      return {
        id: '',
        setUrl: '/resourceOrder/hireList',
        form: {
          projectNum: '',
          languageType: '',
          field: '',
          resourceCusStatus: '',
          resourceProStatus: '',
          rangeTime: ''
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    computed: {
      ...mapState('select', {
        resourceCusStatusOptions: state => state.resourceWpCusStatus,
        resourceProStatusOptions: state => state.resourceProStatus
      }),
      ...mapState(['userInfo'])
    },
    filters: {
      formatResourceProStatus: formatResourceProStatus
    },
    mounted (){
      this.showTableList()
    },
    methods: {
      doExtraSearch (){
        this.$refs.orderCreater.form.orderCreater = '';
        this.resetSearch(this.form, this.showTableList)
      },
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/resourceOrder/getTrainingOrderOrders', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            orderPerson: this.$refs.orderCreater.form.orderCreater,
            languageType: this.form.languageType,
            projectNo: this.form.projectNum,
            professionalDoamin: this.form.field,
            projectStatus: this.form.resourceProStatus,
            customerProjectStatus: this.form.resourceCusStatus,
            orderStartTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            orderEndTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
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
      showSetModal (id){
        this.$store.commit('showModal');
        this.id = id
      }
    }
  }

</script>
