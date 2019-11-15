<template>
  <div class="default-style default-form" style="margin-bottom: 10px">
    <el-row class="filterRow">
      <el-col :span="21">
        <div class="grid-content bg-purple dotted-border-rg">
          <el-form :inline="true" class="demo-form-inline filterForm" label-width="82px">
            <el-form-item label="兼职名称">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="兼职编码">
              <el-input v-model="form.code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="所属组别">
              <el-select v-model="form.groupId" filterable placeholder="请选择">
                <el-option
                  v-for="item in formSelect.groupOptions"
                  :key="item.Value"
                  :label="item.Text"
                  :value="item.Value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="统计时间">
              <el-date-picker
                v-model="form.rangeTime"
                :clearable="false"
                :unlink-panels="true"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple-light">
          <el-button type="success" icon="el-icon-search" @click="doSearch(callback)">查 询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearch(form, callback)">重 置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import domain from '@/api/index';
  export default {
    props: ['callback'],
    data (){
      return {
        form:{
          name: '',
          code: '',
          groupId: '',
          rangeTime: [],
        },
        formSelect: {
          groupOptions: []
        }
      }
    },
    created (){
      this.form.rangeTime = [
        this.getMonthFirstDay(),
        this.getMonthLastDay()
      ];

      this.$http.defaults.baseURL = domain.baseReportURL_r1;
      this.$http.get('/pangu/GetFreelancerFeeOrg')
        .then(res => {
          res.data.Success && (this.formSelect.groupOptions = res.data.Data);
        })
    },
    methods: {
      //当月第一天
      getMonthFirstDay (){
        const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() +1,
          day = 1;
        return year+'-'+month+'-'+day
      },
      //当月最后
      getMonthLastDay (){
        const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() +1,
          day = new Date(year, month, 0).getDate(); //day为0时，会自动判断为最后一天
        return year+'-'+month+'-'+day
      }
    }
  }
</script>
