import { login, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, uuid, code} = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, uuid, code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', 'Bearer ' + data.access_token)
        commit('SET_NAME', data.name)
        getUserInfo().then(res => {
          commit('SET_NAME', res.data.sysUser.name)
          localStorage.setItem('username', res.data.sysUser.name)
          localStorage.setItem('userid', res.data.sysUser.userId)
        })
        setToken('Bearer ' + data.access_token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo().then(response => {
      //   const { data } = response
      //   if (!data) {
      //     return reject('验证失败,请重新登录.')
      //   }
      // const { name, avatar } = data
      // state.dispatch('permission/generateRoutes')
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  getMember({ commit, dispatch }) {
    return new Promise((resolve) => {
      dispatch(
        'permission/generateRoutes',
        [{ 'id': '105', 'pid': '0', 'name': '系统管理', 'url': '/system', 'icon': null, 'menu_flag': 'Y' }, { 'id': '106', 'pid': '0', 'name': '用户管理', 'url': '/userMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '114', 'pid': '105', 'name': '角色管理', 'url': '/system/role', 'icon': null, 'menu_flag': 'Y' }, { 'id': '128', 'pid': '184', 'name': '业务日志', 'url': '/log/businessLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '132', 'pid': '105', 'name': '系统字典', 'url': '/system/dictType', 'icon': null, 'menu_flag': 'Y' }, { 'id': '133', 'pid': '184', 'name': '登录日志', 'url': '/log/loginLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '168', 'pid': '106', 'name': '用户组管理', 'url': '/userMgr/userGroup', 'icon': null, 'menu_flag': 'Y' }, { 'id': '169', 'pid': '0', 'name': '统计分析', 'url': '/analyse', 'icon': null, 'menu_flag': 'Y' }, { 'id': '170', 'pid': '0', 'name': '设备管理', 'url': '/deviceMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '171', 'pid': '0', 'name': '产品管理', 'url': '/productMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '174', 'pid': '105', 'name': '平台授权', 'url': '/system/auth', 'icon': null, 'menu_flag': 'Y' }, { 'id': '177', 'pid': '170', 'name': '设备', 'url': '/deviceMgr/device', 'icon': null, 'menu_flag': 'Y' }, { 'id': '178', 'pid': '170', 'name': '设备组', 'url': '/deviceMgr/deviceGroup', 'icon': null, 'menu_flag': 'Y' }, { 'id': '179', 'pid': '192', 'name': '告警记录', 'url': '/alarm/alarmList', 'icon': null, 'menu_flag': 'Y' }, { 'id': '180', 'pid': '171', 'name': '产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '181', 'pid': '171', 'name': '产品分类', 'url': '/productMgr/productType', 'icon': null, 'menu_flag': 'Y' }, { 'id': '184', 'pid': '0', 'name': '系统日志', 'url': '/log', 'icon': null, 'menu_flag': 'Y' }, { 'id': '186', 'pid': '105', 'name': '系统参数', 'url': '/system/sysParam', 'icon': null, 'menu_flag': 'Y' }, { 'id': '187', 'pid': '105', 'name': '通知配置', 'url': '/system/media', 'icon': null, 'menu_flag': 'Y' }, { 'id': '189', 'pid': '169', 'name': '全局概览', 'url': '/analyse/home', 'icon': null, 'menu_flag': 'Y' }, { 'id': '192', 'pid': '0', 'name': '告警管理', 'url': '/alarm', 'icon': null, 'menu_flag': 'Y' }, { 'id': '193', 'pid': '194', 'name': '场景联动', 'url': '/rule/scene', 'icon': null, 'menu_flag': 'Y' }, { 'id': '194', 'pid': '0', 'name': '规则引擎', 'url': '/rule', 'icon': null, 'menu_flag': 'Y' }, { 'id': '196', 'pid': '170', 'name': '设备调试', 'url': '/deviceMgr/debug', 'icon': null, 'menu_flag': 'Y' }, { 'id': '198', 'pid': '0', 'name': '平台监控', 'url': '/realTime', 'icon': null, 'menu_flag': 'Y' }, { 'id': '199', 'pid': '105', 'name': '代理配置', 'url': '/system/proxyInfo', 'icon': null, 'menu_flag': 'Y' }, { 'id': '200', 'pid': '198', 'name': '代理监控', 'url': '/realTime/proxy', 'icon': null, 'menu_flag': 'Y' }, { 'id': '202', 'pid': '177', 'name': '增加设备', 'url': '/deviceMgr/device/add', 'icon': null, 'menu_flag': 'Y' }, { 'id': '203', 'pid': '177', 'name': '修改设备', 'url': '/deviceMgr/device/update', 'icon': null, 'menu_flag': 'Y' }, { 'id': '204', 'pid': '177', 'name': '删除设备', 'url': '/deviceMgr/device/delete', 'icon': null, 'menu_flag': 'Y' }, { 'id': '205', 'pid': '177', 'name': '设备列表', 'url': '/deviceMgr/device/list', 'icon': null, 'menu_flag': 'Y' }, { 'id': '206', 'pid': '177', 'name': '设备详情', 'url': '/deviceMgr/device/detail', 'icon': null, 'menu_flag': 'Y' }, { 'id': '207', 'pid': '180', 'name': '增加产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '208', 'pid': '180', 'name': '修改产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '209', 'pid': '180', 'name': '删除产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '210', 'pid': '180', 'name': '产品列表', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '211', 'pid': '180', 'name': '产品详情', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '212', 'pid': '105', 'name': '租户管理', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '213', 'pid': '212', 'name': '租户增加', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '214', 'pid': '212', 'name': '租户修改', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '215', 'pid': '212', 'name': '租户列表', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '216', 'pid': '212', 'name': '租户删除', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '217', 'pid': '106', 'name': '用户', 'url': '/userMgr/user', 'icon': null, 'menu_flag': 'Y' }, { 'id': '218', 'pid': '198', 'name': '主服务监控', 'url': '/realTime/platform', 'icon': null, 'menu_flag': 'Y' }, { 'id': '220', 'pid': '0', 'name': '平台日志', 'url': '/platformLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '221', 'pid': '220', 'name': '事件日志', 'url': '/platformLog/event', 'icon': null, 'menu_flag': 'Y' }, { 'id': '222', 'pid': '220', 'name': '服务日志', 'url': '/platformLog/service', 'icon': null, 'menu_flag': 'Y' }, { 'id': '224', 'pid': '220', 'name': '联动日志', 'url': '/platformLog/linkage', 'icon': null, 'menu_flag': 'Y' }, { 'id': '225', 'pid': '0', 'name': '可视化', 'url': '/visualization', 'icon': null, 'menu_flag': 'Y' }, { 'id': '226', 'pid': '225', 'name': '设备分布', 'url': '/visualization/distributed', 'icon': null, 'menu_flag': 'Y' }, { 'id': '227', 'pid': '225', 'name': 'Grafana', 'url': '/visualization/grafana', 'icon': null, 'menu_flag': 'Y' }, { 'id': '228', 'pid': '225', 'name': '楼宇场景', 'url': '/visualization/building', 'icon': null, 'menu_flag': 'Y' }, { 'id': '229', 'pid': '0', 'name': '协议管理', 'url': '/agreement', 'icon': null, 'menu_flag': 'Y' }, { 'id': '230', 'pid': '229', 'name': '协议组件', 'url': '/agreement/module', 'icon': null, 'menu_flag': 'Y' }, { 'id': '231', 'pid': '229', 'name': '通信服务', 'url': '/agreement/communication', 'icon': null, 'menu_flag': 'Y' }, { 'id': '232', 'pid': '229', 'name': '协议网关', 'url': '/agreement/gateway', 'icon': null, 'menu_flag': 'Y' }],
        {
          root: true
        }
      )
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

