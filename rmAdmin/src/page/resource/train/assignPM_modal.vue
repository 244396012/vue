<template>
  <div>
    <el-dialog
      title="修改PM"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form :model="form" ref="form" label-width="95px">
        <el-form-item label="项目编号：" style="margin-bottom: 10px">
          <el-input v-model="$route.query.p" disabled></el-input>
        </el-form-item>
        <el-form-item label="教务主管：" style="margin-bottom: 10px">
          <el-input v-model="form.pm" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目执行时间："
                      style="margin-bottom: 15px"
                      :prop="'time'"
                      :rules="{ required: true, message: '请选择交付时间', trigger: 'blur' }">
          <el-date-picker v-model="form.time"
            type="daterange"
            :unlink-panels="true"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            start-placeholder="开始时间"
            end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" >
          <el-input v-model="form.remark"
                    type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmModify('form')" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    props: ['callback','updatedata','pmlist'],
    data (){
      return {
        form: {
          id: '',
          projectNo: '',
          pm: '',
          pmName: '',
          time: '',
          remark: ''
        },
        btn: {
          txt: '确 认',
          disabled: false
        }
      }
    },
    watch: {
      updatedata (newval){
        if(typeof(newval) === 'object'){
          this.form.time = [newval.startTime.split(' ')[0], newval.endTime.split(' ')[0]];
          this.form.pm = newval.projectManagerCode;
          this.form.pmName = newval.projectManager;
          this.form.remark = newval.remarks;
          this.form.projectNo = newval.projectNo;
          this.form.id = newval.id;
          this.form.type = newval.orderType;
        }
      }
    },
    computed: {
      ...mapState('select', {
        resourceComStatusOptions: state => state.resourceComStatus
      })
    },
    methods: {
      //确认修改
      confirmModify (formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '保存中';
            this.$http.put('/resourceOrder/updateProjectPm', this.$qs.stringify({
              id: this.form.id,
              projectNo: this.form.projectNo,
              projectManager: this.form.pmName,
              projectManagerCode: this.form.pm,
              startTime: this.form.time.length>0?this.form.time[0]+' 00:00:00':'',
              endTime: this.form.time.length>0?this.form.time[1]+' 00:00:00':'',
              remarks: this.form.remark,
              orderType: this.form.type
            })).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '分配成功'
                });
                this.doSearch(this.callback);
                this.$store.commit('showModal');
                this.resetParam(this.form)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
              this.btn.txt = '确 认'
            })
          }
        })
      }
    }
  }
</script>
