<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" style="width: 80%;min-width: 900px;">
          <el-form-item label="消息标题：">
            <el-input type="text" v-model="ruleForm.title" readonly style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="消息分类：">
            <el-input type="text" v-model="ruleForm.type" readonly style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="接收人员：">
            <el-input type="text" v-model="ruleForm.persons" readonly style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="正文内容：">
            <quill-editor :options="quillOption" v-model="ruleForm.content" disabled></quill-editor>
          </el-form-item>
          <el-form-item :label="ruleForm.timeType">
            {{detail.publishTime?detail.publishTime:detail.gmtCreate}}
          </el-form-item>
          <el-form-item label="操作人：">{{detail.operatePerson}}</el-form-item>
          <el-form-item v-if="!detail.sended" style="margin-top: 2rem">
            <el-button @click="$router.push('/article/message/modify/'+$route.params.id)">修改</el-button>
            <el-button type="success" @click="clickSend">立即发布</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor';
  import quillConfig from '@/common/quill-config';
  import { formatMsgType } from '@/common/filter';
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        quillOption: quillConfig,
        ruleForm: {
          title: '',
          type: '',
          content: '',
          persons: '',
          operatePerson: '',
          timeType: '保存时间：'
        },
        detail: {},
        btn: {
          disabled: false
        }
      }
    },
    created (){
      this.showDetail()
    },
    methods: {
      formatType: formatMsgType,
      //获取详情
      showDetail (){
        this.$http.get('/notice/sysNoticeDetails', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const data = res.data.data;
            this.detail = data;
            this.ruleForm.title = data.head;
            this.ruleForm.type = this.formatType(data.type);
            this.ruleForm.content = data.content;
            this.ruleForm.persons = data.receivePersonType;
            this.ruleForm.operatePerson = data.operatePerson;
            this.ruleForm.timeType = data.publishTime ? '发布时间：' : '保存时间：';
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //点击发布
      clickSend (){
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/notice/immediatelyPublish',this.$qs.stringify({
            sysNoticeId: this.$route.params.id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '发布成功'
              });
              setTimeout(() => {
                this.$router.push('/article/message')
              }, 1000)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../style/quill.snow.css";
</style>
