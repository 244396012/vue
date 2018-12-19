<template>
  <div>
    <div class="user-nav">
      <router-link :to="'/user-vip'">会员详情</router-link>
      <router-link class="active" :to="'/user-vip/points'">积分明细</router-link>
    </div>
    <div class="user-vip">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="收支明细">
          <el-select v-model="form.select">
            <el-option label="全部" value=""></el-option>
            <el-option label="充值" value="1"></el-option>
            <el-option label="下载" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水时间">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="开始日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="结束日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="showScore" :disabled="btn.disabled">{{btn.txt}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="col1"
          label="收支类型">
          <template slot-scope="scope">
            {{scope.row.col1 | getType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="col2"
          label="积分数量">
          <template slot-scope="scope">
            {{scope.row.col2 | getNum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="col3"
          label="剩余积分">
        </el-table-column>
        <el-table-column
          prop="col4"
          label="收支事宜">
          <template slot-scope="scope">
            {{scope.row.col4 | getMark}}
          </template>
        </el-table-column>
        <el-table-column
          prop="col5"
          label="时间">
          <template slot-scope="scope">
            {{scope.row.col5 | getTime}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import Utils from '../../utils'
  export default {
    name: 'Vip',
    data() {
      return {
        btn: {
          disabled: false,
          txt: '检索'
        },
        form: {
          select: '',
          date1: '',
          date2: ''
        },
        tableData: []
      }
    },
    mounted (){
      this.showScore()
    },
    filters: {
      getType (val){
        return +val < 0 ? '支出' : '收入'
      },
      getNum (val){
        return +val > 0 ? '+'+val : val
      },
      getMark (val){
        let type = ''
        switch (val){
          case 0: type = '标准下载';break
          case 1: type = '充值';break
          case 2: type = '订单取消';break
          case 3: type = '会员到期清空';break
        }
        return type
      },
      getTime (val){
        return val ? Utils.formatTime(val,true) : '/'
      }
    },
    methods: {
      showScore (){
        this.tableData = []
        this.btn.disabled = true
        this.btn.txt = '检索中'
        this.$ajax.get('/member/getRecharge',{
          params: {
            pageSize: 999,
            pageNo: 1,
            type: this.form.select,
            startTime: this.form.date1,
            endTime: this.form.date2
          }
        }).then(res => {
          if(res.data.list && res.data.list.length > 0 && Array.isArray(res.data.list)){
            res.data.list.forEach(item => {
              const row = {
                col1: item.scAmount,
                col2: item.scAmount,
                col3: item.scRemain,
                col4: item.scType,
                col5: item.updateTime
              }
              this.tableData.push(row)
            })
          }
          this.btn.disabled = false
          this.btn.txt = '检索'
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/user-nav";
  @import "../../style/vip";
</style>

