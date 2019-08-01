<template>
  <div class="rm-info">
    <el-dialog
      title="帐号信息"
      width="320px"
      :visible.sync="$store.state.showModalInfo"
      center>
      <el-form>
        <el-form-item label="姓 名：">
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="工 号：">
          <span>{{form.jobNo}}</span>
        </el-form-item>
        <el-form-item label="部 门：">
          <span>{{form.department}}</span>
        </el-form-item>
        <el-form-item label="岗 位：">
          <span>{{form.station}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'personal-info',
    props: ['callback'],
    data (){
      return {
        form: {
          name: '--',
          jobNo: '--',
          department: '--',
          station: '--'
        }
      }
    },
    created (){
      this.getUserInfo()
    },
    methods: {
      getUserInfo (){
        this.$http.get('/userExtension/getCurrentInfo')
          .then(res => {
            if(res.data.message === 'success'){
              this.form.name = res.data.data.userName;
              this.form.jobNo = res.data.data.userCode;
              this.form.department = res.data.data.department;
              this.form.station = res.data.data.userExtension.station;
            }
          })
      }
    }
  }
</script>
