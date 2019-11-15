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
  mapLanguageN_C: (state, data) => {
    state.mapLanguageListN_C = data
  },
  mapLanguageC_N: (state, data) => {
    state.mapLanguageListC_N = data
  },
  setLanguagePair: (state, data) => {
    state.languageList = data
  },
  setFirstDomain: (state, data) => {
    state.fieldOptions = data
  },
  setUserCode: (state, data) => {
    state.userCode = data
  },
  setUserInfo: (state, data) => {
    state.userInfo = data
  },
  setSecondPermission: (state, data) => {
    state.secondPermission = data
  },
  updateData: (state, data) => {
    state.updateData = data
  }
};

export default mutations
