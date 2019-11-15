<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="125px" class="demo-ruleForm resource">
          <h3>订单信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：" :prop="'projectName'" :rules="{ required: true, message: '请输入项目名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.projectName" clearable placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称：" :prop="'customerName'" :rules="{ required: true, message: '请输入客户名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerName"
                          @click.native="showCustomer"
                          :disabled="isModify"
                          readonly placeholder="请输入客户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售经理：">
                <el-input v-model="ruleForm.saleManager" disabled placeholder="请先选择客户"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目日期：" :prop="'projectTime'" :rules="{ required: true, message: '请选择项目日期', trigger: 'blur' }">
                <el-date-picker
                  v-model="ruleForm.projectTime"
                  type="daterange"
                  :unlink-panels="true"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目地点：" :prop="'projectPlace'" :rules="{ required: true, message: '请输入项目地点', trigger: 'blur' }">
                <el-input v-model="ruleForm.projectPlace" clearable placeholder="请输入项目地点"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="wd-el-50">
              <el-form-item label="专业领域：" required>
                <el-col :span="12">
                  <el-form-item :prop="'field'" :rules="{ required: true, message: '请选择一级领域', trigger: 'change' }">
                    <el-select
                      @change="selectSecondField"
                      v-model="ruleForm.field" placeholder="一级领域">
                      <el-option v-for="item in $store.state.fieldOptions"
                                 :key="item.id"
                                 :label="item.fullSpecialtyName"
                                 :value="item.fullSpecialtyName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'secondField'" :rules="{ required: true, message: '请选择二级领域', trigger: 'change' }">
                    <el-select v-model="ruleForm.secondField" placeholder="二级领域">
                      <el-option v-for="item in formSelect.secondOptions"
                                 :key="item.id"
                                 :label="item.fullSpecialtyName"
                                 :value="item.fullSpecialtyName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="交付日期：" :prop="'deliveryTime'" :rules="{ required: true, message: '请选择交付日期', trigger: 'blur' }">
                <el-date-picker
                  v-model="ruleForm.deliveryTime"
                  type="date" value-format="yyyy-MM-dd" placeholder="请选择交付日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户项目状态：" :prop="'resourceCusStatus'" :rules="{ required: true, message: '请选择客户项目状态', trigger: 'blur' }">
                <el-select v-model="ruleForm.resourceCusStatus" placeholder="请选择客户项目状态">
                  <el-option v-for="item in resourceCusStatusOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所需服务：" :prop="'resourceService'" :rules="{ required: true, message: '请选择所需服务', trigger: 'blur' }">
                <el-select v-model="ruleForm.resourceService" placeholder="请选择所需服务">
                  <el-option v-for="item in resourceServiceOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="wd-el-50">
              <el-form-item label="语言对：" required>
                <el-col :span="12">
                  <el-form-item :prop="'origin'" :rules="{ required: true, message: '请选择源语言', trigger: 'change' }">
                    <el-select v-model="ruleForm.origin" placeholder="源语言">
                      <el-option v-for="item in $store.state.languageList"
                                 :key="item.id"
                                 :label="item.chineseName"
                                 :value="item.chineseName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'target'" :rules="{ required: true, message: '请选择目标语言', trigger: 'change' }">
                    <el-select v-model="ruleForm.target" placeholder="目标语言">
                      <el-option v-for="item in $store.state.languageList"
                                 :key="item.id"
                                 :label="item.chineseName"
                                 :value="item.chineseName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所需人数：" :prop="'needPersonNum'" :rules="{ required: true, message: '请输入所需人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.needPersonNum" type="number" clearable placeholder="请输入所需人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目时长：" :prop="'projectLongTime'" :rules="{ required: true, message: '请输入项目时长', trigger: 'blur' }">
                <el-input v-model="ruleForm.projectLongTime" clearable placeholder="请输入项目时长"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户报价：" :prop="'customerPrice'" :rules="{ required: true, message: '请输入客户报价', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerPrice" clearable placeholder="请输入客户报价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务人数：">
                <el-input v-model="ruleForm.serviceNum" type="number" clearable placeholder="请输入服务人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简历要求：" :prop="'resume'" :rules="{ required: true, message: '请选择简历要求', trigger: 'change' }">
                <el-select v-model="ruleForm.resume" placeholder="请选择简历要求">
                  <el-option value="中文简历" label="中文简历"></el-option>
                  <el-option value="英文简历" label="英文简历"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="会议规模：" :prop="'meetingScale'" :rules="{ required: true, message: '请输入会议规模', trigger: 'blur' }">
                <el-input v-model="ruleForm.meetingScale" clearable placeholder="请输入会议规模"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他：">
                <el-input v-model="ruleForm.other" type="textarea" clearable placeholder="请输入其他"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="padding-left: 130px;padding-top: 2rem">
          <el-button type="success"
                     @click="submitForm('ruleForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
          <el-button @click="$router.push('/resource/meeting')">取 消</el-button>
        </div>
      </div>
    </div>
    <customer-list ref="customerList" @saleMg="updateSaleMg"></customer-list>
  </div>
</template>
<script>
  import customerList from '../component/customerList_modal';
  import { mapState, mapGetters } from 'vuex';
  export default {
    components: {
      'customer-list': customerList
    },
    data() {
      return {
        isModify: false,
        ruleForm: {
          department: '',
          projectName: '',
          projectPlace: '',
          projectTime: '',
          projectLongTime: '',
          field: '',
          secondField: '',
          origin: '',
          target: '',
          customerName: '',
          customerCode: '',
          saleManager: '',
          saleManagerCode: '',
          deliveryTime: '',
          resourceService: '同声传译',
          needPersonNum: '',
          serviceNum: '',
          resourceCusStatus: '0',
          customerPrice: '',
          resume: '中文简历',
          meetingScale: '',
          other: ''
        },
        formSelect: {
          secondOptions: []
        },
        btn: {
          disabled: false,
          txt: '确认下单'
        }
      };
    },
    computed: {
      ...mapState('select', {
        resourceCusStatusOptions: state => state.resourceWpCusStatus,
        resourceServiceOptions: state => state.resourceTrainService
      }),
      ...mapState(['userInfo'])
    },
    created (){
      //路由为“修改”时，获取详情信息，填充form
      if(this.$route.fullPath.includes('modify')){
        this.isModify = true;
        this.btn.txt = '提交修改';
        this.getDetailData();
      }
    },
    methods: {
      //获取二级领域
      async selectSecondField (name){
        const result = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === name;
        });
        const sid = result.specialtyId || '';
        this.ruleForm.secondField = '';
        this.formSelect.secondOptions = [];
        return await this.getSecondField(sid).then(res => {
          this.formSelect.secondOptions = res;
          return 'success';
        });
      },
      //获取客户列表
      showCustomer (){
        if(this.isModify) {
          return null
        }
        this.$store.commit('showModal');
        this.$refs.customerList.showTableList()
      },
      //更新销售经理
      updateSaleMg (data){
        this.ruleForm.saleManager = data.sale;
        this.ruleForm.saleManagerCode = data.saleCode;
        this.ruleForm.customerName = data.customer;
        this.ruleForm.customerCode = data.customerCode;
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'POST',
              apiUrl = '/resourceOrder/addExhibitionOrder',
              meetingData = {
                department: '',
                projectName: this.ruleForm.projectName,
                domain: this.ruleForm.field,
                subDomain: this.ruleForm.secondField,
                sourceLanguage: this.ruleForm.origin,
                sourceLanguageCode: this.$store.state.mapLanguageListN_C[this.ruleForm.origin] || '',
                targetLanguage: this.ruleForm.target,
                targetLanguageCode: this.$store.state.mapLanguageListN_C[this.ruleForm.target] || '',
                customerName: this.ruleForm.customerName,
                customerId: this.ruleForm.customerCode,
                projectManager: this.ruleForm.saleManager,
                projectManagerCode: this.ruleForm.saleManagerCode || '',
                customerQuote: this.ruleForm.customerPrice,
                deliveryTime: this.ruleForm.deliveryTime ? this.ruleForm.deliveryTime+' 00:00:00' : '',
                startTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[0]+' 00:00:00' : '',
                endTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[1]+' 00:00:00' : '',
                resumeRequired: this.ruleForm.resume,
                servicePersonNumber: this.ruleForm.serviceNum,
                requiredService: this.ruleForm.resourceService,
                customerProjectStatus: this.ruleForm.resourceCusStatus,
                projectPlace: this.ruleForm.projectPlace,
                projectDuration: this.ruleForm.projectLongTime,
                requiredPersonNumber: this.ruleForm.needPersonNum,
                meetingScale: this.ruleForm.meetingScale,
                otherDesc: this.ruleForm.other
              };
            if(this.isModify){
              method = 'PUT';
              apiUrl = '/resourceOrder/editExhibitionOrder';
              Object.assign(meetingData, {
                id: this.$route.params.id,
                department: this.ruleForm.department
              })
            }
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http({
              method: method,
              url: apiUrl,
              data: this.$qs.stringify(meetingData)
            }).then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/resource/meeting')
                  }, 1000);
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  });
                }
                this.btn.disabled = false;
                this.btn.txt = this.isModify?'提交修改':'确认下单';
              });
          }
        })
      },
      //获取详情数据
      getDetailData() {
        this.$http.get('/resourceOrder/getExhibitionOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.ruleForm = {
              department: _data.department,
              projectName: _data.projectName,
              projectPlace: _data.projectPlace,
              projectTime: _data.startTime?[_data.startTime.split(' ')[0],_data.endTime.split(' ')[0]]: '',
              projectLongTime: _data.projectDuration,
              field: _data.domain,
              secondField: '',
              origin: _data.sourceLanguage,
              target: _data.targetLanguage,
              customerName: _data.customerName,
              customerCode: _data.customerId,
              saleManager: _data.projectManager,
              saleManagerCode: _data.projectManagerCode,
              deliveryTime: _data.deliveryTime?_data.deliveryTime.split(' ')[0]:'',
              resourceService: _data.requiredService,
              needPersonNum: _data.requiredPersonNumber,
              serviceNum: _data.servicePersonNumber,
              resourceCusStatus: _data.customerProjectStatus,
              customerPrice: _data.customerQuote,
              resume: _data.resumeRequired,
              meetingScale: _data.meetingScale,
              other: _data.otherDesc
            };
            this.selectSecondField(_data.domain).then(() => {
              this.ruleForm.secondField = _data.subDomain;
            })
          }
        })
      }
    }
  }
</script>
