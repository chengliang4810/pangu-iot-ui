import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import dict from './modules/dict'
import permission from './modules/permission'
import publicData from '@/store/modules/publicData'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    dict,
    permission,
    publicData
  },
  getters
})

export default store
