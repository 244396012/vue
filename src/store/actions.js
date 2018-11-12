const actions =  {
  showUserInfo: ({commit}, info) => {
    commit('showUserInfo', info)
  },
  showModal: ({commit}) => {
    commit('showModal')
  },
  showData: ({commit}, data) => {
    commit('showData', data)
  }
}

export default actions
