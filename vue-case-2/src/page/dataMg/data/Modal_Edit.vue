<template>
  <div>
    <el-dialog
      title="编 辑"
      :visible.sync="centerDialogVisible"
      width="600px"
      center>
      <el-form :model="form" style="padding: 10px;">
        <el-form-item label="所属领域：">
          <el-select v-model="form.area1.value" placeholder="一级分类">
            <el-option
              v-for="item in form.area1.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.area2.value" placeholder="二级分类">
            <el-option
              v-for="item in form.area2.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择语言：">
          <el-select v-model="form.source.value" placeholder="源语言">
            <el-option
              v-for="item in form.source.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.target.value" placeholder="目标语言">
            <el-option
              v-for="item in form.target.list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语料名称：">
          <el-input v-model="form.fileName" style="display: inline-block;width: 353px"  placeholder="请输入语料名称"></el-input>
        </el-form-item>
        <el-form-item label="语料简介：">
          <el-input type="textarea" v-model="form.short" style="display: inline-block;width: 353px"  placeholder="请输入语料简介"></el-input>
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
    name: 'edit',
    data (){
      return {
        centerDialogVisible: true,
        form: {
          fileName: '',
          short: '',
          area1: {
            list: [],
            value: ''
          },
          area2: {
            list: [],
            value: ''
          },
          source: {
            list: [],
            value: ''
          },
          target: {
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
