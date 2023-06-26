<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="产品分组ID" prop="groupId">
            <el-input v-model="queryParams.groupId" placeholder="请输入产品分组ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="驱动ID" prop="driverId">
            <el-input v-model="queryParams.driverId" placeholder="请输入驱动ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择产品类型" clearable>
              <el-option
                v-for="dict in iot_device_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="queryParams.icon" placeholder="请输入图标" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="厂家" prop="manufacturer">
            <el-input v-model="queryParams.manufacturer" placeholder="请输入厂家" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input v-model="queryParams.model" placeholder="请输入型号" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:product:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:product:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['manager:product:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:product:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="产品主键" align="center" prop="id" v-if="true" />
        <el-table-column label="产品分组ID" align="center" prop="groupId" />
        <el-table-column label="驱动ID" align="center" prop="driverId" />
        <el-table-column label="产品名称" align="center" prop="name" />
        <el-table-column label="产品类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="iot_device_type" :value="scope.row.type"/>
          </template>
        </el-table-column>
        <el-table-column label="图标" align="center" prop="icon" />
        <el-table-column label="厂家" align="center" prop="manufacturer" />
        <el-table-column label="型号" align="center" prop="model" />
        <el-table-column label="设备总数" align="center" prop="deviceCount" />
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:product:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manager:product:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="productFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品分组ID" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入产品分组ID" />
        </el-form-item>
        <el-form-item label="驱动ID" prop="driverId">
          <el-input v-model="form.driverId" placeholder="请输入驱动ID" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择产品类型">
            <el-option
                v-for="dict in iot_device_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入厂家" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
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

<script setup name="Product" lang="ts">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from '@/api/manager/product';
import { ProductVO, ProductQuery, ProductForm } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_device_type } = toRefs<any>(proxy?.useDict('iot_device_type'));

const productList = ref<ProductVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const productFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ProductForm = {
  id: undefined,
  groupId: undefined,
  driverId: undefined,
  name: undefined,
  type: undefined,
  icon: undefined,
  manufacturer: undefined,
  model: undefined,
  remark: undefined
}
const data = reactive<PageData<ProductForm, ProductQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    groupId: undefined,
    driverId: undefined,
    name: undefined,
    type: undefined,
    icon: undefined,
    manufacturer: undefined,
    model: undefined,
  },
  rules: {
    id: [
      { required: true, message: "产品主键不能为空", trigger: "blur" }
    ],
    groupId: [
      { required: true, message: "产品分组ID不能为空", trigger: "blur" }
    ],
    driverId: [
      { required: true, message: "驱动ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "产品类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询产品列表 */
const getList = async () => {
  loading.value = true;
  const res = await listProduct(queryParams.value);
  productList.value = res.rows;
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
  productFormRef.value.resetFields();
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
const handleSelectionChange = (selection: ProductVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加产品";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: ProductVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改产品";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getProduct(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  productFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateProduct(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addProduct(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ProductVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除产品编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delProduct(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
