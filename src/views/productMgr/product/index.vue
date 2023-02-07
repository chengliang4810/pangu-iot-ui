<!-- 产品页面 -->
<template>
  <div class="product">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>产品</template>
      <template v-slot:subhead>产品是一组具有相同属性、服务、事件等要素的设备集合，比如某品牌的某型号的传感器。创建产品是使用平台的第一步，快速创建产品后才可定义产品下的属性、服务、事件、告警规则等要素，进而添加相应设备。</template>
    </ListHeadTemplate>
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :icon="$route.meta.icon24"
      @detail="detail"
    />
    <Pagination v-if="!dialogVisible" :total="total" :size="form.pageSize" :current-page="form.pageNum" @handleCurrentChange="handleCurrentChange" />
    <div v-if="dialogVisible">
      <FormTemplate :up="'产品列表'" :state="state + '产品'" :but-loading="butLoading" @submit="handleSubmit" @cancel="dialogVisible = false">
        <template v-slot:main>
          <ProductForm ref="ProductForm" v-model="dialogForm" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import ProductForm from './addForm.vue'
import BusinessTable from '@/components/Basics/BusinessTable'
import FormTemplate from '@/components/Slots/FormTemplate'
import Pagination from '@/components/Basics/Pagination'
import { getProductByPage, DeleteProduct, UpdateProduct, createProduct, getProductTypeTree } from '@/api/porductMgr'
export default {
  dicts: ['device_type'],
  provide() {
    return {
      farther: this
    }
  },
  name: 'Product',
  components: {
    ListHeadTemplate,
    SearchForm,
    ProductForm,
    BusinessTable,
    Pagination,
    FormTemplate
  },
  data() {
    return {
      groupList: [],
      form: {
        name: '',
        type: '',
        prodTypeNames: [],
        prodTypeName: '',
        groupId: '',
        pageSize: 16,
        pageNum: 1
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      butLoading: false,
      state: '',
      total: 0,
      formParams: [],
      typeList: [],
      treeData: [],
      dialogForm: {},
      item: '',
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '产品名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '产品编号',
          prop: 'code',
          show: true
        },
        {
          label: '产品分类',
          prop: 'groupName',
          show: true
        },
        {
          label: '设备类型',
          prop: 'type',
          propDict: 'device_type',
          show: true
        },
        {
          label: '厂商',
          prop: 'manufacturer',
          show: true
        },
        {
          label: '型号',
          prop: 'model',
          show: true
        },
        {
          label: '设备总数',
          prop: 'deviceCount',
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
          width: 120,
          idName: 'id',
          show: true,
          buttons: [
            {
              label: '删除',
              event: 'del',
              icon: 'list-del'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.searchInit()
    this.getList()
  },
  methods: {
    async searchInit() {
      await getProductTypeTree().then((res) => {
        if (res.code == 200) {
          this.groupList = res.data
          this.treeData = this.handleTree(res.data, 'id', 'parent_id')
        }
      })
      this.formParams = [
        {
          componentName: 'CascaderTemplate',
          keyName: 'groupId',
          label: '产品分类',
          optionId: 'id',
          optionName: 'name',
          childrenName: 'children',
          options: this.treeData
        },
        {
          componentName: 'SelectTemplate',
          keyName: 'type',
          label: '设备类型',
          optionId: 'dictValue',
          optionName: 'dictLabel',
          options: this.dict.type.device_type
        },
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '产品名称'
        }
      ]
    },
    search() {
      this.form.pageNum = 1
      this.getList()
    },
    getList() {
      if (this.form.prodTypeNames && this.form.prodTypeNames.length) {
        this.form.prodTypeName = this.form.prodTypeNames[this.form.prodTypeNames.length - 1]
      }
      getProductByPage(this.form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.total = res.data.total
          const list = res.data.rows
          list.forEach(element => {
            const groupObj = this.groupList.find((groupItem) => groupItem.id == element.groupId)
            element = Object.assign(element, { groupName: (groupObj ? groupObj.name : '') || '未分类' })
          })
          this.tableData = list
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.getList()
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    edit(id) {
      // this.state = '更新'
      // this.dialogVisible = true
    },
    detail(item) {
      this.$router.push({
        path: '/productMgr/product/detail',
        query: {
          prodId: item.id
        }
      })
    },
    del(id) {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteProduct({ id: id }).then(async(res) => {
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
    },
    closeDialog() {
      this.dialogVisible = false
      this.getList()
    },
    handleSubmit() {
      if (this.$refs.ProductForm.validateForm()) {
        this.butLoading = true
        if (this.id) {
          UpdateProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeDialog()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        } else {
          createProduct(this.dialogForm).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.closeDialog()
            }
            this.butLoading = false
          }).catch(() => {
            this.butLoading = false
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.product{
  height: 100%;
}
</style>
