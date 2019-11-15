<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" style="width: 80%;min-width: 900px;">
          <el-form-item label="消息标题：" :prop="'title'" :rules="{ required: true, message: '请输入文章标题', trigger: 'blur' }">
            <el-input type="text" v-model="ruleForm.title" clearable placeholder="请输入消息标题" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="消息分类：" :prop="'type'" :rules="{ required: true, message: '请选择消息分类', trigger: 'change' }">
            <el-select v-model="ruleForm.type" placeholder="请选择消息分类" style="width: 400px">
              <el-option label="系统公告" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收人员：" :prop="'persons'" :rules="{ required: true, message: '请选择接收人员', trigger: 'change' }">
            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkAll" @change="handleCheckAllChange">全体用户</el-checkbox>
            <el-checkbox-group v-model="ruleForm.persons" @change="handleCheckedChange" style="display: inline-block;padding-left: 25px">
              <el-checkbox v-for="item in formSelect.personOptions"
                           :label="item" :value="item" :key="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="正文内容：" :prop="'content'" :rules="{ required: true, message: '请输入正文内容', trigger: 'blur' }">
            <quill-editor :options="quillOption" v-model="ruleForm.content"></quill-editor>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="success"
                       @click="submitForm('ruleForm', true)"
                       :disabled="btn.disabled">确认发布</el-button>
            <el-button @click="submitForm('ruleForm', false)"
                       :disabled="btn.disabled">保存草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor';
  import quillConfig from '@/common/quill-config';
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        quillOption: quillConfig,
        checkAll: false,
        isIndeterminate: true,
        ruleForm: {
          title: '',
          type: '',
          content: '',
          persons: []
        },
        formSelect: {
          personOptions: ['兼职人员','准兼职人员','专职人员']
        },
        btn: {
          disabled: false
        }
      };
    },
    created (){
      this.$route.params.id && this.fillDetail()
    },
    methods: {
      handleCheckAllChange(val) {
        this.ruleForm.persons = val ? this.formSelect.personOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.formSelect.personOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.ruleForm.persons.length;
      },
      //发布消息
      submitForm(formName, isNow) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const personType = this.ruleForm.persons.length === this.formSelect.personOptions.length ? ['全体用户'] : this.ruleForm.persons;
            this.btn.disabled = true;
            this.$http({
              method: 'post',
              url: '/notice/publishNotice',
              headers: {
                'Content-Type': 'application/json'
              },
              data: JSON.stringify({
                noticeHead: this.ruleForm.title,
                noticeType: this.ruleForm.type,
                receiveType: ['0'],
                operate: this.$route.params.id ? '1':'0',
                content: this.ruleForm.content,
                receivePersonType: personType,
                isImmediatelyPublish: isNow
              })
            }).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                setTimeout(() => {
                  this.$router.push('/article/message');
                }, 1000);
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
            })
          }
        })
      },
      //填充详情
      fillDetail (){
        this.$http.get('/notice/sysNoticeDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const data = res.data.data;
            this.ruleForm.title = data.head;
            this.ruleForm.type = String(data.type);
            this.ruleForm.content = data.content;
            this.ruleForm.persons = data.receivePersonType;
            if(data.receivePersonType.includes('全体')){
              this.checkAll = true;
              this.isIndeterminate = false;
              this.ruleForm.persons = [...this.formSelect.personOptions];
            }else{
              this.ruleForm.persons = data.receivePersonType.split(',');
            }
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../style/quill.snow.css";
</style>
