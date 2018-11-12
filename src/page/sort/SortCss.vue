<template>
  <div class="sort-label">
    <template v-for="item in list">
      <!-- <router-link :to="'/sort-css/'+item.id+'/'+(item.en+' '+item.zh)">{{ item.en+' '+item.zh }}</router-link> -->
      <router-link :key="item.id" :to="{path:'/sort-css/'+item.id,query:{tId:item.id,type: item.tyNum+' '+item.tyName}}">{{ item.tyNum+' '+item.tyName }}</router-link>
    </template>
  </div>
</template>
<script>
  import Axios from "axios"
  export default {
    name: 'SortCss',
    data (){
      return {
        // list: [
        //   {id:'1',zh:'综合',en:'A'},
        //   {id:'2',zh:'农业、林业',en:'B'},
        //   {id:'3',zh:'医药、卫生、劳动保护',en:'C'},
        //   {id:'4',zh:'矿业',en:'D'},
        //   {id:'5',zh:'石油',en:'E'},
        //   {id:'6',zh:'能源、核技术',en:'F'},
        //   {id:'7',zh:'化工',en:'G'},
        //   {id:'8',zh:'冶金',en:'H'},
        //   {id:'9',zh:'机械',en:'J'},
        //   {id:'10',zh:'电工',en:'K'},
        //   {id:'11',zh:'电子元器件与信息技术',en:'K'},
        //   {id:'12',zh:'通信、广播',en:'M'},
        //   {id:'13',zh:'仪器、仪表',en:'N'},
        //   {id:'14',zh:'工程建设',en:'P'},
        //   {id:'15',zh:'建材',en:'Q'},
        //   {id:'16',zh:'公路、水路运输',en:'R'},
        //   {id:'17',zh:'铁路',en:'S'},
        //   {id:'18',zh:'车辆',en:'T'},
        //   {id:'19',zh:'船舶',en:'U'},
        //   {id:'20',zh:'航空、航天',en:'V'},
        //   {id:'21',zh:'纺织',en:'W'},
        //   {id:'22',zh:'食品',en:'X'},
        //   {id:'23',zh:'轻工、文化与生活用品',en:'Y'},
        //   {id:'24',zh:'环境保护',en:'Z'},
        // ]
        list: []
      }
    },
    mounted(){
      Axios.get('/type/get_china').then(response => {
        this.list = response.data
      })
    }
  }
</script>
<style lang="scss">
  @import "../../style/sort";
</style>
