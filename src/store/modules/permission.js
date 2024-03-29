import { constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  GenerateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTES', asyncRouter)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
