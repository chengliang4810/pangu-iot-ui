<!--设备详情-子设备页面 -->
<template>
  <div class="alarm">
    <SearchForm :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      :h="'calc(100% - 115px)'"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'1234px'"
      :show-close="false"
      class="device_select_dialog"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_add" />
          绑定子设备
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <deivceSelect
          :device-ids="deviceIds"
          device-type="3"
          :multiple="true"
          @closeDialog="dialogVisible = false"
          @checked="checked"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import deivceSelect from '@/components/Basics/DeviceSelect'
import { getDeviceGrpList, gatewayDeviceBind, gatewayDeviceBindIds, getGatewayChildDeviceByPage } from '@/api/deviceMgr'
import { getDictListByCode } from '@/api/system'
import { getProductList } from '@/api/porductMgr'

export default {
  name: 'Alarm',
  dicts: ['device_type'],
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    deivceSelect
  },
  data() {
    return {
      deviceIds: [],
      formParams: [],
      deviceGroup: [],
      productList: [],
      form: {
        name: '',
        productId: '',
        prodType: '',
        deviceGroupId: ''
      },
      dialogVisible: false,
      state: '',
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      buttons: [
        {
          type: 'primary',
          label: '添加子设备',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          show: true
        },
        {
          label: '设备ID',
          prop: 'code',
          show: true
        },
        {
          label: '产品',
          prop: 'productName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'type',
          propDict: 'device_type',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '设备组',
          prop: 'groupList',
          propEvent: 'convertGroupName',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '最近在线时间',
          prop: 'latestOnline',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'deviceId',
          buttons: [
            {
              label: '编辑',
              event: 'detail',
              icon: 'list-edit'
            }
            //,
            // {
            //   label: '删除',
            //   event: 'delete',
            //   icon: 'list-del'
            // }
          ]
        }
      ],
      dialogForm: {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
    }
  },
  created() {
    this.searchInit()
    this.getList()
    gatewayDeviceBindIds(this.$route.query.id).then((res) => {
      if (res.code == 200) {
        this.deviceIds = res.data
      }
    })
  },
  methods: {
    convertGroupName(groupList) {
      let str = ''
      groupList.forEach((item) => {
        str += item.name + ','
      })
      return str.substring(0, str.length - 1)
    },
    async checked(val) {
      const ids = val instanceof Array ? val : [val]
      const deviceId = this.$route.query.id
      gatewayDeviceBind({ gatewayDeviceId: deviceId, deviceIds: ids }).then((res) => {
        if (res.code == 200) {
          this.$message.success('绑定成功')
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    async searchInit() {
      // 获取设备组列表
      await getDeviceGrpList({}).then((res) => {
        if (res.code == 200) {
          this.deviceGroup = res.data
        }
      })
      // 获取设备类型
      await getDictListByCode({ dictTypeCode: 'DEVICE_TYPE' }).then((res) => {
        if (res.code == 200) {
          this.typeList = res.data
        }
      })
      // 获取产品列表
      await getProductList({}).then((res) => {
        if (res.code == 200) {
          this.productList = res.data
        }
      })
      this.formParams = [
        {
          componentName: 'SelectTemplate',
          keyName: 'deviceGroupId',
          label: '设备组',
          optionId: 'deviceGroupId',
          optionName: 'name',
          options: this.deviceGroup
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'productId',
          label: '产品',
          optionId: 'productId',
          optionName: 'name',
          options: this.productList
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '设备名称'
        }
      ]
    },
    search() {
      this.page = 1
      this.getList()
    },
    add() {
      this.state = '添加子设备'
      this.dialogVisible = true
    },
    getList() {
      this.loading = true
      this.form.gatewayDeviceId = this.$route.query.id
      getGatewayChildDeviceByPage({ ...this.form, pageSize: this.size, pageNum: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    detail(item) {
      // deviceId
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    close() {
      this.dialogForm = {
        name: '',
        productId: '',
        deviceGroupIds: [],
        remark: ''
      }
    },
    submit(val) {
      console.log('submit：', val)
      // if (this.$refs.deviceForm.validateForm()) {
      //   if (this.dialogForm.deviceId) {
      //     // updateDevice(this.dialogForm).then(async(res) => {
      //     //   if (res.code == 200) {
      //     //     this.$message({
      //     //       message: '修改成功',
      //     //       type: 'success'
      //     //     })
      //     //     this.dialogVisible = false
      //     //     await this.getList()
      //     //   }
      //     // })
      //   } else {
      //     // createDevice(this.dialogForm).then(async(res) => {
      //     //   if (res.code == 200) {
      //     //     this.$message({
      //     //       message: '添加成功',
      //     //       type: 'success'
      //     //     })
      //     //     this.dialogVisible = false
      //     //     await this.getList()
      //     //   }
      //     // })
      //   }
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm {
  height: 100%;
  .bm-view {
    width: 600px;
    height: 500px;
  }
}
</style>
