<template>
  <div>
    <el-dialog
      title="编 辑"
      :visible.sync="$store.state.switchModal"
      width="600px"
      center>
      <el-form :model="form" style="padding: 10px;">
        <el-form-item label="术语：">
          <el-input v-model="form.source" style="display: inline-block;width: 353px" placeholder="请输入术语"></el-input>
        </el-form-item>
        <el-form-item label="译文：">
          <el-input v-model="form.target" style="display: inline-block;width: 353px" placeholder="请输入译文"></el-input>
        </el-form-item>
        <el-form-item label="解释：">
          <el-input v-model="form.explain" style="display: inline-block;width: 353px" placeholder="请输入解释"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('switchModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'edit',
    props: ['row','callback'],
    data (){
      return {
        btn: {
          disabled: false,
          txt: '提 交'
        },
        form: {
          id: '',
          source: '',
          target: '',
          explain: ''
        }
      }
    },
    watch: {
      //监听点击row数据并且填充
      row: {
        handler (newVal, oldVal){
          this.form.source = newVal[0]
          this.form.target = newVal[1]
          this.form.explain = newVal[2]
          this.form.id = newVal[newVal.length-1]
        },
        deep: true
      }
    },
    methods: {
      // 提交编辑
      confirmEdit() {
        this.btn.txt = '提交中'
        this.btn.disabled = true
        const data = {
          fileid: this.$route.params.id,
          id: this.form.id,
          source: this.form.source,
          sourceDesc: this.form.source,
          target: this.form.target,
          targetDesc: this.form.explain
        }
        this.$http.put('/dictionary/term/termTempEditor',this.$qs.stringify(data))
          .then(res => {
          res.data.message === 'success'
            ? this.$message({
              type: 'success',
              message: '编辑成功'
            })
            : this.$message({
              type: 'error',
              message: res.data.message
            })
          this.btn.txt = '提 交'
          this.btn.disabled = false
          this.$store.commit('switchModal')
          this.callback()
        })
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
</style>
