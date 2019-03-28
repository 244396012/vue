<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="centerDialogVisible"
      width="600px"
      center>
      <el-form :model="form" :rules="rules" ref="form"  style="padding: 10px;">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="form.roleName" style="display: inline-block;width: 353px" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="职能描述：">
          <el-input v-model="form.explain" type="textarea" style="display: inline-block;width: 353px" placeholder="请输入职能描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'addOrEdit',
    data (){
      return {
        title: '添加角色', //或者 “编辑角色”
        centerDialogVisible: true,
        form: {
          roleName: '',
          explain: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  /deep/ .el-form-item__label{
    width: 130px;
    text-align: right;
  }
  /deep/ .el-select{
    width: 33%;
  }
  /deep/ .el-form-item__error{
    left: 130px;
  }
</style>
