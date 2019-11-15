<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="用户帐号：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="phone">
                <el-input v-model="ruleForm.phone" clearable placeholder="请输入手机号/邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-left: 10px;color: #999;font-size: 12px">注：该用户帐号为译员的登录账号</el-col>
          </el-form-item>
          <el-form-item label="真实姓名：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'realName'"
                            :rules="{ required: true, message: '请输入译员真实姓名', trigger: 'blur' }">
                <el-input v-model="ruleForm.realName" clearable placeholder="请输入译员真实姓名"></el-input>
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
                  <el-checkbox label="外派">外派</el-checkbox>
                  <el-checkbox label="培训">培训</el-checkbox>
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
                  <el-select class="exact" v-model="item.origin" placeholder="源语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName+','+lg.englishSimpleName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="10">
                  <el-select class="exact" v-model="item.target" placeholder="目标语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName+','+lg.englishSimpleName"></el-option>
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
                             v-model="item.firstField" placeholder="一级领域">
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
                             v-model="item.secondField" placeholder="二级领域">
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
          <el-form-item label="基本信息（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="in-item">
            <el-form-item label="译员昵称：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.baseInfo.nickName" clearable placeholder="请设置译员昵称"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="国籍：" required style="margin-bottom: 0px">
              <el-col :span="24">
                <select v-model="ruleForm.baseInfo.areaOther"
                        style="position: absolute; left: -9999px"
                        name="areaOther" id="areaOther"></select>
                <div class="areaPicker" style="margin: 5px 0 -5px;">
                  <select v-model="ruleForm.baseInfo.areaSandbar"
                          style="width: 148px"
                          name="areaSandbar" id="areaSandbar"></select>
                  <select v-model="ruleForm.baseInfo.areaNationality"
                          @change="selectNation(ruleForm.baseInfo.areaNationality)"
                          style="width: 148px"
                          name="areaNationality" id="areaNationality"></select>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label="母语：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.language" placeholder="请选择母语">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="翻译年限：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.transYear" placeholder="请选择翻译年限">
                  <el-option
                    v-for="item in formSelect.transYearOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="币种：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.currency" placeholder="请选择币种">
                  <el-option
                    v-for="item of formSelect.currencyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="常住地址：" required style="margin-bottom: 0px">
              <el-col :span="24">
                <div class="areaPicker">
                  <select v-model="ruleForm.baseInfo.province"
                          style="width: 148px"
                          @change="resetProvince"
                          name="deliverprovince" id="deliverprovince"></select>
                  <select v-model="ruleForm.baseInfo.city"
                          style="width: 148px"
                          name="delivercity" id="delivercity"></select>
                  <select v-model="ruleForm.baseInfo.area"
                          style="width: 150px"
                          name="deliverarea" id="deliverarea"></select>
                </div>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="学历信息（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="xl-item">
            <el-form-item label="毕业院校：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.recordInfo.school" clearable placeholder="请输入译员毕业院校"></el-input>
              </el-col>
              <el-col :span="4" style="padding-left: 5px">
                <el-select class="exact" v-model="ruleForm.recordInfo.schoolType">
                  <el-option key="国内" label="国内" value="国内"></el-option>
                  <el-option key="国外" label="国外" value="国外"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="专业：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.recordInfo.major" clearable placeholder="请输入译员专业"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="学历：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.recordInfo.record" placeholder="请选择学历">
                  <el-option
                    v-for="item in recordOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="毕业时间：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.recordInfo.graduateTime"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="请选择毕业时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="身份认证（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="sf-item">
            <el-form-item label="真实姓名：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.realName" disabled></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="证件类型：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.identyInfo.identyType" clearable placeholder="请选择证件类型">
                  <el-option
                    v-for="item in formSelect.cardOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="证件号码：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.identyInfo.identyNo" clearable placeholder="请输入译员证件号码"></el-input>
              </el-col>
            </el-form-item>
          </div>
		  <el-form-item label="备注：" style="margin: 20px 0;width: 50%">
			 <el-input type="textarea" v-model="ruleForm.remark" clearable placeholder="请输入备注信息"></el-input>
		  </el-form-item>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button @click="$router.push('/parttimeUser/preResource')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { isAllFill } from '@/common/filter';
  import { mapState } from 'vuex';
  import '@/common/area';
  export default {
    data() {
      let isPhone = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入用户账号'));
        }else if(!(this.regPhone.test(value) || this.regEmail.test(value))){
          return callback(new Error('请输入正确的手机/邮箱'));
        }
        callback();
      };
      return {
        ruleForm: {
          phone: '',
          realName: '',
          partTimeType: [],
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
          //学历信息
          baseInfo: {
            nickName: '',
            areaNationality: '',
            areaSandbar: '',
            areaOther: '',
            language: '中文简体',
            transYear: '',
            currency: '',
            province: '',
            city: '',
            area: ''
          },
          //学历信息
          recordInfo: {
            school: '',
            schoolType: '国内',
            record: '',
            major: '',
            graduateTime: ''
          },
          //身份认证
          identyInfo: {
            identyType: '',
            identyNo: ''
          },
		      remark: ''
        },
        formSelect: {
          currencyOptions: [
            {label: '人民币', value: 'CNY'},
            {label: '美元', value: 'USD'},
            {label: '欧元', value: 'Euro'},
            {label: '英镑', value: 'Pound'}
          ],
          cardOptions: ['身份证'],
          transYearOptions:['1年以内','1-3年','3-5年','5年-10年','10年以上']
        },
        rules: {
          phone: [{ validator: isPhone, trigger: ['blur', 'change'] }]
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
      ...mapState('select', {
        recordOptions: state => state.recordOptions
      }),
      ...mapState(['regPhone','regEmail','regCard'])
    },
    created (){
      //初始化地区插件
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea");
        new window._PCAS("areaOther", "areaSandbar", "areaNationality");
        setTimeout(() => {
          this.ruleForm.baseInfo.areaOther = '其它';
          setTimeout(() => {
            const event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            document.querySelector('#areaOther').dispatchEvent(event);
            this.ruleForm.baseInfo.areaSandbar = '亚洲';
            this.ruleForm.baseInfo.areaNationality = '中国大陆';
          }, 500)
        }, 10)
      })
    },
    methods: {
      isAllFill: isAllFill,
      resetProvince (){
        this.ruleForm.baseInfo.city = '';
        this.ruleForm.baseInfo.area = '';
      },
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
      //选择国籍为“中国大陆”，只能选身份证
      selectNation (val){
        if(val === '中国大陆'){
          this.formSelect.cardOptions = ['身份证'];
        }else{
          this.formSelect.cardOptions = ['身份证','港澳通行证','往来台湾通行证','护照'];
        }
        this.ruleForm.identyInfo.identyType = '';
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const languageInfoLst = [];
            const lan = this.ruleForm.language;
            if(this.ruleForm.partTimeType.includes('笔译')){
              const uniqueArr = [];
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
                    message: '请选择不同的语言对'
                  });
                  return false;
                }
                if(uniqueArr.includes(item.origin+item.target+item.firstField)){
                  this.$message({
                    type: 'warning',
                    message: '请选择不同的语言信息'
                  });
                  return false;
                }
                uniqueArr.push(item.origin+item.target+item.firstField);
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
                  "originLanguageSimpleCode": item.origin.split(',')[2],
                  "originLanguageCode": item.origin.split(',')[1],
                  "originLanguageName": item.origin.split(',')[0],
                  "subDomain": JSON.stringify(item.secondField),
                  "subDomainId": JSON.stringify(secondFieldIds),
                  "targetLanguageSimpleCode": item.target.split(',')[2],
                  "targetLanguageCode": item.target.split(',')[1],
                  "targetLanguageName": item.target.split(',')[0]
                };
                languageInfoLst.push(obj);
              }
            }
            const tempBaseInfo = {
              name: this.ruleForm.baseInfo.nickName,
              year: this.ruleForm.baseInfo.transYear,
              currency: this.ruleForm.baseInfo.currency,
              province: this.ruleForm.baseInfo.province || '',
              city: this.ruleForm.baseInfo.city || '',
              area: this.ruleForm.baseInfo.area || ''
            };
            const tempRecordInfo = {...this.ruleForm.recordInfo};
            delete tempRecordInfo.schoolType;
            if(!this.isAllFill(tempBaseInfo)){
              this.$message({
                type: 'warning',
                message: '请完善基本信息'
              });
              return false;
            }
            if(!this.isAllFill(tempRecordInfo)){
              this.$message({
                type: 'warning',
                message: '请完善学历信息'
              });
              return false;
            }
            if(!this.isAllFill(this.ruleForm.identyInfo)){
              this.$message({
                type: 'warning',
                message: '请完善身份信息'
              });
              return false;
            }
            const greenChannelParam = {
              "skillType": this.ruleForm.partTimeType.toString(),
              "certificateNum": this.ruleForm.identyInfo.identyNo,
              "certificateType":  this.ruleForm.identyInfo.identyType,
              "degree": this.ruleForm.recordInfo.record,
              "graduatedDate": this.ruleForm.recordInfo.graduateTime,
              "graduatedSchoolName": this.ruleForm.recordInfo.school,
              "major": this.ruleForm.recordInfo.major,
              "motherTongue": this.ruleForm.baseInfo.nickName ? this.ruleForm.baseInfo.language : '',
              "nationality": this.ruleForm.baseInfo.nickName ? this.ruleForm.baseInfo.areaSandbar+' '+this.ruleForm.baseInfo.areaNationality : '',
              "nickName": this.ruleForm.baseInfo.nickName,
              "realName": this.ruleForm.realName,
              "remark": this.ruleForm.remark,
              "schoolType": this.ruleForm.recordInfo.school ? this.ruleForm.recordInfo.schoolType:'',
              "staffTel": this.ruleForm.phone,
              "currencyCode": this.ruleForm.baseInfo.currency,
              "currencyName": (this.formSelect.currencyOptions.find(item => {
                return item.value === this.ruleForm.baseInfo.currency
              }) || {label: ''}).label,
              "province": this.ruleForm.baseInfo.province || '',
              "city": this.ruleForm.baseInfo.city || '',
              "county": this.ruleForm.baseInfo.area || '',
              "translateYear": this.ruleForm.baseInfo.transYear
            };
            Object.assign(greenChannelParam, {
              languageInfoLst: languageInfoLst
            });
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http.post('/greenChannel/savePartTimeStaffByGreenChannel', greenChannelParam)
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '创建成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/parttimeUser/preResource')
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
<style lang="scss">
  .el-form-item.exact.field{
    margin-bottom: 15px!important;
  }
</style>
