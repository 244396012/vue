<template>
  <div class="rm-cg">
    <el-dialog
      :title="title"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form>
        <el-form-item label="奖品等级：" required>
          <el-input type="text" v-model="form.level" placeholder="请输入奖品等级"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型：" required>
          <el-select v-model="form.type" placeholder="请选择奖品类型" style="width: 65%!important;">
            <el-option v-for="item in formSelect.rewardTypeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品名称：" required>
          <el-input type="text" v-model="form.name" placeholder="请输入奖品名称"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量：" required>
          <el-input type="text" v-model="form.total" placeholder="请输入奖品数量"></el-input>
        </el-form-item>
        <el-form-item label="每日投放：" required>
          <el-input type="text" v-model="form.everyday" placeholder="请输入每日投放"></el-input>
        </el-form-item>
        <el-form-item label="中奖概率：" required>
          <el-input type="number" min="0" max="100" v-model="form.chance" placeholder="请输入中奖概率"></el-input> %
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="sendDataToParent">确 定</el-button>
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
          level: '',
          type: '',
          name: '',
          total: '',
          everyday: '',
          chance: ''
        },
        formSelect: {
          rewardTypeOptions: [
            {label:'数码奖品',value:'数码奖品'},
            {label:'现金红包',value:'现金红包'},
            {label:'积分奖励',value:'积分奖励'},
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
      sendDataToParent (){
        const sendData = {};
        for(let prop in this.form){
          if(typeof this.form[prop] !== 'number' && this.form[prop].trim() === ''){
            this.$message({
              type: 'warning',
              message: '请完善奖品信息'
            });
            return false;
          }else {
            if(prop === 'chance' && (+this.form[prop] > 100 || +this.form[prop] < 0)){
              this.$message({
                type: 'warning',
                message: '中奖概率只能填写0-100之间的数'
              });
              return false;
            }
            sendData[prop] = this.form[prop];
          }
        }
        this.$emit('tableData', sendData);
        this.$store.commit('showModal');
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-select{
    .el-input{
      width: 100%;
    }
  }
</style>
