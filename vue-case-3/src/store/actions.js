const action = {
  showModal: ({commit}, data) => {
    commit('showModal', data)
  },
  showModalPwd: ({commit}, data) => {
    commit('showModalPwd', data)
  },
  showModalInfo: ({commit}, data) => {
    commit('showModalInfo', data)
  },
  languageList: ({commit}, data) => {
    commit('languageList', data)
  }
}

export default action
