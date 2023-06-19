<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="驱动编号" prop="code">
            <el-input v-model="queryParams.code" placeholder="请输入驱动编号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="显示名称" prop="displayName">
            <el-input v-model="queryParams.displayName" placeholder="请输入显示名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <!-- <el-form-item label="启用" prop="enable">
            <el-input v-model="queryParams.enable" placeholder="请输入启用" clearable @keyup.enter="handleQuery" />
          </el-form-item> -->
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:driver:add']">新增</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:driver:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['manager:driver:remove']"
              >删除</el-button
            >
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:driver:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="driverList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="驱动编号" align="center" prop="code" />
        <el-table-column label="显示名称" align="center" prop="displayName" />
        <el-table-column label="在线服务数量" align="center" prop="serverNumber" />
        <el-table-column label="状态" align="center" prop="enable">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.enable == 1">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="remark" />
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:driver:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manager:driver:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改驱动对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="driverFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="驱动编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入驱动编号" />
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="form.displayName" placeholder="请输入显示名称" />
        </el-form-item>
        <el-form-item label="启用" prop="enable">
          <el-radio-group v-model="form.enable" class="ml-4">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入描述" />
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

<script setup name="Driver" lang="ts">
import { listDriver, getDriver, delDriver, addDriver, updateDriver } from '@/api/manager/driver';
import { DriverVO, DriverQuery, DriverForm } from '@/api/manager/driver/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const driverList = ref<DriverVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const driverFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DriverForm = {
  id: undefined,
  code: undefined,
  displayName: undefined,
  enable: 1,
  remark: undefined,
}
const data = reactive<PageData<DriverForm, DriverQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    code: undefined,
    displayName: undefined,
    enable: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "驱动编号不能为空", trigger: "blur" }
    ],
    displayName: [
      { required: true, message: "显示名称不能为空", trigger: "blur" }
    ],
    enable: [
      { required: true, message: "启用不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询驱动列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDriver(queryParams.value);
  driverList.value = res.rows;
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
  driverFormRef.value.resetFields();
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
const handleSelectionChange = (selection: DriverVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加驱动";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DriverVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改驱动";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDriver(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  driverFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDriver(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDriver(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DriverVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除驱动编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDriver(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/driver/export', {
    ...queryParams.value
  }, `driver_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
