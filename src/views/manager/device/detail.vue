<template>
  <div class="p-2" v-if="checkDone">
    <!-- 设备基础信息 -->
    <el-card shadow="never">
      <template #header>
        <el-descriptions :title="device.name" border>
          <el-descriptions-item label="设备编号">{{ device.code }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">
            <template v-for="dict in iot_device_type" :key="dict.value">
              <el-tag size="small" v-if="dict.value == device.deviceType">{{ dict.label }}</el-tag>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="所属产品">{{getProduct(device.productId)?.name}}</el-descriptions-item>
          <el-descriptions-item label="设备地址">
            {{ device.address || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="坐标">
            {{ device.position || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small" v-if=" device.status == 1">启用</el-tag>
            <el-tag size="small" type="error" v-else>禁用</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注"> {{ device.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane v-if="device.deviceType !== 2" name="attribute">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">属性</div>
          </template>
        </el-tab-pane>
        <el-tab-pane v-if="device.deviceType !== 2" name="attributeMgr">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">属性管理</div>
          </template>
          <attributeMgr :productId="device.productId" :deviceId="device.id" :add="false" :edit="false" :delete="false"></attributeMgr>
        </el-tab-pane>
        <el-tab-pane v-if="device.deviceType !== 2" label="功能管理" name="function"
          ><template v-slot:label>
            <div style="width: 100px; text-align: center;">功能管理</div>
          </template></el-tab-pane
        >
        <!-- <el-tab-pane v-if="device.deviceType !== 2" label="告警规则" name="alarm">Task</el-tab-pane> -->
        <el-tab-pane label="日志" v-if="device.deviceType !== 2" name="log"
          ><template v-slot:label>
            <div style="width: 100px; text-align: center;">日志</div>
          </template></el-tab-pane
        >
        <el-tab-pane label="标签管理" v-if="device.deviceType !== 2" name="tagMgr"
          ><template v-slot:label>
            <div style="width: 100px; text-align: center;">标签管理</div>
          </template></el-tab-pane
        >
        <el-tab-pane label="驱动配置" v-if="device.deviceType === 2" name="driverConfig"
          ><template v-slot:label>
            <div style="width: 100px; text-align: center;">驱动配置</div>
          </template></el-tab-pane
        >
        <el-tab-pane label="子设备" v-if="device.deviceType === 2" name="childDevice"
          ><template v-slot:label>
            <div style="width: 100px; text-align: center;">子设备</div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="Device" lang="ts">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/manager/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/manager/device/types';
import { treeProduct } from '@/api/manager/product';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';
import router from '@/router';
import attributeMgr from '@/views/manager/device/components/attributeMgr.vue';

const route = useRoute();

/**
 * 检查设备是否存在
 */
const device = ref<DeviceVO>({} as DeviceVO);
const checkDone = ref(false);
const checkDevice = async () => {
  const deviceId = route.params.id as string;
  if (!deviceId) {
    router.push({ path: '/404' });
    return
  }
  const res = await getDevice(deviceId);
  if (!res.data) {
    router.push({ path: '/404' });
    return;
  }else{
    device.value = res.data;
    checkDone.value = true;
  }
}
checkDevice();


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
const activeName = ref('attribute')

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
  rules: {
    id: [
      { required: true, message: "设备主键不能为空", trigger: "blur" }
    ],
    groupId: [
      { required: true, message: "设备分组ID不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "产品ID不能为空", trigger: "change" }
    ],
    code: [
      { required: true, message: "设备编号不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "启用状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

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
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deviceFormRef.value.resetFields();
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

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加设备";

  nextTick(() => {
    reset();
    // 根据查询条件选择产品
    form.value.productId = queryParams.value.productId || form.value.productId
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DeviceVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改设备";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDevice(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  deviceFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDevice(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addDevice(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDevice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getTree();
  getList();
});
</script>
