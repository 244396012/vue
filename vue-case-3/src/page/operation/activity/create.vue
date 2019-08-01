<template>
  <div class="page activity">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动名称：" prop="activityName">
            <el-col :span="12">
              <el-input type="text" v-model="ruleForm.activityName" clearable placeholder="请输入活动名称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="活动类型：" prop="activityType">
            <el-col :span="12">
              <el-select v-model="ruleForm.activityType" placeholder="请选择活动类型">
                <el-option v-for="item in formSelect.activityTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间：" prop="activityTime">
            <el-date-picker
              :picker-options="pickerOptions"
              v-model="ruleForm.activityTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="活动开始时间"
              end-placeholder="活动结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动介绍：" prop="activityShort">
            <el-input type="textarea" v-model="ruleForm.activityShort" clearable placeholder="请输入活动规则和要求等"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="default-style">
      <div class="detail form">
        <el-row style="margin-bottom: 15px;">
          <el-col :span="12" style="line-height: 32px;font-size: 16px;font-weight: 700;">奖品列表</el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="success" icon="el-icon-plus"
                       @click="addReward">添加奖品</el-button>
          </el-col>
        </el-row>
        <el-table
          border
          stripe
          :max-height="$store.state.tableHeight"
          :data="tableData">
          <el-table-column
            label="#"
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="level"
            label="奖品等级">
          </el-table-column>
          <el-table-column
            prop="type"
            label="奖品类型">
          </el-table-column>
          <el-table-column
            prop="name"
            label="奖品名称">
          </el-table-column>
          <el-table-column
            prop="total"
            label="奖品数量">
          </el-table-column>
          <el-table-column
            prop="everyday"
            label="每日投放数量">
          </el-table-column>
          <el-table-column
            prop="chance"
            label="中奖概率">
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="updateReward(scope.$index)">修改</el-button>
              <el-button type="text" class="del" @click="deleteReward(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 2rem;">
          <el-button type="success"
                     @click="submitForm('ruleForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
          <el-button @click="$router.push('/operation/activity')">取 消</el-button>
        </el-row>
      </div>
    </div>
    <add-modal @tableData="getDataFromChild" :sendData="updateData"></add-modal>
  </div>
</template>
<script>
  import addModal from './modal_add'
  export default {
    components: {
      'add-modal': addModal
    },
    data() {
      return {
        updateData: '',
        ruleForm: {
          activityName: '',
          activityType: '',
          activityTime: '',
          activityShort: ''
        },
        pickerOptions: {
          disabledDate: (time) => {
            /*
             * 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,
             * 今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
            * */
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          activityType: [
            { required: true, message: '请选择活动类型', trigger: 'change' }
          ],
          activityTime: [
            { required: true, message: '请选择活动时间', trigger: 'blur' }
          ],
          activityShort: [
            { required: true, message: '请输入活动介绍', trigger: 'blur' }
          ]
        },
        formSelect:{
          activityTypeOptions: [{label:'大转盘活动',value:'大转盘活动'}]
        },
        tableData: [],
        btn: {
          disabled: false,
          txt: '提交活动'
        }
      };
    },
    mounted (){
      if(this.$route.query.id){
        this.fillInForm();
        document.title = '编辑活动';
        document.querySelectorAll('.el-breadcrumb__item')[2].innerHTML = '编辑活动';
      }
    },
    methods: {
      //添加奖品
      addReward (){
        this.updateData = {};
        this.$store.commit('showModal');
      },
      //接收子组件传递的table 数据
      getDataFromChild (data){
        if(data.$index !== undefined){
          const idx = data.$index;
          delete data.$index;
          this.tableData.splice(idx, 1, data);
        }else{
          this.tableData.push(data);
        }
      },
      //修改奖品
      updateReward (idx){
        this.updateData = this.tableData[idx];
        this.updateData.$index = idx;
        this.$store.commit('showModal');
      },
      //删除奖品
      deleteReward (idx){
        this.tableData.splice(idx, 1);
      },
      //提交活动
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.tableData.length === 0){
              this.$message({
                type: 'warning',
                message: '请添加奖品信息'
              });
              return false;
            }
            let type = 'post',
                url = '/operateActivity/createActivity';
            const data = {
              name: this.ruleForm.activityName,
              type: this.ruleForm.activityType,
              startTimeStr: this.ruleForm.activityTime[0]+' 00:00:00',
              endTimeStr: this.ruleForm.activityTime[1]+' 23:55:55',
              rule: this.ruleForm.activityShort
            };
            const prizes = [];
            this.tableData.forEach(item => {
              const tempData = {};
              tempData.level = item.level;
              tempData.type = item.type;
              tempData.prizeName = item.name;
              tempData.totalCount = item.total;
              tempData.numEveryDay = item.everyday;
              tempData.winningRate = item.chance;
              if(this.$route.query.id){
                tempData.activityId = this.$route.query.id
              }
              prizes.push(tempData);
            });
            Object.assign(data, {
              operationPrizes: prizes
            });
            if(this.$route.query.id){
              type = 'put';
              url = '/operateActivity/editActivity';
              Object.assign(data, {
                id: this.$route.query.id
              })
            }
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http({
              method: type,
              url: url,
              data: data
            }).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '活动提交成功'
                });
                setTimeout(() => {
                  this.$router.push('/operation/activity');
                }, 1000);
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
              this.btn.txt = '提交活动';
            })
          }
        })
      },
      //当修改时，填充form表单数据
      fillInForm() {
        this.$http.get('/operateActivity/activityDetails', {
          params: {
            activityId: this.$route.query.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.ruleForm.activityName = res.data.data.name;
            this.ruleForm.activityType = res.data.data.type;
            if(res.data.data.startTime || res.data.data.endTime){
              this.ruleForm.activityTime = [];
              this.ruleForm.activityTime.push(res.data.data.startTime);
              this.ruleForm.activityTime.push(res.data.data.endTime);
            }
            this.ruleForm.activityShort = res.data.data.rule;
            res.data.data.operationPrizes.forEach((item, index) => {
              const temp = {};
              temp.level = item.level;
              temp.type = item.type;
              temp.name = item.prizeName;
              temp.total = item.totalCount;
              temp.everyday = item.numEveryDay;
              temp.chance = item.winningRate;
              this.tableData.push(temp);
            });
          }
        })
      }
    }
  }
</script>
