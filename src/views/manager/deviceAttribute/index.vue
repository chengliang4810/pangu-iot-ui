<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="属性名称" prop="attributeName">
            <el-input v-model="queryParams.attributeName" placeholder="请输入属性名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="标识符" prop="identifier">
            <el-input v-model="queryParams.identifier" placeholder="请输入标识符" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:deviceAttribute:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:deviceAttribute:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['manager:deviceAttribute:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:deviceAttribute:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceAttributeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="属性名称" align="center" prop="attributeName" />
        <el-table-column label="标识符" align="center" prop="identifier" />
        <el-table-column label="属性类型" align="center" prop="attributeType">
          <template #default="scope">
            <dict-tag :options="iot_attribute_type" :value="scope.row.attributeType" />
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unit">
          <template #default="scope">
            <dict-tag :options="iot_units" :value="scope.row.unit" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:deviceAttribute:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['manager:deviceAttribute:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备属性对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceAttributeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="属性名称" prop="attributeName">
          <el-input v-model="form.attributeName" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入标识符" />
        </el-form-item>
        <el-form-item label="属性类型" prop="attributeType">
          <el-select v-model="form.attributeType" placeholder="请选择属性类型">
            <el-option v-for="dict in iot_attribute_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位">
            <el-option v-for="dict in iot_units" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据预处理代码" prop="pretreatmentScript">
          <el-input v-model="form.pretreatmentScript" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="值映射ID" prop="valueMapId">
          <el-select v-model="form.valueMapId" placeholder="请选择值映射ID">
            <el-option v-for="dict in iot_units" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
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

<script setup name="DeviceAttribute" lang="ts">
import { listDeviceAttribute, getDeviceAttribute, delDeviceAttribute, addDeviceAttribute, updateDeviceAttribute } from '@/api/manager/deviceAttribute';
import { DeviceAttributeVO, DeviceAttributeQuery, DeviceAttributeForm } from '@/api/manager/deviceAttribute/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_units, iot_attribute_type } = toRefs<any>(proxy?.useDict('iot_units', 'iot_attribute_type'));

const deviceAttributeList = ref<DeviceAttributeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const deviceAttributeFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceAttributeForm = {
  id: undefined,
  productId: undefined,
  deviceId: undefined,
  attributeName: undefined,
  identifier: undefined,
  attributeType: undefined,
  unit: undefined,
  pretreatmentScript: undefined,
  valueMapId: undefined,
  remark: undefined
}
const data = reactive<PageData<DeviceAttributeForm, DeviceAttributeQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    attributeName: undefined,
    identifier: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    attributeName: [
      { required: true, message: "属性名称不能为空", trigger: "blur" }
    ],
    identifier: [
      { required: true, message: "标识符不能为空", trigger: "blur" }
    ],
    attributeType: [
      { required: true, message: "属性类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备属性列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeviceAttribute(queryParams.value);
  deviceAttributeList.value = res.rows;
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
  deviceAttributeFormRef.value.resetFields();
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
const handleSelectionChange = (selection: DeviceAttributeVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加设备属性";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DeviceAttributeVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改设备属性";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDeviceAttribute(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  deviceAttributeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDeviceAttribute(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDeviceAttribute(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceAttributeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备属性编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDeviceAttribute(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/deviceAttribute/export', {
    ...queryParams.value
  }, `deviceAttribute_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
