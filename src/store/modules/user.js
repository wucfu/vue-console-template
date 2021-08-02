import { login } from '@/api/system/user'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import jwt_decode from 'jwt-decode'

const getDefaultState = () => {
  return {
    token: getToken(),
    refreshToken: getRefreshToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [],
    resource: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_RESOURCE: (state, resource) => {
    state.resource = resource
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        commit('SET_REFRESH_TOKEN', data.refreshToken)
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve) => {
      const data = jwt_decode(state.token)
      commit('SET_ROLES', data.roles)
      commit('SET_NAME', data.username)
      commit('SET_RESOURCE', data.resource)
      resolve({ 'roles': data.roles })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken()
      removeRefreshToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  refreshToken({ commit }, tokens) {
    return new Promise(resolve => {
      const { accessToken, refreshToken } = tokens
      commit('SET_TOKEN', accessToken)
      commit('SET_REFRESH_TOKEN', refreshToken)
      setToken(accessToken)
      setRefreshToken(refreshToken)
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

