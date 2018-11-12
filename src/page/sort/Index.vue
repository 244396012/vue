<template>
  <div class="sort-label">
    <template v-for="item in list">
      <router-link :key="item.id" :to="{path:'/sort/'+item.id,query:{tId:item.id,type: item.tyNum+' '+item.tyName}}">{{ item.tyNum+' '+item.tyName }}</router-link>
    </template>
  </div>
</template>
<script>
import Axios from 'axios'
export default {
  name: 'Sort',
  data (){
    return {
      // list: [
      //   {id:'1',zh:'美国国家标准学会',en:'ANSI'},
      //   {id:'2',zh:'美国石油学会',en:'API'},
      //   {id:'3',zh:'澳大利亚标准',en:'AS'},
      //   {id:'4',zh:'美国机械工程协会',en:'ASME'},
      //   {id:'5',zh:'美国材料试验协会',en:'ASTM'},
      //   {id:'6',zh:'英国标准',en:'BS'},
      //   {id:'7',zh:'英国BSI标准',en:'BSI'},
      //   {id:'8',zh:'美国联邦法规',en:'CFR'},
      //   {id:'9',zh:' 加拿大标准',en:'CSA'},
      //   {id:'10',zh:'德国标准',en:'DE'},
      //   {id:'11',zh:'德国DIN标准',en:'DIN'},
      //   {id:'12',zh:'欧洲标准',en:'EN'},
      //   {id:'13',zh:'法国标准',en:'FR'},
      //   {id:'14',zh:'美国电气电子工程师协会',en:'IEEE'},
      //   {id:'15',zh:'日本标准',en:'JP'},
      //   {id:'16',zh:'日本JIS标准',en:' JSA'},
      //   {id:'17',zh:'韩国标准',en:'KS'},
      //   {id:'18',zh:'美国军用标准',en:'MIL'},
      //   {id:'19',zh:'美国机动车工程师学会',en:'SAE'},
      //   {id:'20',zh:'俄罗斯GOST标准',en:'SU'}
      // ]
      list: []
    }
  },
  mounted(){
    Axios.get('/type/get_foreign').then(response => {
      this.list = response.data
    })
  }
}
</script>
<style lang="scss">
  @import "../../style/sort";
</style>
