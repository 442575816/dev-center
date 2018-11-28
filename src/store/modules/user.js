import { requestLogin, requestLoginByToken } from '@/api/api'
import { Message } from 'element-ui'


const user = {
  state: {
    userName: '',
    nickName: '',
    networkType: '',
    loginToken: '',
    roles: [],
  },

  mutations: {
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_NETWORKTYPE: (state, networkType) => {
      state.networkType = networkType
    },
    SET_LOGINTOKEN: (state, loginToken) => {
      state.loginToken = loginToken
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },

  actions: {
    // 用户名密码登录
    RequestLogin({ commit, dispatch }, form) {
      return new Promise((resolve, reject) => {
        requestLogin({userName: form.userName, password: form.password}).then(response => {
          if (response.state == 0) {
            Message.error(response.data.msg)
            resolve(response)
            return
          }
          const data = response.data
          commit('SET_LOGINTOKEN', data.loginToken)
          commit('SET_USERNAME', data.userName)
          commit('SET_NICKNAME', data.nickName)
          commit('SET_NETWORKTYPE', data.networkType)
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
          } else {
            data.roles = ['comm']
            commit('SET_ROLES', ['comm'])
          }
          dispatch('GenerateRoutes', data.roles)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 用户名密码登录
    RequestLoginByToken({ commit, dispatch }, form) {
      return new Promise((resolve, reject) => {
        requestLoginByToken({userName: form.userName, token: form.token}).then(response => {
          if (response.state == 0) {
            resolve(response)
            return
          }
          const data = response.data
          commit('SET_LOGINTOKEN', data.loginToken)
          commit('SET_USERNAME', data.userName)
          commit('SET_NICKNAME', data.nickName)
          commit('SET_NETWORKTYPE', data.networkType)
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
          } else {
            data.roles = ['comm']
            commit('SET_ROLES', ['comm'])
          }
          dispatch('GenerateRoutes', data.roles)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_LOGINTOKEN', '')
        commit('SET_ROLES', [])
        resolve()
      })
    },
  }
}

export default user
