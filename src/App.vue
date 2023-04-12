<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  sockets: {
    // 链接成功
    connect() {
      console.log('连接成功')
    },
    // 链接失败
    disconnect() {
      console.log('连接失败')
    },
    // 重新连接
    reconnect() {
      console.log('重新连接')
    },
    // 监听、接收消息方法
    broadcast(data) {
      this.msg = data.message
      // console.log(data)
    }
  },
  data() {
    return {
      msg: '',
      msgObj: {},
      socket: null,
      levelList: [
        { label: '信息', value: 1 },
        { label: '低级', value: 2 },
        { label: '中级', value: 3 },
        { label: '高级', value: 4 },
        { label: '紧急', value: 5 }
      ]
    }
  },
  watch: {
    msg: {
      handler(val) {
        const self = this
        let show = 0
        let obj = {}
        if (val && val.indexOf('}') !== -1) {
          obj = JSON.parse(val)
          show = 1
        } else {
          obj = {}
        }
        self.msgObj = obj
        console.log(obj)
        if (show && obj.msg) {
          self.$notify.closeAll()
          self.$notify({
            title: obj.body['${alarmStatus}'] + '提醒',
            iconClass: 'el-icon-warning-outline',
            customClass: 'msg-pop',
            duration: 20000,
            type:
              obj.body['${alarmStatus}'] === '告警恢复' ? 'success' : 'warning',
            dangerouslyUseHTMLString: true,
            message: `<div>${obj.msg}</div>`,
            onClose() {},
            onClick() {
              // if (self.$route.path !== '/alarmMgr/alarmCurrent') {
              //   self.$router.push({
              //     path: '/alarmMgr/alarmCurrent'
              //   })
              // }
              self.$notify.closeAll()
            }
          })
        }
      }
    }
  },
  async created() {
    const self = this

    if (location.hash.indexOf('#/login') === -1) {
      this.$store.dispatch('user/getMember').then(() => {})
    }

    if (this.$mqttClient.connected === true) {
      // 订阅实时数据主题
      this.$mqttClient.subscribe('iot/device/+/attribute/+', { qos: 0 })
    }

    this.$mqttClient.on('connect', (error) => {
      console.log('连接成功:', error)
      this.$mqttClient.subscribe('iot/device/+/attribute/+', { qos: 0 }, (err) => {
        if (err) {
          console.log('订阅失败:', err)
        } else {
          console.log('iot/device/+/attribute/+ 订阅成功')
        }
      })
      this.$mqttClient.subscribe('iot/device/+/problem/+', { qos: 0 }, (err) => {
        if (err) {
          console.log('订阅失败:', err)
        } else {
          console.log('iot/device/+/problem/+ 订阅成功')
        }
      })
      this.$mqttClient.subscribe('iot/device/+/status/+', { qos: 0 }, (err) => {
        if (err) {
          console.log('订阅失败:', err)
        } else {
          console.log('iot/device/+/status/+ 订阅成功')
        }
      })
    })

    this.$mqttClient.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    this.$mqttClient.on('error', (error) => {
      console.log('连接失败:', error)
    })

    this.$mqttClient.on('message', (topic, message) => {
      const msgObj = JSON.parse(message.toString())
      self.$notify.closeAll()
      if (msgObj.type === 'online' || msgObj.type === 'offline') {
        // 设备上线/下线
        self.$notify({
          title: `${msgObj.value}` + (msgObj.type === 'online' ? '上线' : '下线'),
          iconClass: 'el-icon-warning-outline',
          customClass: 'msg-pop',
          duration: 20000,
          type: msgObj.type === 'online' ? 'success' : 'warning',
          dangerouslyUseHTMLString: true
        })
      } else if (msgObj.type === 'alarm') {
        const levelObj = this.levelList.find((item) => {
          if (item.value === msgObj.level) {
            return item
          }
        })
        self.$notify({
          title: levelObj.label + '告警',
          iconClass: 'el-icon-warning-outline',
          customClass: 'msg-pop',
          duration: 20000,
          type: 'warning',
          dangerouslyUseHTMLString: true,
          message: `<div>${msgObj.eventName}</div>`,
          onClose() {},
          onClick() {
          // if (self.$route.path !== '/alarmMgr/alarmCurrent') {
          //   self.$router.push({
          //     path: '/alarmMgr/alarmCurrent'
          //   })
          // }
            self.$notify.closeAll()
          }
        })
      }
    })
  },
  mounted() {

  },
  beforeDestroy() {

  }
}
</script>
