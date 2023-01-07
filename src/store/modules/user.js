import { login, getPublicKey, getInfo, logout } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  loadPublicKey,
  savePublicKey,
} from '@/utils/auth'
import { encrypt } from '@/utils/rsaEncrypt'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
  },
  // 可以理解为监听事件
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
  },
  // Action 提交的是 mutation，而不是直接变更状态。
  actions: {
    // 获取状态 status
    GetPublicKey({ commit }) {
      return new Promise((resolve, reject) => {
        getPublicKey()
          .then((res) => {
            savePublicKey(res)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const userInfo = res
            setUserInfo(userInfo, commit)
            // const publicKey = res.publicKey
            // savePublicKey(publicKey)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登录
    Login({ commit }, userInfo) {
      const userForm = {
        username: userInfo.username,
        // 'password': encrypt(loadPublicKey(), userInfo.password),
        password: userInfo.password,
        // 'remember-me': userInfo.rememberMe,
        // 'validateCode': userInfo.validateCode,
        // 'validateCodeId': userInfo.validateCodeId
      }
      return new Promise((resolve, reject) => {
        login(userForm)
          .then((res) => {
            console.log(res)
            const user = res
            const token = user.token
            // 存储 token
            setToken(token)
            commit('SET_TOKEN', token)
            // 用户公钥
            //  const publicKey = res.publicKey
            //  savePublicKey(publicKey)
            // 用户信息

            console.log(res)
            setUserInfo(user, commit)
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            logOut(commit)
            resolve()
          })
          .catch((error) => {
            logOut(commit)
            reject(error)
          })
      })
    },
    // 更新菜单
    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    },
  },
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (user, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (user.roleList.length > 0) {
    commit('SET_ROLES', user.roleList)
  } else {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  }
  commit('SET_USER', user)
}

export default user
