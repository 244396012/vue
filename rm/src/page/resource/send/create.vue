<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="125px" class="demo-ruleForm resource">
          <h3>订单信息</h3>
          <el-row v-if="isModify">
            <el-col :span="8">
              <el-form-item label="项目编号：">
                <el-input v-model="detail.projectNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单时间：">
                <el-input v-model="detail.orderTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属部门：">
                <el-input v-model="detail.department" disabled></el-input>
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
            <el-col :span="8">
              <el-form-item label="客户名称："  :prop="'customerName'" :rules="{ required: true, message: '请输入客户名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerName"
                          @click.native="showCustomer"
                          :disabled="isModify"
                          readonly placeholder="请输入客户名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="销售经理：">
                <el-input v-model="ruleForm.saleManager" disabled placeholder="请先选择客户"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单人：">
                <el-input v-model="userInfo.name" disabled placeholder="请输入下单人"></el-input>
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
              <el-form-item label="客户角色：" :prop="'customerRole'" :rules="{ required: true, message: '请选择客户角色', trigger: 'change' }">
                <el-select v-model="ruleForm.customerRole" placeholder="请选择客户角色">
                  <el-option label="总包" value="总包"></el-option>
                  <el-option label="分包" value="分包"></el-option>
                  <el-option label="设计" value="设计"></el-option>
                  <el-option label="施工" value="施工"></el-option>
                  <el-option label="监理" value="监理"></el-option>
                  <el-option label="安装" value="安装"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户联系人部门：">
                <el-select v-model="ruleForm.contactRole" placeholder="请选择客户联系人部门">
                  <el-option label="人力资源部/主任" value="人力资源部/主任"></el-option>
                  <el-option label="项目管理部/主任" value="项目管理部/主任"></el-option>
                  <el-option label="业务部/部长" value="业务部/部长"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="译员角色：" :prop="'traslatorRole'" :rules="{ required: true, message: '请选择译员角色', trigger: 'change' }">
                <el-select v-model="ruleForm.traslatorRole" placeholder="请选择译员角色">
                  <el-option label="普通翻译（内勤、后勤、采购）" value="普通翻译（内勤、后勤、采购）"></el-option>
                  <el-option label="技术翻译（商务、文控）" value="技术翻译（商务、文控）"></el-option>
                  <el-option label="首席翻译（项目经理助理、翻译）" value="首席翻译（项目经理助理、翻译）"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目周期：" :prop="'projectTime'" :rules="{ required: true, message: '请选择项目周期', trigger: 'blur' }">
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
            <el-col :span="8" class="location">
              <el-form-item label="项目地点：">
                <select v-model="ruleForm.province" class="province" name="deliverprovince" id="deliverprovince"></select>
                <select v-model="ruleForm.city" class="city" name="delivercity" id="delivercity"></select>
                <select v-model="ruleForm.area" class="area" name="deliverarea" id="deliverarea"></select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="上岗日期：" :prop="'jobTime'" :rules="{ required: true, message: '请选择上岗日期', trigger: 'blur' }">
                <el-date-picker v-model="ruleForm.jobTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择上岗日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所需人数：" :prop="'needPersonNum'" :rules="{ required: true, message: '请输入所需人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.needPersonNum" type="number" clearable placeholder="请输入所需人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="储备人数：">
                <el-input v-model="ruleForm.morePersonNum" type="number" clearable placeholder="请输入储备人数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="交付日期：" :prop="'deliveryTime'" :rules="{ required: true, message: '请选择交付日期', trigger: 'blur' }">
                <el-date-picker v-model="ruleForm.deliveryTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择交付日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户项目进展：">
                <el-select v-model="ruleForm.projectProgress" placeholder="请选择客户项目进展">
                  <el-option label="前期" value="前期"></el-option>
                  <el-option label="中期" value="中期"></el-option>
                  <el-option label="后期" value="后期"></el-option>
                </el-select>
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
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户预算：" :prop="'customerYsPrice'" :rules="{ required: true, message: '请输入客户预算', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerYsPrice" clearable placeholder="请输入客户预算"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户报价：" :prop="'customerPrice'" :rules="{ required: true, message: '请输入客户报价', trigger: 'blur' }">
                <el-input v-model="ruleForm.customerPrice" clearable placeholder="请输入客户报价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="译员成本：">
                <el-input v-model="ruleForm.translatorPrice" clearable placeholder="请输入译员成本"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工作内容：" :prop="'workContent'" :rules="{ required: true, message: '请选择工作内容', trigger: 'change' }">
                <el-select v-model="ruleForm.workContent" placeholder="请选择工作内容">
                  <el-option label="商务谈判" value="商务谈判"></el-option>
                  <el-option label="技术翻译" value="技术翻译"></el-option>
                  <el-option label="行政管理" value="行政管理"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签证费用：" :prop="'cardPrice'" :rules="{ required: true, message: '请输入签证费用', trigger: 'blur' }">
                <el-input v-model="ruleForm.cardPrice" clearable placeholder="请输入签证费用"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="食宿交通：" :prop="'hotelTraffic'" :rules="{ required: true, message: '请输入食宿交通', trigger: 'blur' }">
                <el-input v-model="ruleForm.hotelTraffic" type="textarea" clearable placeholder="请输入食宿交通"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="休假情况：" :prop="'holiday'" :rules="{ required: true, message: '请输入休假情况', trigger: 'blur' }">
                <el-input v-model="ruleForm.holiday" type="textarea" clearable placeholder="请输入休假情况"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他福利：" :prop="'otherWelfare'" :rules="{ required: true, message: '请输入其他福利', trigger: 'blur' }">
                <el-input v-model="ruleForm.otherWelfare" type="textarea" clearable placeholder="请输入其他福利"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目合同：">
                <el-upload
                  class="upload-demo"
                  action="/"
                  :before-upload="beforeUpload">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="支持上传pdf、zip、rar、doc、docx、xlsx文件">
                    <el-button slot="reference" type="text">点击上传</el-button>
                  </el-popover>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.fileName">
              <el-form-item label="已上传合同：" style="color: #EC6941">{{ruleForm.fileName}}</el-form-item>
            </el-col>
          </el-row>
          <h3>人员要求</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="擅长领域：" required>
                <el-input v-model="form.specialtyDomain" clearable placeholder="请输入擅长领域"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：" required>
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄：">
                <el-input v-model="form.age" type="number" clearable placeholder="请输入年龄"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学历：" required>
                <el-select v-model="form.education" placeholder="请选择学历">
                  <el-option v-for="item in recordOptions"
                             :key="item"
                             :label="item"
                             :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族：">
                <el-input v-model="form.nationality" clearable placeholder="请输入民族"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业：">
                <el-input v-model="form.profession" clearable placeholder="请输入专业"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="证书：">
                <el-input v-model="form.certifacate" clearable placeholder="请输入证书"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工作年限：">
                <el-input v-model="form.experience" clearable placeholder="请输入工作年限"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在地：">
                <el-input v-model="form.location" clearable placeholder="请输入所在地"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="护照：">
                <el-input v-model="form.passport" clearable placeholder="请输入护照"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签证：">
                <el-input v-model="form.visa" clearable placeholder="请输入签证"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="海外经历：" required>
                <el-input v-model="form.overseasExperience" type="textarea" clearable placeholder="请输入其他"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他：">
                <el-input v-model="form.other" type="textarea" clearable placeholder="请输入其他"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 130px">
              <el-button type="success" @click="addRequired">添加</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          border
          stripe
          :max-height="$store.state.tableHeight"
          :data="ruleForm.requiredList">
          <el-table-column
            type="index"
            label="#"
            width="40">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="specialtyDomain"
            label="擅长领域">
          </el-table-column>
          <el-table-column
            min-width="70"
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            min-width="70"
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            min-width="80"
            prop="education"
            label="学历">
          </el-table-column>
          <el-table-column
            min-width="80"
            prop="nationality"
            label="民族">
          </el-table-column>
          <el-table-column
            min-width="80"
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="profession"
            label="专业">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="certifacate"
            label="证书">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="experience"
            label="工作年限">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="location"
            label="所在地">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="passport"
            label="护照">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="visa"
            label="签证">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="overseasExperience"
            label="海外经历">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="other"
            label="其他">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="70">
            <template slot-scope="scope">
              <el-button type="text" class="del" @click="delRequired(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-left: 130px;padding-top: 2rem">
          <el-button type="success"
                     @click="submitForm('ruleForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
          <el-button @click="$router.push('/resource/send')">取 消</el-button>
        </div>
      </div>
    </div>
    <customer-list ref="customerList" @saleMg="updateSaleMg"></customer-list>
  </div>
</template>
<script>
  import customerList from '../component/customerList_modal';
  import { mapState, mapGetters } from 'vuex';
  import '@/common/area';
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
          projectTime: '',
          field: '',
          secondField: '',
          origin: '',
          target: '',
          customerName: '',
          saleManager: '',
          customerRole: '总包',
          contactRole: '人力资源部/主任',
          traslatorRole: '普通翻译（内勤、后勤、采购）',
          province: '',
          city: '',
          area: '',
          jobTime: '',
          deliveryTime: '',
          projectProgress: '前期',
          resourceService: '现场笔译',
          needPersonNum: '',
          morePersonNum: '',
          customerYsPrice: '',
          customerPrice: '',
          translatorPrice: '',
          cardPrice: '',
          hotelTraffic: '',
          holiday: '',
          otherWelfare: '',
          workContent: '商务谈判',
          resourceCusStatus: '0',
          other: '',
          fileName: '',
          url: '',
          requiredList: []
        },
        form: {
          //人员要求
          "age": "",
          "certifacate": "",
          "education": "本科",
          "experience": "",
          "location": "",
          "nationality": "汉族",
          "other": "",
          "overseasExperience": "",
          "passport": "",
          "profession": "",
          "sex": "",
          "specialtyDomain": "",
          "visa": ""
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
        resourceServiceOptions: state => state.resourceWpService,
        recordOptions: state => state.recordOptions
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
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea")
      })
    },
    methods: {
      //添加人员要求
      addRequired (){
        if(!this.form.specialtyDomain ||
          !this.form.overseasExperience ||
          !this.form.education ||
          !this.form.sex){
          this.$message({
            type: 'warning',
            message: '请先填写必填项'
          });
          return false
        }
        this.ruleForm.requiredList.push({...this.form});
        this.resetParam(this.form);
        this.form.nationality = '汉族';
        this.form.education = '本科'
      },
      //删除人员要求
      delRequired (index){
        this.ruleForm.requiredList.splice(index, 1);
      },
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
      //上传测试文件
      beforeUpload (file) {
        let fileName = file.name;
        if(!(fileName.includes('.pdf') ||
            fileName.includes('.zip') ||
            fileName.includes('.rar') ||
            fileName.includes('.doc') ||
            fileName.includes('.docx') ||
            fileName.includes('.xlsx'))){
          this.$message({
            message: '不支持该文件格式',
            type: 'warning'
          });
          return false
        }
        const fd = new FormData();
        const _this = this;
        fd.append('multipartFile', file); //传文件
        this.$http.post('/resourceOrder/uploadResourceFile',fd)
          .then(function (res){
            if(res.data.message === 'success'){
              _this.ruleForm.fileName = file.name;
              _this.ruleForm.url = res.data.data
            }else{
              _this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
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
        this.ruleForm.customerName = data.customer;
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'POST',
              apiUrl = '/resourceOrder/addExpatriateOrder',
              translationOrder = {
                department: this.userInfo.department,
                projectName: this.ruleForm.projectName,
                accommodationTransportation: this.ruleForm.hotelTraffic,
                appointmentTime: this.ruleForm.jobTime? this.ruleForm.jobTime+' 00:00:00' : '',
                province: this.ruleForm.province,
                city: this.ruleForm.city,
                area: this.ruleForm.area,
                domain: this.ruleForm.field,
                subDomain: this.ruleForm.secondField,
                sourceLanguage: this.ruleForm.origin,
                targetLanguage: this.ruleForm.target,
                customerName: this.ruleForm.customerName,
                saleManager: this.ruleForm.saleManager,
                orderPerson: this.userInfo.name,
                customerBudget: this.ruleForm.customerYsPrice,
                customerContactDepart: this.ruleForm.contactRole,
                customerProjectProgress: this.ruleForm.projectProgress,
                customerProjectStatus: this.ruleForm.resourceCusStatus,
                customerQuote: this.ruleForm.customerPrice,
                customerRole: this.ruleForm.customerRole,
                deliveryTime: this.ruleForm.deliveryTime ? this.ruleForm.deliveryTime+' 00:00:00' : '',
                startTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[0]+' 00:00:00' : '',
                endTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[1]+' 00:00:00' : '',
                interpreterCost: this.ruleForm.translatorPrice,
                interpreterRole: this.ruleForm.traslatorRole,
                otherWelfare: this.ruleForm.otherWelfare,
                projectContractUrl: this.ruleForm.url,
                contractName: this.ruleForm.fileName,
                requiredPersonNumber: this.ruleForm.needPersonNum,
                reservePersonNumber: this.ruleForm.morePersonNum,
                requiredService: this.ruleForm.resourceService,
                vacationSituation: this.ruleForm.holiday,
                visaFees: this.ruleForm.cardPrice,
                workContent: this.ruleForm.workContent,
                otherDesc: this.ruleForm.other,
                peopleRequireds: this.ruleForm.requiredList
              };
            if(this.isModify){
              method = 'PUT';
              apiUrl = '/resourceOrder/editExpatriateOrder';
              Object.assign(translationOrder, {
                id: this.$route.params.id
              })
            }
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http({
              method: method,
              url: apiUrl,
              data: translationOrder
            }).then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/resource/send')
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
        this.$http.get('/resourceOrder/getExpatriateOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.detail = {
              projectNo: _data.projectNo,
              department: _data.department,
              orderTime: _data.orderTime
            };
            this.ruleForm = {
              projectName: _data.projectName,
              projectTime: _data.startTime?[_data.startTime.split(' ')[0],_data.endTime.split(' ')[0]]: '',
              field: _data.domain,
              secondField: '',
              origin: _data.sourceLanguage,
              target: _data.targetLanguage,
              customerName: _data.customerName,
              saleManager: _data.saleManager,
              customerRole: _data.customerRole,
              contactRole: _data.customerContactDepart,
              traslatorRole: _data.interpreterRole,
              province: _data.province,
              city: '',
              area: '',
              jobTime: _data.appointmentTime?_data.appointmentTime.split(' ')[0]:'',
              deliveryTime: _data.deliveryTime?_data.deliveryTime.split(' ')[0]:'',
              projectProgress: _data.customerProjectProgress,
              resourceService: _data.requiredService,
              needPersonNum: _data.requiredPersonNumber,
              morePersonNum: _data.reservePersonNumber,
              customerYsPrice: _data.customerBudget,
              customerPrice: _data.customerQuote,
              translatorPrice: _data.interpreterCost,
              cardPrice: _data.visaFees,
              hotelTraffic: _data.accommodationTransportation,
              holiday: _data.vacationSituation,
              otherWelfare: _data.otherWelfare,
              workContent: _data.workContent,
              resourceCusStatus: _data.customerProjectStatus,
              other: _data.otherDesc,
              fileName: _data.contractName,
              url: _data.projectContractUrl,
              requiredList: _data.peopleRequireds || []
            };
            const event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            setTimeout(() => {
              document.querySelector('.province').dispatchEvent(event);
              this.ruleForm.city = _data.city;
            }, 10);
            setTimeout(() => {
              document.querySelector('.city').dispatchEvent(event);
              this.ruleForm.area = _data.area;
            }, 50);
            this.selectSecondField(_data.domain).then(() => {
              this.ruleForm.secondField = _data.subDomain;
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-col.location{
    .el-form-item__content{
      font-size: 0px;
    }
    select {
      width: 32%;
      max-width: 91px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #BFBFBF;
      border-radius: 2px;
      color: #606266;
    }
  }
</style>
