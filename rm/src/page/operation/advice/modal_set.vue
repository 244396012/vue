<template>
  <div class="rm-cg">
    <el-dialog
      title="设置等级"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form>
        <el-form-item required label="反馈等级">
          <el-select v-model="form.feedbackLevel"
                     placeholder="请选择反馈等级"
                     style="width: 76%">
            <el-option
              v-for="item in formSelect.feedbackLevel"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="setLevelFn" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'add-remark',
    props: ['callback','formid'],
    data (){
      return {
        btn: {
          txt: '确 定',
          disabled: false
        },
        form: {
          id: '',
          feedbackLevel: ''
        },
        formSelect: {
          feedbackLevel: [
            {label: '重大反馈', value: '重大反馈'},
            {label: '一般反馈', value: '一般反馈'},
            {label: '零反馈', value: '零反馈'}
          ]
        }
      }
    },
    watch: {
      formid (newVal, oldVal){
        this.form.id = newVal;
        this.form.feedbackLevel = ''
      }
    },
    methods: {
      setLevelFn (){
        if(this.form.feedbackLevel === ''){
          this.$message({
            type: 'warning',
            message: '请选择反馈等级'
          });
          return null;
        }
        this.btn.disabled = true;
        this.btn.txt = '提交中';
        this.$http({
          method: 'get',
          url: '/feedback/setFeedBackLevel?id='+this.form.id+'&feedBackLevel='+this.form.feedbackLevel
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '设置成功'
            });
            this.$store.commit('showModal', false);
            this.form.feedbackLevel = '';
            this.doSearch(this.callback);
          }else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
          this.btn.disabled = false;
          this.btn.txt = '确 认';
        })
      }
    }
  }
</script>

