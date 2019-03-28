exports.install = function (Vue, options) {
  /*
  * 获取二级领域
  * */
  Vue.prototype.getSecondArea = function (id) {
    this.$http.get('/dictionary/domain/listSub?pSpecialtyId='+id)
      .then(res => {
        if(res.data.message === 'success' && res.data.data.length >= 0){
          this.$store.commit('secondArea', res.data.data)
        }
      })
  }
}
