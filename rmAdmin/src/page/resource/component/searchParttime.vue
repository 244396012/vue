<template>
  <el-select
    style="width: 100%"
    v-model="form.member"
    filterable
    clearable
    remote
    reserve-keyword
    placeholder="请输入姓名搜索"
    :remote-method="doSearchMember"
    :loading="loading">
    <el-option
      v-for="(item, index) in formSelect.memberOptions"
      :key="index"
      :label="item.label+'（'+item.value+'）'"
      :value="item.label+','+item.value">
    </el-option>
  </el-select>
</template>
<script>
  export default {
    data (){
      return {
        form: {
          member: ''
        },
        formSelect: {
          memberOptions: []
        },
        loading: false,
        timer: null
      }
    },
    created (){
      this.searchMember()
    },
    methods: {
      //搜索
      searchMember (name = ''){
        this.loading = true;
        this.$http.get('/userInfoController/listPartTimeStaff', {
          params: {
            userRealName: name
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.formSelect.memberOptions = res.data.data.map(item => {
              return {
                label: item.realName,
                value: item.translatorId
              }
            })
          }
          this.loading = false;
        })
      },
      //搜索兼职
      doSearchMember (query){
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (query !== '') {
            this.searchMember(query)
          } else {
            this.formSelect.memberOptions = []
          }
        }, 500)
      }
    }
  }
</script>
