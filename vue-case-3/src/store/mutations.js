const mutations = {
  showModalPwd: (state) => {
    state.showModalPwd = !state.showModalPwd
  },
  showModalInfo: (state, data) => {
    if(data !== undefined){
      state.showModalInfo = data;
      return false
    }
    state.showModalInfo = !state.showModalInfo
  },
  showModal: (state, data) => {
    if(data !== undefined){
      state.showModal = data;
      return false
    }
    state.showModal = !state.showModal
  },
  languageList: (state, data) => {
    state.languageList = data;
  },
  updateData: (state, data) => {
    state.updateData = data;
  }
};

export default mutations
