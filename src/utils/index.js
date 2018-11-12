export default {
  /*
  * 获取当前页、上一页url相关信息，返回面包屑导航字符串
  * */
  getBreadNav (len, curr, prev){
    let prevPath = prev.fullPath
    let prevTitle = prev.meta.title
    let currPath = curr.fullPath
    let currTitle = curr.query.type
    /*
     * 搜索页面详情页面刷新，返回null，不显示面包屑导航
     * */
    if(currPath.includes('/search/detail/')){
      return null
    }
    /*
    * 从下面几个路由跳转时，直接调用本地localStorage，返回面包屑导航字符串
    * */
    if(prevPath === '/'
      || prevPath.includes('/sort/detail/')
      || prevPath.includes('/sort-ics/detail/')
      || prevPath.includes('/sort-css/detail/')){
      if(len === 2){
        return localStorage.getItem('my_local_routes_bread_nav')
      }else if(len === 3){
        return localStorage.getItem('my_local_routes_bread_nav')
          + `
            <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
            <a href="${currPath}">${decodeURIComponent(currTitle)}</a>
          `
      }
    }else{
      let navStr = ''
      if(len === 2){
        navStr = `
                <a href="${prevPath}">${decodeURIComponent(prevTitle)}</a>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
                <a href="${currPath}">${decodeURIComponent(currTitle)}</a>
              `
        localStorage.setItem('my_local_routes_bread_nav',navStr)
      }else if(len === 3){
        navStr = localStorage.getItem('my_local_routes_bread_nav')
          + `
            <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
            <a href="${currPath}">${decodeURIComponent(currTitle)}</a>
          `
      }
      return navStr
    }
  },
  /*
  * 获取url中参数的值
  * */
  getUrlKey:function(name){
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  },
  /*
  * format时间格式
  * */
  formatTime (timeStr,detail){
    let str = ''
    const time = new Date(timeStr)
    const year = time.getFullYear()
    const month = time.getMonth()+1
    const date = time.getDate()
    const hour = time.getHours()
    const minute = time.getMinutes()
    str = detail ? `${year}.${month}.${date} ${hour}:${minute}` : `${year}.${month}.${date}`
    return str
  }
}


