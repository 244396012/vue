const actions =  {
  switchModal: ({commit}) => {
    commit('switchModal')
  },
  switchAddModal: ({commit}) => {
    commit('switchAddModal')
  },
  switchEditModal: ({commit}) => {
    commit('switchEditModal')
  },
  switchImportModal: ({commit}) => {
    commit('switchImportModal')
  },
  firstArea: ({commit}, data) => {
    commit('firstArea', data)
  },
  secondArea: ({commit}, data) => {
    commit('secondArea', data)
  },
  languagePair: ({commit}, data) => {
    commit('languagePair', data)
  }
}

export default actions
