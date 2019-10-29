/*
* 模块：Vue注册全局函数
* */
import axios from 'axios'
import qs from 'qs'
import element from 'element-ui'
import store from '@/store/index'
export default {
  install: (Vue, options) => {
    window.w_formatProtocolUrl = (url) => {
      let defaultProtocol = 'http://';
      if(url.includes('http://') || url.includes('https://') || !url){
        return url;
      }else{
        return defaultProtocol + url;
      }
    };
    //格式化协议
    Vue.prototype.formatProtocolUrl = w_formatProtocolUrl;
    //搜索
    Vue.prototype.doSearch = (callback) => {
      store.state.resetSearchState = true;
      callback();
    };
    //重置搜索
    Vue.prototype.resetSearch = (params, callback) => {
      if(typeof params === 'undefined' || params === null){
        return params;
      }
      if(typeof params === 'object'
        && (Object.prototype.toString.call(params) === '[object Object]'
        || Object.prototype.toString.call(params) === '[object Array]')){
        for(let prop in params){
          if(typeof params[prop] === 'object'){
            params[prop] = Array.isArray(params[prop]) ? [] : {}
          }else{
            params[prop] = ''
          }
        }
      }
      store.state.resetSearchState = true;
      callback()
    };
    //重置数据
    Vue.prototype.resetParam = (params) => {
      if(typeof params === 'undefined' || params === null){
        return params;
      }
      if(typeof params === 'object'
        && (Object.prototype.toString.call(params) === '[object Object]'
          || Object.prototype.toString.call(params) === '[object Array]')){
        for(let prop in params){
          if(typeof params[prop] === 'object'){
            params[prop] = Array.isArray(params[prop]) ? [] : {}
          }else{
            params[prop] = ''
          }
        }
      }
    };
    //（批量）删除表格数据
    Vue.prototype.deleteTableRows = (config) => {
      config = config ||　{};
      if(config.multipleSelection && config.multipleSelection.length === 0){
        element.Message({
          type: 'warning',
          message: '请先勾选操作项'
        });
        return false
      }
      element.MessageBox.confirm('是否确认删除，删除后无法撤销', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idArr = [];
        config.id && idArr.push(config.id);
        if(config.multipleSelection){
          config.multipleSelection.forEach(item => {
            idArr.push(item.id)
          })
        }
        axios.delete(config.url,{
          params: {
            ids: idArr.toString()
          }
        }).then(res => {
          if(res.data.message === 'success'){
            element.Message({
              type: 'success',
              message: '删除成功'
            });
            Vue.prototype.doSearch(config.callback)
          } else {
            element.Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }).catch(() => {})
    };
    //批量禁用、启用
    Vue.prototype.batchForbidAndUse = (config) => {
      config = config ||　{};
      if(config.multipleSelection.length === 0){
        element.Message({
          type: 'warning',
          message: '请先勾选操作项'
        });
        return false
      }
      element.MessageBox.confirm('是否确认此操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idArr = [];
        config.multipleSelection.forEach(item => {
          idArr.push(item.id)
        });
        axios.put(config.url, qs.stringify({
          ids: idArr.toString()
        })).then(res => {
          if(res.data.message === 'success'){
            element.Message({
              type: 'success',
              message: '操作成功'
            });
            Vue.prototype.doSearch(config.callback)
          }else{
            element.Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }).catch(()=>{})
    };
    //下载模版
    Vue.prototype.downLoad = url => {
      axios.get(url)
        .then(res => {
          if(res.data.code === '200' && res.data.data !== ''){
            const a = document.createElement('a');
            a.href = res.data.data;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }else{
            element.Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
    };
    //获取一级领域
    Vue.prototype.getFirstField = async () => {
      return await axios.get('/domain/listDomain')
        .then(res =>{
          if(res.data.message === 'success'){
            return res.data.data;
          }
        })
    };
    //获取二级领域
    Vue.prototype.getSecondField = async (id) => {
      return await axios.get('/domain/listSub',{
        params: {
          pSpecialtyId: id
        }
      }).then(res =>{
          if(res.data.message === 'success'){
            return res.data.data;
          }
        })
    };
    //获取权限
    Vue.prototype.getPermission = async () => {
      return await axios.get('/module/getMenue')
        .then(perssion =>{
          return perssion
        })
    };
    //根据权限，匹配路由
    Vue.prototype.matchPermission = (routes, permission) => {
      let allChildren = [],
        matchedAll = [],
        matchedAllChildren = [];
      for(let i = 0, len = permission.length; i < len; i++){
        const _permission = permission[i];
        for(let j = 0, len = routes.length; j < len; j++){
          const _route = routes[j];
          if(_permission.moduleName === _route.name){
            const tempArr =  allChildren.concat(_route.children);
            _route.children = [];
            matchedAll.push(_route);
            allChildren = tempArr;
            break
          }
        }
      }
      for(let i = 0, len = permission.length; i < len; i++){
        const _permission = permission[i];
        for(let j = 0, len = allChildren.length; j < len; j++){
          const matchedChild = allChildren[j];
          if(_permission.moduleName === matchedChild.name){
            matchedAllChildren.push(matchedChild);
            break
          }
        }
      }
      matchedAll.forEach((item, index) => {
        matchedAllChildren.forEach(item1 => {
          if(item1.path.startsWith(item.path + '/')){
            matchedAll[index].children.push(item1)
          }
        })
      });
      return matchedAll || [];
    }
  }
}
