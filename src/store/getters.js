const getters = {
  loginToken: state => state.user.loginToken,
  userName: state => state.user.userName,
  nickName: state => state.user.nickName,
  roles: state => state.user.roles,
  networkType: state => state.user.networkType,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  needReloadRouter: state => state.permission.needReload
}
export default getters
