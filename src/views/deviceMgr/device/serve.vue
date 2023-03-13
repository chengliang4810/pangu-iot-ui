<!--详情-功能页面 -->
<template>
  <div class="serve">
    <SearchForm v-if="!dialogVisible && !collectVisible" :params="formParams" :buttons="buttons" :columns="columns" @search="search" />
    <BusinessTable
      v-show="!dialogVisible && !collectVisible"
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
      @detail="detail"
    >
      <template #specs="{cellValue,row}">
        <div class="specs">
          <template v-if="row.dataType != 'enums'">
            <div v-for="item in typeFields[row.dataType]" :key="item" class="specs-item">
              <span>{{ fieldDesc[item] }}</span>
              <span class="mx-6">:</span>
              <span>{{ cellValue[item] }}</span>
            </div>
          </template>
          <div v-else class="specs">
            <div v-for="item in cellValue.enumList" :key="item.value" class="specs-item">
              <span>{{ item.text }}</span>
              <span class="mx-6">:</span>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </template>
    </BusinessTable>
    <Pagination
      v-if="!dialogVisible && !collectVisible"
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
              <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" clearable />
            </el-form-item>
            <el-divider />
            <el-form-item label="数据类型" prop="dataType" required>
              <el-select v-model="dialogForm.dataType" size="mini">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  clearable
                />
              </el-select>
            </el-form-item>
            <!-- 整数和小数 -->
            <div v-if="['integer','decimal'].includes(dialogForm.dataType)">
              <div label="取值范围" class="range">
                <div class="el-form-item__label" style="width:100px">取值范围</div>
                <div class="num-range">
                  <el-form-item prop="specs.min" label-width="0" style="margin-bottom:0">
                    <el-input-number v-model="dialogForm.specs.min" style="width:200px" />
                  </el-form-item>
                  <span>到</span>
                  <el-form-item prop="specs.max" label-width="0" style="margin-bottom:0">
                    <el-input-number v-model="dialogForm.specs.max" style="width:200px" />
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="单位" prop="specs.unit">
                <el-input v-model="dialogForm.specs.unit" clearable />
              </el-form-item>
              <el-form-item label="步长" prop="specs.step">
                <el-input-number v-model.number="dialogForm.specs.step" style="width:100%" clearable />
              </el-form-item>
            </div>
            <!-- 布尔 -->
            <el-form-item v-if="dialogForm.dataType == 'bool'" key="falseText" label="0值对应文本" prop="specs.falseText">
              <el-input v-model="dialogForm.specs.falseText" clearable />
            </el-form-item>
            <el-form-item v-if="dialogForm.dataType == 'bool'" key="trueText" label="1值对应文本" prop="specs.trueText">
              <el-input v-model="dialogForm.specs.trueText" clearable />
            </el-form-item>
            <el-form-item v-if="dialogForm.dataType == 'enums'" label="枚举项">
              <div>
                <div
                  v-for="(item,i) in dialogForm.specs.enumList"
                  :key="'enumItem'+i"
                  class="num-range"
                >
                  <el-form-item
                    label-width="0"
                    :prop="`specs.enumList[${i}].value`"
                    :rules="[{ required: true, message: '参数值不能为空'},]"
                  >
                    <el-input v-model="item.value" style="width:210px" placeholder="参数值" clearable />
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    :prop="`specs.enumList[${i}].text`"
                    :rules="[{ required: true, message: '参数描述不能为空'},]"
                  >
                    <el-input v-model="item.text" style="width:210px" placeholder="参数描述" clearable />
                  </el-form-item>
                  <el-button
                    v-if="i != 0"
                    type="text"
                    class=" zeus-icon"
                    @click="deleteEnumItem(i)"
                  >
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
            <el-form-item v-if="dialogForm.dataType == 'string'" key="maxLength" label="最大长度" prop="specs.maxLength">
              <el-input-number v-model="dialogForm.specs.maxLength" style="width:100%" />
            </el-form-item>
            <el-form-item v-if="dialogForm.dataType == 'array'" key="arrayCount" label="元素个数" prop="specs.arrayCount">
              <el-input-number v-model="dialogForm.specs.arrayCount" style="width:100%" />
            </el-form-item>
            <el-form-item v-if="dialogForm.dataType == 'array'" key="arrayType" label="数组类型" prop="specs.arrayType">
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
      :width="'400px'"
      @close="resetTrigger"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">触发功能</div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible2 = false" />
        </div>
      </div>
      <div class="trigger-body ">
        <!-- <Variable ref="variable" v-model="serviceParams" :name="'输入参数'" read /> -->
        <div class="trigger-name">{{ triggerFormOpt.name }}</div>
        <el-form
          ref="triggerForm"
          :model="triggerFormData"
          size="small"
          style="width:200px"
        >
          <el-form-item
            v-if="triggerFormOpt.type == 'bool'"
            style="text-align: center;"
            prop="value"
            label-width="0"
          >
            <el-switch
              v-model="triggerFormData.value"
              :active-text="triggerFormOpt.trueText"
              :inactive-text="triggerFormOpt.falseText"
            />
          </el-form-item>
          <el-form-item
            v-else-if="['integer','decimal'].includes(triggerFormOpt.type)"
            prop="value"
            label-width="0"
            :rules="[
              { required: true, message: '不能为空'},
              { type: 'number', message: '必须为数字值'}
            ]"
          >
            <el-input-number
              v-model="triggerFormData.value"
              :min="triggerFormOpt.min"
              :max="triggerFormOpt.max"
              :step="triggerFormOpt.step"
              style="width:100%"
            />
          </el-form-item>
          <template v-else-if="triggerFormOpt.type == 'array'">
            <el-form-item
              v-for="i in triggerFormOpt.arrayCount"
              :key="i"
              :prop="`values[${i-1}]`"
              :rules="[
                { required: true, message: '不能为空'},
                getValidator(triggerFormOpt.arrayType)
              ]"
            >
              <template v-if="['string','double'].includes(triggerFormOpt.arrayType)">
                <el-input
                  v-model="triggerFormData.values[i-1]"
                  clearable
                />
              </template>
              <template v-else>
                <el-input
                  v-model.number="triggerFormData.values[i-1]"
                  clearable
                />
              </template>
            </el-form-item>
          </template>
          <el-form-item
            v-else-if="triggerFormOpt.type == 'string'"
            prop="value"
            label-width="0"
            :rules="[
              // { required: true, message: '不能为空'},
              { max: triggerFormOpt.maxLength,required: true, message: `字符长度小于${triggerFormOpt.maxLength}`, trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="triggerFormData.value"
              :maxlength="triggerFormOpt.maxLength"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-else-if="triggerFormOpt.type == 'enums'"
            prop="value"

            label-width="0"
          >
            <el-select
              v-model="triggerFormData.value"
            >
              <el-option
                v-for="item in triggerFormOpt.enumList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="triggerService">触 发</el-button>
      </el-footer>
    </el-dialog>

    <div v-if="collectVisible">
      <FormTemplate :up="'功能管理'" :button-show="false" :state="undefined" :but-loading="butLoading" @submit="submit" @cancel="closeCollect">
        <template v-slot:main>
          <AttrCollect v-for="attrItem in attrList" :key="attrItem.id" is-function v-bind="attrItem" :device-attribute-id="deviceAttributeId" :device-id="deviceId" />
        </template>
      </FormTemplate>
    </div>

  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import FormTemplate from '@/components/Slots/FormTemplate'
import { getServiceByPage, createService, updateService, deleteService, executeService } from '@/api/porductMgr'
import { getDriverPointConfigByDeviceId } from '@/api/pointAttribute'
import AttrCollect from './components/AttrCollect.vue'
import { clone } from '@/utils'
const defaultDialogForm = {
  name: '',
  mark: '',
  async: '',
  remark: '',
  relationId: '',
  productServiceParamList: [],
  dataType: 'integer', // 数据类型 integer decimal array bool enums string
  specs: {
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
  arrayCount: '元素个数',
  maxLength: '最大长度'
}
// 每种类型对应的字段
const typeFields = {
  integer: ['max', 'min', 'step', 'unit'],
  decimal: ['max', 'min', 'step', 'unit'],
  array: ['arrayType', 'arrayCount'],
  bool: ['trueText', 'falseText'],
  enums: ['enumList'],
  string: ['maxLength']
}
const getValidator = (type) => {
  const validatorMap = {
    integer: { type: 'integer', message: '必须为整数', trigger: 'blur' },
    decimal: {
      validator(rule, value, callback) {
        return !isNaN(value)
      },
      message: '必须为数字', trigger: 'blur'
    },
    double: {
      validator(rule, value, callback) {
        console.log('value in validator', value)
        isNaN(value)
          ? callback(new Error(`${value} is not equal to 'test'.`))
          : callback()
      },
      message: '必须为数字', trigger: 'blur'
    },
    string: { type: 'number', message: '必须为字符串', trigger: 'blur' }
  }
  return validatorMap[type]
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
    FormTemplate,
    AttrCollect
  },
  props: {
    isDev: Boolean,
    device: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deviceId: this.device.id,
      collectVisible: false,
      attrList: [],
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
        { label: '枚举', value: 'enums' },
        { label: '数组', value: 'array' },
        { label: '字符串', value: 'string' }
      ],
      arrayTypeOptions: [
        { label: 'int (整数)', value: 'integer' },
        { label: 'double (小数)', value: 'double' },
        { label: 'string (字符串)', value: 'string' }
      ],
      dialogForm: clone(defaultDialogForm),
      rules: {
        name: [
          { required: true, message: '请输入功能名称', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '请输入标识符', trigger: 'blur' }
        ],
        async: [
          { required: true, message: '请选择调用方式', trigger: 'change' }
        ],
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        'specs.min': [
          { required: true, message: '请填写最小值', trigger: 'blur' }
        ],
        'specs.max': [
          { required: true, message: '请填写最大值', trigger: 'blur' }
        ],
        'specs.falseText': [
          { required: true, message: '请填写0值对应文本', trigger: 'blur' }
        ],
        'specs.trueText': [
          { required: true, message: '请填写1值对应文本', trigger: 'blur' }
        ],
        'specs.maxLength': [
          { required: true, message: '请填写最大长度', trigger: 'blur' }
        ],
        'specs.arrayCount': [
          { required: true, message: '请填写元素个数', trigger: 'blur' }
        ],
        'specs.arrayType': [
          { required: true, message: '请填写数组元素类型', trigger: 'change' }
        ]
      },
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      triggerFormOpt: {},
      triggerFormData: {
        value: '',
        values: []
      },
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
          type: 'slot',
          minWidth: 200
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
              type: 'slot',
              minWidth: 200
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
              width: 350,
              idName: 'id',
              buttons: [
                {
                  label: '触发',
                  event: 'trigger',
                  icon: 'list-trigger'
                },
                this.device.type == 3 ? {
                  label: '点位配置',
                  event: 'collect',
                  icon: 'list-edit'
                } : undefined,
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
    },
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
          const tableData = res.data.rows.map((item) => {
            const specs = item.specs
              ? Object.assign(clone(defaultDialogForm.specs), JSON.parse(item.specs))
              : clone(defaultDialogForm.specs)
            return {
              ...item,
              specs
            }
          })
          this.tableData = tableData
          console.log('tableData', tableData)

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
      this.dialogForm = clone(defaultDialogForm)
      this.$refs.dialogForm.resetFields()
    },
    detail(item) {
      this.edit(item.id)
    },
    /* 触发 */
    trigger(id) {
      this.serviceId = id
      const data = this.tableData.find((item) => {
        return item.id === id
      })
      if (!data || !data.specs) return
      this.triggerFormOpt = { ...data.specs, name: data.name, mark: data.mark }
      this.dialogVisible2 = true
    },
    triggerService() {
      this.$refs.triggerForm.validate(async(valid) => {
        executeService({ deviceId: this.$route.query.id, serviceId: this.serviceId, value: this.triggerFormData.value || this.triggerFormData.values }).then((res) => {
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
      })
    },
    resetTrigger() {
      this.triggerFormOpt = {}
      this.triggerFormData = {
        type: '',
        value: '',
        values: []
      }
    },
    edit(id) {
      const i = this.tableData.find((item) => {
        return item.id === id
      })
      if (!i) return
      this.dialogForm = clone(i)
      this.state = '编辑'
      this.dialogVisible = true
    },
    getValidator,
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
        if (valid) {
          this.butLoading = true
          const type = this.dialogForm.dataType
          const specs = {
            type
          }
          typeFields[type].forEach(filed => {
            specs[filed] = this.dialogForm.specs[filed]
          })
          const data = {
            ...this.dialogForm,
            dataType: type,
            relationId: this.$route.query.id || this.$route.query.prodId,
            prodId: this.$route.query.prodId,
            specs: JSON.stringify(specs)
          }
          if (this.state === '创建') {
            createService(data).then((res) => {
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
            updateService(data).then((res) => {
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
      console.log('this.dialogForm.specs-', this.dialogForm.specs)
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
.range{
  margin-bottom: 18px;
  display: flex;
  align-items: center;
}
.num-range{
  display: flex;
  gap:20px;
  justify-content: space-between;
  align-items: center;
}
.flex{
  display: flex;
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
  flex-wrap: wrap;
}
.specs-item{
  width: 50%;
  white-space: break-spaces;
}
.specs-item:not(:first-child){
  // margin-bottom: 14px;
}
.mx-6{
  margin:0 8px;
}
.trigger-body{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}
.trigger-name{
  margin-bottom: 20px;
  color: #36435c;
  border-bottom: 1px solid #ccd3db;
  border-radius: 4px 4px 0px 0px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 700;
}
</style>
