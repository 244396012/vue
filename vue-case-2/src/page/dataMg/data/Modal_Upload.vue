<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="centerDialogVisible"
      width="600px"
      center>
      <el-form :model="form">
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
        <el-form-item label="上传文档：">
          <el-upload
            class="upload-demo"
            drag
            action=""
            :before-upload="beforeAvatarUpload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip" style="color: #888;text-align: center">
              支持扩展名：xls、xlsx、txt、csv、tbx，且不超过10MB
            </div>
          </el-upload>
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
    name: 'upload',
    data (){
      return {
        centerDialogVisible: true,
        title: '上传语料',//title = "上传语料" 或 "添加"
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
    methods: {
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
        var fileName = new Array()
        fileName =file.name.split('.')
        const extension = fileName[fileName.length-1] === 'xls'
        const extension2 =  fileName[fileName.length-1] === 'xlsx'
        const extension3 =  fileName[fileName.length-1] === 'txt'
        const extension4 =  fileName[fileName.length-1] === 'csv'
        const extension5 =  fileName[fileName.length-1] === 'tbx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
          this.$message({
            message: '只能上传xls、xlsx、txt、csv文件',
            type: 'warning'
          });
          return false
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          });
          return false
        }
        if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && isLt2M == true) {
          console.log(file)
          let fd = new FormData()
          fd.append('invoiceTypeId', this.invoice_type_id)//随文件上传的其他参数
          fd.append('epid', this.epid)
          fd.append('file', file)
          console.log(fd)
          this.newImport(fd).then(function (res) {//校验完成后提交
            console.log(res)
          }, function () {
            console.log('failed');
          });
          return true
        }
        return !extension && !extension2 && !extension3 && !extension4 && !extension5 && isLt2M
      },
      newImport (data) {
        this.$http.post('', data).then(function (res) {//成功后回调
          let code = res.data.returncode;//返回json结果
          let msg = res.data.msg;
          console.log('success');
        }, function () {
          console.log('failed');
        });
      }

    }
  }
</script>
