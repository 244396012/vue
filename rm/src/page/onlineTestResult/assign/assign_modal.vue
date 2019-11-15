<template>
  <div>
    <el-dialog
      :title="title"
      width="700px"
      max-height="700px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form label-position="top" label-width="80px" :model="form">
        <el-form-item label="当前语言对、领域、等级下的所有可供选择的审核人">
          <template v-if="assignForm.assignList.length > 0">
            <el-radio-group class="exact"
                            @change="selectAssign"
                            v-model="assignForm.assignCode" >
              <el-radio
                style="width: 100px"
                v-for="item in assignForm.assignList"
                :key="item.code"
                :label="item.code">{{item.name}}</el-radio>
            </el-radio-group>
            <div class="assign-detail" v-if="assignForm.assignSelected && assignForm.assignSelected.userInfoResponse">
              <el-row>
                <el-col :span="24"><b>{{assignForm.assignSelected.userInfoResponse.realName}}（{{assignForm.assignSelected.userInfoResponse.userCode}}）</b></el-col>
              </el-row>
              <el-row>
                <el-col :span="12">所属组别：{{assignForm.assignSelected.userInfoResponse.orgName}}</el-col>
                <el-col :span="12">职务：{{assignForm.assignSelected.userInfoResponse.duty.replace(/2/g,'翻译').replace(/3/g,'审校').replace(/4/g,'质检')}}</el-col>
              </el-row>
              <el-row v-for="(item, index) of assignForm.assignSelected.auditLanguageResonseList" :key="index">
                <el-col :span="12">语言对{{index+1}}：{{item.sourceLanguageName}} -> {{item.targetLanguageName}}</el-col>
                <el-col :span="6">等级：{{item.staffLevel}}</el-col>
                <el-col :span="6">领域：{{item.domainName}}</el-col>
              </el-row>
            </div>
          </template>
          <p v-else style="text-align: center;color: #999">无匹配数据</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmSelect" :disabled="btn.disabled">{{btn.txt}}</el-button>
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
        formData: [],
        assignForm: {
          assignList: [],
          assignCode: '',
          assignSelected: ''
        },
        btn: {
          txt: '确 认',
          disabled: false
        }
      }
    },
    watch: {
      params (newVal){
        if(this.$store.state.showModal){
          this.assignForm.assignList = [];
          this.assignForm.assignCode = '';
          this.assignForm.assignSelected = '';
          this.form.fields = [];
          if(newVal[0].subDomains.includes('[')){
            const domainArr = JSON.parse(newVal[0].subDomains);
            domainArr.forEach(item => {
              this.form.fields.push(item)
            });
          }
          this.form.originLanguageCode = newVal[0].originLanguageCode;
          this.form.targetLanguageCode = newVal[0].targetLanguageCode;
          if(Array.isArray(newVal) && newVal[newVal.length-1] === 'update'){
            this.title = '修改审核人';
            this.isUpdate = true;
          }else{
            this.title = '分配审核人';
          }
          this.getAssignList()
        }
      }
    },
    methods: {
      //获取审核人列表
      getAssignList (){
        this.$http.get('/userInfoController/getAuditorList',{
          params: {
            fields: this.form.fields.toString(),
            realName: '',
            originLanguageCode: this.form.originLanguageCode,
            targetLanguageCode: this.form.targetLanguageCode
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.formData = res.data.data;
            this.assignForm.assignList = this.formData.map(item => {
              return {
                name: item.userInfoResponse.realName,
                code: item.userInfoResponse.userCode,
                type: item.userInfoResponse.staffType
              }
            });
          }
        })
      },
      //选择审核人
      selectAssign (val){
        const result = this.formData.find(item => {
          return item.userInfoResponse.userCode === val;
        });
        this.assignForm.assignSelected = result;
      },
      //确认审核人
      confirmSelect (){
        if(!this.assignForm.assignCode){
          this.$message({
            type: 'warning',
            message: '请先选择审核人'
          });
          return false;
        }
        const formData = {
          positionType: this.assignForm.assignSelected.userInfoResponse.staffType,
          auditorId: this.assignForm.assignSelected.userInfoResponse.userId,
          tranResultId: this.params[0].id,
          userName: this.assignForm.assignSelected.userInfoResponse.realName
        };
        this.btn.disabled = true;
        this.btn.txt = '保存中';
        this.$http({
          method: 'put',
          url: '/exam/admin/allocationAuditor',
          data: this.$qs.stringify(formData)
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '分配成功'
            });
            this.$store.commit('showModal', false);
            this.doSearch(this.callback)
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
    }
  }
</script>
