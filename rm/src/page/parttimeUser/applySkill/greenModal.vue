<template>
  <div>
    <el-dialog
      title="通过确认"
      width="600px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form label-width="80px" :model="form">
        <el-form-item label="测试领域">
          <el-select v-model="form.field"
                     @change="getSecondFieldFn"
                     placeholder="请选择一级领域">
            <el-option
              v-for="item in $store.state.fieldOptions"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName">
            </el-option>
          </el-select>
          <el-select multiple
                     :collapse-tags="true"
                     v-model="form.secondField"
                     placeholder="请选择二级领域">
            <el-option
              v-for="item in formSelect.secondOptions"
              :key="item.id"
              :label="item.fullSpecialtyName"
              :value="item.fullSpecialtyName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言对">
          <el-select
            v-model="form.origin" placeholder="请选择源语言">
            <el-option
              v-for="item in languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
          <el-select
            v-model="form.target" placeholder="请选择目标语言">
            <el-option
              v-for="item in languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select
            v-model="form.level"
            placeholder="请选择等级">
            <el-option
              v-for="item in memberLevel"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmPass" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    props: ['callback'],
    data (){
      return {
        form: {
          field: '',
          secondField: [],
          origin: '',
          target: '',
          level: ''
        },
        formSelect: {
          secondOptions: []
        },
        btn: {
          txt: '确 认',
          disabled: false
        }
      }
    },
    computed: {
      ...mapState(['languageList']),
      ...mapState('select', {
        memberLevel: state => state.memberLevel
      }),
      ...mapState({
        passData: state => state.updateData
      })
    },
    watch: {
      passData (newVal){
        if(newVal){
          this.form.field = newVal.domain && JSON.parse(newVal.domain).toString() || '';
          this.form.secondField = newVal.subDomain && JSON.parse(newVal.subDomain) || [];
          this.form.origin = newVal.originLanguageCode || '';
          this.form.target = newVal.targetLanguageCode || '';
          this.form.level = newVal.setLevel && (newVal.setLevel.includes('P')?newVal.setLevel:'P'+newVal.setLevel) || '';
          if(this.form.field){
            this.formSelect.secondOptions = [];
            const domain = this.$store.state.fieldOptions.find(item => {
              return item.fullSpecialtyName === this.form.field;
            }) || {};
            this.getSecondField(domain.specialtyId).then(res => {
              this.formSelect.secondOptions = res
            })
          }
        }
      }
    },
    methods: {
      //获取二级领域
      getSecondFieldFn (name){
        this.form.secondField = [];
        this.formSelect.secondOptions = [];
        const domain = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === name;
        }) || {};
        this.getSecondField(domain.specialtyId).then(res => {
          this.formSelect.secondOptions = res
        })
      },
      //确认通过
      confirmPass (){
        for(let key in this.form){
          if(this.form[key].length < 1){
            this.$message({
              type: 'warning',
              message: '请填写通过确认信息'
            });
            return false
          }
        }
        if(this.form.origin === this.form.target){
          this.$message({
            type: 'warning',
            message: '请选择不同的语言'
          });
          return false
        }
        this.btn.disabled = true;
        this.btn.txt = '提交中';
        const originName = this.languageList.find(item => {
          return item.englishName === this.form.origin
        }) || {};
        const targetName = this.languageList.find(item => {
          return item.englishName === this.form.target
        }) || {};
        const domainName = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === this.form.field
        }) || {};
        const secondDomain = [];
        this.form.secondField.forEach(item => {
          for(let i = 0, len = this.formSelect.secondOptions.length; i<len; i++){
            const option = this.formSelect.secondOptions[i];
            if(option.fullSpecialtyName === item){
              secondDomain.push(option.id);
              break
            }
          }
        });
        const data = {
          domain: JSON.stringify([domainName.fullSpecialtyName]),
          domainId: JSON.stringify([domainName.id]),
          subDomain: JSON.stringify(this.form.secondField),
          subDomainId: JSON.stringify(secondDomain),
          originLanguageCode: this.form.origin,
          originLanguageName: originName.chineseName,
          targetLanguageCode: this.form.target,
          targetLanguageName: targetName.chineseName,
          overViewId: this.passData.overviewId,
          setLevel: this.form.level.slice(1),
          greenChannelId: this.passData.geenchannelId,
          userCode: this.passData.userCode,
          isPassed: true,
          comment: ''
        };
        this.$http.post('/exam/admin/auditApplyGreenChannel', this.$qs.stringify(data))
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.$store.commit('showModal');
              this.doSearch(this.callback)
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.btn.disabled = false;
            this.btn.txt = '确 认';
          })
      }
    }
  }
</script>
