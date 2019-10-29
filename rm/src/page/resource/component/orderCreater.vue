<template>
  <div style="display: inline-block">
    <el-form-item label="派单人">
      <el-select v-model="form.orderCreater"
                 filterable
                 placeholder="请选择派单人">
        <el-option
          v-for="item in formSelect.createrList"
          :key="item.StaffNum"
          :label="item.ChnName"
          :value="item.ChnName"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
  import domain from '@/api/index'
  export default {
    data (){
      return {
        form: {
          orderCreater: ''
        },
        formSelect: {
          createrList: []
        }
      }
    },
    created (){
      this.$http.defaults.baseURL = domain.baseResourceURL_r1;
      //IsLeave 0:在职，1：离职；2：全部
      this.$http.get('/pangu/GetStaffListByOrgID?IsLeave=2&OrgID=2762FAF6-819D-482B-B8B6-B19E8A25DBE1')
        .then(res => {
          if(res.data.Success){
            this.formSelect.createrList = res.data.Data
          }
        });
      this.$http.defaults.baseURL = domain.baseRMURL;
    }
  }
</script>
