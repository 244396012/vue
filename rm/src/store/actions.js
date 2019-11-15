import api from '@/api/index';
import axios from 'axios';
import element from 'element-ui';

const action = {

  //获取语言对
  getLanguagePair ({commit}){
    axios.get('/language/listAll').then(res => {
      if(res.data.message === 'success'){
        const mapC_N = {},
          mapN_C = {};
        commit('setLanguagePair', res.data.data);
        res.data.data.forEach(item => {
          mapN_C[item.chineseName] = item.englishName;
          mapC_N[item.englishName] = item.chineseName;
        });
        commit('mapLanguageC_N', mapC_N);
        commit('mapLanguageN_C', mapN_C);
      }
    })
  },

  //获取一级领域
  getFirstDomain ({commit}){
    axios.get('/domain/listDomain').then(res => {
      if(res.data.message === 'success'){
        commit('setFirstDomain', res.data.data)
      }
    })
  },

  //获取按钮级权限
  getSecondPermission ({ commit, state }){
    axios.defaults.baseURL = api.baseLgURL;
    axios.get('/permission/listPermissionsOfUser',{
      params: {
        userAccount: state.userInfo.account
      }
    }).then(res => {
      if(res.data.message === 'success'){
        commit('setSecondPermission', res.data.data)
      }else{
        element.Message({
          type: 'error',
          message: res.data.message
        })
      }
    });
    axios.defaults.baseURL = api.baseRMURL
  }

};

export default action
