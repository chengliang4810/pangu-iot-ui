<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
            <el-form-item label="功能名称" prop="functionName">
              <el-input v-model="queryParams.functionName" placeholder="请输入功能名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="标识符" prop="identifier">
              <el-input v-model="queryParams.identifier" placeholder="请输入标识符" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-col class="top-right-btn" :span="1.5" v-if="props.add">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:deviceFunction:add']">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceAttributeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="false" />
        <el-table-column label="功能名称" align="center" prop="functionName" />
        <el-table-column label="标识符" align="center" prop="identifier" />
        <el-table-column label="数据类型" align="center" prop="dataType">
          <template #default="scope">
            <dict-tag :options="iot_attribute_type" :value="scope.row.dataType" />
          </template>
        </el-table-column>
        <el-table-column label="执行方式" align="center" prop="async">
          <template #default="scope">
            <div>
              <el-tag v-if="scope.row.async">异步</el-tag>
              <el-tag v-else>同步</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              v-if="deviceId != 0 && driverList.length > 0"
              link
              type="primary"
              icon="Edit"
              @click="handlePointConfig(scope.row)"
              v-hasPermi="['manager:deviceFunction:edit']"
              >采集配置
            </el-button>
            <el-tooltip v-if="props.edit" content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:deviceFunction:edit']"></el-button>
            </el-tooltip>
            <el-tooltip v-if="props.delete" content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['manager:deviceFunction:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > (queryParams.pageSize || 10)"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改设备属性对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="750px" append-to-body>
      <el-form ref="deviceFunctionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="驱动" prop="driverId" v-if="driverList.length > 1">
          <el-select v-model="form.driverId" placeholder="请选择驱动" style="width: 100%;" @change="driverChangeHandler">
            <el-option v-for="item in driverList" :key="item.id" :label="item.displayName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备属性" prop="functionStatusAttribute">
          <el-input v-model="form.functionStatusAttribute" placeholder="请输入设备属性" />
        </el-form-item>
        <el-form-item label="功能名称" prop="functionName">
          <el-input v-model="form.functionName" placeholder="请输入功能名称" />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入标识符" />
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-select v-model="form.dataType" placeholder="请选择数据类型">
            <el-option v-for="dict in iot_attribute_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型对象参数" prop="specs">
          <el-input v-model="form.specs" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="执行方式" prop="async">
          <el-select v-model="form.async" placeholder="请选择执行方式">
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="pointDialog.title" v-model="pointDialog.visible" width="500px" append-to-body>
      <el-form v-loading="pointDialog.loading" ref="pointFormRef" :model="pointForm" label-width="80px">
        <el-form-item
          v-for="(item, index) in pointAttributes"
          :label="item.displayName"
          :key="item.id"
          :prop="'pointAttributeConfig.'+ index +'.value'"
          :rules="{
            required: item.required != 0,
            message: item.displayName + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="pointForm.pointAttributeConfig[index].value" :placeholder="'请输入' + item.displayName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitPointForm">确 定</el-button>
          <el-button @click="pointConfigCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="functionMgr">

import { ElForm } from 'element-plus';
import { ComponentInternalInstance } from 'vue';
import { DriverVO } from '@/api/manager/driver/types'
import { DeviceFunctionVO, DeviceFunctionQuery, DeviceFunctionForm } from '@/api/manager/deviceFunction/types';

import { treeParentDeviceDriver,  } from '@/api/manager/driver';
import { listDeviceFunction, getDeviceFunction, delDeviceFunction, addDeviceFunction, updateDeviceFunction } from '@/api/manager/deviceFunction';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_attribute_type } = toRefs<any>(proxy?.useDict('iot_units', 'iot_attribute_type'));

export interface functionMgrProps {
  productId: string | number
  deviceId?: string | number
  add?: boolean
  edit?: boolean
  delete?: boolean,
}

const props = withDefaults(defineProps<functionMgrProps>(), {
  add: true,
  edit: true,
  delete: true,
  deviceId: 0,
})

const deviceFunctionList = ref<DeviceFunctionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const deviceFunctionFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const pointDialog = reactive<DialogOption>({
  visible: false,
  title: '',
  loading: false
});

const initFormData: DeviceFunctionForm = {
  id: undefined,
  productId: undefined,
  deviceId: undefined,
  driverId: undefined,
  functionStatusAttribute: undefined,
  functionName: undefined,
  identifier: undefined,
  dataType: undefined,
  specs: undefined,
  async: undefined,
  remark: undefined
}
const data = reactive<PageData<DeviceFunctionForm, DeviceFunctionQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: props.deviceId,
    productId: props.productId,
    driverId: undefined,
    functionStatusAttribute: undefined,
    functionName: undefined,
    identifier: undefined,
    dataType: undefined,
    async: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "产品ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备编号不能为空", trigger: "blur" }
    ],
    driverId: [
      { required: true, message: "驱动ID不能为空", trigger: "change" }
    ],
    functionStatusAttribute: [
      { required: true, message: "设备属性不能为空", trigger: "blur" }
    ],
    functionName: [
      { required: true, message: "功能名称不能为空", trigger: "blur" }
    ],
    identifier: [
      { required: true, message: "标识符不能为空", trigger: "blur" }
    ],
    dataType: [
      { required: true, message: "数据类型不能为空", trigger: "change" }
    ],
    specs: [
      { required: true, message: "数据类型对象参数不能为空", trigger: "blur" }
    ],
    async: [
      { required: true, message: "执行方式不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备属性列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeviceFunction(queryParams.value);
  deviceFunctionList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  deviceFunctionFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: DeviceFunctionVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加设备功能";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DeviceFunctionVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改设备功能";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDeviceFunction(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  deviceFunctionFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDeviceFunction(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDeviceFunction(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceFunctionVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备功能编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDeviceFunction(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

const driverList = ref<DriverVO[]>([]);
const getParendDeviceDriver = async () => {
  if (props.deviceId == 0 || props.deviceId == undefined) return;
  const res = await treeParentDeviceDriver(props.deviceId);
  driverList.value = res.data;
}

onMounted(async () => {
  loading.value = true;
  await getList();
  await getParendDeviceDriver();
  loading.value = false;
});
</script>
