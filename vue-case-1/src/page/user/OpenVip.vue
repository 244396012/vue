<template>
  <div>
    <div class="user-nav">
      <a class="active" href="javascript:;">公司转账</a>
    </div>
    <div class="open-content">
      <p><span>开户行：</span>{{account}}</p>
      <p><span>银行卡号：</span>{{cardNum}}</p>
      <p><span>持卡人：</span>{{accountUser}}</p>
    </div>
    <h3 style="color: red;font-size: 16px">注意事项</h3>
    <p style="font-size: 14px">请将对应款项汇至本账户，工作人员将为您开通会员。如有任何疑问请联系 <b style="color: red">{{tel}}</b></p>
  </div>
</template>
<script>
  export default {
    name: 'OpenVip',
    data (){
      return {
        account:'中国工商银行 锦江区支行',
        cardNum:'62178 66300 0369 2589',
        accountUser:'中国对外投资承包商会',
        tel: '028-12345678'
      }
    },
    mounted (){
      this.getBankInfo()
    },
    methods: {
      getBankInfo (){
        this.$ajax.get('/common/bankAccout')
          .then(res =>{
            if(res.status === 200 && res.data){
              this.account = res.data.bank
              this.cardNum = res.data.card
              this.accountUser = res.data.handler
              this.tel = res.data.phone
            }
          })
      }
    }
  }
</script>
<style lang="scss">
@import "../../style/user-nav";
  .open-content{
    border: 1px solid #ccc;
    padding: 15px 20px;
    background: #f8f8f8;
    p{
      line-height: 26px;
      span{
        display: inline-block;
        margin-right: 5px;
        width: 80px;
        text-align: justify;
        text-align-last: justify;
        color: #8a8a8a;

      }
    }
  }
</style>
