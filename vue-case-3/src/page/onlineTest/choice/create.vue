<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="语言：" prop="language">
            <el-select v-model="ruleForm.language" placeholder="请选择语言对">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.chineseName">
              </el-option>
            </el-select>
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
            <p v-if="formSelect.show" style="position: absolute;bottom: -40px;font-size: 12px;">* 将 [[[所填的空]]] 用英文三重方括号包围起来</p>
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
              <el-option v-for="item in formSelect.levelOptions"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业领域：" class="exact">
            <el-checkbox-group v-model="ruleForm.field" :max="5">
              <el-checkbox v-for="item in formSelect.fieldOptions"
                           :key="item.id"
                           :value="item.id"
                           :label="item.id" name="field">{{item.fullSpecialtyName}}</el-checkbox>
            </el-checkbox-group>
            <p style="position: absolute;bottom: -32px;font-size: 12px;color: #F56C6C">* 最多选择5项</p>
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
  export default {
    data() {
      return {
        ruleForm: {
          language: '',
          type: '',
          require: '',
          title: '',
          option_A: '',
          option_B: '',
          option_C: '',
          option_D: '',
          answer: '',
          field: [],
          level: ''
        },
        formSelect: {
          placeholder: '请输入题目',
          show: false,
          fieldOptions: [],
          typeOptions: ['选择','填空','对话'],
          requireOptions: [
            { "value": "请选出以下翻译正确的一项"},
            { "value": "请选择空格中正确的答案"},
            { "value": "请根据题目选出正确的意思"}
          ],
          levelOptions: [1,2,3,4,5,6,7,8,9,10]
        },
        rules: {
          language: [
            { required: true, message: '请选择相关语言对', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择题目类型', trigger: 'change' }
          ],
          require: [
            { required: true, message: '请输入题目要求', trigger: 'change' }
          ],
          title: [
            { required: true, message: ' ', trigger: 'blur' }
          ],
          option_A: [
            { required: true, message: '请输入选项A', trigger: 'blur' }
          ],
          option_B: [
            { required: true, message: '请输入选项B', trigger: 'blur' }
          ],
          option_C: [
            { required: true, message: '请输入选项C', trigger: 'blur' }
          ],
          option_D: [
            { required: true, message: '请输入选项D', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '请选择正确答案', trigger: 'change' }
          ],
          level: [
            { required: true, message: '请选择难度等级', trigger: 'change' }
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
    created (){
      this.getFirstField().then(res => {
        this.formSelect.fieldOptions = res
      })
      this.$route.query.u && this.fillInForm()
    },
    methods: {
      //题目要求下拉显示模版
      querySearch(queryString, cb) {
        let restaurants = this.formSelect.requireOptions
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
          this.formSelect.show = true
          this.formSelect.placeholder = 'Choose from a [[[]]] selection of all the industry areas you are good at, with a maximum of 4 industry areas.'
        }else{
          this.formSelect.show = false
          this.formSelect.placeholder = '请输入题目'
        }
      },
      //保存、保存并添加下一条
      submitForm(formName, btn) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let type = 'post',
                url = '/choiceQuestion/addChoiceQuestion';
            const formData = {
              language: this.ruleForm.language,
              type: this.ruleForm.type,
              questionRequirement: this.ruleForm.require,
              questionHead: this.ruleForm.title,
              optiona: this.ruleForm.option_A,
              optionb: this.ruleForm.option_B,
              optionc: this.ruleForm.option_C,
              optiond: this.ruleForm.option_D,
              correctAnswer: this.ruleForm.answer,
              difficultLevel: this.ruleForm.level,
              domainIds: this.ruleForm.field
            }
            if(this.$route.query.u){
              type = 'put';
              url = '/choiceQuestion/updateChoiceQuestion';
              formData.id = this.$route.query.u;
            }
            if(btn === 1){
              this.btn1.disabled = true
              this.btn1.txt = '保存中'
            }else {
              this.btn.disabled = true
              this.btn.txt = '保存中'
            }
            this.$http({
              method: type,
              url: url,
              data: this.$qs.stringify(formData)
            }).then(res => {
              if(res.data.code === '200' && res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                window.setTimeout(() => {
                  if(btn === 1){
                    this.$refs[formName].resetFields()
                    this.ruleForm.field = []
                    this.formSelect.placeholder = '请输入题目'
                    this.formSelect.show = false
                  }else {
                    this.$router.back(-1)
                  }
                }, 1000)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              if(btn === 1){
                this.btn1.disabled = false
                this.btn1.txt = '保存并添加下一条'
              }else {
                this.btn.disabled = false
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
          if(res.data.code === '200' && res.data.message === 'success'){
            this.ruleForm.language = res.data.data.language
            this.ruleForm.type = res.data.data.type
            this.ruleForm.require = res.data.data.questionRequirement
            this.ruleForm.title = res.data.data.questionHead
            this.ruleForm.option_A = res.data.data.optiona
            this.ruleForm.option_B = res.data.data.optionb
            this.ruleForm.option_C = res.data.data.optionc
            this.ruleForm.option_D = res.data.data.optiond
            this.ruleForm.answer = res.data.data.correctAnswer
            this.ruleForm.level = res.data.data.difficultLevel
            res.data.data.domains.forEach(item => {
              this.ruleForm.field.push(item.id)
            })
          }
        })
      }
    }
  }
</script>
