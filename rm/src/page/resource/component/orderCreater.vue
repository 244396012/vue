<template>
  <div style="display: inline-block">
    <el-form-item label="派单人">
      <el-select v-model="form.orderCreater" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in formSelect.createrList"
          :key="index"
          :label="item.value"
          :value="item.key"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        form: {
          orderCreater: ''
        },
        formSelect: {
          createrList: []
        }
      }
    },
    created (){
      let path = this.$route.path, selectType = '';
      switch (path){
        case '/resource/written':
          selectType = 'translation_order';
          break
        case '/resource/meeting':
          selectType = 'exhibition_order';
          break
        case '/resource/send':
          selectType = 'expatriate_order';
          break
        case '/resource/train':
          selectType = 'training_order';
          break
      }
      this.$http.get('/resourceOrder/getOrderPersonSelect',{
        params: {
          name: '',
          pageNo: 0,
          pageSize: 999,
          table: selectType
        }
      }).then(res => {
          if(res.data.message === 'success'){
            this.formSelect.createrList = res.data.data.results
          }
        })
    }
  }
</script>
