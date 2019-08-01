const mutations = {
  showModal: (state, data) => {
    if(data !== undefined){
      state.showModal = data
      return false
    }
    state.showModal = !state.showModal
  },
  showModalPwd: (state, data) => {
    state.showModalPwd = !state.showModalPwd
  },
  showModalInfo: (state, data) => {
    if(data !== undefined){
      state.showModalInfo = data
      return false
    }
    state.showModalInfo = !state.showModalInfo
  },
  languageList: (state, data) => {
    state.languageList = data
  }
}

export default mutations
