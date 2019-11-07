import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { removeToken} from '@/utils/auth'


const state = {
  userinfo: JSON.parse(localStorage.getItem("user_info")) || {},
  avatar:'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
}

const mutations = {
  FRUSH_USERINFO: (state, user_info) => {
    state.userinfo = user_info
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
}

const actions = {
  // 登录
  login({}, info) {
    return new Promise((resolve, reject) => {
      login(info).then((res) => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { user_info } = response.Data
        commit('FRUSH_USERINFO', user_info)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // removeToken()
        // resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 清除COOK
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

