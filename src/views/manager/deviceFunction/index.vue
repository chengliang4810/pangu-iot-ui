<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="产品ID" prop="productId">
            <el-input v-model="queryParams.productId" placeholder="请输入产品ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="设备编号" prop="deviceId">
            <el-input v-model="queryParams.deviceId" placeholder="请输入设备编号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="驱动ID" prop="driverId">
            <el-select v-model="queryParams.driverId" placeholder="请选择驱动ID" clearable>
              <el-option v-for="dict in iot_device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备属性" prop="functionStatusAttribute">
            <el-input v-model="queryParams.functionStatusAttribute" placeholder="请输入设备属性" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="功能名称" prop="functionName">
            <el-input v-model="queryParams.functionName" placeholder="请输入功能名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="标识符" prop="identifier">
            <el-input v-model="queryParams.identifier" placeholder="请输入标识符" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="queryParams.dataType" placeholder="请选择数据类型" clearable>
              <el-option v-for="dict in iot_attribute_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="执行方式" prop="async">
            <el-select v-model="queryParams.async" placeholder="请选择执行方式" clearable>
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:deviceFunction:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:deviceFunction:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['manager:deviceFunction:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:deviceFunction:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceFunctionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="产品ID" align="center" prop="productId" />
        <el-table-column label="设备编号" align="center" prop="deviceId" />
        <el-table-column label="驱动ID" align="center" prop="driverId">
          <template #default="scope">
            <dict-tag :options="iot_device_type" :value="scope.row.driverId" />
          </template>
        </el-table-column>
        <el-table-column label="设备属性" align="center" prop="functionStatusAttribute" />
        <el-table-column label="功能名称" align="center" prop="functionName" />
        <el-table-column label="标识符" align="center" prop="identifier" />
        <el-table-column label="数据类型" align="center" prop="dataType">
          <template #default="scope">
            <dict-tag :options="iot_attribute_type" :value="scope.row.dataType" />
          </template>
        </el-table-column>
        <el-table-column label="执行方式" align="center" prop="async">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.async" />
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:deviceFunction:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
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

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备功能对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceFunctionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="驱动ID" prop="driverId">
          <el-select v-model="form.driverId" placeholder="请选择驱动ID">
            <el-option v-for="dict in iot_device_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
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
  </div>
</template>

<script setup name="DeviceFunction" lang="ts">
import { listDeviceFunction, getDeviceFunction, delDeviceFunction, addDeviceFunction, updateDeviceFunction } from '@/api/manager/deviceFunction';
import { DeviceFunctionVO, DeviceFunctionQuery, DeviceFunctionForm } from '@/api/manager/deviceFunction/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_attribute_type, sys_normal_disable, iot_device_type } = toRefs<any>(proxy?.useDict('iot_attribute_type', 'sys_normal_disable', 'iot_device_type'));

const deviceFunctionList = ref<DeviceFunctionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
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
    productId: undefined,
    deviceId: undefined,
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

/** 查询设备功能列表 */
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

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/deviceFunction/export', {
    ...queryParams.value
  }, `deviceFunction_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
