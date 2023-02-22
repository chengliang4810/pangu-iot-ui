<!--详情-功能页面 -->
<template>
  <div class="serve">
    <SearchForm v-if="!dialogVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-if="!dialogVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
      @detail="detail"
    >
      <template #specs="{row}">
        <div class="specs">
          <template v-if="row.dataType != 'enum'">
            <div v-for="item in typeFields[row[dataType]]" :key="item" class="specs-item">
              <span>{{ row.specs[item] }}</span>
              <span>{{ fieldDesc[item] }}]</span>
            </div>
          </template>
          <div v-else class="specs">
            <div v-for="item in row.specs.enumList" :key="item.value" class="specs-item">
              <span>{{ item.value }}</span>
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </template>
    </BusinessTable>
    <Pagination
      v-if="!dialogVisible"
      :total="total"
      :size="size"
      :current-page="page"
      @handleCurrentChange="handleCurrentChange"
    />
    <div v-if="dialogVisible">
      <FormTemplate :up="'功能列表'" :state="state + '功能'" :but-loading="butLoading" @submit="submit" @cancel="close">
        <template v-slot:main>
          <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="100px" class="dialog-form" size="mini">
            <el-form-item label="功能名称" prop="name">
              <el-input v-model="dialogForm.name" size="mini" :disabled="isDev && dialogForm.inherit == '1'" />
            </el-form-item>
            <el-form-item label="标识符" prop="mark">
              <el-input v-model="dialogForm.mark" size="mini" :disabled="isDev && dialogForm.inherit == '1'" />
            </el-form-item>
            <el-form-item label="调用方式" prop="async">
              <el-select
                v-model="dialogForm.async"
                placeholder="请选择调用方式"
                size="mini"
                :disabled="isDev && dialogForm.inherit == '1'"
              >
                <el-option label="同步" :value="0" />
                <el-option label="异步" :value="1" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="输入参数" prop="productServiceParamList">
              <Variable
                ref="variable"
                v-model="dialogForm.productServiceParamList"
                :name="'输入参数'"
                :read="isDev && dialogForm.inherit == '1'"
              />
            </el-form-item> -->
            <el-form-item label="描述" prop="remark">
              <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
            </el-form-item>
            <el-divider />
            <el-form-item label="数据类型" prop="dataType">
              <el-select v-model="dialogForm.dataType" size="mini">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- 整数和小数 -->
            <div v-show="['integer','decimal'].includes(dialogForm.dataType)">
              <el-form-item label="取值范围" prop="">
                <div class="num-range">
                  <el-input-number v-model="dialogForm.specs.min" class="flex-1" />
                  <span>到</span>
                  <el-input-number v-model="dialogForm.specs.max" class="flex-1" />
                </div>
              </el-form-item>
              <el-form-item label="单位" prop="unit">
                <el-input v-model="dialogForm.specs.unit" />
              </el-form-item>
              <el-form-item label="步长" prop="unit">
                <el-input-number v-model="dialogForm.specs.step" style="width:100%" />
              </el-form-item>
            </div>
            <!-- 布尔 -->
            <el-form-item v-show="dialogForm.dataType == 'bool'" label="0值对应文本">
              <el-input v-model="dialogForm.specs.falseText" />
            </el-form-item>
            <el-form-item v-show="dialogForm.dataType == 'bool'" label="1值对应文本">
              <el-input v-model="dialogForm.specs.trueText" />
            </el-form-item>
            <el-form-item v-show="dialogForm.dataType == 'enum'" label="枚举项">
              <div>
                <div
                  v-for="(item,i) in dialogForm.specs.enumList"
                  :key="i"
                  class="num-range mb-16px"
                >
                  <el-input v-model="item.value" style="width:210px" placeholder="参数值" clearable />
                  <el-input v-model="item.text" style="width:210px" placeholder="参数描述" clearable />
                  <el-button v-if="i != 0" type="text" class=" zeus-icon" @click="deleteEnumItem(i)">
                    <svg-icon icon-class="but_del" />
                  </el-button>
                </div>
                <div class="mt-16px">
                  <el-button
                    type="primary"
                    round
                    size="mini"
                    icon="el-icon-plus"
                    @click="addEnumItem"
                  >添加枚举项</el-button>
                </div>
              </div>

            </el-form-item>
            <el-form-item v-show="dialogForm.dataType == 'string'" label="最大长度" prop="maxLength">
              <el-input-number v-model="dialogForm.maxLength" style="width:100%" />
            </el-form-item>
            <el-form-item v-show="dialogForm.dataType == 'array'" label="数组类型" prop="arrayType">
              <el-radio-group v-model="dialogForm.specs.arrayType">
                <el-radio v-for="item in arrayTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
      </FormTemplate>
    </div>
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :width="'700px'"
      @close="serviceParams = []"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">触发功能</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false" />
        </div>
      </div>
      <div class="dialog-body">
        <Variable ref="variable" v-model="serviceParams" :name="'输入参数'" read />
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="triggerService">触 发</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import Variable from '@/components/Detail/Variable'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getServiceByPage, createService, updateService, deleteService, executeService } from '@/api/porductMgr'

