<!-- 设备详情页面 -->
<template>
  <div class="device-detail">
    <DetailTemplate :up="'设备'" :tab-show="tabShow" :title="title" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <keep-alive>
          <info v-if="activity === '基础信息'" :info-data="info" @updata="getDetail" />
          <driverConfig v-else-if="activity === '驱动配置'" :device-id="deviceId" />
          <attribute v-else-if="activity === '属性'" />
          <record v-else-if="activity === '日志'" />
          <attributeMgr v-else-if="activity === '属性管理'" :pro-id="proId" :device-id="deviceId" :device="info" />
          <incident v-else-if="activity ==='事件管理'" is-dev />
          <serve v-else-if="activity === '功能管理'" is-dev :device="info" />
          <offLineRule v-else-if="activity === '上下线规则'" is-dev :product-id="proId" />
          <alarm v-else-if="activity === '告警规则'" is-dev />
          <tag v-else-if="activity === '标签'" is-dev @updata="getDetail" />
          <variable v-else-if="activity === '变量'" is-dev />
          <mapping v-else-if="activity === '值映射方案'" is-dev />
          <subset v-else-if="activity === '子设备'" />
        </keep-alive>
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import attribute from '@/views/deviceMgr/device/attribute'
import mapping from '@/views/deviceMgr/device/mapping'
import tag from '@/views/deviceMgr/device/tag'
import info from '@/views/deviceMgr/device/info'
import incident from '@/views/deviceMgr/device/incident'
import driverConfig from '@/views/deviceMgr/device/driverConfig'
import serve from '@/views/deviceMgr/device/serve'
import alarm from '@/views/deviceMgr/device/alarm'
import subset from '@/views/deviceMgr/device/subset'
import variable from '@/views/deviceMgr/device/variable'
import record from '@/views/deviceMgr/device/record'
import attributeMgr from '@/views/deviceMgr/device/attributeMgr'
import offLineRule from '@/views/deviceMgr/device/offLineRule'
import { deviceDetail } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
export default {
  name: 'DeviceDetail',
  components: {
    driverConfig,
    DetailTemplate,
    attribute,
    mapping,
    info,
    tag,
    incident,
    serve,
    subset,
    alarm,
    variable,
    record,
    attributeMgr,
    offLineRule
  },
  data() {
    return {
      tabShow: false,
      detailList: [],
      tabs: [
        {
          label: '基础信息',
          name: '基础信息'
        },
        {
          label: '驱动配置',
          name: '驱动配置',
          show: false
        },
        {
          label: '属性',
          name: '属性'
        },
        {
          label: '日志',
          name: '日志'
        },
        {
          label: '属性管理',
          name: '属性管理'
        },
        // {
        //   label: '事件管理',
        //   name: '事件管理'
        // },
        {
          label: '功能管理',
          name: '功能管理'
        },
        {
          label: '上下线规则',
          name: '上下线规则'
        },
        {
          label: '告警规则',
          name: '告警规则'
        }
      ],
      gatewayTabs: [
        {
          label: '基础信息',
          name: '基础信息'
        },
        {
          label: '驱动配置',
          name: '驱动配置'
        },
        {
          label: '子设备',
          name: '子设备'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {},
      tagList: [],
      deviceId: '',
      proId: '',
      typeList: []
    }
  },
  async created() {
    await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
      if (res.code == 200) {
        this.typeList = res.data
      }
    })
    if (this.$route.query.id) {
      this.deviceId = this.$route.query.id
      await this.getDetail()
      this.tabShow = true
    }
    if (this.$route.query.tabsName) {
      this.activity = this.$route.query.tabsName
    }
  },
  methods: {
    changeTabs(name) {
      this.activity = name
    },
    async getDetail() {
      await deviceDetail({ id: this.deviceId }).then((res) => {
        if (res.code == 200) {
          const typeObj = this.typeList.find((typeItem) => typeItem.dictValue == res.data.type)
          if (typeObj) {
            res.data.typeName = typeObj.dictLabel || ''
          }
          this.info = res.data
          if (this.info.type == '2') {
            this.tabs[1].show = true
          }
          this.proId = res.data.productId
          const groupList = res.data.groupList || []
          this.info.groupIds = []
          groupList.forEach(element => {
            this.info.groupIds.push(element.id)
          })
          const groupNames = groupList.map((item) => item.name)
          if (this.info.type == '2') {
            this.tabs = this.gatewayTabs
          }
          this.detailList = [
            {
              key: '设备ID',
              value: res.data.code
            },
            {
              key: '产品',
              link: { path: '/productMgr/product/detail', query: { id: res.data.productId }},
              value: res.data.productName
            },
            {
              key: '设备类型',
              value: res.data.typeName
            },
            {
              key: '设备组',
              value: groupNames
            },
            {
              key: '创建时间',
              value: res.data.createTime
            },
            {
              key: '最近在线时间',
              value: res.data.latestOnline
            },
            {
              key: '创建人',
              value: res.data.createBy
            }
          ]
          this.subhead = res.data.remark
          this.title = res.data.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.device-detail{
  height: 100%;
}
</style>
