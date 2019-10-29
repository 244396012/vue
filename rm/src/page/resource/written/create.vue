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
              <el-form-item label="下单人：">
                <el-input v-model="detail.orderPerson" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单时间：">
                <el-input v-model="detail.orderTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：" :prop="'projectName'" :rules="{ required: true, message: '请输入项目名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.projectName" clearable placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="wd-el-50">
              <el-form-item label="专业领域：" required>
                <el-col :span="12">
                  <el-form-item :prop="'field'" :rules="{ required: true, message: '请选择一级领域', trigger: 'change' }">
                    <el-select @change="selectSecondField" v-model="ruleForm.field" placeholder="一级领域">
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
          </el-row>
          <el-row>
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
            <el-col :span="8" v-if="!isModify">
              <el-form-item label="下单人：">
                <el-input v-model="userInfo.name" disabled placeholder="请输入下单人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-else>
              <el-form-item label="项目状态：">
                <el-select
                  v-model="ruleForm.projectStatus" placeholder="请选择项目状态">
                  <el-option
                    v-for="item in resourceProStatusOptions"
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
              <el-form-item label="交付日期：">
                <el-date-picker v-model="ruleForm.deliveryTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择交付日期">
                </el-date-picker>
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
              <el-form-item label="预计翻译量：">
                <el-input v-model="ruleForm.preWorkload" clearable placeholder="请输入预计翻译量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所需人数：" :prop="'needPersonNum'" :rules="{ required: true, message: '请输入所需人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.needPersonNum" type="number" clearable placeholder="请输入所需人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求类型：" :prop="'needType'" :rules="{ required: true, message: '请选择需求类型', trigger: 'blur' }">
                <el-select v-model="ruleForm.needType" placeholder="请选择需求类型">
                  <el-option v-for="item in resourceNeedTypeOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
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
              <el-form-item label="稿件难度：" :prop="'level'" :rules="{ required: true, message: '请选择稿件难度', trigger: 'blur' }">
                <el-select v-model="ruleForm.level" placeholder="请选择稿件难度">
                  <el-option v-for="item in resourceLevelOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="译员单价范围：" :prop="'priceScale'" :rules="{ required: true, message: '请输入译员单价范围', trigger: 'blur' }">
                <el-input v-model="ruleForm.priceScale" clearable placeholder="请输入译员单价范围"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否测试：" :prop="'isTest'" :rules="{ required: true, message: '请选择是否测试', trigger: 'blur' }">
                <el-select v-model="ruleForm.isTest" placeholder="请选择是否测试">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
            <el-col :span="8">
              <el-form-item label="测试题：" required>
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
              <el-form-item label="已上传测试题：" style="color: #EC6941">{{ruleForm.fileName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目简介：" :prop="'shortProduce'" :rules="{ required: true, message: '请输入项目简介', trigger: 'blur' }">
                <el-input v-model="ruleForm.shortProduce" type="textarea" clearable placeholder="请输入项目简介"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他：">
                <el-input v-model="ruleForm.other" type="textarea" clearable placeholder="请输入其他"></el-input>
              </el-form-item>
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
              <el-form-item label="年龄：">
                <el-input v-model="form.age" type="number" clearable placeholder="请输入年龄"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族：">
                <el-input v-model="form.nationality" clearable placeholder="请输入民族"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学历：">
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
              <el-form-item label="专业：">
                <el-input v-model="form.profession" clearable placeholder="请输入专业"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经验要求：">
                <el-input v-model="form.experience" clearable placeholder="请输入经验要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
            min-width="150"
            prop="specialtyDomain"
            label="擅长领域">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="nationality"
            label="民族">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="education"
            label="学历">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="profession"
            label="专业">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="experience"
            label="经验要求">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="other"
            label="其他">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" class="del" @click="delRequired(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-left: 130px;padding-top: 2rem">
          <el-button type="success"
                     @click="submitForm('ruleForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
          <el-button @click="$router.push('/resource/written')">取 消</el-button>
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
          projectStatus: '',
          field: '',
          secondField: '',
          origin: '',
          target: '',
          customerName: '',
          saleManager: '',
          deliveryTime: '',
          resourceService: '翻译',
          preWorkload: '',
          needPersonNum: '',
          needType: '投标储蓄',
          resourceCusStatus: '0',
          level: '初级',
          priceScale: '',
          isTest: 'true',
          projectTime: '',
          shortProduce: '',
          other: '',
          fileName: '',
          url: '',
          requiredList: []
        },
        form: {
          //人员要求
          specialtyDomain: '',
          age: '',
          nationality: '汉族',
          education: '本科',
          profession: '',
          experience: '',
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
        memberLevel: state => state.memberLevel,
        resourceCusStatusOptions: state => state.resourceCusStatus,
        resourceServiceOptions: state => state.resourceService,
        resourceNeedTypeOptions: state => state.resourceNeedType,
        resourceLevelOptions: state => state.resourceLevel,
        resourceProStatusOptions: state => state.resourceProStatus,
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
    },
    methods: {
      //添加人员要求
      addRequired (){
        if(!this.form.specialtyDomain){
          this.$message({
            type: 'warning',
            message: '请填写擅长领域'
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
      //确认下单
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.ruleForm.url){
              this.$message({
                type: 'warning',
                message: '请上传测试文件'
              });
              return false
            }
            let method = 'POST',
              apiUrl = '/resourceOrder/addTranslationOrder',
              translationOrder = {
                department: this.userInfo.department,
                orderPerson: this.userInfo.name,
                projectName: this.ruleForm.projectName,
                projectStatus: this.ruleForm.projectStatus,
                domain: this.ruleForm.field,
                subDomain: this.ruleForm.secondField,
                sourceLanguage: this.ruleForm.origin,
                targetLanguage: this.ruleForm.target,
                customerName: this.ruleForm.customerName,
                saleManager: this.ruleForm.saleManager,
                estimatedTranslationVolume: this.ruleForm.preWorkload,
                deliveryTime: this.ruleForm.deliveryTime ? this.ruleForm.deliveryTime+' 00:00:00' : '',
                requiredService: this.ruleForm.resourceService,
                requiredPersonNumber: this.ruleForm.needPersonNum,
                requiredType: this.ruleForm.needType,
                customerProjectStatus: this.ruleForm.resourceCusStatus,
                manuscriptDifficulty: this.ruleForm.level,
                unitPriceRange: this.ruleForm.priceScale,
                isTested: this.ruleForm.isTest,
                questionUrl: this.ruleForm.url,
                testFileName: this.ruleForm.fileName,
                startTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[0]+' 00:00:00' : '',
                endTime: this.ruleForm.projectTime.length>0 ? this.ruleForm.projectTime[1]+' 00:00:00' : '',
                projectDesc: this.ruleForm.shortProduce,
                otherDesc: this.ruleForm.other,
                peopleRequireds: this.ruleForm.requiredList
              };
            if(this.isModify){
              method = 'PUT';
              apiUrl = '/resourceOrder/editTranslationOrder';
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
                  this.$router.push('/resource/written')
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
        this.$http.get('/resourceOrder/getTranslationOrderDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.detail = {
              projectNo: _data.projectNo,
              orderPerson: _data.orderPerson,
              orderTime: _data.orderTime
            };
            this.ruleForm = {
              projectName: _data.projectName,
              projectStatus: _data.projectStatus,
              field: _data.domain,
              secondField: '',
              origin: _data.sourceLanguage,
              target: _data.targetLanguage,
              customerName: _data.customerName,
              saleManager: _data.saleManager,
              deliveryTime: _data.deliveryTime?_data.deliveryTime.split(' ')[0]:'',
              resourceService: _data.projectName,
              preWorkload: _data.estimatedTranslationVolume,
              needPersonNum: _data.requiredPersonNumber,
              needType: _data.requiredType,
              resourceCusStatus: _data.customerProjectStatus,
              level: _data.manuscriptDifficulty,
              priceScale: _data.unitPriceRange,
              isTest: _data.isTested.toString(),
              projectTime: _data.startTime?[_data.startTime.split(' ')[0],_data.endTime.split(' ')[0]]: '',
              shortProduce: _data.projectDesc,
              other: _data.otherDesc,
              fileName: _data.testFileName,
              url: _data.questionUrl,
              requiredList: _data.peopleRequireds || []
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
