<template>
  <div class="rm-cg">
    <el-dialog
      :title="title"
      width="450px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form>
        <el-form-item label="标签名称：" required>
          <el-input type="text" v-model="form.labelName" placeholder="请输入标签名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success"
                   :disabled="btn.disabled"
                   @click="addLabel">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ['callback', 'uLabel'],
    data (){
      return {
        title: '新增标签',//修改标签
        form: {
          id: '',
          labelName: ''
        },
        btn: {
          disabled: false,
          txt: '确 定'
        }
      }
    },
    watch: {
      uLabel (newVal){
        this.title = !newVal ? '新增标签' : '修改标签';
        if(typeof newVal === 'object'){
          this.form.id = newVal.id;
          this.form.labelName = newVal.name;
        }
      }
    },
    methods: {
      addLabel (){
        if(this.form.labelName.trim() === ''){
          this.$message({
            type: 'warning',
            message: '请输入标签名'
          });
          return
        }
        this.btn.disabled = true;
        this.btn.txt = '添加中';
        let method = 'post',
            url = '/interpreterArticle/addArticleLabel',
            data = {
              labelName: this.form.labelName
            };
        if(this.form.id){
          method = 'put';
          url = '/interpreterArticle/updateLabel';
          Object.assign(data, {
            labelId: this.form.id
          });
        }
        this.$http({
          method: method,
          url: url,
          data: this.$qs.stringify(data)
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.form.id = '';
            this.form.labelName = '';
            this.$store.commit('showModal');
            this.doSearch(this.callback)
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
          this.btn.disabled = false;
          this.btn.txt = '确 定';
        });
      }
    }
  }
</script>
