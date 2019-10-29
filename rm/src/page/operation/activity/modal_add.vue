<template>
  <div class="rm-cg">
    <el-dialog
      :title="title"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form :model="form" ref="form">
        <el-form-item label="奖品序号：" :prop="'no'" :rules="{ required: true, message: '请输入奖品序号', trigger: 'change' }">
          <el-select v-model="form.no" placeholder="选择对应大转盘序号，从0开始" style="width: 65%!important;">
            <el-option value="0" label="0"></el-option>
            <el-option value="1" label="1"></el-option>
            <el-option value="2" label="2"></el-option>
            <el-option value="3" label="3"></el-option>
            <el-option value="4" label="4"></el-option>
            <el-option value="5" label="5"></el-option>
            <el-option value="6" label="6"></el-option>
            <el-option value="7" label="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品等级：" :prop="'level'" :rules="{ required: true, message: '请选择奖品等级', trigger: 'change' }">
          <el-select v-model="form.level" placeholder="请选择奖品等级" style="width: 65%!important;">
            <el-option value="明天再来" label="明天再来"></el-option>
            <el-option value="幸运奖" label="幸运奖"></el-option>
            <el-option value="五等奖" label="五等奖"></el-option>
            <el-option value="四等奖" label="四等奖"></el-option>
            <el-option value="三等奖" label="三等奖"></el-option>
            <el-option value="二等奖" label="二等奖"></el-option>
            <el-option value="一等奖" label="一等奖"></el-option>
            <el-option value="特等奖" label="特等奖"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品类型：" :prop="'level'" :rules="{ required: true, message: '请输入奖品等级', trigger: 'blur' }">
          <el-select v-model="form.type" placeholder="请选择奖品类型" style="width: 65%!important;">
            <el-option v-for="item in formSelect.rewardTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="红包数额：" required v-if="form.type === '现金红包'">
          <el-input type="number" v-model="form.cashNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="积分数额：" required  v-if="form.type === '积分'">
          <el-input type="number" v-model="form.scoreNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="奖品名称：" :prop="'name'" :rules="{ required: true, message: '请输入奖品名称', trigger: 'blur' }">
          <el-input type="text" v-model="form.name" placeholder="请输入奖品名称"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量：" :prop="'total'" :rules="{ required: true, message: '请输入奖品数量', trigger: 'blur' }">
          <el-input type="number" min="1" v-model="form.total" placeholder="请输入奖品数量"></el-input>
        </el-form-item>
        <el-form-item label="每日投放：" :prop="'everyday'" :rules="{ required: true, message: '请输入每日投放', trigger: 'blur' }">
          <el-input type="number" min="1" v-model="form.everyday" placeholder="请输入每日投放"></el-input>
        </el-form-item>
        <el-form-item label="中奖概率：" :prop="'chance'" :rules="{ required: true, message: '请输入中奖概率', trigger: 'blur' }">
          <el-input type="number" min="0" max="100" v-model="form.chance" placeholder="请输入中奖概率"></el-input> %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="sendDataToParent('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'add-reward',
    props: ['callback','sendData'],
    data (){
      return {
        title: '添加奖品',//修改奖品
        form: {
          no: '',
          level: '',
          type: '',
          name: '',
          cashNum: '',
          scoreNum: '',
          total: '',
          everyday: '',
          chance: ''
        },
        formSelect: {
          rewardTypeOptions: [
            {label:'数码奖品',value:'数码奖品'},
            {label:'现金红包',value:'现金红包'},
            {label:'积分',value:'积分'},
            {label:'其他',value:'其他'}]
        }
      }
    },
    watch: {
      sendData (newVal){
        if(newVal && Object.prototype.toString.call(newVal) === '[object Object]'){
          if(newVal.chance){
            this.title = '修改奖品';
            for(let prop in newVal){
              this.form[prop] = newVal[prop];
            }
          }else{
            this.title = '添加奖品';
            delete this.form.$index;
            for(let prop in this.form){
              this.form[prop] = '';
            }
          }
        }
      }
    },
    methods: {
      //把数据添加到 父组件table中
      sendDataToParent (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.type === '现金红包' && !this.form.cashNum){
              this.$message({
                type: 'warning',
                message: '请填写红包数额'
              });
              return false
            }
            if(this.form.type === '积分奖励' && !this.form.scoreNum){
              this.$message({
                type: 'warning',
                message: '请填写积分数额'
              });
              return false
            }
            const sendData = {};
            for(let prop in this.form){
              sendData[prop] = this.form[prop];
            }
            this.$emit('tableData', sendData);
            this.$store.commit('showModal')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-form-item__error {
    left: 100px;
  }
  /deep/ .el-select{
    .el-input{
      width: 100%;
    }
  }
</style>
