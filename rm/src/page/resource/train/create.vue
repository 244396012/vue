<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="135px" class="demo-ruleForm resource">
          <h3>订单信息</h3>
          <el-row v-if="isModify">
            <el-col :span="8">
              <el-form-item label="项目编号：">
                <el-input v-model="detail.projectNo" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
              <el-form-item label="教务主管：" :prop="'teachManager'" :rules="{ required: true, message: '请输入教务主管', trigger: 'blur' }">
                <el-input v-model="ruleForm.teachManager" :disabled="isModify" clearable placeholder="请输入教务主管"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="语种类别：" :prop="'language'" :rules="{ required: true, message: '请选择语种类别', trigger: 'change' }">
                <el-select v-model="ruleForm.language" placeholder="请选择语种类别">
                  <el-option v-for="item in $store.state.languageList"
                             :key="item.id"
                             :label="item.chineseName"
                             :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目周期：" :prop="'projectTime'" :rules="{ required: true, message: '请选择项目日期', trigger: 'blur' }">
                <el-date-picker
                  v-model="ruleForm.projectTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目地点：" :prop="'projectPlace'" :rules="{ required: true, message: '请输入项目地点', trigger: 'blur' }">
                <el-input v-model="ruleForm.projectPlace" clearable placeholder="请输入项目地点"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业领域：" :prop="'field'" :rules="{ required: true, message: '请选择专业领域', trigger: 'change' }">
                <el-select v-model="ruleForm.field" placeholder="请选择专业领域">
                    <el-option label="基础语言类" value="基础语言类"></el-option>
                    <el-option label="商务语言类" value="商务语言类"></el-option>
                    <el-option label="专业语言类" value="专业语言类"></el-option>
                    <el-option label="文化风俗类" value="文化风俗类"></el-option>
                    <el-option label="商务礼仪类" value="商务礼仪类"></el-option>
                    <el-option label="陪同口译" value="陪同口译"></el-option>
                    <el-option label="会议口译" value="会议口译"></el-option>
                    <el-option label="同声传译" value="同声传译"></el-option>
                    <el-option label="翻译技巧类-笔译" value="翻译技巧类-笔译"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目状态：" :prop="'resourceProStatus'" :rules="{ required: true, message: '请选择项目状态', trigger: 'blur' }">
                <el-select v-model="ruleForm.resourceProStatus" placeholder="请选择项目状态">
                  <el-option v-for="item in resourceProStatusOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="简历要求：" :prop="'resume'" :rules="{ required: true, message: '请选择简历要求', trigger: 'change' }">
                <el-select v-model="ruleForm.resume" placeholder="请选择简历要求">
                  <el-option value="中文简历" label="中文简历"></el-option>
                  <el-option value="英文简历" label="英文简历"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="培训时段：" :prop="'trainTimeScale'" :rules="{ required: true, message: '请输入培训时段', trigger: 'blur' }">
                <el-input v-model="ruleForm.trainTimeScale" clearable placeholder="请输入培训时段"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证书要求：" :prop="'certificateNeed'" :rules="{ required: true, message: '请输入证书要求', trigger: 'blur' }">
                <el-input v-model="ruleForm.certificateNeed" clearable placeholder="请输入证书要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="培训类型：" :prop="'trainType'" :rules="{ required: true, message: '请选择培训类型', trigger: 'change' }">
                <el-select v-model="ruleForm.trainType" placeholder="请选择培训类型">
                  <el-option value="面授" label="面授"></el-option>
                  <el-option value="线上" label="线上"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所需人数：" :prop="'needPersonNum'" :rules="{ required: true, message: '请输入所需人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.needPersonNum" type="number" clearable placeholder="请输入所需人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户报价或报价：" :prop="'customerPrice'" :rules="{ required: true, message: '请输入客户报价', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerPrice" clearable placeholder="请输入客户报价"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否预约：" :prop="'isOrder'" :rules="{ required: true, message: '请选择是否预约', trigger: 'change' }">
                <el-select v-model="ruleForm.isOrder" placeholder="请选择是否预约">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="具体时间：" :prop="'detailTime'" :rules="{ required: true, message: '请选择具体时间', trigger: 'blur' }">
                <el-date-picker v-model="ruleForm.detailTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择具体时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding: 5px 0">
              <el-form-item label="工作内容：" :prop="'detailCnt'" :rules="{ required: true, message: '请输入工作内容', trigger: 'blur' }">
                <el-input v-model="ruleForm.detailCnt" type="textarea" clearable placeholder="请输入工作内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" style="padding: 5px 0">
              <el-form-item label="老师要求：" :prop="'teacherRequired'" :rules="{ required: true, message: '请输入老师要求', trigger: 'blur' }">
                <el-input v-model="ruleForm.teacherRequired" type="textarea" clearable placeholder="请输入老师要求"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="具体地点：" :prop="'detailPlace'" :rules="{ required: true, message: '请输入具体地点', trigger: 'blur' }">
                <el-input v-model="ruleForm.detailPlace" type="textarea" clearable placeholder="请输入具体地点"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他备注：">
                <el-input v-model="ruleForm.other" type="textarea" clearable placeholder="请输入其他"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="padding-left: 130px;padding-top: 2rem">
          <el-button type="success"
                     @click="submitForm('ruleForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
          <el-button @click="$router.push('/resource/train')">取 消</el-button>
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
        detail: {},
        ruleForm: {
          projectName: '',
          projectPlace: '',
          projectTime: '',
          teachManager: '',
          field: '',
          language: '',
          trainTimeScale: '',
          certificateNeed: '',
          customerName: '',
          saleManager: '',
          detailTime: '',
          needPersonNum: '',
          isOrder: 'true',
          resourceProStatus: '0',
          customerPrice: '',
          trainType: '面授',
          resume: '中文简历',
          detailPlace: '',
          teacherRequired: '',
          detailCnt: '',
          other: ''
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
        resourceProStatusOptions: state => state.resourceProStatus,
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
      //获取客户列表
      showCustomer (){
        if(this.isModify){
          return null
        }
        this.$store.commit('showModal');
        this.$refs.customerList.showTableList()
      },
      //更新销售经理
      updateSaleMg (data){
        this.ruleForm.saleManager = data.sale;
        this.ruleForm.customerName = data.customer;
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'POST',
              apiUrl = '/resourceOrder/addTrainingOrder',
              trainData = {
                department: this.userInfo.department,
                projectName: this.ruleForm.projectName,
                projectStatus: this.ruleForm.resourceProStatus,
                projectCity: this.ruleForm.projectPlace,
                certificateRequirement: this.ruleForm.certificateNeed,
                academicDirector: this.ruleForm.teachManager,
                customerName: this.ruleForm.customerName,
                saleManager: this.ruleForm.saleManager,
                customerQuote: this.ruleForm.customerPrice,
                startTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[0]+' 00:00:00' : '',
                endTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[1]+' 00:00:00' : '',
                speicalTime: this.ruleForm.detailTime ? this.ruleForm.detailTime+' 00:00:00' : '',
                isReservation: this.ruleForm.isOrder,
                languageType: this.ruleForm.language,
                professionalDoamin: this.ruleForm.field,
                requirePersons: this.ruleForm.needPersonNum,
                resumeRequirement: this.ruleForm.resume,
                specialPlace: this.ruleForm.detailPlace,
                trainingDuration: this.ruleForm.trainTimeScale,
                trainingType: this.ruleForm.trainType,
                workContent: this.ruleForm.detailCnt,
                teacherRequirement: this.ruleForm.teacherRequired,
                otherDesc: this.ruleForm.other
              };
            if(this.isModify){
              method = 'PUT';
              apiUrl = '/resourceOrder/editTrainingOrder';
              Object.assign(trainData, {
                id: this.$route.params.id
              })
            }
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http({
              method: method,
              url: apiUrl,
              data: this.$qs.stringify(trainData)
            }).then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/resource/train')
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
        this.$http.get('/resourceOrder/getTrainingOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.detail = {
              projectNo: _data.projectNo
            };
            this.ruleForm = {
              projectName: _data.projectName,
              projectPlace: _data.projectCity,
              projectTime: _data.startTime?[_data.startTime.split(' ')[0],_data.endTime.split(' ')[0]]: '',
              teachManager: _data.academicDirector,
              field: _data.professionalDoamin,
              language: _data.languageType,
              trainTimeScale: _data.trainingDuration,
              certificateNeed: _data.certificateRequirement,
              customerName: _data.customerName,
              saleManager: _data.saleManager,
              detailTime: _data.speicalTime?_data.speicalTime.split(' ')[0]:'',
              needPersonNum: _data.requirePersons,
              isOrder: _data.isReservation.toString(),
              resourceProStatus: _data.projectStatus,
              customerPrice: _data.customerQuote,
              trainType: _data.trainingType,
              resume: _data.resumeRequirement,
              detailPlace: _data.specialPlace,
              teacherRequired: _data.teacherRequirement,
              detailCnt: _data.workContent,
              other: _data.otherDesc
            };
          }
        })
      }
    }
  }
</script>
