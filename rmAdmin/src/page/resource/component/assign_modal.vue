<template>
  <div>
    <el-dialog
      title="修改兼职译员"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form :model="form" ref="form" label-width="95px">
        <el-form-item label="兼职译员：" required>
          <search-parttime ref="searchPartMd"></search-parttime>
        </el-form-item>
        <el-form-item label="译员等级："
                      :prop="'level'"
                      :rules="{ required: true, message: '请选择译员等级', trigger: 'blur' }">
          <el-select v-model="form.level"
                     style="width: 100%"
                     placeholder="请选择译员等级">
            <el-option
              v-for="item of $parent.memberLevel"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价：" >
          <el-input v-model="form.price"
                    clearable
                    type="number" placeholder="请输入单价"></el-input>
        </el-form-item>
        <el-form-item label="备注：" >
          <el-input v-model="form.remark"
                    clearable
                    type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmModify('form')" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import searchPart from './searchParttime';
  import { mapState } from 'vuex';
  import { formatLevel } from '@/common/filter';
  export default {
    props: ['callback','updatedata'],
    components: {
      'search-parttime': searchPart,
    },
    data (){
      return {
        form: {
          id: '',
          projectNo: '',
          status: '',
          level: '',
          price: '',
          remark: ''
        },
        btn: {
          txt: '确 认',
          disabled: false
        }
      }
    },
    watch: {
      updatedata (newval){
        if(typeof(newval) === 'object'){
          if(newval.partTimeName && newval.partTimeNo){
             setTimeout(() => {
               this.$refs.searchPartMd.form.member = newval.partTimeName+','+newval.partTimeNo
             }, 100)
          }
          this.form.level = this.formatLevel(newval.testLevel);
          this.form.price = newval.unitPrice;
          this.form.remark = newval.remarks;
          this.form.projectNo = newval.projectNo;
          this.form.id = newval.id;
        }
      }
    },
    computed: {
      ...mapState('select', {
        resourceComStatusOptions: state => state.resourceComStatus
      })
    },
    methods: {
      formatLevel: formatLevel,
      //确认修改
      confirmModify (formName){
        if(!this.$refs.searchPartMd.form.member){
          this.$message({
            type: 'warning',
            message: '请选择兼职译员'
          });
          return false
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '保存中';
            let url = '/resourceOrder/updateInterpreter',
              data = {
                id: this.form.id,
                projectNo: this.form.projectNo,
                partTimeName: this.$refs.searchPartMd.form.member.split(',')[0] || '',
                partTimeNo: this.$refs.searchPartMd.form.member.split(',')[1] || '',
                testLevel: this.form.level,
                unitPrice: this.form.price,
                remarks: this.form.remark
              };
            this.$http.put(url, this.$qs.stringify(data))
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '分配成功'
                  });
                  this.doSearch(this.callback);
                  this.$store.commit('showModal');
                  this.resetParam(this.form);
                  this.$refs.searchPartMd.form.member = ''
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
                this.btn.disabled = false;
                this.btn.txt = '确 认'
              })
          }
        })
      }
    }
  }
</script>
