const mutations = {
  showUserInfo: (state, info) => {
    state.account = info
  },
  showModal: state => {
    state.show = !state.show
  },
  showData: (state, data) => {
    state.data = data
  }
}

export default mutations
