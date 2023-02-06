<!--产品详情页面 -->
<template>
  <div class="product-detail">
    <DetailTemplate :up="'产品'" :title="title" :to="'/productMgr/product'" :subhead="subhead" :detail-list="detailList" :tabs="tabs" @changeTabs="changeTabs">
      <template v-slot:main>
        <info v-if="activity === '基础信息'" :info-data="info" @updata="getDetail" />
        <attributeMgr v-else-if="activity === '属性管理'" />
        <incident v-else-if="activity ==='事件管理'" />
        <serve v-else-if="activity === '功能管理'" />
        <offLineRule v-else-if="activity === '上下线规则'" />
        <alarm v-else-if="activity === '告警规则'" />
        <tag v-else-if="activity === '标签'" @updata="getDetail" />
        <variable v-else-if="activity === '变量'" />
        <mapping v-else-if="activity === '值映射方案'" />
        <device v-else-if="activity === '设备'" />
      </template>
    </DetailTemplate>
  </div>
</template>
<script>
import DetailTemplate from '@/components/Slots/DetailTemplate.vue'
import mapping from '@/views/deviceMgr/device/mapping'
import tag from '@/views/deviceMgr/device/tag'
import info from '@/views/productMgr/product/info'
import incident from '@/views/deviceMgr/device/incident'
import serve from '@/views/deviceMgr/device/serve'
import alarm from '@/views/deviceMgr/device/alarm'
import device from '@/views/productMgr/product/device'
import variable from '@/views/deviceMgr/device/variable'
import attributeMgr from '@/views/productMgr/product/attributeMgr'
import offLineRule from '@/views/deviceMgr/device/offLineRule'
import { getProductTypeTree, productDetail } from '@/api/porductMgr'
import { getDictListByCode } from '@/api/system'
export default {
  name: 'ProductDetail',
  components: {
    DetailTemplate,
    mapping,
    info,
    tag,
    incident,
    serve,
    alarm,
    variable,
    attributeMgr,
    offLineRule,
    device
  },
  data() {
    return {
      detailList: [],
      tabs: [
        {
          label: '基础信息',
          name: '基础信息'
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
        },
        // {
        //   label: '标签',
        //   name: '标签'
        // },
        // {
        //   label: '变量',
        //   name: '变量'
        // },
        // {
        //   label: '值映射方案',
        //   name: '值映射方案'
        // },
        {
          label: '设备',
          name: '设备'
        }
      ],
      subhead: '',
      title: '',
      activity: '基础信息',
      info: {},
      tagList: [],
      prodId: '',
      groupList: [],
      typeList: []
    }
  },
  async created() {
    this.init()
    if (this.$route.query.id) {
      this.prodId = this.$route.query.id
      await this.getDetail()
    }
    if (this.$route.query.tabsName) {
      this.activity = this.$route.query.tabsName
    }
  },
  methods: {
    init() {
      getProductTypeTree().then((res) => {
        if (res.code == 200) {
          this.groupList = res.data
        }
      })
      // 获取设备类型
      getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
    },
    changeTabs(name) {
      this.activity = name
    },
    async getDetail() {
      // await getProdTagList({ productId: this.prodId }).then((res) => {
      //   if (res.code == 200) {
      //     this.tagList = res.data
      //   }
      // })
      await productDetail({ productId: this.prodId }).then((res) => {
        if (res.code == 200) {
          const data = res.data
          const groupObj = this.groupList.find((groupItem) => groupItem.id == data.groupId)
          const typeObj = this.typeList.find((typeItem) => typeItem.dictValue == data.type)
          const obj = Object.assign(data, { groupName: (groupObj ? groupObj.name : '') || '未分类', typeName: (typeObj ? typeObj.dictLabel : '-') || '-' })
          this.info = obj
          console.log('product info :', this.info)
          this.detailList = [
            {
              key: '产品ID',
              value: obj.code
            },
            {
              key: '产品分类',
              value: obj.groupName
            },
            {
              key: '设备类型',
              value: obj.typeName
            },
            {
              key: '厂商',
              value: obj.manufacturer
            },
            {
              key: '型号',
              value: obj.model
            },
            {
              key: '标签',
              tag: this.tagList,
              value: 'tage'
            },
            {
              key: '创建时间',
              value: obj.createTime
            },
            {
              key: '修改时间',
              value: obj.updateTime
            },
            {
              key: '创建人',
              value: obj.createBy
            }
          ]
          this.subhead = obj.remark
          this.title = obj.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-detail{
  height: 100%;
}
</style>
