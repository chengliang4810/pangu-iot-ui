<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="应用名称" prop="applicationName">
            <el-input v-model="queryParams.applicationName" placeholder="请输入应用名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="显示名称" prop="host">
            <el-input v-model="queryParams.host" placeholder="请输入显示名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model="queryParams.port" placeholder="请输入端口号" clearable @keyup.enter="handleQuery" />
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:driverApplication:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:driverApplication:edit']">修改</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['manager:driverApplication:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:driverApplication:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="driverApplicationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="驱动ID" align="center" prop="driverId" />
        <el-table-column label="应用名称" align="center" prop="applicationName" />
        <el-table-column label="显示名称" align="center" prop="host" />
        <el-table-column label="端口号" align="center" prop="port" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <!-- <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:driverApplication:edit']"></el-button>
            </el-tooltip> -->
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['manager:driverApplication:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改驱动应用对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="driverApplicationFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="form.applicationName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="显示名称" prop="host">
          <el-input v-model="form.host" placeholder="请输入显示名称" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" />
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

<script setup name="DriverApplication" lang="ts">
import { listDriverApplication, getDriverApplication, delDriverApplication, addDriverApplication, updateDriverApplication } from '@/api/manager/driverApplication';
import { DriverApplicationVO, DriverApplicationQuery, DriverApplicationForm } from '@/api/manager/driverApplication/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const driverApplicationList = ref<DriverApplicationVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const driverApplicationFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DriverApplicationForm = {
  id: undefined,
  driverId: undefined,
  applicationName: undefined,
  host: undefined,
  port: undefined,
}
const data = reactive<PageData<DriverApplicationForm, DriverApplicationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    driverId: undefined,
    applicationName: undefined,
    host: undefined,
    port: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    driverId: [
      { required: true, message: "驱动ID不能为空", trigger: "change" }
    ],
    applicationName: [
      { required: true, message: "应用名称不能为空", trigger: "blur" }
    ],
    host: [
      { required: true, message: "显示名称不能为空", trigger: "blur" }
    ],
    port: [
      { required: true, message: "端口号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询驱动应用列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDriverApplication(queryParams.value);
  driverApplicationList.value = res.rows;
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
  driverApplicationFormRef.value.resetFields();
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
const handleSelectionChange = (selection: DriverApplicationVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加驱动应用";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DriverApplicationVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改驱动应用";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDriverApplication(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  driverApplicationFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDriverApplication(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDriverApplication(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DriverApplicationVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除驱动应用编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDriverApplication(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/driverApplication/export', {
    ...queryParams.value
  }, `driverApplication_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
