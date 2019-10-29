<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="团队名称：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'teamName'"
                            :rules="{ required: true, message: '请输入团队名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.teamName" clearable placeholder="请输入团队名称"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="专职人数：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'memberNum'"
                            :rules="{ required: true, message: '请输入专职人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.memberNum" type="number" placeholder="请输入专职人数"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="统一社会信用代码：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'socialCode'"
                            :rules="{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }">
                <el-input v-model="ruleForm.socialCode" clearable placeholder="请输入统一社会信用代码"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="发票类型：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-select style="width: 100%"
                  v-model="ruleForm.paperType" placeholder="请选择">
                  <el-option
                    v-for="item in formSelect.paperTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="纳税类型：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-select style="width: 100%"
                           v-model="ruleForm.taxType" placeholder="请选择">
                  <el-option
                    v-for="item in formSelect.taxTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="所在地：" style="margin-bottom: 0px">
            <el-col :span="24">
              <el-form-item>
                <div class="areaPicker">
                  <select v-model="ruleForm.province"
                          style="width: 143px"
                          name="deliverprovince" id="deliverprovince"></select>
                  <select v-model="ruleForm.city"
                          style="width: 143px"
                          name="delivercity" id="delivercity"></select>
                  <select v-model="ruleForm.area"
                          style="width: 148px"
                          name="deliverarea" id="deliverarea"></select>
                </div>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="ruleForm.teamRemark"
                          clearable
                          type="textarea" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="兼职类型" required style="margin-bottom: 0px">
            <el-col :span="20">
              <el-form-item prop="partTimeType"
                            :rules="{ type: 'array',required: true, message: '请选择兼职类型', trigger: 'change' }">
                <el-checkbox-group v-model="ruleForm.partTimeType">
                  <el-checkbox label="笔译">笔译</el-checkbox>
                  <el-checkbox label="DTP">DTP</el-checkbox>
                  <el-checkbox label="会展">会展</el-checkbox>
                  <el-checkbox label="设备">设备</el-checkbox>
                  <el-checkbox label="搭建">搭建</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-form-item>
          <template v-if="ruleForm.partTimeType.includes('笔译')">
            <el-form-item label="语言信息（必填）" style="margin-bottom: 0px">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="addLanPair">添加语言对</el-button>
            </el-form-item>
            <div class="lan-item" v-for="(item, index) in ruleForm.language" :key="index">
              <el-form-item label="语言对：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact" v-model="item.origin" placeholder="请选择源语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="10">
                  <el-select class="exact" v-model="item.target" placeholder="请选择目标语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button type="text" class="del" v-if="index>0" @click="deleteLan(index)">删除</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="行业领域：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact"
                             @change="getSecondFieldFn(index)"
                             v-model="item.firstField" placeholder="请选择一级领域">
                    <el-option
                      v-for="fd in $store.state.fieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="10">
                  <el-select class="exact"
                             multiple
                             :collapse-tags="true"
                             v-model="item.secondField" placeholder="请选择二级领域">
                    <el-option
                      v-for="fd in item.secondFieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="译员等级：" required>
                <el-col :span="10">
                  <el-select class="exact" v-model="item.level" placeholder="请选择该语种等级">
                    <el-option
                      v-for="lv in memberLevel"
                      :key="lv"
                      :label="lv"
                      :value="lv"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </div>
          </template>
          <el-form-item label="联系方式（必填）" style="margin-bottom: 0px"></el-form-item>
          <div class="in-item">
            <el-form-item label="主要联系人姓名：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item  :prop="'primaryPeople'"
                               :rules="{ required: true, message: '请输入联系人姓名', trigger: 'blur' }">
                  <el-input v-model="ruleForm.primaryPeople" clearable placeholder="请输入联系人姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号码：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item prop="primaryPhone">
                  <el-input v-model="ruleForm.primaryPhone" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱：" required style="margin-bottom: -10px">
              <el-col :span="12">
                <el-form-item prop="primaryEmail">
                  <el-input v-model="ruleForm.primaryEmail" clearable placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="身份认证（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="sf-item">
            <el-form-item label="真实姓名：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.primaryPeople" disabled></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="证件类型：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.identyType" clearable placeholder="请选择证件类型">
                  <el-option
                    v-for="item in formSelect.identyTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="证件号码：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.identyNo" clearable placeholder="请输入译员证件号码"></el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button @click="$router.push('/parttimeTeam/preTeam')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/common/area'
  import utils from '@/utils';
  import { mapState, mapGetters } from 'vuex';
  export default {
    data() {
      let isPhone = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入手机号'));
        }else if(!this.regPhone.test(value)){
          return callback(new Error('请输入正确的手机号'));
        }
        callback();
      };
      let isEmail = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入邮箱'));
        }else if(!this.regEmail.test(value)){
          return callback(new Error('请输入正确的邮箱'));
        }
        callback();
      };
      return {
        ruleForm: {
          teamName: '',
          memberNum: '',
          socialCode: '',
          paperType: '增值税专用发票',
          taxType: '一般纳税人',
          partTimeType: [],
          province: '',
          city: '',
          area: '',
          teamRemark: '',
          primaryPeople: '',
          primaryPhone: '',
          primaryEmail: '',
          identyType: '',
          identyNo: '',
          //语言信息
          language: [
            {
              origin: '',
              target: '',
              firstField: '',
              secondField: [],
              secondFieldOptions: [],
              level: ''
            }
          ],
        },
        formSelect: {
          paperTypeOptions: ['增值税专用发票','普通发票','不开发票'],
          taxTypeOptions: ['一般纳税人','小规模纳税人','其他'],
          identyTypeOptions: ['身份证','港澳通行证','往来台湾通行证','护照']
        },
        rules: {
          primaryPhone: [{ validator: isPhone, trigger: ['blur', 'change'] }],
          primaryEmail: [{ validator: isEmail, trigger: ['blur', 'change'] }]
        },
        btn: {
          disabled: false,
          txt: '提 交'
        }
      };
    },
    computed: {
      ...mapState('select', {
        memberLevel: state => state.memberLevel
      }),
      ...mapState(['regPhone','regEmail','regCard'])
    },
    created (){
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea")
      })
    },
    methods: {
      //添加语言
      addLanPair (){
        this.ruleForm.language.push({
          origin: '',
          target: '',
          firstField: '',
          secondField: [],
          secondFieldOptions: [],
          level: ''
        })
      },
      //删除语言
      deleteLan (idx){
        this.ruleForm.language.splice(idx,1);
      },
      //获取二级领域
      getSecondFieldFn (index){
        const findLan =  this.ruleForm.language[index],
          fieldName = findLan.firstField;
        let result = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === fieldName && item.specialtyId;
        });
        findLan.secondField = [];
        this.getSecondField(result.specialtyId).then(res => {
          findLan.secondFieldOptions = res;
        });
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //兼职类型，选择笔译时，需要填写语言信息
            const languageInfoLst = [];
            if(this.ruleForm.partTimeType.includes('笔译')){
              const uniqueArr = [];
              const lan = this.ruleForm.language;
              for(let i = 0, len = lan.length; i < len; i++){
                const item = lan[i];
                for(let key in item){
                  if(item[key] === '' || (key === 'secondField' && item[key].length < 1)){
                    this.$message({
                      type: 'warning',
                      message: '请先完善语言信息'
                    });
                    return false;
                  }
                }
                if(item.origin === item.target){
                  this.$message({
                    type: 'warning',
                    message: '请选择不同的源语言和目标语言'
                  });
                  return false;
                }
                if(uniqueArr.includes(item.firstField)){
                  this.$message({
                    type: 'warning',
                    message: '请选择不同的行业领域'
                  });
                  return false;
                }
                uniqueArr.push(item.firstField);
                let firstFieldId = '',
                  secondFieldIds = [];
                let result = this.$store.state.fieldOptions.find(ff => {
                  return ff.fullSpecialtyName === item.firstField;
                });
                item.secondField.forEach(sf => {
                  let result = item.secondFieldOptions.find(fd => {
                    return fd.fullSpecialtyName === sf ;
                  });
                  secondFieldIds.push(result.id);
                });
                firstFieldId = result.id;
                const obj = {
                  "domain": JSON.stringify([item.firstField]),
                  "domainId": JSON.stringify([firstFieldId]),
                  "level": item.level.slice(1),
                  "originLanguageCode": item.origin.split(',')[1],
                  "originLanguageName": item.origin.split(',')[0],
                  "subDomain": JSON.stringify(item.secondField),
                  "subDomainId": JSON.stringify(secondFieldIds),
                  "targetLanguageCode": item.target.split(',')[1],
                  "targetLanguageName": item.target.split(',')[0]
                };
                languageInfoLst.push(obj);
              }
            }
            if((this.ruleForm.identyType === '' && this.ruleForm.identyNo !== '') ||
              this.ruleForm.identyType !== '' && this.ruleForm.identyNo === ''){
              this.$message({
                type: 'warning',
                message: '请完善身份信息'
              });
              return false;
            }
            const teamGreenChannelParam = {
              "certificateType": this.ruleForm.identyType,
              "fullTimeNumber": this.ruleForm.memberNum,
              "idNo": this.ruleForm.identyNo,
              "invoiceType": this.ruleForm.paperType,
              "location": this.ruleForm.province+' '+this.ruleForm.city+' '+this.ruleForm.area,
              "partTimeType": this.ruleForm.partTimeType.toString(),
              "primaryContactEmail": this.ruleForm.primaryEmail,
              "primaryContactMobile": this.ruleForm.primaryPhone,
              "primaryContactName": this.ruleForm.primaryPeople,
              "remarks": this.ruleForm.teamRemark,
              "teamName": this.ruleForm.teamName,
              "typesOfTaxPayment": this.ruleForm.taxType,
              "unifiedSocialCreditCode": this.ruleForm.socialCode
            };
            Object.assign(teamGreenChannelParam, {
              languageInfoLst: languageInfoLst
            });
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http.post('/team/addTeamBackground',teamGreenChannelParam)
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '创建成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/parttimeTeam/preTeam')
                  }, 1000);
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  });
                }
                this.btn.disabled = false;
                this.btn.txt = '提 交';
              });
          }
        })
      }
    }
  }
</script>
