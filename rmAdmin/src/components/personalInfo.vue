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
  import domain from '@/api/index';
  import { mapMutations } from 'vuex'
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
      ...mapMutations(['setUserCode', 'setUserInfo']),
      getUserInfo (){
        this.$http.defaults.baseURL = domain.baseRMURL;
        this.$http.get('/userExtension/getCurrentInfoAndRoles')
          .then(res => {
            if(res.data.message === 'success'){
              const _data = res.data.data;
              this.form.account = _data.account;
              this.form.name = _data.userName;
              this.form.jobNo = _data.userCode;
              this.form.department = _data.department;
              this.form.station = _data.userExtension.station;
              this.form.roles = _data.roleCodeList || [];
              this.setUserCode(_data.userCode);
              this.setUserInfo(this.form)
            }
          })
      }
    }
  }
</script>
