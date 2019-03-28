const mutations = {
  switchModal: state => {
    state.switchModal = !state.switchModal
  },
  switchAddModal: state => {
    state.switchAddModal = !state.switchAddModal
  },
  switchEditModal: state => {
    state.switchEditModal = !state.switchEditModal
  },
  switchImportModal: state => {
    state.switchImportModal = !state.switchImportModal
  },
  firstArea: (state, data) => {
    state.firstArea = data
  },
  secondArea: (state, data) => {
    state.secondArea = data
  },
  languagePair: (state, data) => {
    state.languagePair = data
  }
}

export default mutations
