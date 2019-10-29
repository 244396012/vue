import Vue from 'vue'
import axios from 'axios';
import element from 'element-ui';
import qs from 'qs';

const msgBox = element.MessageBox,
  msg = element.Message;

//设置团队通过、不通过
export const setAuditStatus = (params, callback) => {
  msgBox.confirm('是否确认此操作', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.get('/team/setAuditPassedOrNot', {
      params: {
        id: params.id,
        passedOrNot: params.status
      }
    }).then(res => {
      if(res.data.message === 'success'){
        msg.success('操作成功');
        Vue.prototype.doSearch(callback)
      }else{
        msg.error(res.data.message)
      }
    })
  }).catch();
};

//设置个人通过、不通过
export const setUserAuditStatus = (params, callback) => {
  msgBox.confirm('是否确认此操作', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.get('newSkillController/setAuditPassedOrNot', {
      params: {
        id: params.id,
        passedOrNot: params.status
      }
    }).then(res => {
      if(res.data.message === 'success'){
        msg.success('操作成功');
        Vue.prototype.doSearch(callback)
      }else{
        msg.error(res.data.message)
      }
    })
  }).catch();
};

//设置账号禁用、启用、冻结
export const setAccountStatus = (params, callback) => {
  msgBox.confirm('是否确认此操作', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.put('/userExtension/saveUserStatus', qs.stringify({
      userId: params.id,
      userStatus: params.status
    })).then(res => {
      if(res.data.message === 'success'){
        msg.success('操作成功');
        Vue.prototype.doSearch(callback)
      }else{
        msg.error(res.data.message)
      }
    })
  }).catch();
};
