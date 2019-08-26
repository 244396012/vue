
'use strict';

const utils = {

  //设置面包屑
  breadcrumb: function (route) {
    const arr = [];
    for(let i = 0, len = route.matched.length; i < len; i++){
      const item = route.matched[i];
      arr.push(item.name ? item.name : item.meta.title);
    }
    const breadItem = [...new Set(arr)];
    const breadObj = {};
    switch (breadItem.length){
      case 1:
        breadObj.firstItem = breadItem[0];
        break;
      case 2:
        breadObj.firstItem = breadItem[0] +' / '+ breadItem[1];
        break;
      case 3:
        breadObj.firstItem = breadItem[0] +' / '+ breadItem[1];
        breadObj.secondItem = breadItem[2];
        break;
    }
    return breadObj;
  },
  //滑动解锁
  slide: function () {
    const slideBox = document.querySelector('#slide_box');
    const slideXbox = document.querySelector('#slide_xbox');
    const btn = document.querySelector('#slide_btn');
    const slideBoxWidth = slideBox.offsetWidth;
    const btnWidth = btn.offsetWidth;
    //pc端
    btn.ondragstart = function () {
      return false;
    };
    btn.onselectstart = function () {
      return false;
    };
    btn.onmousedown = function (e) {
      const disX = e.clientX - btn.offsetLeft;
      document.onmousemove = function (e) {
        let objX = e.clientX - disX + btnWidth;
        if (objX < btnWidth) {
          objX = btnWidth
        }
        if (objX > slideBoxWidth) {
          objX = slideBoxWidth
        }
        slideXbox.style.width = objX + 'px';
      };
      document.onmouseup = function (e) {
        let objX = e.clientX - disX + btnWidth;
        if (objX < slideBoxWidth) {
          objX = btnWidth;
        } else {
          objX = slideBoxWidth;
          slideXbox.innerHTML = '验证通过<div id="slide_btn" data-code="true"><i class="el-icon-circle-check-outline"></i></div>';
        }
        slideXbox.style.width = objX + 'px';
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  },
  //判断对象所有属性不为''、null、undefined
  validateObj: function (obj) {
    let flag = true;
    if(Object.prototype.toString.call(obj) === '[object Object]'){
      for(let key in obj){
        if(!obj[key]) {
          return false;
        }
      }
    }else{
      return 'Not Object';
    }
    return flag;
  }
};

export default utils
