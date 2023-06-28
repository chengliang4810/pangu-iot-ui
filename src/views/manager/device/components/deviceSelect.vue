<template>
  <div class="p-2">
    <el-dialog
      :title="props.title"
      :model-value="props.modelValue"
      @update:model-value="(val:boolean) => emits('update:modelValue',val)"
      :width="props.width"
      append-to-body
    >
      <el-card shadow="never">
        <template #header>
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="产品" prop="productId">
                  <el-select v-model="queryParams.productId" placeholder="请选择产品" style="width: 100%;" clearable @change="handleQuery">
                    <el-option v-for="item in productTree" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="deviceType">
                  <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" style="width: 100%;" clearable @change="handleQuery">
                    <el-option v-for="dict in iot_device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 100%;" clearable @change="handleQuery">
                    <el-option v-for="dict in iot_enable_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备编号" prop="code">
                  <el-input v-model="queryParams.code" placeholder="请输入设备编号" clearable @keyup.enter="handleQuery" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable @keyup.enter="handleQuery" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>

        <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" :selectable="selectableHandle" />
          <el-table-column label="设备主键" align="center" prop="id" v-if="false" />
          <el-table-column label="设备名称" align="center" prop="name">
            <template #default="scope">
              <el-button type="primary" @click="detailHandler(scope.row)" link>{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="设备编号" align="center" prop="code" />
          <el-table-column label="产品" align="center" prop="productId">
            <template #default="scope">
              <span>{{ getProduct(scope.row.productId)?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备类型" prop="deviceType">
            <template #default=" scope ">
              <dict-tag :options="iot_device_type" :value="scope.row.deviceType" />
            </template>
          </el-table-column>
          <el-table-column label="启用状态" align="center" prop="status">
            <template #default=" scope ">
              <dict-tag :options=" iot_enable_status " :value=" scope.row.status " />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" min-width="100px" />
        </el-table>

        <pagination
          v-show=" total > queryParams.pageSize"
          :total=" total "
          v-model:page=" queryParams.pageNum "
          v-model:limit=" queryParams.pageSize "
          @pagination=" getList "
        />
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="multiple" :loading=" buttonLoading " type="primary" @click="submitForm">确 定</el-button>
          <el-button @click=" cancel ">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DeviceSelect" lang="ts">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/manager/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/manager/device/types';
import { treeProduct } from '@/api/manager/product';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

import router from '@/router';

const emits = defineEmits<{
  (e:'update:modelValue', payload: boolean): void
  (e:'submit', payload: Array<string | number>): void
}>();

type DeviceSelectProps = {
  modelValue: boolean,
  title?: string,
  width?: string | number,
  submit?: (ids: Array<string | number>) => void
}
const props = withDefaults(defineProps<DeviceSelectProps>(),{
  modelValue: false,
  title: '选择设备',
  width: '500px'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_enable_status } = toRefs<any>(proxy?.useDict('iot_enable_status'));
const { iot_device_type } = toRefs<any>(proxy?.useDict('iot_device_type'));

const productTree = ref<ProductVO[]>([]);
const deviceList = ref<DeviceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const daterangeCreateTime = ref([]);

const queryFormRef = ref(ElForm);
const deviceFormRef = ref(ElForm);

const selectableHandle = (row: DeviceVO) => {
  return row.deviceType != 2;
}

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceForm = {
  id: undefined,
  groupId: 0,
  productId: undefined,
  code: undefined,
  name: undefined,
  address: undefined,
  position: undefined,
  status: 1,
  remark: undefined
}
const data = reactive<PageData<DeviceForm, DeviceQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    groupId: undefined,
    productId: undefined,
    code: undefined,
    name: undefined,
    status: undefined,
    createTime: undefined,
  },
  rules: {}
});

const { queryParams, form } = toRefs(data);

/** 查询设备列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  const res = await listDevice(queryParams.value);
  deviceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询产品树 */
const getTree = async () => {
  const res = await treeProduct();
  productTree.value = res.data;
}

/** 通过产品ID 查找产品信息 */
const getProduct = (productId: number) => {
  return productTree.value.find(item => item.id == productId);
}

/**
 * 切换到设备详情页面
 */
const detailHandler = (row: DeviceVO) => {
  router.push({ path: `/device/detail/${row.id}`, query: {} });
}
/** 取消按钮 */
const cancel = () => {
  reset();
  emits('update:modelValue',false)
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  // deviceFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  daterangeCreateTime.value = [];
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: DeviceVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const submitForm = () => {
  emits('submit', ids.value);
}

onMounted(() => {
  getTree();
  getList();
});
</script>
