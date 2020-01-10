//帐号状态
export const formatAccountStatus = (status) => {
  switch (+status){
    case -1: return '冻结';
    case 0: return '停用';
    case 1: return '启用';
  }
};

//资源单-客户项目状态
export const formatResourceCusStatus = (status) => {
  switch (+status){
    case 0: return '项目预告';
    case 1: return '项目执行中';
    case 2: return '项目流失';
  }
};

//资源单-项目完成状态
export const formatResourceProWpStatus = (status) => {
  switch (+status){
    case 0: return '前期咨询';
    case 1: return '投标';
    case 2: return '谈判中';
    case 3: return '已签单';
    case 4: return '项目暂停';
    case 5: return '项目流失';
  }
};

//资源单-项目完成状态
export const formatResourceProStatus = (status) => {
  switch (+status){
    case 0: return '进行中';
    case 1: return '已完成';
    case 2: return '项目成功';
    case 3: return '项目失败';
  }
};

//格式化数字
export const  formatNum = (num) => {
  switch (num){
    case 1: return '一';
    case 2: return '二';
    case 3: return '三';
    case 4: return '四';
    case 5: return '五';
    case 6: return '六';
    case 7: return '七';
    case 8: return '八';
    case 9: return '九';
    case 10: return '十';
  }
};

//等级
export const formatLevel = (level) => {
  if(!level){
    return '';
  }else if(level.includes('P')){
    return level
  }else{
    return 'P'+level
  }
};

//获取领域(数组array)
export const formatDomains = (arr) => {
  let str = '';
  if(typeof(arr) === 'object'){
    arr.forEach(item => {
      str += item.fullSpecialtyName+" ";
    });
  }
  return str;
};
//获取领域(数组字符串)
export const formatDomainsStr = (str) => {
  if(str.includes('[')){
    const arr = JSON.parse(str);
    return arr.toString();
  }
  return str;
};

//隐藏手机号、邮箱
export const hiddenAccount = (str) => {
  if(str.includes('@')){//邮箱  123456@qq.com
    return str.replace(/(\w{1})(\w+)/, '$1****')
  }
  //手机号 13900000000
  return str.replace(/(\d{3})(\d{4})/, '$1****')
};

//财务：支付状态
export const formatPayStatus = (status) => {
  switch (String(status)){
    case '0': return '未付款';
    case '1': return '已锁定';
    case '2': return '付款成功';
    case '3': return '付款中';
    case '4': return '付款失败';
  }
};

//币种转换
export const formatMoneyType = (code = '') => {
  switch (code.toLowerCase()){
    case 'cny': return '人民币';
    case 'usd': return '美元';
    case 'eur': return '欧元';
    case 'gbp': return '英镑';
    default: return code
  }
};
export const formatMoneyTypeEn = (code = '') => {
  switch (code.toLowerCase()){
    case '人民币': return '￥';
    case '美元': return '＄';
    case '欧元': return '€';
    case '英镑': return '￡';
    default: return code
  }
};
export const formatMoneyTypeEn$ = (code = '') => {
  switch (code.toLowerCase()){
    case 'cny': return '￥';
    case 'usd': return '＄';
    case 'eur': return '€';
    case 'gbp': return '￡';
    default: return code
  }
};

//消息类型
export const formatMsgType = (type) => {
  switch (String(type)){
    case '0': return '系统消息';
    default: return type;
  }
};

