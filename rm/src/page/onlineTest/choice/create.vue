<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="语言对：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="origin">
                <el-select v-model="ruleForm.origin" placeholder="请选择源语言" style="width: 99%">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="target">
                <el-select v-model="ruleForm.target" placeholder="请选择目标语言" style="width: 100%">
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
          <el-form-item label="类型：" prop="type">
            <el-select placeholder="请选择试题类型"
                       v-model="ruleForm.type"
                       @change="showPrompt">
              <el-option
                v-for="(item, index) in formSelect.typeOptions"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目要求：" prop="require">
            <el-autocomplete
              class="wd-50 inline-input"
              clearable
              v-model="ruleForm.require"
              :fetch-suggestions="querySearch"
              placeholder="请输入题目要求"></el-autocomplete>
          </el-form-item>
          <el-form-item label="题目：" prop="title">
            <el-input type="textarea" v-model="ruleForm.title"
                      :placeholder="formSelect.placeholder"></el-input>
            <!--选择填空题时才有此提醒-->
            <p v-if="ruleForm.type === '填空'" style="position: absolute;bottom: -40px;font-size: 12px;">* 将 [[[所填的空]]] 用英文三重方括号包围起来</p>
          </el-form-item>
          <el-form-item label="选项A：" prop="option_A">
            <el-input type="text" v-model="ruleForm.option_A" clearable placeholder="请输入选项A"></el-input>
          </el-form-item>
          <el-form-item label="选项B：" prop="option_B">
            <el-input type="text" v-model="ruleForm.option_B" clearable placeholder="请输入选项B"></el-input>
          </el-form-item>
          <el-form-item label="选项C：" prop="option_C">
            <el-input type="text" v-model="ruleForm.option_C" clearable placeholder="请输入选项C"></el-input>
          </el-form-item>
          <el-form-item label="选项D：" prop="option_D">
            <el-input type="text" v-model="ruleForm.option_D" clearable placeholder="请输入选项D"></el-input>
          </el-form-item>
          <el-form-item label="正确答案：" prop="answer">
            <el-radio-group v-model="ruleForm.answer">
              <el-radio label="a">选项A</el-radio>
              <el-radio label="b">选项B</el-radio>
              <el-radio label="c">选项C</el-radio>
              <el-radio label="d">选项D</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度等级：" prop="level">
            <el-select v-model="ruleForm.level" placeholder="请选择难度等级">
              <el-option v-for="item in levelOptions"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业领域：" class="exact">
            <el-select v-model="ruleForm.field"
                       @change="getSecondFields"
                       placeholder="请选择一级领域">
              <el-option v-for="item in $store.state.fieldOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.specialtyId"></el-option>
            </el-select>
            <el-select v-model="ruleForm.secondField" placeholder="请选择二级领域" multiple :collapse-tags="true">
              <el-option v-for="item in formSelect.secondOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
            <el-button style="width: auto"
                       v-if="!$route.query.u"
                       @click="submitForm('ruleForm', 1)"
                       :disabled="btn1.disabled">{{btn1.txt}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    data() {
      return {
        ruleForm: {
          origin: '',
          target: '',
          type: '',
          require: '',
          title: '',
          option_A: '',
          option_B: '',
          option_C: '',
          option_D: '',
          answer: '',
          field: '',
          secondField: [],
          level: ''
        },
        formSelect: {
          show: false,
          placeholder: '请输入题目',
          secondOptions: [],
          typeOptions: ['翻译','填空','对话'],
          requireOptions: [
            { "value": "请选出以下翻译正确的一项"},
            { "value": "请选择空格中正确的答案"},
            { "value": "请根据题目选出正确的意思"}
          ]
        },
        rules: {
          origin: [
            { required: true, message: '请选择源语言' }
          ],
          target: [
            { required: true, message: '请选择目标语言' }
          ],
          type: [
            { required: true, message: '请选择题目类型' }
          ],
          require: [
            { required: true, message: '请输入题目要求'}
          ],
          title: [
            { required: true, message: ' '}
          ],
          option_A: [
            { required: true, message: '请输入选项A' }
          ],
          option_B: [
            { required: true, message: '请输入选项B' }
          ],
          option_C: [
            { required: true, message: '请输入选项C' }
          ],
          option_D: [
            { required: true, message: '请输入选项D' }
          ],
          answer: [
            { required: true, message: '请选择正确答案' }
          ],
          level: [
            { required: true, message: '请选择难度等级' }
          ]
        },
        btn: {
          disabled: false,
          txt: '保存'
        },
        btn1: {
          disabled: false,
          txt: '保存并添加下一条'
        }
      };
    },
    computed: {
      ...mapState('select',{
        levelOptions: state => state.level
      })
    },
    created (){
      this.$route.query.u && this.fillInForm()
    },
    methods: {
      //获取二级领域
      getSecondFields (id){
        this.ruleForm.secondField = [];
        this.formSelect.secondOptions = [];
        this.getSecondField(id).then(res => {
          this.formSelect.secondOptions = res;
        })
      },
      //题目要求下拉显示模版
      querySearch(queryString, cb) {
        let restaurants = this.formSelect.requireOptions;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //切换提示信息：placeholder、tip
      showPrompt() {
        if(this.ruleForm.type === '填空'){
          this.formSelect.placeholder = 'Choose from a [[[]]] selection of all the industry areas you are good at, with a maximum of 4 industry areas.'
        }else{
          this.formSelect.placeholder = '请输入题目'
        }
      },
      //保存、保存并添加下一条
      submitForm(formName, btn) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let type = 'post',
                url = '/choiceQuestion/addChoiceQuestion';
            if(this.ruleForm.origin === this.ruleForm.target){
              this.$message({
                type: 'warning',
                message: '请选择不同的语言'
              });
              return false
            }
            let domainId = '';
            const firstDomain = this.$store.state.fieldOptions.find(item => {
              return this.ruleForm.field === item.specialtyId
            }) || {};
            if(firstDomain.id && this.ruleForm.secondField.length < 1){
              domainId = firstDomain.id
            }else if(this.ruleForm.secondField.length > 0){
              domainId = this.ruleForm.secondField
            }
            const formData = {
              orignLanguage: this.ruleForm.origin,
              targetLanguage: this.ruleForm.target,
              type: this.ruleForm.type,
              questionRequirement: this.ruleForm.require,
              questionHead: this.ruleForm.title,
              optiona: this.ruleForm.option_A,
              optionb: this.ruleForm.option_B,
              optionc: this.ruleForm.option_C,
              optiond: this.ruleForm.option_D,
              correctAnswer: this.ruleForm.answer,
              difficultLevel: this.ruleForm.level,
              domainIds: domainId
            };
            if(this.$route.query.u){
              type = 'put';
              url = '/choiceQuestion/updateChoiceQuestion';
              formData.id = this.$route.query.u;
            }
            if(btn){
              this.btn1.disabled = true;
              this.btn1.txt = '保存中'
            }else {
              this.btn.disabled = true;
              this.btn.txt = '保存中'
            }
            this.$http({
              method: type,
              url: url,
              data: this.$qs.stringify(formData)
            }).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                if(btn === 1){
                  this.$refs[formName].resetFields();
                  this.ruleForm.field = '';
                  this.ruleForm.secondField = [];
                  this.formSelect.secondOptions = [];
                  this.formSelect.placeholder = '请输入题目';
                }else {
                  setTimeout(() => {
                    this.$router.push('/onlineTest/choice')
                  }, 1000)
                }
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              if(btn){
                this.btn1.disabled = false;
                this.btn1.txt = '保存并添加下一条'
              }else {
                this.btn.disabled = false;
                this.btn.txt = '保存'
              }
            })
          }
        })
      },
      //当修改时，填充form表单数据
      fillInForm() {
        this.$http.get('/choiceQuestion/choiceQuestionDetails', {
          params: {
            id: this.$route.query.u
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const data = res.data.data;
            this.ruleForm.origin = data.orignLanguage;
            this.ruleForm.target = data.targetLanguage;
            this.ruleForm.type = data.type;
            this.ruleForm.require = data.questionRequirement;
            this.ruleForm.title = data.questionHead;
            this.ruleForm.option_A = data.optiona;
            this.ruleForm.option_B = data.optionb;
            this.ruleForm.option_C = data.optionc;
            this.ruleForm.option_D = data.optiond;
            this.ruleForm.answer = data.correctAnswer.toLowerCase();
            this.ruleForm.level = data.difficultLevel;
            const domains = data.domains || [];
            if(domains.length > 0){
              this.ruleForm.field = domains[0].pSpecialtyId;
              setTimeout(() => {
                this.getSecondField(this.ruleForm.field).then(res => {
                  this.formSelect.secondOptions = res;
                  this.ruleForm.secondField = domains.map(item => {
                    return item.id
                  })
                })
              }, 10)
            }
          }
        })
      }
    }
  }
</script>
