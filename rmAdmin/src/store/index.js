import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  resetSearchState: false, //重置搜索状态，false代表未重置
  noReadMsg : '',
  regPhone: /^1[1-9][0-9]{9}$/,
  regEmail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  regCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  userCode: '',
  userInfo: {},
  secondPermission: {},
  tableHeight: 9999, //全局状态，默认表格高度
  showModal: false, //全局状态，控制模态框显示/隐藏
  showModalInfo: false, //layout页面，“个人信息”模态框
  showModalPwd: false, //layout页面，“修改密码”模态框
  mapLanguageListN_C: {}, //全局状态，语言对map值 name -> code
  mapLanguageListC_N: {}, //全局状态，语言对map值 code -> name
  languageList: [], //全局状态，语言对
  fieldOptions: [], //全局状态，一级领域
  updateData: null //全局状态，动态存储模态框弹出时，修改填充的数据
};

const getters = {


};

import select from './module/select';
import mutations from './mutations';
import actions from './actions';

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    select
  }
});

export default store;
