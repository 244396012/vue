<template>
  <div class="rm-cg">
    <el-dialog
      title="消息详情"
      width="500px"
      style="line-height: 1.8"
      :visible.sync="$store.state.showModal"
      center>
      <p><b>消息标题：</b>{{detail.head}}</p>
      <p><b>消息分类：</b>{{detail.type | formatType}}</p>
      <p><b>发送时间：</b>{{detail.publishTime}}</p>
      <div><b>正文内容：</b><div style="display: inline-block" v-html="detail.content"></div></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ['detail'],
    filters: {
      formatType (type){
        switch (String(type)){
          case '0': return '系统消息';
          default: return type;
        }
      }
    }
  }
</script>
