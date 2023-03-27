<!--设备详情-属性管理页面 -->
<template>
  <div class="attribute-mgr">
    <SearchForm v-if="!dialogVisible && !collectVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-if="!dialogVisible && !collectVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination
      v-if="!dialogVisible && !collectVisible"
      :total="total"
      :size="size"
      :current-page="page"
      @handleCurrentChange="handleCurrentChange"
    />
    <div v-if="dialogVisible">
      <FormTemplate :up="'属性管理'" :state="state + '属性'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <attributeForm v-if="dialogVisible" ref="attributeForm" v-model="dialogForm" :pro-id="proId" is-dev />
        </template>
      </FormTemplate>
    </div>
    <div v-if="collectVisible">
      <FormTemplate :up="'属性管理'" :button-show="false" :state="undefined" :but-loading="butLoading" @submit="submit" @cancel="closeCollect">
        <template v-slot:main>
          <AttrCollect v-for="attrItem in attrList" :key="attrItem.id" v-bind="attrItem" :device-attribute-id="deviceAttributeId" :device-id="deviceId" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import attributeForm from '@/views/deviceMgr/device/attributeForm'
import FormTemplate from '@/components/Slots/FormTemplate'
import AttrCollect from './components/AttrCollect.vue'
import { getDriverPointConfigByDeviceId } from '@/api/pointAttribute'
import {
  createAttrTrapper,
  deleteAttrTrapper,
  detailAttrTrapper,
  getAttrTrapperByPage,
  updateAttrTrapper
} from '@/api/deviceMgr'

export default {
  dicts: ['data_type', 'attr_type'],
  name: 'AttributeMgr',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    attributeForm,
    FormTemplate,
    AttrCollect
  },
  props: {
    proId: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      required: true
    },
    device: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deviceAttributeId: '',
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'attrName',
          label: '属性名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'key',
          label: '标识符'
        }
      ],
      form: {
        name: ''
      },
      tableData: [],
      loading: false,
      butLoading: false,
      dialogVisible: false,
      collectVisible: false,
      attrList: [],
      dialogForm: {},
      state: '',
      total: 0,
      size: 10,
      page: 1
      // ,
      // buttons: [
      //   {
      //     type: 'primary',
      //     label: '创建',
      //     event: 'add'
      //   }
      // ]

    }
  },
  computed: {
    columns() {
      return [
        {
          label: '属性名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '标识符',
          prop: 'key',
          show: true
        },
        {
          label: '来自产品',
          prop: 'inherit',
          show: true
        },
        {
          label: '来源类型',
          prop: 'source',
          propDict: 'attr_type',
          show: true
        },
        {
          label: '数据类型',
          prop: 'valueType',
          propDict: 'data_type',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '修改时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 100,
          idName: 'id',
          buttons: [
            // {
            //   label: '编辑',
            //   event: 'edit',
            //   icon: 'list-edit'
            // },
            // {
            //   label: '删除',
            //   event: 'delete',
            //   icon: 'list-del'
            // },
            this.device.type == 3 ? {
              label: '采集配置',
              event: 'collect',
              icon: 'list-edit'
            } : undefined
          ]
        }
      ]
    }
  },
  created() {
    this.form.deviceId = this.deviceId || this.$route.query.id
    this.getList()
    this.form.prodId = this.prodId || this.$route.query.prodId
  },
  mounted() {

  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getAttrTrapperByPage({ ...this.form, pageSize: this.size, pageNum: this.page }).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    detail(item) {
      this.edit(item.attrId)
    },
    edit(attrId) {
      detailAttrTrapper({ attrId }).then(res => {
        if (res.code == 200) {
          this.dialogForm = res.data
          this.state = '编辑'
          this.dialogVisible = true
        }
      })
    },
    delete(id) {
      const i = this.tableData.find((item) => {
        return item.attrId === id
      })
      if (i.templateId) {
        this.$message({
          message: '当前数据不可删除',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttrTrapper({ attrIds: [id] }).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 删除后重新请求数据
              await this.getList()
            }
          })
        })
      }
    },
    submit() {
      if (this.$refs.attributeForm.validateForm()) {
        this.butLoading = true
        if (this.dialogForm.attrId) {
          updateAttrTrapper(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.close()
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          createAttrTrapper(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.close()
              this.getList()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    },
    close() {
      this.dialogForm = {}
      this.dialogVisible = false
    },
    collect(id) {
      this.collectVisible = true
      this.getAttrList(id)
      this.deviceAttributeId = id
    },
    closeCollect() {
      this.collectVisible = false
    },
    getAttrList(attrId) {
      getDriverPointConfigByDeviceId({
        deviceId: this.deviceId,
        attributeId: attrId
      }).then(res => {
        const { code, data } = res
        if (code == 200) {
          this.attrList = data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.attribute-mgr {
  height: 100%;
}
</style>
