<template>
  <div>
    <el-dialog
      title="设置完成"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form label-width="70px" :model="form" ref="form">
        <el-form-item label="状态" :prop="'resourceComStatus'" :rules="{ required: true, message: '请选择状态', trigger: 'blur' }">
          <el-select v-model="form.resourceComStatus" placeholder="请选择状态">
            <el-option
              v-for="item in resourceComStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"
                    style="width: 90%"
                    type="textarea" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="setComplete('form')" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  export default {
    props: ['callback', 'id', 'apiUrl'],
    data (){
      return {
        form: {
          resourceComStatus: '',
          remark: ''
        },
        btn: {
          txt: '保 存',
          disabled: false
        }
      }
    },
    computed: {
      ...mapState('select', {
        resourceComStatusOptions: state => state.resourceProStatus
      })
    },
    methods: {
      setComplete (formname){
        this.$refs[formname].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '保存中';
            this.$http.put(this.apiUrl, this.$qs.stringify({
              id: this.id,
              status: this.form.resourceComStatus,
              desc: this.form.remark
            })).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '设置成功'
                });
                this.$store.commit('showModal');
                this.resetParam(this.form);
                this.doSearch(this.callback)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
              this.btn.txt = '保 存'
            })
          }
        })
      }
    }
  }
</script>
