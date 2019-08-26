<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>真实姓名：</b>{{detail.realName}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>译员编号：</b>{{detail.staffNo}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>用户昵称：</b>{{detail.nickName}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>登录账号：</b>{{detail.account}}</el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>反馈类型：</b>{{detail.feedbackType}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="24">
            <div class="grid-content bg-purple sy-line"><b style="display: table-cell;vertical-align: top">反馈内容：</b>
              <div style="display: table-cell;">
                {{detail.feedbackContent}}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 0px;">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <b style="display: inline-block;height: 100px;vertical-align: 85px;">相关附件：</b>
              <template v-for="(url, index) in imgUrls">
                <el-image
                  style="width: 120px; height: 100px;margin-right: 10px"
                  :src="url"
                  :preview-src-list="[url]">
                </el-image>
              </template>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"><div class="grid-content bg-purple"><b>反馈时间：</b>{{detail.gmtCreate}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="20"><div class="grid-content bg-purple"><b>反馈等级：</b>
            <el-radio-group v-model="form.feedbackLevel">
              <el-radio label="重大反馈"></el-radio>
              <el-radio label="一般反馈"></el-radio>
              <el-radio label="零反馈"></el-radio>
            </el-radio-group>
          </div></el-col>
        </el-row>
      </div>
      <div style="padding: 25px">
        <el-button @click="setLevelFn" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        detail: '',
        imgUrls: [],
        form: {
          feedbackLevel: ''
        },
        btn: {
          txt: '提 交',
          disabled: false
        },
      }
    },
    mounted (){
      this.showAdviceDetail()
    },
    methods: {
      //获取详情
      showAdviceDetail (){
        this.$http({
          type: 'get',
          url: '/feedback/findFeedBackDetail?id='+this.$route.params.id
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail = res.data.data;
            this.imgUrls = res.data.data.feedbackAttatch && JSON.parse(res.data.data.feedbackAttatch);
          }
        })
      },
      //设置等级
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
          url: '/feedback/setFeedBackLevel?id='+this.$route.params.id+'&feedBackLevel='+this.form.feedbackLevel
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '设置成功'
            });
            this.form.feedbackLevel = '';
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
