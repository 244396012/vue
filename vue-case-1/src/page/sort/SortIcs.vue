<template>
  <div class="sort-label">
    <template v-for="item in list">
      <router-link :key="item.id" :to="{path:'/sort-ics/'+item.id,query:{tId:item.id,type: item.tyNum+' '+item.tyName}}">{{ item.tyNum+' '+item.tyName }}</router-link>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'SortIcs',
    data (){
      return {
        // list: [
        //   {id:'1',zh:'综合、术语学、标准化、文献',en:'01'},
        //   {id:'2',zh:'社会学、服务、公司(企业)的组织和管理、行政、运输',en:'03'},
        //   {id:'3',zh:'数学、自然科学',en:'07'},
        //   {id:'4',zh:'医药卫生技术',en:'11'},
        //   {id:'5',zh:'环保、保健和安全',en:'13'},
        //   {id:'6',zh:'计量学和测量、物理现象',en:'17'},
        //   {id:'7',zh:'试验 ［该类仅包括试验通用标准;分析化学，见71.040］',en:'19'},
        //   {id:'8',zh:'机械系统和通用件',en:'21'},
        //   {id:'9',zh:'流体系统和通用件 ［流体流量的测量，见17.120］',en:'23'},
        //   {id:'10',zh:'机械制造 ［该类包括通用标准］',en:'25'},
        //   {id:'11',zh:'能源和热传导工程',en:'27'},
        //   {id:'12',zh:'电气工程',en:'29'},
        //   {id:'13',zh:'电子学',en:'31'},
        //   {id:'14',zh:'电信、音频和视频工程',en:'33'},
        //   {id:'15',zh:'信息技术、办公机械',en:'35'},
        //   {id:'16',zh:'成像技术',en:'37'},
        //   {id:'17',zh:'精密机械、珠宝',en:'39'},
        //   {id:'18',zh:'道路车辆工程',en:'43'},
        //   {id:'19',zh:'铁路工程',en:'45'},
        //   {id:'20',zh:'造船和海上构筑物',en:'47'},
        //   {id:'21',zh:'航空器和航天器工程',en:'49'},
        //   {id:'22',zh:'材料储运设备',en:'53'},
        //   {id:'23',zh:'货物的包装和调运',en:'55'},
        //   {id:'24',zh:'纺织和皮革技术',en:'59'},
        //   {id:'25',zh:'服装工业',en:'61'},
        //   {id:'26',zh:'农业',en:'65'},
        //   {id:'27',zh:'食品技术',en:'67'},
        //   {id:'28',zh:'化工技术',en:'71'},
        //   {id:'29',zh:'采矿和矿产品',en:'73'},
        //   {id:'30',zh:'石油及相关技术',en:'75'},
        //   {id:'31',zh:'冶金',en:'77'},
        //   {id:'32',zh:'木材技术',en:'79'},
        //   {id:'33',zh:'玻璃和陶瓷工业',en:'81'},
        //   {id:'34',zh:'橡胶和塑料工业',en:'83'},
        //   {id:'35',zh:'造纸技术',en:'85'},
        //   {id:'36',zh:'涂料和颜料工业',en:'87'},
        //   {id:'37',zh:'建筑材料和建筑物',en:'91'},
        //   {id:'38',zh:'土木工程',en:'93'},
        //   {id:'39',zh:'军事工程',en:'95'},
        //   {id:'40',zh:'家用和商用设备、文娱、体育',en:'97'}
        // ]
        list: []
      }
    },
    mounted(){
      this.$ajax.get('/type/get_foreignOrChina').then(response => {
        this.list = response.data
      })
    }
  }
</script>
<style lang="scss">
  @import "../../style/sort";
</style>
