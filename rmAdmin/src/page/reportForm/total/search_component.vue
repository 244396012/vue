<template>
  <div class="default-style default-form">
    <div class="filter-row">
      <div class="search">
        <el-input v-model="form.name" placeholder="兼职名称"></el-input>
        <el-input v-model="form.code" placeholder="兼职编码"></el-input>
        <el-select v-model="form.groupId" filterable placeholder="所属组别">
          <el-option
            v-for="item in formSelect.groupOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"></el-option>
        </el-select>
        <el-date-picker
          v-model="form.rangeTime"
          :clearable="false"
          :unlink-panels="true"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="统计时间"
          end-placeholder="结束时间">
        </el-date-picker>
        <el-button type="success" @click="doSearch(callback)">查 询</el-button>
        <el-button class="reset" @click="resetSearch(form, callback)">重 置</el-button>
      </div>
      <div class="button"> </div>
    </div>
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
