<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="译员手机：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="phone">
                <el-input v-model="ruleForm.phone" clearable placeholder="请输入译员手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-left: 10px;color: #999;font-size: 12px">注：该手机号将为译员的登录账号</el-col>
          </el-form-item>
          <el-form-item label="真实姓名：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="realName">
                <el-input v-model="ruleForm.realName" clearable placeholder="请输入译员真实姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="语言信息（必填）" style="margin-bottom: 0px">
            <el-button type="success" icon="el-icon-plus" @click="addLan">添加语言</el-button>
          </el-form-item>
          <div class="lan-item" v-for="(item, index) in ruleForm.language" :key="index">
            <el-form-item label="语言：" required style="margin-bottom: -10px">
              <el-col :span="11">
                <el-form-item
                  :prop="'language.'+index+'.lan'"
                  :rules="{
                    required: true, message: '请选择语言', trigger: 'change'
                  }">
                  <el-select class="exact" v-model="item.lan" placeholder="请选择语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-button type="text" icon="el-icon-plus" @click="addLanPair(index)">添加语言对</el-button>
              </el-col>
              <el-col :span="2" style="text-align: right">
                <el-button type="text" class="del" v-if="index>0" @click="deleteLan(index)">删除</el-button>
              </el-col>
            </el-form-item>
            <div class="gr-item-list">
              <div class="gr-item" v-for="(item1, index1) in item.list">
                <el-form-item :label="'语言对'+ (index1+1) +'：'" required style="margin-bottom: 0px">
                  <el-col :span="11">
                    <el-form-item
                      :prop="'language.'+index+'.list.'+index1+'.origin'"
                      :rules="{
                        required: true, message: '请选择原文语言', trigger: 'change'
                      }">
                      <el-select class="exact" v-model="item1.origin" placeholder="原文语言">
                        <el-option
                          v-for="lg in $store.state.languageList"
                          :key="lg.id"
                          :label="lg.chineseName"
                          :value="lg.chineseName+','+lg.englishName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" style="text-align: center">-</el-col>
                  <el-col :span="10">
                    <el-form-item
                      :prop="'language.'+index+'.list.'+index1+'.target'"
                      :rules="{
                        required: true, message: '请选择译文语言', trigger: 'change'
                      }">
                      <el-select class="exact" v-model="item1.target" placeholder="译文语言">
                        <el-option
                          v-for="lg in $store.state.languageList"
                          :key="lg.id"
                          :label="lg.chineseName"
                          :value="lg.chineseName+','+lg.englishName">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button type="text" class="del" v-if="index1>0" @click="deleteLanPair(index, index1)">删除</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item class="exact field"
                              label="行业领域："
                              :prop="'language.'+index+'.list.'+index1+'.field'"
                              :rules="{
                                type: 'array', required: true, message: '请选择行业领域', trigger: 'change'
                              }">
                  <el-checkbox-group v-model="item1.field" :max="5" :min="1">
                    <el-checkbox v-for="fd in formSelect.fieldOptions"
                                 :key="fd.id"
                                 :value="fd.id"
                                 :label="fd.id+','+fd.fullSpecialtyName"
                                 :name="'language.'+index+'.field'+index1">{{fd.fullSpecialtyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="译员等级："
                  :prop="'language.'+index+'.list.'+index1+'.level'"
                  :rules="{
                    required: true, message: '请选择译员等级', trigger: 'change'
                  }">
                  <el-col :span="11">
                    <el-select class="exact" v-model="item1.level" placeholder="请选择该语种等级">
                      <el-option
                        v-for="lv in formSelect.levelOptions"
                        :key="lv"
                        :label="lv"
                        :value="lv">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </div>
            </div>
          </div>
          <el-form-item label="基本信息（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="in-item">
            <el-form-item label="译员昵称：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-input v-model="ruleForm.baseInfo.nickName" clearable placeholder="请设置译员昵称"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="国籍：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-select class="exact" v-model="ruleForm.baseInfo.national" placeholder="请选择国籍">
                    <el-option
                      v-for="item in formSelect.nationalOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="母语：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-select class="exact" v-model="ruleForm.baseInfo.language" placeholder="请选择母语">
                    <el-option
                      v-for="item in $store.state.languageList"
                      :key="item.id"
                      :label="item.chineseName"
                      :value="item.chineseName">
                    </el-option>
                  </el-select>
                </el-form-item>
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
          </div>
          <el-form-item label="学历信息（选填）" style="margin-bottom: 0px"></el-form-item>
          <div class="xl-item">
            <el-form-item label="毕业院校：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item prop="school">
                  <el-input v-model="ruleForm.recordInfo.school" clearable placeholder="请输入译员毕业院校"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="padding-left: 5px">
                <el-form-item>
                  <el-select class="exact" v-model="ruleForm.recordInfo.schoolType">
                    <el-option key="国内" label="国内" value="国内"></el-option>
                    <el-option key="国外" label="国外" value="国外"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="专业：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-input v-model="ruleForm.recordInfo.major" clearable placeholder="请输入译员专业"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="学历：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-select class="exact" v-model="ruleForm.recordInfo.record" placeholder="请选择学历">
                    <el-option
                      v-for="item in formSelect.recordOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
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
            <el-form-item label="证件类型：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-select class="exact" v-model="ruleForm.identyInfo.identyType" placeholder="请选择证件类型">
                    <el-option
                      v-for="item in formSelect.cardOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="证件号码：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item>
                  <el-input v-model="ruleForm.identyInfo.identyNo" clearable placeholder="请输入译员证件号码"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
		  <el-form-item label="备注：" style="margin: 20px 0">
			 <el-input type="textarea" v-model="ruleForm.remark" clearable placeholder="请输入备注信息"></el-input>
		  </el-form-item>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button @click="$router.push('/interpreter/partTime')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/utils'
  export default {
    data() {
      return {
        isPass: {
          baseInfo: true,
          recordInfo: true,
          identyInfo: true
        },
        ruleForm: {
          phone: '',
          realName: '',
          language: [
            {
              lan: '',
              list: [
                {
                  origin: '',
                  target: '',
                  field: [],
                  level: ''
                }
              ]
            }
          ],
          //学历信息
          baseInfo: {
            nickName: '',
            national: '中国',
            language: '中文 - 中国',
            transYear: ''
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
            identyType: '身份证',
            identyNo: ''
          },
		      remark: ''
        },
        formSelect: {
          fieldOptions: [],
          levelOptions:['P1','P2','P3','P4','P5','P6','P7','P8','P9'],
          nationalOptions: ['中国'],
          cardOptions: ['身份证','护照'],
          recordOptions: ['博士','硕士','本科','大专','其他'],
          transYearOptions:['1年以内','1-3年','3-5年','5年-10年','10年以上']
        },
        rules: {
          phone: [
            { required: true, message: '请输入译员手机号', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请输入译员真实姓名', trigger: 'blur' }
          ]
        },
        btn: {
          disabled: false,
          txt: '提 交'
        }
      };
    },
    created (){
      this.getFirstField().then(res => {
        this.formSelect.fieldOptions = res
      })
    },
    methods: {
      //添加语言
      addLan (){
        if(this.ruleForm.language.length < 2){
          this.ruleForm.language.push({
            lan: '',
            list: [
              {
                origin: '',
                target: '',
                field: [],
                level: ''
              }
            ]
          })
        }else{
          this.$message({
            type: 'warning',
            message: '最多添加两种语言'
          })
        }
      },
      //删除语言
      deleteLan (idx){
        this.ruleForm.language.splice(idx,1);
      },
      //添加语言对
      addLanPair (idx){
        if(this.ruleForm.language[idx].list.length < 2){
          this.ruleForm.language[idx].list.push({
            origin: '',
            target: '',
            field: [],
            level: ''
          });
        }else{
          this.$message({
            type: 'warning',
            message: '最多添加两种语言对'
          })
        }
      },
      //删除语言对
      deleteLanPair (idx, idx2){
        this.ruleForm.language[idx].list.splice(idx2,1);
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!/^1[1-9][0-9]{9}$/.test(this.ruleForm.phone)){
              this.$message({
                type: 'warning',
                message: '请填写正确的手机号'
              });
              return false;
            }
            const languageArr = [];
            this.ruleForm.language.forEach(item => {
              const obj = {};
              const detailArr = [];
              item.list.forEach(item1 => {
                const obj1 = {};
                if(item1.origin === item1.target){
                  this.$message({
                    type: 'warning',
                    message: '语言对原、译文不能相同'
                  });
                  return false;
                }
                obj1.sourceLanguageCode = item1.origin.split(',')[1];
                obj1.sourceLanguageName = item1.origin.split(',')[0];
                obj1.targetLanguageCode = item1.target.split(',')[1];
                obj1.targetLanguageName = item1.target.split(',')[0];
                obj1.levelCode = item1.level.slice(1);
                obj1.levelName = item1.level;
                obj1.areaIds = '';
                obj1.areaNames = '';
                item1.field.forEach(fd => {
                  obj1.areaIds += fd.split(',')[0] + ',';
                  obj1.areaNames += fd.split(',')[1] + ',';
                });
                obj1.areaIds = obj1.areaIds.slice(0, -1);
                obj1.areaNames = obj1.areaNames.slice(0, -1);
                detailArr.push(obj1);
              });
              obj.languageDetailList = detailArr;
              obj.languageName = item.lan.split(',')[0];
              obj.languageCode = item.lan.split(',')[1];
              languageArr.push(obj);
            });
            if(this.ruleForm.baseInfo.nickName.trim() !== '' || this.ruleForm.baseInfo.transYear !== ''){
              if(!utils.validateObj(this.ruleForm.baseInfo)){
                this.$message({
                  type: 'warning',
                  message: '请完整填写基本信息'
                });
                return false;
              }
            }
            if(this.ruleForm.recordInfo.school.trim() !== ''
              || this.ruleForm.recordInfo.major.trim() !== ''
              || this.ruleForm.recordInfo.record !== ''
              || this.ruleForm.recordInfo.graduateTime !== ''){
              if(!utils.validateObj(this.ruleForm.recordInfo)){
                this.$message({
                  type: 'warning',
                  message: '请完整填写学历信息'
                });
                return false;
              }
            }
            if(this.ruleForm.identyInfo.identyNo.trim() !== '' &&
              !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.ruleForm.identyInfo.identyNo)){
              this.$message({
                type: 'warning',
                message: '请填写正确的身份证号'
              });
              return false;
            }
            const sendData = {
              staffTel: this.ruleForm.phone,
              realName: this.ruleForm.realName,
              languageInfoLst: languageArr,
              nickName: '',
              nationality: '',
              motherTongue: '',
              translateYear: '',
              graduatedSchoolName: '',
              schoolType: '',
              degree: '',
              major: '',
              graduatedDate: '',
              certificateType: '',
              certificateNum: '',
              remark: this.ruleForm.remark
            };
            if(utils.validateObj(this.ruleForm.baseInfo)){
              Object.assign(sendData, {
                nickName: this.ruleForm.baseInfo.nickName,
                nationality: this.ruleForm.baseInfo.national,
                motherTongue: this.ruleForm.baseInfo.language,
                translateYear: this.ruleForm.baseInfo.transYear
              })
            }
            if(utils.validateObj(this.ruleForm.recordInfo)){
              Object.assign(sendData, {
                graduatedSchoolName: this.ruleForm.recordInfo.school,
                schoolType: this.ruleForm.recordInfo.schoolType,
                degree: this.ruleForm.recordInfo.record,
                major: this.ruleForm.recordInfo.major,
                graduatedDate: this.ruleForm.recordInfo.graduateTime
              })
            }
            if(utils.validateObj(this.ruleForm.identyInfo)){
              Object.assign(sendData, {
                certificateType: this.ruleForm.identyInfo.identyType,
                certificateNum: this.ruleForm.identyInfo.identyNo
              })
            }
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http.post('/greenChannel/savePartTimeStaffByGreenChannel',sendData)
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '译员提交成功'
                  });
                  setTimeout(()=>{
                    this.$router.push('/interpreter/partTime');
                  },1000);
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
  .gr-item-list>div.gr-item{
    padding: 5px 0;
    margin: 10px 0;
    border-bottom: 1px solid #eee;
    &:last-child{
      border-bottom: none;
    }
  }
  .lan-item{
    padding-top: 15px;
    padding-right: 10px;
    background-color: #fff;
    border-radius: 3px;
  }
  .in-item,.xl-item,.sf-item{
    padding: 12px 0;
    background-color: #fff;
    border-radius: 3px;
    & .el-select.exact{
      width: 100%!important;
    }
  }
  .el-form-item.exact.field{
    margin-bottom: 15px!important;
  }
</style>
