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
          <attributeMgr
            :productId="device.productId"
            :driver-id="getProduct(device.productId)?.driverId"
            :deviceId="device.id"
            :add="false"
            :edit="false"
            :delete="false"
          ></attributeMgr>
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
        <el-tab-pane label="标签管理" v-if="device.deviceType !== 2" name="tagMgr">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">标签管理</div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="驱动配置" v-if="device.deviceType === 2" name="driverConfig">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">驱动配置</div>
          </template>
          <DriverAttributeConfig :productId="device.productId" :deviceId="device.id"></DriverAttributeConfig>
        </el-tab-pane>
        <el-tab-pane label="子设备" v-if="device.deviceType === 2" name="childDevice">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">子设备</div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="Device" lang="ts">
import { listDevice, getDevice } from '@/api/manager/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/manager/device/types';
import DriverAttributeConfig from '@/views/manager/driver/components/driverAttributeConfig.vue';
import { treeProduct } from '@/api/manager/product';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
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
    device.value.deviceType === 2 ? activeName.value = 'driverConfig' : activeName.value = 'attribute';
    checkDone.value = true;
  }
}
checkDevice();


const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_device_type } = toRefs<any>(proxy?.useDict('iot_device_type'));

const productTree = ref<ProductVO[]>([]);
const deviceList = ref<DeviceVO[]>([]);
const loading = ref(true);
const total = ref(0);
const daterangeCreateTime = ref([]);

const activeName = ref('attribute')

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
  if (null != daterangeCreateTime) {
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
const getProduct = (productId: number | string) => {
  return productTree.value.find(item => item.id == productId);
}


onMounted(() => {
  getTree();
  getList();
});
</script>
