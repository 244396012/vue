import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  tableHeight: 500, //全局状态，默认表格高度
  showModal: false, //全局状态，控制模态框显示/隐藏
  showModalInfo: false, //layout页面，“个人信息”模态框
  showModalPwd: false, //layout页面，“修改密码”模态框
  languageList: [], //全局状态，语言对list
  updateData: null //全局状态，动态存储模态框弹出时，修改填充的数据
};

const getters = {
  languageList: (state) => {
    return state.languageList;
  },

};

import mod1 from './module/mod1';
import mutations from './mutations';
import actions from './actions';

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    mod1
  }
});

export default store;
