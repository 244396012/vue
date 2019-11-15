<template>
  <div class="page">
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="活动内容" name="first">
            <div class="detail">
              <el-row class="exact">
                <el-col :span="8"><div class="grid-content bg-purple"><b>活动编号：</b>{{detail.activityNo}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"><b>活动名称：</b>{{detail.name}}</div></el-col>
              </el-row>
              <el-row class="exact">
                <el-col :span="8"><div class="grid-content bg-purple"><b>活动时间：</b>{{detail.startTime && detail.startTime.split(' ')[0]}} - {{detail.endTime && detail.endTime.split(' ')[0]}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"><b>活动类型：</b>{{detail.type}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div><b>活动状态：</b>{{detail.state}}</el-col>
              </el-row>
              <el-row class="exact">
                <el-col :span="24"><div class="grid-content bg-purple"><b style="float: left">活动规则：</b>
                  <div style="display: inline-block;margin-top: -14px">{{detail.rule}}</div>
                </div></el-col>
              </el-row>
              <div v-if="detail.state === '待开始'" style="padding-left: 75px;padding-top: 20px">
                <el-button type="success" icon="el-icon-edit"
                           @click="$router.push('/operation/activity/create?id='+$route.params.id)">编辑</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="奖品列表" name="second">
            <div class="detail">
              <el-row>
                <el-button type="success" icon="el-icon-circle-plus-outline" @click="addReward">添加奖品</el-button>
              </el-row>
              <el-table
                border
                stripe
                :max-height="$store.state.tableHeight"
                v-loading="reward.loading"
                :data="reward.tableData">
                <el-table-column
                  label="奖品序号"
                  prop="prizeNo">
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="level"
                  label="奖品等级">
                </el-table-column>
                <el-table-column
                  min-width="90"
                  prop="type"
                  label="奖品类型">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="100"
                  prop="prizeName"
                  label="奖品名称">
                </el-table-column>
                <el-table-column
                  width="80"
                  prop="totalCount"
                  label="总数量">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="currentRemainingTotal"
                  label="当前剩余总数">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="numEveryDay"
                  label="每日投放数量">
                </el-table-column>
                <el-table-column
                  width="130"
                  prop="remainingEveryDay"
                  label="今日投放剩余数">
                </el-table-column>
                <el-table-column
                  width="110"
                  prop="winningRate"
                  label="中奖概率(%)">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="160">
                  <template slot-scope="scope">
                    <el-button type="text"
                               v-if="detail.state !== '已结束'"
                               @click="modifyReward(scope.row)">修改</el-button>
                    <el-button type="text" class="del"
                               @click="deleteReward(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="抽奖记录" name="third">
            <div class="detail">
              <div class="page">
                <div class="default-style default-form">
                  <el-row class="filterRow">
                    <el-col :span="21" style="margin-bottom: 12px;">
                      <div class="grid-content bg-purple dotted-border-rg">
                        <el-form :inline="true" class="demo-form-inline filterForm" label-width="82px">
                          <el-form-item label="抽奖人姓名">
                            <el-input v-model="form.name" placeholder="请输入抽奖人姓名"></el-input>
                          </el-form-item>
                          <el-form-item label="抽奖人帐号">
                            <el-input v-model="form.rewardAccount" placeholder="请输入抽奖人帐号"></el-input>
                          </el-form-item>
                          <el-form-item label="奖品等级">
                            <el-select
                              v-model="form.rewardLevel"
                              placeholder="请选择奖品等级">
                              <el-option
                                v-for="item in formSelect.levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="奖品类型">
                            <el-select
                              v-model="form.rewardType"
                              placeholder="请选择奖品类型">
                              <el-option
                                v-for="item in formSelect.typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="奖品名称">
                            <el-input v-model="form.rewardName" placeholder="请输入奖品名称"></el-input>
                          </el-form-item>
                          <el-form-item label="发放状态">
                            <el-select
                              v-model="form.rewardState"
                              placeholder="请选择发放状态">
                              <el-option
                                v-for="item in formSelect.stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-col>
                    <el-col :span="3" style="margin-bottom: 12px;">
                      <div class="grid-content bg-purple-light">
                        <el-button type="success" icon="el-icon-search" @click="doSearch(showRecordTableList)">查 询</el-button>
                        <el-button icon="el-icon-refresh" @click="resetSearch(form,showRecordTableList)">重 置</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="default-style" style="padding-bottom: 0">
                <el-row style="margin-bottom: 0">
                  <el-col :span="12">
                    <el-button type="success" icon="el-icon-download">批量导出</el-button>
                  </el-col>
                </el-row>
              </div>
              <el-table
                border
                stripe
                :max-height="$store.state.tableHeight"
                v-loading="record.loading"
                :data="record.tableData">
                <el-table-column
                  label="#"
                  prop="num"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="winningName"
                  label="抽奖人姓名"
                  width="110">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="110"
                  prop="account"
                  label="抽奖人账号">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="120"
                  prop="winningTime"
                  label="抽奖时间">
                </el-table-column>
                <el-table-column
                  width="100"
                  prop="prizeLevel"
                  label="奖品等级">
                </el-table-column>
                <el-table-column
                  width="100"
                  prop="prizeType"
                  label="奖品类型">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="prizeName"
                  label="奖品名称">
                </el-table-column>
                <el-table-column
                  width="100"
                  prop="releaseStatus"
                  label="发放状态">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="130"
                  prop="telephone"
                  label="收件人联系方式">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="160"
                  prop="address"
                  label="收件人地址">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button type="text"
                               v-if="scope.row.releaseStatus !== '已发放'"
                               @click="sendReward(scope.row.id)">发放奖品</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <template v-if="record.totalTableList > 0">
                <pagination :callback="showRecordTableList" :total="record.totalTableList"></pagination>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <add-reward :callback="showDetail" :uData="modifyRow"></add-reward>
  </div>
</template>
<script>
  import addReward from './modal_detail_add';
  import pagination from '@/components/pagination';
  export default {
    components: {
      'add-reward': addReward,
      pagination
    },
    data (){
      return {
        activeName: 'first',
        detail: '',
        modifyRow: '',
        reward: {
          loading: false,
          tableData: []
        },
        form: {
          name: '',
          rewardAccount: '',
          rewardLevel: '',
          rewardType: '',
          rewardName: '',
          rewardState: ''
        },
        formSelect: {
          levelOptions: [{label:'一等奖',value:'一等奖'},
            {label:'二等奖',value:'二等奖'},
            {label:'三等奖',value:'三等奖'},
            {label:'参与奖',value:'参与奖'}],
          typeOptions: [
            {label:'数码奖品',value:'数码奖品'},
            {label:'现金红包',value:'现金红包'},
            {label:'积分奖励',value:'积分奖励'},
            {label:'其他',value:'其他'}],
          stateOptions: [{label:'已发放',value:'已发放'},{label:'待发放',value:'待发放'}]
        },
        record: {
          loading: false,
          totalTableList: 0,
          tableData: []
        }
      }
    },
    mounted (){
      this.showDetail();
    },
    methods: {
      handleClick(tab, event) {
        if(tab.label === '抽奖记录'){
          this.showRecordTableList();
        }
      },
      //获取详情
      showDetail (){
        this.$http.get('/operateActivity/activityDetails',{
          params: {
            activityId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail = res.data.data;
            this.reward.tableData = [];
            res.data.data.operationPrizes.forEach((item, index) => {
              item.num = (index + 1);
              this.reward.tableData.push(item)
            });
          }
        })
      },
      //添加奖品
      addReward (){
        this.$store.commit('showModal');
        this.modifyRow = {};
      },
      //修改奖品
      modifyReward (row){
        this.$store.commit('showModal');
        this.modifyRow = {};
        for(let key in row){
          this.modifyRow[key] = row[key];
        }
      },
      //删除奖品
      deleteReward (id){
        this.$confirm('是否确认此删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/operateActivity/deletePrize',{
            params: {
              prizeId: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.showDetail();
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //获取“记录”详情数据
      showRecordTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/operateActivity/getPrizeRecords', {
          params: {
            account: this.form.rewardAccount,
            name: this.form.name,
            prizeName: this.form.rewardName,
            prizeType: this.form.rewardType,
            prizeLevel: this.form.rewardLevel,
            releaseStatus: this.form.rewardState,
            pageNo: config.pageNo-1,
            pageSize: config.pageSize
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.record.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.record.tableData.push(item)
            });
            this.record.totalTableList = res.data.data.totalElements
          }
          this.record.loading = false
        })
      },
      //发放奖品
      sendReward (id){
        this.$confirm('是否确认发放奖品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/operateActivity/releasePrize',this.$qs.stringify({
            winningRecordId: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '发放成功'
              });
              this.showRecordTableList();
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
