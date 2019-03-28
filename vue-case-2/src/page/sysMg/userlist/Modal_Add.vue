<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="centerDialogVisible"
      width="600px"
      center>
      <el-form :model="form" style="padding: 10px;">
        <el-form-item label="姓名：">
          <el-input v-model="form.name" style="display: inline-block;width: 353px" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="form.phone" style="display: inline-block;width: 353px" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="所在部门：">
          <el-input v-model="form.department" style="display: inline-block;width: 353px" placeholder="请输入所在部门"></el-input>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="form.role.value" placeholder="请选择角色" style="width: 353px">
            <el-option
              v-for="item in form.role.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-input v-model="form.pwd" style="display: inline-block;width: 353px" placeholder="请输入登录密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'addOrEdit',
    data (){
      return {
        title: '添 加', //或者 “编 辑”
        centerDialogVisible: true,
        form: {
          name: '',
          phone: '',
          department: '',
          pwd: '',
          role: {
            list: [],
            value: ''
          }
        }
      }
    },
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
</style>
