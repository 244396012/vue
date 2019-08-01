<template>
  <div>
    <el-dialog
      :title="title"
      width="700px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form label-position="top" label-width="80px" :model="form">
        <el-form-item label="当前语言对、领域、等级下的所有可供选择的审核人">
          <el-radio-group class="exact"
                          @change="selectAssign"
                          v-model="assignForm.assign" >
            <el-radio
              v-for="item in assignForm.assignList"
              :key="item.userCode"
              :label="item">{{item.realName}}</el-radio>
          </el-radio-group>
          <!--<div class="assign-detail" v-if="assignForm.assign">-->
            <!--<el-row>-->
              <!--<el-col :span="24"><b>小王（w00001）</b></el-col>-->
            <!--</el-row>-->
            <!--<el-row>-->
              <!--<el-col :span="8">所属组别：111</el-col>-->
              <!--<el-col :span="8">岗位：111</el-col>-->
              <!--<el-col :span="8">职务：111</el-col>-->
            <!--</el-row>-->
            <!--<el-row>-->
              <!--<el-col :span="8">语言对一：111</el-col>-->
              <!--<el-col :span="8">等级：111</el-col>-->
              <!--<el-col :span="8">领域：111</el-col>-->
            <!--</el-row>-->
          <!--</div>-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click.native="confirmSelect" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'modal-import',
    props: ['callback','params'],
    data (){
      return {
        title: '分配审核人',//修改审核人
        isUpdate: false,
        form: {
          fields: [],
          originLanguageCode: '',
          targetLanguageCode: ''
        },
        assignForm: {
          assignList: [],
          assign: ''
        },
        btn: {
          txt: '确 认',
          disabled: false
        }
      }
    },
    watch: {
      params (newVal, oldVal){
        if(this.$store.state.showModal){
          this.assignForm.assign = '';
          this.form.fields = [];
          newVal[0].domains.forEach(item => {
            this.form.fields.push(item.id)
          });
          this.form.originLanguageCode = newVal[0].originLanguageCode
          this.form.targetLanguageCode = newVal[0].targetLanguageCode
          if(Array.isArray(newVal) && newVal[newVal.length-1] === 'update'){
            this.title = '修改审核人'
            this.isUpdate = true
            this.getAssignList().then(res => {
              // console.log(res);
            })
          }else{
            this.title = '分配审核人'
            this.getAssignList()
          }
        }
      }
    },
    methods: {
      //获取审核人列表
      async getAssignList (){
        return await this.$http.get('/exam/admin/getAuditorList',{
          params: {
            fields: this.form.fields.toString(),
            originLanguageCode: this.form.originLanguageCode,
            targetLanguageCode: this.form.targetLanguageCode
          }
        }).then(res => {
          this.assignForm.assignList = res.data.data
          return res
        })
      },
      //选择审核人
      selectAssign (){
        console.log(this.assignForm.assign);
      },
      //确认审核人
      confirmSelect (){
        if(!this.assignForm.assign){
          this.$message({
            type: 'warning',
            message: '请先选择审核人'
          })
          return false;
        }
        let type = 'put',
            url = '/exam/admin/allocationAuditor';
        const formData = {
          auditorId: this.assignForm.assign.userId,
          positionType: '',
          tranResultId: this.params[0].id,
          userName: this.assignForm.assign.realName
        }
        this.btn.disabled = true
        this.btn.txt = '保存中'
        this.$http({
          method: type,
          url: url,
          data: this.$qs.stringify(formData)
        }).then(res => {
          if(res.data.code === '200' && res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '分配成功'
            })
            this.$store.commit('showModal', false)
            this.callback()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.btn.disabled = false
          this.btn.txt = '确 认'
        })
      }
    }
  }
</script>
