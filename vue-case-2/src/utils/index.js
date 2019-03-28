/*
* 处理面包屑导航
* */
function getBread (route){
  const defaults = {
    routes: route.routes,
    routers: route.router
  }
  const _routes = defaults.routers.options.routes.slice(2)
  const curName = defaults.routes.meta.title
  const curPath = defaults.routes.path
  let originalPath, originalName
  for(let i = 0, len = _routes.length; i < len; i++){
    const item = _routes[i]
     if(curPath.includes(item.path)){
       originalName = item.name
       originalPath = item.path
       break
     }
  }
  return {
    curName,
    curPath,
    originalName,
    originalPath
  }
}

export { getBread }
