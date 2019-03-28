import vue from 'vue'
import vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

vue.use(vuex)

const store = new vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