const mockData = {
  dataType: 'string',
  specs: '{"type":"integer","max":123,"min":12,"step":1,"unit":"福特","trueText":"zhen","falseText":"假","arrayType":"string","enumList":[{"text":"正常","value":0},{"text":"手动","value":1}],"maxLength":12}'
}
const defaultDialogForm = {
  name: '',
  mark: '',
  async: '',
  remark: '',
  relationId: '',
  productServiceParamList: [],
  dataType: 'integer',
  specs: {
    type: 'integer', // 数据类型 integer decimal array bool enum string
    // 整数、小数
    max: undefined,
    min: undefined,
    step: undefined,
    unit: undefined, // 单位
    // 布尔
    trueText: undefined,
    falseText: undefined,
    // 数组
    arrayType: undefined, // integer  double string
    // 枚举
    enumList: [
      {
        text: undefined,
        value: undefined
      }
    ],
    // 字符串
    maxLength: undefined // 字符串最大长度
  }

}
const fieldDesc = {
  type: '数据类型',
  max: '最大值',
  min: '最小值',
  step: '步长',
  unit: '单位',
  trueText: '1值对应文本',
  falseText: '0值对应文本',
  arrayType: '数组类型',
  maxLength: '最大长度'
}
// 每种类型对应的字段
const typeFields = {
  integer: ['max', 'min', 'step', 'unit'],
  decimal: ['max', 'min', 'step', 'unit'],
  array: ['arrayType'],
  bool: ['trueText', 'falseText'],
  enum: ['enumList'],
  string: ['maxLength']
}
export default {
  dicts: ['execute_type'],
  name: 'Serve',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination,
    Variable,
    FormTemplate
  },
  props: {
    isDev: Boolean
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '功能名称'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'mark',
          label: '标识符'
        }
      ],
      form: {
        name: '',
        mark: ''
      },
      tableData: [],
      loading: false,
      butLoading: false,
      dialogVisible: false,
      dialogVisible2: false,
      serviceParams: [],
      serviceId: '',
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dataTypeOptions: [
        { label: '整数', value: 'integer' },
        { label: '小数', value: 'decimal' },
        { label: '布尔', value: 'bool' },
        { label: '枚举', value: 'enum' },
        { label: '数组', value: 'array' },
        { label: '字符串', value: 'string' }
      ],
      arrayTypeOptions: [
        { label: 'int (整数)', value: 'integer' },
        { label: 'double (小数)', value: 'double' },
        { label: 'string (字符串)', value: 'string' }
      ],
      dialogForm: JSON.parse(JSON.stringify(defaultDialogForm)),
      rules: {
        name: [
          { required: true, message: '请输入功能名称', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
        ],
        async: [
          { required: true, message: '请选择调用方式', trigger: 'change' }
        ]
      },
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      columns: [
        {
          label: '功能名称',
          prop: 'name',
          event: 'detail',
          show: true
        },
        {
          label: '标识符',
          prop: 'mark',
          show: true
        },
        {
          label: '数据类型',
          prop: 'dataType',
          show: true
        },
        {
          label: '数据定义',
          prop: 'specs',
          show: true,
          type: 'slot'
        },
        {
          label: '调用方式',
          prop: 'async',
          propDict: 'execute_type',
          show: true
        },
        {
          label: '描述',
          prop: 'remark',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 250,
          idName: 'id',
          buttons: [
            {
              label: '编辑',
              event: 'edit',
              icon: 'list-edit'
            },
            {
              label: '删除',
              event: 'delete',
              icon: 'list-del'
            }
          ]
        }
      ],
      fieldDesc,
      typeFields
    }
  },
  watch: {
    isDev: {
      immediate: true,
      handler(val) {
        if (val) {
          this.columns = [
            {
              label: '功能名称',
              prop: 'name',
              event: 'detail',
              show: true
            },
            {
              label: '标识符',
              prop: 'mark',
              show: true
            },
            {
              label: '数据类型',
              prop: 'dataType',
              show: true
            },
            {
              label: '数据定义',
              prop: 'specs',
              show: true,
              type: 'slot'
            },
            {
              label: '来自产品',
              prop: 'inherit',
              show: true
            },
            {
              label: '调用方式',
              prop: 'async',
              propDict: 'execute_type',
              show: true
            },
            {
              label: '描述',
              prop: 'remark',
              show: true
            },
            {
              label: '',
              prop: 'buttons',
              show: true,
              width: 250,
              idName: 'id',
              buttons: [
                {
                  label: '触发',
                  event: 'trigger',
                  icon: 'list-trigger'
                },
                {
                  label: '编辑',
                  event: 'edit',
                  icon: 'list-edit'
                },
                {
                  label: '删除',
                  event: 'delete',
                  icon: 'list-del'
                }
              ]
            }
          ]
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.dialogVisible = false
      this.loading = true
      getServiceByPage({ ...this.form, relationId: this.$route.query.id, prodId: this.$route.query.prodId, pageSize: this.size, pageNum: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data.rows.map(item => Object.assign({}, mockData, item))
          this.total = res.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.dialogForm = JSON.parse(JSON.stringify(defaultDialogForm))
      this.$refs.dialogForm.resetFields()
    },
    detail(item) {
      this.edit(item.id)
    },
    /* 触发 */
    trigger(id) {
      this.serviceId = id
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      if (i.productServiceParamList && i.productServiceParamList.length) {
        this.serviceParams = JSON.parse(JSON.stringify(i.productServiceParamList))
        this.dialogVisible2 = true
      } else {
        this.serviceParams = []
        this.triggerService()
      }
    },
    triggerService() {
      executeService({ deviceId: this.$route.query.id, serviceId: this.serviceId, serviceParams: this.serviceParams }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '功能触发成功',
            type: 'success'
          })
          this.dialogVisible2 = false
        }
      }).catch(() => {
        this.$message({
          message: '功能触发失败',
          type: 'error'
        })
        this.dialogVisible2 = false
      })
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      this.dialogForm = JSON.parse(JSON.stringify(i))
      this.state = '编辑'
      this.dialogVisible = true
    },
    delete(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      if (i.inherit == '1') {
        this.$message({
          message: '该功能继承产品，无法在设备进行编辑',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteService({ ids: [id] }).then(async(res) => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              await this.getList()
            }
          })
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    submit() {
      //
      if (this.dialogForm.inherit === true) {
        this.$message({
          message: '该功能继承产品，无法在设备进行编辑',
          type: 'warning'
        })
        return
      }

      this.$refs.dialogForm.validate(async(valid) => {
        if (valid && this.$refs.variable.verification()) {
          this.butLoading = true
          this.dialogForm.relationId = this.$route.query.id || this.$route.query.prodId
          this.dialogForm.prodId = this.$route.query.prodId
          if (this.state === '创建') {
            createService(this.dialogForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '创建成功',
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
            updateService(this.dialogForm).then((res) => {
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
          }
        }
      })
    },
    // 新增枚举项
    addEnumItem() {
      this.dialogForm.specs.enumList.push({
        text: '',
        value: ''
      })
    },
    // 删除枚举项
    deleteEnumItem(index) {
      this.dialogForm.specs.enumList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.serve {
  height: 100%;
}
.sep{
  margin:0 16px
}
.num-range{
  widows: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
}
.flex-1{
  flex:1
}
.justify-between{
  display: flex;
  justify-content: space-between;
}
.mt-16px{
  margin-top:16px
}
.mb-16px{
  margin-bottom:16px
}
.specs{
  display: flex;
}
.specs-item{
  width: 50%;
  margin-bottom: 16px;
}
</style>
