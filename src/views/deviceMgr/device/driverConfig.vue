<!-- 驱动配置页面 -->
<template>
  <div class="info">
    <el-empty v-if="driverConfigList.length == 0" description="暂无驱动配置" />
    <template>
      <DeviceDriver v-for="item in driverConfigList" :key="item.id" v-bind="item" :device-id="deviceId" @update="handleUpdate" />
    </template>
  </div>
</template>

<script>
import DeviceDriver from './components/DeviceDriver.vue'
import { driverConfigByDeviceId } from '@/api/driver'

export default {
  name: 'DriverConfig',
  components: {
    DeviceDriver
  },
  props: {
    deviceId: { type: String, required: true }
  },
  data() {
    return {
      // 搜索关键字
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      },
      productList: [],
      deviceGroup: [],
      dialogMap: false,
      driverConfigList: []
    }
  },
  watch: {

  },
  created() {
    this.getDriverConfig(this.deviceId)
  },
  methods: {
    /**
     * @description: 编辑表单页面
     */
    handleEditShow() {
      this.dialogVisible = true
    },
    async getDriverConfig() {
      const { data } = await driverConfigByDeviceId(this.deviceId)
      this.driverConfigList = data
    },
    async handleUpdate() {
      this.getDriverConfig()
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .bm-view2 {
    width: 100%;
    height: 500px;
    background-color: #F6F7FA;
  }
  .no-key{
    margin-top: 180px;

    div{
      color: #36435c;
    }
  }
  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    .icon{
      color: #50A1FB;
      margin-right: 4px;
    }
  }

}
</style>
